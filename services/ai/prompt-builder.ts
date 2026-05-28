import type { AIRequest } from "@/services/ai/types";

export function buildPrompt(request: AIRequest): string {
  const commonContext = [
    `Feature: ${request.feature}`,
    request.jobTitle ? `Target role: ${request.jobTitle}` : null,
    request.context ? `Context: ${request.context}` : null,
  ]
    .filter(Boolean)
    .join("\n");

  switch (request.feature) {
    case "career-objective":
      return `${commonContext}\nWrite a concise career objective tailored for a resume.`;
    case "professional-summary":
      return `${commonContext}\nWrite a professional summary with measurable impact, clarity, and ATS-friendly keywords.`;
    case "experience-bullets":
      return `${commonContext}\nGenerate 3 to 5 strong experience bullet points with action verbs and impact metrics.`;
    case "skill-suggestions":
      return `${commonContext}\nSuggest relevant technical and soft skills grouped by category.`;
    case "tailor-cv":
      return `${commonContext}\nTailor the resume content for this target job title and emphasize the most relevant strengths.`;
    default:
      return commonContext;
  }
}