"use client";

import { useRef } from "react";
import { gsap } from "gsap";
import { ExternalLink } from "lucide-react";

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

  const handleMouseEnter = () => {
    gsap.to(imgRef.current, { scale: 1.08, duration: 0.6, ease: "power2.out" });
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = cardRef.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const rx = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    const ry = ((e.clientY - rect.top) / rect.height) * 2 - 1;
    const { rotateX, rotateY, x, y } = computeTiltValues(rx, ry);
    gsap.to(card, { rotateX, rotateY, x, y, duration: 0.3, ease: "power2.out" });
  };

  const handleMouseLeave = () => {
    gsap.to(cardRef.current, {
      x: 0, y: 0, rotateX: 0, rotateY: 0,
      duration: 0.8, ease: "elastic.out(1, 0.3)",
    });
    gsap.to(imgRef.current, { scale: 1, duration: 0.6, ease: "power2.out" });
  };

  return (
    <div
      ref={cardRef}
      data-cursor="card"
      className="group glass-card rounded-2xl overflow-hidden"
      style={{ perspective: "1000px", transformStyle: "preserve-3d" }}
      onMouseEnter={handleMouseEnter}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {/* Image with overlay */}
      <div className="relative overflow-hidden h-48">
        <img
          ref={imgRef}
          src={image}
          alt={title}
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60" />
      </div>

      {/* Content */}
      <div className="p-5 flex flex-col gap-3">
        <div className="flex items-start justify-between gap-3">
          <h3 className="card-title text-base font-semibold leading-snug transition-colors">
            {title}
          </h3>
          {demo && (
            <a
              href={demo}
              target="_blank"
              rel="noopener noreferrer"
              className="shrink-0 inline-flex items-center gap-1.5 text-xs card-link transition-colors"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              Visit
            </a>
          )}
        </div>
        <p className="card-muted text-xs leading-relaxed line-clamp-3">{description}</p>
        <div className="flex flex-wrap gap-1.5 mt-auto pt-1">
          {tech.map((t) => (
            <span
              key={t}
              className="px-2.5 py-0.5 text-xs rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400"
            >
              {t}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
