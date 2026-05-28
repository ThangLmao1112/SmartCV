"use client";

import type { ComponentType, ReactNode } from "react";
import type { ThemeProviderProps } from "next-themes";
import { ThemeProvider as NextThemesProviderBase } from "next-themes";

type AppThemeProviderProps = ThemeProviderProps & { children: ReactNode };
const NextThemesProvider = NextThemesProviderBase as ComponentType<AppThemeProviderProps>;

export function ThemeProvider({ children, ...props }: AppThemeProviderProps) {
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
      {...props}
    >
      {children}
    </NextThemesProvider>
  );
}