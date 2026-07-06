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
        className={`
          fixed top-4 md:top-6 left-1/2 z-50 -translate-x-1/2
          w-[calc(100%-2rem)] max-w-3xl
          transition-all duration-500
        `}
      >
        <div
          className={`
            flex items-center justify-between
            px-4 md:px-6 py-2.5 md:py-3
            rounded-2xl md:rounded-full
            backdrop-blur-xl
            border
            transition-all duration-500
            ${scrolled
              ? "bg-[rgba(8,20,50,0.75)] border-blue-500/30 shadow-[0_0_40px_rgba(59,130,246,0.15),0_8px_32px_rgba(0,0,0,0.6)]"
              : "bg-[rgba(14,42,84,0.35)] border-blue-500/20 shadow-[0_0_30px_rgba(59,130,246,0.12),0_4px_20px_rgba(0,0,0,0.5)]"
            }
          `}
        >
          {/* Logo */}
          <Link
            href="/"
            className="
              flex items-center justify-center
              w-8 h-8 rounded-full
              bg-linear-to-br from-blue-500 to-blue-700
              text-xs font-bold text-white
              shadow-[0_0_16px_rgba(59,130,246,0.5)]
              shrink-0
            "
          >
            AS
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-1">
            {NAV_ITEMS.map((item) => {
              const active = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`
                    relative px-4 py-1.5 rounded-full
                    text-sm font-medium transition-all duration-300
                    ${active
                      ? "text-blue-200 bg-blue-500/15 shadow-[0_0_12px_rgba(59,130,246,0.25)]"
                      : "text-blue-100/55 hover:text-blue-200 hover:bg-white/5"
                    }
                  `}
                >
                  {item.label}
                </Link>
              );
            })}
          </div>

          {/* Mobile toggle */}
          <button
            onClick={() => setMenuOpen((v) => !v)}
            aria-label="Toggle menu"
            className="
              md:hidden p-2 rounded-xl
              text-blue-200/70 hover:text-blue-200
              hover:bg-white/5 transition-colors
            "
          >
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>

          {/* Spacer for desktop balance */}
          <div className="hidden md:block w-8" />
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div
            className="
              md:hidden mt-2 p-3
              rounded-2xl
              bg-[rgba(8,20,50,0.9)]
              backdrop-blur-xl
              border border-blue-500/25
              shadow-[0_8px_32px_rgba(0,0,0,0.6)]
              animate-fade-in-up
            "
          >
            {NAV_ITEMS.map((item) => {
              const active = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`
                    block px-4 py-3 rounded-xl
                    text-sm font-medium transition-all duration-200
                    ${active
                      ? "text-blue-200 bg-blue-500/15"
                      : "text-blue-100/60 hover:text-blue-200 hover:bg-white/5"
                    }
                  `}
                >
                  {item.label}
                </Link>
              );
            })}
          </div>
        )}
      </nav>
    </>
  );
}
