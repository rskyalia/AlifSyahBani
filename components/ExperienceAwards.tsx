"use client";

import { useEffect, useRef, useState } from "react";
import { Briefcase } from "lucide-react";
import SectionHeader from "./SectionHeader";

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
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15 }
    );

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      id="experience"
      ref={ref}
      className="px-6 md:px-20 py-24 md:py-32"
    >
      <SectionHeader
        label="Background"
        title="Experience & Awards"
        description="A snapshot of my professional journey and competition achievements."
        align="center"
      />

      <div
        className={`
          max-w-5xl mx-auto
          grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8
          transition-all duration-1000
          ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}
        `}
      >
        {/* Experiences */}
        <div className="p-2 md:p-4">
          <div className="flex items-center gap-3 mb-7">
            <div className="p-2.5 rounded-xl bg-blue-500/10 border border-blue-500/20">
              <Briefcase size={18} className="text-blue-300" />
            </div>
            <h3 className="text-lg font-semibold text-white/90">Experiences</h3>
          </div>

          <ul>
            {EXPERIENCES.map((item) => (
              <li key={item.title} className="timeline-item">
                <p className="font-medium text-white/85 text-sm md:text-base leading-snug drop-shadow-[0_0_8px_rgba(255,255,255,0.15)]">
                  {item.title}
                </p>
                <p className="text-xs md:text-sm text-blue-300/50 mt-1.5">
                  {item.period}
                </p>
              </li>
            ))}
          </ul>
        </div>

        {/* Awards */}
        <div className="p-2 md:p-4">
          <div className="flex items-center gap-3 mb-7">
            <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20">
              {/* Modern medal/award icon */}
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                className="text-amber-300"
                stroke="currentColor"
                strokeWidth="1.7"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="12" cy="14" r="6" />
                <path d="M9 14l1.5 1.5L13.5 13" />
                <path d="M8.21 6.37 7 2l3.45 1.03" />
                <path d="M15.79 6.37 17 2l-3.45 1.03" />
                <path d="M8.21 6.37c.97-.29 2.43-.37 3.79-.37s2.82.08 3.79.37" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-white/90">Awards</h3>
          </div>

          <ul>
            {AWARDS.map((item) => (
              <li key={item.title} className="timeline-item">
                <p className="font-medium text-white/85 text-sm md:text-base leading-snug drop-shadow-[0_0_8px_rgba(255,255,255,0.15)]">
                  {item.title}
                </p>
                <p className="text-xs md:text-sm text-blue-300/50 mt-1.5">
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
