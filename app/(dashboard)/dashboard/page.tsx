import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FileText, Sparkles, Users, WandSparkles } from "lucide-react";

const stats = [
  { label: "CV", value: "04", icon: FileText },
  { label: "Bản nháp AI", value: "12", icon: WandSparkles },
  { label: "Hoàn thiện hồ sơ", value: "86%", icon: Users },
] as const;

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <section className="grid gap-4 md:grid-cols-3">
        {stats.map((item) => {
          const Icon = item.icon;
          return (
            <Card key={item.label}>
              <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
                <div>
                  <CardDescription>{item.label}</CardDescription>
                  <CardTitle className="mt-2 text-3xl">{item.value}</CardTitle>
                </div>
                <div className="rounded-2xl bg-primary/10 p-3 text-primary">
                  <Icon className="h-5 w-5" />
                </div>
              </CardHeader>
            </Card>
          );
        })}
      </section>

      <Card>
        <CardHeader>
          <Badge variant="secondary" className="w-fit gap-2 px-3 py-1.5">
            <Sparkles className="h-3.5 w-3.5" />
            Hành động nhanh
          </Badge>
          <CardTitle>Tổng quan không gian làm CV</CardTitle>
          <CardDescription>
            Không gian làm việc này sẽ hỗ trợ autosave, quản lý CV gần đây và công cụ tạo nội dung bằng AI.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-3 sm:grid-cols-3">
          {[
            "Tạo CV mới",
            "Mở dự án gần đây",
            "Thử gợi ý AI",
          ].map((item) => (
            <div key={item} className="rounded-[1.25rem] border border-border/70 bg-background/70 p-4 text-sm font-medium">
              {item}
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}