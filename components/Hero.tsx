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
import Typewriter from "./Typewriter";
import Earth from "./Earth";

export default function Hero() {
  const pathname = usePathname();

  const badgeRef   = useRef<HTMLDivElement>(null);
  const socialsRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const subRef     = useRef<HTMLParagraphElement>(null);
  const typeRef    = useRef<HTMLDivElement>(null);
  const btnsRef    = useRef<HTMLDivElement>(null);
  const earthRef   = useRef<HTMLDivElement>(null);
  const scrollRef  = useRef<HTMLDivElement>(null);

  // Re-run every time this component mounts (including when navigating back)
  useEffect(() => {
    const ctx = gsap.context(() => {
      const leftEls = [
        badgeRef.current,
        socialsRef.current,
        headingRef.current,
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
      <div className="w-full max-w-xl text-center md:text-left">

        {/* Status badge */}
        <div ref={badgeRef} className="flex justify-center md:justify-start mb-5">
          <span className="section-label flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)] animate-pulse" />
            Open to opportunities
          </span>
        </div>

        {/* Social icons */}
        <div ref={socialsRef} className="flex justify-center md:justify-start gap-3 mb-7 text-blue-200/60">
          <SocialIcon href="https://github.com/rskyalia"                          icon={<FaGithub />}    variant="github"    />
          <SocialIcon href="https://www.linkedin.com/in/alif-syahbani-01056b304/" icon={<FaLinkedin />}  variant="linkedin"  />
          <SocialIcon href="https://www.instagram.com/syah.baani/"                icon={<FaInstagram />} variant="instagram" />
          <SocialIcon href="https://www.tiktok.com/@syah.baani"                   icon={<FaTiktok />}    variant="tiktok"    />
          <SocialIcon href="https://x.com"                                        icon={<FaXTwitter />}  variant="x"         />
          <SocialIcon href="mailto:muhammad.alif396177@smk.belajar.id"            icon={<MdEmail />}     variant="gmail"     />
        </div>

        {/* Heading */}
        <h1
          ref={headingRef}
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
          ref={subRef}
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
      </div>

      {/* RIGHT CONTENT – EARTH */}
      <div
        ref={earthRef}
        className="
          w-full max-w-md
          h-[280px] sm:h-[360px] md:h-[520px]
          hidden sm:block
        "
        style={{ willChange: "transform, opacity, filter" }}
      >
        <Earth />
      </div>

      {/* Scroll indicator */}
      <div
        ref={scrollRef}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 hidden md:flex flex-col items-center gap-2 text-blue-200/30"
      >
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
