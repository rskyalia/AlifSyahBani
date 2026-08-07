"use client";

import { useTheme } from "./ThemeContext";
import { Sun, Moon } from "lucide-react";

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";

  return (
    <button
      onClick={toggleTheme}
      aria-label="Toggle theme"
      className={`
        flex items-center justify-center w-10 h-10 rounded-full
        transition-all duration-300
        ${isDark
          ? "border border-amber-400/20 bg-white/5 hover:bg-amber-400/10 text-amber-300"
          : "border border-slate-200 bg-slate-100 hover:bg-slate-200 text-slate-600"
        }
      `}
    >
      {isDark ? (
        <Sun size={16} />
      ) : (
        <Moon size={16} />
      )}
    </button>
  );
}
