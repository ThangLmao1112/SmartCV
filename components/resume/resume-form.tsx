"use client";

import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { PencilLine, Save, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { createResumeAction, updateResumeAction } from "@/actions/resume";
import { resumeSettingsSchema, type ResumeSettingsValues } from "@/schemas/resume";
import type { z } from "zod";
import { resumeTemplateOptions } from "@/lib/resume/templates";

type ResumeFormInput = z.input<typeof resumeSettingsSchema>;

type ResumeFormProps = {
  mode: "create" | "update";
  resumeId?: string;
  defaultValues: ResumeFormInput;
};

export function ResumeForm({ mode, resumeId, defaultValues }: ResumeFormProps) {
  const [isPending, startTransition] = useTransition();
  const [submitMessage, setSubmitMessage] = useState<string | null>(null);
  const form = useForm<ResumeFormInput>({
    resolver: zodResolver(resumeSettingsSchema),
    defaultValues,
  });

  const onSubmit = form.handleSubmit((values) => {
    setSubmitMessage(null);

    startTransition(async () => {
      const formData = new FormData();
      formData.set("title", values.title);
      formData.set("targetRole", values.targetRole ?? "");
      formData.set("summary", values.summary ?? "");
      formData.set("templateName", values.templateName);
      formData.set("accentColor", values.accentColor);
      formData.set("isDefault", values.isDefault ? "true" : "false");

      const response =
        mode === "create"
          ? await createResumeAction({ success: false, message: "" }, formData)
          : await updateResumeAction(resumeId ?? "", { success: false, message: "" }, formData);

      if (response?.message) {
        setSubmitMessage(response.message);
        toast(response.message);
      }
    });
  });

  return (
    <Card className="border-border/80 shadow-xl shadow-primary/5">
      <CardHeader>
        <Badge variant="secondary" className="w-fit gap-2 px-3 py-1.5">
          <PencilLine className="h-3.5 w-3.5" />
          Cài đặt CV
        </Badge>
        <CardTitle>{mode === "create" ? "Tạo CV" : "Cập nhật CV"}</CardTitle>
        <CardDescription>
          Thiết lập metadata cho thẻ dashboard, lựa chọn template và xem trước trong trình chỉnh sửa.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form className="space-y-5" onSubmit={onSubmit} noValidate>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="title">Tiêu đề CV</Label>
              <Input id="title" placeholder="CV Product Designer" {...form.register("title")} />
              {form.formState.errors.title ? <p className="text-xs text-destructive">{form.formState.errors.title.message}</p> : null}
            </div>
            <div className="space-y-2">
              <Label htmlFor="targetRole">Vị trí mục tiêu</Label>
              <Input id="targetRole" placeholder="Frontend Engineer" {...form.register("targetRole")} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="templateName">Mẫu</Label>
              <select
                id="templateName"
                className="h-11 w-full rounded-full border border-input bg-background px-4 text-sm shadow-sm outline-none transition-colors focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                {...form.register("templateName")}
              >
                {resumeTemplateOptions.map((template) => (
                  <option key={template.value} value={template.value}>
                    {template.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="accentColor">Màu nhấn</Label>
              <Input id="accentColor" type="color" className="h-11 w-20 p-1" {...form.register("accentColor")} />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="summary">Tóm tắt</Label>
            <Textarea id="summary" placeholder="Tóm tắt ngắn về CV" {...form.register("summary")} />
          </div>

          <label className="flex items-center gap-3 rounded-2xl border border-border/70 bg-background/70 px-4 py-3 text-sm">
            <input type="checkbox" className="h-4 w-4 rounded border-border" {...form.register("isDefault")} />
            Đặt làm CV mặc định
          </label>

          {submitMessage ? <p className="rounded-2xl border border-primary/20 bg-primary/5 px-4 py-3 text-sm text-primary">{submitMessage}</p> : null}

          <Button type="submit" disabled={isPending}>
            {isPending ? "Đang lưu..." : mode === "create" ? "Tạo CV" : "Lưu thay đổi"}
            <Save className="h-4 w-4" />
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}