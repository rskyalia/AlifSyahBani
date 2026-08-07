"use client";

import { useTheme } from "./ThemeContext";

export default function AboutPhoto() {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  return (
    <div className="flex justify-center md:justify-end">
      <div className="relative w-full max-w-[320px] sm:max-w-[360px] md:max-w-none">
        {/* Glow behind photo — golden in dark, blue in light */}
        <div
          className={`
            absolute -inset-4 rounded-3xl blur-2xl
            ${isDark
              ? "bg-gradient-to-br from-amber-500/30 via-amber-400/10 to-transparent"
              : "bg-gradient-to-br from-blue-400/25 via-blue-300/10 to-transparent"
            }
          `}
          aria-hidden
        />

        <img
          src="/about/fotodiri.jpg"
          alt="Muhammad Alif Sya'bani — Informatics Engineering student and software developer"
          className="relative z-10 w-full sm:w-[300px] md:w-[340px] lg:w-[360px] h-auto rounded-2xl object-cover border border-white/15"
          style={{
            boxShadow: isDark
              ? "0 20px 60px rgba(0,0,0,0.6), 0 0 40px rgba(245,158,11,0.2)"
              : "0 20px 60px rgba(15,23,42,0.15), 0 0 40px rgba(37,99,235,0.15)",
          }}
        />
      </div>
    </div>
  );
}
