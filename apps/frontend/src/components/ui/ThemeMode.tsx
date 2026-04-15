"use client";
import { useTheme } from "next-themes";
import { useSyncExternalStore } from "react";
import Button from "./Buttons";
import { Moon, Sun } from "lucide-react";

export default function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const mounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  );

  if (!mounted) return null;
  const isDark = resolvedTheme === "dark";
  return (
    <button
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className={`relative w-14 h-7 flex items-center rounded-full transition-colors duration-300
        ${isDark ? "bg-gray-800" : "bg-gray-200"}`}
    >
      {/* Sliding Circle */}
      <div
        className={`absolute w-6 h-6 bg-white dark:bg-gray-900 rounded-full shadow-md flex items-center justify-center
          transform transition-transform duration-300
          ${isDark ? "translate-x-7" : "translate-x-1"}`}
      >
        {isDark ? (
          <Moon size={14} />
        ) : (
          <Sun size={14} className="text-yellow-500" />
        )}
      </div>
    </button>
  );
}