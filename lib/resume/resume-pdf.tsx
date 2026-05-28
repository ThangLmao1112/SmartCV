import { Document, Page, StyleSheet, Text, View } from "@react-pdf/renderer";
import type { Database, Json } from "@/lib/supabase/database.types";
import type { ResumeTemplateVariant } from "@/lib/resume/templates";

type ResumeRow = Database["public"]["Tables"]["resumes"]["Row"];
type EducationRow = Database["public"]["Tables"]["education"]["Row"];
type ExperienceRow = Database["public"]["Tables"]["experiences"]["Row"];
type SkillRow = Database["public"]["Tables"]["skills"]["Row"];
type ProjectRow = Database["public"]["Tables"]["projects"]["Row"];

export type ResumePdfData = {
  resume: ResumeRow;
  education: EducationRow[];
  experiences: ExperienceRow[];
  skills: SkillRow[];
  projects: ProjectRow[];
};

const styles = StyleSheet.create({
  page: {
    paddingTop: 28,
    paddingBottom: 28,
    paddingHorizontal: 36,
    fontSize: 10,
    color: "#111827",
    fontFamily: "Helvetica",
  },
  header: {
    marginBottom: 18,
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#d1d5db",
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
});

function formatRange(startDate?: string | null, endDate?: string | null, isCurrent?: boolean) {
  const start = startDate ?? "Start";
  const end = isCurrent ? "Present" : endDate ?? "End";
  return `${start} - ${end}`;
}

function toTextArray(value: Json): string[] {
  if (Array.isArray(value)) {
    return value.filter((item): item is string => typeof item === "string");
  }

  return [];
}

function renderExperience(experiences: ExperienceRow[]) {
  if (experiences.length === 0) return null;

  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Experience</Text>
      {experiences.map((entry) => (
        <View key={entry.id} style={styles.entry}>
          <Text style={styles.entryTitle}>{entry.job_title}</Text>
          <Text style={styles.muted}>
            {entry.company_name} · {formatRange(entry.start_date, entry.end_date, entry.is_current)}
          </Text>
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
  if (education.length === 0) return null;

  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Education</Text>
      {education.map((entry) => (
        <View key={entry.id} style={styles.entry}>
          <Text style={styles.entryTitle}>{entry.school_name}</Text>
          <Text style={styles.muted}>{[entry.degree, entry.field_of_study].filter(Boolean).join(" · ") || "Education"}</Text>
          <Text style={styles.muted}>{formatRange(entry.start_date, entry.end_date, entry.is_current)}</Text>
        </View>
      ))}
    </View>
  );
}

function renderSkills(skills: SkillRow[]) {
  if (skills.length === 0) return null;

  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Skills</Text>
      <View style={styles.chipRow}>
        {skills.map((skill) => (
          <View key={skill.id} style={styles.chip}>
            <Text style={styles.chipText}>{skill.name}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

function renderProjects(projects: ProjectRow[]) {
  if (projects.length === 0) return null;

  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Projects</Text>
      {projects.map((entry) => (
        <View key={entry.id} style={styles.entry}>
          <Text style={styles.entryTitle}>{entry.name}</Text>
          <Text style={styles.muted}>{formatRange(entry.start_date, entry.end_date)}</Text>
          {entry.description ? <Text style={styles.muted}>{entry.description}</Text> : null}
          {entry.tech_stack.length > 0 ? <Text style={styles.muted}>Tech: {entry.tech_stack.join(", ")}</Text> : null}
        </View>
      ))}
    </View>
  );
}

export function ResumePdfDocument({ resume, education, experiences, skills, projects }: ResumePdfData) {
  const accent = resume.accent_color || "#2563eb";
  const templateName = resume.template_name as ResumeTemplateVariant;
  const isExecutive = templateName === "compact-executive";
  const isMinimal = templateName === "minimal-editorial";

  return (
    <Document title={resume.title} author="SmartCV">
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.title}>{resume.title}</Text>
          <Text style={[styles.subtitle, { color: accent }]}>{resume.target_role ?? "Target role"}</Text>
          <Text style={styles.summary}>{resume.summary ?? ""}</Text>
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