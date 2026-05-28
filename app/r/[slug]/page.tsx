import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ResumePreview } from "@/components/resume/resume-preview";
import { getPublishedResumeBySlug } from "@/lib/resume/resume.service";
import { getResumeSectionData } from "@/lib/resume/section.service";

type PublicResumePageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: PublicResumePageProps): Promise<Metadata> {
  const { slug } = await params;
  const resume = await getPublishedResumeBySlug(slug);

  if (!resume) {
    return { title: "Không tìm thấy CV" };
  }

  return {
    title: `${resume.title} | SmartCV`,
    description: resume.summary ?? "Xem trước CV công khai",
  };
}

export default async function PublicResumePage({ params }: PublicResumePageProps) {
  const { slug } = await params;
  const resume = await getPublishedResumeBySlug(slug);

  if (!resume) {
    notFound();
  }

  const sections = await getResumeSectionData(resume.id);

  return (
    <main className="min-h-dvh bg-background px-4 py-8">
      <div className="mx-auto max-w-5xl space-y-6">
        <Card className="border-border/80 shadow-xl shadow-primary/5">
          <CardHeader>
            <CardTitle>{resume.title}</CardTitle>
            <CardDescription>
              Liên kết chia sẻ công khai được tạo bởi SmartCV. Trang chỉ đọc và tối ưu cho rà soát nhanh.
            </CardDescription>
            <div className="flex flex-wrap gap-2 pt-2">
              <Button asChild variant="outline" size="sm">
                <Link href={`/api/public/resumes/${slug}/pdf`} target="_blank" rel="noreferrer">
                  Tải PDF
                </Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-[minmax(0,1fr)_320px] md:items-start">
            <ResumePreview
              name={resume.title}
              title={resume.target_role ?? "Vị trí mục tiêu"}
              summary={resume.summary ?? ""}
              accentColor={resume.accent_color}
              templateName={resume.template_name}
              education={sections.education}
              experiences={sections.experiences}
              skills={sections.skills}
              projects={sections.projects}
            />

            <div className="space-y-4">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base">Các mục</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm text-muted-foreground">
                  <p>Học vấn: {sections.education.length}</p>
                  <p>Kinh nghiệm: {sections.experiences.length}</p>
                  <p>Kỹ năng: {sections.skills.length}</p>
                  <p>Dự án: {sections.projects.length}</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base">Trạng thái chia sẻ</CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground">
                  CV này đã được xuất bản và có sẵn tại /r/{slug}.
                </CardContent>
              </Card>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}