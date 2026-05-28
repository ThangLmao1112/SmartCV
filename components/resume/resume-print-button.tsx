"use client";

import Link from "next/link";
import { Printer } from "lucide-react";
import { Button } from "@/components/ui/button";

export function ResumePrintButton({ resumeId }: { resumeId: string }) {
  const pdfUrl = `/api/resumes/${resumeId}/pdf`;

  return (
    <Button asChild variant="outline" className="print:hidden">
      <Link href={pdfUrl} download>
        <Printer className="h-4 w-4" />
        In / Lưu PDF
      </Link>
    </Button>
  );
}