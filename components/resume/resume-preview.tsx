import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { getTemplateLabel } from "@/lib/resume/templates";
import type { Database, Json } from "@/lib/supabase/database.types";

type ResumePreviewProps = {
  name: string;
  title: string;
  summary: string;
  accentColor: string;
  templateName?: string;
  education?: Database["public"]["Tables"]["education"]["Row"][];
  experiences?: Database["public"]["Tables"]["experiences"]["Row"][];
  skills?: Database["public"]["Tables"]["skills"]["Row"][];
  projects?: Database["public"]["Tables"]["projects"]["Row"][];
};

function formatRange(startDate?: string | null, endDate?: string | null, isCurrent?: boolean) {
  const start = startDate ?? "Bắt đầu";
  const end = isCurrent ? "Hiện tại" : endDate ?? "Kết thúc";
  return `${start} - ${end}`;
}

function toDisplayItems(items: Array<string | null | undefined>) {
  return items.filter((item): item is string => Boolean(item?.trim()));
}

function toTextArray(value: Json): string[] {
  if (Array.isArray(value)) {
    return value.filter((item): item is string => typeof item === "string");
  }

  return [];
}

function SectionTitle({ title }: { title: string }) {
  return <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">{title}</p>;
}

function SkillsRow({ skills }: { skills: string[] }) {
  return (
    <div className="flex flex-wrap gap-2">
      {skills.map((skill) => (
        <span key={skill} className="rounded-full border border-border/70 px-3 py-1 text-xs text-muted-foreground">
          {skill}
        </span>
      ))}
    </div>
  );
}

function ExperienceBlock({ experiences }: { experiences: Database["public"]["Tables"]["experiences"]["Row"][] }) {
  if (experiences.length === 0) {
    return (
      <div className="rounded-2xl border border-border/70 p-4">
        <div className="flex items-center justify-between gap-3">
          <p className="font-medium">Kỹ sư sản phẩm</p>
          <p className="text-xs text-muted-foreground">2023 - Hiện tại</p>
        </div>
        <p className="text-sm text-muted-foreground">Tên công ty · Xây dựng trải nghiệm sản phẩm đáp ứng và cải thiện quy trình chuyển đổi.</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {experiences.slice(0, 2).map((experience) => (
        <div key={experience.id} className="rounded-2xl border border-border/70 p-4">
          <div className="flex items-center justify-between gap-3">
            <p className="font-medium">{experience.job_title}</p>
            <p className="text-xs text-muted-foreground">{formatRange(experience.start_date, experience.end_date, experience.is_current)}</p>
          </div>
          <p className="text-sm text-muted-foreground">{toDisplayItems([experience.company_name, experience.employment_type, experience.location]).join(" · ")}</p>
          {experience.description ? <p className="mt-1 text-sm text-muted-foreground">{experience.description}</p> : null}
          {toTextArray(experience.achievements).length > 0 ? (
            <ul className="mt-3 space-y-1 text-xs text-muted-foreground">
              {toTextArray(experience.achievements)
                .slice(0, 3)
                .map((item) => (
                  <li key={item}>• {item}</li>
                ))}
            </ul>
          ) : null}
        </div>
      ))}
    </div>
  );
}

function EducationBlock({ education }: { education: Database["public"]["Tables"]["education"]["Row"][] }) {
  if (education.length === 0) {
    return null;
  }

  return (
    <div className="space-y-3">
      {education.slice(0, 2).map((entry) => (
        <div key={entry.id} className="rounded-2xl border border-border/70 p-4">
          <p className="font-medium">{entry.school_name}</p>
          <p className="text-sm text-muted-foreground">{toDisplayItems([entry.degree, entry.field_of_study, entry.location]).join(" · ") || "Học vấn"}</p>
          <p className="text-xs text-muted-foreground">{formatRange(entry.start_date, entry.end_date, entry.is_current)}</p>
          {entry.description ? <p className="mt-1 text-sm text-muted-foreground">{entry.description}</p> : null}
        </div>
      ))}
    </div>
  );
}

function ProjectsBlock({ projects }: { projects: Database["public"]["Tables"]["projects"]["Row"][] }) {
  if (projects.length === 0) {
    return null;
  }

  return (
    <div className="space-y-3">
      {projects.slice(0, 2).map((project) => (
        <div key={project.id} className="rounded-2xl border border-border/70 p-4">
          <p className="font-medium">{project.name}</p>
          <p className="text-sm text-muted-foreground">{project.description ?? "Tóm tắt dự án"}</p>
          <div className="mt-2 space-y-1 text-xs text-muted-foreground">
            {project.url ? (
              <a href={project.url} target="_blank" rel="noreferrer" className="block break-all text-primary underline underline-offset-4">
                Website: {project.url}
              </a>
            ) : null}
            {project.github_url ? (
              <a href={project.github_url} target="_blank" rel="noreferrer" className="block break-all text-primary underline underline-offset-4">
                GitHub: {project.github_url}
              </a>
            ) : null}
            {project.tech_stack.length > 0 ? <p>Công nghệ: {project.tech_stack.join(", ")}</p> : null}
          </div>
        </div>
      ))}
    </div>
  );
}

function DefaultPreview({
  name,
  title,
  summary,
  accentColor,
  templateLabel,
  education,
  experiences,
  skills,
  projects,
}: {
  name: string;
  title: string;
  summary: string;
  accentColor: string;
  templateLabel: string;
  education: Database["public"]["Tables"]["education"]["Row"][];
  experiences: Database["public"]["Tables"]["experiences"]["Row"][];
  skills: Database["public"]["Tables"]["skills"]["Row"][];
  projects: Database["public"]["Tables"]["projects"]["Row"][];
}) {
  return (
    <div className="space-y-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="text-2xl font-semibold tracking-tight">{name || "Tên của bạn"}</h3>
          <p className="text-sm text-muted-foreground">{title || "Vị trí mục tiêu và tiêu đề"}</p>
        </div>
        <Badge variant="outline" className="border-transparent print:border print:border-black/10" style={{ backgroundColor: `${accentColor}14`, color: accentColor }}>
          {templateLabel}
        </Badge>
      </div>

      <Separator />

      <section className="space-y-2">
        <SectionTitle title="Tóm tắt chuyên môn" />
        <p className="text-sm leading-7 text-muted-foreground">{summary || "Viết một tóm tắt ngắn gọn thể hiện giá trị, trọng tâm và loại vai trò bạn muốn tiếp theo."}</p>
      </section>

      <section className="space-y-2">
        <SectionTitle title="Kinh nghiệm" />
        <ExperienceBlock experiences={experiences} />
      </section>

      <section className="space-y-2">
        <SectionTitle title="Học vấn" />
        <EducationBlock education={education} />
      </section>

      <section className="space-y-2">
        <SectionTitle title="Kỹ năng" />
        <SkillsRow skills={skills.length > 0 ? skills.slice(0, 8).map((skill) => skill.name) : ["TypeScript", "Next.js", "Supabase", "Tailwind CSS"]} />
      </section>

      <section className="space-y-2">
        <SectionTitle title="Dự án" />
        <ProjectsBlock projects={projects} />
      </section>
    </div>
  );
}

function MinimalEditorialPreview({
  name,
  title,
  summary,
  accentColor,
  templateLabel,
  education,
  experiences,
  skills,
  projects,
}: {
  name: string;
  title: string;
  summary: string;
  accentColor: string;
  templateLabel: string;
  education: Database["public"]["Tables"]["education"]["Row"][];
  experiences: Database["public"]["Tables"]["experiences"]["Row"][];
  skills: Database["public"]["Tables"]["skills"]["Row"][];
  projects: Database["public"]["Tables"]["projects"]["Row"][];
}) {
  return (
    <div className="space-y-8 border-l-2 pl-6" style={{ borderColor: accentColor }}>
      <div className="space-y-2">
        <Badge variant="outline" className="w-fit border-transparent print:border print:border-black/10" style={{ backgroundColor: `${accentColor}14`, color: accentColor }}>
          {templateLabel}
        </Badge>
        <h3 className="text-2xl font-semibold tracking-tight">{name || "Tên của bạn"}</h3>
        <p className="text-base italic text-muted-foreground">{title || "Vị trí mục tiêu và tiêu đề"}</p>
      </div>

      <section className="space-y-2">
        <SectionTitle title="Tóm tắt chuyên môn" />
        <p className="max-w-[38rem] text-sm leading-8 text-muted-foreground">{summary || "Viết một tóm tắt ngắn gọn thể hiện giá trị, trọng tâm và loại vai trò bạn muốn tiếp theo."}</p>
      </section>

      <Separator />

      <section className="space-y-2">
        <SectionTitle title="Kinh nghiệm" />
        <ExperienceBlock experiences={experiences} />
      </section>

      <section className="space-y-2">
        <SectionTitle title="Học vấn" />
        <EducationBlock education={education} />
      </section>

      <section className="space-y-2">
        <SectionTitle title="Kỹ năng" />
        <SkillsRow skills={skills.length > 0 ? skills.slice(0, 8).map((skill) => skill.name) : ["TypeScript", "Next.js", "Supabase", "Tailwind CSS"]} />
      </section>

      <section className="space-y-2">
        <SectionTitle title="Dự án" />
        <ProjectsBlock projects={projects} />
      </section>
    </div>
  );
}

function CompactExecutivePreview({
  name,
  title,
  summary,
  accentColor,
  templateLabel,
  education,
  experiences,
  skills,
  projects,
}: {
  name: string;
  title: string;
  summary: string;
  accentColor: string;
  templateLabel: string;
  education: Database["public"]["Tables"]["education"]["Row"][];
  experiences: Database["public"]["Tables"]["experiences"]["Row"][];
  skills: Database["public"]["Tables"]["skills"]["Row"][];
  projects: Database["public"]["Tables"]["projects"]["Row"][];
}) {
  return (
    <div className="space-y-5">
      <div className="flex items-start justify-between gap-4 border-b border-border/70 pb-4">
        <div>
          <h3 className="text-xl font-semibold tracking-tight">{name || "Tên của bạn"}</h3>
          <p className="text-sm text-muted-foreground">{title || "Vị trí mục tiêu và tiêu đề"}</p>
        </div>
        <Badge variant="outline" className="border-transparent print:border print:border-black/10" style={{ backgroundColor: `${accentColor}14`, color: accentColor }}>
          {templateLabel}
        </Badge>
      </div>

      <div className="grid gap-6 md:grid-cols-[1.15fr_0.85fr]">
        <div className="space-y-4">
          <section className="space-y-2">
            <SectionTitle title="Tóm tắt chuyên môn" />
            <p className="text-sm leading-7 text-muted-foreground">{summary || "Viết một tóm tắt ngắn gọn thể hiện giá trị, trọng tâm và loại vai trò bạn muốn tiếp theo."}</p>
          </section>
          <section className="space-y-2">
            <SectionTitle title="Kinh nghiệm" />
            <ExperienceBlock experiences={experiences} />
          </section>
          <section className="space-y-2">
            <SectionTitle title="Dự án" />
            <ProjectsBlock projects={projects} />
          </section>
        </div>
        <div className="space-y-4">
          <section className="space-y-2 rounded-[1.25rem] border border-border/70 bg-background/70 p-4">
            <SectionTitle title="Học vấn" />
            <EducationBlock education={education} />
          </section>
          <section className="space-y-2 rounded-[1.25rem] border border-border/70 bg-background/70 p-4">
            <SectionTitle title="Kỹ năng" />
            <SkillsRow skills={skills.length > 0 ? skills.slice(0, 8).map((skill) => skill.name) : ["TypeScript", "Next.js", "Supabase", "Tailwind CSS"]} />
          </section>
          <div className="text-xs text-muted-foreground">Bố cục Compact Executive giúp gọn hơn cho CV cấp cao dày đặc thông tin.</div>
        </div>
      </div>
    </div>
  );
}

export function ResumePreview({
  name,
  title,
  summary,
  accentColor,
  templateName = "modern-ats",
  education = [],
  experiences = [],
  skills = [],
  projects = [],
}: ResumePreviewProps) {
  const templateLabel = getTemplateLabel(templateName);

  const surfaceClassName =
    templateName === "minimal-editorial"
      ? "flex h-full flex-col justify-between gap-8 rounded-[1.75rem] border border-border/50 p-8 shadow-none"
      : templateName === "compact-executive"
        ? "flex h-full flex-col justify-between gap-5 rounded-[1.25rem] border border-border/80 p-6 shadow-inner"
        : "flex h-full flex-col justify-between gap-6 rounded-[1.5rem] border border-border/70 p-7 shadow-inner";

  return (
    <Card className="sticky top-6 overflow-hidden rounded-[2rem] border-border/80 shadow-2xl shadow-primary/10 print:static print:shadow-none">
      <CardContent className="p-0">
        <div className="resume-preview bg-background p-8 text-[0.96rem] leading-6 text-foreground print:p-0">
          <div className={surfaceClassName} style={{ borderColor: `${accentColor}33` }}>
            {templateName === "minimal-editorial" ? (
              <MinimalEditorialPreview
                name={name}
                title={title}
                summary={summary}
                accentColor={accentColor}
                templateLabel={templateLabel}
                education={education}
                experiences={experiences}
                skills={skills}
                projects={projects}
              />
            ) : templateName === "compact-executive" ? (
              <CompactExecutivePreview
                name={name}
                title={title}
                summary={summary}
                accentColor={accentColor}
                templateLabel={templateLabel}
                education={education}
                experiences={experiences}
                skills={skills}
                projects={projects}
              />
            ) : (
              <DefaultPreview
                name={name}
                title={title}
                summary={summary}
                accentColor={accentColor}
                templateLabel={templateLabel}
                education={education}
                experiences={experiences}
                skills={skills}
                projects={projects}
              />
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}