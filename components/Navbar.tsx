"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";

const NAV_ITEMS = [
  { label: "Home", href: "/" },
  { label: "Show", href: "/projects" },
  { label: "Projects", href: "/writing" },
  { label: "About", href: "/about" },
  { label: "Resume", href: "/resume" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  return (
    <>
      <nav
        className="
          fixed top-4 md:top-6 left-1/2 z-50 -translate-x-1/2
          w-[calc(100%-2rem)] max-w-2xl
          transition-all duration-500
        "
      >
        {/* Main bar */}
        <div
          className={`
            relative flex items-center justify-between md:justify-center
            px-4 md:px-6 py-2
            rounded-2xl
            transition-all duration-500
            ${
              scrolled
                ? "bg-[rgba(8,14,35,0.82)] shadow-[0_8px_32px_rgba(0,0,0,0.7),0_0_0_1px_rgba(255,255,255,0.07)]"
                : "bg-[rgba(10,18,45,0.65)] shadow-[0_4px_24px_rgba(0,0,0,0.55),0_0_0_1px_rgba(255,255,255,0.06)]"
            }
          `}
          style={{ backdropFilter: "blur(24px)", WebkitBackdropFilter: "blur(24px)" }}
        >
          {/* Top gloss line */}
          <div
            className="pointer-events-none absolute inset-x-6 top-0 h-px"
            style={{
              background:
                "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.18) 30%, rgba(255,255,255,0.28) 50%, rgba(255,255,255,0.18) 70%, transparent 100%)",
            }}
            aria-hidden
          />

          {/* Mobile: site name left */}
          <span className="md:hidden text-sm font-semibold text-white/70 tracking-wide">
            Menu
          </span>

          {/* Desktop nav items */}
          <div className="hidden md:flex items-center gap-1">
            {NAV_ITEMS.map((item) => {
              const active = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`
                    group/item relative px-5 py-2 rounded-full
                    text-sm font-medium transition-colors duration-200
                    ${active ? "text-white" : "text-white/45 hover:text-white/80"}
                  `}
                >
                  {/* Glossy pill background */}
                  <span
                    className={`
                      absolute inset-0 rounded-full transition-opacity duration-200
                      ${active ? "opacity-100" : "opacity-0 group-hover/item:opacity-100"}
                    `}
                    style={{
                      background:
                        "linear-gradient(180deg, rgba(255,255,255,0.12) 0%, rgba(255,255,255,0.04) 100%)",
                      boxShadow:
                        "inset 0 1px 0 rgba(255,255,255,0.18), 0 0 0 1px rgba(255,255,255,0.08)",
                    }}
                    aria-hidden
                  />
                  <span className="relative z-10">{item.label}</span>
                </Link>
              );
            })}
          </div>

          {/* Mobile toggle */}
          <button
            onClick={() => setMenuOpen((v) => !v)}
            aria-label="Toggle menu"
            className="
              md:hidden p-2 rounded-full
              text-white/50 hover:text-white/80
              transition-colors duration-200
            "
          >
            {menuOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>

        {/* Mobile dropdown */}
        {menuOpen && (
          <div
            className="md:hidden mt-2 p-2 rounded-2xl animate-fade-in-up"
            style={{
              background: "rgba(8,14,35,0.88)",
              backdropFilter: "blur(24px)",
              WebkitBackdropFilter: "blur(24px)",
              boxShadow:
                "0 8px 32px rgba(0,0,0,0.65), 0 0 0 1px rgba(255,255,255,0.07)",
            }}
          >
            <div
              className="pointer-events-none absolute inset-x-4 top-2 h-px"
              style={{
                background:
                  "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.15) 50%, transparent 100%)",
              }}
              aria-hidden
            />
            {NAV_ITEMS.map((item) => {
              const active = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`
                    group/item relative block px-4 py-3 rounded-xl
                    text-sm font-medium transition-colors duration-200
                    ${active ? "text-white" : "text-white/45 hover:text-white/80"}
                  `}
                >
                  <span
                    className={`
                      absolute inset-0 rounded-xl transition-opacity duration-200
                      ${active ? "opacity-100" : "opacity-0 group-hover/item:opacity-100"}
                    `}
                    style={{
                      background:
                        "linear-gradient(180deg, rgba(255,255,255,0.11) 0%, rgba(255,255,255,0.04) 100%)",
                      boxShadow:
                        "inset 0 1px 0 rgba(255,255,255,0.15), 0 0 0 1px rgba(255,255,255,0.07)",
                    }}
                    aria-hidden
                  />
                  <span className="relative z-10">{item.label}</span>
                </Link>
              );
            })}
          </div>
        )}
      </nav>
    </>
  );
}
