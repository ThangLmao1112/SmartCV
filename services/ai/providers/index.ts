import type { AIProvider } from "@/services/ai/types";
import { MockAIProvider } from "@/services/ai/providers/mock-provider";

export function createAIProvider(): AIProvider {
  const provider = process.env.AI_PROVIDER ?? "mock";

  if (provider === "mock") {
    return new MockAIProvider();
  }

  return new MockAIProvider();
}