"use client";

import { useRef } from "react";
import { gsap } from "gsap";
import { Github, ExternalLink } from "lucide-react";

export default function WritingCard({
  title,
  excerpt,
  date,
  category,
  cover,
  github,
  website,
}: {
  title: string;
  excerpt: string;
  date: string;
  category: string;
  cover: string;
  github: string;
  website: string;
}) {
  const cardRef = useRef<HTMLElement>(null);
  const glareRef = useRef<HTMLDivElement>(null);

  const handleMouseEnter = () => {
    if (glareRef.current) gsap.to(glareRef.current, { opacity: 1, duration: 0.3 });
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    const card = cardRef.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const rx = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    const ry = ((e.clientY - rect.top) / rect.height) * 2 - 1;
    gsap.to(card, {
      rotateX: -ry * 7,
      rotateY: rx * 7,
      x: rx * 10,
      y: ry * 10,
      duration: 0.3,
      ease: "power2.out",
    });

    if (glareRef.current) {
      const px = ((e.clientX - rect.left) / rect.width) * 100;
      const py = ((e.clientY - rect.top) / rect.height) * 100;
      glareRef.current.style.background = `radial-gradient(circle at ${px}% ${py}%, rgba(255,255,255,0.18) 0%, transparent 60%)`;
    }
  };

  const handleMouseLeave = () => {
    gsap.to(cardRef.current, {
      x: 0,
      y: 0,
      rotateX: 0,
      rotateY: 0,
      duration: 0.8,
      ease: "elastic.out(1, 0.3)",
    });
    if (glareRef.current) gsap.to(glareRef.current, { opacity: 0, duration: 0.5 });
  };

  return (
    <article
      ref={cardRef}
      data-cursor="card"
      className="group glass-card card-float rounded-2xl overflow-hidden relative"
      style={{ perspective: "1000px", transformStyle: "preserve-3d" }}
      onMouseEnter={handleMouseEnter}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {/* Specular glare */}
      <div
        ref={glareRef}
        className="absolute inset-0 pointer-events-none z-30 opacity-0 transition-opacity duration-300"
        aria-hidden
      />

      {/* Cover */}
      <div className="relative w-full overflow-hidden aspect-video">
        <img
          src={cover}
          alt={title}
          className="w-full h-full object-cover block"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent opacity-60 group-hover:opacity-85 transition-opacity duration-300" />
      </div>

      {/* Content */}
      <div className="p-5 md:p-6 relative z-10 flex flex-col">
        <div className="flex items-center justify-between gap-2">
          <span className="px-2.5 py-0.5 text-[11px] uppercase tracking-widest font-semibold rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-300 shadow-[0_0_12px_rgba(245,158,11,0.2)]">
            {category}
          </span>
          <span className="card-muted text-xs">{date}</span>
        </div>

        <h3 className="card-title mt-3 text-base md:text-lg font-bold leading-snug transition-colors group-hover:text-amber-300">
          {title}
        </h3>

        <p className="card-muted mt-2 text-xs md:text-sm leading-relaxed line-clamp-3">
          {excerpt}
        </p>

        {/* Actions */}
        <div className="mt-5 flex items-center gap-3">
          <a
            href={website}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-3d text-xs py-2 px-4 shadow-[0_0_18px_rgba(245,158,11,0.3)]"
          >
            <ExternalLink size={13} />
            Visit Site
          </a>

          <a
            href={github}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-secondary text-xs py-2 px-4"
          >
            <Github size={13} />
            GitHub
          </a>
        </div>
      </div>
    </article>
  );
}

