import type { ReactNode } from "react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ShieldCheck, Sparkles, WandSparkles } from "lucide-react";

const authHighlights = [
  "Dữ liệu CV được cô lập bằng RLS ngay từ đầu.",
  "Chỉnh sửa realtime sẵn sàng cho cộng tác trong tương lai.",
  "Prompt AI và template luôn có thể thay thế.",
] as const;

export function AuthShell({ children }: { children: ReactNode }) {
  return (
    <main className="mx-auto grid min-h-[calc(100vh-5rem)] w-full max-w-7xl gap-6 px-4 py-6 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:px-8">
      <section className="glass-panel relative overflow-hidden rounded-[2rem] p-8">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_hsl(var(--primary)/0.15),_transparent_34%),radial-gradient(circle_at_bottom_left,_hsl(var(--accent)/0.16),_transparent_30%)]" />
        <div className="relative flex h-full flex-col justify-between gap-10">
          <div className="space-y-6">
            <Badge variant="secondary" className="w-fit gap-2 px-3 py-1.5">
              <Sparkles className="h-3.5 w-3.5" />
              Không gian SmartCV
            </Badge>
            <div className="space-y-4">
              <h1 className="max-w-xl text-4xl font-semibold tracking-tight text-balance sm:text-5xl">
                Viết một lần. Tùy chỉnh mọi nơi. Hoàn thiện CV nhanh hơn.
              </h1>
              <p className="max-w-xl text-base leading-7 text-muted-foreground sm:text-lg">
                Hạ tầng CV sẵn sàng production với đăng nhập hiện đại, thiết kế sẵn cho AI và trải nghiệm như một sản phẩm SaaS cao cấp.
              </p>
            </div>
          </div>

          <Card className="border-border/80 bg-background/85 shadow-2xl shadow-primary/5">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <WandSparkles className="h-4 w-4 text-primary" />
                Sẵn sàng cho viết bằng AI
              </CardTitle>
              <CardDescription>
                Mục tiêu, tóm tắt, gạch đầu dòng và tùy chỉnh theo vị trí sẽ gắn vào cấu trúc này mà không cần sửa lại.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {authHighlights.map((item) => (
                <div key={item} className="flex items-start gap-3 text-sm text-muted-foreground">
                  <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" />
                  <span>{item}</span>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </section>

      <section className="flex items-center">
        <div className="w-full">
          <Card className="mx-auto w-full max-w-md border-border/80 shadow-2xl shadow-primary/10">
            <CardHeader>
              <CardTitle>Truy cập SmartCV</CardTitle>
              <CardDescription>Đăng nhập hoặc tạo tài khoản để tiếp tục.</CardDescription>
            </CardHeader>
            <Separator />
            <CardContent className="pt-6">{children}</CardContent>
          </Card>
        </div>
      </section>
    </main>
  );
}