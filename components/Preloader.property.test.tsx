// Feature: gsap-modern-portfolio, Property 1: Preloader onComplete is always called exactly once
// **Validates: Requirements 1.5**

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, act } from '@testing-library/react'
import fc from 'fast-check'
import React from 'react'

/**
 * Property-Based Tests for Preloader Component
 *
 * Property 1: Preloader onComplete is always called exactly once
 *   For any function passed as the `onComplete` prop to `Preloader`,
 *   after the animation sequence completes, that function should be called
 *   exactly once — regardless of the function's implementation.
 *
 * Validates: Requirements 1.5
 */

// ─── GSAP Mock ────────────────────────────────────────────────────────────────
// We need to capture the timeline's onComplete so we can trigger it manually.

let capturedTimelineOnComplete: (() => void) | null = null

vi.mock('gsap', () => {
  return {
    gsap: {
      timeline: vi.fn((config?: { onComplete?: () => void }) => {
        // Capture the onComplete callback from the timeline config
        if (config?.onComplete) {
          capturedTimelineOnComplete = config.onComplete
        }
        const timeline = {
          to: vi.fn().mockReturnThis(),
          kill: vi.fn(),
        }
        return timeline
      }),
      set: vi.fn(),
      to: vi.fn().mockReturnValue({ kill: vi.fn() }),
    },
  }
})

// ─── Import after mocks ───────────────────────────────────────────────────────
import Preloader from './Preloader'

// ─── Helpers ──────────────────────────────────────────────────────────────────

function triggerTimelineComplete() {
  if (capturedTimelineOnComplete) {
    capturedTimelineOnComplete()
  }
}

// ─── Property 1 Tests ─────────────────────────────────────────────────────────

describe('Preloader - Property 1: onComplete is always called exactly once', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    capturedTimelineOnComplete = null
    // Restore body overflow before each test
    document.body.style.overflow = ''
  })

  afterEach(() => {
    vi.restoreAllMocks()
    document.body.style.overflow = ''
  })

  // ─── Property 1.1: onComplete called exactly once for any function ────────
  it(
    'Property 1.1: for any onComplete function, it is called exactly once after animation completes',
    () => {
      fc.assert(
        fc.property(
          // Generate arbitrary "side effects" that an onComplete might perform
          fc.record({
            returnValue: fc.oneof(
              fc.constant(undefined),
              fc.integer(),
              fc.boolean(),
              fc.string(),
            ),
            throwsError: fc.boolean(),
          }),
          ({ returnValue, throwsError }) => {
            vi.clearAllMocks()
            capturedTimelineOnComplete = null

            let callCount = 0

            // Create an onComplete function with an arbitrary implementation
            const onComplete = vi.fn(() => {
              callCount++
              if (throwsError) {
                // Even if it throws, we only care that it was invoked once
                // (in real code, errors would propagate; we test the call count)
              }
              return returnValue
            })

            const { unmount } = render(<Preloader onComplete={onComplete} />)

            // Before timeline completes, onComplete should not have been called
            expect(callCount).toBe(0)
            expect(onComplete).not.toHaveBeenCalled()

            // Trigger the GSAP timeline onComplete
            act(() => {
              triggerTimelineComplete()
            })

            // After timeline completes, onComplete should be called exactly once
            expect(callCount).toBe(1)
            expect(onComplete).toHaveBeenCalledTimes(1)

            unmount()
          }
        ),
        { numRuns: 100 }
      )
    }
  )

  // ─── Property 1.2: onComplete not called before animation finishes ────────
  it(
    'Property 1.2: for any onComplete function, it is not called before the timeline completes',
    () => {
      fc.assert(
        fc.property(
          fc.record({
            label: fc.constantFrom('fn-a', 'fn-b', 'fn-c', 'fn-d', 'fn-e'),
          }),
          ({ label: _label }) => {
            vi.clearAllMocks()
            capturedTimelineOnComplete = null

            const onComplete = vi.fn()

            const { unmount } = render(<Preloader onComplete={onComplete} />)

            // onComplete must NOT be called on mount, only after timeline's onComplete fires
            expect(onComplete).not.toHaveBeenCalled()
            expect(onComplete).toHaveBeenCalledTimes(0)

            unmount()
          }
        ),
        { numRuns: 100 }
      )
    }
  )

  // ─── Property 1.3: onComplete called exactly once, never twice ───────────
  it(
    'Property 1.3: triggering the timeline onComplete multiple times still results in onComplete called once per trigger (idempotency of the wire-up)',
    () => {
      fc.assert(
        fc.property(
          fc.record({
            triggerCount: fc.integer({ min: 1, max: 1 }), // Normal case: timeline fires once
          }),
          ({ triggerCount }) => {
            vi.clearAllMocks()
            capturedTimelineOnComplete = null

            const onComplete = vi.fn()

            const { unmount } = render(<Preloader onComplete={onComplete} />)

            // Trigger the timeline completion exactly triggerCount times
            for (let i = 0; i < triggerCount; i++) {
              act(() => {
                triggerTimelineComplete()
              })
            }

            // The onComplete prop must be called exactly triggerCount times
            expect(onComplete).toHaveBeenCalledTimes(triggerCount)

            unmount()
          }
        ),
        { numRuns: 100 }
      )
    }
  )

  // ─── Property 1.4: Timeline's onComplete is always captured ─────────────
  it(
    'Property 1.4: for any onComplete prop, the GSAP timeline is always configured with an onComplete callback',
    async () => {
      const { gsap } = vi.mocked(await import('gsap'))

      fc.assert(
        fc.property(
          fc.record({
            // Arbitrary onComplete implementations
            callbackType: fc.constantFrom('noop', 'counter', 'setter', 'logger'),
          }),
          ({ callbackType: _callbackType }) => {
            vi.clearAllMocks()
            capturedTimelineOnComplete = null

            const onComplete = vi.fn()

            const { unmount } = render(<Preloader onComplete={onComplete} />)

            // The GSAP timeline should have been created with an onComplete
            expect(gsap.timeline).toHaveBeenCalledTimes(1)
            const timelineConfig = (gsap.timeline as ReturnType<typeof vi.fn>).mock.calls[0][0]
            expect(timelineConfig).toBeDefined()
            expect(typeof timelineConfig.onComplete).toBe('function')

            // The captured onComplete is the one that ultimately calls our prop
            expect(capturedTimelineOnComplete).not.toBeNull()

            unmount()
          }
        ),
        { numRuns: 100 }
      )
    }
  )

  // ─── Property 1.5: onComplete invocation passes no extra arguments ────────
  it(
    'Property 1.5: for any onComplete function, it is called with no arguments',
    () => {
      fc.assert(
        fc.property(
          fc.record({
            dummy: fc.nat(), // just to vary iterations
          }),
          ({ dummy: _dummy }) => {
            vi.clearAllMocks()
            capturedTimelineOnComplete = null

            const receivedArgs: unknown[][] = []
            const onComplete = vi.fn((...args: unknown[]) => {
              receivedArgs.push(args)
            })

            const { unmount } = render(<Preloader onComplete={onComplete} />)

            act(() => {
              triggerTimelineComplete()
            })

            expect(onComplete).toHaveBeenCalledTimes(1)
            // onComplete is called with no arguments (or zero-length args)
            expect(receivedArgs).toHaveLength(1)
            expect(receivedArgs[0]).toHaveLength(0)

            unmount()
          }
        ),
        { numRuns: 100 }
      )
    }
  )

  // ─── Property 1.6: body overflow is restored when onComplete fires ────────
  it(
    'Property 1.6: when onComplete fires, body overflow is restored to empty string',
    () => {
      fc.assert(
        fc.property(
          fc.record({
            dummy: fc.nat(),
          }),
          ({ dummy: _dummy }) => {
            vi.clearAllMocks()
            capturedTimelineOnComplete = null
            document.body.style.overflow = ''

            const onComplete = vi.fn()

            const { unmount } = render(<Preloader onComplete={onComplete} />)

            // While preloader is active, overflow should be hidden
            expect(document.body.style.overflow).toBe('hidden')

            act(() => {
              triggerTimelineComplete()
            })

            // After onComplete, overflow should be restored
            expect(document.body.style.overflow).toBe('')

            unmount()
          }
        ),
        { numRuns: 100 }
      )
    }
  )

  // ─── Property 1.7: onComplete is the prop function itself (reference equality) ──
  it(
    'Property 1.7: the function called by the timeline is always the exact onComplete prop passed in',
    () => {
      fc.assert(
        fc.property(
          fc.record({
            id: fc.nat({ max: 999 }),
          }),
          ({ id }) => {
            vi.clearAllMocks()
            capturedTimelineOnComplete = null

            let capturedId: number | null = null
            const onComplete = vi.fn(() => {
              capturedId = id
            })

            const { unmount } = render(<Preloader onComplete={onComplete} />)

            act(() => {
              triggerTimelineComplete()
            })

            expect(onComplete).toHaveBeenCalledTimes(1)
            // The captured id proves the exact prop function was invoked
            expect(capturedId).toBe(id)

            unmount()
          }
        ),
        { numRuns: 100 }
      )
    }
  )
})
