"use client";

import Link from "next/link";
import { FaGithub, FaLinkedin, FaInstagram } from "react-icons/fa6";
import { useTheme } from "./ThemeContext";

export default function Footer() {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const year = new Date().getFullYear();

  return (
    <footer
      className={`px-6 md:px-20 py-10 mt-8 ${
        isDark
          ? "border-t border-white/6"
          : "border-t border-slate-200/80"
      }`}
    >
      <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="text-center md:text-left">
          <p className={`text-sm font-semibold ${isDark ? "text-white/80" : "text-slate-700"}`}>
            Alif Sya&apos;bani
          </p>
          <p className={`text-xs mt-1 ${isDark ? "text-white/35" : "text-slate-400"}`}>
            © {year} · Built with Next.js & Tailwind CSS
          </p>
        </div>

        <div className="flex items-center gap-4">
          <a
            href="https://github.com/rskyalia"
            target="_blank"
            rel="noopener noreferrer"
            className={`transition-colors ${isDark ? "text-white/35 hover:text-white/70" : "text-slate-400 hover:text-slate-700"}`}
            aria-label="GitHub"
          >
            <FaGithub size={18} />
          </a>
          <a
            href="https://www.linkedin.com/in/alif-syahbani-01056b304/"
            target="_blank"
            rel="noopener noreferrer"
            className={`transition-colors ${isDark ? "text-white/35 hover:text-white/70" : "text-slate-400 hover:text-sky-600"}`}
            aria-label="LinkedIn"
          >
            <FaLinkedin size={18} />
          </a>
          <a
            href="https://www.instagram.com/syah.baani/"
            target="_blank"
            rel="noopener noreferrer"
            className={`transition-colors ${isDark ? "text-white/35 hover:text-white/70" : "text-slate-400 hover:text-pink-500"}`}
            aria-label="Instagram"
          >
            <FaInstagram size={18} />
          </a>
        </div>

        <Link
          href="/resume"
          className={`text-xs transition-colors ${
            isDark
              ? "text-blue-300/60 hover:text-blue-300"
              : "text-blue-500/70 hover:text-blue-600"
          }`}
        >
          Download Resume →
        </Link>
      </div>
    </footer>
  );
}
