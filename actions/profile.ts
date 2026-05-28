"use server";

import { revalidatePath } from "next/cache";
import { profileSchema } from "@/schemas/profile";
import { saveProfile, uploadProfileAvatar } from "@/lib/profile/profile.service";

type ActionState = {
  success: boolean;
  message: string;
};

function parseFormData(formData: FormData): Record<string, string | File> {
  const payload: Record<string, string | File> = {};

  for (const [key, value] of formData.entries()) {
    payload[key] = value;
  }

  return payload;
}

export async function saveProfileAction(_: ActionState, formData: FormData): Promise<ActionState> {
  const payload = parseFormData(formData);
  const parsed = profileSchema.safeParse({
    fullName: typeof payload.fullName === "string" ? payload.fullName : "",
    headline: typeof payload.headline === "string" ? payload.headline : "",
    bio: typeof payload.bio === "string" ? payload.bio : "",
    website: typeof payload.website === "string" ? payload.website : "",
    location: typeof payload.location === "string" ? payload.location : "",
    phone: typeof payload.phone === "string" ? payload.phone : "",
    desiredRole: typeof payload.desiredRole === "string" ? payload.desiredRole : "",
  });

  if (!parsed.success) {
    return { success: false, message: parsed.error.issues[0]?.message ?? "Invalid profile data." };
  }

  await saveProfile(parsed.data);

  const avatar = payload.avatar;
  if (avatar instanceof File && avatar.size > 0) {
    await uploadProfileAvatar(avatar);
  }

  revalidatePath("/dashboard/profile");
  revalidatePath("/dashboard");
  revalidatePath("/");

  return { success: true, message: "Profile updated successfully." };
}