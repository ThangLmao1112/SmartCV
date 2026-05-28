import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { getCurrentProfile } from "@/lib/profile/profile.service";
import { listResumes } from "@/lib/resume/resume.service";

async function getAnalyticsSnapshot() {
  const supabase = await createSupabaseServerClient();
  const profile = await getCurrentProfile();
  const [resumes, uploadedFiles, aiGenerations] = await Promise.all([
    listResumes(),
    supabase.from("uploaded_files").select("id", { count: "exact", head: true }),
    supabase.from("ai_generations").select("id", { count: "exact", head: true }),
  ]);

  const profileFields = [profile?.full_name, profile?.headline, profile?.bio, profile?.website, profile?.location, profile?.phone, profile?.desired_role].filter(
    (value) => Boolean(value && value.trim())
  ).length;
  const profileCompletion = Math.round((profileFields / 7) * 100);

  return {
    totalResumes: resumes.length,
    publishedResumes: resumes.filter((resume) => resume.is_published).length,
    uploadedFiles: uploadedFiles.count ?? 0,
    aiGenerations: aiGenerations.count ?? 0,
    profileCompletion,
    latestResumes: resumes.slice(0, 4),
  };
}

export default async function AnalyticsPage() {
  const snapshot = await getAnalyticsSnapshot();

  const stats = [
    { label: "Resumes", value: snapshot.totalResumes.toString(), description: "Saved resume versions" },
    { label: "Published", value: snapshot.publishedResumes.toString(), description: "Public share links live" },
    { label: "AI generations", value: snapshot.aiGenerations.toString(), description: "Drafts created so far" },
    { label: "Uploaded files", value: snapshot.uploadedFiles.toString(), description: "Stored in Supabase Storage" },
  ] as const;

  return (
    <div className="space-y-6">
      <Card className="border-border/80 shadow-xl shadow-primary/5">
        <CardHeader>
          <Badge variant="secondary" className="w-fit">Analytics</Badge>
          <CardTitle>Resume performance overview</CardTitle>
          <CardDescription>
            Live dashboard signals for resume volume, public sharing, profile completion, and AI usage.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {stats.map((item) => (
            <div key={item.label} className="rounded-[1.25rem] border border-border/70 bg-background/70 p-4">
              <p className="text-sm text-muted-foreground">{item.label}</p>
              <p className="mt-2 text-3xl font-semibold tracking-tight">{item.value}</p>
              <p className="mt-1 text-sm text-muted-foreground">{item.description}</p>
            </div>
          ))}
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <Card className="border-border/80 shadow-lg shadow-primary/5">
          <CardHeader>
            <CardTitle>Profile completion</CardTitle>
            <CardDescription>Based on the key profile fields already available in the app.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-end justify-between gap-4">
              <div>
                <p className="text-4xl font-semibold tracking-tight">{snapshot.profileCompletion}%</p>
                <p className="text-sm text-muted-foreground">Fill out the remaining profile fields to improve this score.</p>
              </div>
              <Badge variant="outline">{snapshot.profileCompletion >= 80 ? "Strong" : "In progress"}</Badge>
            </div>
            <Progress value={snapshot.profileCompletion} className="h-3" />
            <div className="grid gap-3 sm:grid-cols-2">
              {[
                ["Completion target", "80%+"],
                ["Current state", snapshot.profileCompletion >= 80 ? "Ready for sharing" : "Needs more details"],
              ].map(([label, value]) => (
                <div key={label} className="rounded-[1.25rem] border border-border/70 bg-background/70 p-4">
                  <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">{label}</p>
                  <p className="mt-2 text-sm font-medium">{value}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/80 shadow-lg shadow-primary/5">
          <CardHeader>
            <CardTitle>Recent resumes</CardTitle>
            <CardDescription>Quick access to your latest resume versions and share state.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {snapshot.latestResumes.map((resume) => (
              <div key={resume.id} className="rounded-[1.25rem] border border-border/70 bg-background/70 p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-medium">{resume.title}</p>
                    <p className="text-sm text-muted-foreground">{resume.target_role ?? "Untitled target role"}</p>
                  </div>
                  <Badge variant={resume.is_published ? "default" : "secondary"}>{resume.is_published ? "Published" : "Draft"}</Badge>
                </div>
                <div className="mt-3 flex flex-wrap gap-2 text-sm">
                  <Link className="text-primary hover:underline" href={`/dashboard/resumes/${resume.id}/edit`}>
                    Edit
                  </Link>
                  <span className="text-muted-foreground">{resume.template_name}</span>
                  {resume.slug ? (
                    <Link className="text-primary hover:underline" href={`/r/${resume.slug}`}>
                      View public
                    </Link>
                  ) : null}
                </div>
              </div>
            ))}
            {snapshot.latestResumes.length === 0 ? (
              <p className="text-sm text-muted-foreground">Create a resume to start collecting analytics.</p>
            ) : null}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}