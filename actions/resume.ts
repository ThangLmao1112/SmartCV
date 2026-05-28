"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createResumeSchema, updateResumeSchema } from "@/schemas/resume";
import { createResume, deleteResume, duplicateResume, updateResume } from "@/lib/resume/resume.service";

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

export async function createResumeAction(_: ActionState, formData: FormData): Promise<ActionState> {
  const payload = parseFormData(formData);
  const parsed = createResumeSchema.safeParse({
    title: payload.title,
    targetRole: payload.targetRole ?? "",
    summary: payload.summary ?? "",
    templateName: payload.templateName ?? "modern-ats",
    accentColor: payload.accentColor ?? "#2563eb",
    isDefault: payload.isDefault === "on" || payload.isDefault === "true",
  });

  if (!parsed.success) {
    return { success: false, message: parsed.error.issues[0]?.message ?? "Invalid form data." };
  }

  await createResume(parsed.data);
  revalidatePath("/dashboard/resumes");
  redirect("/dashboard/resumes");
}

export async function updateResumeAction(resumeId: string, _: ActionState, formData: FormData): Promise<ActionState> {
  const payload = parseFormData(formData);
  const parsed = updateResumeSchema.safeParse({
    id: resumeId,
    title: payload.title,
    targetRole: payload.targetRole ?? "",
    summary: payload.summary ?? "",
    templateName: payload.templateName ?? "modern-ats",
    accentColor: payload.accentColor ?? "#2563eb",
    isDefault: payload.isDefault === "on" || payload.isDefault === "true",
  });

  if (!parsed.success) {
    return { success: false, message: parsed.error.issues[0]?.message ?? "Invalid form data." };
  }

  await updateResume(resumeId, parsed.data);
  revalidatePath("/dashboard/resumes");
  revalidatePath(`/dashboard/resumes/${resumeId}/edit`);
  return { success: true, message: "Resume updated successfully." };
}

export async function deleteResumeAction(resumeId: string) {
  await deleteResume(resumeId);
  revalidatePath("/dashboard/resumes");
  redirect("/dashboard/resumes");
}

export async function duplicateResumeAction(resumeId: string) {
  const duplicatedResume = await duplicateResume(resumeId);

  revalidatePath("/dashboard/resumes");
  revalidatePath(`/dashboard/resumes/${duplicatedResume.id}/edit`);
  redirect(`/dashboard/resumes/${duplicatedResume.id}/edit`);
}