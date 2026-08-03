import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { LenisContext, useLenis } from './LenisContext'
import Lenis from 'lenis'

/**
 * Unit tests for LenisContext
 * **Validates: Requirements 5.4**
 * 
 * Tests that the LenisContext provides correct behavior:
 * - useLenis() returns null when used outside provider
 * - useLenis() returns Lenis instance when used inside provider
 */
describe('LenisContext', () => {
  describe('useLenis hook', () => {
    it('returns null when used outside LenisContext.Provider', () => {
      // Test component that uses the hook outside provider
      function TestComponent() {
        const lenis = useLenis()
        return <div data-testid="result">{lenis === null ? 'null' : 'not-null'}</div>
      }

      render(<TestComponent />)
      
      const result = screen.getByTestId('result')
      expect(result).toHaveTextContent('null')
    })

    it('returns Lenis instance when used inside LenisContext.Provider', () => {
      // Create a mock Lenis instance
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

      // Test component that uses the hook inside provider
      function TestComponent() {
        const lenis = useLenis()
        return (
          <div data-testid="result">
            {lenis !== null ? 'has-lenis-instance' : 'null'}
          </div>
        )
      }

      render(
        <LenisContext.Provider value={mockLenis}>
          <TestComponent />
        </LenisContext.Provider>
      )

      const result = screen.getByTestId('result')
      expect(result).toHaveTextContent('has-lenis-instance')
    })

    it('returns the exact Lenis instance provided by the provider', () => {
      // Create a mock Lenis instance with a unique identifier
      const mockLenis = {
        scrollTo: () => {},
        on: () => {},
        off: () => {},
        destroy: () => {},
        raf: () => {},
        uniqueId: 'test-lenis-instance',
      } as unknown as Lenis & { uniqueId: string }

      // Test component that extracts and verifies the instance
      function TestComponent() {
        const lenis = useLenis() as typeof mockLenis | null
        return (
          <div data-testid="result">
            {lenis?.uniqueId || 'no-id'}
          </div>
        )
      }

      render(
        <LenisContext.Provider value={mockLenis}>
          <TestComponent />
        </LenisContext.Provider>
      )

      const result = screen.getByTestId('result')
      expect(result).toHaveTextContent('test-lenis-instance')
    })
  })
})
