"use client";

import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import {
  FaGithub,
  FaLinkedin,
  FaInstagram,
  FaTiktok,
  FaXTwitter,
} from "react-icons/fa6";
import { MdEmail } from "react-icons/md";
import Typewriter from "./Typewriter";
import Earth from "./Earth";

export default function Hero() {
  return (
    <section
      id="home"
      className="
        relative min-h-screen
        flex flex-col-reverse md:flex-row
        items-center justify-center
        gap-10 md:gap-16
        px-6 md:px-20
        pt-28 md:pt-0
      "
    >
      {/* LEFT CONTENT */}
      <div className="w-full max-w-xl text-center md:text-left animate-fade-in-up">
        {/* Status badge */}
        <div className="flex justify-center md:justify-start mb-5">
          <span className="section-label flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)] animate-pulse" />
            Open to opportunities
          </span>
        </div>

        {/* Social icons */}
        <div className="flex justify-center md:justify-start gap-3 mb-7 text-blue-200/60">
          <SocialIcon href="https://github.com/rskyalia" icon={<FaGithub />} variant="github" />
          <SocialIcon href="https://www.linkedin.com/in/alif-syahbani-01056b304/" icon={<FaLinkedin />} variant="linkedin" />
          <SocialIcon href="https://www.instagram.com/syah.baani/" icon={<FaInstagram />} variant="instagram" />
          <SocialIcon href="https://www.tiktok.com/@syah.baani" icon={<FaTiktok />} variant="tiktok" />
          <SocialIcon href="https://x.com" icon={<FaXTwitter />} variant="x" />
          <SocialIcon href="mailto:muhammad.alif396177@smk.belajar.id" icon={<MdEmail />} variant="gmail" />
        </div>

        {/* Heading */}
        <h1
          className="
            font-cabinet font-bold mb-4
            text-4xl leading-tight
            sm:text-5xl
            md:text-6xl md:leading-[1.1]
            bg-linear-to-br from-white via-blue-100 to-blue-400
            bg-clip-text text-transparent
            drop-shadow-[0_0_30px_rgba(59,130,246,0.35)]
          "
        >
          Hi, I&apos;m Alif Sya&apos;bani
        </h1>

        {/* Subheading */}
        <p
          className="
            font-cabinet text-blue-100/65 mb-5
            text-base sm:text-lg md:text-xl
            leading-relaxed
          "
        >
          Bachelor of Applied Science in Informatics Engineering
          <span className="block text-blue-200/45 text-sm md:text-base mt-1">
            State Polytechnic of Malang
          </span>
        </p>

        {/* Typewriter */}
        <div className="mb-8">
          <Typewriter />
        </div>

        {/* CTA buttons */}
        <div className="flex flex-wrap items-center justify-center md:justify-start gap-3">
          <Link href="/writing" className="btn-primary">
            <Sparkles size={15} />
            View Projects
            <ArrowRight size={15} />
          </Link>
          <Link href="/about" className="btn-secondary">
            About Me
          </Link>
        </div>
      </div>

      {/* RIGHT CONTENT – EARTH */}
      <div
        className="
          w-full max-w-md
          h-[280px] sm:h-[360px] md:h-[520px]
          hidden sm:block
          animate-fade-in-up
        "
        style={{ animationDelay: "0.15s" }}
      >
        <Earth />
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 hidden md:flex flex-col items-center gap-2 text-blue-200/30">
        <span className="text-[10px] uppercase tracking-widest">Scroll</span>
        <div className="w-px h-8 bg-linear-to-b from-blue-400/50 to-transparent animate-bounce-slow" />
      </div>
    </section>
  );
}

function SocialIcon({
  href,
  icon,
  variant,
}: {
  href: string;
  icon: React.ReactNode;
  variant: "github" | "linkedin" | "instagram" | "tiktok" | "x" | "gmail";
}) {
  const shadows: Record<string, string> = {
    github:    "hover:shadow-[0_0_22px_rgba(255,255,255,0.55)] hover:text-black",
    linkedin:  "hover:shadow-[0_0_22px_rgba(56,189,248,0.6)]  hover:text-sky-700",
    instagram: "hover:shadow-[0_0_26px_rgba(236,72,153,0.65)] hover:text-white",
    tiktok:    "hover:shadow-[0_0_26px_rgba(236,72,153,0.55)] hover:text-white",
    x:         "hover:shadow-[0_0_22px_rgba(255,255,255,0.75)] hover:text-black",
    gmail:     "hover:shadow-[0_0_26px_rgba(239,68,68,0.55)]  hover:text-white",
  };

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={`
        social-icon social-icon-${variant}
        p-2.5 rounded-full
        text-base sm:text-lg
        text-white/60
        border border-white/5
        bg-white/3
        transition-all duration-500 ease-in-out
        hover:scale-110 hover:border-white/10
        ${shadows[variant]}
      `}
    >
      {icon}
    </a>
  );
}
