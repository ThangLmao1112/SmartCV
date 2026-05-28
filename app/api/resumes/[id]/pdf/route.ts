import { createElement } from "react";
import { renderToBuffer } from "@react-pdf/renderer";
import { ResumePdfDocument } from "@/lib/resume/resume-pdf";
import { getResumeById } from "@/lib/resume/resume.service";
import { getResumeSectionData } from "@/lib/resume/section.service";

export const runtime = "nodejs";

export async function GET(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const resume = await getResumeById(id);

  if (!resume) {
    return Response.json({ message: "Resume not found." }, { status: 404 });
  }

  const sections = await getResumeSectionData(id);
  const pdfElement = createElement(ResumePdfDocument as any, { resume, ...sections }) as any;
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