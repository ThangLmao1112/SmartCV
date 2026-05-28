import { z } from "zod";

export const aiFeatureSchema = z.enum([
  "career-objective",
  "professional-summary",
  "experience-bullets",
  "skill-suggestions",
  "tailor-cv",
]);

export const generateAiSchema = z.object({
  feature: aiFeatureSchema,
  resumeId: z.string().uuid().optional(),
  jobTitle: z.string().optional().default(""),
  context: z.string().optional().default(""),
});

export type GenerateAiValues = z.infer<typeof generateAiSchema>;