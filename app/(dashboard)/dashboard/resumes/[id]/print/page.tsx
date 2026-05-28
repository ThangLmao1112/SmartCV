import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ResumePreview } from "@/components/resume/resume-preview";
import { ResumePrintButton } from "@/components/resume/resume-print-button";
import { getResumeById } from "@/lib/resume/resume.service";
import { getResumeSectionData } from "@/lib/resume/section.service";

export const metadata: Metadata = {
  title: "Print resume",
};

export default async function ResumePrintPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const resume = await getResumeById(id);

  if (!resume) {
    notFound();
  }

  const sections = await getResumeSectionData(id);

  return (
    <main className="min-h-dvh bg-background px-4 py-6 print:bg-white print:p-0">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 print:hidden sm:flex-row sm:items-center sm:justify-between">
        <Button asChild variant="outline">
          <Link href={`/dashboard/resumes/${id}/edit`} className="inline-flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to editor
          </Link>
        </Button>
        <ResumePrintButton />
      </div>

      <section className="mx-auto mt-6 max-w-4xl print:mt-0">
        <ResumePreview
          name={resume.title}
          title={resume.target_role ?? "Target role"}
          summary={resume.summary ?? ""}
          accentColor={resume.accent_color}
          templateName={resume.template_name}
          education={sections.education}
          experiences={sections.experiences}
          skills={sections.skills}
          projects={sections.projects}
        />

        <div className="mt-6 grid gap-4 text-sm text-muted-foreground print:hidden md:grid-cols-2">
          <div className="rounded-[1.25rem] border border-border/70 bg-background/70 p-4">
            <p className="font-medium text-foreground">Education items</p>
            <p>{sections.education.length}</p>
          </div>
          <div className="rounded-[1.25rem] border border-border/70 bg-background/70 p-4">
            <p className="font-medium text-foreground">Experience items</p>
            <p>{sections.experiences.length}</p>
          </div>
        </div>
      </section>
    </main>
  );
}