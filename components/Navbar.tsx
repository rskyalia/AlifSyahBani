"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Menu, X } from "lucide-react";
import { gsap } from "gsap";
import ThemeToggle from "./ThemeToggle";
import { useTheme } from "./ThemeContext";

const NAV_ITEMS = [
  { label: "Home", href: "/" },
  { label: "Show", href: "/projects" },
  { label: "Projects", href: "/writing" },
  { label: "About", href: "/about" },
  { label: "Resume", href: "/resume" },
];

export default function Navbar() {
  const pathname = usePathname();
  const { theme } = useTheme();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const navRef = useRef<HTMLElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  const isDark = theme === "dark";

  // Scroll-aware hide/show via GSAP
  useEffect(() => {
    let lastScrollY = 0;

    const onScroll = () => {
      const currentY = window.scrollY;
      const delta = currentY - lastScrollY;

      setScrolled(currentY > 20);

      if (delta > 0 && currentY > 80) {
        // Scrolling down — hide navbar
        gsap.to(navRef.current, { y: "-100%", duration: 0.4, ease: "power3.in" });
      } else if (delta < -20) {
        // Scrolling up — show navbar
        gsap.to(navRef.current, { y: "0%", duration: 0.5, ease: "power3.out" });
      }

      lastScrollY = currentY;
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Entry animation — runs on mount immediately, no need to wait for isReady
  useEffect(() => {
    gsap.fromTo(
      navRef.current,
      { y: -60, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.8, ease: "power3.out", delay: 0.2 }
    );
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  // Mobile menu clip-path animation
  useEffect(() => {
    if (!menuRef.current) return;
    if (menuOpen) {
      // Animate open: reveal from top downward
      gsap.to(menuRef.current, {
        clipPath: 'inset(0% 0% 0% 0%)',
        duration: 0.5,
        ease: 'power4.inOut',
        pointerEvents: 'auto',
      });
    } else {
      // Animate close: collapse upward
      gsap.to(menuRef.current, {
        clipPath: 'inset(0% 0% 100% 0%)',
        duration: 0.5,
        ease: 'power4.inOut',
        onComplete: () => {
          if (menuRef.current) menuRef.current.style.pointerEvents = 'none';
        },
      });
    }
  }, [menuOpen]);



  const navBgScrolled = isDark
    ? "bg-[rgba(0,0,0,0.88)] shadow-[0_8px_32px_rgba(0,0,0,0.8),0_0_0_1px_rgba(251,191,36,0.12)]"
    : "bg-[rgba(255,255,255,0.92)] shadow-[0_8px_32px_rgba(15,23,42,0.14),0_0_0_1px_rgba(15,23,42,0.09)]";

  const navBgDefault = isDark
    ? "bg-[rgba(0,0,0,0.65)] shadow-[0_4px_24px_rgba(0,0,0,0.6),0_0_0_1px_rgba(251,191,36,0.08)]"
    : "bg-[rgba(255,255,255,0.75)] shadow-[0_4px_24px_rgba(15,23,42,0.08),0_0_0_1px_rgba(15,23,42,0.06)]";

  const glossLineStyle = isDark
    ? "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.18) 30%, rgba(255,255,255,0.28) 50%, rgba(255,255,255,0.18) 70%, transparent 100%)"
    : "linear-gradient(90deg, transparent 0%, rgba(15,23,42,0.07) 30%, rgba(15,23,42,0.12) 50%, rgba(15,23,42,0.07) 70%, transparent 100%)";

  return (
    <>
      {/* Full-width sticky wrapper untuk centering */}
      <div className="sticky top-4 md:top-6 z-50 w-full px-4">
      <nav
        ref={navRef}
        className="w-full max-w-3xl mx-auto"
      >
        {/* Main bar */}
        <div
          className={`
            relative flex items-center justify-between
            px-4 md:px-6 py-2
            rounded-2xl
            transition-all duration-500
            ${scrolled ? navBgScrolled : navBgDefault}
          `}
          style={{ backdropFilter: "blur(24px)", WebkitBackdropFilter: "blur(24px)" }}
        >
          {/* Top gloss line */}
          <div
            className="pointer-events-none absolute inset-x-6 top-0 h-px"
            style={{ background: glossLineStyle }}
            aria-hidden
          />

          {/* Mobile: site name left */}
          <span
            className={`md:hidden text-sm font-semibold tracking-wide ${
              isDark ? "text-white/70" : "text-slate-600"
            }`}
          >
            Menu
          </span>

          {/* Desktop nav items — centered */}
          <div className="hidden md:flex items-center gap-1 mx-auto relative">
            {NAV_ITEMS.map((item) => {
              const active = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  data-magnetic
                  data-cursor="link"
                  className={`
                    group/item relative px-5 py-2 rounded-full
                    text-sm font-medium transition-colors duration-200
                    ${
                      active
                        ? isDark
                          ? "text-white"
                          : "text-slate-900"
                        : isDark
                        ? "text-white/45 hover:text-white/80"
                        : "text-slate-500 hover:text-slate-800"
                    }
                  `}
                >
                  {/* Glossy pill background */}
                  <span
                    className={`
                      absolute inset-0 rounded-full transition-opacity duration-200
                      ${active ? "opacity-100" : "opacity-0 group-hover/item:opacity-100"}
                    `}
                    style={{
                      background: isDark
                        ? "linear-gradient(180deg, rgba(255,255,255,0.12) 0%, rgba(255,255,255,0.04) 100%)"
                        : "linear-gradient(180deg, rgba(15,23,42,0.07) 0%, rgba(15,23,42,0.02) 100%)",
                      boxShadow: isDark
                        ? "inset 0 1px 0 rgba(255,255,255,0.18), 0 0 0 1px rgba(255,255,255,0.08)"
                        : "inset 0 1px 0 rgba(255,255,255,0.9), 0 0 0 1px rgba(15,23,42,0.07)",
                    }}
                    aria-hidden
                  />
                  <span className="relative z-10">{item.label}</span>
                </Link>
              );
            })}
          </div>

          {/* Theme toggle — desktop, pinned right */}
          <div className="hidden md:block">
            <ThemeToggle />
          </div>

          {/* Mobile: theme toggle + menu button */}
          <div className="md:hidden flex items-center gap-2">
            <ThemeToggle />
            <button
              onClick={() => setMenuOpen((v) => !v)}
              aria-label="Toggle menu"
              className={`
                p-2 rounded-full transition-colors duration-200
                ${isDark ? "text-white/50 hover:text-white/80" : "text-slate-500 hover:text-slate-800"}
              `}
            >
              {menuOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>

        {/* Mobile dropdown — always rendered, visibility controlled by clip-path */}
        <div
          ref={menuRef}
          className="md:hidden mt-2 p-2 rounded-2xl"
          style={{
            background: isDark ? "rgba(0,0,0,0.90)" : "rgba(255,255,255,0.94)",
            backdropFilter: "blur(24px)",
            WebkitBackdropFilter: "blur(24px)",
            boxShadow: isDark
              ? "0 8px 32px rgba(0,0,0,0.8), 0 0 0 1px rgba(251,191,36,0.12)"
              : "0 8px 32px rgba(15,23,42,0.12), 0 0 0 1px rgba(15,23,42,0.07)",
            clipPath: "inset(0% 0% 100% 0%)",
            pointerEvents: "none",
          }}
        >
          <div
            className="pointer-events-none absolute inset-x-4 top-2 h-px"
            style={{
              background: isDark
                ? "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.15) 50%, transparent 100%)"
                : "linear-gradient(90deg, transparent 0%, rgba(15,23,42,0.1) 50%, transparent 100%)",
            }}
            aria-hidden
          />
          {NAV_ITEMS.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                data-magnetic
                data-cursor="link"
                className={`
                    group/item relative block px-4 py-3 rounded-xl
                    text-sm font-medium transition-colors duration-200
                    ${
                      active
                        ? isDark
                          ? "text-white"
                          : "text-slate-900"
                        : isDark
                        ? "text-white/45 hover:text-white/80"
                        : "text-slate-500 hover:text-slate-800"
                    }
                  `}
              >
                <span
                  className={`
                      absolute inset-0 rounded-xl transition-opacity duration-200
                      ${active ? "opacity-100" : "opacity-0 group-hover/item:opacity-100"}
                    `}
                  style={{
                    background: isDark
                      ? "linear-gradient(180deg, rgba(255,255,255,0.11) 0%, rgba(255,255,255,0.04) 100%)"
                      : "linear-gradient(180deg, rgba(15,23,42,0.06) 0%, rgba(15,23,42,0.02) 100%)",
                    boxShadow: isDark
                      ? "inset 0 1px 0 rgba(255,255,255,0.15), 0 0 0 1px rgba(255,255,255,0.07)"
                      : "inset 0 1px 0 rgba(255,255,255,0.8), 0 0 0 1px rgba(15,23,42,0.06)",
                  }}
                  aria-hidden
                />
                <span className="relative z-10">{item.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>
      </div>
    </>
  );
}
