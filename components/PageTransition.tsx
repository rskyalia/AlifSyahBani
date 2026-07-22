"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { gsap } from "gsap";

interface PageTransitionProps {
  children: React.ReactNode;
  /** Passed from ClientRoot — true once the preloader finishes */
  isReady?: boolean;
}

interface RouteMeta {
  title: string;
  description: string;
}

const ROUTE_META: Record<string, RouteMeta> = {
  "/":         { title: "Home",     description: "Welcome to my portfolio" },
  "/about":    { title: "About",    description: "Designer & Developer from Indonesia" },
  "/projects": { title: "Projects", description: "A collection of my work" },
  "/writing":  { title: "Writing",  description: "Thoughts & ideas in writing" },
  "/resume":   { title: "Resume",   description: "My professional journey" },
};

function getRouteMeta(pathname: string): RouteMeta {
  return ROUTE_META[pathname] ?? { title: "", description: "" };
}

export default function PageTransition({ children, isReady = false }: PageTransitionProps) {
  const pathname   = usePathname();
  const prevPath   = useRef<string | null>(null);
  const isReadyRef = useRef(false);
  const contentRef = useRef<HTMLDivElement>(null);
  // Two overlay layers (accent blue first, then black on top)
  const frameBlueRef  = useRef<HTMLDivElement>(null);
  const frameBlackRef = useRef<HTMLDivElement>(null);
  const textRef       = useRef<HTMLDivElement>(null);

  const [pageMeta, setPageMeta] = useState<RouteMeta>({ title: "", description: "" });

  // ── First-load reveal: fires once preloader is done ──────────────
  useEffect(() => {
    if (!isReady || isReadyRef.current) return;
    isReadyRef.current = true;
    prevPath.current   = pathname;

    const content = contentRef.current;
    if (!content) return;

    // Ensure both overlay layers are collapsed off
    gsap.set([frameBlueRef.current, frameBlackRef.current], { scaleX: 0 });
    gsap.set(textRef.current, { autoAlpha: 0 });

    gsap.fromTo(
      content,
      { opacity: 0, filter: "blur(12px)" },
      { opacity: 1, filter: "blur(0px)", duration: 0.8, ease: "power2.out" }
    );
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isReady]);

  // ── Route-change transition ───────────────────────────────────────
  useEffect(() => {
    if (!isReadyRef.current) return;
    if (prevPath.current === null) { prevPath.current = pathname; return; }
    if (prevPath.current === pathname) return;

    prevPath.current = pathname;

    const content   = contentRef.current;
    const frameBlue = frameBlueRef.current;
    const frameBlk  = frameBlackRef.current;
    const text      = textRef.current;
    if (!content || !frameBlue || !frameBlk || !text) return;

    // Update meta for destination route
    setPageMeta(getRouteMeta(pathname));

    // Reset: both layers collapsed (scaleX 0, origin left), text hidden
    gsap.set([frameBlue, frameBlk], { scaleX: 0, transformOrigin: "left" });
    gsap.set(text,    { x: -60, autoAlpha: 0 });
    gsap.set(content, { opacity: 0, filter: "blur(0px)" });

    const tl = gsap.timeline();

    // ── IN phase ────────────────────────────────────────────────────
    // Layer 1 (blue accent) expands from left
    tl.fromTo(frameBlue,
      { scaleX: 0 },
      { scaleX: 1, transformOrigin: "left", duration: 1.0, ease: "power4.inOut" }
    )
    // Layer 2 (black) follows 0.15s later
    .fromTo(frameBlk,
      { scaleX: 0 },
      { scaleX: 1, transformOrigin: "left", duration: 1.0, ease: "power4.inOut" },
      "-=0.85"
    )
    // Logo/text slides in from left while black layer expands
    .fromTo(text,
      { x: -60, autoAlpha: 0 },
      { x: 0, autoAlpha: 1, duration: 0.9, ease: "power4.easeInOut" },
      "-=0.6"
    )

    // ── Hold briefly ─────────────────────────────────────────────────
    .to({}, { duration: 0.25 })

    // ── OUT phase ────────────────────────────────────────────────────
    // Blue layer resets instantly (hidden under black)
    .set(frameBlue, { scaleX: 0 })
    // Black layer collapses to the right
    .to(frameBlk, {
      scaleX: 0,
      transformOrigin: "right",
      duration: 1.0,
      ease: "power4.inOut",
    })
    // Text fades out before black collapses
    .to(text, { autoAlpha: 0, duration: 0.2 }, "-=0.9")

    // ── Reveal new content ───────────────────────────────────────────
    .fromTo(
      content,
      { opacity: 0, filter: "blur(12px)" },
      { opacity: 1, filter: "blur(0px)", duration: 0.55, ease: "power2.out" },
      "-=0.35"
    );

    return () => { tl.kill(); };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  return (
    <>
      {/* Page content */}
      <div ref={contentRef} style={{ opacity: 0 }}>
        {children}
      </div>

      {/* Layer 1 — blue accent (expands first, resets instantly) */}
      <div
        ref={frameBlueRef}
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 9998,
          background: "linear-gradient(135deg, #1e3a8a 0%, #2563eb 50%, #1d4ed8 100%)",
          transformOrigin: "left",
          transform: "scaleX(0)",
          pointerEvents: "none",
        }}
      />

      {/* Layer 2 — black (expands second, collapses to reveal page) */}
      <div
        ref={frameBlackRef}
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 9999,
          background: "linear-gradient(135deg, #000000 0%, #0a0a1a 70%, #0f172a 100%)",
          transformOrigin: "left",
          transform: "scaleX(0)",
          pointerEvents: "none",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {/* Page title + description */}
        <div
          ref={textRef}
          style={{
            textAlign: "center",
            width: "90vw",
            maxWidth: "900px",
          }}
        >
          <h2
            style={{
              color: "#ffffff",
              fontSize: "clamp(3rem, 10vw, 7rem)",
              fontWeight: 700,
              letterSpacing: "-0.03em",
              lineHeight: 1.1,
              margin: 0,
              textTransform: "uppercase",
            }}
          >
            {pageMeta.title}
          </h2>
          <p
            style={{
              color: "rgba(255,255,255,0.65)",
              fontSize: "clamp(0.85rem, 1.8vw, 1.1rem)",
              margin: "0.75rem 0 0",
            }}
          >
            {pageMeta.description}
          </p>
        </div>
      </div>
    </>
  );
}
