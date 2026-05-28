import { createElement, type ReactElement } from "react";
import { renderToBuffer, type DocumentProps } from "@react-pdf/renderer";
import { ResumePdfDocument } from "@/lib/resume/resume-pdf";
import { getPublishedResumeBySlug } from "@/lib/resume/resume.service";
import { getResumeSectionData } from "@/lib/resume/section.service";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export const runtime = "nodejs";

export async function GET(_: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const resume = await getPublishedResumeBySlug(slug);

  if (!resume) {
    return Response.json({ message: "Resume not found." }, { status: 404 });
  }

  const sections = await getResumeSectionData(resume.id);
  const supabase = await createSupabaseServerClient();
  let profile = null;

  if (resume.profile_id) {
    const { data: profileData } = await supabase.from("profiles").select("*").eq("id", resume.profile_id).single();
    profile = profileData ?? null;
  } else {
    const { data: profileData } = await supabase.from("profiles").select("*").eq("user_id", resume.user_id).single();
    profile = profileData ?? null;
  }

  const pdfElement = createElement(ResumePdfDocument, {
    resume,
    ...sections,
    profile,
  }) as unknown as ReactElement<DocumentProps>;
  const buffer = await renderToBuffer(pdfElement);
  const fileName = `${(resume.slug ?? resume.title.replace(/[^a-z0-9]+/gi, "-").toLowerCase()) || "resume"}.pdf`;

  return new Response(buffer as unknown as BodyInit, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${fileName}"`,
      "Cache-Control": "no-store",
    },
  });
}