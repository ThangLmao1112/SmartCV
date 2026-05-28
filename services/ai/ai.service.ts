import { createAIProvider } from "@/services/ai/providers";
import type { AIRequest, AIResponse } from "@/services/ai/types";

export async function generateResumeContent(request: AIRequest): Promise<AIResponse> {
  const provider = createAIProvider();
  return provider.generate(request);
}