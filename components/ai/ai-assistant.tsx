"use client";

import { useState, useTransition } from "react";
import { BrainCircuit, Loader2, Sparkles, WandSparkles } from "lucide-react";
import { toast } from "sonner";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { generateAIAction } from "@/actions/ai";
import type { AIResumeFeature } from "@/services/ai/types";

const features: { value: AIResumeFeature; label: string; description: string }[] = [
  { value: "career-objective", label: "Mục tiêu nghề nghiệp", description: "Mục tiêu ngắn ở đầu CV." },
  { value: "professional-summary", label: "Tóm tắt chuyên môn", description: "Tóm tắt cô đọng với tác động và từ khóa." },
  { value: "experience-bullets", label: "Gạch đầu dòng kinh nghiệm", description: "Các bullet theo hành động cho một vị trí." },
  { value: "skill-suggestions", label: "Gợi ý kỹ năng", description: "Nhóm kỹ năng phù hợp với vị trí mục tiêu." },
  { value: "tailor-cv", label: "Tùy chỉnh CV", description: "Điều chỉnh ngôn ngữ theo tiêu đề công việc hoặc tin tuyển dụng." },
];

type AIAssistantProps = {
  resumeId?: string;
  targetRole: string;
  summary: string;
};

export function AIAssistant({ resumeId, targetRole, summary }: AIAssistantProps) {
  const [isPending, startTransition] = useTransition();
  const [selectedFeature, setSelectedFeature] = useState<AIResumeFeature>("professional-summary");
  const [result, setResult] = useState<string>("");

  const handleGenerate = (feature: AIResumeFeature) => {
    setSelectedFeature(feature);
    startTransition(async () => {
      const formData = new FormData();
      formData.set("feature", feature);
      formData.set("resumeId", resumeId ?? "");
      formData.set("jobTitle", targetRole);
      formData.set("context", summary);

      const response = await generateAIAction({ success: false, message: "" }, formData);

      if (response.success && response.result) {
        setResult(response.result);
        toast.success(response.message);
      } else {
        toast.error(response.message);
      }
    });
  };

  return (
    <Card className="border-border/80 shadow-xl shadow-primary/5">
      <CardHeader>
        <Badge variant="secondary" className="w-fit gap-2 px-3 py-1.5">
          <BrainCircuit className="h-3.5 w-3.5" />
          Tạo bằng AI
        </Badge>
        <CardTitle>Tạo nội dung bằng AI</CardTitle>
        <CardDescription>
          Dùng provider giả lập trước, sau đó đổi sang LLM thật mà không cần sửa UI này.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-5">
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {features.map((feature) => (
            <button
              key={feature.value}
              type="button"
              onClick={() => handleGenerate(feature.value)}
              className="group rounded-[1.25rem] border border-border/70 bg-background/70 p-4 text-left transition-all hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/10"
            >
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold">{feature.label}</p>
                  <p className="mt-1 text-xs text-muted-foreground">{feature.description}</p>
                </div>
                <WandSparkles className="h-4 w-4 text-primary transition-transform group-hover:scale-110" />
              </div>
            </button>
          ))}
        </div>

        <div className="rounded-[1.5rem] border border-border/70 bg-secondary/20 p-5">
          {isPending ? (
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-sm font-medium text-primary">
                <Loader2 className="h-4 w-4 animate-spin" />
                Đang tạo {selectedFeature.replace("-", " ")}...
              </div>
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-5/6" />
              <Skeleton className="h-4 w-2/3" />
            </div>
          ) : result ? (
            <div className="space-y-3">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">Kết quả AI</p>
              <div className="rounded-[1.25rem] border border-border/70 bg-background p-4 text-sm leading-6 text-foreground shadow-sm">
                {result}
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-3 text-sm text-muted-foreground">
              <Sparkles className="h-4 w-4 text-primary" />
              Chọn một gợi ý để tạo nội dung và lưu vào lịch sử AI.
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}