import { z } from "zod";

export const signInSchema = z.object({
  email: z.string().email("Vui lòng nhập email hợp lệ."),
  password: z.string().min(8, "Mật khẩu phải có ít nhất 8 ký tự."),
});

export const signUpSchema = z
  .object({
    fullName: z.string().min(2, "Vui lòng nhập họ và tên."),
    email: z.string().email("Vui lòng nhập email hợp lệ."),
    password: z.string().min(8, "Mật khẩu phải có ít nhất 8 ký tự."),
    confirmPassword: z.string().min(8, "Vui lòng xác nhận mật khẩu."),
  })
  .refine((values) => values.password === values.confirmPassword, {
    message: "Mật khẩu không khớp.",
    path: ["confirmPassword"],
  });

export const forgotPasswordSchema = z.object({
  email: z.string().email("Vui lòng nhập email hợp lệ."),
});

export type SignInValues = z.infer<typeof signInSchema>;
export type SignUpValues = z.infer<typeof signUpSchema>;
export type ForgotPasswordValues = z.infer<typeof forgotPasswordSchema>;