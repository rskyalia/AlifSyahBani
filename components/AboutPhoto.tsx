"use client";

import { useRef } from "react";
import { gsap } from "gsap";
import { useTheme } from "./ThemeContext";
import { Sparkles, Code, Mic } from "lucide-react";

export default function AboutPhoto() {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const frameRef = useRef<HTMLDivElement>(null);
  const glareRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const frame = frameRef.current;
    if (!frame) return;
    const rect = frame.getBoundingClientRect();
    const rx = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    const ry = ((e.clientY - rect.top) / rect.height) * 2 - 1;

    gsap.to(frame, {
      rotateX: -ry * 9,
      rotateY: rx * 9,
      duration: 0.35,
      ease: "power2.out",
    });

    if (glareRef.current) {
      const px = ((e.clientX - rect.left) / rect.width) * 100;
      const py = ((e.clientY - rect.top) / rect.height) * 100;
      glareRef.current.style.background = `radial-gradient(circle at ${px}% ${py}%, rgba(255,255,255,0.25) 0%, transparent 60%)`;
      glareRef.current.style.opacity = "1";
    }
  };

  const handleMouseLeave = () => {
    gsap.to(frameRef.current, {
      rotateX: 0,
      rotateY: 0,
      duration: 0.8,
      ease: "elastic.out(1, 0.3)",
    });
    if (glareRef.current) gsap.to(glareRef.current, { opacity: 0, duration: 0.5 });
  };

  return (
    <div className="flex justify-center md:justify-end perspective-1200">
      <div
        ref={frameRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className="relative w-full max-w-[320px] sm:max-w-[360px] md:max-w-[380px] preserve-3d cursor-pointer"
      >
        {/* Ambient Backglow */}
        <div
          className={`
            absolute -inset-6 rounded-3xl blur-3xl pointer-events-none
            ${isDark
              ? "bg-gradient-to-br from-amber-500/35 via-amber-400/15 to-transparent"
              : "bg-gradient-to-br from-blue-400/30 via-blue-300/15 to-transparent"
            }
          `}
          aria-hidden
        />

        {/* 3D Glass Photo Container */}
        <div
          className="relative z-10 rounded-3xl overflow-hidden p-2.5 glass-card-3d"
          style={{
            boxShadow: isDark
              ? "0 25px 70px rgba(0,0,0,0.8), 0 0 50px rgba(245,158,11,0.25)"
              : "0 25px 70px rgba(15,23,42,0.18), 0 0 50px rgba(37,99,235,0.2)",
          }}
        >
          {/* Specular glare */}
          <div
            ref={glareRef}
            className="absolute inset-0 pointer-events-none z-30 opacity-0 transition-opacity duration-300"
            aria-hidden
          />

          <img
            src="/about/fotodiri.jpg"
            alt="Muhammad Alif Sya'bani — Informatics Engineering student and software developer"
            className="w-full h-auto rounded-2xl object-cover block"
          />
        </div>

        {/* Floating 3D Satellite Chip 1 — Top Left */}
        <div
          className="absolute -top-3 -left-4 z-20 badge-3d shadow-xl animate-bounce-slow"
          style={{
            transform: "translateZ(35px)",
            animationDuration: "3.5s",
          }}
        >
          <Code size={14} className={isDark ? "text-amber-400" : "text-blue-500"} />
          <span>Full-Stack Dev</span>
        </div>

        {/* Floating 3D Satellite Chip 2 — Bottom Right */}
        <div
          className="absolute -bottom-3 -right-4 z-20 badge-3d shadow-xl animate-bounce-slow"
          style={{
            transform: "translateZ(35px)",
            animationDuration: "4.2s",
            animationDelay: "0.5s",
          }}
        >
          <Mic size={14} className={isDark ? "text-amber-400" : "text-blue-500"} />
          <span>Public Speaker</span>
        </div>

        {/* Floating 3D Satellite Chip 3 — Middle Right */}
        <div
          className="absolute top-1/3 -right-6 z-20 badge-3d shadow-xl hidden sm:inline-flex animate-bounce-slow"
          style={{
            transform: "translateZ(25px)",
            animationDuration: "3.8s",
            animationDelay: "1s",
          }}
        >
          <Sparkles size={13} className={isDark ? "text-amber-400" : "text-blue-500"} />
          <span>AI / ML</span>
        </div>
      </div>
    </div>
  );
}

