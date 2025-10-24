"use client";

import * as React from "react";
import {
  ThemeProvider as NextThemesProvider,
  type ThemeProviderProps,
} from "next-themes";

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  // Default to dark theme and use the `class` attribute so Tailwind's
  // `dark:` variants work by toggling `class="dark"` on <html>.
  return (
    <NextThemesProvider defaultTheme="dark" attribute="class" {...props}>
      {children}
    </NextThemesProvider>
  );
}
