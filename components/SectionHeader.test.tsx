/**
 * Unit Tests for SectionHeader
 * **Validates: Requirements 10.5**
 *
 * Requirement 10.5:
 *   THE SectionHeader SHALL menampilkan nomor section (01, 02, 03…) dalam tipografi
 *   `clamp(0.65rem, 1vw, 0.8rem)` huruf kapital `letter-spacing: 0.15em` sebagai
 *   super-label di atas judul section.
 *
 * Tests cover:
 *   1. `number` prop renders correctly (e.g. "01" appears in DOM)
 *   2. Without `number` prop, the number label is absent
 *   3. The `title` prop always renders in an <h2> element
 *   4. Optional `label` prop renders correctly when provided
 *   5. Optional `description` prop renders correctly when provided
 */

import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import SectionHeader from './SectionHeader'

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
// SectionHeader uses useScrollReveal which internally imports gsap and ScrollTrigger.
// We mock them to prevent errors in the jsdom environment.

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

// ─── Tests ────────────────────────────────────────────────────────────────────

describe('SectionHeader', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  // ─── 1. number prop renders correctly ──────────────────────────────────────
  describe('number prop', () => {
    it('renders the number label when the number prop is provided', () => {
      render(<SectionHeader title="My Section" number="01" />)

      // The number "01" should be visible in the DOM
      expect(screen.getByText('01')).toBeInTheDocument()
    })

    it('renders number "02" correctly', () => {
      render(<SectionHeader title="Projects" number="02" />)

      expect(screen.getByText('02')).toBeInTheDocument()
    })

    it('renders number "03" correctly', () => {
      render(<SectionHeader title="Experience" number="03" />)

      expect(screen.getByText('03')).toBeInTheDocument()
    })

    it('number label renders as a <span> element', () => {
      render(<SectionHeader title="My Section" number="01" />)

      const numberEl = screen.getByText('01')
      expect(numberEl.tagName).toBe('SPAN')
    })

    it('number label has correct letter-spacing style (0.15em)', () => {
      render(<SectionHeader title="My Section" number="01" />)

      const numberEl = screen.getByText('01')
      expect(numberEl).toHaveStyle({ letterSpacing: '0.15em' })
    })

    it('number label has uppercase text transform', () => {
      render(<SectionHeader title="My Section" number="01" />)

      const numberEl = screen.getByText('01')
      expect(numberEl).toHaveStyle({ textTransform: 'uppercase' })
    })

    it('number label is displayed as a block element', () => {
      render(<SectionHeader title="My Section" number="01" />)

      const numberEl = screen.getByText('01')
      expect(numberEl).toHaveStyle({ display: 'block' })
    })

    it('number label appears before the title heading in the DOM', () => {
      const { container } = render(
        <SectionHeader title="My Section" number="01" />
      )

      const span = container.querySelector('span')
      const h2 = container.querySelector('h2')

      expect(span).not.toBeNull()
      expect(h2).not.toBeNull()

      // span should come before h2 in document order
      const position = span!.compareDocumentPosition(h2!)
      // DOCUMENT_POSITION_FOLLOWING = 4 (h2 comes after span)
      expect(position & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy()
    })
  })

  // ─── 2. Without number prop, the number label is absent ────────────────────
  describe('without number prop', () => {
    it('does not render a number label when number prop is omitted', () => {
      render(<SectionHeader title="My Section" />)

      // There should be no <span> element for the number label
      // (the component only renders a <span> for the number)
      const spans = document.querySelectorAll('span')
      expect(spans.length).toBe(0)
    })

    it('does not render number "01" text when number prop is not provided', () => {
      render(<SectionHeader title="My Section" />)

      expect(screen.queryByText('01')).not.toBeInTheDocument()
    })

    it('renders fine without any optional props', () => {
      // Should not throw and should render the title
      render(<SectionHeader title="My Section" />)
      expect(screen.getByRole('heading', { level: 2 })).toBeInTheDocument()
    })
  })

  // ─── 3. title prop renders in an <h2> element ──────────────────────────────
  describe('title prop', () => {
    it('renders the title in an <h2> element', () => {
      render(<SectionHeader title="About Me" />)

      const heading = screen.getByRole('heading', { level: 2 })
      expect(heading).toBeInTheDocument()
      expect(heading).toHaveTextContent('About Me')
    })

    it('title is always in <h2> even when other props are present', () => {
      render(
        <SectionHeader
          title="My Projects"
          number="02"
          label="Work"
          description="A collection of my best work."
        />
      )

      const heading = screen.getByRole('heading', { level: 2 })
      expect(heading.tagName).toBe('H2')
      expect(heading).toHaveTextContent('My Projects')
    })

    it('title heading has font-bold class', () => {
      render(<SectionHeader title="About Me" />)

      const heading = screen.getByRole('heading', { level: 2 })
      expect(heading).toHaveClass('font-bold')
    })
  })

  // ─── 4. Optional label prop ────────────────────────────────────────────────
  describe('label prop', () => {
    it('renders the label text when label prop is provided', () => {
      render(<SectionHeader title="My Section" label="Featured" />)

      expect(screen.getByText('Featured')).toBeInTheDocument()
    })

    it('does not render label paragraph when label prop is omitted', () => {
      render(<SectionHeader title="My Section" />)

      // section-label class is only applied to the label paragraph
      expect(document.querySelector('.section-label')).not.toBeInTheDocument()
    })

    it('label renders with section-label class', () => {
      render(<SectionHeader title="My Section" label="Work" />)

      const labelEl = screen.getByText('Work')
      expect(labelEl).toHaveClass('section-label')
    })
  })

  // ─── 5. Optional description prop ─────────────────────────────────────────
  describe('description prop', () => {
    it('renders the description text when description prop is provided', () => {
      render(
        <SectionHeader
          title="My Section"
          description="This is a description of the section."
        />
      )

      expect(
        screen.getByText('This is a description of the section.')
      ).toBeInTheDocument()
    })

    it('does not render description paragraph when description prop is omitted', () => {
      render(<SectionHeader title="My Section" />)

      // description-muted class is only applied to the description paragraph
      expect(
        document.querySelector('.description-muted')
      ).not.toBeInTheDocument()
    })

    it('description renders as a <p> element', () => {
      render(
        <SectionHeader title="My Section" description="Some description text." />
      )

      const descEl = screen.getByText('Some description text.')
      expect(descEl.tagName).toBe('P')
    })
  })

  // ─── 6. Combined: number + all optional props ──────────────────────────────
  describe('all props together', () => {
    it('renders number, label, title and description correctly when all props are provided', () => {
      render(
        <SectionHeader
          number="01"
          label="Portfolio"
          title="Selected Work"
          description="A curated selection of recent projects."
        />
      )

      expect(screen.getByText('01')).toBeInTheDocument()
      expect(screen.getByText('Portfolio')).toBeInTheDocument()
      expect(
        screen.getByRole('heading', { level: 2, name: 'Selected Work' })
      ).toBeInTheDocument()
      expect(
        screen.getByText('A curated selection of recent projects.')
      ).toBeInTheDocument()
    })
  })
})
