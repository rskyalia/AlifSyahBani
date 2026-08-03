/**
 * Unit Test: PlanetModel wrapper accessibility attributes
 * **Validates: Requirements 12.6**
 *
 * Requirement 12.6:
 *   THE Portfolio_App SHALL memastikan semua image memiliki atribut `alt` yang
 *   deskriptif, dan PlanetModel memiliki `aria-label="Animated 3D planet
 *   decoration"` serta `aria-hidden="true"` karena bersifat dekoratif.
 *
 * Tests cover:
 *   1. The wrapper div rendered around PlanetModel has aria-label="Animated 3D planet decoration"
 *   2. The wrapper div rendered around PlanetModel has aria-hidden="true"
 */

import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render } from '@testing-library/react'
import Hero from './Hero'

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
    timeline: vi.fn(() => ({
      to: vi.fn().mockReturnThis(),
      from: vi.fn().mockReturnThis(),
      fromTo: vi.fn().mockReturnThis(),
      set: vi.fn().mockReturnThis(),
    })),
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

// ─── Mock ThemeContext ────────────────────────────────────────────────────────
vi.mock('./ThemeContext', () => ({
  useTheme: () => ({ theme: 'dark' }),
}))

// ─── Mock next/navigation (usePathname) ───────────────────────────────────────
vi.mock('next/navigation', () => ({
  usePathname: () => '/',
}))

// ─── Mock next/link ───────────────────────────────────────────────────────────
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

// ─── Mock PlanetModel (react-three-fiber / WebGL) ────────────────────────────
// PlanetModel relies on WebGL/Canvas which is unavailable in jsdom.
// We stub it with a simple div so the rest of Hero renders normally.
vi.mock('./PlanetModel', () => ({
  default: () => <div data-testid="planet-model-stub" />,
}))

// ─── Mock Typewriter ─────────────────────────────────────────────────────────
vi.mock('./Typewriter', () => ({
  default: () => <span data-testid="typewriter-stub" />,
}))

// ─── Mock StatsCounter ───────────────────────────────────────────────────────
vi.mock('./StatsCounter', () => ({
  default: () => <div data-testid="stats-counter-stub" />,
}))

// ─── Tests ────────────────────────────────────────────────────────────────────

describe('Hero — PlanetModel wrapper accessibility attributes (Req 12.6)', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders without crashing', () => {
    expect(() => render(<Hero />)).not.toThrow()
  })

  it('wrapper div has aria-label="Animated 3D planet decoration"', () => {
    const { container } = render(<Hero />)
    const wrapper = container.querySelector(
      '[aria-label="Animated 3D planet decoration"]'
    )
    expect(wrapper).not.toBeNull()
    expect(wrapper).toBeInTheDocument()
  })

  it('wrapper div has aria-hidden="true"', () => {
    const { container } = render(<Hero />)
    const wrapper = container.querySelector('[aria-hidden="true"]')
    expect(wrapper).not.toBeNull()
    expect(wrapper).toBeInTheDocument()
  })

  it('the same element carries both aria-label and aria-hidden="true"', () => {
    const { container } = render(<Hero />)
    const wrapper = container.querySelector(
      '[aria-label="Animated 3D planet decoration"][aria-hidden="true"]'
    )
    expect(wrapper).not.toBeNull()
    expect(wrapper).toBeInTheDocument()
  })

  it('aria-label value is exactly "Animated 3D planet decoration"', () => {
    const { container } = render(<Hero />)
    const wrapper = container.querySelector(
      '[aria-label="Animated 3D planet decoration"]'
    )
    expect(wrapper?.getAttribute('aria-label')).toBe(
      'Animated 3D planet decoration'
    )
  })

  it('aria-hidden value is exactly "true"', () => {
    const { container } = render(<Hero />)
    const wrapper = container.querySelector(
      '[aria-label="Animated 3D planet decoration"]'
    )
    expect(wrapper?.getAttribute('aria-hidden')).toBe('true')
  })
})
