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
          <Badge variant="secondary" className="mb-3 w-fit">Thư viện CV</Badge>
          <h2 className="text-3xl font-semibold tracking-tight">CV của bạn</h2>
          <p className="mt-2 text-muted-foreground">Tạo, nhân bản và tùy biến nhiều phiên bản cho từng vai trò ứng tuyển.</p>
        </div>
        <Button asChild>
          <Link href="/dashboard/resumes/new" className="inline-flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Tạo CV mới
          </Link>
        </Button>
      </div>

      {resumes.length === 0 ? (
        <Card>
          <CardHeader>
            <CardTitle>Chưa có CV nào</CardTitle>
            <CardDescription>
              Trạng thái trống này được lấy từ truy vấn Supabase và sẽ biến mất khi bạn tạo CV đầu tiên.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">Bắt đầu với CV mới để mở khóa trình chỉnh sửa và bản xem trước.</p>
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
                    <CardDescription>{resume.target_role ?? "Vị trí mục tiêu chưa đặt"}</CardDescription>
                  </div>
                  {resume.is_default ? <Badge>Mặc định</Badge> : null}
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="line-clamp-3 text-sm text-muted-foreground">
                  {resume.summary ?? "Chưa có tóm tắt. Hãy mở trình chỉnh sửa để cấu hình CV."}
                </p>
                <div className="flex flex-wrap gap-2">
                  <form action={duplicateResumeAction.bind(null, resume.id)}>
                    <Button type="submit" variant="secondary" size="sm">
                      Nhân bản
                    </Button>
                  </form>
                  <Button asChild variant="outline" size="sm">
                    <Link href={`/dashboard/resumes/${resume.id}/edit`} className="inline-flex items-center gap-2">
                      <Pencil className="h-4 w-4" />
                      Chỉnh sửa
                    </Link>
                  </Button>
                  <Button asChild variant="outline" size="sm">
                    <Link href={`/api/resumes/${resume.id}/pdf`} target="_blank" rel="noreferrer">
                      Tải PDF
                    </Link>
                  </Button>
                  {resume.is_published && resume.slug ? (
                    <Button asChild variant="secondary" size="sm">
                      <Link href={`/r/${resume.slug}`} className="inline-flex items-center gap-2">
                        Xem công khai
                      </Link>
                    </Button>
                  ) : null}
                  {resume.is_published && resume.slug ? <ResumeCopyLinkButton shareUrl={`${process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"}/r/${resume.slug}`} /> : null}
                  <form action={toggleResumePublishAction.bind(null, resume.id, !resume.is_published)}>
                    <Button type="submit" variant="outline" size="sm">
                      {resume.is_published ? "Hủy xuất bản" : "Xuất bản"}
                    </Button>
                  </form>
                  <form action={deleteResumeAction.bind(null, resume.id)}>
                    <Button type="submit" variant="ghost" size="sm" className="text-destructive hover:text-destructive">
                      <Trash2 className="h-4 w-4" />
                      Xóa
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