"use client";

import { useRef } from "react";
import { useScrollReveal } from "../hooks/useScrollReveal";

type Props = {
  label?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
  number?: string; // e.g. "01", "02"
};

export default function SectionHeader({
  label,
  title,
  description,
  align = "center",
  number,
}: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  useScrollReveal(containerRef, {
    preset: "clip-reveal",
    duration: 0.8,
    ease: "power4.out",
  });

  const alignClass = align === "center" ? "text-center mx-auto" : "text-left";

  return (
    <div ref={containerRef} className={`mb-12 md:mb-16 max-w-2xl ${alignClass}`}>
      {/* Section number */}
      {number && (
        <span
          style={{
            fontSize: "var(--text-section-label)",
            letterSpacing: "0.15em",
            textTransform: "uppercase",
            display: "block",
            marginBottom: "0.5rem",
            opacity: 0.6,
          }}
        >
          {number}
        </span>
      )}
      {label && <p className="section-label mb-3">{label}</p>}
      <h2
        style={{
          fontSize: "var(--text-h2)",
          letterSpacing: "var(--ls-h2)",
        }}
        className="font-bold"
      >
        {title}
      </h2>
      {description && (
        <p className="mt-4 text-sm md:text-base leading-relaxed description-muted">
          {description}
        </p>
      )}
    </div>
  );
}
