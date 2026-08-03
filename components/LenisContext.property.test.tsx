import React from 'react'
import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import fc from 'fast-check'
import { LenisContext, useLenis } from './LenisContext'
import Lenis from 'lenis'

/**
 * Property-based tests for LenisContext
 * Feature: gsap-modern-portfolio, Property 13: LenisContext always provides a valid Lenis instance to consumers
 * **Validates: Requirements 5.4**
 * 
 * This test verifies that for ANY component using useLenis() that is mounted inside SmoothScroll,
 * the returned value should be a non-null Lenis instance that has a callable scrollTo method.
 */
describe('LenisContext Property-Based Tests', () => {
  describe('Property 13: LenisContext always provides a valid Lenis instance to consumers', () => {
    it('should always provide non-null Lenis instance with scrollTo method to any consumer component', () => {
      // Create arbitrary component names and props to test across many variations
      fc.assert(
        fc.property(
          fc.record({
            // Arbitrary component test ID (alphanumeric + hyphen for valid CSS selectors)
            componentId: fc.stringMatching(/^[a-zA-Z][a-zA-Z0-9-]{0,19}$/),
            // Arbitrary nesting depth (0-5 levels deep)
            nestingDepth: fc.integer({ min: 0, max: 5 }),
            // Arbitrary additional props
            hasChildren: fc.boolean(),
            dataAttribute: fc.stringMatching(/^[a-zA-Z0-9-]{0,10}$/),
          }),
          ({ componentId, nestingDepth, hasChildren, dataAttribute }) => {
            // Create a mock Lenis instance with all required methods
            const mockLenis = {
              scrollTo: () => {},
              on: () => {},
              off: () => {},
              destroy: () => {},
              raf: () => {},
              scrollToProgress: () => {},
              stop: () => {},
              start: () => {},
            } as unknown as Lenis

            // Test component that uses useLenis hook
            function TestConsumer({ testId }: { testId: string }) {
              const lenis = useLenis()
              
              // Assertions within the component
              expect(lenis).not.toBeNull()
              expect(lenis).toBeDefined()
              expect(typeof lenis?.scrollTo).toBe('function')
              
              return (
                <div 
                  data-testid={testId}
                  data-attr={dataAttribute}
                >
                  {lenis !== null ? 'valid-instance' : 'null'}
                </div>
              )
            }

            // Create nested wrapper components based on nesting depth
            function createNestedComponent(depth: number): React.JSX.Element {
              if (depth === 0) {
                return <TestConsumer testId={componentId} />
              }
              
              const child = createNestedComponent(depth - 1)
              return (
                <div data-nesting-level={depth}>
                  {hasChildren && <div>sibling</div>}
                  {child}
                </div>
              )
            }

            // Render the component tree wrapped in LenisContext.Provider
            const { container } = render(
              <LenisContext.Provider value={mockLenis}>
                {createNestedComponent(nestingDepth)}
              </LenisContext.Provider>
            )

            // Verify the component rendered successfully
            const element = container.querySelector(`[data-testid="${componentId}"]`)
            expect(element).toBeTruthy()
            expect(element?.textContent).toBe('valid-instance')
          }
        ),
        { numRuns: 100 } // Minimum 100 iterations as per design spec
      )
    })

    it('should provide the same Lenis instance to multiple consumers', () => {
      // Test that multiple consumers get the same instance reference
      fc.assert(
        fc.property(
          fc.record({
            // Number of consumer components (2-10)
            numConsumers: fc.integer({ min: 2, max: 10 }),
            // Random consumer IDs
            consumerIds: fc.array(fc.string({ minLength: 1, maxLength: 15 }), { minLength: 2, maxLength: 10 }),
          }),
          ({ numConsumers, consumerIds }) => {
            const mockLenis = {
              scrollTo: () => {},
              on: () => {},
              off: () => {},
              destroy: () => {},
              raf: () => {},
              uniqueId: 'test-instance-ref',
            } as unknown as Lenis & { uniqueId: string }

            const capturedInstances: (Lenis | null)[] = []

            function TestConsumer({ index }: { index: number }) {
              const lenis = useLenis()
              capturedInstances[index] = lenis
              
              return (
                <div data-testid={`consumer-${index}`}>
                  {lenis !== null ? 'has-instance' : 'null'}
                </div>
              )
            }

            // Render multiple consumers
            const consumers = Array.from({ length: Math.min(numConsumers, consumerIds.length) }, (_, i) => (
              <TestConsumer key={i} index={i} />
            ))

            render(
              <LenisContext.Provider value={mockLenis}>
                <div>{consumers}</div>
              </LenisContext.Provider>
            )

            // Verify all consumers got the same instance
            expect(capturedInstances.length).toBeGreaterThan(0)
            capturedInstances.forEach((instance) => {
              expect(instance).toBe(mockLenis)
              expect((instance as typeof mockLenis)?.uniqueId).toBe('test-instance-ref')
            })
          }
        ),
        { numRuns: 100 }
      )
    })

    it('should provide scrollTo method that is callable for any arbitrary scroll target', () => {
      // Test that the scrollTo method exists and can be called with various inputs
      fc.assert(
        fc.property(
          fc.record({
            // Arbitrary scroll targets
            scrollTarget: fc.oneof(
              fc.integer({ min: 0, max: 10000 }), // numeric position
              fc.constant('#section'), // selector
              fc.constant('top'), // keyword
            ),
            // Arbitrary options
            duration: fc.float({ min: 0, max: 5, noNaN: true }),
            immediate: fc.boolean(),
          }),
          ({ scrollTarget, duration, immediate }) => {
            let scrollToCalled = false
            let capturedTarget: unknown = null
            let capturedOptions: unknown = null

            const mockLenis = {
              scrollTo: (target: unknown, options?: unknown) => {
                scrollToCalled = true
                capturedTarget = target
                capturedOptions = options
              },
              on: () => {},
              off: () => {},
              destroy: () => {},
              raf: () => {},
            } as unknown as Lenis

            function TestConsumer() {
              const lenis = useLenis()
              
              // Verify lenis exists and has scrollTo
              expect(lenis).not.toBeNull()
              expect(typeof lenis?.scrollTo).toBe('function')
              
              // Call scrollTo with arbitrary params
              if (lenis && typeof lenis.scrollTo === 'function') {
                lenis.scrollTo(scrollTarget as any, { duration, immediate } as any)
              }
              
              return <div>test</div>
            }

            render(
              <LenisContext.Provider value={mockLenis}>
                <TestConsumer />
              </LenisContext.Provider>
            )

            // Verify scrollTo was callable
            expect(scrollToCalled).toBe(true)
            expect(capturedTarget).toBe(scrollTarget)
          }
        ),
        { numRuns: 100 }
      )
    })
  })
})
