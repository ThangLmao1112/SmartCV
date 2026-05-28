"use server";

import { revalidatePath } from "next/cache";
import { generateAiSchema } from "@/schemas/ai";
import { generateResumeContent } from "@/services/ai/ai.service";
import { createSupabaseServerClient } from "@/lib/supabase/server";

type ActionState = {
  success: boolean;
  message: string;
  result?: string;
};

function parseFormData(formData: FormData): Record<string, string> {
  const payload: Record<string, string> = {};

  for (const [key, value] of formData.entries()) {
    payload[key] = typeof value === "string" ? value : "";
  }

  return payload;
}

export async function generateAIAction(_: ActionState, formData: FormData): Promise<ActionState> {
  const payload = parseFormData(formData);
  const parsed = generateAiSchema.safeParse({
    feature: payload.feature,
    resumeId: payload.resumeId || undefined,
    jobTitle: payload.jobTitle ?? "",
    context: payload.context ?? "",
  });

  if (!parsed.success) {
    return { success: false, message: parsed.error.issues[0]?.message ?? "Invalid AI request." };
  }

  const result = await generateResumeContent(parsed.data);
  const supabase = await createSupabaseServerClient();
  const { data: userData } = await supabase.auth.getUser();

  if (userData.user) {
    await supabase.from("ai_generations").insert({
      user_id: userData.user.id,
      resume_id: parsed.data.resumeId ?? null,
      generation_type: parsed.data.feature,
      prompt: result.metadata.prompt,
      result: result.text,
      provider: result.provider,
      model: result.model,
      metadata: result.metadata,
    });
  }

  revalidatePath("/dashboard");
  return {
    success: true,
    message: "AI result generated successfully.",
    result: result.text,
  };
}