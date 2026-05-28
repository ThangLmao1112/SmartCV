import { ResumeEditor } from "@/components/resume/resume-editor";
import { ResumeForm } from "@/components/resume/resume-form";

export default function NewResumePage() {
  return (
    <div className="space-y-6">
      <ResumeForm
        mode="create"
        defaultValues={{
          title: "",
          targetRole: "",
          summary: "",
          templateName: "modern-ats",
          accentColor: "#2563eb",
          isDefault: false,
        }}
      />
      <ResumeEditor initialTemplateName="modern-ats" />
    </div>
  );
}