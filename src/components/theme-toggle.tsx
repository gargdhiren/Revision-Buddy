"use client";

import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();

  const onThemeChange = (): void => {
    setTheme(resolvedTheme === "dark" ? "light" : "dark");
  };

  return (
    <Button onClick={onThemeChange} suppressHydrationWarning>
      {resolvedTheme === "dark" ? "Light" : "Dark"}
    </Button>
  );
}
