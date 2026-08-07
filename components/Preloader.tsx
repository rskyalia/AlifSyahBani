"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";

interface PreloaderProps {
  onComplete: () => void;
}

export default function Preloader({ onComplete }: PreloaderProps) {
  const wrapperRef    = useRef<HTMLDivElement>(null);
  const progressRef   = useRef<HTMLDivElement>(null);   // thin progress bar fill
  const countRef      = useRef<HTMLDivElement>(null);   // large counter number
  const nameLine1Ref  = useRef<HTMLSpanElement>(null);  // "ALIF" reveal
  const nameLine2Ref  = useRef<HTMLSpanElement>(null);  // "SYA'BANI" reveal
  const taglineRef    = useRef<HTMLDivElement>(null);
  const gridRef       = useRef<HTMLDivElement>(null);

  const [count, setCount] = useState(0);

  useEffect(() => {
    document.body.style.overflow = "hidden";

    const tl = gsap.timeline({
      onComplete: () => {
        document.body.style.overflow = "";
        onComplete();
      },
    });

    // ── Phase 1: Instant reveal of grid + counter (no flash — CSS already hides them)
    tl.to(gridRef.current, {
      opacity: 1,
      duration: 0.5,
      ease: "power2.out",
    });

    // ── Phase 2: Name lines slide up from clip
    tl.to(
      [nameLine1Ref.current, nameLine2Ref.current],
      {
        y: "0%",
        duration: 0.75,
        ease: "power4.out",
        stagger: 0.08,
      },
      "-=0.2"
    );

    // Tagline fade
    tl.to(taglineRef.current, {
      opacity: 1,
      y: 0,
      duration: 0.5,
      ease: "power3.out",
    }, "-=0.4");

    // Counter fade in
    tl.to(countRef.current, {
      opacity: 1,
      duration: 0.3,
      ease: "power2.out",
    }, "-=0.3");

    // ── Phase 3: Count 0 → 100 with progress bar
    const obj = { val: 0, bar: 0 };
    tl.to(obj, {
      val: 100,
      bar: 100,
      duration: 1.8,
      ease: "power1.inOut",
      onUpdate() {
        setCount(Math.round(obj.val));
        if (progressRef.current) {
          progressRef.current.style.width = `${obj.bar}%`;
        }
      },
    }, "+=0.1");

    // ── Hold at 100%
    tl.to({}, { duration: 0.3 });

    // ── Phase 4: Cinematic exit
    // Progress bar flashes
    tl.to(progressRef.current, {
      opacity: 0,
      duration: 0.2,
      ease: "power2.in",
    });

    // Name + tagline slide out up
    tl.to(
      [nameLine1Ref.current, nameLine2Ref.current, taglineRef.current, countRef.current],
      {
        y: "-30px",
        opacity: 0,
        duration: 0.45,
        ease: "power3.in",
        stagger: 0.04,
      },
      "<"
    );

    // Wrapper collapses from top+bottom to center (clip-path)
    tl.to(wrapperRef.current, {
      clipPath: "inset(50% 0% 50% 0%)",
      duration: 1.0,
      ease: "power4.inOut",
    }, "-=0.1");

    return () => {
      tl.kill();
      document.body.style.overflow = "";
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div
      ref={wrapperRef}
      className="fixed inset-0 flex flex-col items-center justify-center select-none"
      style={{
        zIndex: 99999,
        background: "#000000",
        clipPath: "inset(0% 0% 0% 0%)",
      }}
      aria-hidden
    >
      {/* Decorative grid lines — initially hidden */}
      <div
        ref={gridRef}
        className="absolute inset-0 pointer-events-none"
        style={{ opacity: 0 }}
        aria-hidden
      >
        {/* Horizontal center line */}
        <div
          className="absolute left-0 right-0"
          style={{
            top: "50%",
            height: "1px",
            background: "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.06) 20%, rgba(255,255,255,0.1) 50%, rgba(255,255,255,0.06) 80%, transparent 100%)",
          }}
        />
        {/* Vertical center line */}
        <div
          className="absolute top-0 bottom-0"
          style={{
            left: "50%",
            width: "1px",
            background: "linear-gradient(180deg, transparent 0%, rgba(255,255,255,0.05) 30%, rgba(255,255,255,0.08) 50%, rgba(255,255,255,0.05) 70%, transparent 100%)",
          }}
        />
        {/* Corner marks */}
        {[
          { top: "2rem", left: "2.5rem" },
          { top: "2rem", right: "2.5rem" },
          { bottom: "2rem", left: "2.5rem" },
          { bottom: "2rem", right: "2.5rem" },
        ].map((pos, i) => (
          <div
            key={i}
            className="absolute"
            style={{
              ...pos,
              width: "20px",
              height: "20px",
              borderTop: i < 2 ? "1px solid rgba(255,255,255,0.15)" : undefined,
              borderBottom: i >= 2 ? "1px solid rgba(255,255,255,0.15)" : undefined,
              borderLeft: i % 2 === 0 ? "1px solid rgba(255,255,255,0.15)" : undefined,
              borderRight: i % 2 === 1 ? "1px solid rgba(255,255,255,0.15)" : undefined,
            }}
          />
        ))}
      </div>

      {/* Name — each line in overflow-hidden clip container */}
      <div className="relative text-center mb-3" style={{ zIndex: 1 }}>
        {/* Line 1: ALIF */}
        <div style={{ overflow: "hidden", lineHeight: 1 }}>
          <span
            ref={nameLine1Ref}
            className="block font-black uppercase tracking-tight"
            style={{
              fontSize: "clamp(3.5rem, 10vw, 8rem)",
              letterSpacing: "-0.04em",
              color: "#ffffff",
              transform: "translateY(110%)",  /* hidden initially — GSAP animates to 0% */
              display: "block",
              lineHeight: 1,
            }}
          >
            ALIF
          </span>
        </div>
        {/* Line 2: SYA'BANI */}
        <div style={{ overflow: "hidden", lineHeight: 1 }}>
          <span
            ref={nameLine2Ref}
            className="block font-black uppercase tracking-tight"
            style={{
              fontSize: "clamp(3.5rem, 10vw, 8rem)",
              letterSpacing: "-0.04em",
              color: "#ffffff",
              transform: "translateY(110%)",
              display: "block",
              lineHeight: 1,
            }}
          >
            SYA&apos;BANI
          </span>
        </div>
      </div>

      {/* Tagline — hidden initially */}
      <div
        ref={taglineRef}
        className="text-center tracking-widest uppercase"
        style={{
          fontSize: "clamp(0.6rem, 1.2vw, 0.85rem)",
          color: "rgba(255,255,255,0.35)",
          letterSpacing: "0.25em",
          opacity: 0,
          transform: "translateY(8px)",
          zIndex: 1,
          marginBottom: "3rem",
        }}
      >
        Informatics Engineer &nbsp;·&nbsp; Creative Developer
      </div>

      {/* Large counter — focal point, hidden initially */}
      <div
        ref={countRef}
        className="tabular-nums font-black leading-none"
        style={{
          fontSize: "clamp(5rem, 18vw, 12rem)",
          letterSpacing: "-0.05em",
          color: "rgba(255,255,255,0.08)",
          opacity: 0,
          position: "absolute",
          bottom: "8vh",
          right: "6vw",
          zIndex: 0,
          userSelect: "none",
          lineHeight: 1,
        }}
      >
        {String(count).padStart(2, "0")}
      </div>

      {/* Progress bar — bottom of screen */}
      <div
        className="absolute bottom-0 left-0 right-0"
        style={{ zIndex: 2 }}
      >
        {/* Track */}
        <div
          style={{
            height: "2px",
            background: "rgba(255,255,255,0.07)",
            position: "relative",
            overflow: "hidden",
          }}
        >
          {/* Fill */}
          <div
            ref={progressRef}
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              height: "100%",
              width: "0%",
              background: "linear-gradient(90deg, rgba(59,130,246,0.8), rgba(147,197,253,1))",
              boxShadow: "0 0 12px rgba(59,130,246,0.6)",
            }}
          />
        </div>
      </div>
    </div>
  );
}
