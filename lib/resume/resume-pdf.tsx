import path from "path";
import { Document, Font, Page, StyleSheet, Text, View, Image } from "@react-pdf/renderer";
import type { Database, Json } from "@/lib/supabase/database.types";
import type { ResumeTemplateVariant } from "@/lib/resume/templates";

type ResumeRow = Database["public"]["Tables"]["resumes"]["Row"];
type EducationRow = Database["public"]["Tables"]["education"]["Row"];
type ExperienceRow = Database["public"]["Tables"]["experiences"]["Row"];
type SkillRow = Database["public"]["Tables"]["skills"]["Row"];
type ProjectRow = Database["public"]["Tables"]["projects"]["Row"];

const notoSansVietnamese400 = path.join(
  process.cwd(),
  "node_modules",
  "@fontsource",
  "noto-sans",
  "files",
  "noto-sans-vietnamese-400-normal.woff",
);

const notoSansVietnamese700 = path.join(
  process.cwd(),
  "node_modules",
  "@fontsource",
  "noto-sans",
  "files",
  "noto-sans-vietnamese-700-normal.woff",
);

Font.register({
  family: "Noto Sans",
  fonts: [
    { src: notoSansVietnamese400, fontWeight: 400 },
    { src: notoSansVietnamese700, fontWeight: 700 },
  ],
});

export type ResumePdfData = {
  resume: ResumeRow;
  education: EducationRow[];
  experiences: ExperienceRow[];
  skills: SkillRow[];
  projects: ProjectRow[];
  profile?: Database["public"]["Tables"]["profiles"]["Row"] | null;
};

const styles = StyleSheet.create({
  page: {
    paddingTop: 28,
    paddingBottom: 28,
    paddingHorizontal: 36,
    fontSize: 10,
    color: "#111827",
    fontFamily: "Noto Sans",
  },
  header: {
    marginBottom: 18,
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#d1d5db",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  title: {
    fontSize: 24,
    fontWeight: 700,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 12,
    color: "#4b5563",
    marginBottom: 6,
  },
  summary: {
    lineHeight: 1.5,
    color: "#374151",
  },
  section: {
    marginBottom: 14,
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: 700,
    marginBottom: 6,
    textTransform: "uppercase",
    letterSpacing: 0.8,
    color: "#111827",
  },
  entry: {
    marginBottom: 8,
  },
  entryTitle: {
    fontSize: 10.5,
    fontWeight: 700,
  },
  muted: {
    color: "#4b5563",
  },
  bullets: {
    marginTop: 4,
    paddingLeft: 10,
  },
  bullet: {
    marginBottom: 2,
  },
  chipRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
  },
  chip: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: "#d1d5db",
    borderRadius: 999,
    marginRight: 6,
    marginBottom: 6,
  },
  chipText: {
    fontSize: 9,
  },
  executiveGrid: {
    flexDirection: "row",
    gap: 18,
  },
  executiveColumn: {
    flex: 1,
  },
  headerLeft: {
    flex: 1,
    marginRight: 12,
  },
  avatar: {
    width: 72,
    height: 72,
    borderRadius: 36,
    overflow: "hidden",
  },
  avatarCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: "#e5e7eb",
    alignItems: "center",
    justifyContent: "center",
  },
  avatarInitials: {
    fontSize: 22,
    fontWeight: 700,
    color: "#111827",
  },
});

function formatRange(startDate?: string | null, endDate?: string | null, isCurrent?: boolean) {
  const start = startDate ?? "Start";
  const end = isCurrent ? "Present" : endDate ?? "End";
  return `${start} - ${end}`;
}

function toDisplayItems(items: Array<string | null | undefined>) {
  return items.filter((item): item is string => Boolean(item?.trim()));
}

const fallbackSummary = "Viết một tóm tắt ngắn gọn thể hiện giá trị, trọng tâm và loại vai trò bạn muốn tiếp theo.";

const fallbackSkills = ["TypeScript", "Next.js", "Supabase", "Tailwind CSS"];

function toTextArray(value: Json): string[] {
  if (Array.isArray(value)) {
    return value.filter((item): item is string => typeof item === "string");
  }

  return [];
}

function renderExperience(experiences: ExperienceRow[]) {
  if (experiences.length === 0) {
    return (
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Experience</Text>
        <View style={styles.entry}>
          <Text style={styles.entryTitle}>Kỹ sư sản phẩm</Text>
          <Text style={styles.muted}>2023 - Present</Text>
          <Text style={styles.muted}>Xây dựng trải nghiệm sản phẩm đáp ứng và cải thiện quy trình chuyển đổi.</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Experience</Text>
      {experiences.map((entry) => (
        <View key={entry.id} style={styles.entry}>
          <Text style={styles.entryTitle}>{entry.job_title}</Text>
          <Text style={styles.muted}>{toDisplayItems([entry.company_name, entry.employment_type, entry.location]).join(" · ")}</Text>
          <Text style={styles.muted}>{formatRange(entry.start_date, entry.end_date, entry.is_current)}</Text>
          {entry.description ? <Text style={styles.muted}>{entry.description}</Text> : null}
          {toTextArray(entry.achievements).length > 0 ? (
            <View style={styles.bullets}>
              {toTextArray(entry.achievements).map((item) => (
                <Text key={item} style={styles.bullet}>
                  • {item}
                </Text>
              ))}
            </View>
          ) : null}
        </View>
      ))}
    </View>
  );
}

function renderEducation(education: EducationRow[]) {
  if (education.length === 0) {
    return (
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Education</Text>
        <View style={styles.entry}>
          <Text style={styles.entryTitle}>Đại học / Cao đẳng</Text>
          <Text style={styles.muted}>Bằng cấp · Chuyên ngành</Text>
          <Text style={styles.muted}>Start - End</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Education</Text>
      {education.map((entry) => (
        <View key={entry.id} style={styles.entry}>
          <Text style={styles.entryTitle}>{entry.school_name}</Text>
          <Text style={styles.muted}>{toDisplayItems([entry.degree, entry.field_of_study, entry.location]).join(" · ") || "Education"}</Text>
          <Text style={styles.muted}>{formatRange(entry.start_date, entry.end_date, entry.is_current)}</Text>
          {entry.description ? <Text style={styles.muted}>{entry.description}</Text> : null}
        </View>
      ))}
    </View>
  );
}

function renderSkills(skills: SkillRow[]) {
  const items = skills.length > 0 ? skills.map((skill) => skill.name) : fallbackSkills;

  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Skills</Text>
      <View style={styles.chipRow}>
        {items.map((skill) => (
          <View key={skill} style={styles.chip}>
            <Text style={styles.chipText}>{skill}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

function renderProjects(projects: ProjectRow[]) {
  if (projects.length === 0) {
    return (
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Projects</Text>
        <View style={styles.entry}>
          <Text style={styles.entryTitle}>Sản phẩm mẫu</Text>
          <Text style={styles.muted}>Tóm tắt dự án</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Projects</Text>
      {projects.map((entry) => (
        <View key={entry.id} style={styles.entry}>
          <Text style={styles.entryTitle}>{entry.name}</Text>
          <Text style={styles.muted}>{formatRange(entry.start_date, entry.end_date)}</Text>
          {entry.description ? <Text style={styles.muted}>{entry.description}</Text> : null}
          {entry.url ? <Text style={styles.muted}>Website: {entry.url}</Text> : null}
          {entry.github_url ? <Text style={styles.muted}>GitHub: {entry.github_url}</Text> : null}
          {entry.tech_stack.length > 0 ? <Text style={styles.muted}>Tech: {entry.tech_stack.join(", ")}</Text> : null}
        </View>
      ))}
    </View>
  );
}

export function ResumePdfDocument({ resume, education, experiences, skills, projects, profile }: ResumePdfData) {
  const accent = resume.accent_color || "#2563eb";
  const templateName = resume.template_name as ResumeTemplateVariant;
  const isExecutive = templateName === "compact-executive";
  const isMinimal = templateName === "minimal-editorial";

  return (
    <Document title={resume.title} author="SmartCV">
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Text style={styles.title}>{resume.title}</Text>
            <Text style={[styles.subtitle, { color: accent }]}>{resume.target_role ?? "Target role"}</Text>
            <Text style={styles.summary}>{resume.summary?.trim() ? resume.summary : fallbackSummary}</Text>
          </View>

          {profile?.avatar_url ? (
            <Image src={profile.avatar_url} style={styles.avatar} />
          ) : (
            <View style={styles.avatarCircle}>
              <Text style={styles.avatarInitials}>
                {(profile?.full_name || resume.title || "U")
                  .split(" ")
                  .map((s) => s[0])
                  .slice(0, 2)
                  .join("")}
              </Text>
            </View>
          )}
        </View>

        {isExecutive ? (
          <View style={styles.executiveGrid}>
            <View style={styles.executiveColumn}>
              {renderExperience(experiences)}
              {renderProjects(projects)}
            </View>
            <View style={styles.executiveColumn}>
              {renderEducation(education)}
              {renderSkills(skills)}
            </View>
          </View>
        ) : isMinimal ? (
          <>
            {renderExperience(experiences)}
            {renderEducation(education)}
            {renderSkills(skills)}
            {renderProjects(projects)}
          </>
        ) : (
          <>
            {renderExperience(experiences)}
            {renderEducation(education)}
            {renderSkills(skills)}
            {renderProjects(projects)}
          </>
        )}
      </Page>
    </Document>
  );
}