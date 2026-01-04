"use client";
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const NAV_ITEMS = [
  { label: 'Home', href: '/' },
  { label: 'Show', href: '/projects' },
  { label: 'Projects', href: '/writing' },
  { label: 'About', href: '/about' },
  { label: 'Resume', href: '/resume' },
]

export default function Navbar() {
  const pathname = usePathname()
  return (
    <nav className="fixed top-6 left-1/2 z-50 -translate-x-1/2">
      <div
        className="
          flex items-center gap-8 px-8 py-3
          rounded-full
          bg-white/10
          backdrop-blur-xl
          border border-white/20
          shadow-[0_0_30px_rgba(255,255,255,0.08)]
        "
      >
          {NAV_ITEMS.map((item) => {
          const active = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`
                text-sm transition-all duration-300
                ${active ? 'text-white' : 'text-white/70'}
                hover:text-white
              `}
            >
              {item.label}
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
