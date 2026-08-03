"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";

interface PreloaderProps {
  onComplete: () => void;
}

export default function Preloader({ onComplete }: PreloaderProps) {
  const wrapperRef  = useRef<HTMLDivElement>(null);
  const nameRef     = useRef<HTMLHeadingElement>(null);
  const taglineRef  = useRef<HTMLDivElement>(null);
  const counterRef  = useRef<HTMLDivElement>(null);

  const [count, setCount] = useState(0);

  useEffect(() => {
    // Lock scroll while preloader is visible
    document.body.style.overflow = "hidden";

    const tl = gsap.timeline({
      onComplete: () => {
        document.body.style.overflow = "";
        onComplete();
      },
    });

    // Init — all hidden, wrapper fully visible via clip-path
    gsap.set([nameRef.current, taglineRef.current, counterRef.current], { autoAlpha: 0 });
    gsap.set(wrapperRef.current, { clipPath: "inset(0% 0% 0% 0%)" });

    // Fade in: name → tagline → counter
    tl
      .to(nameRef.current,    { autoAlpha: 1, duration: 0.4, ease: "power2.out" })
      .to(taglineRef.current, { autoAlpha: 1, duration: 0.35, ease: "power2.out" }, "-=0.15")
      .to(counterRef.current, { autoAlpha: 1, duration: 0.3,  ease: "power2.out" }, "-=0.1");

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

    // Cinematic clip-path exit — collapses from top AND bottom simultaneously to center
    tl.to(wrapperRef.current, {
      clipPath: "inset(50% 0% 50% 0%)",
      duration: 1.2,
      ease: "power4.inOut",
    });

    return () => {
      tl.kill();
      // Restore scroll on unmount (covers cases where component is removed before onComplete)
      document.body.style.overflow = "";
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div
      ref={wrapperRef}
      className="fixed inset-0 z-99999 flex flex-col items-center justify-center"
      style={{ background: "#000000" }}
      aria-hidden
    >
      {/* Name heading */}
      <h1
        ref={nameRef}
        className="relative select-none text-center leading-none"
        style={{
          fontSize: "var(--text-preloader)",
          fontWeight: 800,
          letterSpacing: "-0.04em",
          color: "#ffffff",
        }}
      >
        ALIF SYA&apos;BANI
      </h1>

      {/* Tagline */}
      <div
        ref={taglineRef}
        className="relative text-center select-none"
        style={{
          fontSize: "var(--text-preloader-tagline)",
          color: "rgba(255,255,255,0.55)",
          marginTop: "0.75rem",
          letterSpacing: "0.05em",
        }}
      >
        Informatics Engineer &amp; Creative Developer
      </div>

      {/* Counter */}
      <div
        ref={counterRef}
        className="relative select-none tabular-nums font-bold leading-none"
        style={{
          fontSize: "clamp(6rem, 22vw, 14rem)",
          letterSpacing: "-0.04em",
          color: "#ffffff",
          marginTop: "2rem",
        }}
      >
        {count}%
      </div>
    </div>
  );
}
