import { z } from "zod";

export const profileSchema = z.object({
  fullName: z.string().min(2, "Vui lòng nhập họ và tên."),
  headline: z.string().max(140, "Tiêu đề quá dài.").optional().default(""),
  bio: z.string().max(1000, "Phần giới thiệu quá dài.").optional().default(""),
  website: z.string().url("Vui lòng nhập URL website hợp lệ.").or(z.literal("")).optional().default(""),
  location: z.string().max(120, "Địa điểm quá dài.").optional().default(""),
  phone: z.string().max(40, "Số điện thoại quá dài.").optional().default(""),
  desiredRole: z.string().max(120, "Vị trí mong muốn quá dài.").optional().default(""),
});

export type ProfileValues = z.infer<typeof profileSchema>;