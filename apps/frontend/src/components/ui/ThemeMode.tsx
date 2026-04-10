"use client";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import Button from "./Buttons";

export default function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true); // ✅ safe & standard
  }, []);

  if (!mounted) return null;

  return (
    <Button
      onClick={() =>
        setTheme(resolvedTheme === "dark" ? "light" : "dark")
      }
    >
      Toggle ({resolvedTheme})
    </Button>
  );
}