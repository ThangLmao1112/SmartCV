import type { ReactNode } from "react";
import { AuthShell } from "@/components/layout/auth-shell";
import { SiteHeader } from "@/components/layout/site-header";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-dvh">
      <SiteHeader />
      <AuthShell>{children}</AuthShell>
    </div>
  );
}