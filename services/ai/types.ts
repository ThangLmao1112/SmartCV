export type AIResumeFeature =
  | "career-objective"
  | "professional-summary"
  | "experience-bullets"
  | "skill-suggestions"
  | "tailor-cv";

export type AIRequest = {
  feature: AIResumeFeature;
  resumeId?: string;
  jobTitle?: string;
  context?: string;
};

export type AIResponse = {
  provider: string;
  model: string;
  text: string;
  metadata: Record<string, string>;
};

export interface AIProvider {
  generate(request: AIRequest): Promise<AIResponse>;
}