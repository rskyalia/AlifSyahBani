"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";

interface PreloaderProps {
  onComplete: () => void;
}

export default function Preloader({ onComplete }: PreloaderProps) {
  const wrapperRef  = useRef<HTMLDivElement>(null);
  const counterRef  = useRef<HTMLDivElement>(null);
  const descRef     = useRef<HTMLDivElement>(null);

  const [count, setCount] = useState(0);

  useEffect(() => {
    const tl = gsap.timeline();

    // Init
    gsap.set(counterRef.current, { autoAlpha: 0 });
    gsap.set(descRef.current, { autoAlpha: 0 });

    // Fade in
    tl
      .to(counterRef.current, { autoAlpha: 1, duration: 0.3, ease: "power2.out" })
      .to(descRef.current, { autoAlpha: 1, duration: 0.4, ease: "power2.out" }, "-=0.2");

    // Count 0 → 100
    const obj = { val: 0 };
    tl.to(obj, {
      val: 100,
      duration: 1.8,
      ease: "power1.inOut",
      onUpdate() {
        setCount(Math.round(obj.val));
      },
    }, "+=0.05");

    // Hold
    tl.to({}, { duration: 0.25 });

    // Fade out
    tl
      .to([counterRef.current, descRef.current], {
        autoAlpha: 0,
        filter: "blur(8px)",
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
      className="fixed inset-0 z-99999 flex flex-col items-center justify-center"
      style={{ background: "#000000" }}
      aria-hidden
    >

      {/* Counter */}
      <div
        ref={counterRef}
        className="relative select-none tabular-nums font-bold leading-none"
        style={{
          fontSize: "clamp(6rem, 22vw, 14rem)",
          letterSpacing: "-0.04em",
          color: "#ffffff",
        }}
      >
        {count}%
      </div>

      {/* Description */}
      <div
        ref={descRef}
        className="relative text-center select-none"
        style={{
          color: "rgba(255,255,255,0.65)",
          fontSize: "clamp(0.75rem, 1.5vw, 0.95rem)",
          maxWidth: "480px",
          lineHeight: 1.6,
          marginTop: "1.5rem",
          padding: "0 1.5rem",
        }}
      >
        Hi, I&apos;m Alif Sya&apos;bani. An Informatics Engineering graduate from State Polytechnic of Malang who is passionate about technology, digital innovation, and problem-solving. I love turning ideas into practical solutions through software and continuously exploring new opportunities to grow as a tech professional.
      </div>
    </div>
  );
}
