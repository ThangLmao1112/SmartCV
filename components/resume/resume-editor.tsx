"use client";

import { useMemo, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { ResumePreview } from "@/components/resume/resume-preview";
import { AIAssistant } from "@/components/ai/ai-assistant";
import { ResumeSectionManagers } from "@/components/resume/resume-section-managers";
import { Sparkles, WandSparkles } from "lucide-react";
import Link from "next/link";
import type { Database } from "@/lib/supabase/database.types";
import { resumeTemplateOptions, type ResumeTemplateName } from "@/lib/resume/templates";

type ResumeEditorProps = {
  resumeId?: string;
  initialName?: string;
  initialHeadline?: string;
  initialSummary?: string;
  initialAccentColor?: string;
  initialTemplateName?: string;
  education?: Database["public"]["Tables"]["education"]["Row"][];
  experiences?: Database["public"]["Tables"]["experiences"]["Row"][];
  skills?: Database["public"]["Tables"]["skills"]["Row"][];
  projects?: Database["public"]["Tables"]["projects"]["Row"][];
};

const sectionLabels = ["Thông tin cá nhân", "Học vấn", "Kinh nghiệm", "Kỹ năng", "Dự án"] as const;

export function ResumeEditor({
  resumeId,
  initialName = "Your Name",
  initialHeadline = "Frontend Engineer",
  initialSummary = "Kỹ sư tập trung vào giao diện sạch, hệ thống thiết kế có thể mở rộng và trải nghiệm người dùng nhanh.",
  initialAccentColor = "#2563eb",
  initialTemplateName = "modern-ats",
  education = [],
  experiences = [],
  skills = [],
  projects = [],
}: ResumeEditorProps) {
  const [name, setName] = useState(initialName);
  const [headline, setHeadline] = useState(initialHeadline);
  const [summary, setSummary] = useState(initialSummary);
  const [accentColor, setAccentColor] = useState(initialAccentColor);
  const [templateName, setTemplateName] = useState<ResumeTemplateName>(initialTemplateName as ResumeTemplateName);
  const [activeSection, setActiveSection] = useState<(typeof sectionLabels)[number]>("Personal Info");

  const quickActions = useMemo(
    () => [
      { label: "Tạo tóm tắt", icon: WandSparkles },
      { label: "Tùy chỉnh theo vị trí", icon: Sparkles },
    ],
    []
  );

  return (
    <div className="grid gap-6 lg:grid-cols-[1.02fr_0.98fr]">
      <section className="space-y-6">
        <Card className="border-border/80 shadow-xl shadow-primary/5">
          <CardHeader>
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="space-y-3">
                <Badge variant="secondary" className="w-fit">Sẵn sàng autosave</Badge>
                <CardTitle>Trình chỉnh sửa CV{resumeId ? ` #${resumeId}` : ""}</CardTitle>
              </div>
              {resumeId ? (
                <Button asChild variant="outline" className="rounded-full">
                  <Link href={`/dashboard/resumes/${resumeId}/print`}>Mở chế độ in</Link>
                </Button>
              ) : null}
            </div>
            <CardDescription>
              Chỉnh sửa các mục bên trái và xem bản xem trước cập nhật theo thời gian thực bên phải.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs value={activeSection} onValueChange={(value) => setActiveSection(value as (typeof sectionLabels)[number])}>
              <TabsList className="mb-6 grid w-full grid-cols-5">
                {sectionLabels.map((label) => (
                  <TabsTrigger key={label} value={label}>
                    {label}
                  </TabsTrigger>
                ))}
              </TabsList>

              <TabsContent value="Personal Info" className="mt-0 space-y-5">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                      <Label htmlFor="resume-name">Họ và tên</Label>
                      <Input id="resume-name" value={name} onChange={(event) => setName(event.target.value)} placeholder="Tên của bạn" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="headline">Tiêu đề</Label>
                    <Input id="headline" value={headline} onChange={(event) => setHeadline(event.target.value)} placeholder="Vị trí mục tiêu" />
                  </div>
                </div>
                <div className="space-y-2">
                    <Label htmlFor="summary">Tóm tắt</Label>
                  <Textarea id="summary" value={summary} onChange={(event) => setSummary(event.target.value)} />
                </div>
                <div className="grid gap-4 sm:grid-cols-[1fr_auto] sm:items-end">
                  <div className="space-y-2">
                    <Label htmlFor="accent">Màu nhấn</Label>
                    <Input id="accent" type="color" value={accentColor} onChange={(event) => setAccentColor(event.target.value)} className="h-11 w-20 p-1" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="templateName">Mẫu</Label>
                    <select
                      id="templateName"
                      value={templateName}
                      onChange={(event) => setTemplateName(event.target.value as ResumeTemplateName)}
                      className="h-11 rounded-full border border-input bg-background px-4 text-sm text-foreground shadow-sm outline-none transition-colors focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                    >
                      {resumeTemplateOptions.map((template) => (
                        <option key={template.value} value={template.value}>
                          {template.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="flex flex-wrap gap-3">
                      {quickActions.map((action) => {
                      const Icon = action.icon;
                      return (
                        <Button key={action.label} type="button" variant="outline" className="rounded-full">
                          <Icon className="h-4 w-4" />
                          {action.label}
                        </Button>
                      );
                    })}
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="Education" className="mt-0 space-y-4">
                {resumeId ? (
                  <ResumeSectionManagers
                    resumeId={resumeId}
                    education={education}
                    experiences={experiences}
                    skills={skills}
                    projects={projects}
                    section="Education"
                  />
                ) : (
                  <SectionPlaceholder title="Save the resume first" description="Section CRUD is available after the resume exists in Supabase." />
                )}
              </TabsContent>

              <TabsContent value="Experience" className="mt-0 space-y-4">
                {resumeId ? (
                  <ResumeSectionManagers
                    resumeId={resumeId}
                    education={education}
                    experiences={experiences}
                    skills={skills}
                    projects={projects}
                    section="Experience"
                  />
                ) : (
                  <SectionPlaceholder title="Save the resume first" description="Section CRUD is available after the resume exists in Supabase." />
                )}
              </TabsContent>

              <TabsContent value="Skills" className="mt-0 space-y-4">
                {resumeId ? (
                  <ResumeSectionManagers
                    resumeId={resumeId}
                    education={education}
                    experiences={experiences}
                    skills={skills}
                    projects={projects}
                    section="Skills"
                  />
                ) : (
                  <SectionPlaceholder title="Save the resume first" description="Section CRUD is available after the resume exists in Supabase." />
                )}
              </TabsContent>

              <TabsContent value="Projects" className="mt-0 space-y-4">
                {resumeId ? (
                  <ResumeSectionManagers
                    resumeId={resumeId}
                    education={education}
                    experiences={experiences}
                    skills={skills}
                    projects={projects}
                    section="Projects"
                  />
                ) : (
                  <SectionPlaceholder title="Save the resume first" description="Section CRUD is available after the resume exists in Supabase." />
                )}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        <Card className="border-border/80 bg-background/80">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <WandSparkles className="h-4 w-4 text-primary" />
              Sẵn sàng hành động AI
            </CardTitle>
            <CardDescription>Mỗi mục có thể có nút Tạo bằng AI ngay cạnh các trường liên quan trong tương lai.</CardDescription>
          </CardHeader>
        </Card>

        <AIAssistant resumeId={resumeId} targetRole={headline} summary={summary} />
      </section>

      <div>
        <ResumePreview
          name={name}
          title={headline}
          summary={summary}
          accentColor={accentColor}
          templateName={templateName}
          education={education}
          experiences={experiences}
          skills={skills}
          projects={projects}
        />
      </div>
    </div>
  );
}

function SectionPlaceholder({ title, description }: { title: string; description: string }) {
  return (
    <div className="rounded-[1.5rem] border border-dashed border-border/80 bg-secondary/20 p-5">
      <div className="space-y-2">
        <p className="font-medium">{title}</p>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
      <Separator className="my-4" />
      <div className="grid gap-3 sm:grid-cols-2">
        <div className="rounded-2xl border border-border/70 bg-background/70 p-4 text-sm text-muted-foreground">Empty state placeholder</div>
        <div className="rounded-2xl border border-border/70 bg-background/70 p-4 text-sm text-muted-foreground">Add item and AI helper buttons will appear here</div>
      </div>
    </div>
  );
}