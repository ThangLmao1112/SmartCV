export const resumeTemplateNames = ["modern-ats", "minimal-editorial", "compact-executive"] as const;

export const resumeTemplateOptions = [
  {
    value: "modern-ats",
    label: "ATS hiện đại",
    description: "Sạch sẽ, cân bằng và tối ưu cho hệ thống ATS.",
  },
  {
    value: "minimal-editorial",
    label: "Biên tập tối giản",
    description: "Kiểu chữ trầm tĩnh với khoảng thở tốt hơn.",
  },
  {
    value: "compact-executive",
    label: "Điều hành gọn",
    description: "Đặc, bóng bẩy và phù hợp hồ sơ cấp cao.",
  },
] as const;

export type ResumeTemplateName = (typeof resumeTemplateOptions)[number]["value"];

export type ResumeTemplateVariant = (typeof resumeTemplateNames)[number];

export function getTemplateLabel(templateName: string): string {
  return resumeTemplateOptions.find((option) => option.value === templateName)?.label ?? "ATS hiện đại";
}