import { z } from "zod";
import { resumeTemplateNames } from "@/lib/resume/templates";

export const resumeSettingsSchema = z.object({
  title: z.string().min(2, "Vui lòng nhập tiêu đề CV."),
  targetRole: z.string().default(""),
  summary: z.string().default(""),
  templateName: z.enum(resumeTemplateNames),
  accentColor: z.string().min(4, "Vui lòng chọn màu nhấn."),
  isDefault: z.boolean().default(false),
});

export const createResumeSchema = resumeSettingsSchema.extend({
  title: z.string().min(2, "Vui lòng nhập tiêu đề CV."),
});

export const updateResumeSchema = resumeSettingsSchema.extend({
  id: z.string().uuid(),
});

export type ResumeSettingsValues = z.infer<typeof resumeSettingsSchema>;
export type CreateResumeValues = z.infer<typeof createResumeSchema>;
export type UpdateResumeValues = z.infer<typeof updateResumeSchema>;