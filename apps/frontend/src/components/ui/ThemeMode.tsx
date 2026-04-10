"use client";
import { useTheme } from "next-themes";
import { useSyncExternalStore } from "react";
import Button from "./Buttons";

export default function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const mounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  );

  if (!mounted) return null;

  return (
    <Button onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}>
      Toggle ({resolvedTheme})
    </Button>
  );
}