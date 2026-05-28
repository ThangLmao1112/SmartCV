"use server";

import { revalidatePath } from "next/cache";
import { deleteUploadedFile } from "@/lib/profile/profile.service";

export async function deleteUploadedFileAction(fileId: string) {
  await deleteUploadedFile(fileId);
  revalidatePath("/dashboard/profile");
}