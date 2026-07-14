"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";

interface PreloaderProps {
  onComplete: () => void;
}

export default function Preloader({ onComplete }: PreloaderProps) {
  const wrapperRef  = useRef<HTMLDivElement>(null);
  const counterRef  = useRef<HTMLDivElement>(null);
  const glowRef     = useRef<HTMLDivElement>(null);

  const [count, setCount] = useState(0);

  useEffect(() => {
    const tl = gsap.timeline();

    // Init
    gsap.set(counterRef.current, { autoAlpha: 0 });
    gsap.set(glowRef.current, { opacity: 0 });

    // Fade in
    tl
      .to(glowRef.current, { opacity: 1, duration: 0.35, ease: "power2.out" })
      .to(counterRef.current, { autoAlpha: 1, duration: 0.3, ease: "power2.out" }, "-=0.2");

    // Count 0 → 100
    const obj = { val: 0 };
    tl.to(obj, {
      val: 100,
      duration: 1,
      ease: "power1.inOut",
      onUpdate() {
        setCount(Math.round(obj.val));
      },
    }, "+=0.05");

    // Hold
    tl.to({}, { duration: 0.2 });

    // Fade out
    tl
      .to([counterRef.current, glowRef.current], {
        autoAlpha: 0,
        duration: 0.35,
        ease: "power2.in",
      })
      .call(onComplete);

    return () => { tl.kill(); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div
      ref={wrapperRef}
      className="fixed inset-0 z-[99999] flex items-center justify-center"
      style={{ background: "#000000" }}
      aria-hidden
    >
      {/* Blue glow behind the number */}
      <div
        ref={glowRef}
        className="absolute pointer-events-none"
        style={{
          width: "480px",
          height: "480px",
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(37,99,235,0.28) 0%, rgba(59,130,246,0.12) 45%, transparent 70%)",
          filter: "blur(60px)",
        }}
      />

      {/* Counter */}
      <div
        ref={counterRef}
        className="relative select-none tabular-nums font-bold leading-none"
        style={{
          fontSize: "clamp(6rem, 22vw, 14rem)",
          letterSpacing: "-0.04em",
          background: "linear-gradient(160deg, #ffffff 20%, #93c5fd 65%, #3b82f6 100%)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          backgroundClip: "text",
          filter: "drop-shadow(0 0 32px rgba(59,130,246,0.75))",
        }}
      >
        {count}
      </div>
    </div>
  );
}
