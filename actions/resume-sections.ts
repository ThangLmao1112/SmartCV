"use server";

import { revalidatePath } from "next/cache";
import { educationSchema, experienceSchema, projectSchema, skillSchema } from "@/schemas/resume-sections";
import {
  createEducationEntry,
  createExperienceEntry,
  createProjectEntry,
  createSkillEntry,
  deleteEducationEntry,
  deleteExperienceEntry,
  deleteProjectEntry,
  deleteSkillEntry,
  updateEducationEntry,
  updateExperienceEntry,
  updateProjectEntry,
  updateSkillEntry,
} from "@/lib/resume/section.service";

type ActionState = {
  success: boolean;
  message: string;
};

function parseFormData(formData: FormData): Record<string, string> {
  const payload: Record<string, string> = {};

  for (const [key, value] of formData.entries()) {
    payload[key] = typeof value === "string" ? value : "";
  }

  return payload;
}

function parseBoolean(value: string | undefined): boolean {
  return value === "true" || value === "on" || value === "1";
}

export async function saveEducationAction(_: ActionState, formData: FormData): Promise<ActionState> {
  const payload = parseFormData(formData);
  const parsed = educationSchema.safeParse({
    id: payload.id || undefined,
    resumeId: payload.resumeId,
    schoolName: payload.schoolName,
    degree: payload.degree ?? "",
    fieldOfStudy: payload.fieldOfStudy ?? "",
    startDate: payload.startDate ?? "",
    endDate: payload.endDate ?? "",
    isCurrent: parseBoolean(payload.isCurrent),
    location: payload.location ?? "",
    description: payload.description ?? "",
    sortOrder: payload.sortOrder ?? 0,
  });

  if (!parsed.success) {
    return { success: false, message: parsed.error.issues[0]?.message ?? "Invalid education data." };
  }

  if (parsed.data.id) {
    await updateEducationEntry({
      ...parsed.data,
      id: parsed.data.id,
    });
  } else {
    await createEducationEntry(parsed.data);
  }

  revalidatePath(`/dashboard/resumes/${parsed.data.resumeId}/edit`);
  return { success: true, message: "Education saved." };
}

export async function deleteEducationAction(resumeId: string, educationId: string) {
  await deleteEducationEntry(educationId);
  revalidatePath(`/dashboard/resumes/${resumeId}/edit`);
}

export async function saveExperienceAction(_: ActionState, formData: FormData): Promise<ActionState> {
  const payload = parseFormData(formData);
  const parsed = experienceSchema.safeParse({
    id: payload.id || undefined,
    resumeId: payload.resumeId,
    companyName: payload.companyName,
    jobTitle: payload.jobTitle,
    employmentType: payload.employmentType ?? "",
    location: payload.location ?? "",
    startDate: payload.startDate ?? "",
    endDate: payload.endDate ?? "",
    isCurrent: parseBoolean(payload.isCurrent),
    description: payload.description ?? "",
    achievementsText: payload.achievementsText ?? "",
    sortOrder: payload.sortOrder ?? 0,
  });

  if (!parsed.success) {
    return { success: false, message: parsed.error.issues[0]?.message ?? "Invalid experience data." };
  }

  if (parsed.data.id) {
    await updateExperienceEntry({
      ...parsed.data,
      id: parsed.data.id,
    });
  } else {
    await createExperienceEntry(parsed.data);
  }

  revalidatePath(`/dashboard/resumes/${parsed.data.resumeId}/edit`);
  return { success: true, message: "Experience saved." };
}

export async function deleteExperienceAction(resumeId: string, experienceId: string) {
  await deleteExperienceEntry(experienceId);
  revalidatePath(`/dashboard/resumes/${resumeId}/edit`);
}

export async function saveSkillAction(_: ActionState, formData: FormData): Promise<ActionState> {
  const payload = parseFormData(formData);
  const parsed = skillSchema.safeParse({
    id: payload.id || undefined,
    resumeId: payload.resumeId,
    name: payload.name,
    category: payload.category ?? "",
    proficiency: payload.proficiency ?? 3,
    sortOrder: payload.sortOrder ?? 0,
  });

  if (!parsed.success) {
    return { success: false, message: parsed.error.issues[0]?.message ?? "Invalid skill data." };
  }

  if (parsed.data.id) {
    await updateSkillEntry({
      ...parsed.data,
      id: parsed.data.id,
    });
  } else {
    await createSkillEntry(parsed.data);
  }

  revalidatePath(`/dashboard/resumes/${parsed.data.resumeId}/edit`);
  return { success: true, message: "Skill saved." };
}

export async function deleteSkillAction(resumeId: string, skillId: string) {
  await deleteSkillEntry(skillId);
  revalidatePath(`/dashboard/resumes/${resumeId}/edit`);
}

export async function saveProjectAction(_: ActionState, formData: FormData): Promise<ActionState> {
  const payload = parseFormData(formData);
  const parsed = projectSchema.safeParse({
    id: payload.id || undefined,
    resumeId: payload.resumeId,
    name: payload.name,
    description: payload.description ?? "",
    url: payload.url ?? "",
    githubUrl: payload.githubUrl ?? "",
    techStackText: payload.techStackText ?? "",
    startDate: payload.startDate ?? "",
    endDate: payload.endDate ?? "",
    sortOrder: payload.sortOrder ?? 0,
  });

  if (!parsed.success) {
    return { success: false, message: parsed.error.issues[0]?.message ?? "Invalid project data." };
  }

  if (parsed.data.id) {
    await updateProjectEntry({
      ...parsed.data,
      id: parsed.data.id,
    });
  } else {
    await createProjectEntry(parsed.data);
  }

  revalidatePath(`/dashboard/resumes/${parsed.data.resumeId}/edit`);
  return { success: true, message: "Project saved." };
}

export async function deleteProjectAction(resumeId: string, projectId: string) {
  await deleteProjectEntry(projectId);
  revalidatePath(`/dashboard/resumes/${resumeId}/edit`);
}