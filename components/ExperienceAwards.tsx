"use client";

import { useEffect, useRef, useState } from "react";
import { Briefcase, Trophy } from "lucide-react";
import SectionHeader from "./SectionHeader";

const EXPERIENCES = [
  {
    title: "Apprenticeship @ E-Solusindo Software House",
    period: "July 2025 – December 2025",
  },
  {
    title: "Robotics Leader @ SMK Nuris Jember",
    period: "August 2024 – August 2025",
  },
  {
    title: "Coordinator Public Speaking @ Language Extracurricular",
    period: "August 2024 – August 2025",
  },
];

const AWARDS = [
  {
    title: "Finalists of the Provincial News Anchor — BIG SMK JATIM CUP 1 2024 @ Brawijaya University",
    period: "November 2024",
  },
  {
    title: "First Place — Jember Regency News Anchor, BIG SMK JATIM CUP 1 2024",
    period: "November 2024",
  },
  {
    title: "Second Place — Jember Regency News Anchor, BIG SMK JATIM CUP 2 2025",
    period: "September 2025",
  },
  {
    title: "Second Runner Up — Story Telling Competition @ E-Fest UNARS 2023",
    period: "August 2023",
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
        <div className="glass-card rounded-2xl p-6 md:p-8">
          <div className="flex items-center gap-3 mb-7">
            <div className="p-2.5 rounded-xl bg-blue-500/15 border border-blue-500/25">
              <Briefcase size={18} className="text-blue-300" />
            </div>
            <h3 className="text-lg font-semibold text-white">Experiences</h3>
          </div>

          <ul>
            {EXPERIENCES.map((item) => (
              <li key={item.title} className="timeline-item">
                <p className="font-medium text-white/90 text-sm md:text-base leading-snug">
                  {item.title}
                </p>
                <p className="text-xs md:text-sm text-blue-200/45 mt-1.5">
                  {item.period}
                </p>
              </li>
            ))}
          </ul>
        </div>

        {/* Awards */}
        <div className="glass-card rounded-2xl p-6 md:p-8">
          <div className="flex items-center gap-3 mb-7">
            <div className="p-2.5 rounded-xl bg-amber-500/15 border border-amber-500/25">
              <Trophy size={18} className="text-amber-300" />
            </div>
            <h3 className="text-lg font-semibold text-white">Awards</h3>
          </div>

          <ul>
            {AWARDS.map((item) => (
              <li key={item.title} className="timeline-item">
                <p className="font-medium text-white/90 text-sm md:text-base leading-snug">
                  {item.title}
                </p>
                <p className="text-xs md:text-sm text-blue-200/45 mt-1.5">
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
