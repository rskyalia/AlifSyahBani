/**
 * Unit Tests for Footer — data-attribute contracts (footer portion)
 * **Validates: Requirements 11.3**
 *
 * Requirement 11.3:
 *   THE Footer SHALL menampilkan link "AVAILABLE FOR WORK" dalam huruf kapital
 *   yang memiliki MagneticEffect dan menerapkan atribut `data-magnetic` serta
 *   `data-cursor="link"`.
 *
 * Also validates Requirement 11.5:
 *   THE Footer SHALL menggunakan `background: transparent`.
 *
 * Tests cover:
 *   1. "AVAILABLE FOR WORK" link is present in the DOM
 *   2. Link has `data-magnetic` attribute
 *   3. Link has `data-cursor="link"` attribute
 *   4. Footer element has `background: transparent` inline style
 */

// Feature: gsap-modern-portfolio, Property 9: All data-attribute contracts are satisfied (footer portion)

import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import Footer from './Footer'

// ─── Mock window.matchMedia (jsdom does not implement it) ─────────────────────
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation((query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
})

// ─── Mock ResizeObserver (jsdom does not implement it) ────────────────────────
global.ResizeObserver = class ResizeObserver {
  observe = vi.fn()
  unobserve = vi.fn()
  disconnect = vi.fn()
}

// ─── Mock GSAP and ScrollTrigger ──────────────────────────────────────────────
vi.mock('gsap', () => ({
  gsap: {
    registerPlugin: vi.fn(),
    context: vi.fn(() => ({ revert: vi.fn() })),
    set: vi.fn(),
    to: vi.fn(),
    from: vi.fn(),
    fromTo: vi.fn(),
    ticker: {
      add: vi.fn(),
      remove: vi.fn(),
      lagSmoothing: vi.fn(),
    },
    killTweensOf: vi.fn(),
  },
}))

vi.mock('gsap/ScrollTrigger', () => ({
  ScrollTrigger: {
    create: vi.fn(),
    refresh: vi.fn(),
    update: vi.fn(),
    kill: vi.fn(),
    getAll: vi.fn(() => []),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    register: vi.fn(),
  },
}))

// ─── Mock useScrollReveal (used by Footer) ────────────────────────────────────
vi.mock('../hooks/useScrollReveal', () => ({
  useScrollReveal: vi.fn(),
}))

// ─── Mock ThemeContext ────────────────────────────────────────────────────────
vi.mock('./ThemeContext', () => ({
  useTheme: () => ({ theme: 'dark' }),
}))

// ─── Mock next/link (used by the Resume link) ─────────────────────────────────
vi.mock('next/link', () => ({
  default: ({
    children,
    href,
    ...props
  }: {
    children: React.ReactNode
    href: string
    [key: string]: unknown
  }) => (
    <a href={href} {...props}>
      {children}
    </a>
  ),
}))

// ─── Tests ────────────────────────────────────────────────────────────────────

describe('Footer', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  // ─── 1. Component renders without crashing ─────────────────────────────────
  describe('render', () => {
    it('renders without crashing', () => {
      expect(() => render(<Footer />)).not.toThrow()
    })

    it('renders a <footer> element', () => {
      const { container } = render(<Footer />)
      expect(container.querySelector('footer')).toBeInTheDocument()
    })
  })

  // ─── 2. "AVAILABLE FOR WORK" link is present ──────────────────────────────
  describe('"AVAILABLE FOR WORK" link', () => {
    it('renders the "AVAILABLE FOR WORK" text in the DOM', () => {
      render(<Footer />)
      expect(screen.getByText('AVAILABLE FOR WORK')).toBeInTheDocument()
    })

    it('"AVAILABLE FOR WORK" is rendered as an <a> element', () => {
      render(<Footer />)
      const link = screen.getByText('AVAILABLE FOR WORK')
      expect(link.tagName).toBe('A')
    })
  })

  // ─── 3. data-magnetic attribute (Requirement 11.3) ────────────────────────
  describe('data-magnetic attribute', () => {
    it('"AVAILABLE FOR WORK" link has data-magnetic attribute', () => {
      render(<Footer />)
      const link = screen.getByText('AVAILABLE FOR WORK')
      expect(link).toHaveAttribute('data-magnetic')
    })

    it('data-magnetic attribute is present (boolean attribute — no value required)', () => {
      const { container } = render(<Footer />)
      const link = container.querySelector('[data-magnetic]')
      expect(link).not.toBeNull()
      expect(link?.textContent).toBe('AVAILABLE FOR WORK')
    })
  })

  // ─── 4. data-cursor="link" attribute (Requirement 11.3) ───────────────────
  describe('data-cursor="link" attribute', () => {
    it('"AVAILABLE FOR WORK" link has data-cursor="link"', () => {
      render(<Footer />)
      const link = screen.getByText('AVAILABLE FOR WORK')
      expect(link).toHaveAttribute('data-cursor', 'link')
    })

    it('data-cursor attribute value is exactly "link"', () => {
      const { container } = render(<Footer />)
      const link = container.querySelector('[data-cursor="link"]')
      // The "AVAILABLE FOR WORK" link should be among elements with data-cursor="link"
      const availableForWork = Array.from(
        container.querySelectorAll('[data-cursor="link"]')
      ).find((el) => el.textContent === 'AVAILABLE FOR WORK')
      expect(availableForWork).toBeDefined()
    })
  })

  // ─── 5. Footer background: transparent (Requirement 11.5) ─────────────────
  describe('background: transparent', () => {
    it('<footer> element has inline style background: transparent', () => {
      const { container } = render(<Footer />)
      const footer = container.querySelector('footer')
      expect(footer).toHaveStyle({ background: 'transparent' })
    })
  })
})
