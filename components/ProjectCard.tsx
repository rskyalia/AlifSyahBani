"use client";

import { useRef } from "react";
import { gsap } from "gsap";
import { ExternalLink } from "lucide-react";
import { useScrollReveal } from "@/hooks/useScrollReveal";

type Props = {
  title: string;
  image: string;
  description: string;
  tech: string[];
  github?: string;
  demo?: string;
};

/**
 * Pure function — computes tilt and magnetic offset values.
 * rx, ry are normalized cursor position within the card (-1 to 1).
 * Exported for property-based tests (Property 7, 8).
 */
export function computeTiltValues(rx: number, ry: number) {
  return {
    rotateX: -ry * 8,   // max ±8 degrees
    rotateY: rx * 8,    // max ±8 degrees
    x: rx * 12,         // max ±12px magnetic offset
    y: ry * 12,         // max ±12px magnetic offset
  };
}

export default function ProjectCard({ title, image, description, tech, demo }: Props) {
  const cardRef = useRef<HTMLDivElement>(null);
  const imgRef  = useRef<HTMLImageElement>(null);
  const glareRef = useRef<HTMLDivElement>(null);

  useScrollReveal(cardRef, { preset: 'fade-up', start: 'top 85%' });

  const handleMouseEnter = () => {
    if (glareRef.current) glareRef.current.style.opacity = "1";
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = cardRef.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const rx = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    const ry = ((e.clientY - rect.top) / rect.height) * 2 - 1;
    const { rotateX, rotateY, x, y } = computeTiltValues(rx, ry);
    gsap.to(card, { rotateX, rotateY, x, y, duration: 0.3, ease: "power2.out" });

    if (glareRef.current) {
      const px = ((e.clientX - rect.left) / rect.width) * 100;
      const py = ((e.clientY - rect.top) / rect.height) * 100;
      glareRef.current.style.background = `radial-gradient(circle at ${px}% ${py}%, rgba(255,255,255,0.18) 0%, transparent 60%)`;
    }
  };

  const handleMouseLeave = () => {
    gsap.to(cardRef.current, {
      x: 0, y: 0, rotateX: 0, rotateY: 0,
      duration: 0.8, ease: "elastic.out(1, 0.3)",
    });
    if (glareRef.current) glareRef.current.style.opacity = "0";
  };

  return (
    <div
      ref={cardRef}
      data-cursor="card"
      className="group glass-card card-float rounded-2xl overflow-hidden relative"
      style={{ perspective: "1000px", transformStyle: "preserve-3d" }}
      onMouseEnter={handleMouseEnter}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {/* Specular glare reflection */}
      <div
        ref={glareRef}
        className="absolute inset-0 pointer-events-none z-30 opacity-0 transition-opacity duration-300"
        aria-hidden
      />

      {/* Image with overlay */}
      <div className="relative overflow-hidden aspect-video">
        <img
          ref={imgRef}
          src={image}
          alt={title}
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-70" />
      </div>

      {/* Content */}
      <div className="p-5 sm:p-6 flex flex-col gap-3 relative z-10">
        <div className="flex items-start justify-between gap-3">
          <h3 className="card-title text-base sm:text-lg font-bold leading-snug transition-colors">
            {title}
          </h3>
          {demo && (
            <a
              href={demo}
              target="_blank"
              rel="noopener noreferrer"
              className="shrink-0 inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-full bg-amber-500/15 text-amber-400 border border-amber-500/30 hover:bg-amber-500/25 transition-all shadow-[0_0_12px_rgba(245,158,11,0.2)]"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              Visit
            </a>
          )}
        </div>
        <p className="card-muted text-xs sm:text-sm leading-relaxed line-clamp-3">{description}</p>
        <div className="flex flex-wrap gap-1.5 mt-auto pt-1">
          {tech.map((t) => (
            <span
              key={t}
              className="px-2.5 py-0.5 text-xs rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-300/90 group-hover:border-amber-500/40 group-hover:text-amber-200 transition-colors"
            >
              {t}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

