"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { forgotPasswordSchema, signInSchema, signUpSchema } from "@/schemas/auth";
import { sendPasswordResetEmail, signInWithPassword, signOut, signUpWithPassword } from "@/services/auth.service";

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

export async function signInAction(_: ActionState, formData: FormData): Promise<ActionState> {
  const payload = parseFormData(formData);
  const parsed = signInSchema.safeParse(payload);

  if (!parsed.success) {
    return { success: false, message: parsed.error.issues[0]?.message ?? "Invalid form data." };
  }

  const result = await signInWithPassword(parsed.data.email, parsed.data.password);

  if (!result.success) {
    return { success: false, message: result.error };
  }

  revalidatePath("/dashboard");
  redirect("/dashboard");
}

export async function signUpAction(_: ActionState, formData: FormData): Promise<ActionState> {
  const payload = parseFormData(formData);
  const parsed = signUpSchema.safeParse(payload);

  if (!parsed.success) {
    return { success: false, message: parsed.error.issues[0]?.message ?? "Invalid form data." };
  }

  const result = await signUpWithPassword(parsed.data.email, parsed.data.password, parsed.data.fullName);

  if (!result.success) {
    return { success: false, message: result.error };
  }

  return {
    success: true,
    message: "Account created. Check your email to confirm your sign up.",
  };
}

export async function forgotPasswordAction(_: ActionState, formData: FormData): Promise<ActionState> {
  const payload = parseFormData(formData);
  const parsed = forgotPasswordSchema.safeParse(payload);

  if (!parsed.success) {
    return { success: false, message: parsed.error.issues[0]?.message ?? "Invalid form data." };
  }

  const result = await sendPasswordResetEmail(parsed.data.email);

  if (!result.success) {
    return { success: false, message: result.error };
  }

  return {
    success: true,
    message: "Password reset link sent. Check your inbox.",
  };
}

export async function signOutAction(): Promise<void> {
  const result = await signOut();

  if (!result.success) {
    throw new Error(result.error);
  }

  revalidatePath("/");
  redirect("/sign-in");
}
