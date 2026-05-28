import { notFound } from "next/navigation";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ResumeEditor } from "@/components/resume/resume-editor";
import { ResumeCopyLinkButton } from "@/components/resume/resume-copy-link-button";
import { ResumeForm } from "@/components/resume/resume-form";
import { deleteResumeAction, duplicateResumeAction } from "@/actions/resume";
import { toggleResumePublishAction } from "@/actions/resume-publish";
import { getResumeById } from "@/lib/resume/resume.service";
import { getResumeSectionData } from "@/lib/resume/section.service";
import type { ResumeTemplateName } from "@/lib/resume/templates";

export default async function EditResumePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const resume = await getResumeById(id);
  const sections = await getResumeSectionData(id);

  if (!resume) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-[1.5rem] border border-border/70 bg-background/70 px-5 py-4">
        <div className="space-y-1">
          <Badge variant={resume.is_published ? "default" : "secondary"} className="w-fit">
            {resume.is_published ? "Published" : "Draft"}
          </Badge>
          <p className="text-sm text-muted-foreground">
            {resume.is_published && resume.slug ? `Public link: /r/${resume.slug}` : "Publish this resume to create a public share link."}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <form action={duplicateResumeAction.bind(null, id)}>
            <Button type="submit" variant="secondary" size="sm">
              Duplicate
            </Button>
          </form>
          <Button asChild variant="outline" size="sm">
            <Link href={`/api/resumes/${id}/pdf`} target="_blank" rel="noreferrer">
              Download PDF
            </Link>
          </Button>
          {resume.is_published && resume.slug ? <ResumeCopyLinkButton shareUrl={`${process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"}/r/${resume.slug}`} /> : null}
          <form action={toggleResumePublishAction.bind(null, id, !resume.is_published)}>
            <Button type="submit" variant={resume.is_published ? "outline" : "default"} size="sm">
              {resume.is_published ? "Unpublish" : "Publish"}
            </Button>
          </form>
          {resume.is_published && resume.slug ? (
            <Button asChild variant="secondary" size="sm">
              <Link href={`/r/${resume.slug}`}>View public</Link>
            </Button>
          ) : null}
        </div>
      </div>

      <ResumeForm
        mode="update"
        resumeId={id}
        defaultValues={{
          title: resume.title,
          targetRole: resume.target_role ?? "",
          summary: resume.summary ?? "",
          templateName: resume.template_name as ResumeTemplateName,
          accentColor: resume.accent_color,
          isDefault: resume.is_default,
        }}
      />
      <ResumeEditor
        resumeId={id}
        initialName={resume.title}
        initialHeadline={resume.target_role ?? "Frontend Engineer"}
        initialSummary={resume.summary ?? ""}
        initialAccentColor={resume.accent_color}
        initialTemplateName={resume.template_name}
        education={sections.education}
        experiences={sections.experiences}
        skills={sections.skills}
        projects={sections.projects}
      />
      <form action={deleteResumeAction.bind(null, id)}>
        <button type="submit" className="text-sm font-medium text-destructive hover:underline">
          Delete this resume
        </button>
      </form>
    </div>
  );
}