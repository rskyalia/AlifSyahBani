"use client";

import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Register plugin — safe to call multiple times
gsap.registerPlugin(ScrollTrigger);

export interface StatItem {
  value: number;
  suffix: string; // e.g. "+", "%", "x"
  label: string;
}

export interface StatsCounterProps {
  stats: StatItem[];
  className?: string;
}

export default function StatsCounter({
  stats,
  className,
}: StatsCounterProps): React.JSX.Element {
  const containerRef = useRef<HTMLDivElement>(null);
  // Keep one ref per stat to update DOM text directly
  const displayRefs = useRef<(HTMLSpanElement | null)[]>([]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!containerRef.current) return;

    // prefers-reduced-motion guard: display final values immediately
    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (prefersReduced) {
      stats.forEach((stat, i) => {
        const el = displayRefs.current[i];
        if (el) {
          el.textContent = `${stat.value}${stat.suffix}`;
        }
      });
      return;
    }

    // Wrap all animations in gsap.context for safe cleanup
    const ctx = gsap.context(() => {
      stats.forEach((stat, i) => {
        const el = displayRefs.current[i];
        if (!el) return;

        const target = stat.value;
        const obj = { val: 0 };

        const tween = gsap.to(obj, {
          val: target,
          duration: 2.0,
          ease: "power2.out",
          paused: true,
          onUpdate() {
            const current = Math.round(this.targets()[0].val);
            el.textContent = `${current}${stat.suffix}`;
          },
          onComplete() {
            // Ensure exact final value
            el.textContent = `${target}${stat.suffix}`;
            st.kill();
          },
        });

        const st = ScrollTrigger.create({
          trigger: containerRef.current,
          start: "top 75%",
          once: true,
          onEnter() {
            tween.play();
          },
        });
      });
    }, containerRef);

    return () => {
      ctx.revert();
    };
  }, [stats]);

  return (
    <div
      ref={containerRef}
      className={className}
      style={{
        display: "flex",
        gap: "2rem",
        flexWrap: "wrap",
      }}
    >
      {stats.map((stat, i) => (
        <div
          key={`${stat.label}-${i}`}
          style={{ display: "flex", flexDirection: "column", alignItems: "flex-start" }}
        >
          {/*
           * aria-label provides the full accessible description.
           * The visible <span> starts empty and is filled by GSAP onUpdate.
           * The initialisation shows "0{suffix}" before the tween starts via
           * the ref callback below.
           */}
          <span
            aria-label={`${stat.value}${stat.suffix} ${stat.label}`}
            ref={(el) => {
              displayRefs.current[i] = el;
              // Set initial display value
              if (el && el.textContent === "") {
                el.textContent = `0${stat.suffix}`;
              }
            }}
            style={{
              fontSize: "var(--text-counter)",
              fontWeight: 800,
              lineHeight: "var(--lh-display)",
              letterSpacing: "var(--ls-h2)",
              color: "var(--foreground)",
            }}
          />
          <span
            style={{
              fontSize: "0.85rem",
              fontWeight: 500,
              color: "rgba(147, 197, 253, 0.75)",
              marginTop: "0.25rem",
              letterSpacing: "0.06em",
              textTransform: "uppercase",
            }}
          >
            {stat.label}
          </span>
        </div>
      ))}
    </div>
  );
}
