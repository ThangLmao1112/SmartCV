import Link from "next/link";

const footerLinks = [
  { label: "Quyền riêng tư", href: "/privacy" },
  { label: "Điều khoản", href: "/terms" },
  { label: "Liên hệ", href: "/contact" },
] as const;

export function SiteFooter() {
  return (
    <footer className="border-t border-border/70 bg-background/70">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-4 px-4 py-8 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
        <p>SmartCV — Trình tạo CV AI. Dành cho người tìm việc hiện đại.</p>
        <nav className="flex items-center gap-5">
          {footerLinks.map((link) => (
            <Link key={link.href} href={link.href} className="transition-colors hover:text-foreground">
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </footer>
  );
}