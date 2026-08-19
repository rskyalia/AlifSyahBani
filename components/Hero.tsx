"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { ArrowRight, Sparkles } from "lucide-react";
import {
  FaGithub,
  FaLinkedin,
  FaInstagram,
  FaTiktok,
  FaXTwitter,
} from "react-icons/fa6";
import { MdEmail } from "react-icons/md";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Typewriter from "./Typewriter";
import StatsCounter from "./StatsCounter";
import HantavirusModel from "./HantavirusModel";
import { useTheme } from "./ThemeContext";

gsap.registerPlugin(ScrollTrigger);

const HERO_STATS = [
  { value: 3, suffix: "+", label: "Years Coding" },
  { value: 10, suffix: "+", label: "Projects Built" },
  { value: 5, suffix: "+", label: "Awards Won" },
];

export default function Hero() {
  const pathname = usePathname();
  const { theme } = useTheme();

  const sectionRef = useRef<HTMLElement>(null);
  const badgeRef = useRef<HTMLDivElement>(null);
  const socialsRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const line1Ref = useRef<HTMLSpanElement>(null);
  const line2Ref = useRef<HTMLSpanElement>(null);
  const subRef = useRef<HTMLParagraphElement>(null);
  const typeRef = useRef<HTMLDivElement>(null);
  const btnsRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const leftColRef = useRef<HTMLDivElement>(null);
  const modelRef = useRef<HTMLDivElement>(null);

  // TextReveal animation
  useEffect(() => {
    const prefersReduced =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const ctx = gsap.context(() => {
      if (prefersReduced) {
        gsap.set([line1Ref.current, line2Ref.current], { y: "0%" });
        if (statsRef.current) gsap.set(statsRef.current, { autoAlpha: 1, y: 0 });
        return;
      }

      gsap.set([line1Ref.current, line2Ref.current], { y: "110%" });
      if (statsRef.current) gsap.set(statsRef.current, { autoAlpha: 0, y: 18 });

      const tl = gsap.timeline();
      tl.to([line1Ref.current, line2Ref.current], {
        y: "0%",
        duration: 1.0,
        ease: "power4.out",
        stagger: 0.12,
        delay: 0.3,
      });
      if (statsRef.current) {
        tl.to(statsRef.current, { autoAlpha: 1, y: 0, duration: 0.55, ease: "power3.out" }, "-=0.15");
      }
    });

    return () => ctx.revert();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Left column stagger entry
  useEffect(() => {
    const ctx = gsap.context(() => {
      const leftEls = [
        badgeRef.current,
        socialsRef.current,
        subRef.current,
        typeRef.current,
        btnsRef.current,
      ].filter(Boolean);

      gsap.set(leftEls, { clearProps: "all" });
      gsap.set(scrollRef.current, { clearProps: "all" });
      gsap.set(leftEls, { autoAlpha: 0, y: 22 });
      gsap.set(scrollRef.current, { autoAlpha: 0 });

      const tl = gsap.timeline({ defaults: { ease: "power3.out" }, delay: 0.05 });
      tl.to(leftEls, { autoAlpha: 1, y: 0, duration: 0.55, stagger: 0.1 });
      tl.to(scrollRef.current, { autoAlpha: 1, duration: 0.4 }, "-=0.3");
    });

    return () => ctx.revert();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  // 3D model reveal — opacity only, no scale change to prevent jump
  useEffect(() => {
    const ctx = gsap.context(() => {
      if (modelRef.current) {
        gsap.fromTo(
          modelRef.current,
          { autoAlpha: 0 },
          { autoAlpha: 1, duration: 0.8, ease: "power2.out", delay: 0.2 }
        );
      }
    });
    return () => ctx.revert();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ScrollTrigger fade parallax
  useEffect(() => {
    if (typeof window === "undefined") return;
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const ctx = gsap.context(() => {
      if (prefersReduced) {
        if (headingRef.current) gsap.set(headingRef.current, { y: 0, opacity: 1 });
        if (leftColRef.current) gsap.set(leftColRef.current, { opacity: 1, y: 0 });
        return;
      }

      if (headingRef.current) {
        gsap.to(headingRef.current, {
          y: "-20%",
          ease: "none",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top top",
            end: "bottom top",
            scrub: 1,
          },
        });
      }

      if (leftColRef.current) {
        gsap.to(leftColRef.current, {
          opacity: 0,
          y: -30,
          ease: "none",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: `${window.innerHeight * 0.8}px top`,
            end: "bottom top",
            scrub: 1,
          },
        });
      }
    });

    return () => ctx.revert();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <section
      ref={sectionRef}
      id="home"
      className="relative min-h-screen overflow-hidden flex flex-col justify-center items-center"
      style={{ paddingTop: 0 }}
    >
      {/* Split layout: text left, 3D model right */}
      <div
        ref={leftColRef}
        className="
          relative z-10
          flex flex-col md:flex-row items-center justify-center
          min-h-screen
          w-full max-w-6xl mx-auto
          px-4 sm:px-6 md:px-8 lg:px-12
          pt-28 pb-24 md:pt-16 md:pb-20
          gap-8 md:gap-12
        "
      >
        {/* ── LEFT: Text content ───────────────────────────────────────────── */}
        <div className="flex flex-col items-center md:items-start text-center md:text-left flex-1 min-w-0">
          {/* Status badge */}
          <div ref={badgeRef} className="mb-4">
            <span className="badge-3d flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.9)] animate-pulse" />
              Open to opportunities
            </span>
          </div>

          {/* Heading */}
          <h1
            ref={headingRef}
            className={`font-cabinet font-bold mb-3 hero-heading ${theme === "dark" ? "hero-heading--dark" : "hero-heading--light"}`}
            style={{
              fontSize: "var(--text-hero)",
              fontWeight: 800,
              letterSpacing: "var(--ls-hero)",
              lineHeight: "var(--lh-display)",
              willChange: "transform",
            }}
          >
            <div style={{ overflow: "hidden", paddingBottom: "0.08em" }}>
              <span ref={line1Ref} style={{ display: "block" }}>
                Hi, I&apos;m
              </span>
            </div>
            <div style={{ overflow: "hidden", paddingBottom: "0.08em" }}>
              <span ref={line2Ref} style={{ display: "block" }}>
                Alif Sya&apos;bani
              </span>
            </div>
          </h1>

          {/* Subheading */}
          <p
            ref={subRef}
            className={`
              font-cabinet mb-1
              text-sm sm:text-base md:text-lg
              leading-relaxed
              ${theme === "dark" ? "text-amber-100/75" : "text-slate-600"}
            `}
          >
            Bachelor of Applied Science in Informatics Engineering
          </p>
          <p className={`text-xs md:text-sm mb-6 ${theme === "dark" ? "text-amber-200/50" : "text-slate-400"}`}>
            State Polytechnic of Malang
          </p>

          {/* Typewriter */}
          <div ref={typeRef} className="mb-6 w-full">
            <Typewriter />
          </div>

          {/* CTA buttons */}
          <div ref={btnsRef} className="flex flex-wrap items-center justify-center md:justify-start gap-3.5 mb-7">
            <Link href="/about" className="btn-3d">
              <Sparkles size={15} />
              About Me
              <ArrowRight size={15} />
            </Link>
            <Link href="/projects" className="btn-secondary">
              View Projects
            </Link>
          </div>

          {/* Social icons */}
          <div ref={socialsRef} className="flex justify-center md:justify-start gap-3 mb-7">
            <SocialIcon href="https://github.com/rskyalia" icon={<FaGithub />} variant="github" theme={theme} />
            <SocialIcon href="https://www.linkedin.com/in/alif-syahbani-01056b304/" icon={<FaLinkedin />} variant="linkedin" theme={theme} />
            <SocialIcon href="https://www.instagram.com/syah.baani/" icon={<FaInstagram />} variant="instagram" theme={theme} />
            <SocialIcon href="https://www.tiktok.com/@syah.baani" icon={<FaTiktok />} variant="tiktok" theme={theme} />
            <SocialIcon href="https://x.com" icon={<FaXTwitter />} variant="x" theme={theme} />
            <SocialIcon href="mailto:muhammad.alif396177@smk.belajar.id" icon={<MdEmail />} variant="gmail" theme={theme} />
          </div>

          {/* Stats Counter Pedestal */}
          <div ref={statsRef} className="w-full flex justify-center md:justify-start">
            <div className="stat-pedestal-3d">
              <StatsCounter stats={HERO_STATS} />
            </div>
          </div>
        </div>

        {/* ── RIGHT: Interactive 3D Globe Model ───────────────────────────── */}
        <div
          ref={modelRef}
          aria-label="Animated 3D planet decoration"
          aria-hidden="true"
          className="
            relative flex-shrink-0
            w-[300px] h-[300px]
            sm:w-[380px] sm:h-[380px]
            md:w-[500px] md:h-[500px]
            lg:w-[580px] lg:h-[580px]
            pointer-events-auto
          "
        >
          {/* Radial ambient glow behind the model */}
          <div
            className={`absolute inset-0 rounded-full blur-3xl opacity-30 pointer-events-none ${theme === "dark"
                ? "bg-radial-gradient from-amber-400/40 to-transparent"
                : "bg-radial-gradient from-blue-400/30 to-transparent"
              }`}
            style={{
              background: theme === "dark"
                ? "radial-gradient(circle, rgba(245,158,11,0.35) 0%, transparent 70%)"
                : "radial-gradient(circle, rgba(56,189,248,0.3) 0%, transparent 70%)",
            }}
            aria-hidden
          />
          <HantavirusModel theme={theme} />
        </div>
      </div>

      {/* Scroll indicator */}
      <div
        ref={scrollRef}
        className={`absolute bottom-6 left-1/2 -translate-x-1/2 z-20 hidden md:flex flex-col items-center gap-2 ${theme === "dark" ? "text-amber-300/40" : "text-slate-400/60"}`}
      >
        <span className="text-[10px] uppercase tracking-widest font-semibold">Scroll</span>
        <div className={`w-px h-8 bg-linear-to-b animate-bounce-slow ${theme === "dark" ? "from-amber-400/60" : "from-slate-400/60"} to-transparent`} />
      </div>
    </section>
  );
}

function SocialIcon({
  href,
  icon,
  variant,
  theme,
}: {
  href: string;
  icon: React.ReactNode;
  variant: "github" | "linkedin" | "instagram" | "tiktok" | "x" | "gmail";
  theme: "light" | "dark";
}) {
  const shadows: Record<string, string> = {
    github: "hover:shadow-[0_0_22px_rgba(255,255,255,0.55)] hover:text-black",
    linkedin: "hover:shadow-[0_0_22px_rgba(56,189,248,0.6)]  hover:text-sky-700",
    instagram: "hover:shadow-[0_0_26px_rgba(236,72,153,0.65)] hover:text-white",
    tiktok: "hover:shadow-[0_0_26px_rgba(236,72,153,0.55)] hover:text-white",
    x: "hover:shadow-[0_0_22px_rgba(255,255,255,0.75)] hover:text-black",
    gmail: "hover:shadow-[0_0_26px_rgba(239,68,68,0.55)]  hover:text-white",
  };

  const lightShadows: Record<string, string> = {
    github: "hover:shadow-[0_0_18px_rgba(0,0,0,0.3)] hover:text-black",
    linkedin: "hover:shadow-[0_0_18px_rgba(14,118,168,0.5)] hover:text-sky-700",
    instagram: "hover:shadow-[0_0_22px_rgba(236,72,153,0.5)] hover:text-pink-600",
    tiktok: "hover:shadow-[0_0_22px_rgba(236,72,153,0.4)] hover:text-slate-900",
    x: "hover:shadow-[0_0_18px_rgba(0,0,0,0.4)] hover:text-black",
    gmail: "hover:shadow-[0_0_22px_rgba(220,38,38,0.45)] hover:text-red-600",
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
        transition-all duration-500 ease-in-out
        hover:scale-110
        ${theme === "dark"
          ? `text-white/60 border border-white/5 bg-white/3 hover:border-white/10 ${shadows[variant]}`
          : `text-slate-500 border border-slate-200 bg-white/70 hover:border-slate-300 ${lightShadows[variant]}`
        }
      `}
    >
      {icon}
    </a>
  );
}
