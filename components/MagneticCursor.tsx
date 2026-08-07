"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { useTheme } from "./ThemeContext";

/**
 * Computes the magnetic offset for a data-magnetic element.
 * Pure function extracted for testability.
 *
 * @param dx - Horizontal distance: cursorX - elemCenterX
 * @param dy - Vertical distance: cursorY - elemCenterY
 * @returns { x, y } offset values (30% of the input deltas)
 */
export function computeMagneticOffset(
  dx: number,
  dy: number
): { x: number; y: number } {
  return {
    x: dx * 0.3,
    y: dy * 0.3,
  };
}

export default function MagneticCursor() {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const [isTouch, setIsTouch] = useState(false);
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);
  const mousePos = useRef({ x: 0, y: 0 });
  const ringPos = useRef({ x: 0, y: 0 });

  useEffect(() => {
    // Guard SSR
    if (typeof window === "undefined") return;

    // Guard pointer: coarse — return null if true
    const isCoarse = window.matchMedia("(pointer: coarse)").matches;
    if (isCoarse) {
      setIsTouch(true);
      return;
    }

    // Initialize cursor elements at center-offset using xPercent/yPercent
    if (dotRef.current) {
      gsap.set(dotRef.current, { xPercent: -50, yPercent: -50 });
    }
    if (ringRef.current) {
      gsap.set(ringRef.current, { xPercent: -50, yPercent: -50 });
    }

    // Global mousemove listener updates mouse position
    const handleMouseMove = (e: MouseEvent) => {
      mousePos.current = { x: e.clientX, y: e.clientY };

      // Instant dot follow
      if (dotRef.current) {
        gsap.set(dotRef.current, {
          x: e.clientX,
          y: e.clientY,
        });
      }
    };

    window.addEventListener("mousemove", handleMouseMove);

    // GSAP ticker callback: interpolate ring position with lerp
    const tickerCallback = () => {
      const mx = mousePos.current.x;
      const my = mousePos.current.y;
      const rx = ringPos.current.x;
      const ry = ringPos.current.y;

      // Lerp with factor 0.12
      ringPos.current.x += (mx - rx) * 0.12;
      ringPos.current.y += (my - ry) * 0.12;

      if (ringRef.current) {
        gsap.set(ringRef.current, {
          x: ringPos.current.x,
          y: ringPos.current.y,
        });
      }
    };

    gsap.ticker.add(tickerCallback);

    // ── Cursor state handlers ────────────────────────────────────────────────
    const handleLinkEnter = () => {
      if (ringRef.current) {
        gsap.to(ringRef.current, { width: 64, height: 64, duration: 0.3, ease: "power2.out" });
        ringRef.current.style.mixBlendMode = "difference";
      }
    };

    const handleLinkLeave = () => {
      if (ringRef.current) {
        gsap.to(ringRef.current, { width: 40, height: 40, duration: 0.3, ease: "power2.out" });
        ringRef.current.style.mixBlendMode = "normal";
      }
    };

    const handleCardEnter = () => {
      if (ringRef.current && labelRef.current) {
        gsap.to(ringRef.current, { width: 80, height: 80, duration: 0.3, ease: "power2.out" });
        gsap.to(labelRef.current, { opacity: 1, scale: 1, duration: 0.2, ease: "power2.out" });
      }
    };

    const handleCardLeave = () => {
      if (ringRef.current && labelRef.current) {
        gsap.to(ringRef.current, { width: 40, height: 40, duration: 0.3, ease: "power2.out" });
        gsap.to(labelRef.current, { opacity: 0, scale: 0.8, duration: 0.2, ease: "power2.out" });
      }
    };

    // ── Per-element attach helpers ───────────────────────────────────────────
    // Track attached elements to avoid double-binding
    const attachedLinks = new WeakSet<Element>();
    const attachedCards = new WeakSet<Element>();
    const attachedMagnetics = new WeakSet<Element>();

    // Stores per-element handler references so they can be removed cleanly
    const magneticHandlers = new WeakMap<
      Element,
      { move: (e: MouseEvent) => void; leave: () => void }
    >();

    const attachLink = (link: Element) => {
      if (attachedLinks.has(link)) return;
      link.addEventListener("mouseenter", handleLinkEnter);
      link.addEventListener("mouseleave", handleLinkLeave);
      attachedLinks.add(link);
    };

    const attachCard = (card: Element) => {
      if (attachedCards.has(card)) return;
      card.addEventListener("mouseenter", handleCardEnter);
      card.addEventListener("mouseleave", handleCardLeave);
      attachedCards.add(card);
    };

    const attachMagnetic = (elem: Element) => {
      if (attachedMagnetics.has(elem)) return;
      const element = elem as HTMLElement;

      const handleMagneticMove = (e: MouseEvent) => {
        const rect = element.getBoundingClientRect();
        const elemCenterX = rect.left + rect.width / 2;
        const elemCenterY = rect.top + rect.height / 2;
        const { x: offsetX, y: offsetY } = computeMagneticOffset(
          e.clientX - elemCenterX,
          e.clientY - elemCenterY
        );
        gsap.to(element, { x: offsetX, y: offsetY, duration: 0.4, ease: "power2.out" });
      };

      const handleMagneticLeave = () => {
        gsap.to(element, { x: 0, y: 0, duration: 0.7, ease: "elastic.out(1, 0.3)" });
      };

      element.addEventListener("mousemove", handleMagneticMove);
      element.addEventListener("mouseleave", handleMagneticLeave);
      magneticHandlers.set(elem, { move: handleMagneticMove, leave: handleMagneticLeave });
      attachedMagnetics.add(elem);
    };

    // ── Full DOM scan ────────────────────────────────────────────────────────
    const scanDOM = () => {
      document.querySelectorAll('[data-cursor="link"]').forEach(attachLink);
      document.querySelectorAll('[data-cursor="card"]').forEach(attachCard);
      document.querySelectorAll("[data-magnetic]").forEach(attachMagnetic);
    };

    // Initial scan after a small delay to let the first render settle
    const initTimer = setTimeout(scanDOM, 100);

    // ── MutationObserver: re-scan whenever DOM changes ───────────────────────
    // This covers Next.js page transitions which swap page content in place
    const observer = new MutationObserver(() => {
      scanDOM();
    });

    observer.observe(document.body, { childList: true, subtree: true });

    // ── Cleanup ───────────────────────────────────────────────────────────────
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      gsap.ticker.remove(tickerCallback);
      clearTimeout(initTimer);
      observer.disconnect();

      // Remove link/card listeners
      document.querySelectorAll('[data-cursor="link"]').forEach((link) => {
        link.removeEventListener("mouseenter", handleLinkEnter);
        link.removeEventListener("mouseleave", handleLinkLeave);
      });
      document.querySelectorAll('[data-cursor="card"]').forEach((card) => {
        card.removeEventListener("mouseenter", handleCardEnter);
        card.removeEventListener("mouseleave", handleCardLeave);
      });

      // Remove magnetic listeners using stored references
      document.querySelectorAll("[data-magnetic]").forEach((elem) => {
        const handlers = magneticHandlers.get(elem);
        if (handlers) {
          (elem as HTMLElement).removeEventListener("mousemove", handlers.move);
          (elem as HTMLElement).removeEventListener("mouseleave", handlers.leave);
        }
      });

      gsap.killTweensOf([dotRef.current, ringRef.current, labelRef.current]);
    };
  }, []);

  // Don't render on touch devices
  if (isTouch) return null;

  return (
    <>
      {/* Dot - 8px, follows instantly */}
      <div
        ref={dotRef}
        className="fixed top-0 left-0 w-2 h-2 rounded-full pointer-events-none"
        style={{
          zIndex: 99999,
          background: isDark
            ? "linear-gradient(135deg, #F59E0B, #FDE68A)"
            : "linear-gradient(135deg, #3b82f6, #93c5fd)",
        }}
      />

      {/* Ring - 40px, follows with lerp */}
      <div
        ref={ringRef}
        className="fixed top-0 left-0 w-10 h-10 rounded-full pointer-events-none flex items-center justify-center"
        style={{
          zIndex: 99999,
          border: isDark
            ? "2px solid rgba(245,158,11,0.7)"
            : "2px solid rgba(59,130,246,0.7)",
        }}
      >
        {/* VIEW label for card hover */}
        <span
          ref={labelRef}
          className="text-xs font-bold opacity-0"
          style={{
            color: isDark ? "#F59E0B" : "#3b82f6",
            transform: "scale(0.8)",
          }}
        >
          VIEW
        </span>
      </div>
    </>
  );
}
