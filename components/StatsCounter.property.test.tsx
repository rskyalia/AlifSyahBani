// Feature: gsap-modern-portfolio, Property 10: Counter animates from 0 and displays rounded integers
// Feature: gsap-modern-portfolio, Property 11: Counter animation fires exactly once per session
// **Validates: Requirements 8.1, 8.2, 8.4**

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render } from '@testing-library/react'
import fc from 'fast-check'
import React from 'react'

/**
 * Property-Based Tests for StatsCounter Component
 *
 * Property 10: Counter animates from 0 and displays rounded integers
 *   For any StatsCounter with target value N, when triggered:
 *   (a) the initial displayed value should be 0
 *   (b) the final displayed value should equal N
 *   (c) every intermediate displayed value should equal Math.round(interpolated) — never fractional
 *
 * Property 11: Counter animation fires exactly once per session
 */

// ─── Mock GSAP and ScrollTrigger ──────────────────────────────────────────────

interface MockScrollTrigger {
  config: any
  killed: boolean
  onEnterCallback: (() => void) | null
  kill: () => void
}

const mockScrollTriggers: MockScrollTrigger[] = []

vi.mock('gsap', () => {
  return {
    gsap: {
      registerPlugin: vi.fn(),
      to: vi.fn((target: any, vars: any) => {
        const tween = {
          targets: () => [target],
          play: vi.fn(() => {
            // Simulate 11 interpolation steps (0..10) from 0 to vars.val
            const steps = 10
            for (let i = 0; i <= steps; i++) {
              const progress = i / steps
              target.val = (vars.val ?? 0) * progress
              if (vars.onUpdate) {
                vars.onUpdate.call(tween)
              }
            }
            // Call onComplete after all steps
            if (vars.onComplete) {
              target.val = vars.val ?? 0
              vars.onComplete.call(tween)
            }
          }),
        }
        return tween
      }),
      context: vi.fn((fn: (ctx: any) => void, _scope?: any) => {
        const ctx = { revert: vi.fn() }
        fn(ctx)
        return ctx
      }),
    },
  }
})

vi.mock('gsap/ScrollTrigger', () => {
  return {
    ScrollTrigger: {
      create: vi.fn((config: any) => {
        const st: MockScrollTrigger = {
          config,
          killed: false,
          onEnterCallback: config.onEnter || null,
          kill: vi.fn(function (this: MockScrollTrigger) {
            this.killed = true
          }),
        }
        mockScrollTriggers.push(st)
        return st
      }),
      refresh: vi.fn(),
      getAll: vi.fn(() => mockScrollTriggers.filter((st) => !st.killed)),
    },
  }
})

// Import after mocks
import StatsCounter, { StatItem } from './StatsCounter'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

// ─── Test Helpers ─────────────────────────────────────────────────────────────

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

function simulateScrollTrigger(st: MockScrollTrigger) {
  if (st.onEnterCallback && !st.killed) {
    st.onEnterCallback()
  }
}

// ─── Property 10 Tests ────────────────────────────────────────────────────────

describe('StatsCounter - Property 10: Counter animates from 0 and displays rounded integers', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockScrollTriggers.length = 0
    mockMatchMedia(false) // Animations enabled
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  // ─── Property 10a: Initial displayed value is 0 ──────────────────────────────
  it('Property 10a: for any target N, initial displayed value is "0{suffix}" before trigger', () => {
    fc.assert(
      fc.property(
        fc.record({
          value: fc.integer({ min: 1, max: 9999 }),
          suffix: fc.constantFrom('+', '%', 'x', 'k', ''),
          label: fc.constantFrom('Years', 'Projects', 'Awards', 'Clients', 'Commits'),
        }),
        ({ value, suffix, label }) => {
          vi.clearAllMocks()
          mockScrollTriggers.length = 0

          const stats: StatItem[] = [{ value, suffix, label }]
          const { container, unmount } = render(<StatsCounter stats={stats} />)

          const displayEl = container.querySelector('[aria-label]')
          expect(displayEl).not.toBeNull()
          expect(displayEl!.textContent).toBe(`0${suffix}`)

          unmount()
        }
      ),
      { numRuns: 25 }
    )
  })

  // ─── Property 10b: Final displayed value equals N ────────────────────────────
  it('Property 10b: for any target N, final displayed value equals N after animation completes', () => {
    fc.assert(
      fc.property(
        fc.record({
          value: fc.integer({ min: 1, max: 9999 }),
          suffix: fc.constantFrom('+', '%', 'x', 'k', ''),
          label: fc.constantFrom('Years', 'Projects', 'Awards', 'Clients', 'Commits'),
        }),
        ({ value, suffix, label }) => {
          vi.clearAllMocks()
          mockScrollTriggers.length = 0

          const stats: StatItem[] = [{ value, suffix, label }]
          const { container, unmount } = render(<StatsCounter stats={stats} />)

          expect(mockScrollTriggers.length).toBe(1)
          simulateScrollTrigger(mockScrollTriggers[0])

          const displayEl = container.querySelector('[aria-label]')
          expect(displayEl!.textContent).toBe(`${value}${suffix}`)

          unmount()
        }
      ),
      { numRuns: 25 }
    )
  })

  // ─── Property 10c: Every intermediate value is an integer (Math.round applied) ──
  it('Property 10c: for any target N, every intermediate displayed value is a rounded integer (never fractional)', () => {
    fc.assert(
      fc.property(
        fc.record({
          value: fc.integer({ min: 1, max: 9999 }),
          suffix: fc.constantFrom('+', '%', 'x', 'k', ''),
          label: fc.constantFrom('Years', 'Projects', 'Awards', 'Clients', 'Commits'),
        }),
        ({ value, suffix, label }) => {
          vi.clearAllMocks()
          mockScrollTriggers.length = 0

          const intermediates: number[] = []

          const originalTo = (gsap.to as ReturnType<typeof vi.fn>).getMockImplementation()
          ;(gsap.to as ReturnType<typeof vi.fn>).mockImplementationOnce(
            (target: any, vars: any) => {
              const interceptedVars = {
                ...vars,
                onUpdate(this: any) {
                  if (vars.onUpdate) vars.onUpdate.call(this)
                  const el = container.querySelector('[aria-label]')
                  if (el?.textContent) {
                    const parsed = parseFloat(el.textContent.replace(suffix, ''))
                    if (!isNaN(parsed)) intermediates.push(parsed)
                  }
                },
              }
              return originalTo!(target, interceptedVars)
            }
          )

          const stats: StatItem[] = [{ value, suffix, label }]
          const { container, unmount } = render(<StatsCounter stats={stats} />)

          expect(mockScrollTriggers.length).toBe(1)
          simulateScrollTrigger(mockScrollTriggers[0])

          expect(intermediates.length).toBeGreaterThan(0)
          for (const v of intermediates) {
            expect(v).toBe(Math.round(v))
            expect(Number.isInteger(v)).toBe(true)
          }

          unmount()
        }
      ),
      { numRuns: 25 }
    )
  })

  // ─── Property 10d: Displayed values are monotonically non-decreasing ─────────
  it('Property 10d: for any target N, displayed values never decrease during animation (monotonically non-decreasing)', () => {
    fc.assert(
      fc.property(
        fc.record({
          value: fc.integer({ min: 2, max: 9999 }),
          suffix: fc.constantFrom('+', '%', 'x', 'k', ''),
          label: fc.constantFrom('Years', 'Projects', 'Awards', 'Clients', 'Commits'),
        }),
        ({ value, suffix, label }) => {
          vi.clearAllMocks()
          mockScrollTriggers.length = 0

          const displayedValues: number[] = []

          const originalTo = (gsap.to as ReturnType<typeof vi.fn>).getMockImplementation()
          ;(gsap.to as ReturnType<typeof vi.fn>).mockImplementationOnce(
            (target: any, vars: any) => {
              const interceptedVars = {
                ...vars,
                onUpdate(this: any) {
                  if (vars.onUpdate) vars.onUpdate.call(this)
                  const el = container.querySelector('[aria-label]')
                  if (el?.textContent) {
                    const parsed = parseFloat(el.textContent.replace(suffix, ''))
                    if (!isNaN(parsed)) displayedValues.push(parsed)
                  }
                },
              }
              return originalTo!(target, interceptedVars)
            }
          )

          const stats: StatItem[] = [{ value, suffix, label }]
          const { container, unmount } = render(<StatsCounter stats={stats} />)

          expect(mockScrollTriggers.length).toBe(1)
          simulateScrollTrigger(mockScrollTriggers[0])

          for (let i = 1; i < displayedValues.length; i++) {
            expect(displayedValues[i]).toBeGreaterThanOrEqual(displayedValues[i - 1])
          }

          unmount()
        }
      ),
      { numRuns: 25 }
    )
  })

  // ─── Property 10e: Multiple stats each start at 0 and end at their target ────
  it('Property 10e: for any array of stats, each counter starts at 0 and ends at its target value', () => {
    fc.assert(
      fc.property(
        fc.array(
          fc.record({
            value: fc.integer({ min: 1, max: 9999 }),
            suffix: fc.constantFrom('+', '%', 'x', ''),
            label: fc.constantFrom('Years', 'Projects', 'Awards', 'Clients'),
          }),
          { minLength: 1, maxLength: 4 }
        ),
        (stats) => {
          vi.clearAllMocks()
          mockScrollTriggers.length = 0

          const { container, unmount } = render(<StatsCounter stats={stats} />)

          const displayEls = Array.from(container.querySelectorAll('[aria-label]'))
          expect(displayEls.length).toBe(stats.length)

          stats.forEach((stat, i) => {
            expect(displayEls[i].textContent).toBe(`0${stat.suffix}`)
          })

          expect(mockScrollTriggers.length).toBe(stats.length)
          mockScrollTriggers.forEach((st) => simulateScrollTrigger(st))

          stats.forEach((stat, i) => {
            expect(displayEls[i].textContent).toBe(`${stat.value}${stat.suffix}`)
          })

          unmount()
        }
      ),
      { numRuns: 25 }
    )
  })

  // ─── Property 10f: With reduced motion, value is immediately target ───────────
  it('Property 10f: with prefers-reduced-motion, displayed value is immediately N (no animation from 0)', () => {
    fc.assert(
      fc.property(
        fc.record({
          value: fc.integer({ min: 1, max: 9999 }),
          suffix: fc.constantFrom('+', '%', 'x', 'k', ''),
          label: fc.constantFrom('Years', 'Projects', 'Awards'),
        }),
        ({ value, suffix, label }) => {
          mockMatchMedia(true)
          vi.clearAllMocks()
          mockScrollTriggers.length = 0

          const stats: StatItem[] = [{ value, suffix, label }]
          const { container, unmount } = render(<StatsCounter stats={stats} />)

          const displayEl = container.querySelector('[aria-label]')
          expect(displayEl!.textContent).toBe(`${value}${suffix}`)

          expect(gsap.to).not.toHaveBeenCalled()
          expect(ScrollTrigger.create).not.toHaveBeenCalled()

          unmount()
        }
      ),
      { numRuns: 25 }
    )
  })
})

// ─── Property 11 Tests ────────────────────────────────────────────────────────

describe('StatsCounter - Property 11: Counter fires exactly once per session', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockScrollTriggers.length = 0
    mockMatchMedia(false) // Animations enabled
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  // ─── Property 11.1: ScrollTrigger is created with once: true ─────────────────
  it('Property 11.1: for any stats array, ScrollTrigger is created with once: true flag', () => {
    fc.assert(
      fc.property(
        fc.record({
          numStats: fc.integer({ min: 1, max: 5 }),
          values: fc.array(fc.integer({ min: 1, max: 1000 }), { minLength: 1, maxLength: 5 }),
          suffixes: fc.array(fc.constantFrom('+', '%', 'x', 'k', ''), { minLength: 1, maxLength: 5 }),
          labels: fc.array(
            fc.constantFrom('Years', 'Projects', 'Awards', 'Clients', 'Commits'),
            { minLength: 1, maxLength: 5 }
          ),
        }),
        ({ numStats, values, suffixes, labels }) => {
          vi.clearAllMocks()
          mockScrollTriggers.length = 0

          const stats: StatItem[] = []
          for (let i = 0; i < Math.min(numStats, values.length, suffixes.length, labels.length); i++) {
            stats.push({ value: values[i], suffix: suffixes[i], label: labels[i] })
          }

          const { unmount } = render(<StatsCounter stats={stats} />)

          expect(ScrollTrigger.create).toHaveBeenCalledTimes(stats.length)
          mockScrollTriggers.forEach((st) => {
            expect(st.config.once).toBe(true)
          })

          unmount()
        }
      ),
      { numRuns: 25 }
    )
  })

  // ─── Property 11.2: ScrollTrigger is killed after animation completes ────────
  it('Property 11.2: for any stats, ScrollTrigger.kill() is called after counter animation completes', () => {
    fc.assert(
      fc.property(
        fc.record({
          value: fc.integer({ min: 1, max: 500 }),
          suffix: fc.constantFrom('+', '%', 'x', 'k'),
          label: fc.constantFrom('Projects', 'Years', 'Awards'),
        }),
        ({ value, suffix, label }) => {
          vi.clearAllMocks()
          mockScrollTriggers.length = 0

          const stats: StatItem[] = [{ value, suffix, label }]
          const { unmount } = render(<StatsCounter stats={stats} />)

          expect(mockScrollTriggers.length).toBe(1)
          const st = mockScrollTriggers[0]
          expect(st.killed).toBe(false)

          simulateScrollTrigger(st)

          expect(st.kill).toHaveBeenCalled()
          expect(st.killed).toBe(true)

          unmount()
        }
      ),
      { numRuns: 25 }
    )
  })

  // ─── Property 11.3: Re-triggering does not restart animation ─────────────────
  it('Property 11.3: after first trigger, subsequent scroll events do not restart counter animation', () => {
    fc.assert(
      fc.property(
        fc.record({
          value: fc.integer({ min: 10, max: 1000 }),
          suffix: fc.constantFrom('+', '%', 'x'),
          label: fc.constantFrom('Projects', 'Years', 'Awards', 'Stars', 'Clients'),
          retriggersCount: fc.integer({ min: 1, max: 10 }),
        }),
        ({ value, suffix, label, retriggersCount }) => {
          vi.clearAllMocks()
          mockScrollTriggers.length = 0

          const stats: StatItem[] = [{ value, suffix, label }]

          let playCallCount = 0
          const originalTo = (gsap.to as ReturnType<typeof vi.fn>).getMockImplementation()
          ;(gsap.to as ReturnType<typeof vi.fn>).mockImplementation((target: any, vars: any) => {
            const tween = originalTo!(target, vars)
            const originalPlay = tween.play
            tween.play = vi.fn(() => {
              playCallCount++
              return originalPlay.call(tween)
            })
            return tween
          })

          const { unmount } = render(<StatsCounter stats={stats} />)

          const st = mockScrollTriggers[0]
          expect(st).toBeDefined()

          simulateScrollTrigger(st)
          expect(playCallCount).toBe(1)
          expect(st.killed).toBe(true)

          for (let i = 0; i < retriggersCount; i++) {
            simulateScrollTrigger(st)
          }

          expect(playCallCount).toBe(1)

          unmount()
        }
      ),
      { numRuns: 25 }
    )
  })

  // ─── Property 11.4: Final value remains stable after animation ───────────────
  it('Property 11.4: after animation completes, displayed value equals target and never changes on scroll', { timeout: 5000 }, () => {
    fc.assert(
      fc.property(
        fc.record({
          value: fc.integer({ min: 1, max: 999 }),
          suffix: fc.constantFrom('+', '%', 'x', 'k', ''),
          label: fc.constantFrom('Projects', 'Years', 'Awards', 'Stars', 'Clients', 'Commits'),
        }),
        ({ value, suffix, label }) => {
          vi.clearAllMocks()
          mockScrollTriggers.length = 0

          const stats: StatItem[] = [{ value, suffix, label }]
          const { container, unmount } = render(<StatsCounter stats={stats} />)

          const st = mockScrollTriggers[0]
          const displayElement = container.querySelector('[aria-label]')
          expect(displayElement?.textContent).toBe(`0${suffix}`)

          simulateScrollTrigger(st)

          const finalValue = `${value}${suffix}`
          expect(displayElement?.textContent).toBe(finalValue)
          const stableValue = displayElement?.textContent

          for (let i = 0; i < 5; i++) {
            simulateScrollTrigger(st)
          }

          expect(displayElement?.textContent).toBe(stableValue)
          expect(displayElement?.textContent).toBe(finalValue)

          unmount()
        }
      ),
      { numRuns: 25 }
    )
  })

  // ─── Property 11.5: Multiple counters each fire once independently ───────────
  it('Property 11.5: for any array of stats, each counter fires exactly once and independently', { timeout: 5000 }, () => {
    fc.assert(
      fc.property(
        fc.record({ numStats: fc.integer({ min: 2, max: 4 }) }),
        ({ numStats }) => {
          vi.clearAllMocks()
          mockScrollTriggers.length = 0

          const stats: StatItem[] = []
          for (let i = 0; i < numStats; i++) {
            stats.push({ value: (i + 1) * 10, suffix: '+', label: `Stat${i}` })
          }

          const { unmount } = render(<StatsCounter stats={stats} />)

          expect(mockScrollTriggers.length).toBe(numStats)

          mockScrollTriggers.forEach((st) => {
            expect(st.killed).toBe(false)
            simulateScrollTrigger(st)
            expect(st.killed).toBe(true)
            expect(st.kill).toHaveBeenCalledTimes(1)
          })

          mockScrollTriggers.forEach((st) => {
            const killsBefore = (st.kill as ReturnType<typeof vi.fn>).mock.calls.length
            simulateScrollTrigger(st)
            expect((st.kill as ReturnType<typeof vi.fn>).mock.calls.length).toBe(killsBefore)
          })

          unmount()
        }
      ),
      { numRuns: 25 }
    )
  })

  // ─── Property 11.6: once: true config value is constant ──────────────────────
  it('Property 11.6: for any stats configuration, once is always true — never false or undefined', { timeout: 5000 }, () => {
    fc.assert(
      fc.property(
        fc.record({
          stats: fc.array(
            fc.record({
              value: fc.integer({ min: 1, max: 1000 }),
              suffix: fc.constantFrom('+', '%', 'x', 'k', ''),
              label: fc.constantFrom('Years', 'Projects', 'Awards', 'Clients', 'Commits', 'Stars'),
            }),
            { minLength: 1, maxLength: 3 }
          ),
          className: fc.option(fc.constantFrom('counter', 'stats', 'hero-stats', ''), { nil: undefined }),
        }),
        ({ stats, className }) => {
          vi.clearAllMocks()
          mockScrollTriggers.length = 0

          const { unmount } = render(<StatsCounter stats={stats} className={className} />)

          expect(mockScrollTriggers.length).toBe(stats.length)
          mockScrollTriggers.forEach((st) => {
            expect(st.config.once).toBe(true)
            expect(st.config.once).not.toBe(false)
            expect(st.config.once).not.toBeUndefined()
          })

          unmount()
        }
      ),
      { numRuns: 15 }
    )
  })

  // ─── Property 11.7: Cleanup does not interfere with once behavior ────────────
  it('Property 11.7: component unmount/remount creates fresh ScrollTriggers with once: true', { timeout: 5000 }, () => {
    fc.assert(
      fc.property(
        fc.record({
          value: fc.integer({ min: 1, max: 500 }),
          suffix: fc.constantFrom('+', '%'),
          label: fc.constantFrom('Projects', 'Years', 'Awards'),
          remountCount: fc.integer({ min: 1, max: 2 }),
        }),
        ({ value, suffix, label, remountCount }) => {
          const stats: StatItem[] = [{ value, suffix, label }]

          for (let cycle = 0; cycle < remountCount; cycle++) {
            vi.clearAllMocks()
            mockScrollTriggers.length = 0

            const { unmount } = render(<StatsCounter stats={stats} />)

            expect(mockScrollTriggers.length).toBe(1)
            const st = mockScrollTriggers[0]
            expect(st.config.once).toBe(true)
            expect(st.killed).toBe(false)

            simulateScrollTrigger(st)
            expect(st.killed).toBe(true)

            unmount()
          }
        }
      ),
      { numRuns: 15 }
    )
  })

  // ─── Property 11.8: With reduced motion, no ScrollTrigger is created ─────────
  it('Property 11.8: when prefers-reduced-motion is active, no ScrollTrigger is created', () => {
    fc.assert(
      fc.property(
        fc.record({
          stats: fc.array(
            fc.record({
              value: fc.integer({ min: 1, max: 500 }),
              suffix: fc.constantFrom('+', '%', 'x'),
              label: fc.constantFrom('Projects', 'Years', 'Awards', 'Stars'),
            }),
            { minLength: 1, maxLength: 4 }
          ),
        }),
        ({ stats }) => {
          vi.clearAllMocks()
          mockScrollTriggers.length = 0
          mockMatchMedia(true)

          const { unmount } = render(<StatsCounter stats={stats} />)

          expect(mockScrollTriggers.length).toBe(0)
          expect(ScrollTrigger.create).not.toHaveBeenCalled()
          expect(gsap.to).not.toHaveBeenCalled()

          unmount()
        }
      ),
      { numRuns: 15 }
    )
  })
})
