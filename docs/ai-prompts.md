# Phụ Lục Prompts (AI)

Hướng dẫn: nộp 5–10 prompts (mỗi prompt 1 dòng) bạn đã thực tế sử dụng trong quá trình phát triển. Lưu ra Excel (cột: `STT`, `Prompt`, `Mô tả ngắn`, `Kết quả đầu ra`) và đính kèm file này hoặc file Excel khi nộp.

Ví dụ prompts (lấy từ `services/ai/prompt-builder.ts` — hãy thay bằng prompts thực tế bạn đã dùng):

1. Prompt: "Feature: career-objective\nTarget role: Frontend Developer\nWrite a concise career objective tailored for a resume."
   - Mô tả: Tạo mục tiêu nghề nghiệp ngắn, phù hợp với vị trí frontend.
   - Kết quả mong đợi: 1 câu hoặc 2 câu nêu mục tiêu và kỹ năng chính.

2. Prompt: "Feature: professional-summary\nTarget role: Fullstack Engineer\nWrite a professional summary with measurable impact, clarity, and ATS-friendly keywords."
   - Mô tả: Tạo đoạn tóm tắt chuyên nghiệp cho CV.
   - Kết quả mong đợi: 3–5 câu nêu thành tích và kỹ năng chính.

3. Prompt: "Feature: experience-bullets\nContext: Developed a user dashboard that reduced load time by 40%\nGenerate 3 to 5 strong experience bullet points with action verbs and impact metrics."
   - Mô tả: Sinh bullet points cho mục kinh nghiệm với số liệu.
   - Kết quả mong đợi: 3–5 gạch đầu dòng dạng hành động + kết quả đo được.

4. Prompt: "Feature: skill-suggestions\nJobTitle: Frontend Developer\nSuggest relevant technical and soft skills grouped by category."
   - Mô tả: Gợi ý kỹ năng kỹ thuật và mềm theo nhóm.
   - Kết quả mong đợi: Danh sách kỹ năng theo các nhóm (Languages, Frameworks, Tools, Soft skills).

5. Prompt: "Feature: tailor-cv\nTarget role: Senior Backend Engineer\nTailor the resume content for this target job title and emphasize the most relevant strengths."
   - Mô tả: Tùy chỉnh nội dung CV theo vị trí.
   - Kết quả mong đợi: Gợi ý thay đổi về phần tóm tắt, kỹ năng và kinh nghiệm để phù hợp vị trí.

Ghi chú về chứng minh sử dụng AI tools:
- Nếu giảng viên yêu cầu chứng minh, đính kèm: (1) file Excel chứa prompts, (2) ảnh chụp màn hình lịch sử prompt hoặc logs, hoặc (3) đoạn export từ `ai_generations` table (có trong database/migration) — bạn có thể export mẫu bằng SQL.

Ví dụ cách xuất `ai_generations` từ Supabase (SQL):
```
select id, user_id, prompt, result, provider, created_at
from public.ai_generations
order by created_at desc
limit 50;
```

Lưu file này cùng source code trong gói nộp.
