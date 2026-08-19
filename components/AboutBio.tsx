"use client";

import { useTheme } from "./ThemeContext";
import { Mail, ArrowUpRight } from "lucide-react";

const SKILLS = [
  { name: "Next.js", category: "core" },
  { name: "React", category: "core" },
  { name: "TypeScript", category: "core" },
  { name: "Three.js / 3D", category: "visual" },
  { name: "GSAP Motion", category: "visual" },
  { name: "Tailwind CSS", category: "visual" },
  { name: "Python / AI", category: "core" },
  { name: "Public Speaking", category: "extra" },
];

export default function AboutBio() {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  return (
    <div className="w-full max-w-xl">
      <div className="mb-4">
        <span className="badge-3d">
          About Me
        </span>
      </div>

      <h1 className="section-title mb-6">Muhammad Alif Sya&apos;bani</h1>

      <div className="space-y-4 leading-relaxed text-sm md:text-base description-muted">
        <p>
          Hello, I&apos;m Alif. I am currently pursuing a degree in{" "}
          <span className="font-semibold text-foreground/90 underline decoration-amber-400/40 underline-offset-4">
            Informatics Engineering at Politeknik Negeri Malang
          </span>
          , where I continue to strengthen
          my knowledge in software development, computer systems, and emerging
          technologies. Previously, I graduated from a vocational high school
          with a background in Computer and Network Engineering, which provided
          me with a solid technical foundation and sparked my passion for
          technology.
        </p>

        <p>
          My interests lie at the intersection of software engineering, artificial
          intelligence, and user-centered 3D design. I am passionate about exploring
          the potential of AI and modern web architectures to build innovative solutions
          for real-world challenges.
        </p>

        <p>
          Beyond academics, I have experience as a Programmer, Graphic Designer,
          and Public Speaker, allowing me to blend technical expertise with
          creativity and effective communication.
        </p>
      </div>

      {/* 3D Skills Showcase */}
      <div className="mt-7">
        <p className="text-xs uppercase tracking-widest font-semibold text-amber-300/70 mb-3">
          Technologies &amp; Expertise
        </p>
        <div className="flex flex-wrap gap-2">
          {SKILLS.map((skill) => (
            <span
              key={skill.name}
              className="badge-3d"
            >
              {skill.name}
            </span>
          ))}
        </div>
      </div>

      {/* 3D Holographic Contact Card */}
      <div className="glass-card-3d rounded-2xl p-5 mt-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-wider text-amber-400 font-semibold mb-1">
            Let&apos;s Connect &amp; Collaborate
          </p>
          <a
            href="mailto:muhammad.alif396177@smk.belajar.id"
            className="text-sm font-medium text-foreground hover:text-amber-300 transition-colors flex items-center gap-1.5 break-all"
          >
            <Mail size={14} className="text-amber-400 shrink-0" />
            muhammad.alif396177@smk.belajar.id
          </a>
        </div>
        <a
          href="mailto:muhammad.alif396177@smk.belajar.id"
          className="btn-3d text-xs py-2 px-4 shrink-0"
        >
          Send Email
          <ArrowUpRight size={13} />
        </a>
      </div>
    </div>
  );
}

