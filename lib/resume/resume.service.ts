import { cache } from "react";
import type { Database } from "@/lib/supabase/database.types";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { duplicateResumeSections } from "@/lib/resume/section.service";

type ResumeRow = Database["public"]["Tables"]["resumes"]["Row"];

export const listResumes = cache(async (): Promise<ResumeRow[]> => {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("resumes")
    .select("*")
    .order("updated_at", { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  return data ?? [];
});

export const getResumeById = cache(async (resumeId: string): Promise<ResumeRow | null> => {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase.from("resumes").select("*").eq("id", resumeId).single();

  if (error) {
    return null;
  }

  return data;
});

export const getPublishedResumeBySlug = cache(async (slug: string): Promise<ResumeRow | null> => {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("resumes")
    .select("*")
    .eq("slug", slug)
    .eq("is_published", true)
    .single();

  if (error) {
    return null;
  }

  return data;
});

export function slugifyResumeTitle(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function createResumeSlug(title: string, resumeId: string): string {
  const baseSlug = slugifyResumeTitle(title) || "resume";
  return `${baseSlug}-${resumeId.slice(0, 8)}`;
}

export async function createResume(input: {
  title: string;
  summary: string;
  targetRole: string;
  templateName: string;
  accentColor: string;
  isDefault: boolean;
  profileId?: string | null;
  fontFamily?: string;
  slug?: string | null;
  isPublished?: boolean;
}) {
  const supabase = await createSupabaseServerClient();
  const { data: userData } = await supabase.auth.getUser();

  if (!userData.user) {
    throw new Error("You must be signed in to create a resume.");
  }

  const { data, error } = await supabase
    .from("resumes")
    .insert({
      user_id: userData.user.id,
      profile_id: input.profileId ?? null,
      title: input.title,
      slug: input.slug ?? null,
      summary: input.summary || null,
      target_role: input.targetRole || null,
      template_name: input.templateName,
      accent_color: input.accentColor,
      font_family: input.fontFamily ?? "Manrope",
      is_default: input.isDefault,
      is_published: input.isPublished ?? false,
    })
    .select("*")
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

export async function duplicateResume(resumeId: string) {
  const source = await getResumeById(resumeId);

  if (!source) {
    throw new Error("Resume not found.");
  }

  const duplicatedResume = await createResume({
    title: `Copy of ${source.title}`,
    summary: source.summary ?? "",
    targetRole: source.target_role ?? "",
    templateName: source.template_name,
    accentColor: source.accent_color,
    isDefault: false,
    profileId: source.profile_id,
    fontFamily: source.font_family,
  });

  await duplicateResumeSections(source.id, duplicatedResume.id);

  return duplicatedResume;
}

export async function updateResume(resumeId: string, input: {
  title: string;
  summary: string;
  targetRole: string;
  templateName: string;
  accentColor: string;
  isDefault: boolean;
}) {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("resumes")
    .update({
      title: input.title,
      summary: input.summary || null,
      target_role: input.targetRole || null,
      template_name: input.templateName,
      accent_color: input.accentColor,
      is_default: input.isDefault,
    })
    .eq("id", resumeId)
    .select("*")
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

export async function updateResumePublishState(resumeId: string, input: { isPublished: boolean; slug?: string | null }) {
  const supabase = await createSupabaseServerClient();
  const payload: { is_published: boolean; slug?: string | null } = {
    is_published: input.isPublished,
  };

  if (typeof input.slug !== "undefined") {
    payload.slug = input.slug;
  }

  const { error } = await supabase.from("resumes").update(payload).eq("id", resumeId);

  if (error) {
    throw new Error(error.message);
  }
}

export async function deleteResume(resumeId: string) {
  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.from("resumes").delete().eq("id", resumeId);

  if (error) {
    throw new Error(error.message);
  }
}