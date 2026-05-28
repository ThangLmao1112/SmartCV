"use server";

import { revalidatePath } from "next/cache";
import { createResumeSlug, getResumeById, updateResumePublishState } from "@/lib/resume/resume.service";

export async function toggleResumePublishAction(resumeId: string, nextPublishedState: boolean): Promise<void> {
  const resume = await getResumeById(resumeId);

  if (!resume) {
    return;
  }

  const slug = nextPublishedState ? resume.slug ?? createResumeSlug(resume.title, resume.id) : resume.slug;

  await updateResumePublishState(resumeId, { isPublished: nextPublishedState, slug });

  revalidatePath("/dashboard/resumes");
  revalidatePath(`/dashboard/resumes/${resumeId}/edit`);

  if (slug) {
    revalidatePath(`/r/${slug}`);
  }
}