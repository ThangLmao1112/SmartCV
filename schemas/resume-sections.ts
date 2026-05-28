import { z } from "zod";

export const educationSchema = z.object({
  id: z.string().uuid().optional(),
  resumeId: z.string().uuid(),
  schoolName: z.string().min(2, "Vui lòng nhập tên trường."),
  degree: z.string().optional().default(""),
  fieldOfStudy: z.string().optional().default(""),
  startDate: z.string().optional().default(""),
  endDate: z.string().optional().default(""),
  isCurrent: z.boolean().default(false),
  location: z.string().optional().default(""),
  description: z.string().optional().default(""),
  sortOrder: z.coerce.number().int().nonnegative().default(0),
});

export const experienceSchema = z.object({
  id: z.string().uuid().optional(),
  resumeId: z.string().uuid(),
  companyName: z.string().min(2, "Vui lòng nhập tên công ty."),
  jobTitle: z.string().min(2, "Vui lòng nhập chức danh."),
  employmentType: z.string().optional().default(""),
  location: z.string().optional().default(""),
  startDate: z.string().optional().default(""),
  endDate: z.string().optional().default(""),
  isCurrent: z.boolean().default(false),
  description: z.string().optional().default(""),
  achievementsText: z.string().optional().default(""),
  sortOrder: z.coerce.number().int().nonnegative().default(0),
});

export const skillSchema = z.object({
  id: z.string().uuid().optional(),
  resumeId: z.string().uuid(),
  name: z.string().min(2, "Vui lòng nhập tên kỹ năng."),
  category: z.string().optional().default(""),
  proficiency: z.coerce.number().int().min(1).max(5).default(3),
  sortOrder: z.coerce.number().int().nonnegative().default(0),
});

export const projectSchema = z.object({
  id: z.string().uuid().optional(),
  resumeId: z.string().uuid(),
  name: z.string().min(2, "Vui lòng nhập tên dự án."),
  description: z.string().optional().default(""),
  url: z.string().optional().default(""),
  githubUrl: z.string().optional().default(""),
  techStackText: z.string().optional().default(""),
  startDate: z.string().optional().default(""),
  endDate: z.string().optional().default(""),
  sortOrder: z.coerce.number().int().nonnegative().default(0),
});

export type EducationValues = z.infer<typeof educationSchema>;
export type ExperienceValues = z.infer<typeof experienceSchema>;
export type SkillValues = z.infer<typeof skillSchema>;
export type ProjectValues = z.infer<typeof projectSchema>;