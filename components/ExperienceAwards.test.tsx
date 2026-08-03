/**
 * Unit Tests for ExperienceAwards
 * **Validates: Requirements 6.3**
 *
 * Requirement 6.3:
 *   ExperienceAwards SHALL menggunakan `useScrollReveal` dengan
 *   `preset: 'stagger'`, `staggerTargets: '.timeline-item'`,
 *   `staggerDelay: 0.08`, dan `start: 'top 85%'`.
 *
 * Tests cover:
 *   1. Component renders without crashing
 *   2. Timeline items (.timeline-item) are present in the DOM
 *   3. useScrollReveal is called with the correct stagger parameters
 *   4. Both Experiences and Awards sections render their items
 */

import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import ExperienceAwards from './ExperienceAwards'

// ─── Mock window.matchMedia (jsdom does not implement it) ─────────────────────
// useScrollReveal calls window.matchMedia to detect prefers-reduced-motion.
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

// ─── Mock GSAP and ScrollTrigger ─────────────────────────────────────────────
// ExperienceAwards uses useScrollReveal which internally imports gsap and
// ScrollTrigger. We mock them to prevent errors in the jsdom environment.

vi.mock('gsap', () => ({
  gsap: {
    registerPlugin: vi.fn(),
    context: vi.fn(() => ({
      revert: vi.fn(),
    })),
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

// ─── Spy on useScrollReveal ───────────────────────────────────────────────────
// We spy on the hook module so we can verify it is called with the correct
// stagger configuration required by Requirement 6.3.
const useScrollRevealSpy = vi.fn()

vi.mock('../hooks/useScrollReveal', () => ({
  useScrollReveal: (...args: unknown[]) => {
    useScrollRevealSpy(...args)
  },
}))

// ─── Tests ────────────────────────────────────────────────────────────────────

describe('ExperienceAwards', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  // ─── 1. Component renders without crashing ─────────────────────────────────
  describe('render', () => {
    it('renders without crashing', () => {
      expect(() => render(<ExperienceAwards />)).not.toThrow()
    })

    it('renders the section element with id="experience"', () => {
      const { container } = render(<ExperienceAwards />)
      const section = container.querySelector('section#experience')
      expect(section).toBeInTheDocument()
    })

    it('renders the "Experiences" heading', () => {
      render(<ExperienceAwards />)
      expect(screen.getByText('Experiences')).toBeInTheDocument()
    })

    it('renders the "Awards" heading', () => {
      render(<ExperienceAwards />)
      expect(screen.getByText('Awards')).toBeInTheDocument()
    })
  })

  // ─── 2. Timeline items are present in the DOM ──────────────────────────────
  describe('timeline items', () => {
    it('renders at least one element with .timeline-item class', () => {
      const { container } = render(<ExperienceAwards />)
      const items = container.querySelectorAll('.timeline-item')
      expect(items.length).toBeGreaterThan(0)
    })

    it('renders 3 experience items as .timeline-item elements', () => {
      const { container } = render(<ExperienceAwards />)

      // The EXPERIENCES array has 3 items — each rendered as <li class="timeline-item">
      // We check that at least 3 items are present in the experiences column.
      // Since both experiences and awards use .timeline-item, we verify total >= 3.
      const items = container.querySelectorAll('.timeline-item')
      expect(items.length).toBeGreaterThanOrEqual(3)
    })

    it('renders 6 awards items as .timeline-item elements', () => {
      const { container } = render(<ExperienceAwards />)

      // EXPERIENCES (3) + AWARDS (6) = 9 total .timeline-item elements
      const items = container.querySelectorAll('.timeline-item')
      expect(items.length).toBe(9)
    })

    it('renders experience titles as text in .timeline-item elements', () => {
      render(<ExperienceAwards />)

      // Verify at least one known experience title is visible
      expect(
        screen.getByText('Apprenticeship @ E-Solusindo Software House')
      ).toBeInTheDocument()
    })

    it('renders award titles as text in .timeline-item elements', () => {
      render(<ExperienceAwards />)

      // Verify at least one known award title is visible
      expect(
        screen.getByText(
          'First Place — Jember Regency News Anchor, BIG SMK JATIM CUP 1 2024'
        )
      ).toBeInTheDocument()
    })
  })

  // ─── 3. useScrollReveal called with correct stagger parameters ─────────────
  describe('useScrollReveal integration (Requirement 6.3)', () => {
    it('calls useScrollReveal at least once with the stagger preset', () => {
      render(<ExperienceAwards />)
      // ExperienceAwards calls useScrollReveal with stagger.
      // SectionHeader (a child) also calls useScrollReveal with clip-reveal,
      // so we verify at least one call has the stagger preset rather than
      // asserting a specific total call count.
      const staggerCall = useScrollRevealSpy.mock.calls.find(
        ([, opts]) => opts?.preset === 'stagger'
      )
      expect(staggerCall).toBeDefined()
    })

    it('calls useScrollReveal with preset: "stagger"', () => {
      render(<ExperienceAwards />)

      // Find the call with stagger preset (SectionHeader child also calls this hook)
      const staggerCall = useScrollRevealSpy.mock.calls.find(
        ([, opts]) => opts?.preset === 'stagger'
      )
      expect(staggerCall).toBeDefined()
      expect(staggerCall![1]).toMatchObject({ preset: 'stagger' })
    })

    it('calls useScrollReveal with staggerTargets: ".timeline-item"', () => {
      render(<ExperienceAwards />)

      const staggerCall = useScrollRevealSpy.mock.calls.find(
        ([, opts]) => opts?.preset === 'stagger'
      )
      expect(staggerCall![1]).toMatchObject({ staggerTargets: '.timeline-item' })
    })

    it('calls useScrollReveal with staggerDelay: 0.08', () => {
      render(<ExperienceAwards />)

      const staggerCall = useScrollRevealSpy.mock.calls.find(
        ([, opts]) => opts?.preset === 'stagger'
      )
      expect(staggerCall![1]).toMatchObject({ staggerDelay: 0.08 })
    })

    it('calls useScrollReveal with start: "top 85%"', () => {
      render(<ExperienceAwards />)

      const staggerCall = useScrollRevealSpy.mock.calls.find(
        ([, opts]) => opts?.preset === 'stagger'
      )
      expect(staggerCall![1]).toMatchObject({ start: 'top 85%' })
    })

    it('calls useScrollReveal with a ref object as first argument', () => {
      render(<ExperienceAwards />)

      const staggerCall = useScrollRevealSpy.mock.calls.find(
        ([, opts]) => opts?.preset === 'stagger'
      )
      const [ref] = staggerCall!
      // A React ref object has a .current property
      expect(ref).toHaveProperty('current')
    })

    it('calls useScrollReveal with all required stagger options combined', () => {
      render(<ExperienceAwards />)

      // Find the stagger call (as opposed to SectionHeader's clip-reveal call)
      const staggerCall = useScrollRevealSpy.mock.calls.find(
        ([, opts]) => opts?.preset === 'stagger'
      )
      expect(staggerCall).toBeDefined()
      const [ref, options] = staggerCall!
      expect(ref).toHaveProperty('current')
      expect(options).toMatchObject({
        preset: 'stagger',
        staggerTargets: '.timeline-item',
        staggerDelay: 0.08,
        start: 'top 85%',
      })
    })
  })
})
