import { cache } from "react";
import type { Database, Json } from "@/lib/supabase/database.types";
import { createSupabaseServerClient } from "@/lib/supabase/server";

type EducationRow = Database["public"]["Tables"]["education"]["Row"];
type ExperienceRow = Database["public"]["Tables"]["experiences"]["Row"];
type SkillRow = Database["public"]["Tables"]["skills"]["Row"];
type ProjectRow = Database["public"]["Tables"]["projects"]["Row"];

export type ResumeSectionData = {
  education: EducationRow[];
  experiences: ExperienceRow[];
  skills: SkillRow[];
  projects: ProjectRow[];
};

export const getResumeSectionData = cache(async (resumeId: string): Promise<ResumeSectionData> => {
  const supabase = await createSupabaseServerClient();

  const [education, experiences, skills, projects] = await Promise.all([
    supabase.from("education").select("*").eq("resume_id", resumeId).order("sort_order", { ascending: true }),
    supabase.from("experiences").select("*").eq("resume_id", resumeId).order("sort_order", { ascending: true }),
    supabase.from("skills").select("*").eq("resume_id", resumeId).order("sort_order", { ascending: true }),
    supabase.from("projects").select("*").eq("resume_id", resumeId).order("sort_order", { ascending: true }),
  ]);

  if (education.error) throw new Error(education.error.message);
  if (experiences.error) throw new Error(experiences.error.message);
  if (skills.error) throw new Error(skills.error.message);
  if (projects.error) throw new Error(projects.error.message);

  return {
    education: education.data ?? [],
    experiences: experiences.data ?? [],
    skills: skills.data ?? [],
    projects: projects.data ?? [],
  };
});

export async function duplicateResumeSections(sourceResumeId: string, destinationResumeId: string) {
  const supabase = await createSupabaseServerClient();
  const userId = await getCurrentUserId();
  const sections = await getResumeSectionData(sourceResumeId);

  if (sections.education.length > 0) {
    const { error } = await supabase.from("education").insert(
      sections.education.map((item) => ({
        user_id: userId,
        resume_id: destinationResumeId,
        school_name: item.school_name,
        degree: item.degree,
        field_of_study: item.field_of_study,
        start_date: item.start_date,
        end_date: item.end_date,
        is_current: item.is_current,
        location: item.location,
        description: item.description,
        sort_order: item.sort_order,
      })),
    );

    if (error) throw new Error(error.message);
  }

  if (sections.experiences.length > 0) {
    const { error } = await supabase.from("experiences").insert(
      sections.experiences.map((item) => ({
        user_id: userId,
        resume_id: destinationResumeId,
        company_name: item.company_name,
        job_title: item.job_title,
        employment_type: item.employment_type,
        location: item.location,
        start_date: item.start_date,
        end_date: item.end_date,
        is_current: item.is_current,
        description: item.description,
        achievements: item.achievements,
        sort_order: item.sort_order,
      })),
    );

    if (error) throw new Error(error.message);
  }

  if (sections.skills.length > 0) {
    const { error } = await supabase.from("skills").insert(
      sections.skills.map((item) => ({
        user_id: userId,
        resume_id: destinationResumeId,
        name: item.name,
        category: item.category,
        proficiency: item.proficiency,
        sort_order: item.sort_order,
      })),
    );

    if (error) throw new Error(error.message);
  }

  if (sections.projects.length > 0) {
    const { error } = await supabase.from("projects").insert(
      sections.projects.map((item) => ({
        user_id: userId,
        resume_id: destinationResumeId,
        name: item.name,
        description: item.description,
        url: item.url,
        github_url: item.github_url,
        tech_stack: item.tech_stack,
        start_date: item.start_date,
        end_date: item.end_date,
        sort_order: item.sort_order,
      })),
    );

    if (error) throw new Error(error.message);
  }
}

async function getCurrentUserId(): Promise<string> {
  const supabase = await createSupabaseServerClient();
  const { data } = await supabase.auth.getUser();

  if (!data.user) {
    throw new Error("You must be signed in.");
  }

  return data.user.id;
}

function toNullableString(value: string): string | null {
  return value.trim() === "" ? null : value;
}

function parseJsonArray(value: string): Json[] {
  return value
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
}

export async function createEducationEntry(input: {
  resumeId: string;
  schoolName: string;
  degree: string;
  fieldOfStudy: string;
  startDate: string;
  endDate: string;
  isCurrent: boolean;
  location: string;
  description: string;
  sortOrder: number;
}) {
  const supabase = await createSupabaseServerClient();
  const userId = await getCurrentUserId();

  const { error } = await supabase.from("education").insert({
    user_id: userId,
    resume_id: input.resumeId,
    school_name: input.schoolName,
    degree: toNullableString(input.degree),
    field_of_study: toNullableString(input.fieldOfStudy),
    start_date: toNullableString(input.startDate),
    end_date: toNullableString(input.endDate),
    is_current: input.isCurrent,
    location: toNullableString(input.location),
    description: toNullableString(input.description),
    sort_order: input.sortOrder,
  });

  if (error) throw new Error(error.message);
}

export async function updateEducationEntry(input: {
  id: string;
  resumeId: string;
  schoolName: string;
  degree: string;
  fieldOfStudy: string;
  startDate: string;
  endDate: string;
  isCurrent: boolean;
  location: string;
  description: string;
  sortOrder: number;
}) {
  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.from("education").update({
    school_name: input.schoolName,
    degree: toNullableString(input.degree),
    field_of_study: toNullableString(input.fieldOfStudy),
    start_date: toNullableString(input.startDate),
    end_date: toNullableString(input.endDate),
    is_current: input.isCurrent,
    location: toNullableString(input.location),
    description: toNullableString(input.description),
    sort_order: input.sortOrder,
  }).eq("id", input.id).eq("resume_id", input.resumeId);

  if (error) throw new Error(error.message);
}

export async function deleteEducationEntry(id: string) {
  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.from("education").delete().eq("id", id);
  if (error) throw new Error(error.message);
}

export async function createExperienceEntry(input: {
  resumeId: string;
  companyName: string;
  jobTitle: string;
  employmentType: string;
  location: string;
  startDate: string;
  endDate: string;
  isCurrent: boolean;
  description: string;
  achievementsText: string;
  sortOrder: number;
}) {
  const supabase = await createSupabaseServerClient();
  const userId = await getCurrentUserId();

  const { error } = await supabase.from("experiences").insert({
    user_id: userId,
    resume_id: input.resumeId,
    company_name: input.companyName,
    job_title: input.jobTitle,
    employment_type: toNullableString(input.employmentType),
    location: toNullableString(input.location),
    start_date: toNullableString(input.startDate),
    end_date: toNullableString(input.endDate),
    is_current: input.isCurrent,
    description: toNullableString(input.description),
    achievements: parseJsonArray(input.achievementsText),
    sort_order: input.sortOrder,
  });

  if (error) throw new Error(error.message);
}

export async function updateExperienceEntry(input: {
  id: string;
  resumeId: string;
  companyName: string;
  jobTitle: string;
  employmentType: string;
  location: string;
  startDate: string;
  endDate: string;
  isCurrent: boolean;
  description: string;
  achievementsText: string;
  sortOrder: number;
}) {
  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.from("experiences").update({
    company_name: input.companyName,
    job_title: input.jobTitle,
    employment_type: toNullableString(input.employmentType),
    location: toNullableString(input.location),
    start_date: toNullableString(input.startDate),
    end_date: toNullableString(input.endDate),
    is_current: input.isCurrent,
    description: toNullableString(input.description),
    achievements: parseJsonArray(input.achievementsText),
    sort_order: input.sortOrder,
  }).eq("id", input.id).eq("resume_id", input.resumeId);

  if (error) throw new Error(error.message);
}

export async function deleteExperienceEntry(id: string) {
  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.from("experiences").delete().eq("id", id);
  if (error) throw new Error(error.message);
}

export async function createSkillEntry(input: {
  resumeId: string;
  name: string;
  category: string;
  proficiency: number;
  sortOrder: number;
}) {
  const supabase = await createSupabaseServerClient();
  const userId = await getCurrentUserId();

  const { error } = await supabase.from("skills").insert({
    user_id: userId,
    resume_id: input.resumeId,
    name: input.name,
    category: toNullableString(input.category),
    proficiency: input.proficiency,
    sort_order: input.sortOrder,
  });

  if (error) throw new Error(error.message);
}

export async function updateSkillEntry(input: {
  id: string;
  resumeId: string;
  name: string;
  category: string;
  proficiency: number;
  sortOrder: number;
}) {
  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.from("skills").update({
    name: input.name,
    category: toNullableString(input.category),
    proficiency: input.proficiency,
    sort_order: input.sortOrder,
  }).eq("id", input.id).eq("resume_id", input.resumeId);

  if (error) throw new Error(error.message);
}

export async function deleteSkillEntry(id: string) {
  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.from("skills").delete().eq("id", id);
  if (error) throw new Error(error.message);
}

export async function createProjectEntry(input: {
  resumeId: string;
  name: string;
  description: string;
  url: string;
  githubUrl: string;
  techStackText: string;
  startDate: string;
  endDate: string;
  sortOrder: number;
}) {
  const supabase = await createSupabaseServerClient();
  const userId = await getCurrentUserId();

  const { error } = await supabase.from("projects").insert({
    user_id: userId,
    resume_id: input.resumeId,
    name: input.name,
    description: toNullableString(input.description),
    url: toNullableString(input.url),
    github_url: toNullableString(input.githubUrl),
    tech_stack: input.techStackText.split(",").map((item) => item.trim()).filter(Boolean),
    start_date: toNullableString(input.startDate),
    end_date: toNullableString(input.endDate),
    sort_order: input.sortOrder,
  });

  if (error) throw new Error(error.message);
}

export async function updateProjectEntry(input: {
  id: string;
  resumeId: string;
  name: string;
  description: string;
  url: string;
  githubUrl: string;
  techStackText: string;
  startDate: string;
  endDate: string;
  sortOrder: number;
}) {
  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.from("projects").update({
    name: input.name,
    description: toNullableString(input.description),
    url: toNullableString(input.url),
    github_url: toNullableString(input.githubUrl),
    tech_stack: input.techStackText.split(",").map((item) => item.trim()).filter(Boolean),
    start_date: toNullableString(input.startDate),
    end_date: toNullableString(input.endDate),
    sort_order: input.sortOrder,
  }).eq("id", input.id).eq("resume_id", input.resumeId);

  if (error) throw new Error(error.message);
}

export async function deleteProjectEntry(id: string) {
  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.from("projects").delete().eq("id", id);
  if (error) throw new Error(error.message);
}