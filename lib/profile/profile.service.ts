import type { Database } from "@/lib/supabase/database.types";
import { createSupabaseServerClient } from "@/lib/supabase/server";

type ProfileRow = Database["public"]["Tables"]["profiles"]["Row"];
type UploadedFileRow = Database["public"]["Tables"]["uploaded_files"]["Row"];

export async function getCurrentProfile(): Promise<ProfileRow | null> {
  const supabase = await createSupabaseServerClient();
  const { data: userData } = await supabase.auth.getUser();

  if (!userData.user) {
    return null;
  }

  const { data, error } = await supabase.from("profiles").select("*").eq("user_id", userData.user.id).single();

  if (error) {
    return null;
  }

  return data;
}

export async function getCurrentUploadedFiles(): Promise<UploadedFileRow[]> {
  const supabase = await createSupabaseServerClient();
  const { data: userData } = await supabase.auth.getUser();

  if (!userData.user) {
    return [];
  }

  const { data, error } = await supabase
    .from("uploaded_files")
    .select("*")
    .eq("user_id", userData.user.id)
    .order("created_at", { ascending: false });

  if (error) {
    return [];
  }

  return data ?? [];
}

export async function saveProfile(input: {
  fullName: string;
  headline: string;
  bio: string;
  website: string;
  location: string;
  phone: string;
  desiredRole: string;
}) {
  const supabase = await createSupabaseServerClient();
  const { data: userData } = await supabase.auth.getUser();

  if (!userData.user) {
    throw new Error("You must be signed in to update your profile.");
  }

  const { data, error } = await supabase
    .from("profiles")
    .upsert({
      user_id: userData.user.id,
      full_name: input.fullName,
      headline: input.headline || null,
      bio: input.bio || null,
      website: input.website || null,
      location: input.location || null,
      phone: input.phone || null,
      desired_role: input.desiredRole || null,
    })
    .select("*")
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

export async function uploadProfileAvatar(file: File) {
  const supabase = await createSupabaseServerClient();
  const { data: userData } = await supabase.auth.getUser();

  if (!userData.user) {
    throw new Error("You must be signed in to upload an avatar.");
  }

  const fileName = file.name.replace(/\s+/g, "-").toLowerCase();
  const filePath = `${userData.user.id}/${crypto.randomUUID()}-${fileName}`;

  const { error: uploadError } = await supabase.storage.from("avatars").upload(filePath, file, {
    contentType: file.type,
    upsert: true,
  });

  if (uploadError) {
    throw new Error(uploadError.message);
  }

  const { data } = supabase.storage.from("avatars").getPublicUrl(filePath);

  const { error: fileRowError } = await supabase.from("uploaded_files").insert({
    user_id: userData.user.id,
    bucket_name: "avatars",
    file_path: filePath,
    file_name: file.name,
    mime_type: file.type,
    file_size: file.size,
    file_kind: "avatar",
  });

  if (fileRowError) {
    throw new Error(fileRowError.message);
  }

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .update({ avatar_url: data.publicUrl })
    .eq("user_id", userData.user.id)
    .select("*")
    .single();

  if (profileError) {
    throw new Error(profileError.message);
  }

  return profile;
}

export async function deleteUploadedFile(fileId: string) {
  const supabase = await createSupabaseServerClient();
  const { data: userData } = await supabase.auth.getUser();

  if (!userData.user) {
    throw new Error("You must be signed in to delete an uploaded file.");
  }

  const { data: fileRow, error: fileRowError } = await supabase
    .from("uploaded_files")
    .select("*")
    .eq("id", fileId)
    .eq("user_id", userData.user.id)
    .single();

  if (fileRowError || !fileRow) {
    throw new Error("Uploaded file not found.");
  }

  const { error: storageError } = await supabase.storage.from(fileRow.bucket_name).remove([fileRow.file_path]);
  if (storageError) {
    throw new Error(storageError.message);
  }

  const { error: deleteError } = await supabase.from("uploaded_files").delete().eq("id", fileId);

  if (deleteError) {
    throw new Error(deleteError.message);
  }
}
