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

  return (data ?? []).map(normalizeResumeRow);
});

export const getResumeById = cache(async (resumeId: string): Promise<ResumeRow | null> => {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase.from("resumes").select("*").eq("id", resumeId).single();

  if (error) {
    return null;
  }

  return normalizeResumeRow(data);
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

  return normalizeResumeRow(data);
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

function normalizeResumeRow(row: ResumeRow): ResumeRow {
  return {
    ...row,
    summary: row.summary ?? "",
    target_role: row.target_role ?? "",
    accent_color: row.accent_color ?? "#2563eb",
    font_family: row.font_family ?? "Manrope",
    template_name: row.template_name ?? "modern-ats",
  } as ResumeRow;
}

function isSchemaFallbackError(error: { message: string }) {
  return /accent_color|template_name|font_family|is_default/i.test(error.message);
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

  const baseInsert = {
    user_id: userData.user.id,
    profile_id: input.profileId ?? null,
    title: input.title,
    slug: input.slug ?? null,
    summary: input.summary || null,
    target_role: input.targetRole || null,
    is_default: input.isDefault,
    is_published: input.isPublished ?? false,
  };

  const fullInsert = {
    ...baseInsert,
    template_name: input.templateName,
    accent_color: input.accentColor,
    font_family: input.fontFamily ?? "Manrope",
  };

  const { data, error } = await supabase.from("resumes").insert(fullInsert).select("*").single();

  if (error) {
    if (isSchemaFallbackError(error)) {
      const fallbackInsert = {
        user_id: userData.user.id,
        title: input.title,
      };
      const fallback = await supabase.from("resumes").insert(fallbackInsert).select("*").single();

      if (fallback.error) {
        throw new Error(fallback.error.message);
      }

      return normalizeResumeRow(fallback.data);
    }

    throw new Error(error.message);
  }

  return normalizeResumeRow(data);
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
  const fullUpdate = {
    title: input.title,
    summary: input.summary || null,
    target_role: input.targetRole || null,
    template_name: input.templateName,
    accent_color: input.accentColor,
    is_default: input.isDefault,
  };

  const { data, error } = await supabase.from("resumes").update(fullUpdate).eq("id", resumeId).select("*").single();

  if (error) {
    if (isSchemaFallbackError(error)) {
      const fallbackUpdate = {
        title: input.title,
      };
      const fallback = await supabase
        .from("resumes")
        .update(fallbackUpdate)
        .eq("id", resumeId)
        .select("*")
        .single();

      if (fallback.error) {
        throw new Error(fallback.error.message);
      }

      return normalizeResumeRow(fallback.data);
    }

    throw new Error(error.message);
  }

  return normalizeResumeRow(data);
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