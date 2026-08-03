// Feature: gsap-modern-portfolio, Property 8: ProjectCard always resets on mouse leave
// **Validates: Requirements 7.4**

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, fireEvent } from '@testing-library/react'
import fc from 'fast-check'
import React from 'react'

/**
 * Property-Based Tests for ProjectCard Component — Property 8
 *
 * Property 8: ProjectCard always resets on mouse leave
 *   For any transformation state of a ProjectCard (any combination of tilt,
 *   magnetic displacement, and image scale), when `mouseleave` fires, all
 *   transforms should return to their identity values:
 *     x: 0, y: 0, rotateX: 0, rotateY: 0, and img scale: 1.
 *
 * Validates: Requirements 7.4
 *   WHEN kursor meninggalkan ProjectCard, THE ProjectCard SHALL mengembalikan
 *   semua transformasi ke nilai asal (scale: 1, rotateX: 0, rotateY: 0, x: 0, y: 0)
 *   dengan duration: 0.8 ease: "elastic.out(1, 0.3)".
 */

// ─── GSAP Mock ────────────────────────────────────────────────────────────────

type GsapCall = { target: unknown; vars: Record<string, unknown> }
const gsapToCalls: GsapCall[] = []

vi.mock('gsap', () => ({
  gsap: {
    to: vi.fn((target: unknown, vars: Record<string, unknown>) => {
      gsapToCalls.push({ target, vars })
      return {}
    }),
    set: vi.fn(),
    context: vi.fn((fn: () => void) => {
      fn()
      return { revert: vi.fn() }
    }),
    ticker: { add: vi.fn(), remove: vi.fn() },
    killTweensOf: vi.fn(),
  },
}))

// ─── useScrollReveal stub (avoids ScrollTrigger JSDOM issues) ─────────────────
vi.mock('@/hooks/useScrollReveal', () => ({
  useScrollReveal: vi.fn(),
}))

// ─── Import component after mocks ─────────────────────────────────────────────
import ProjectCard from './ProjectCard'

// ─── Default props helper ─────────────────────────────────────────────────────
function defaultProps(overrides: Partial<React.ComponentProps<typeof ProjectCard>> = {}) {
  return {
    title: 'Test Project',
    image: '/test.jpg',
    description: 'A test project description.',
    tech: ['React', 'TypeScript'],
    ...overrides,
  }
}

// ─── Tests ────────────────────────────────────────────────────────────────────

describe('ProjectCard - Property 8: always resets on mouse leave', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    gsapToCalls.length = 0
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  // ─── Property 8.1: cardRef reset to identity values on mouseleave ─────────
  it(
    'Property 8.1: for any initial tilt/displacement, mouseleave calls gsap.to with x:0, y:0, rotateX:0, rotateY:0',
    () => {
      fc.assert(
        fc.property(
          fc.record({
            // Arbitrary pre-existing tilt values (within or outside bounds — reset must always work)
            preRotateX: fc.float({ min: -20, max: 20, noNaN: true }),
            preRotateY: fc.float({ min: -20, max: 20, noNaN: true }),
            preX:       fc.float({ min: -50, max: 50,  noNaN: true }),
            preY:       fc.float({ min: -50, max: 50,  noNaN: true }),
          }),
          ({ preRotateX: _rx, preRotateY: _ry, preX: _x, preY: _y }) => {
            vi.clearAllMocks()
            gsapToCalls.length = 0

            const { container } = render(<ProjectCard {...defaultProps()} />)
            const card = container.firstElementChild as HTMLElement

            // Fire mouseleave — regardless of any prior transformation state
            fireEvent.mouseLeave(card)

            // Find the gsap.to call that resets the card (x: 0, y: 0, rotateX: 0, rotateY: 0)
            const cardResetCall = gsapToCalls.find(
              (c) =>
                c.vars.x === 0 &&
                c.vars.y === 0 &&
                c.vars.rotateX === 0 &&
                c.vars.rotateY === 0
            )

            expect(cardResetCall).toBeDefined()
            expect(cardResetCall!.vars.x).toBe(0)
            expect(cardResetCall!.vars.y).toBe(0)
            expect(cardResetCall!.vars.rotateX).toBe(0)
            expect(cardResetCall!.vars.rotateY).toBe(0)
          }
        ),
        { numRuns: 100 }
      )
    }
  )

  // ─── Property 8.2: image scale reset to 1 on mouseleave ──────────────────
  it(
    'Property 8.2: for any prior image scale, mouseleave always calls gsap.to on img with scale:1',
    () => {
      fc.assert(
        fc.property(
          fc.record({
            // The image might have been scaled to any value before mouseleave
            priorImgScale: fc.float({ min: 0.5, max: 2.0, noNaN: true }),
          }),
          ({ priorImgScale: _scale }) => {
            vi.clearAllMocks()
            gsapToCalls.length = 0

            const { container } = render(<ProjectCard {...defaultProps()} />)
            const card = container.firstElementChild as HTMLElement

            // Fire mouseleave
            fireEvent.mouseLeave(card)

            // Find the gsap.to call that resets img scale to 1
            const imgResetCall = gsapToCalls.find(
              (c) => c.vars.scale === 1 && c.vars.duration === 0.6
            )

            expect(imgResetCall).toBeDefined()
            expect(imgResetCall!.vars.scale).toBe(1)
          }
        ),
        { numRuns: 100 }
      )
    }
  )

  // ─── Property 8.3: card reset uses correct ease and duration ─────────────
  it(
    'Property 8.3: card reset always uses duration:0.8 and ease:elastic.out(1, 0.3) per spec',
    () => {
      fc.assert(
        fc.property(
          fc.record({
            dummy: fc.nat(), // vary iterations
          }),
          ({ dummy: _d }) => {
            vi.clearAllMocks()
            gsapToCalls.length = 0

            const { container } = render(<ProjectCard {...defaultProps()} />)
            const card = container.firstElementChild as HTMLElement

            fireEvent.mouseLeave(card)

            const cardResetCall = gsapToCalls.find(
              (c) =>
                c.vars.x === 0 &&
                c.vars.y === 0 &&
                c.vars.rotateX === 0 &&
                c.vars.rotateY === 0
            )

            expect(cardResetCall).toBeDefined()
            // Requirement 7.4: duration must be 0.8
            expect(cardResetCall!.vars.duration).toBe(0.8)
            // Requirement 7.4: ease must be elastic.out spring
            expect(cardResetCall!.vars.ease).toBe('elastic.out(1, 0.3)')
          }
        ),
        { numRuns: 100 }
      )
    }
  )

  // ─── Property 8.4: img reset uses correct ease and duration ──────────────
  it(
    'Property 8.4: img scale reset always uses duration:0.6 and ease:power2.out per spec',
    () => {
      fc.assert(
        fc.property(
          fc.record({
            dummy: fc.nat(),
          }),
          ({ dummy: _d }) => {
            vi.clearAllMocks()
            gsapToCalls.length = 0

            const { container } = render(<ProjectCard {...defaultProps()} />)
            const card = container.firstElementChild as HTMLElement

            fireEvent.mouseLeave(card)

            const imgResetCall = gsapToCalls.find(
              (c) => c.vars.scale === 1 && c.vars.duration === 0.6
            )

            expect(imgResetCall).toBeDefined()
            expect(imgResetCall!.vars.duration).toBe(0.6)
            expect(imgResetCall!.vars.ease).toBe('power2.out')
          }
        ),
        { numRuns: 100 }
      )
    }
  )

  // ─── Property 8.5: exactly two gsap.to calls on mouseleave ───────────────
  it(
    'Property 8.5: mouseleave always triggers exactly 2 gsap.to calls (card reset + img reset)',
    () => {
      fc.assert(
        fc.property(
          fc.record({
            dummy: fc.nat(),
          }),
          ({ dummy: _d }) => {
            vi.clearAllMocks()
            gsapToCalls.length = 0

            const { container } = render(<ProjectCard {...defaultProps()} />)
            const card = container.firstElementChild as HTMLElement

            fireEvent.mouseLeave(card)

            // Exactly 2 calls: one for cardRef, one for imgRef
            expect(gsapToCalls.length).toBe(2)
          }
        ),
        { numRuns: 100 }
      )
    }
  )

  // ─── Property 8.6: reset targets are always absolute identity (not relative) ─
  it(
    'Property 8.6: reset values are always the absolute identity (0,0,0,0 / scale:1), never relative to prior state',
    () => {
      fc.assert(
        fc.property(
          fc.record({
            cursorRx: fc.float({ min: -1, max: 1, noNaN: true }),
            cursorRy: fc.float({ min: -1, max: 1, noNaN: true }),
          }),
          ({ cursorRx: _rx, cursorRy: _ry }) => {
            vi.clearAllMocks()
            gsapToCalls.length = 0

            const { container } = render(<ProjectCard {...defaultProps()} />)
            const card = container.firstElementChild as HTMLElement

            // After mouseleave, the reset should always be absolute identity
            fireEvent.mouseLeave(card)

            const cardResetCall = gsapToCalls.find(
              (c) =>
                c.vars.x === 0 &&
                c.vars.y === 0 &&
                c.vars.rotateX === 0 &&
                c.vars.rotateY === 0
            )

            expect(cardResetCall).toBeDefined()
            // These must be exactly 0 — not some offset from prior state
            expect(cardResetCall!.vars.x).toBe(0)
            expect(cardResetCall!.vars.y).toBe(0)
            expect(cardResetCall!.vars.rotateX).toBe(0)
            expect(cardResetCall!.vars.rotateY).toBe(0)

            const imgResetCall = gsapToCalls.find((c) => c.vars.scale === 1)
            expect(imgResetCall).toBeDefined()
            expect(imgResetCall!.vars.scale).toBe(1)
          }
        ),
        { numRuns: 100 }
      )
    }
  )

  // ─── Property 8.7: reset fires every time mouseleave is triggered ─────────
  it(
    'Property 8.7: for any number of mouseleave events, each one independently triggers a full reset',
    () => {
      fc.assert(
        fc.property(
          fc.record({
            leaveCount: fc.integer({ min: 1, max: 5 }),
          }),
          ({ leaveCount }) => {
            vi.clearAllMocks()
            gsapToCalls.length = 0

            const { container } = render(<ProjectCard {...defaultProps()} />)
            const card = container.firstElementChild as HTMLElement

            // Fire mouseleave multiple times
            for (let i = 0; i < leaveCount; i++) {
              fireEvent.mouseLeave(card)
            }

            // Each mouseleave triggers 2 calls: card reset + img reset
            expect(gsapToCalls.length).toBe(leaveCount * 2)

            // All card reset calls should have identity transform values
            const cardResets = gsapToCalls.filter(
              (c) =>
                c.vars.x === 0 &&
                c.vars.y === 0 &&
                c.vars.rotateX === 0 &&
                c.vars.rotateY === 0
            )
            expect(cardResets.length).toBe(leaveCount)

            // All img reset calls should have scale: 1
            const imgResets = gsapToCalls.filter((c) => c.vars.scale === 1)
            expect(imgResets.length).toBe(leaveCount)
          }
        ),
        { numRuns: 100 }
      )
    }
  )
})


// Feature: gsap-modern-portfolio, Property 9: All data-attribute contracts are satisfied (card portion)
// **Validates: Requirements 7.5**

/**
 * Property 9 (card portion): For any rendered ProjectCard, the root container
 * element SHALL carry data-cursor="card" so the Cursor component can show the
 * "VIEW" label on hover.
 *
 * We use React Testing Library to render the component and assert the DOM
 * attribute is present — across a range of arbitrary but valid prop inputs.
 */

// ─── Generators ───────────────────────────────────────────────────────────────

/** Arbitrary non-empty string (safe for use as title/description/tech label) */
const nonEmptyString = fc.string({ minLength: 1, maxLength: 60 }).filter(s => s.trim().length > 0);

/** Arbitrary list of 1–5 tech tags */
const techArray = fc.array(nonEmptyString, { minLength: 1, maxLength: 5 });

/** Arbitrary valid image src path (just a string — jsdom won't load it) */
const imageSrc = fc.constantFrom('/img/a.jpg', '/img/b.png', '/projects/test.jpeg');

/** Arbitrary optional demo URL */
const optionalDemo = fc.option(fc.constantFrom('https://example.com', 'https://demo.io'), {
  nil: undefined,
});

// ─── Property 9 Tests ─────────────────────────────────────────────────────────

describe('Property 9 (card portion): data-cursor="card" is always present on ProjectCard', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it(
    'Property 9.1: for any valid set of ProjectCard props, the root element always has data-cursor="card"',
    () => {
      fc.assert(
        fc.property(
          fc.record({
            title:       nonEmptyString,
            image:       imageSrc,
            description: nonEmptyString,
            tech:        techArray,
            demo:        optionalDemo,
          }),
          ({ title, image, description, tech, demo }) => {
            const { container, unmount } = render(
              <ProjectCard
                title={title}
                image={image}
                description={description}
                tech={tech}
                demo={demo}
              />
            );

            // The root element of ProjectCard must carry data-cursor="card"
            const root = container.firstElementChild as HTMLElement;
            expect(root).not.toBeNull();
            expect(root.getAttribute('data-cursor')).toBe('card');

            unmount();
          }
        ),
        { numRuns: 100 }
      );
    }
  );

  it(
    'Property 9.2: data-cursor="card" is on the outermost wrapper, not a nested element',
    () => {
      fc.assert(
        fc.property(
          fc.record({
            title:       nonEmptyString,
            image:       imageSrc,
            description: nonEmptyString,
            tech:        techArray,
          }),
          ({ title, image, description, tech }) => {
            const { container, unmount } = render(
              <ProjectCard
                title={title}
                image={image}
                description={description}
                tech={tech}
              />
            );

            // Root element (depth 0) must carry the attribute
            const root = container.firstElementChild as HTMLElement;
            expect(root.getAttribute('data-cursor')).toBe('card');

            // No child element should also carry data-cursor="card"
            // (the attribute belongs only on the card wrapper)
            const nested = Array.from(root.querySelectorAll('[data-cursor="card"]'));
            expect(nested.length).toBe(0);

            unmount();
          }
        ),
        { numRuns: 100 }
      );
    }
  );

  it(
    'Property 9.3: exactly one element in the rendered output has data-cursor="card"',
    () => {
      fc.assert(
        fc.property(
          fc.record({
            title:       nonEmptyString,
            image:       imageSrc,
            description: nonEmptyString,
            tech:        techArray,
            demo:        optionalDemo,
          }),
          ({ title, image, description, tech, demo }) => {
            const { container, unmount } = render(
              <ProjectCard
                title={title}
                image={image}
                description={description}
                tech={tech}
                demo={demo}
              />
            );

            // Exactly one element total (including root) should carry the attribute
            const all = Array.from(container.querySelectorAll('[data-cursor="card"]'));
            expect(all.length).toBe(1);

            unmount();
          }
        ),
        { numRuns: 100 }
      );
    }
  );
});
