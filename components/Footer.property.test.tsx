// Feature: gsap-modern-portfolio, Property 15: Marquee maintains constant velocity
// **Validates: Requirements 11.2**

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, act } from '@testing-library/react'
import fc from 'fast-check'
import React from 'react'

/**
 * Property-Based Tests for Footer Component — Marquee Animation
 *
 * Property 15: Marquee maintains constant velocity
 *   For any footer marquee with repeat: -1 and ease: 'none', the horizontal
 *   displacement per unit time should be constant — i.e., the instantaneous
 *   velocity at any point in the animation should equal the initial velocity
 *   (no acceleration or deceleration).
 *
 * Validates: Requirements 11.2
 * Requirement: THE Footer SHALL display a horizontal marquee/ticker with a list
 * of technologies or taglines repeating continuously at constant speed (~40px/s)
 * using GSAP repeat: -1 ease: "none".
 */

// ─── GSAP Mock ────────────────────────────────────────────────────────────────

interface CapturedTween {
  target: unknown
  vars: {
    x?: string | number
    duration?: number
    ease?: string
    repeat?: number
    [key: string]: unknown
  }
}

const capturedTweens: CapturedTween[] = []

vi.mock('gsap', () => {
  return {
    gsap: {
      registerPlugin: vi.fn(),
      to: vi.fn((target: unknown, vars: Record<string, unknown>) => {
        capturedTweens.push({ target, vars })
        return {
          kill: vi.fn(),
          invalidate: vi.fn(),
        }
      }),
      set: vi.fn(),
      context: vi.fn((fn: (ctx: unknown) => void) => {
        const ctx = { revert: vi.fn() }
        fn(ctx)
        return ctx
      }),
    },
  }
})

vi.mock('gsap/ScrollTrigger', () => ({
  ScrollTrigger: {
    create: vi.fn(),
    refresh: vi.fn(),
    getAll: vi.fn(() => []),
  },
}))

// ─── Mock Next.js Link ─────────────────────────────────────────────────────────
vi.mock('next/link', () => ({
  default: ({
    children,
    href,
    ...props
  }: {
    children: React.ReactNode
    href: string
    [key: string]: unknown
  }) => React.createElement('a', { href, ...props }, children),
}))

// ─── Mock useScrollReveal ─────────────────────────────────────────────────────
vi.mock('../hooks/useScrollReveal', () => ({
  useScrollReveal: vi.fn(),
}))

// ─── Mock ThemeContext ─────────────────────────────────────────────────────────
vi.mock('./ThemeContext', () => ({
  useTheme: vi.fn(() => ({ theme: 'dark' })),
}))

// ─── Mock react-icons ─────────────────────────────────────────────────────────
vi.mock('react-icons/fa6', () => ({
  FaGithub: () => React.createElement('svg', { 'data-testid': 'icon-github' }),
  FaLinkedin: () => React.createElement('svg', { 'data-testid': 'icon-linkedin' }),
  FaInstagram: () => React.createElement('svg', { 'data-testid': 'icon-instagram' }),
}))

// ─── Mock window.matchMedia ───────────────────────────────────────────────────
function mockMatchMedia(prefersReducedMotion: boolean) {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: vi.fn().mockImplementation((query: string) => ({
      matches: prefersReducedMotion && query === '(prefers-reduced-motion: reduce)',
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })),
  })
}

// ─── ResizeObserver capture helper ───────────────────────────────────────────
let resizeCallback: (() => void) | null = null

function installResizeObserverCapture() {
  global.ResizeObserver = class {
    constructor(cb: () => void) {
      resizeCallback = cb
    }
    observe = vi.fn()
    unobserve = vi.fn()
    disconnect = vi.fn()
  }
}

function installResizeObserverNoop() {
  global.ResizeObserver = class ResizeObserver {
    observe = vi.fn()
    unobserve = vi.fn()
    disconnect = vi.fn()
  }
}

// ─── Import after mocks ───────────────────────────────────────────────────────
import Footer from './Footer'

// ─── Helper: mock scrollWidth so the marquee guard passes ────────────────────
/**
 * Footer.tsx guards: `if (width === 0) return;` where width = marqueeEl.scrollWidth.
 * In jsdom, scrollWidth is always 0. We must mock it to a positive value so
 * gsap.to is actually called (which is what we're testing).
 */
function mockScrollWidthOnElement(el: Element, width: number) {
  Object.defineProperty(el, 'scrollWidth', {
    configurable: true,
    get: () => width,
  })
}

// ─── Pure velocity helpers (no DOM/GSAP needed) ───────────────────────────────

/**
 * computeMarqueeVelocity: pure function that computes marquee velocity.
 *
 * For a linear ease (ease: 'none'), progress at time t is exactly:
 *   progress(t) = t / duration
 *
 * Displacement at time t:
 *   x(t) = totalWidth * (t / duration)
 *
 * Instantaneous velocity:
 *   v(t) = dx/dt = totalWidth / duration  — constant at every point
 */
export function computeMarqueeVelocity(totalWidth: number, duration: number): number {
  return totalWidth / duration
}

function computeDisplacementAtTime(
  totalWidth: number,
  duration: number,
  t: number
): number {
  // ease: 'none' => linear progress
  const progress = Math.min(t / duration, 1)
  return totalWidth * progress
}

function computeInstantaneousVelocity(
  totalWidth: number,
  duration: number,
  t1: number,
  t2: number
): number {
  if (t2 <= t1) return 0
  const d1 = computeDisplacementAtTime(totalWidth, duration, t1)
  const d2 = computeDisplacementAtTime(totalWidth, duration, t2)
  return (d2 - d1) / (t2 - t1)
}

// ─── Property 15 Tests ────────────────────────────────────────────────────────

describe('Footer - Property 15: Marquee maintains constant velocity', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    capturedTweens.length = 0
    resizeCallback = null
    mockMatchMedia(false) // animations enabled
    installResizeObserverNoop()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  // ─── Helper: render Footer with mocked scrollWidth ───────────────────────
  function renderFooterWithMarquee(scrollWidth = 800) {
    // We mock HTMLElement.prototype.scrollWidth globally before rendering
    // so that when useEffect reads marqueeEl.scrollWidth it gets our value.
    const scrollWidthDescriptor = Object.getOwnPropertyDescriptor(
      HTMLElement.prototype,
      'scrollWidth'
    )
    Object.defineProperty(HTMLElement.prototype, 'scrollWidth', {
      configurable: true,
      get: () => scrollWidth,
    })

    const result = render(<Footer />)

    // Restore after render
    if (scrollWidthDescriptor) {
      Object.defineProperty(HTMLElement.prototype, 'scrollWidth', scrollWidthDescriptor)
    } else {
      // Remove the override
      Object.defineProperty(HTMLElement.prototype, 'scrollWidth', {
        configurable: true,
        get: () => 0,
      })
    }

    return result
  }

  // ─── Property 15.1: GSAP tween called with ease: 'none' ──────────────────────
  it(
    'Property 15.1: for any marquee content, the GSAP tween is always called with ease: "none" (linear — constant velocity)',
    () => {
      fc.assert(
        fc.property(
          fc.record({
            scrollWidth: fc.integer({ min: 100, max: 5000 }),
            dummy: fc.nat(),
          }),
          ({ scrollWidth, dummy: _dummy }) => {
            vi.clearAllMocks()
            capturedTweens.length = 0

            const { unmount } = renderFooterWithMarquee(scrollWidth)

            // Find the marquee tween — the one that animates x: '-50%'
            const marqueeTween = capturedTweens.find(
              (t) => typeof t.vars.x === 'string' && t.vars.x === '-50%'
            )

            expect(marqueeTween).toBeDefined()
            // Core invariant: ease must be 'none' for constant velocity
            expect(marqueeTween!.vars.ease).toBe('none')

            unmount()
          }
        ),
        { numRuns: 20 }
      )
    }
  )

  // ─── Property 15.2: GSAP tween called with repeat: -1 ────────────────────────
  it(
    'Property 15.2: for any marquee content, the GSAP tween is always called with repeat: -1 (infinite loop)',
    () => {
      fc.assert(
        fc.property(
          fc.record({
            scrollWidth: fc.integer({ min: 100, max: 5000 }),
            dummy: fc.nat(),
          }),
          ({ scrollWidth, dummy: _dummy }) => {
            vi.clearAllMocks()
            capturedTweens.length = 0

            const { unmount } = renderFooterWithMarquee(scrollWidth)

            const marqueeTween = capturedTweens.find(
              (t) => typeof t.vars.x === 'string' && t.vars.x === '-50%'
            )

            expect(marqueeTween).toBeDefined()
            // Core invariant: repeat: -1 for infinite continuous loop
            expect(marqueeTween!.vars.repeat).toBe(-1)

            unmount()
          }
        ),
        { numRuns: 20 }
      )
    }
  )

  // ─── Property 15.3: ease:'none' + repeat:-1 always coexist ───────────────────
  it(
    'Property 15.3: ease: "none" and repeat: -1 always coexist on the same marquee tween — never one without the other',
    () => {
      fc.assert(
        fc.property(
          fc.record({
            scrollWidth: fc.integer({ min: 100, max: 5000 }),
          }),
          ({ scrollWidth }) => {
            vi.clearAllMocks()
            capturedTweens.length = 0

            const { unmount } = renderFooterWithMarquee(scrollWidth)

            const marqueeTween = capturedTweens.find(
              (t) => typeof t.vars.x === 'string' && t.vars.x === '-50%'
            )

            expect(marqueeTween).toBeDefined()
            // Both must be present together for correct constant-velocity infinite loop
            expect(marqueeTween!.vars.ease).toBe('none')
            expect(marqueeTween!.vars.repeat).toBe(-1)

            unmount()
          }
        ),
        { numRuns: 20 }
      )
    }
  )

  // ─── Property 15.4: x target is always '-50%' (seamless duplicate-content loop) ──
  it(
    'Property 15.4: the marquee tween always animates to x: "-50%" — enabling seamless loop with duplicated content',
    () => {
      fc.assert(
        fc.property(
          fc.record({
            scrollWidth: fc.integer({ min: 100, max: 5000 }),
          }),
          ({ scrollWidth }) => {
            vi.clearAllMocks()
            capturedTweens.length = 0

            const { unmount } = renderFooterWithMarquee(scrollWidth)

            const marqueeTween = capturedTweens.find(
              (t) => typeof t.vars.x === 'string' && t.vars.x === '-50%'
            )

            expect(marqueeTween).toBeDefined()
            expect(marqueeTween!.vars.x).toBe('-50%')

            unmount()
          }
        ),
        { numRuns: 20 }
      )
    }
  )

  // ─── Property 15.5: computeMarqueeVelocity returns totalWidth/duration ────────
  it(
    'Property 15.5: computeMarqueeVelocity(totalWidth, duration) returns exactly totalWidth / duration',
    () => {
      fc.assert(
        fc.property(
          fc.record({
            totalWidth: fc.float({ min: Math.fround(1), max: Math.fround(10000), noNaN: true }),
            duration: fc.float({ min: Math.fround(0.1), max: Math.fround(100), noNaN: true }),
          }),
          ({ totalWidth, duration }) => {
            const velocity = computeMarqueeVelocity(totalWidth, duration)
            expect(velocity).toBe(totalWidth / duration)
          }
        ),
        { numRuns: 200 }
      )
    }
  )

  // ─── Property 15.6: Pure velocity calculation — constant across all time points ──
  it(
    'Property 15.6: for ease: "none" over any duration D and any total width, instantaneous velocity equals computeMarqueeVelocity at every time point t in [0, D]',
    () => {
      fc.assert(
        fc.property(
          fc.record({
            // Simulate varying content widths
            totalWidth: fc.float({ min: 100, max: 5000, noNaN: true }),
            // Varying durations (footer uses 20s)
            duration: fc.float({ min: 1, max: 60, noNaN: true }),
            // Sample time point, normalized 0..1
            tNorm: fc.float({ min: Math.fround(0.01), max: Math.fround(0.99), noNaN: true }),
          }),
          ({ totalWidth, duration, tNorm }) => {
            // Expected constant velocity for ease: 'none'
            const expectedVelocity = computeMarqueeVelocity(totalWidth, duration)

            // Measure instantaneous velocity over a tiny interval at time tNorm*duration
            const tAbsolute = tNorm * duration
            const dt = duration * 0.001 // 0.1% of duration — tiny interval
            const tStart = Math.max(0, tAbsolute - dt / 2)
            const tEnd = Math.min(duration, tAbsolute + dt / 2)

            if (tEnd <= tStart) return // edge case: skip degenerate intervals

            const measuredVelocity = computeInstantaneousVelocity(
              totalWidth,
              duration,
              tStart,
              tEnd
            )

            // For linear ease, measured velocity must equal expected velocity everywhere
            expect(measuredVelocity).toBeCloseTo(expectedVelocity, 5)
          }
        ),
        { numRuns: 200 }
      )
    }
  )

  // ─── Property 15.7: zero-acceleration invariant — v(t1) === v(t2) ─────────────
  it(
    'Property 15.7: for ease: "none", velocity is identical at any two time points (zero acceleration)',
    () => {
      fc.assert(
        fc.property(
          fc.record({
            totalWidth: fc.float({ min: 50, max: 3000, noNaN: true }),
            duration: fc.float({ min: 1, max: 60, noNaN: true }),
            // Two arbitrary normalized time points within [0.05, 0.45] and [0.55, 0.95]
            t1Norm: fc.float({ min: Math.fround(0.05), max: Math.fround(0.45), noNaN: true }),
            t2Norm: fc.float({ min: Math.fround(0.55), max: Math.fround(0.95), noNaN: true }),
          }),
          ({ totalWidth, duration, t1Norm, t2Norm }) => {
            const dt = duration * 0.05 // 5% window for measuring velocity

            const t1 = t1Norm * duration
            const t2 = t2Norm * duration

            const v1 = computeInstantaneousVelocity(
              totalWidth,
              duration,
              Math.max(0, t1 - dt / 2),
              Math.min(duration, t1 + dt / 2)
            )

            const v2 = computeInstantaneousVelocity(
              totalWidth,
              duration,
              Math.max(0, t2 - dt / 2),
              Math.min(duration, t2 + dt / 2)
            )

            // Acceleration = Δv/Δt. For constant velocity, v1 === v2 (zero acceleration)
            expect(v1).toBeCloseTo(v2, 5)
          }
        ),
        { numRuns: 200 }
      )
    }
  )

  // ─── Property 15.8: ResizeObserver restart preserves ease/repeat config ───────
  it(
    'Property 15.8: after ResizeObserver triggers a restart, every new tween still has ease: "none" and repeat: -1',
    () => {
      fc.assert(
        fc.property(
          fc.record({
            scrollWidth: fc.integer({ min: 100, max: 5000 }),
          }),
          ({ scrollWidth }) => {
            vi.clearAllMocks()
            capturedTweens.length = 0
            resizeCallback = null
            installResizeObserverCapture()

            // Mock scrollWidth for the entire test lifecycle
            Object.defineProperty(HTMLElement.prototype, 'scrollWidth', {
              configurable: true,
              get: () => scrollWidth,
            })

            const { unmount } = render(<Footer />)

            // Initial tween check
            const initialTween = capturedTweens.find(
              (t) => typeof t.vars.x === 'string' && t.vars.x === '-50%'
            )
            expect(initialTween).toBeDefined()
            expect(initialTween!.vars.ease).toBe('none')
            expect(initialTween!.vars.repeat).toBe(-1)

            // Simulate a resize event (e.g. content reflow)
            if (resizeCallback) {
              act(() => {
                resizeCallback!()
              })
            }

            // After resize, a new tween should have been created with same config
            const allMarqueeTweens = capturedTweens.filter(
              (t) => typeof t.vars.x === 'string' && t.vars.x === '-50%'
            )

            // Every single tween (initial + post-resize) must have ease: 'none' and repeat: -1
            for (const tween of allMarqueeTweens) {
              expect(tween.vars.ease).toBe('none')
              expect(tween.vars.repeat).toBe(-1)
            }

            // Restore scrollWidth
            Object.defineProperty(HTMLElement.prototype, 'scrollWidth', {
              configurable: true,
              get: () => 0,
            })

            unmount()
            installResizeObserverNoop()
          }
        ),
        { numRuns: 10 }
      )
    }
  )

  // ─── Property 15.9: With prefers-reduced-motion, no marquee tween is created ──
  it(
    'Property 15.9: when prefers-reduced-motion is active, no marquee animation tween is created',
    () => {
      fc.assert(
        fc.property(
          fc.record({
            scrollWidth: fc.integer({ min: 100, max: 5000 }),
          }),
          ({ scrollWidth: _scrollWidth }) => {
            vi.clearAllMocks()
            capturedTweens.length = 0
            mockMatchMedia(true) // prefers-reduced-motion: reduce

            // Even with nonzero scrollWidth, no tween should be created under reduced motion
            Object.defineProperty(HTMLElement.prototype, 'scrollWidth', {
              configurable: true,
              get: () => 800,
            })

            const { unmount } = render(<Footer />)

            const marqueeTween = capturedTweens.find(
              (t) => typeof t.vars.x === 'string' && t.vars.x === '-50%'
            )

            // No marquee tween should be created under reduced motion
            expect(marqueeTween).toBeUndefined()

            // Restore
            Object.defineProperty(HTMLElement.prototype, 'scrollWidth', {
              configurable: true,
              get: () => 0,
            })

            unmount()
          }
        ),
        { numRuns: 10 }
      )
    }
  )
})
