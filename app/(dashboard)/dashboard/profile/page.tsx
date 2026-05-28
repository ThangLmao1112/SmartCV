import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ProfileForm } from "@/components/profile/profile-form";
import { Button } from "@/components/ui/button";
import { deleteUploadedFileAction } from "@/actions/uploads";
import { getCurrentProfile, getCurrentUploadedFiles } from "@/lib/profile/profile.service";

export default async function ProfilePage() {
  const profile = await getCurrentProfile();
  const uploadedFiles = await getCurrentUploadedFiles();

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <Badge variant="secondary" className="w-fit">Profile</Badge>
          <CardTitle>Profile management</CardTitle>
          <CardDescription>
            Manage avatar upload, professional headline, and contact details.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Your profile data is isolated per user with Supabase RLS.
          </p>
        </CardContent>
      </Card>

      <ProfileForm
        defaultValues={{
          fullName: profile?.full_name ?? "",
          headline: profile?.headline ?? "",
          bio: profile?.bio ?? "",
          website: profile?.website ?? "",
          location: profile?.location ?? "",
          phone: profile?.phone ?? "",
          desiredRole: profile?.desired_role ?? "",
        }}
        avatarUrl={profile?.avatar_url ?? null}
        fullName={profile?.full_name ?? null}
      />

      <Card className="border-border/80 shadow-xl shadow-primary/5">
        <CardHeader>
          <Badge variant="secondary" className="w-fit">Uploaded files</Badge>
          <CardTitle>Storage records</CardTitle>
          <CardDescription>
            These records track avatar uploads in Supabase Storage and can be extended for PDFs later.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {uploadedFiles.length === 0 ? (
            <p className="text-sm text-muted-foreground">No uploaded files yet.</p>
          ) : (
            <div className="space-y-3">
              {uploadedFiles.map((file) => (
                <div key={file.id} className="flex flex-col gap-3 rounded-[1.25rem] border border-border/70 bg-background/70 p-4 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="font-medium">{file.file_name}</p>
                    <p className="text-sm text-muted-foreground">
                      {file.file_kind} · {file.bucket_name} · {Math.round((file.file_size ?? 0) / 1024)} KB
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <a
                      href={`${process.env.NEXT_PUBLIC_SUPABASE_URL ?? ""}/storage/v1/object/public/${file.bucket_name}/${file.file_path}`}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex h-10 items-center justify-center rounded-full border border-border px-4 text-sm font-medium transition-colors hover:bg-secondary"
                    >
                      Open
                    </a>
                    <form action={deleteUploadedFileAction.bind(null, file.id)}>
                      <Button type="submit" variant="ghost" className="text-destructive hover:text-destructive">
                        Delete
                      </Button>
                    </form>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}