"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { gsap } from "gsap";

const PAGE_LABELS: Record<string, string> = {
  "/": "Home",
  "/projects": "Show",
  "/writing": "Projects",
  "/about": "About",
  "/resume": "Resume",
};

export default function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const prevPathname = useRef<string | null>(null);

  const panelBlueRef = useRef<HTMLDivElement>(null);
  const panelDarkRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  // Track which label to show mid-transition
  const [transitionLabel, setTransitionLabel] = useState("");

  useEffect(() => {
    const panelBlue = panelBlueRef.current;
    const panelDark = panelDarkRef.current;
    const logo = logoRef.current;
    const content = contentRef.current;
    if (!panelBlue || !panelDark || !logo || !content) return;

    // First load — just reveal content
    if (prevPathname.current === null) {
      prevPathname.current = pathname;
      gsap.fromTo(
        content,
        { opacity: 0, y: 24, filter: "blur(6px)" },
        { opacity: 1, y: 0, filter: "blur(0px)", duration: 0.75, ease: "power3.out", delay: 0.1 }
      );
      return;
    }

    prevPathname.current = pathname;
    const label = PAGE_LABELS[pathname] ?? "";
    setTransitionLabel(label);

    const tl = gsap.timeline();

    // ── PHASE 1: Two panels sweep in from left ────────────────────────
    tl.set([panelBlue, panelDark], { scaleX: 0, transformOrigin: "left center" })
      .set(logo, { autoAlpha: 0, xPercent: -8 })
      .set(content, { opacity: 0 })

      // Panel 1 (blue accent) rushes in
      .to(panelBlue, {
        scaleX: 1,
        duration: 0.75,
        ease: "power4.inOut",
      })
      // Panel 2 (dark) follows 100ms behind
      .to(
        panelDark,
        {
          scaleX: 1,
          duration: 0.75,
          ease: "power4.inOut",
        },
        "-=0.62"
      )

      // ── PHASE 2: Logo slides in at center ────────────────────────────
      .to(
        logo,
        {
          autoAlpha: 1,
          xPercent: 0,
          duration: 0.5,
          ease: "power4.out",
        },
        "-=0.2"
      )

      // ── PHASE 3: Panel blue snaps away (reset) ───────────────────────
      .set(panelBlue, { scaleX: 0 }, "+=0.15")

      // ── PHASE 4: Panel dark sweeps out to right ───────────────────────
      .to(panelDark, {
        scaleX: 0,
        transformOrigin: "right center",
        duration: 0.75,
        ease: "power4.inOut",
      })

      // Logo fades out as panel exits
      .to(
        logo,
        {
          autoAlpha: 0,
          duration: 0.2,
          ease: "none",
        },
        "-=0.6"
      )

      // ── PHASE 5: Content reveals ──────────────────────────────────────
      .fromTo(
        content,
        { opacity: 0, y: 30, filter: "blur(8px)" },
        {
          opacity: 1,
          y: 0,
          filter: "blur(0px)",
          duration: 0.7,
          ease: "power3.out",
        },
        "-=0.35"
      );

    return () => { tl.kill(); };
  }, [pathname]);

  return (
    <>
      {/* Panel 1 — blue accent */}
      <div
        ref={panelBlueRef}
        className="fixed inset-0 z-9997 pointer-events-none"
        style={{
          background: "linear-gradient(135deg, #1e40af 0%, #3b82f6 50%, #1d4ed8 100%)",
          transformOrigin: "left center",
          transform: "scaleX(0)",
        }}
        aria-hidden
      />

      {/* Panel 2 — deep dark */}
      <div
        ref={panelDarkRef}
        className="fixed inset-0 z-9998 pointer-events-none"
        style={{
          background: "linear-gradient(135deg, #020817 0%, #0a1628 50%, #050d1f 100%)",
          transformOrigin: "left center",
          transform: "scaleX(0)",
        }}
        aria-hidden
      />

      {/* Page label shown mid-transition */}
      <div
        ref={logoRef}
        className="fixed inset-0 z-9999 flex items-center justify-center pointer-events-none"
        style={{ opacity: 0 }}
        aria-hidden
      >
        <span
          className="select-none font-bold uppercase tracking-[0.18em] text-white"
          style={{
            fontSize: "clamp(2.5rem, 8vw, 7rem)",
            textShadow: "0 0 60px rgba(59,130,246,0.4), 0 2px 40px rgba(0,0,0,0.8)",
            letterSpacing: "0.2em",
          }}
        >
          {transitionLabel}
        </span>
      </div>

      {/* Page content */}
      <div ref={contentRef}>
        {children}
      </div>
    </>
  );
}
