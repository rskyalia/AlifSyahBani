"use client";

import { useRef } from "react";
import { Briefcase, Trophy } from "lucide-react";
import SectionHeader from "./SectionHeader";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { useTheme } from "./ThemeContext";

const EXPERIENCES = [
  {
    title: "Apprenticeship @ E-Solusindo Software House",
    period: "July 2025 – December 2025",
  },
  {
    title: "School Seminar Moderator & Master of Ceremony (MC)",
    period: "August 2024 – August 2025",
  },
  {
    title: "Head of the English Department @ Language Extracurricular",
    period: "August 2024 – August 2025",
  },
];

const AWARDS = [
  {
    title: "Second Runner Up — Story Telling Competition @ E-Fest UNARS 2023",
    period: "August 2023",
  },
  {
    title: "First Runner-Up in the English Speech Competition – Bahana Muharram 2024 at the District Level.",
    period: "August 2024",
  },
  {
    title: "First Place — Jember Regency News Anchor, BIG SMK JATIM CUP 1 2024",
    period: "November 2024",
  },
  {
    title: "Finalists of the Provincial News Anchor — BIG SMK JATIM CUP 1 2024 @ Brawijaya University",
    period: "November 2024",
  },
  {
    title: "Second Place in the English Speech Competition – Bahana Muharram 2025 at the District Level.",
    period: "July 2025",
  },
  {
    title: "Second Place — Jember Regency News Anchor, BIG SMK JATIM CUP 2 2025",
    period: "September 2025",
  },
];

export default function ExperienceAwards() {
  const ref = useRef<HTMLDivElement>(null);
  const { theme } = useTheme();
  const isDark = theme === "dark";

  useScrollReveal(ref, {
    preset: "stagger",
    staggerTargets: ".timeline-item",
    staggerDelay: 0.08,
    start: "top 85%",
  });

  const accentColor = isDark ? "text-amber-400" : "text-blue-500";
  const mutedColor = isDark ? "text-amber-400/60" : "text-blue-500/60";
  const dotColor = isDark ? "bg-amber-400" : "bg-blue-500";

  return (
    <section
      id="experience"
      className="px-4 sm:px-8 md:px-20 py-20 md:py-32 relative z-10"
    >
      <SectionHeader
        label="Background"
        title="Experience & Awards"
        description="A snapshot of my professional journey and competition achievements."
        align="center"
      />

      <div
        ref={ref}
        className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16"
      >
        {/* ── Experiences ───────────────────────────────────────────────────── */}
        <div>
          <div className="flex items-center gap-2.5 mb-6">
            <Briefcase size={17} className={accentColor} />
            <h3 className={`text-base font-semibold uppercase tracking-widest ${accentColor}`}>
              Experiences
            </h3>
          </div>

          <ul className="space-y-6 list-none">
            {EXPERIENCES.map((item) => (
              <li key={item.title} className="timeline-item">
                <p className="font-semibold card-title text-sm md:text-[15px] leading-snug">
                  {item.title}
                </p>
                <p className={`text-xs mt-1.5 font-medium ${mutedColor}`}>
                  {item.period}
                </p>
              </li>
            ))}
          </ul>
        </div>

        {/* ── Awards ────────────────────────────────────────────────────────── */}
        <div>
          <div className="flex items-center gap-2.5 mb-6">
            <Trophy size={17} className={accentColor} />
            <h3 className={`text-base font-semibold uppercase tracking-widest ${accentColor}`}>
              Awards
            </h3>
          </div>

          <ul className="space-y-6 list-none">
            {AWARDS.map((item) => (
              <li key={item.title} className="timeline-item">
                <p className="font-semibold card-title text-sm md:text-[15px] leading-snug">
                  {item.title}
                </p>
                <p className={`text-xs mt-1.5 font-medium ${mutedColor}`}>
                  {item.period}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
