import type { ReactNode } from "react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { BarChart3, FileText, LayoutDashboard, Sparkles, UserCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { getCurrentUser } from "@/lib/supabase/helpers";
import { signOutAction } from "@/actions/auth";

const navigation = [
  { label: "Tổng quan", href: "/dashboard", icon: LayoutDashboard },
  { label: "CV", href: "/dashboard/resumes", icon: FileText },
  { label: "Thống kê", href: "/dashboard/analytics", icon: BarChart3 },
  { label: "Hồ sơ", href: "/dashboard/profile", icon: UserCircle2 },
] as const;

export default async function DashboardShell({ children }: { children: ReactNode }) {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/sign-in");
  }

  return (
    <div className="mx-auto grid min-h-screen w-full max-w-[1600px] gap-6 p-4 lg:grid-cols-[280px_minmax(0,1fr)] lg:p-6">
      <aside className="glass-panel sticky top-4 hidden h-[calc(100vh-2rem)] flex-col justify-between rounded-[1.75rem] p-5 lg:flex">
        <div className="space-y-6">
          <Link href="/dashboard" className="flex items-center gap-3 font-semibold tracking-tight">
            <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-lg shadow-primary/20">
              <Sparkles className="h-5 w-5" />
            </span>
            <span>SmartCV Studio</span>
          </Link>

          <nav className="space-y-1">
            {navigation.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition-colors hover:bg-secondary",
                    item.href === "/dashboard" ? "bg-secondary text-secondary-foreground" : "text-muted-foreground"
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="rounded-[1.5rem] border border-border/70 bg-background/60 p-4">
          <Badge variant="secondary" className="mb-3">Sẵn sàng AI</Badge>
          <p className="text-sm text-muted-foreground">Khung này đã sẵn cho autosave, thao tác AI và quản lý trạng thái xem trước CV.</p>
          <Button asChild className="mt-4 w-full">
            <Link href="/dashboard/resumes/new">Tạo CV</Link>
          </Button>
          <form action={signOutAction} className="mt-3">
            <Button type="submit" variant="outline" className="w-full">
              Đăng xuất
            </Button>
          </form>
        </div>
      </aside>

      <div className="flex flex-col gap-6">
        <header className="glass-panel flex items-center justify-between rounded-[1.5rem] px-5 py-4 lg:px-6">
          <div>
            <p className="text-sm text-muted-foreground">Chào mừng trở lại</p>
            <h1 className="text-xl font-semibold tracking-tight">Không gian làm CV</h1>
            <p className="text-xs text-muted-foreground">{user.email}</p>
          </div>
          <div className="flex items-center gap-2">
            <Button asChild variant="outline" className="hidden sm:inline-flex">
              <Link href="/dashboard/resumes/new">CV mới</Link>
            </Button>
            <form action={signOutAction} className="hidden sm:block">
              <Button type="submit" variant="ghost" className="hidden sm:inline-flex">
                Đăng xuất
              </Button>
            </form>
          </div>
        </header>

        <main className="pb-6">{children}</main>
      </div>
    </div>
  );
}