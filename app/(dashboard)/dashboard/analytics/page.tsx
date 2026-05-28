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
    { label: "CV", value: snapshot.totalResumes.toString(), description: "Phiên bản CV đã lưu" },
    { label: "Đã xuất bản", value: snapshot.publishedResumes.toString(), description: "Liên kết chia sẻ đang hoạt động" },
    { label: "Bản tạo AI", value: snapshot.aiGenerations.toString(), description: "Bản nháp đã tạo" },
    { label: "Tệp đã tải", value: snapshot.uploadedFiles.toString(), description: "Lưu trữ trong Supabase Storage" },
  ] as const;

  return (
    <div className="space-y-6">
      <Card className="border-border/80 shadow-xl shadow-primary/5">
        <CardHeader>
          <Badge variant="secondary" className="w-fit">Thống kê</Badge>
          <CardTitle>Tổng quan hiệu suất CV</CardTitle>
          <CardDescription>
            Dữ liệu trực quan cho số lượng CV, chia sẻ công khai, hoàn thiện hồ sơ và mức sử dụng AI.
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
            <CardTitle>Hoàn thiện hồ sơ</CardTitle>
            <CardDescription>Dựa trên các trường hồ sơ quan trọng đã có trong ứng dụng.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-end justify-between gap-4">
              <div>
                <p className="text-4xl font-semibold tracking-tight">{snapshot.profileCompletion}%</p>
                <p className="text-sm text-muted-foreground">Điền thêm thông tin hồ sơ để cải thiện mức hoàn thiện này.</p>
              </div>
              <Badge variant="outline">{snapshot.profileCompletion >= 80 ? "Tốt" : "Đang hoàn thiện"}</Badge>
            </div>
            <Progress value={snapshot.profileCompletion} className="h-3" />
            <div className="grid gap-3 sm:grid-cols-2">
              {[
                ["Mục tiêu hoàn thiện", "80%+"],
                ["Trạng thái hiện tại", snapshot.profileCompletion >= 80 ? "Sẵn sàng chia sẻ" : "Cần bổ sung chi tiết"],
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
            <CardTitle>CV gần đây</CardTitle>
            <CardDescription>Truy cập nhanh các phiên bản CV mới nhất và trạng thái chia sẻ.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {snapshot.latestResumes.map((resume) => (
              <div key={resume.id} className="rounded-[1.25rem] border border-border/70 bg-background/70 p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-medium">{resume.title}</p>
                    <p className="text-sm text-muted-foreground">{resume.target_role ?? "Vị trí mục tiêu chưa đặt"}</p>
                  </div>
                  <Badge variant={resume.is_published ? "default" : "secondary"}>{resume.is_published ? "Đã xuất bản" : "Bản nháp"}</Badge>
                </div>
                <div className="mt-3 flex flex-wrap gap-2 text-sm">
                  <Link className="text-primary hover:underline" href={`/dashboard/resumes/${resume.id}/edit`}>
                    Chỉnh sửa
                  </Link>
                  <span className="text-muted-foreground">{resume.template_name}</span>
                  {resume.slug ? (
                    <Link className="text-primary hover:underline" href={`/r/${resume.slug}`}>
                      Xem công khai
                    </Link>
                  ) : null}
                </div>
              </div>
            ))}
            {snapshot.latestResumes.length === 0 ? (
              <p className="text-sm text-muted-foreground">Tạo CV để bắt đầu thu thập thống kê.</p>
            ) : null}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}