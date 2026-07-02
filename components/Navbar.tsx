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
          bg-[rgba(14,42,84,0.35)]
          backdrop-blur-xl
          border border-blue-500/20
          shadow-[0_0_30px_rgba(59,130,246,0.12),0_4px_20px_rgba(0,0,0,0.5)]
        "
      >
          {NAV_ITEMS.map((item) => {
          const active = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`
                text-sm font-medium transition-all duration-300
                ${active
                  ? 'text-blue-300 drop-shadow-[0_0_8px_rgba(147,197,253,0.8)]'
                  : 'text-blue-100/60 hover:text-blue-200'}
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
