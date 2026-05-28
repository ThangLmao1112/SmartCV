import Link from "next/link";
import { ArrowRight, CheckCircle2, FileText, LayoutGrid, Sparkles, WandSparkles } from "lucide-react";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { MarketingShell } from "@/components/layout/marketing-shell";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

const featureCards = [
  {
    title: "Viết bằng AI",
    description: "Tạo tóm tắt, mục tiêu, gạch đầu dòng và nội dung tùy chỉnh cho từng hồ sơ.",
    icon: WandSparkles,
  },
  {
    title: "Xem trước trực tiếp",
    description: "Mọi chỉnh sửa hiển thị ngay lập tức trong bản xem trước tối ưu cho ATS.",
    icon: FileText,
  },
  {
    title: "Nền tảng sẵn production",
    description: "Supabase, RLS, Docker và kiến trúc mở rộng đã tích hợp sẵn trong dự án.",
    icon: LayoutGrid,
  },
] as const;

const stats = [
  { value: "01", label: "Luồng đăng nhập an toàn" },
  { value: "02", label: "Quản lý nhiều CV" },
  { value: "03", label: "Sẵn sàng cho AI" },
] as const;

export default function Home() {
  return (
    <div className="flex min-h-dvh flex-col">
      <SiteHeader />
      <main className="flex-1">
        <MarketingShell>
          <section className="relative overflow-hidden py-20 sm:py-24 lg:py-28">
            <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top,_hsl(var(--primary)/0.16),_transparent_32%),radial-gradient(circle_at_80%_30%,_hsl(var(--accent)/0.14),_transparent_28%)]" />
            <div className="grid items-center gap-10 lg:grid-cols-[1.08fr_0.92fr]">
              <div className="space-y-8">
                <Badge variant="secondary" className="w-fit gap-2 px-3 py-1.5">
                  <Sparkles className="h-3.5 w-3.5" />
                  SmartCV — Trình tạo CV AI
                </Badge>
                <div className="space-y-5">
                  <h1 className="max-w-3xl text-5xl font-semibold tracking-tight text-balance sm:text-6xl lg:text-7xl">
                    Tạo CV chuyên nghiệp với AI
                  </h1>
                  <p className="max-w-2xl text-lg leading-8 text-muted-foreground sm:text-xl">
                    Tạo, chỉnh sửa, tùy biến và xem trước CV trong không gian cao cấp dành cho quy trình tuyển dụng hiện đại, sẵn đường nâng cấp AI, xuất PDF và mở rộng template.
                  </p>
                </div>

                <div className="flex flex-col gap-3 sm:flex-row">
                  <Button asChild size="lg">
                    <Link href="/sign-up" className="inline-flex items-center gap-2">
                      Bắt đầu
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </Button>
                  <Button asChild variant="outline" size="lg">
                    <Link href="/dashboard/resumes/new">Tạo CV bằng AI</Link>
                  </Button>
                </div>

                <div className="grid gap-3 sm:grid-cols-3">
                  {stats.map((item) => (
                    <Card key={item.label} className="border-border/80 bg-background/80">
                      <CardContent className="p-5">
                        <div className="text-2xl font-semibold tracking-tight text-primary">{item.value}</div>
                        <p className="mt-1 text-sm text-muted-foreground">{item.label}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>

              <Card className="relative overflow-hidden border-border/80 shadow-2xl shadow-primary/10">
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <CardTitle>Xem trước CV</CardTitle>
                      <CardDescription>Bố cục thân thiện ATS với phân cấp rõ ràng.</CardDescription>
                    </div>
                    <Badge variant="success" className="gap-2 px-3 py-1.5">
                      <CheckCircle2 className="h-3.5 w-3.5" />
                      Trực tiếp
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-5">
                  <div className="rounded-[1.5rem] border border-border/70 bg-background p-6 shadow-inner">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="text-2xl font-semibold tracking-tight">Tên của bạn</p>
                        <p className="text-sm text-muted-foreground">Kỹ sư Frontend · Nhà xây dựng sản phẩm</p>
                      </div>
                      <div className="rounded-2xl bg-primary/10 px-3 py-2 text-sm font-medium text-primary">Sẵn sàng làm việc</div>
                    </div>
                    <Separator className="my-4" />
                    <div className="space-y-3 text-sm leading-6 text-muted-foreground">
                      <p>
                        Trình tạo CV hỗ trợ AI cho ứng viên hiện đại cần tùy chỉnh nhanh, trình bày đẹp và nền tảng production sạch sẽ.
                      </p>
                      <p>
                        Tính năng gồm quản lý hồ sơ, chỉnh sửa realtime, sở hữu dữ liệu an toàn và lộ trình cho template xuất file cùng PDF.
                      </p>
                    </div>
                  </div>

                  <div className="grid gap-3 sm:grid-cols-3">
                    {featureCards.map((feature) => {
                      const Icon = feature.icon;
                      return (
                        <div key={feature.title} className="rounded-[1.25rem] border border-border/70 bg-background/80 p-4 transition-transform hover:-translate-y-0.5">
                          <Icon className="h-5 w-5 text-primary" />
                          <p className="mt-3 text-sm font-semibold">{feature.title}</p>
                          <p className="mt-1 text-xs leading-5 text-muted-foreground">{feature.description}</p>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            </div>
          </section>

          <section className="grid gap-4 py-10 md:grid-cols-3">
            {featureCards.map((feature) => {
              const Icon = feature.icon;
              return (
                <Card key={feature.title} className="border-border/80 bg-background/80">
                  <CardHeader>
                    <div className="mb-2 flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                      <Icon className="h-5 w-5" />
                    </div>
                    <CardTitle>{feature.title}</CardTitle>
                    <CardDescription>{feature.description}</CardDescription>
                  </CardHeader>
                </Card>
              );
            })}
          </section>

          <section className="py-10">
            <Card className="border-border/80 bg-background/80">
              <CardContent className="grid gap-6 p-8 lg:grid-cols-[0.85fr_1.15fr] lg:items-center">
                <div className="space-y-4">
                  <Badge variant="secondary" className="w-fit">Khung giá</Badge>
                  <h2 className="text-3xl font-semibold tracking-tight">Được xây để mở rộng thành nền tảng CV hoàn chỉnh.</h2>
                  <p className="text-muted-foreground">
                    Khung này sẵn cho gói thuê bao, thư viện template, đo mức dùng AI và triển khai trên VPS với HTTPS.
                  </p>
                </div>
                <div className="grid gap-3 sm:grid-cols-3">
                  {[
                    "Xem trước miễn phí",
                    "Chỉnh sửa Pro",
                    "Lộ trình team",
                  ].map((item) => (
                    <div key={item} className="rounded-[1.25rem] border border-border/70 bg-secondary/40 p-4 text-sm font-medium">
                      {item}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </section>
        </MarketingShell>
      </main>
      <SiteFooter />
    </div>
  );
}
