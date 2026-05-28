"use client";

import { useState, useTransition } from "react";
import { Copy } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

type ResumeCopyLinkButtonProps = {
  shareUrl: string;
};

export function ResumeCopyLinkButton({ shareUrl }: ResumeCopyLinkButtonProps) {
  const [copied, setCopied] = useState(false);
  const [isPending, startTransition] = useTransition();

  const handleCopy = () => {
    startTransition(async () => {
      try {
        await navigator.clipboard.writeText(shareUrl);
        setCopied(true);
        toast.success("Đã sao chép liên kết công khai.");
        window.setTimeout(() => setCopied(false), 1800);
      } catch {
        toast.error("Không thể sao chép liên kết công khai.");
      }
    });
  };

  return (
    <Button type="button" variant="outline" size="sm" onClick={handleCopy} disabled={isPending}>
      <Copy className="h-4 w-4" />
      {copied ? "Đã sao chép" : "Sao chép liên kết"}
    </Button>
  );
}