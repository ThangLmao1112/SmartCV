"use client";

import { useEffect, useState } from "react";
import { MonitorSmartphone, MoonStar, SunMedium } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";

const themes = [
  { value: "light", icon: SunMedium, label: "Light" },
  { value: "dark", icon: MoonStar, label: "Dark" },
  { value: "system", icon: MonitorSmartphone, label: "System" },
] as const;

export function ThemeToggle() {
  const { setTheme, resolvedTheme, theme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <Button
        type="button"
        variant="ghost"
        size="icon"
        disabled
        className="shrink-0"
      >
        <SunMedium className="h-4 w-4" />
      </Button>
    );
  }

  const currentTheme = resolvedTheme ?? theme ?? "system";
  const currentIndex = themes.findIndex((option) => option.value === currentTheme);
  const nextIndex = (currentIndex + 1) % themes.length;
  const nextTheme = themes[nextIndex];
  const CurrentIcon = themes.find((option) => option.value === currentTheme)?.icon ?? MonitorSmartphone;

  return (
    <Button
      type="button"
      variant="ghost"
      size="icon"
      onClick={() => setTheme(nextTheme.value)}
      aria-label={`Switch theme to ${nextTheme.label}`}
      className="shrink-0"
    >
      <CurrentIcon className="h-4 w-4" />
    </Button>
  );
}