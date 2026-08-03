// Feature: gsap-modern-portfolio, Property 5: Scroll reveal elements start hidden
// **Validates: Requirements 6.5**

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render } from '@testing-library/react'
import { useRef } from 'react'
import fc from 'fast-check'

/**
 * Property-Based Test for useScrollReveal Hook
 *
 * Property 5: Scroll reveal elements start hidden
 *
 * For any element outside the initial viewport that uses useScrollReveal,
 * the element's initial state (before ScrollTrigger fires) should have:
 * - opacity: 0 and y: 60 (for fade-up preset)
 * - clipPath: inset(0% 0% 100% 0%) (for clip-reveal preset)
 * - opacity: 0 and y: 60 for all stagger targets (for stagger preset)
 *
 * This ensures elements are not visible before scroll reaches them.
 */

// ─── Mock GSAP and ScrollTrigger before any imports ───────────────────────────

vi.mock('gsap', () => {
  return {
    gsap: {
      registerPlugin: vi.fn(),
      set: vi.fn(),
      to: vi.fn(),
      context: vi.fn((fn: () => void) => {
        fn()
        return { revert: vi.fn() }
      }),
    },
  }
})

vi.mock('gsap/ScrollTrigger', () => ({
  ScrollTrigger: {
    register: vi.fn(),
    getAll: vi.fn(() => []),
    refresh: vi.fn(),
    kill: vi.fn(),
    enable: vi.fn(),
  },
}))

// Import AFTER mocks
import { useScrollReveal, ScrollRevealOptions } from './useScrollReveal'
import { gsap } from 'gsap'

// ─── Test Component ────────────────────────────────────────────────────────────

interface TestComponentProps extends Partial<ScrollRevealOptions> {
  preset: 'fade-up' | 'clip-reveal' | 'stagger'
}

function TestComponent(props: TestComponentProps) {
  const ref = useRef<HTMLDivElement>(null)
  useScrollReveal(ref, props as ScrollRevealOptions)

  if (props.preset === 'stagger') {
    return (
      <div ref={ref} data-testid="reveal-container">
        <div className="stagger-child" data-testid="stagger-child-0">Child 1</div>
        <div className="stagger-child" data-testid="stagger-child-1">Child 2</div>
        <div className="stagger-child" data-testid="stagger-child-2">Child 3</div>
      </div>
    )
  }

  return <div ref={ref} data-testid="reveal-element">Reveal Content</div>
}

// ─── Helpers ───────────────────────────────────────────────────────────────────

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

// ─── Tests ─────────────────────────────────────────────────────────────────────

describe('useScrollReveal - Property 5: Elements start hidden', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    // Default: animations enabled, no reduced motion
    mockMatchMedia(false)
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  // ─── Property 5.1: fade-up starts hidden ────────────────────────────────────
  it('Property 5.1: fade-up - initial state has opacity 0 and y: 60 for any options', () => {
    fc.assert(
      fc.property(
        fc.record({
          duration: fc.float({ min: Math.fround(0.1), max: Math.fround(3.0), noNaN: true }),
          start: fc.constantFrom('top 85%', 'top 80%', 'top 90%', 'top center'),
          ease: fc.constantFrom('power4.out', 'power2.out', 'expo.out'),
          once: fc.boolean(),
        }),
        (options) => {
          vi.clearAllMocks()

          const { container, unmount } = render(
            <TestComponent preset="fade-up" {...options} />
          )

          const element = container.querySelector('[data-testid="reveal-element"]') as HTMLElement
          expect(element).toBeTruthy()

          // gsap.set should have been called with the initial hidden state
          expect(gsap.set).toHaveBeenCalled()
          const setArgs = (gsap.set as any).mock.calls[0]
          expect(setArgs[1]).toMatchObject({ y: 60, opacity: 0 })

          // gsap.to should animate to visible state
          expect(gsap.to).toHaveBeenCalled()
          const toArgs = (gsap.to as any).mock.calls[0]
          expect(toArgs[1]).toMatchObject({ y: 0, opacity: 1 })

          unmount()
        }
      ),
      { numRuns: 100 }
    )
  })

  // ─── Property 5.2: clip-reveal starts hidden ────────────────────────────────
  it('Property 5.2: clip-reveal - initial state has clipPath inset(0% 0% 100% 0%) for any options', () => {
    fc.assert(
      fc.property(
        fc.record({
          duration: fc.float({ min: Math.fround(0.1), max: Math.fround(3.0), noNaN: true }),
          start: fc.constantFrom('top 85%', 'top 80%', 'top 90%', 'top center'),
          ease: fc.constantFrom('power4.out', 'power2.out', 'expo.out'),
          once: fc.boolean(),
        }),
        (options) => {
          vi.clearAllMocks()

          const { container, unmount } = render(
            <TestComponent preset="clip-reveal" {...options} />
          )

          const element = container.querySelector('[data-testid="reveal-element"]') as HTMLElement
          expect(element).toBeTruthy()

          // gsap.set should have been called with the initial clipped (hidden) state
          expect(gsap.set).toHaveBeenCalled()
          const setArgs = (gsap.set as any).mock.calls[0]
          expect(setArgs[1]).toMatchObject({ clipPath: 'inset(0% 0% 100% 0%)' })

          // gsap.to should animate to fully visible state
          expect(gsap.to).toHaveBeenCalled()
          const toArgs = (gsap.to as any).mock.calls[0]
          expect(toArgs[1]).toMatchObject({ clipPath: 'inset(0% 0% 0% 0%)' })

          unmount()
        }
      ),
      { numRuns: 100 }
    )
  })

  // ─── Property 5.3: stagger children start hidden ────────────────────────────
  it('Property 5.3: stagger - all children start with opacity 0 and y: 60 for any options', () => {
    fc.assert(
      fc.property(
        fc.record({
          duration: fc.float({ min: Math.fround(0.1), max: Math.fround(3.0), noNaN: true }),
          staggerDelay: fc.float({ min: Math.fround(0.05), max: Math.fround(0.5), noNaN: true }),
          start: fc.constantFrom('top 85%', 'top 80%', 'top 90%'),
          ease: fc.constantFrom('power4.out', 'power2.out', 'expo.out'),
          once: fc.boolean(),
        }),
        (options) => {
          vi.clearAllMocks()

          const { container, unmount } = render(
            <TestComponent
              preset="stagger"
              staggerTargets=".stagger-child"
              {...options}
            />
          )

          const containerElement = container.querySelector('[data-testid="reveal-container"]') as HTMLElement
          const children = container.querySelectorAll('.stagger-child')

          expect(containerElement).toBeTruthy()
          expect(children.length).toBe(3)

          // gsap.set should have been called for stagger children with hidden state
          expect(gsap.set).toHaveBeenCalled()
          const setArgs = (gsap.set as any).mock.calls[0]
          expect(setArgs[1]).toMatchObject({ y: 60, opacity: 0 })

          // gsap.to should animate children to visible state with stagger
          expect(gsap.to).toHaveBeenCalled()
          const toArgs = (gsap.to as any).mock.calls[0]
          expect(toArgs[1]).toMatchObject({ y: 0, opacity: 1, stagger: options.staggerDelay })

          unmount()
        }
      ),
      { numRuns: 100 }
    )
  })

  // ─── Property 5.4: all presets always set a hidden initial state ─────────────
  it('Property 5.4: for any preset, gsap.set is always called before gsap.to (hidden before animated)', () => {
    fc.assert(
      fc.property(
        fc.record({
          preset: fc.constantFrom('fade-up' as const, 'clip-reveal' as const, 'stagger' as const),
          duration: fc.float({ min: Math.fround(0.1), max: Math.fround(3.0), noNaN: true }),
          start: fc.constantFrom('top 85%', 'top 80%', 'top 90%', 'top 70%'),
          ease: fc.constantFrom('power4.out', 'power2.out', 'expo.out'),
          once: fc.boolean(),
          staggerDelay: fc.float({ min: Math.fround(0.05), max: Math.fround(0.5), noNaN: true }),
        }),
        (options) => {
          vi.clearAllMocks()

          const setCallOrder: number[] = []
          const toCallOrder: number[] = []
          let callCounter = 0

          ;(gsap.set as any).mockImplementation(() => { setCallOrder.push(callCounter++) })
          ;(gsap.to as any).mockImplementation(() => { toCallOrder.push(callCounter++) })

          const props: TestComponentProps = {
            preset: options.preset,
            duration: options.duration,
            start: options.start,
            ease: options.ease,
            once: options.once,
          }

          if (options.preset === 'stagger') {
            props.staggerTargets = '.stagger-child'
            props.staggerDelay = options.staggerDelay
          }

          const { unmount } = render(<TestComponent {...props} />)

          // gsap.set (hidden state) must be called before gsap.to (animation to visible)
          expect(gsap.set).toHaveBeenCalled()
          expect(gsap.to).toHaveBeenCalled()

          // The set (hidden) call should come before the to (animate to visible) call
          const firstSetOrder = setCallOrder[0]
          const firstToOrder = toCallOrder[0]
          expect(firstSetOrder).toBeLessThan(firstToOrder)

          unmount()
        }
      ),
      { numRuns: 100 }
    )
  })

  // ─── Property 5.5: reduced motion skips hidden state, shows final state ──────
  it('Property 5.5: with prefers-reduced-motion, elements are set to visible immediately (no hidden state)', () => {
    fc.assert(
      fc.property(
        fc.constantFrom('fade-up' as const, 'clip-reveal' as const, 'stagger' as const),
        (preset) => {
          // Enable reduced motion for this test
          mockMatchMedia(true)
          vi.clearAllMocks()

          const props: TestComponentProps = { preset }
          if (preset === 'stagger') {
            props.staggerTargets = '.stagger-child'
          }

          const { unmount } = render(<TestComponent {...props} />)

          // With reduced motion: gsap.set should set FINAL (visible) state
          expect(gsap.set).toHaveBeenCalled()
          const setArgs = (gsap.set as any).mock.calls[0]

          if (preset === 'fade-up') {
            expect(setArgs[1]).toMatchObject({ y: 0, opacity: 1 })
          } else if (preset === 'clip-reveal') {
            expect(setArgs[1]).toMatchObject({ clipPath: 'inset(0% 0% 0% 0%)' })
          } else if (preset === 'stagger') {
            expect(setArgs[1]).toMatchObject({ y: 0, opacity: 1 })
          }

          // No animation should play (gsap.to must NOT be called)
          expect(gsap.to).not.toHaveBeenCalled()

          unmount()
        }
      ),
      { numRuns: 50 }
    )
  })
})


// ─── Property 12 ──────────────────────────────────────────────────────────────
// Feature: gsap-modern-portfolio, Property 12: All animations are suppressed under prefers-reduced-motion
// **Validates: Requirements 6.6, 12.1**

/**
 * Property-Based Test: Property 12
 *
 * All animations are suppressed under prefers-reduced-motion.
 *
 * For any animated element (text reveal, parallax, counter, cursor, stagger)
 * in the application, when `window.matchMedia('(prefers-reduced-motion: reduce)').matches`
 * is `true`, the element should be rendered at its final/visible state immediately —
 * with no `y`, `x`, `opacity`, `scale`, or `clipPath` motion transitions applied.
 *
 * Specifically for useScrollReveal:
 * - `gsap.set` is called with the final visible state (opacity 1, y 0, or open clipPath)
 * - `gsap.to` (which would create the scroll-driven animation) is NOT called
 * - No ScrollTrigger is created (the hook returns early after setting final state)
 */

describe('useScrollReveal - Property 12: All animations suppressed under prefers-reduced-motion', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    // Enable reduced motion for all tests in this block
    mockMatchMedia(true)
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  // ─── Property 12.1: fade-up is suppressed — shows final visible state immediately ─
  it('Property 12.1: fade-up preset — with prefers-reduced-motion, element is set to final visible state (y:0, opacity:1) for any valid options', () => {
    fc.assert(
      fc.property(
        fc.record({
          duration:  fc.float({ min: Math.fround(0.1), max: Math.fround(3.0), noNaN: true }),
          start:     fc.constantFrom('top 85%', 'top 80%', 'top 90%', 'top center', 'top 70%'),
          ease:      fc.constantFrom('power4.out', 'power2.out', 'expo.out', 'sine.out'),
          once:      fc.boolean(),
        }),
        (options) => {
          vi.clearAllMocks()
          mockMatchMedia(true)

          const { unmount } = render(
            <TestComponent preset="fade-up" {...options} />
          )

          // gsap.set MUST have been called (to set final state)
          expect(gsap.set).toHaveBeenCalled()

          // The first gsap.set call should set the FINAL visible state: y:0, opacity:1
          const setArgs = (gsap.set as any).mock.calls[0]
          expect(setArgs[1]).toMatchObject({ y: 0, opacity: 1 })

          // gsap.to must NOT be called — no scroll animation should run
          expect(gsap.to).not.toHaveBeenCalled()

          unmount()
        }
      ),
      { numRuns: 100 }
    )
  })

  // ─── Property 12.2: clip-reveal is suppressed — shows open clipPath immediately ─
  it('Property 12.2: clip-reveal preset — with prefers-reduced-motion, element is set to open clipPath immediately for any valid options', () => {
    fc.assert(
      fc.property(
        fc.record({
          duration:  fc.float({ min: Math.fround(0.1), max: Math.fround(3.0), noNaN: true }),
          start:     fc.constantFrom('top 85%', 'top 80%', 'top 90%', 'top center', 'top 70%'),
          ease:      fc.constantFrom('power4.out', 'power2.out', 'expo.out', 'sine.out'),
          once:      fc.boolean(),
        }),
        (options) => {
          vi.clearAllMocks()
          mockMatchMedia(true)

          const { unmount } = render(
            <TestComponent preset="clip-reveal" {...options} />
          )

          // gsap.set MUST have been called (to set final state)
          expect(gsap.set).toHaveBeenCalled()

          // The final state for clip-reveal is the fully open clipPath
          const setArgs = (gsap.set as any).mock.calls[0]
          expect(setArgs[1]).toMatchObject({ clipPath: 'inset(0% 0% 0% 0%)' })

          // gsap.to must NOT be called — no scroll animation should run
          expect(gsap.to).not.toHaveBeenCalled()

          unmount()
        }
      ),
      { numRuns: 100 }
    )
  })

  // ─── Property 12.3: stagger is suppressed — all children shown at final state ─
  it('Property 12.3: stagger preset — with prefers-reduced-motion, children set to final visible state (y:0, opacity:1) for any valid options', () => {
    fc.assert(
      fc.property(
        fc.record({
          duration:     fc.float({ min: Math.fround(0.1), max: Math.fround(3.0), noNaN: true }),
          staggerDelay: fc.float({ min: Math.fround(0.05), max: Math.fround(0.5), noNaN: true }),
          start:        fc.constantFrom('top 85%', 'top 80%', 'top 90%', 'top center'),
          ease:         fc.constantFrom('power4.out', 'power2.out', 'expo.out', 'sine.out'),
          once:         fc.boolean(),
        }),
        (options) => {
          vi.clearAllMocks()
          mockMatchMedia(true)

          const { unmount } = render(
            <TestComponent
              preset="stagger"
              staggerTargets=".stagger-child"
              {...options}
            />
          )

          // gsap.set MUST have been called for stagger children
          expect(gsap.set).toHaveBeenCalled()

          // The final state for stagger is y:0, opacity:1 (no staggerDelay since we're not animating)
          const setArgs = (gsap.set as any).mock.calls[0]
          expect(setArgs[1]).toMatchObject({ y: 0, opacity: 1 })

          // gsap.to must NOT be called — no stagger scroll animation should run
          expect(gsap.to).not.toHaveBeenCalled()

          unmount()
        }
      ),
      { numRuns: 100 }
    )
  })

  // ─── Property 12.4: all presets — no motion properties in the set call ────────
  it('Property 12.4: for any preset, the reduced-motion gsap.set call never includes motion transition props (y offset, x, scale, or closing clipPath)', () => {
    fc.assert(
      fc.property(
        fc.record({
          preset:       fc.constantFrom('fade-up' as const, 'clip-reveal' as const, 'stagger' as const),
          duration:     fc.float({ min: Math.fround(0.1), max: Math.fround(3.0), noNaN: true }),
          staggerDelay: fc.float({ min: Math.fround(0.05), max: Math.fround(0.5), noNaN: true }),
          start:        fc.constantFrom('top 85%', 'top 80%', 'top 90%', 'top 70%'),
          ease:         fc.constantFrom('power4.out', 'power2.out', 'expo.out'),
          once:         fc.boolean(),
        }),
        (options) => {
          vi.clearAllMocks()
          mockMatchMedia(true)

          const props: TestComponentProps = {
            preset:   options.preset,
            duration: options.duration,
            start:    options.start,
            ease:     options.ease,
            once:     options.once,
          }
          if (options.preset === 'stagger') {
            props.staggerTargets = '.stagger-child'
            props.staggerDelay   = options.staggerDelay
          }

          const { unmount } = render(<TestComponent {...props} />)

          // gsap.set must be called (to reveal elements)
          expect(gsap.set).toHaveBeenCalled()

          // The set call must NOT include motion-offset values that indicate hidden/transitioning state
          const setVars = (gsap.set as any).mock.calls[0][1] as Record<string, unknown>

          // y should never be non-zero (no vertical offset applied under reduced-motion)
          if ('y' in setVars) {
            expect(setVars.y).toBe(0)
          }
          // x should never be non-zero
          if ('x' in setVars) {
            expect(setVars.x).toBe(0)
          }
          // opacity, if present, must be 1 (fully visible)
          if ('opacity' in setVars) {
            expect(setVars.opacity).toBe(1)
          }
          // clipPath, if present, must be the fully-open value (not a closing/hidden variant)
          if ('clipPath' in setVars) {
            expect(setVars.clipPath).toBe('inset(0% 0% 0% 0%)')
          }
          // scale, if present, must be 1
          if ('scale' in setVars) {
            expect(setVars.scale).toBe(1)
          }

          // No animation should be created regardless of preset
          expect(gsap.to).not.toHaveBeenCalled()

          unmount()
        }
      ),
      { numRuns: 100 }
    )
  })

  // ─── Property 12.5: reduced-motion true vs false — gsap.to call count invariant ─
  it('Property 12.5: for any preset and options, gsap.to is called when reduced-motion is OFF but never when it is ON', () => {
    fc.assert(
      fc.property(
        fc.record({
          preset: fc.constantFrom('fade-up' as const, 'clip-reveal' as const, 'stagger' as const),
          duration: fc.float({ min: Math.fround(0.1), max: Math.fround(3.0), noNaN: true }),
          start:    fc.constantFrom('top 85%', 'top 80%', 'top 90%'),
          ease:     fc.constantFrom('power4.out', 'power2.out', 'expo.out'),
          once:     fc.boolean(),
        }),
        (options) => {
          const props: TestComponentProps = {
            preset:   options.preset,
            duration: options.duration,
            start:    options.start,
            ease:     options.ease,
            once:     options.once,
          }
          if (options.preset === 'stagger') {
            props.staggerTargets = '.stagger-child'
          }

          // ── Test with reduced-motion ON ──────────────────────────────────────
          vi.clearAllMocks()
          mockMatchMedia(true)

          const { unmount: unmount1 } = render(<TestComponent {...props} />)
          const toCallsWithReducedMotion = (gsap.to as any).mock.calls.length
          expect(toCallsWithReducedMotion).toBe(0) // NO animation created
          unmount1()

          // ── Test with reduced-motion OFF ─────────────────────────────────────
          vi.clearAllMocks()
          mockMatchMedia(false)

          const { unmount: unmount2 } = render(<TestComponent {...props} />)
          const toCallsWithoutReducedMotion = (gsap.to as any).mock.calls.length
          expect(toCallsWithoutReducedMotion).toBeGreaterThan(0) // Animation IS created
          unmount2()
        }
      ),
      { numRuns: 100 }
    )
  })
})

// ─── Property 6: Scroll reveal hook cleans up on unmount ──────────────────────
// Feature: gsap-modern-portfolio, Property 6: Scroll reveal hook cleans up on unmount
// **Validates: Requirements 6.4, 12.5**

/**
 * Property-Based Test for useScrollReveal Hook
 *
 * Property 6: Scroll reveal hook cleans up on unmount
 *
 * For any component using `useScrollReveal`, when that component is unmounted,
 * the associated GSAP context should be reverted (`ctx.revert()`) and the
 * ScrollTrigger should be killed, restoring all animated elements to their
 * pre-animation state.
 *
 * This prevents memory leaks from lingering GSAP contexts and ScrollTriggers.
 */

describe('useScrollReveal - Property 6: Cleanup on unmount', () => {
  // We need a fresh per-test revert spy because each gsap.context() call
  // creates a new context object. The mock in this file returns a new object
  // with its own `revert` spy each invocation, so we capture it here.

  beforeEach(() => {
    vi.clearAllMocks()
    mockMatchMedia(false)
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  // ─── Property 6.1: ctx.revert() is called on unmount for any preset ─────────
  it('Property 6.1: ctx.revert() is called exactly once when component unmounts, for any preset and options', () => {
    fc.assert(
      fc.property(
        fc.record({
          preset: fc.constantFrom('fade-up' as const, 'clip-reveal' as const, 'stagger' as const),
          duration: fc.float({ min: Math.fround(0.1), max: Math.fround(3.0), noNaN: true }),
          start: fc.constantFrom('top 85%', 'top 80%', 'top 90%', 'top center'),
          ease: fc.constantFrom('power4.out', 'power2.out', 'expo.out'),
          once: fc.boolean(),
          staggerDelay: fc.float({ min: Math.fround(0.05), max: Math.fround(0.5), noNaN: true }),
        }),
        (options) => {
          vi.clearAllMocks()

          // Track the revert spy for the context created in this render
          const revertSpy = vi.fn()
          ;(gsap.context as any).mockImplementation((fn: () => void) => {
            fn()
            return { revert: revertSpy }
          })

          const props: TestComponentProps = {
            preset: options.preset,
            duration: options.duration,
            start: options.start,
            ease: options.ease,
            once: options.once,
          }
          if (options.preset === 'stagger') {
            props.staggerTargets = '.stagger-child'
            props.staggerDelay = options.staggerDelay
          }

          const { unmount } = render(<TestComponent {...props} />)

          // Before unmount: revert must not have been called yet
          expect(revertSpy).not.toHaveBeenCalled()

          // After unmount: revert must be called exactly once
          unmount()
          expect(revertSpy).toHaveBeenCalledTimes(1)
        }
      ),
      { numRuns: 100 }
    )
  })

  // ─── Property 6.2: ctx.revert() is called on unmount even with reduced motion ─
  it('Property 6.2: ctx.revert() is called on unmount when prefers-reduced-motion is active', () => {
    fc.assert(
      fc.property(
        fc.record({
          preset: fc.constantFrom('fade-up' as const, 'clip-reveal' as const, 'stagger' as const),
          duration: fc.float({ min: Math.fround(0.1), max: Math.fround(3.0), noNaN: true }),
          once: fc.boolean(),
        }),
        (options) => {
          // Enable reduced motion for this test
          mockMatchMedia(true)
          vi.clearAllMocks()

          const revertSpy = vi.fn()
          ;(gsap.context as any).mockImplementation((fn: () => void) => {
            fn()
            return { revert: revertSpy }
          })

          const props: TestComponentProps = {
            preset: options.preset,
            duration: options.duration,
            once: options.once,
          }
          if (options.preset === 'stagger') {
            props.staggerTargets = '.stagger-child'
          }

          const { unmount } = render(<TestComponent {...props} />)

          expect(revertSpy).not.toHaveBeenCalled()

          unmount()
          expect(revertSpy).toHaveBeenCalledTimes(1)
        }
      ),
      { numRuns: 50 }
    )
  })

  // ─── Property 6.3: gsap.context() is always called (scope-wrapping invariant) ─
  it('Property 6.3: gsap.context() is called exactly once per mount for any valid options', () => {
    fc.assert(
      fc.property(
        fc.record({
          preset: fc.constantFrom('fade-up' as const, 'clip-reveal' as const, 'stagger' as const),
          duration: fc.float({ min: Math.fround(0.1), max: Math.fround(3.0), noNaN: true }),
          start: fc.constantFrom('top 85%', 'top 80%', 'top 90%', 'top center'),
          ease: fc.constantFrom('power4.out', 'power2.out', 'expo.out'),
          once: fc.boolean(),
          reducedMotion: fc.boolean(),
        }),
        (options) => {
          mockMatchMedia(options.reducedMotion)
          vi.clearAllMocks()

          const props: TestComponentProps = {
            preset: options.preset,
            duration: options.duration,
            start: options.start,
            ease: options.ease,
            once: options.once,
          }
          if (options.preset === 'stagger') {
            props.staggerTargets = '.stagger-child'
          }

          const { unmount } = render(<TestComponent {...props} />)

          // gsap.context() must be called exactly once on mount
          expect(gsap.context).toHaveBeenCalledTimes(1)

          unmount()
        }
      ),
      { numRuns: 100 }
    )
  })

  // ─── Property 6.4: revert is not called multiple times on a single unmount ───
  it('Property 6.4: ctx.revert() is never called more than once per unmount lifecycle', () => {
    fc.assert(
      fc.property(
        fc.record({
          preset: fc.constantFrom('fade-up' as const, 'clip-reveal' as const),
          duration: fc.float({ min: Math.fround(0.1), max: Math.fround(3.0), noNaN: true }),
          once: fc.boolean(),
        }),
        (options) => {
          vi.clearAllMocks()

          const revertSpy = vi.fn()
          ;(gsap.context as any).mockImplementation((fn: () => void) => {
            fn()
            return { revert: revertSpy }
          })

          const { unmount } = render(
            <TestComponent
              preset={options.preset}
              duration={options.duration}
              once={options.once}
            />
          )

          unmount()

          // Revert must be called exactly once, not multiple times
          expect(revertSpy.mock.calls.length).toBe(1)
        }
      ),
      { numRuns: 100 }
    )
  })

  // ─── Property 6.5: remount creates a fresh context and cleans up independently ─
  it('Property 6.5: each mount/unmount cycle creates its own context that is independently reverted', () => {
    fc.assert(
      fc.property(
        fc.record({
          preset: fc.constantFrom('fade-up' as const, 'clip-reveal' as const),
          mountCount: fc.integer({ min: 1, max: 5 }),
        }),
        (options) => {
          vi.clearAllMocks()

          const revertSpies: ReturnType<typeof vi.fn>[] = []

          ;(gsap.context as any).mockImplementation((fn: () => void) => {
            fn()
            const spy = vi.fn()
            revertSpies.push(spy)
            return { revert: spy }
          })

          // Mount and unmount multiple times
          for (let i = 0; i < options.mountCount; i++) {
            const { unmount } = render(
              <TestComponent preset={options.preset} />
            )
            unmount()
          }

          // Number of contexts created equals number of mount cycles
          expect(revertSpies.length).toBe(options.mountCount)

          // Each context's revert was called exactly once
          for (const spy of revertSpies) {
            expect(spy).toHaveBeenCalledTimes(1)
          }
        }
      ),
      { numRuns: 50 }
    )
  })
})
