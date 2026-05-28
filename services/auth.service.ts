import type { AuthError, User } from "@supabase/supabase-js";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export type AuthResult =
  | { success: true; user: User | null; error: null }
  | { success: false; user: null; error: string };

export async function signInWithPassword(email: string, password: string): Promise<AuthResult> {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    return { success: false, user: null, error: error.message };
  }

  return { success: true, user: data.user, error: null };
}

export async function signUpWithPassword(
  email: string,
  password: string,
  fullName: string
): Promise<AuthResult> {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { full_name: fullName },
    },
  });

  if (error) {
    return { success: false, user: null, error: error.message };
  }

  return { success: true, user: data.user, error: null };
}

export async function sendPasswordResetEmail(email: string): Promise<AuthResult> {
  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"}/reset-password`,
  });

  if (error) {
    return { success: false, user: null, error: error.message };
  }

  return { success: true, user: null, error: null };
}

export async function signOut(): Promise<{ success: true } | { success: false; error: string }> {
  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.auth.signOut();

  if (error) {
    return { success: false, error: error.message };
  }

  return { success: true };
}

export function getAuthErrorMessage(error: AuthError | Error | null | undefined): string {
  return error?.message ?? "Something went wrong. Please try again.";
}