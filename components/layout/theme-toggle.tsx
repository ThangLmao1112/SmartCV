"use client";

import { MonitorSmartphone, MoonStar, SunMedium } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";

const themes = [
  { value: "light", icon: SunMedium, label: "Light" },
  { value: "dark", icon: MoonStar, label: "Dark" },
  { value: "system", icon: MonitorSmartphone, label: "System" },
] as const;

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  const currentIndex = themes.findIndex((option) => option.value === theme);
  const nextIndex = (currentIndex + 1) % themes.length;
  const nextTheme = themes[nextIndex];
  const CurrentIcon = themes.find((option) => option.value === theme)?.icon ?? SunMedium;

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