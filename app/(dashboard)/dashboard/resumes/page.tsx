import Link from "next/link";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { deleteResumeAction, duplicateResumeAction } from "@/actions/resume";
import { toggleResumePublishAction } from "@/actions/resume-publish";
import { ResumeCopyLinkButton } from "@/components/resume/resume-copy-link-button";
import { listResumes } from "@/lib/resume/resume.service";

export default async function ResumesPage() {
  const resumes = await listResumes();

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <Badge variant="secondary" className="mb-3 w-fit">Resume library</Badge>
          <h2 className="text-3xl font-semibold tracking-tight">Your resumes</h2>
          <p className="mt-2 text-muted-foreground">Create, duplicate, and tailor multiple versions for different roles.</p>
        </div>
        <Button asChild>
          <Link href="/dashboard/resumes/new" className="inline-flex items-center gap-2">
            <Plus className="h-4 w-4" />
            New resume
          </Link>
        </Button>
      </div>

      {resumes.length === 0 ? (
        <Card>
          <CardHeader>
            <CardTitle>No resumes yet</CardTitle>
            <CardDescription>
              This empty state is driven by the live Supabase query and will disappear after your first create.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">Start with a new resume to unlock the editor and preview flow.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {resumes.map((resume) => (
            <Card key={resume.id} className="flex flex-col justify-between">
              <CardHeader>
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <CardTitle>{resume.title}</CardTitle>
                    <CardDescription>{resume.target_role ?? "Untitled target role"}</CardDescription>
                  </div>
                  {resume.is_default ? <Badge>Default</Badge> : null}
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="line-clamp-3 text-sm text-muted-foreground">
                  {resume.summary ?? "No summary added yet. Open the editor to configure this resume."}
                </p>
                <div className="flex flex-wrap gap-2">
                  <form action={duplicateResumeAction.bind(null, resume.id)}>
                    <Button type="submit" variant="secondary" size="sm">
                      Duplicate
                    </Button>
                  </form>
                  <Button asChild variant="outline" size="sm">
                    <Link href={`/dashboard/resumes/${resume.id}/edit`} className="inline-flex items-center gap-2">
                      <Pencil className="h-4 w-4" />
                      Edit
                    </Link>
                  </Button>
                  <Button asChild variant="outline" size="sm">
                    <Link href={`/api/resumes/${resume.id}/pdf`} target="_blank" rel="noreferrer">
                      Download PDF
                    </Link>
                  </Button>
                  {resume.is_published && resume.slug ? (
                    <Button asChild variant="secondary" size="sm">
                      <Link href={`/r/${resume.slug}`} className="inline-flex items-center gap-2">
                        View public
                      </Link>
                    </Button>
                  ) : null}
                  {resume.is_published && resume.slug ? <ResumeCopyLinkButton shareUrl={`${process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"}/r/${resume.slug}`} /> : null}
                  <form action={toggleResumePublishAction.bind(null, resume.id, !resume.is_published)}>
                    <Button type="submit" variant="outline" size="sm">
                      {resume.is_published ? "Unpublish" : "Publish"}
                    </Button>
                  </form>
                  <form action={deleteResumeAction.bind(null, resume.id)}>
                    <Button type="submit" variant="ghost" size="sm" className="text-destructive hover:text-destructive">
                      <Trash2 className="h-4 w-4" />
                      Delete
                    </Button>
                  </form>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}