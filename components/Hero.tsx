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
import PlanetModel from "./PlanetModel";
import StatsCounter from "./StatsCounter";
import { useTheme } from "./ThemeContext";

// Register ScrollTrigger plugin at module level — safe to call multiple times
gsap.registerPlugin(ScrollTrigger);

// Stats data as required by the spec
const HERO_STATS = [
  { value: 3,  suffix: "+", label: "Years Coding"    },
  { value: 10, suffix: "+", label: "Projects Built"  },
  { value: 5,  suffix: "+", label: "Awards Won"      },
];

export default function Hero() {
  const pathname = usePathname();
  const { theme } = useTheme();

  const sectionRef  = useRef<HTMLElement>(null);
  const badgeRef    = useRef<HTMLDivElement>(null);
  const socialsRef  = useRef<HTMLDivElement>(null);
  // Heading text-reveal refs (task 10.1)
  const headingRef  = useRef<HTMLHeadingElement>(null);
  const line1Ref    = useRef<HTMLSpanElement>(null);
  const line2Ref    = useRef<HTMLSpanElement>(null);
  const subRef      = useRef<HTMLParagraphElement>(null);
  const typeRef     = useRef<HTMLDivElement>(null);
  const btnsRef     = useRef<HTMLDivElement>(null);
  const statsRef    = useRef<HTMLDivElement>(null);
  // Planet wrapper ref — used for parallax ScrollTrigger
  const earthRef    = useRef<HTMLDivElement>(null);
  const scrollRef   = useRef<HTMLDivElement>(null);
  // Left text column ref — used for fade-out ScrollTrigger
  const leftColRef  = useRef<HTMLDivElement>(null);

  // TextReveal animation — runs after mount with small delay
  useEffect(() => {
    // Respect prefers-reduced-motion: skip animation, jump to final state
    const prefersReduced =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const ctx = gsap.context(() => {
      if (prefersReduced) {
        gsap.set([line1Ref.current, line2Ref.current], { y: "0%" });
        // Stats: show immediately at final state
        if (statsRef.current) {
          gsap.set(statsRef.current, { autoAlpha: 1, y: 0 });
        }
        return;
      }

      gsap.set([line1Ref.current, line2Ref.current], { y: "110%" });
      // Stats hidden initially — will stagger in after text reveal
      if (statsRef.current) {
        gsap.set(statsRef.current, { autoAlpha: 0, y: 18 });
      }

      const tl = gsap.timeline();

      tl.to([line1Ref.current, line2Ref.current], {
        y: "0%",
        duration: 1.0,
        ease: "power4.out",
        stagger: 0.12,
        delay: 0.3,
      });

      // StatsCounter stagger in 0.15s after TextReveal completes
      if (statsRef.current) {
        tl.to(
          statsRef.current,
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.55,
            ease: "power3.out",
          },
          "-=0.15"
        );
      }
    });

    return () => ctx.revert();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Remaining Hero elements — stagger in on mount (pathname-driven re-run kept)
  useEffect(() => {
    const ctx = gsap.context(() => {
      const leftEls = [
        badgeRef.current,
        socialsRef.current,
        subRef.current,
        typeRef.current,
        btnsRef.current,
      ].filter(Boolean);

      // Reset inline styles so previous GSAP state doesn't linger
      gsap.set(leftEls, { clearProps: "all" });
      gsap.set(earthRef.current, { clearProps: "all" });
      gsap.set(scrollRef.current, { clearProps: "all" });

      // Set invisible
      gsap.set(leftEls, { autoAlpha: 0, y: 22 });
      gsap.set(earthRef.current, { autoAlpha: 0, scale: 0.86, filter: "blur(20px)" });
      gsap.set(scrollRef.current, { autoAlpha: 0 });

      const tl = gsap.timeline({ defaults: { ease: "power3.out" }, delay: 0.05 });

      // Left column — stagger per block
      tl.to(leftEls, {
        autoAlpha: 1,
        y: 0,
        duration: 0.55,
        stagger: 0.1,
      });

      // Earth — starts alongside left column
      tl.to(
        earthRef.current,
        {
          autoAlpha: 1,
          scale: 1,
          filter: "blur(0px)",
          duration: 1.0,
          ease: "power2.out",
        },
        0.15
      );

      // Scroll indicator
      tl.to(scrollRef.current, { autoAlpha: 1, duration: 0.4 }, "-=0.3");
    });

    return () => ctx.revert();
  // pathname in deps so animation re-runs when navigating back to "/"
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  // ScrollTrigger parallax + fade-out animations
  useEffect(() => {
    if (typeof window === "undefined") return;

    // Guard: skip all parallax/scroll animations under prefers-reduced-motion
    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    const ctx = gsap.context(() => {
      if (prefersReduced) {
        // Show everything at final state immediately — no parallax motion
        if (headingRef.current)  gsap.set(headingRef.current,  { y: 0, opacity: 1 });
        if (earthRef.current)    gsap.set(earthRef.current,    { y: 0, rotate: 0 });
        if (leftColRef.current)  gsap.set(leftColRef.current,  { opacity: 1, y: 0 });
        return;
      }

      // --- Parallax: heading scrolls up at -20% ---
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

      // --- Parallax: PlanetModel container scrolls up faster + slight rotate ---
      if (earthRef.current) {
        gsap.to(earthRef.current, {
          y: "-35%",
          rotate: 15,
          ease: "none",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top top",
            end: "bottom top",
            scrub: 1.5,
          },
        });
      }

      // --- Fade-out: when scroll > 80% of viewport height, text fades out ---
      if (leftColRef.current) {
        gsap.to(leftColRef.current, {
          opacity: 0,
          y: -30,
          ease: "none",
          scrollTrigger: {
            trigger: sectionRef.current,
            // Start fading at 80% vh scrolled, finish at bottom of section
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
      <div ref={leftColRef} className="w-full max-w-xl text-center md:text-left">

        {/* Status badge */}
        <div ref={badgeRef} className="flex justify-center md:justify-start mb-5">
          <span className="section-label flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)] animate-pulse" />
            Open to opportunities
          </span>
        </div>

        {/* Social icons */}
        <div ref={socialsRef} className="flex justify-center md:justify-start gap-3 mb-7">
          <SocialIcon href="https://github.com/rskyalia"                          icon={<FaGithub />}    variant="github"    theme={theme} />
          <SocialIcon href="https://www.linkedin.com/in/alif-syahbani-01056b304/" icon={<FaLinkedin />}  variant="linkedin"  theme={theme} />
          <SocialIcon href="https://www.instagram.com/syah.baani/"                icon={<FaInstagram />} variant="instagram" theme={theme} />
          <SocialIcon href="https://www.tiktok.com/@syah.baani"                   icon={<FaTiktok />}    variant="tiktok"    theme={theme} />
          <SocialIcon href="https://x.com"                                        icon={<FaXTwitter />}  variant="x"         theme={theme} />
          <SocialIcon href="mailto:muhammad.alif396177@smk.belajar.id"            icon={<MdEmail />}     variant="gmail"     theme={theme} />
        </div>

        {/* Heading */}
        <h1
          ref={headingRef}
          className={`font-cabinet font-bold mb-4 hero-heading ${theme === "dark" ? "hero-heading--dark" : "hero-heading--light"}`}
          style={{
            fontSize: "var(--text-hero)",
            fontWeight: 800,
            letterSpacing: "var(--ls-hero)",
            lineHeight: "var(--lh-display)",
            willChange: "transform",
          }}
        >
          <div style={{ overflow: "hidden", paddingBottom: "0.15em" }}>
            <span ref={line1Ref} style={{ display: "block" }}>
              Hi, I&apos;m
            </span>
          </div>
          <div style={{ overflow: "hidden", paddingBottom: "0.15em" }}>
            <span ref={line2Ref} style={{ display: "block" }}>
              Alif Sya&apos;bani
            </span>
          </div>
        </h1>

        {/* Subheading */}
        <p
          ref={subRef}
          className={`
            font-cabinet mb-5
            text-base sm:text-lg md:text-xl
            leading-relaxed
            ${theme === "dark" ? "text-blue-100/65" : "text-slate-600"}
          `}
        >
          Bachelor of Applied Science in Informatics Engineering
          <span className={`block text-sm md:text-base mt-1 ${theme === "dark" ? "text-blue-200/45" : "text-slate-400"}`}>
            State Polytechnic of Malang
          </span>
        </p>

        {/* Typewriter */}
        <div ref={typeRef} className="mb-8">
          <Typewriter />
        </div>

        {/* CTA buttons */}
        <div ref={btnsRef} className="flex flex-wrap items-center justify-center md:justify-start gap-3">
          <Link href="/writing" className="btn-primary">
            <Sparkles size={15} />
            View Projects
            <ArrowRight size={15} />
          </Link>
          <Link href="/about" className="btn-secondary">
            About Me
          </Link>
        </div>

        {/* Stats Counter — appears after TextReveal completes */}
        <div ref={statsRef} className="mt-10 flex justify-center md:justify-start">
          <StatsCounter stats={HERO_STATS} />
        </div>
      </div>

      {/* RIGHT CONTENT – EARTH/PLANET */}
      <div
        ref={earthRef}
        className="
          w-full max-w-md
          h-70 sm:h-90 md:h-130
          hidden sm:block
          relative
        "
        style={{ willChange: "transform, opacity, filter" }}
        aria-label="Animated 3D planet decoration"
        aria-hidden="true"
      >
        {/* Dimming overlay — redup agar heading lebih menonjol */}
        <div
          className="absolute inset-0 z-10 rounded-full pointer-events-none"
          style={{
            background: theme === "dark"
              ? "radial-gradient(circle, rgba(0,0,5,0.45) 30%, rgba(0,0,10,0.15) 70%, transparent 100%)"
              : "radial-gradient(circle, rgba(244,247,251,0.55) 30%, rgba(244,247,251,0.2) 70%, transparent 100%)",
          }}
          aria-hidden
        />
        <PlanetModel theme={theme} />
      </div>

      {/* Scroll indicator */}
      <div
        ref={scrollRef}
        className={`absolute bottom-8 left-1/2 -translate-x-1/2 hidden md:flex flex-col items-center gap-2 ${theme === "dark" ? "text-blue-200/30" : "text-slate-400/60"}`}
      >
        <span className="text-[10px] uppercase tracking-widest">Scroll</span>
        <div className={`w-px h-8 bg-linear-to-b animate-bounce-slow ${theme === "dark" ? "from-blue-400/50" : "from-slate-400/60"} to-transparent`} />
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
    github:    "hover:shadow-[0_0_22px_rgba(255,255,255,0.55)] hover:text-black",
    linkedin:  "hover:shadow-[0_0_22px_rgba(56,189,248,0.6)]  hover:text-sky-700",
    instagram: "hover:shadow-[0_0_26px_rgba(236,72,153,0.65)] hover:text-white",
    tiktok:    "hover:shadow-[0_0_26px_rgba(236,72,153,0.55)] hover:text-white",
    x:         "hover:shadow-[0_0_22px_rgba(255,255,255,0.75)] hover:text-black",
    gmail:     "hover:shadow-[0_0_26px_rgba(239,68,68,0.55)]  hover:text-white",
  };

  const lightShadows: Record<string, string> = {
    github:    "hover:shadow-[0_0_18px_rgba(0,0,0,0.3)] hover:text-black",
    linkedin:  "hover:shadow-[0_0_18px_rgba(14,118,168,0.5)] hover:text-sky-700",
    instagram: "hover:shadow-[0_0_22px_rgba(236,72,153,0.5)] hover:text-pink-600",
    tiktok:    "hover:shadow-[0_0_22px_rgba(236,72,153,0.4)] hover:text-slate-900",
    x:         "hover:shadow-[0_0_18px_rgba(0,0,0,0.4)] hover:text-black",
    gmail:     "hover:shadow-[0_0_22px_rgba(220,38,38,0.45)] hover:text-red-600",
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
