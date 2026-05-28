import type { AIProvider, AIRequest, AIResponse } from "@/services/ai/types";
import { buildPrompt } from "@/services/ai/prompt-builder";

function buildMockText(request: AIRequest): string {
  switch (request.feature) {
    case "career-objective":
      return "Bằng cách tập trung vào trải nghiệm người dùng, tôi mong muốn đóng góp như một kỹ sư sản phẩm/Frontend tận tâm, xây dựng giao diện sạch, hiệu quả và dễ mở rộng.";
    case "professional-summary":
      return "Kỹ sư Frontend giàu cảm hứng, am hiểu TypeScript, React hiện đại và thiết kế giao diện tinh gọn, tập trung vào hiệu năng, khả năng mở rộng và trải nghiệm người dùng tốt.";
    case "experience-bullets":
      return [
        "Xây dựng luồng sản phẩm responsive, cải thiện trải nghiệm trên cả desktop và mobile.",
        "Hợp tác với đội thiết kế và backend để triển khai giao diện có cấu trúc component rõ ràng và dễ bảo trì.",
        "Giảm ma sát trong hành trình người dùng bằng cách tinh chỉnh tương tác và tối ưu hóa các màn hình có tác động lớn.",
      ].join("\n");
    case "skill-suggestions":
      return [
        "Frontend: Next.js, React, TypeScript, Tailwind CSS",
        "Backend: Supabase, PostgreSQL, REST APIs",
        "Quy trình: Kiểm thử, tối ưu hiệu năng, khả năng truy cập, hệ thống thiết kế",
      ].join("\n");
    case "tailor-cv":
      return "Điều chỉnh CV bằng cách nhấn mạnh vị trí mục tiêu, phù hợp với từ khóa của mô tả công việc và đưa thành tích liên quan lên trước.";
    default:
      return "Tính năng AI này chưa sẵn sàng.";
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