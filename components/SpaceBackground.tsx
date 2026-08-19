"use client";

import { useEffect, useRef } from "react";

export default function SpaceBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const onResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", onResize);

    // Auto-drifting 3D star particles — no mouse interaction
    const NUM_STARS = 120;
    const stars = Array.from({ length: NUM_STARS }, () => ({
      x: (Math.random() - 0.5) * width * 1.5,
      y: (Math.random() - 0.5) * height * 1.5,
      z: Math.random() * 1000 + 100,
      size: Math.random() * 1.8 + 0.6,
      color: Math.random() > 0.3 ? "#F59E0B" : "#FDE68A",
      alpha: Math.random() * 0.7 + 0.3,
    }));

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      const cx = width / 2;
      const cy = height / 2;
      const fov = 400;

      for (let i = 0; i < stars.length; i++) {
        const star = stars[i];

        // Drift stars forward in Z automatically
        star.z -= 0.35;
        if (star.z <= 0) {
          star.z = 1000;
          star.x = (Math.random() - 0.5) * width * 1.5;
          star.y = (Math.random() - 0.5) * height * 1.5;
        }

        // Project 3D → 2D, no parallax offset
        const scale = fov / (fov + star.z);
        const px = cx + star.x * scale;
        const py = cy + star.y * scale;

        if (px >= 0 && px <= width && py >= 0 && py <= height) {
          const radius = Math.max(0.4, star.size * scale * 1.4);
          ctx.beginPath();
          ctx.arc(px, py, radius, 0, Math.PI * 2);
          ctx.fillStyle = star.color;
          ctx.globalAlpha = star.alpha * scale * 1.2;
          ctx.shadowBlur = radius > 1.2 ? 6 : 0;
          ctx.shadowColor = star.color;
          ctx.fill();
        }
      }

      ctx.globalAlpha = 1.0;
      ctx.shadowBlur = 0;
      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener("resize", onResize);
      cancelAnimationFrame(animId);
    };
  }, []);

  return (
    <div className="space-bg" aria-hidden>
      {/* Deep space base */}
      <div className="space-bg__base" />

      {/* Auto-animated 3D Stars Canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 pointer-events-none z-0"
        style={{ mixBlendMode: "screen" }}
      />

      {/* Nebula clouds */}
      <div className="space-bg__nebula space-bg__nebula--1" />
      <div className="space-bg__nebula space-bg__nebula--2" />
      <div className="space-bg__nebula space-bg__nebula--3" />

      {/* Aurora ribbons */}
      <div className="space-bg__aurora space-bg__aurora--1" />
      <div className="space-bg__aurora space-bg__aurora--2" />
      <div className="space-bg__aurora space-bg__aurora--3" />
      <div className="space-bg__aurora space-bg__aurora--4" />

      {/* Vignette — keeps edges dark */}
      <div className="space-bg__vignette" />
    </div>
  );
}
