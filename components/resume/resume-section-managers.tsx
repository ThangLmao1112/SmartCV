"use client";

import { useActionState, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, PencilLine, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  deleteEducationAction,
  deleteExperienceAction,
  deleteProjectAction,
  deleteSkillAction,
  saveEducationAction,
  saveExperienceAction,
  saveProjectAction,
  saveSkillAction,
} from "@/actions/resume-sections";
import type { Database } from "@/lib/supabase/database.types";

type EducationRow = Database["public"]["Tables"]["education"]["Row"];
type ExperienceRow = Database["public"]["Tables"]["experiences"]["Row"];
type SkillRow = Database["public"]["Tables"]["skills"]["Row"];
type ProjectRow = Database["public"]["Tables"]["projects"]["Row"];

type ResumeSectionManagersProps = {
  resumeId: string;
  education: EducationRow[];
  experiences: ExperienceRow[];
  skills: SkillRow[];
  projects: ProjectRow[];
  section: "Education" | "Experience" | "Skills" | "Projects";
};

type EducationFormState = {
  id: string;
  schoolName: string;
  degree: string;
  fieldOfStudy: string;
  startDate: string;
  endDate: string;
  isCurrent: boolean;
  location: string;
  description: string;
  sortOrder: number;
};

type ExperienceFormState = {
  id: string;
  companyName: string;
  jobTitle: string;
  employmentType: string;
  location: string;
  startDate: string;
  endDate: string;
  isCurrent: boolean;
  description: string;
  achievementsText: string;
  sortOrder: number;
};

type SkillFormState = {
  id: string;
  name: string;
  category: string;
  proficiency: number;
  sortOrder: number;
};

type ProjectFormState = {
  id: string;
  name: string;
  description: string;
  url: string;
  githubUrl: string;
  techStackText: string;
  startDate: string;
  endDate: string;
  sortOrder: number;
};

const emptyEducationForm = (): EducationFormState => ({
  id: "",
  schoolName: "",
  degree: "",
  fieldOfStudy: "",
  startDate: "",
  endDate: "",
  isCurrent: false,
  location: "",
  description: "",
  sortOrder: 0,
});

const emptyExperienceForm = (): ExperienceFormState => ({
  id: "",
  companyName: "",
  jobTitle: "",
  employmentType: "",
  location: "",
  startDate: "",
  endDate: "",
  isCurrent: false,
  description: "",
  achievementsText: "",
  sortOrder: 0,
});

const emptySkillForm = (): SkillFormState => ({
  id: "",
  name: "",
  category: "",
  proficiency: 3,
  sortOrder: 0,
});

const emptyProjectForm = (): ProjectFormState => ({
  id: "",
  name: "",
  description: "",
  url: "",
  githubUrl: "",
  techStackText: "",
  startDate: "",
  endDate: "",
  sortOrder: 0,
});

export function ResumeSectionManagers({
  resumeId,
  education,
  experiences,
  skills,
  projects,
  section,
}: ResumeSectionManagersProps) {
  return (
    <div className="space-y-6">
      {section === "Education" ? <EducationSection resumeId={resumeId} items={education} /> : null}
      {section === "Experience" ? <ExperienceSection resumeId={resumeId} items={experiences} /> : null}
      {section === "Skills" ? <SkillSection resumeId={resumeId} items={skills} /> : null}
      {section === "Projects" ? <ProjectSection resumeId={resumeId} items={projects} /> : null}
    </div>
  );
}

function useSectionRefresh(message: string) {
  const router = useRouter();

  useEffect(() => {
    if (message) {
      toast.success(message);
      router.refresh();
    }
  }, [message, router]);
}

function EducationSection({ resumeId, items }: { resumeId: string; items: EducationRow[] }) {
  const [form, setForm] = useState<EducationFormState>(emptyEducationForm);
  const [state, formAction, isPending] = useActionState(saveEducationAction, { success: false, message: "" });
  useSectionRefresh(state.success ? state.message : "");

  return (
    <SectionShell title="Học vấn" description="Thêm trường học, bằng cấp và ngày tốt nghiệp." badge="Học vấn">
      <SectionFormCard
        onReset={() => setForm(emptyEducationForm())}
        formAction={formAction}
        isPending={isPending}
        submitLabel={form.id ? "Cập nhật học vấn" : "Thêm học vấn"}
      >
        <input type="hidden" name="resumeId" value={resumeId} />
        <input type="hidden" name="id" value={form.id} />
        <input type="hidden" name="sortOrder" value={form.sortOrder} />
        <div className="grid gap-4 md:grid-cols-2">
          <Field label="Tên trường"><Input name="schoolName" value={form.schoolName} onChange={(event) => setForm((current) => ({ ...current, schoolName: event.target.value }))} /></Field>
          <Field label="Bằng cấp"><Input name="degree" value={form.degree} onChange={(event) => setForm((current) => ({ ...current, degree: event.target.value }))} /></Field>
          <Field label="Chuyên ngành"><Input name="fieldOfStudy" value={form.fieldOfStudy} onChange={(event) => setForm((current) => ({ ...current, fieldOfStudy: event.target.value }))} /></Field>
          <Field label="Địa điểm"><Input name="location" value={form.location} onChange={(event) => setForm((current) => ({ ...current, location: event.target.value }))} /></Field>
          <Field label="Ngày bắt đầu"><Input name="startDate" type="date" value={form.startDate} onChange={(event) => setForm((current) => ({ ...current, startDate: event.target.value }))} /></Field>
          <Field label="Ngày kết thúc"><Input name="endDate" type="date" value={form.endDate} onChange={(event) => setForm((current) => ({ ...current, endDate: event.target.value }))} /></Field>
        </div>
        <Field label="Mô tả"><Textarea name="description" value={form.description} onChange={(event) => setForm((current) => ({ ...current, description: event.target.value }))} /></Field>
        <label className="flex items-center gap-3 text-sm text-muted-foreground">
          <input type="checkbox" name="isCurrent" checked={form.isCurrent} onChange={(event) => setForm((current) => ({ ...current, isCurrent: event.target.checked }))} />
          Đang học
        </label>
        <div className="flex flex-wrap gap-3">
          <Button type="submit" disabled={isPending}><Plus className="h-4 w-4" />{form.id ? "Cập nhật" : "Thêm"}</Button>
          <Button type="button" variant="outline" onClick={() => setForm(emptyEducationForm())}>Xóa</Button>
        </div>
      </SectionFormCard>

      <ItemsList
        items={items}
        renderItem={(item) => (
          <div className="space-y-2 rounded-[1.25rem] border border-border/70 bg-background/70 p-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="font-medium">{item.school_name}</p>
                <p className="text-sm text-muted-foreground">{item.degree ?? "Chưa có bằng cấp"}</p>
              </div>
              <div className="flex gap-2">
                <Button type="button" variant="ghost" size="icon" onClick={() => setForm({
                  id: item.id,
                  schoolName: item.school_name,
                  degree: item.degree ?? "",
                  fieldOfStudy: item.field_of_study ?? "",
                  startDate: item.start_date ?? "",
                  endDate: item.end_date ?? "",
                  isCurrent: item.is_current,
                  location: item.location ?? "",
                  description: item.description ?? "",
                  sortOrder: item.sort_order,
                })}><PencilLine className="h-4 w-4" /></Button>
                <form action={deleteEducationAction.bind(null, resumeId, item.id)}>
                  <Button type="submit" variant="ghost" size="icon" className="text-destructive"><Trash2 className="h-4 w-4" /></Button>
                </form>
              </div>
            </div>
            <p className="text-sm text-muted-foreground">{item.field_of_study ?? item.location ?? ""}</p>
          </div>
        )}
        emptyText="Chưa có mục học vấn nào."
      />
    </SectionShell>
  );
}

function ExperienceSection({ resumeId, items }: { resumeId: string; items: ExperienceRow[] }) {
  const [form, setForm] = useState<ExperienceFormState>(emptyExperienceForm);
  const [state, formAction, isPending] = useActionState(saveExperienceAction, { success: false, message: "" });
  useSectionRefresh(state.success ? state.message : "");

  return (
    <SectionShell title="Experience" description="Add work history and measurable impact." badge="Experience">
      <SectionFormCard onReset={() => setForm(emptyExperienceForm())} formAction={formAction} isPending={isPending} submitLabel={form.id ? "Update experience" : "Add experience"}>
        <input type="hidden" name="resumeId" value={resumeId} />
        <input type="hidden" name="id" value={form.id} />
        <input type="hidden" name="sortOrder" value={form.sortOrder} />
        <div className="grid gap-4 md:grid-cols-2">
          <Field label="Company name"><Input name="companyName" value={form.companyName} onChange={(event) => setForm((current) => ({ ...current, companyName: event.target.value }))} /></Field>
          <Field label="Job title"><Input name="jobTitle" value={form.jobTitle} onChange={(event) => setForm((current) => ({ ...current, jobTitle: event.target.value }))} /></Field>
          <Field label="Employment type"><Input name="employmentType" value={form.employmentType} onChange={(event) => setForm((current) => ({ ...current, employmentType: event.target.value }))} /></Field>
          <Field label="Location"><Input name="location" value={form.location} onChange={(event) => setForm((current) => ({ ...current, location: event.target.value }))} /></Field>
          <Field label="Start date"><Input name="startDate" type="date" value={form.startDate} onChange={(event) => setForm((current) => ({ ...current, startDate: event.target.value }))} /></Field>
          <Field label="End date"><Input name="endDate" type="date" value={form.endDate} onChange={(event) => setForm((current) => ({ ...current, endDate: event.target.value }))} /></Field>
        </div>
        <Field label="Description"><Textarea name="description" value={form.description} onChange={(event) => setForm((current) => ({ ...current, description: event.target.value }))} /></Field>
        <Field label="Achievements, one per line"><Textarea name="achievementsText" value={form.achievementsText} onChange={(event) => setForm((current) => ({ ...current, achievementsText: event.target.value }))} /></Field>
        <label className="flex items-center gap-3 text-sm text-muted-foreground">
          <input type="checkbox" name="isCurrent" checked={form.isCurrent} onChange={(event) => setForm((current) => ({ ...current, isCurrent: event.target.checked }))} />
          Currently working here
        </label>
        <div className="flex flex-wrap gap-3">
          <Button type="submit" disabled={isPending}><Plus className="h-4 w-4" />{form.id ? "Update" : "Add"}</Button>
          <Button type="button" variant="outline" onClick={() => setForm(emptyExperienceForm())}>Clear</Button>
        </div>
      </SectionFormCard>

      <ItemsList
        items={items}
        renderItem={(item) => (
          <div className="space-y-2 rounded-[1.25rem] border border-border/70 bg-background/70 p-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="font-medium">{item.job_title}</p>
                <p className="text-sm text-muted-foreground">{item.company_name}</p>
              </div>
              <div className="flex gap-2">
                <Button type="button" variant="ghost" size="icon" onClick={() => setForm({
                  id: item.id,
                  companyName: item.company_name,
                  jobTitle: item.job_title,
                  employmentType: item.employment_type ?? "",
                  location: item.location ?? "",
                  startDate: item.start_date ?? "",
                  endDate: item.end_date ?? "",
                  isCurrent: item.is_current,
                  description: item.description ?? "",
                  achievementsText: Array.isArray(item.achievements) ? item.achievements.join("\n") : "",
                  sortOrder: item.sort_order,
                })}><PencilLine className="h-4 w-4" /></Button>
                <form action={deleteExperienceAction.bind(null, resumeId, item.id)}>
                  <Button type="submit" variant="ghost" size="icon" className="text-destructive"><Trash2 className="h-4 w-4" /></Button>
                </form>
              </div>
            </div>
          </div>
        )}
        emptyText="No experience entries yet."
      />
    </SectionShell>
  );
}

function SkillSection({ resumeId, items }: { resumeId: string; items: SkillRow[] }) {
  const [form, setForm] = useState<SkillFormState>(emptySkillForm);
  const [state, formAction, isPending] = useActionState(saveSkillAction, { success: false, message: "" });
  useSectionRefresh(state.success ? state.message : "");

  return (
    <SectionShell title="Skills" description="Capture your strongest technical and soft skills." badge="Skills">
      <SectionFormCard onReset={() => setForm(emptySkillForm())} formAction={formAction} isPending={isPending} submitLabel={form.id ? "Update skill" : "Add skill"}>
        <input type="hidden" name="resumeId" value={resumeId} />
        <input type="hidden" name="id" value={form.id} />
        <input type="hidden" name="sortOrder" value={form.sortOrder} />
        <div className="grid gap-4 md:grid-cols-2">
          <Field label="Skill name"><Input name="name" value={form.name} onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))} /></Field>
          <Field label="Category"><Input name="category" value={form.category} onChange={(event) => setForm((current) => ({ ...current, category: event.target.value }))} /></Field>
          <Field label="Proficiency 1-5"><Input name="proficiency" type="number" min={1} max={5} value={form.proficiency} onChange={(event) => setForm((current) => ({ ...current, proficiency: Number(event.target.value) }))} /></Field>
        </div>
        <div className="flex flex-wrap gap-3">
          <Button type="submit" disabled={isPending}><Plus className="h-4 w-4" />{form.id ? "Update" : "Add"}</Button>
          <Button type="button" variant="outline" onClick={() => setForm(emptySkillForm())}>Clear</Button>
        </div>
      </SectionFormCard>

      <div className="flex flex-wrap gap-2">
        {items.length === 0 ? (
          <EmptyState text="No skills added yet." />
        ) : (
          items.map((item) => (
            <div key={item.id} className="flex items-center gap-2 rounded-full border border-border/70 bg-background/70 px-3 py-2 text-sm">
              <span>{item.name}</span>
              <Button type="button" variant="ghost" size="icon" className="h-7 w-7" onClick={() => setForm({
                id: item.id,
                name: item.name,
                category: item.category ?? "",
                proficiency: item.proficiency ?? 3,
                sortOrder: item.sort_order,
              })}><PencilLine className="h-3.5 w-3.5" /></Button>
              <form action={deleteSkillAction.bind(null, resumeId, item.id)}>
                <Button type="submit" variant="ghost" size="icon" className="h-7 w-7 text-destructive"><Trash2 className="h-3.5 w-3.5" /></Button>
              </form>
            </div>
          ))
        )}
      </div>
    </SectionShell>
  );
}

function ProjectSection({ resumeId, items }: { resumeId: string; items: ProjectRow[] }) {
  const [form, setForm] = useState<ProjectFormState>(emptyProjectForm);
  const [state, formAction, isPending] = useActionState(saveProjectAction, { success: false, message: "" });
  useSectionRefresh(state.success ? state.message : "");

  return (
    <SectionShell title="Projects" description="Showcase the work that proves your value." badge="Projects">
      <SectionFormCard onReset={() => setForm(emptyProjectForm())} formAction={formAction} isPending={isPending} submitLabel={form.id ? "Update project" : "Add project"}>
        <input type="hidden" name="resumeId" value={resumeId} />
        <input type="hidden" name="id" value={form.id} />
        <input type="hidden" name="sortOrder" value={form.sortOrder} />
        <div className="grid gap-4 md:grid-cols-2">
          <Field label="Project name"><Input name="name" value={form.name} onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))} /></Field>
          <Field label="Website URL"><Input name="url" value={form.url} onChange={(event) => setForm((current) => ({ ...current, url: event.target.value }))} /></Field>
          <Field label="GitHub URL"><Input name="githubUrl" value={form.githubUrl} onChange={(event) => setForm((current) => ({ ...current, githubUrl: event.target.value }))} /></Field>
          <Field label="Tech stack, comma separated"><Input name="techStackText" value={form.techStackText} onChange={(event) => setForm((current) => ({ ...current, techStackText: event.target.value }))} /></Field>
          <Field label="Start date"><Input name="startDate" type="date" value={form.startDate} onChange={(event) => setForm((current) => ({ ...current, startDate: event.target.value }))} /></Field>
          <Field label="End date"><Input name="endDate" type="date" value={form.endDate} onChange={(event) => setForm((current) => ({ ...current, endDate: event.target.value }))} /></Field>
        </div>
        <Field label="Description"><Textarea name="description" value={form.description} onChange={(event) => setForm((current) => ({ ...current, description: event.target.value }))} /></Field>
        <div className="flex flex-wrap gap-3">
          <Button type="submit" disabled={isPending}><Plus className="h-4 w-4" />{form.id ? "Update" : "Add"}</Button>
          <Button type="button" variant="outline" onClick={() => setForm(emptyProjectForm())}>Clear</Button>
        </div>
      </SectionFormCard>

      <ItemsList
        items={items}
        renderItem={(item) => (
          <div className="space-y-2 rounded-[1.25rem] border border-border/70 bg-background/70 p-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="font-medium">{item.name}</p>
                <p className="text-sm text-muted-foreground">{item.description ?? "No description"}</p>
              </div>
              <div className="flex gap-2">
                <Button type="button" variant="ghost" size="icon" onClick={() => setForm({
                  id: item.id,
                  name: item.name,
                  description: item.description ?? "",
                  url: item.url ?? "",
                  githubUrl: item.github_url ?? "",
                  techStackText: item.tech_stack.join(", "),
                  startDate: item.start_date ?? "",
                  endDate: item.end_date ?? "",
                  sortOrder: item.sort_order,
                })}><PencilLine className="h-4 w-4" /></Button>
                <form action={deleteProjectAction.bind(null, resumeId, item.id)}>
                  <Button type="submit" variant="ghost" size="icon" className="text-destructive"><Trash2 className="h-4 w-4" /></Button>
                </form>
              </div>
            </div>
          </div>
        )}
        emptyText="No project entries yet."
      />
    </SectionShell>
  );
}

function SectionShell({ title, description, badge, children }: { title: string; description: string; badge: string; children: React.ReactNode }) {
  return (
    <Card className="border-border/80 shadow-xl shadow-primary/5">
      <CardHeader>
        <Badge variant="secondary" className="w-fit">{badge}</Badge>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-5">{children}</CardContent>
    </Card>
  );
}

function SectionFormCard({
  children,
  formAction,
  isPending,
  submitLabel,
  onReset,
}: {
  children: React.ReactNode;
  formAction: (formData: FormData) => void;
  isPending: boolean;
  submitLabel: string;
  onReset: () => void;
}) {
  return (
    <form action={formAction} className="space-y-4 rounded-[1.5rem] border border-border/70 bg-background/70 p-5">
      {children}
      <div className="flex flex-wrap gap-3">
        <Button type="submit" disabled={isPending}><Plus className="h-4 w-4" />{submitLabel}</Button>
        <Button type="button" variant="outline" onClick={onReset}>Reset</Button>
      </div>
    </form>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-2">
      <Label className="text-sm font-medium">{label}</Label>
      {children}
    </div>
  );
}

function ItemsList<T extends { id: string }>({
  items,
  renderItem,
  emptyText,
}: {
  items: T[];
  renderItem: (item: T) => React.ReactNode;
  emptyText: string;
}) {
  if (items.length === 0) {
    return <EmptyState text={emptyText} />;
  }

  return <div className="space-y-3">{items.map((item) => <div key={item.id}>{renderItem(item)}</div>)}</div>;
}

function EmptyState({ text }: { text: string }) {
  return <div className="rounded-[1.25rem] border border-dashed border-border/70 bg-secondary/20 p-4 text-sm text-muted-foreground">{text}</div>;
}