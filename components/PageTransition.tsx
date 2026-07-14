"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { gsap } from "gsap";

interface PageTransitionProps {
  children: React.ReactNode;
  /** Passed from ClientRoot — true once the preloader finishes */
  isReady?: boolean;
}

export default function PageTransition({ children, isReady = false }: PageTransitionProps) {
  const pathname   = usePathname();
  const prevPath   = useRef<string | null>(null);
  const isReadyRef = useRef(false);
  const contentRef = useRef<HTMLDivElement>(null);

  // ── First-load reveal: fires once preloader is done ──────────────
  useEffect(() => {
    if (!isReady || isReadyRef.current) return;
    isReadyRef.current = true;
    prevPath.current   = pathname;

    const content = contentRef.current;
    if (!content) return;

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

    const content = contentRef.current;
    if (!content) return;

    const tl = gsap.timeline();

    // OUT: quick blur + fade
    tl.to(content, {
      opacity: 0,
      filter: "blur(14px)",
      duration: 0.22,
      ease: "power2.in",
    })
    // IN: fade + unblur on new content
    .fromTo(
      content,
      { opacity: 0, filter: "blur(14px)" },
      { opacity: 1, filter: "blur(0px)", duration: 0.55, ease: "power2.out" }
    );

    return () => { tl.kill(); };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  return (
    <div ref={contentRef} style={{ opacity: 0 }}>
      {children}
    </div>
  );
}
