/**
 * Property-based tests for SectionHeader alignment invariants.
 *
 * Property 8: SectionHeader Default Alignment Classes
 *   **Validates: Requirements 8.1, 8.2**
 *
 * Requirement 8.1:
 *   THE SectionHeader prop `align` SHALL memiliki nilai default `"center"` alih-alih `"left"`.
 *
 * Requirement 8.2:
 *   WHEN `align` adalah `"center"` THEN container heading memiliki class `text-center mx-auto`.
 */

import * as fc from "fast-check";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render } from "@testing-library/react";
import SectionHeader from "./SectionHeader";

// ─── Mock window.matchMedia (jsdom does not implement it) ─────────────────────
Object.defineProperty(window, "matchMedia", {
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
});

// ─── Mock GSAP and ScrollTrigger ─────────────────────────────────────────────
vi.mock("gsap", () => ({
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
}));

vi.mock("gsap/ScrollTrigger", () => ({
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
}));

// ---------------------------------------------------------------------------
// Property 8: SectionHeader Default Alignment Classes
// **Validates: Requirements 8.1, 8.2**
// ---------------------------------------------------------------------------
describe("SectionHeader — Default Alignment Classes (Property 8)", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("MUST have both text-center AND mx-auto when rendered without align prop", () => {
    fc.assert(
      fc.property(
        // Generate arbitrary title strings (non-empty)
        fc.string({ minLength: 1, maxLength: 100 }),
        // Generate optional label
        fc.option(fc.string({ minLength: 1, maxLength: 50 }), { nil: undefined }),
        // Generate optional description
        fc.option(fc.string({ minLength: 1, maxLength: 200 }), { nil: undefined }),
        // Generate optional number
        fc.option(fc.string({ minLength: 1, maxLength: 5 }), { nil: undefined }),
        (title, label, description, number) => {
          // Render SectionHeader WITHOUT providing the align prop
          const { container } = render(
            <SectionHeader
              title={title}
              label={label}
              description={description}
              number={number}
            />
          );

          // Find the main container div (the one with mb-12, md:mb-16, max-w-2xl)
          const mainContainer = container.querySelector("div");

          // Assert that the main container exists
          expect(mainContainer).not.toBeNull();

          // Assert that it contains BOTH text-center AND mx-auto classes
          const className = mainContainer?.className || "";
          expect(className).toContain("text-center");
          expect(className).toContain("mx-auto");

          // Additionally, verify it does NOT contain text-left
          // (as center should be the default, not left)
          expect(className).not.toContain("text-left");
        }
      ),
      { numRuns: 100 } // Run 100 random test cases
    );
  });

  it("MUST default to center alignment when align prop is explicitly undefined", () => {
    fc.assert(
      fc.property(fc.string({ minLength: 1, maxLength: 100 }), (title) => {
        const { container } = render(
          <SectionHeader title={title} align={undefined} />
        );

        const mainContainer = container.querySelector("div");
        const className = mainContainer?.className || "";

        expect(className).toContain("text-center");
        expect(className).toContain("mx-auto");
      }),
      { numRuns: 50 }
    );
  });

  it("MUST apply text-center mx-auto regardless of other optional props", () => {
    // This test verifies that the default center alignment is independent
    // of whether label, description, or number props are provided
    fc.assert(
      fc.property(
        fc.string({ minLength: 1 }),
        fc.boolean(), // whether to include label
        fc.boolean(), // whether to include description
        fc.boolean(), // whether to include number
        (title, hasLabel, hasDescription, hasNumber) => {
          const props = {
            title,
            ...(hasLabel && { label: "Test Label" }),
            ...(hasDescription && { description: "Test Description" }),
            ...(hasNumber && { number: "01" }),
          };

          const { container } = render(<SectionHeader {...props} />);

          const mainContainer = container.querySelector("div");
          const className = mainContainer?.className || "";

          // The default center alignment should be present regardless of other props
          expect(className).toContain("text-center");
          expect(className).toContain("mx-auto");
        }
      ),
      { numRuns: 100 }
    );
  });

  it("MUST honor explicit align='left' prop when provided", () => {
    // Negative test: verify that when explicitly set to left, it uses text-left
    fc.assert(
      fc.property(fc.string({ minLength: 1 }), (title) => {
        const { container } = render(
          <SectionHeader title={title} align="left" />
        );

        const mainContainer = container.querySelector("div");
        const className = mainContainer?.className || "";

        // When explicitly set to left, should have text-left, NOT text-center
        expect(className).toContain("text-left");
        expect(className).not.toContain("text-center");
        expect(className).not.toContain("mx-auto");
      }),
      { numRuns: 50 }
    );
  });

  it("MUST honor explicit align='center' prop when provided", () => {
    // Verify that explicit center works the same as default
    fc.assert(
      fc.property(fc.string({ minLength: 1 }), (title) => {
        const { container } = render(
          <SectionHeader title={title} align="center" />
        );

        const mainContainer = container.querySelector("div");
        const className = mainContainer?.className || "";

        expect(className).toContain("text-center");
        expect(className).toContain("mx-auto");
      }),
      { numRuns: 50 }
    );
  });
});
