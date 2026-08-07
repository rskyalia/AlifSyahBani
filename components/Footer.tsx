"use client";

import { useRef, useEffect } from "react";
import Link from "next/link";
import { FaGithub, FaLinkedin, FaInstagram } from "react-icons/fa6";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useScrollReveal } from "../hooks/useScrollReveal";
import { useTheme } from "./ThemeContext";

gsap.registerPlugin(ScrollTrigger);

// Tech-stack items for the marquee
const MARQUEE_ITEMS = [
  "React",
  "Next.js",
  "TypeScript",
  "GSAP",
  "Three.js",
  "Tailwind CSS",
  "Lenis",
  "Framer Motion",
  "Node.js",
  "Figma",
];

export default function Footer() {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const year = new Date().getFullYear();

  // Refs for animations
  const headingRef = useRef<HTMLHeadingElement>(null);
  const marqueeRef = useRef<HTMLDivElement>(null);
  const marqueeWrapRef = useRef<HTMLDivElement>(null);

  // TextReveal on heading via useScrollReveal (clip-reveal preset)
  useScrollReveal(headingRef, {
    preset: "clip-reveal",
    duration: 0.9,
    ease: "power4.out",
    start: "top 90%",
  });

  // Marquee GSAP animation with ResizeObserver guard
  useEffect(() => {
    if (typeof window === "undefined") return;

    const marqueeEl = marqueeRef.current;
    const wrapEl = marqueeWrapRef.current;
    if (!marqueeEl || !wrapEl) return;

    // Check reduced motion preference
    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (prefersReduced) return;

    let tween: gsap.core.Tween | null = null;

    const startMarquee = () => {
      if (tween) {
        tween.kill();
        tween = null;
      }

      const width = marqueeEl.scrollWidth;
      if (width === 0) return; // guard: don't start if width is 0

      tween = gsap.to(marqueeEl, {
        x: "-50%",
        duration: 20,
        ease: "none",
        repeat: -1,
      });
    };

    // Start immediately
    startMarquee();

    // ResizeObserver guard: restart if width changes (e.g. SSR hydration or layout shift)
    const observer = new ResizeObserver(() => {
      const width = marqueeEl.scrollWidth;
      if (width === 0) return;
      if (tween) {
        tween.invalidate();
        tween.kill();
      }
      tween = gsap.to(marqueeEl, {
        x: "-50%",
        duration: 20,
        ease: "none",
        repeat: -1,
      });
    });

    observer.observe(wrapEl);

    return () => {
      observer.disconnect();
      if (tween) tween.kill();
    };
  }, []);

  // Social link underline hover animations
  const githubUnderlineRef = useRef<HTMLSpanElement>(null);
  const linkedinUnderlineRef = useRef<HTMLSpanElement>(null);
  const instagramUnderlineRef = useRef<HTMLSpanElement>(null);

  const handleSocialEnter = (underlineRef: React.RefObject<HTMLSpanElement | null>) => {
    if (!underlineRef.current) return;
    gsap.to(underlineRef.current, {
      scaleX: 1,
      transformOrigin: "left",
      duration: 0.3,
      ease: "power2.out",
    });
  };

  const handleSocialLeave = (underlineRef: React.RefObject<HTMLSpanElement | null>) => {
    if (!underlineRef.current) return;
    gsap.to(underlineRef.current, {
      scaleX: 0,
      transformOrigin: "left",
      duration: 0.3,
      ease: "power2.out",
    });
  };

  return (
    <footer
      style={{ background: "transparent" }}
      className={`overflow-hidden ${
        isDark ? "border-t border-white/6" : "border-t border-slate-200/80"
      }`}
    >
      {/* Large Name Heading with TextReveal */}
      <div className="px-6 md:px-20 pt-16 pb-6">
        <h2
          ref={headingRef}
          style={{
            fontSize: "clamp(3rem, 8vw, 6rem)",
            fontWeight: 800,
            letterSpacing: "-0.02em",
            lineHeight: 1.05,
          }}
          className={`uppercase ${
            isDark ? "text-white" : "text-slate-900"
          }`}
        >
          ALIF SYA&apos;BANI
        </h2>
      </div>

      {/* Marquee / Ticker */}
      <div
        ref={marqueeWrapRef}
        className={`overflow-hidden py-4 border-y ${
          isDark ? "border-white/8" : "border-slate-200/60"
        }`}
        aria-hidden="true"
      >
        <div
          ref={marqueeRef}
          className="flex whitespace-nowrap"
          style={{ willChange: "transform" }}
        >
          {/* Duplicated content for seamless loop — at x: -50%, it wraps back to start */}
          {[...MARQUEE_ITEMS, ...MARQUEE_ITEMS].map((item, i) => (
            <span
              key={i}
              className={`inline-flex items-center gap-4 px-6 text-sm font-semibold uppercase tracking-widest ${
                isDark ? "text-white/40" : "text-slate-400"
              }`}
            >
              {item}
              <span
                className={`inline-block w-1.5 h-1.5 rounded-full ${
                  isDark ? "bg-white/25" : "bg-slate-300"
                }`}
              />
            </span>
          ))}
        </div>
      </div>

      {/* Footer Bottom */}
      <div className="px-6 md:px-20 py-10">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Left: copyright */}
          <div className="text-center md:text-left">
            <p
              className={`text-xs mt-1 ${
                isDark ? "text-white/35" : "text-slate-400"
              }`}
            >
              © {year} · Built with Next.js &amp; Tailwind CSS
            </p>
          </div>

          {/* Center: Available for Work */}
          <a
            href="mailto:alifsyahbani@example.com"
            data-magnetic
            data-cursor="link"
            className={`text-sm font-semibold uppercase tracking-widest transition-colors ${
              isDark
                ? "text-white/70 hover:text-white"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            AVAILABLE FOR WORK
          </a>

          {/* Right: social links */}
          <div className="flex items-center gap-6">
            {/* GitHub */}
            <a
              href="https://github.com/rskyalia"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub"
              className={`relative inline-block transition-colors ${
                isDark
                  ? "text-white/40 hover:text-white/80"
                  : "text-slate-400 hover:text-slate-700"
              }`}
              onMouseEnter={() => handleSocialEnter(githubUnderlineRef)}
              onMouseLeave={() => handleSocialLeave(githubUnderlineRef)}
            >
              <FaGithub size={18} />
              <span
                ref={githubUnderlineRef}
                className={`absolute bottom-0 left-0 right-0 h-px origin-left ${
                  isDark ? "bg-white/60" : "bg-slate-600"
                }`}
                style={{ transform: "scaleX(0)" }}
              />
            </a>

            {/* LinkedIn */}
            <a
              href="https://www.linkedin.com/in/alif-syahbani-01056b304/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn"
              className={`relative inline-block transition-colors ${
                isDark
                  ? "text-white/40 hover:text-sky-400"
                  : "text-slate-400 hover:text-sky-600"
              }`}
              onMouseEnter={() => handleSocialEnter(linkedinUnderlineRef)}
              onMouseLeave={() => handleSocialLeave(linkedinUnderlineRef)}
            >
              <FaLinkedin size={18} />
              <span
                ref={linkedinUnderlineRef}
                className={`absolute bottom-0 left-0 right-0 h-px origin-left ${
                  isDark ? "bg-sky-400/70" : "bg-sky-600"
                }`}
                style={{ transform: "scaleX(0)" }}
              />
            </a>

            {/* Instagram */}
            <a
              href="https://www.instagram.com/syah.baani/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              className={`relative inline-block transition-colors ${
                isDark
                  ? "text-white/40 hover:text-pink-400"
                  : "text-slate-400 hover:text-pink-500"
              }`}
              onMouseEnter={() => handleSocialEnter(instagramUnderlineRef)}
              onMouseLeave={() => handleSocialLeave(instagramUnderlineRef)}
            >
              <FaInstagram size={18} />
              <span
                ref={instagramUnderlineRef}
                className={`absolute bottom-0 left-0 right-0 h-px origin-left ${
                  isDark ? "bg-pink-400/70" : "bg-pink-500"
                }`}
                style={{ transform: "scaleX(0)" }}
              />
            </a>

            {/* Resume link */}
            <Link
              href="/resume"
              data-cursor="link"
              className={`text-xs transition-colors ${
                isDark
                  ? "text-amber-400/60 hover:text-amber-300"
                  : "text-amber-600/70 hover:text-amber-700"
              }`}
            >
              Resume →
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
