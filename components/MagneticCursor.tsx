"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";

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

    // Task 5.2: Cursor state changes: link, card, idle
    const handleCursorStateChange = () => {
      const links = document.querySelectorAll('[data-cursor="link"]');
      const cards = document.querySelectorAll('[data-cursor="card"]');

      // Handle link hover
      links.forEach((link) => {
        link.addEventListener("mouseenter", handleLinkEnter);
        link.addEventListener("mouseleave", handleLinkLeave);
      });

      // Handle card hover
      cards.forEach((card) => {
        card.addEventListener("mouseenter", handleCardEnter);
        card.addEventListener("mouseleave", handleCardLeave);
      });
    };

    const handleLinkEnter = () => {
      if (ringRef.current) {
        gsap.to(ringRef.current, {
          width: 64,
          height: 64,
          duration: 0.3,
          ease: "power2.out",
        });
        ringRef.current.style.mixBlendMode = "difference";
      }
    };

    const handleLinkLeave = () => {
      if (ringRef.current) {
        gsap.to(ringRef.current, {
          width: 40,
          height: 40,
          duration: 0.3,
          ease: "power2.out",
        });
        ringRef.current.style.mixBlendMode = "normal";
      }
    };

    const handleCardEnter = () => {
      if (ringRef.current && labelRef.current) {
        gsap.to(ringRef.current, {
          width: 80,
          height: 80,
          duration: 0.3,
          ease: "power2.out",
        });
        gsap.to(labelRef.current, {
          opacity: 1,
          scale: 1,
          duration: 0.2,
          ease: "power2.out",
        });
      }
    };

    const handleCardLeave = () => {
      if (ringRef.current && labelRef.current) {
        gsap.to(ringRef.current, {
          width: 40,
          height: 40,
          duration: 0.3,
          ease: "power2.out",
        });
        gsap.to(labelRef.current, {
          opacity: 0,
          scale: 0.8,
          duration: 0.2,
          ease: "power2.out",
        });
      }
    };

    // Task 5.3: Magnetic effect on data-magnetic elements
    const setupMagneticElements = () => {
      const magneticElements = document.querySelectorAll("[data-magnetic]");

      magneticElements.forEach((elem) => {
        const element = elem as HTMLElement;

        const handleMagneticMove = (e: MouseEvent) => {
          const rect = element.getBoundingClientRect();
          const elemCenterX = rect.left + rect.width / 2;
          const elemCenterY = rect.top + rect.height / 2;

          const cursorX = e.clientX;
          const cursorY = e.clientY;

          const dx = cursorX - elemCenterX;
          const dy = cursorY - elemCenterY;

          // Calculate 30% offset using extracted pure function
          const { x: offsetX, y: offsetY } = computeMagneticOffset(dx, dy);

          gsap.to(element, {
            x: offsetX,
            y: offsetY,
            duration: 0.4,
            ease: "power2.out",
          });
        };

        const handleMagneticLeave = () => {
          gsap.to(element, {
            x: 0,
            y: 0,
            duration: 0.7,
            ease: "elastic.out(1, 0.3)",
          });
        };

        element.addEventListener("mousemove", handleMagneticMove);
        element.addEventListener("mouseleave", handleMagneticLeave);
      });
    };

    // Initialize cursor state handlers and magnetic elements
    // Use a small delay to ensure DOM is ready
    const initTimer = setTimeout(() => {
      handleCursorStateChange();
      setupMagneticElements();
    }, 100);

    // Cleanup
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      gsap.ticker.remove(tickerCallback);
      clearTimeout(initTimer);

      // Clean up link/card listeners
      const links = document.querySelectorAll('[data-cursor="link"]');
      const cards = document.querySelectorAll('[data-cursor="card"]');

      links.forEach((link) => {
        link.removeEventListener("mouseenter", handleLinkEnter);
        link.removeEventListener("mouseleave", handleLinkLeave);
      });

      cards.forEach((card) => {
        card.removeEventListener("mouseenter", handleCardEnter);
        card.removeEventListener("mouseleave", handleCardLeave);
      });

      // Clean up magnetic element listeners
      const magneticElements = document.querySelectorAll("[data-magnetic]");
      magneticElements.forEach((elem) => {
        const element = elem as HTMLElement;
        const clonedElement = element.cloneNode(true);
        element.parentNode?.replaceChild(clonedElement, element);
      });

      // Kill all tweens
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
        className="fixed top-0 left-0 w-2 h-2 bg-blue-400 rounded-full pointer-events-none"
        style={{
          zIndex: 99999,
        }}
      />

      {/* Ring - 40px, follows with lerp */}
      <div
        ref={ringRef}
        className="fixed top-0 left-0 w-10 h-10 border-2 border-blue-400 rounded-full pointer-events-none flex items-center justify-center"
        style={{
          zIndex: 99999,
        }}
      >
        {/* VIEW label for card hover */}
        <span
          ref={labelRef}
          className="text-xs font-bold text-blue-400 opacity-0"
          style={{
            transform: "scale(0.8)",
          }}
        >
          VIEW
        </span>
      </div>
    </>
  );
}
