import type { AIProvider, AIRequest, AIResponse } from "@/services/ai/types";
import { buildPrompt } from "@/services/ai/prompt-builder";

function buildMockText(request: AIRequest): string {
  switch (request.feature) {
    case "career-objective":
      return "Aspiring to contribute as a focused product engineer by building user-first interfaces, improving performance, and delivering clean, maintainable systems.";
    case "professional-summary":
      return "Product-minded frontend engineer with a strong foundation in TypeScript, modern React architecture, and polished UI delivery across responsive experiences.";
    case "experience-bullets":
      return [
        "Built responsive product flows that improved usability across desktop and mobile breakpoints.",
        "Collaborated with design and backend teams to ship scalable interfaces with cleaner component architecture.",
        "Reduced friction in user journeys by refining interaction patterns and simplifying high-impact screens.",
      ].join("\n");
    case "skill-suggestions":
      return [
        "Frontend: Next.js, React, TypeScript, Tailwind CSS",
        "Backend: Supabase, PostgreSQL, REST APIs",
        "Workflow: Testing, performance, accessibility, design systems",
      ].join("\n");
    case "tailor-cv":
      return "Tailor the resume by emphasizing the target role, matching keywords from the job description, and repositioning relevant achievements first.";
    default:
      return "AI output is not available for this feature yet.";
  }
}

export class MockAIProvider implements AIProvider {
  async generate(request: AIRequest): Promise<AIResponse> {
    return {
      provider: "mock",
      model: "mock-v1",
      text: buildMockText(request),
      metadata: {
        prompt: buildPrompt(request),
      },
    };
  }
}