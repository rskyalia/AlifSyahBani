# Design Document — GSAP Modern Portfolio

## Overview

Redesain portfolio Alif Sya'bani menjadi "GSAP Style Modern Portfolio" bertujuan mengangkat situs ke level creative-agency / Awwwards. Semua infrastruktur yang sudah ada (Next.js 16, React 19, TypeScript, Tailwind CSS v4, GSAP v3.15 + @gsap/react, Lenis v1.3.25, react-three-fiber) dipertahankan dan diperkuat dengan layer animasi yang lebih ekspresif.

Perubahan utama:
- **ScrollEngine** diupgrade: Lenis context dipublikasikan, plugin GSAP diregistrasi di module-level, lagSmoothing(0).
- **New components**: `MagneticCursor`, hook `useScrollReveal`, `StatsCounter`, `LenisContext`.
- **Upgrade components**: `Preloader` (clip-path cinematic exit), `Hero` (text-reveal + parallax + stats), `Navbar` (GSAP hide/show + active indicator), `ProjectCard` (3D tilt + magnetic), `Footer` (marquee + text reveal + animated links).
- **Typography tokens** di `globals.css` — heading scale Awwwards-grade dengan clamp() dan letter-spacing negatif.

Pendekatan: semua animasi menggunakan `gsap.context()` + `ctx.revert()` di cleanup setiap komponen untuk mencegah memory leak. Untuk perangkat `prefers-reduced-motion: reduce`, semua animasi motion di-skip secara global menggunakan `matchMedia`.

---

## Architecture

### Component Tree (App Router)

```
RootLayout (app/layout.tsx)
└── ThemeProvider (ThemeContext)
    ├── BackgroundScene         ← space/room 3D background (unchanged)
    └── ClientRoot
        ├── SmoothScroll        ← upgraded: LenisContext provider + GSAP plugins
        │   ├── MagneticCursor  ← NEW: custom cursor, z-index 99999
        │   ├── PageTransition  ← existing, minor enhancement
        │   └── {page content}
        │       ├── Navbar      ← upgraded: GSAP hide/show + active indicator
        │       ├── Preloader   ← upgraded: clip-path cinematic exit
        │       ├── Hero        ← upgraded: TextReveal + parallax + StatsCounter
        │       ├── SectionHeader ← upgraded: clip-path TextReveal via useScrollReveal
        │       ├── ProjectCard   ← upgraded: 3D tilt + magnetic
        │       ├── ExperienceAwards ← upgraded: stagger via useScrollReveal
        │       └── Footer      ← upgraded: marquee + TextReveal + magnetic links
```

### Data Flow

```
Lenis instance
  ↓  lenis.on('scroll', ScrollTrigger.update)
  ↓  gsap.ticker.add((time) => lenis.raf(time * 1000))
LenisContext.Provider
  ↓  useContext(LenisContext)  → child components can call lenis.scrollTo()

ThemeContext  →  MagneticCursor, Navbar, Hero, Footer (dark/light mode)
ReadyContext  →  Navbar, Hero (fires after Preloader.onComplete)
```

### State Machines

**Cursor State Machine:**

```
         pointer:coarse?
              │ YES
              ▼
         [NOT_RENDERED]  ← permanent, no cursor shown

              │ NO (desktop)
              ▼
         [IDLE]
       cursor moves freely, ring lerps at 0.1
              │
    ┌─────────┼───────────────┐
    │         │               │
    ▼         ▼               ▼
[HOVER_LINK] [HOVER_CARD]  [HOVER_MAGNETIC]
ring→64px    ring→80px      element attracts
mix-blend    show "VIEW"    up to 30% distance
difference   text
    │         │               │
    └─────────┴───────────────┘
              │ mouseleave / mouseenter idle zone
              ▼
         [IDLE]
```

**Preloader State Machine:**

```
[COUNTING]  →  counter 0..100%  →  [EXIT_ANIMATION]  →  [DONE/UNMOUNTED]
                                     clip-path open        onComplete()
```

**Navbar Scroll State Machine:**

```
[VISIBLE_AT_TOP]
      │ scrollY > 80px (downward)
      ▼
[HIDDEN]  →  y: -100%
      │ scrollY up ≥ 20px from last-down position
      ▼
[VISIBLE_SCROLLED]  →  y: 0, backdrop-filter: blur(24px)
```

---

## Components and Interfaces

### 1. `LenisContext` (new — `components/LenisContext.tsx`)

```typescript
import { createContext, useContext } from 'react'
import Lenis from 'lenis'

export const LenisContext = createContext<Lenis | null>(null)

export function useLenis(): Lenis | null {
  return useContext(LenisContext)
}
```

`SmoothScroll` creates the Lenis instance, wraps children with `LenisContext.Provider`, and publishes the instance. Any component needing programmatic scroll (e.g. nav links) calls `useLenis()?.scrollTo(target)`.

---

### 2. `SmoothScroll` (upgrade — `components/SmoothScroll.tsx`)

```typescript
interface SmoothScrollProps {
  children: React.ReactNode
}
```

**Key changes from current implementation:**
- GSAP plugin registration (`ScrollTrigger`, `ScrollToPlugin`, `CustomEase`) moved to module scope — called once, not inside `useEffect`.
- Lenis config upgraded: `duration: 1.4` (was 1.2).
- Lenis instance stored in ref and published via `LenisContext.Provider`.
- `useEffect` cleanup correctly removes the exact ticker callback reference (captured in a `const` before adding).

```typescript
// Module-level — runs once
gsap.registerPlugin(ScrollTrigger, ScrollToPlugin, CustomEase)

export default function SmoothScroll({ children }: SmoothScrollProps) {
  const lenisRef = useRef<Lenis | null>(null)

  useEffect(() => {
    const lenis = new Lenis({ duration: 1.4, easing: ..., smoothWheel: true })
    lenisRef.current = lenis
    lenis.on('scroll', ScrollTrigger.update)
    const tick = (time: number) => lenis.raf(time * 1000)
    gsap.ticker.add(tick)
    gsap.ticker.lagSmoothing(0)
    return () => { lenis.destroy(); gsap.ticker.remove(tick) }
  }, [])

  return (
    <LenisContext.Provider value={lenisRef.current}>
      {children}
    </LenisContext.Provider>
  )
}
```

---

### 3. `MagneticCursor` (new — `components/MagneticCursor.tsx`)

```typescript
// No props — renders globally, placed once inside SmoothScroll
export default function MagneticCursor(): JSX.Element | null
```

**Implementation notes:**
- Rendered once in `ClientRoot` (or directly inside `SmoothScroll`), below all page content but with `z-index: 99999`.
- On mount: check `window.matchMedia('(pointer: coarse)')`. If true, return `null` immediately.
- Two `<div>` elements: `dotRef` (8px, follows mouse instantly via `gsap.set`) and `ringRef` (40px, follows with lerp via `gsap.ticker`).
- Global `mousemove` listener updates a `{ x, y }` mouse-position ref.
- `gsap.ticker` callback interpolates `ring` position: `rx += (mx - rx) * 0.12`.
- Magnetic effect: `document.querySelectorAll('[data-magnetic]')` — attach `mouseenter`/`mousemove`/`mouseleave` listeners. On `mousemove`: compute offset as 30% of `(cursorX - elemCenterX)`, apply with `gsap.to(elem, { x: offset, y: offset, duration: 0.4, ease: 'power2.out' })`. On `mouseleave`: `gsap.to(elem, { x: 0, y: 0, duration: 0.7, ease: 'elastic.out(1, 0.3)' })`.
- `data-cursor="link"`: ring → 64px + `mix-blend-mode: difference`.
- `data-cursor="card"`: ring → 80px + show "VIEW" text inside ring.
- Cleanup: remove all event listeners, kill GSAP ticker.

```typescript
// Cursor state shape
type CursorState = 'idle' | 'link' | 'card' | 'magnetic'
```

---

### 4. `useScrollReveal` (new — `hooks/useScrollReveal.ts`)

```typescript
type RevealPreset = 'fade-up' | 'clip-reveal' | 'stagger'

interface ScrollRevealOptions {
  preset: RevealPreset
  staggerTargets?: string   // CSS selector for stagger children
  staggerDelay?: number     // default 0.1s
  start?: string            // ScrollTrigger start, default "top 85%"
  duration?: number
  ease?: string
  once?: boolean            // default true
}

function useScrollReveal(
  ref: React.RefObject<HTMLElement>,
  options: ScrollRevealOptions
): void
```

**Presets:**
- `fade-up`: `{ y: 60, opacity: 0 }` → `{ y: 0, opacity: 1 }` with ScrollTrigger.
- `clip-reveal`: `{ clipPath: 'inset(0% 0% 100% 0%)' }` → `{ clipPath: 'inset(0% 0% 0% 0%)' }`.
- `stagger`: applies `fade-up` to each child matching `staggerTargets` with delay between.

All presets: check `window.matchMedia('(prefers-reduced-motion: reduce)')` — if true, set elements to final visible state immediately without animation. Use `gsap.context(scope)` + `ctx.revert()` in cleanup.

---

### 5. `StatsCounter` (new — `components/StatsCounter.tsx`)

```typescript
interface StatItem {
  value: number
  suffix: string   // e.g. "+", "%", "x"
  label: string
}

interface StatsCounterProps {
  stats: StatItem[]
  className?: string
}

export default function StatsCounter({ stats, className }: StatsCounterProps): JSX.Element
```

Each stat item:
- Wraps counter number in a `<span>` with `aria-label="{value}{suffix} {label}"`.
- Uses ScrollTrigger `start: "top 75%"` + `once: true`.
- `gsap.to({ val: 0 }, { val: target, duration: 2.0, ease: 'power2.out', onUpdate() { display = Math.round(this.targets()[0].val) } })`.
- After reaching target, `ScrollTrigger.kill()`.
- Responsive font size: `clamp(2.5rem, 5vw, 4rem)` applied via CSS class.

---

### 6. `Preloader` (upgrade — `components/Preloader.tsx`)

```typescript
interface PreloaderProps {
  onComplete: () => void
}
```

**Changes from current:**
- Add name heading `"ALIF SYA'BANI"` — `clamp(3rem, 10vw, 7rem)`, font-weight 800, letter-spacing -0.04em, color `#ffffff`.
- Tagline below name — `clamp(0.75rem, 1.5vw, 1rem)`, color `rgba(255,255,255,0.55)`.
- Counter `0%→100%` remains below tagline (currently it's above) — reorder DOM: name → tagline → counter.
- **Exit animation**: replace current fade/blur with clip-path reveal. After counter hits 100%: `gsap.to(wrapperRef, { clipPath: 'inset(50% 50% 50% 50%)' → 'inset(0% 0% 0% 0%)' reversed` — actually use `clipPath: 'inset(0% 50% 100% 50%)' → 'inset(0% 0% 0% 0%)'` opened from center. Implementation: `gsap.to(wrapperRef.current, { clipPath: 'polygon(50% 50%, 50% 50%, 50% 50%, 50% 50%)', duration: 1.2, ease: 'power4.inOut', onComplete })`. More precisely: animate `clipPath` from `inset(0% 0% 0% 0%)` to `inset(50% 0% 50% 0%)` (collapses to horizontal line from top+bottom) in `duration: 1.2`, `ease: 'power4.inOut'`. This reveals content beneath.
- Single `gsap.timeline()` for the entire sequence as required.
- While mounted: set `document.body.style.overflow = 'hidden'`. On unmount / onComplete: restore `document.body.style.overflow = ''`.

---

### 7. `Hero` (upgrade — `components/Hero.tsx`)

**Changes:**
- Heading "ALIF SYA'BANI" wrapped in TextReveal structure: each word/line inside `<div style="overflow: hidden"><span ref>` — GSAP animates `y: '110%' → y: '0%'`.
- Heading font size: `clamp(3.5rem, 8vw, 7rem)`, font-weight 800–900, letter-spacing `-0.03em`, line-height `1.05`.
- After text reveal, `StatsCounter` component mounts with stats: `[{ value: 3, suffix: '+', label: 'Years Coding' }, { value: 10, suffix: '+', label: 'Projects Built' }, { value: 5, suffix: '+', label: 'Awards Won' }]`.
- ScrollTrigger parallax on heading: `scrub: 1`, `y: '-20%'` as scroll progresses.
- ScrollTrigger parallax on PlanetModel container: `scrub: 1.5`, `y: '-35%'`, `rotate: 15`.
- ScrollTrigger fade-out: when scroll > 80% viewport height, text `opacity → 0`, `y → -30px`, `scrub: 1`.
- PlanetModel retains `aria-label="Animated 3D planet decoration"` + `aria-hidden="true"`.
- Trigger animation on `isReady` from `ReadyContext` (after Preloader finishes), not just on mount.

---

### 8. `Navbar` (upgrade — `components/Navbar.tsx`)

**Changes:**
- Remove CSS `transition-all` class from nav bar — all transitions handled by GSAP.
- Add `navRef` for hide/show animation. Scroll listener tracks `lastScrollY` and direction.
- Hide: `gsap.to(navRef.current, { y: '-100%', duration: 0.4, ease: 'power3.in' })`.
- Show: `gsap.to(navRef.current, { y: '0%', duration: 0.5, ease: 'power3.out' })`.
- Initial entry (on `isReady`): `gsap.fromTo(navRef.current, { y: -60, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out' })`.
- Active indicator: an absolutely-positioned `<div ref={indicatorRef}` 2px tall, background blue-400. On route change, read `getBoundingClientRect()` of active item, animate indicator `left` and `width` via `gsap.to(indicatorRef, { x: ..., width: ..., duration: 0.3, ease: 'power2.inOut' })`.
- All nav items get `data-magnetic` and `data-cursor="link"` attributes.
- Mobile menu: animate clip-path `inset(0% 0% 100% 0%) → inset(0% 0% 0% 0%)` on open, reverse on close.

---

### 9. `ProjectCard` (upgrade — `components/ProjectCard.tsx`)

**Changes:**
- Outer container: add `ref={cardRef}`, `data-cursor="card"`, `perspective: '1000px'`, `transform-style: 'preserve-3d'`.
- `mouseenter` / `mousemove` / `mouseleave` handlers.
- On `mousemove`: calculate relative cursor position `(rx, ry)` within card bounds (normalized -1 to 1). Apply:
  - Magnetic offset: `gsap.to(cardRef.current, { x: rx * 12, y: ry * 12, duration: 0.4, ease: 'power2.out' })`.
  - Tilt: `gsap.to(cardRef.current, { rotateX: -ry * 8, rotateY: rx * 8, duration: 0.3, ease: 'power2.out' })`.
- On `mouseenter`: `gsap.to(imgRef.current, { scale: 1.08, duration: 0.6, ease: 'power2.out' })`.
- On `mouseleave`: `gsap.to(cardRef.current, { x: 0, y: 0, rotateX: 0, rotateY: 0, scale: 1, duration: 0.8, ease: 'elastic.out(1, 0.3)' })`. `gsap.to(imgRef.current, { scale: 1, duration: 0.6, ease: 'power2.out' })`.
- Remove CSS `card-float` hover transitions (now handled by GSAP).
- Card uses `useScrollReveal` with `preset: 'fade-up'` for scroll entry animation.

---

### 10. `Footer` (upgrade — `components/Footer.tsx`)

**Changes:**
- Large name heading: `<h2>"ALIF SYA'BANI"</h2>` with `clamp(3rem, 8vw, 6rem)`, font-weight 800–900, TextReveal via `useScrollReveal({ preset: 'clip-reveal' })`.
- "AVAILABLE FOR WORK" link: `data-magnetic`, `data-cursor="link"`.
- Marquee: `<div ref={marqueeRef}` containing duplicated tech-stack text. `gsap.to(marqueeRef, { x: '-50%', duration: 20, ease: 'none', repeat: -1 })` — since content is duplicated, at -50% it loops seamlessly.
- Social links underline: each link wraps an underline `<span>` — on hover, `gsap.to(underlineSpan, { scaleX: 1, transformOrigin: 'left', duration: 0.3, ease: 'power2.out' })`, initial `scaleX: 0`.
- Footer keeps `background: transparent` — space/room scene shows through.

---

## Data Models

### `StatItem`
```typescript
interface StatItem {
  value: number    // target number (e.g. 10)
  suffix: string   // display suffix (e.g. "+", "%")
  label: string    // descriptive label (e.g. "Projects Built")
}
```

### `ScrollRevealOptions`
```typescript
interface ScrollRevealOptions {
  preset: 'fade-up' | 'clip-reveal' | 'stagger'
  staggerTargets?: string     // CSS selector string
  staggerDelay?: number       // seconds, default 0.1
  start?: string              // GSAP ScrollTrigger start value
  duration?: number           // animation duration in seconds
  ease?: string               // GSAP ease string
  once?: boolean              // kill after first trigger, default true
}
```

### `CursorState`
```typescript
type CursorState = 'idle' | 'link' | 'card' | 'magnetic'

interface CursorStateData {
  state: CursorState
  ringSize: number            // px diameter
  showLabel: boolean          // show "VIEW" text
  mixBlendMode: string        // CSS mix-blend-mode value
}
```

### Typography Token Map (`globals.css`)
```
--text-hero:      clamp(3.5rem, 8vw, 7rem)      /* h1, Hero */
--text-h2:        clamp(2rem, 4vw, 3.5rem)       /* section titles */
--text-h3:        clamp(1.25rem, 2vw, 1.75rem)   /* card titles */
--text-counter:   clamp(2.5rem, 5vw, 4rem)       /* StatsCounter numbers */
--text-preloader: clamp(3rem, 10vw, 7rem)        /* Preloader name */
--text-section-label: clamp(0.65rem, 1vw, 0.8rem) /* section super-label */
--ls-hero:        -0.03em
--ls-h2:          -0.02em
--lh-display:     1.05
```

---

## File Structure Overview

```
AlifSyahBani/
├── app/
│   ├── globals.css            ← ADD: typography tokens, cursor CSS
│   ├── layout.tsx             ← unchanged
│   └── page.tsx               ← unchanged
│
├── components/
│   ├── MagneticCursor.tsx     ← NEW
│   ├── LenisContext.tsx       ← NEW
│   ├── SmoothScroll.tsx       ← UPGRADE: LenisContext provider, module-level plugins
│   ├── Preloader.tsx          ← UPGRADE: clip-path exit, name/tagline layout
│   ├── Navbar.tsx             ← UPGRADE: GSAP hide/show, active indicator, data-attrs
│   ├── Hero.tsx               ← UPGRADE: TextReveal, parallax, StatsCounter
│   ├── StatsCounter.tsx       ← NEW
│   ├── ProjectCard.tsx        ← UPGRADE: 3D tilt, magnetic, data-cursor
│   ├── Footer.tsx             ← UPGRADE: marquee, TextReveal, magnetic link
│   ├── SectionHeader.tsx      ← UPGRADE: useScrollReveal clip-reveal
│   ├── ExperienceAwards.tsx   ← UPGRADE: useScrollReveal stagger
│   ├── PageTransition.tsx     ← minor: already implements multi-layer transition
│   ├── ThemeContext.tsx       ← unchanged
│   ├── ReadyContext.tsx       ← unchanged
│   ├── BackgroundScene.tsx    ← unchanged
│   ├── PlanetModel.tsx        ← unchanged (add aria-label + aria-hidden)
│   └── ClientRoot.tsx         ← add MagneticCursor render
│
└── hooks/
    └── useScrollReveal.ts     ← NEW
```

---

## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system — essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

---

### Property 1: Preloader onComplete is always called exactly once

*For any* function passed as the `onComplete` prop to `Preloader`, after the animation sequence completes, that function should be called exactly once — regardless of the function's implementation.

**Validates: Requirements 1.5**

---

### Property 2: Cursor never renders on touch/coarse-pointer devices

*For any* viewport or device environment where `window.matchMedia('(pointer: coarse)').matches` returns `true`, the `MagneticCursor` component should render nothing into the DOM — the cursor dot and ring elements should be absent.

**Validates: Requirements 2.6, 12.2**

---

### Property 3: Magnetic attraction is bounded

*For any* element with `data-magnetic` and any cursor position, the applied displacement (`x` and `y` offset) should never exceed 30% of the distance between the cursor and the element's center point.

**Validates: Requirements 2.2**

---

### Property 4: Magnetic element always returns to origin

*For any* element with `data-magnetic` that has been displaced by the magnetic effect, when the cursor leaves the element, the element's `x` and `y` transform values should return to `0, 0`.

**Validates: Requirements 2.3**

---

### Property 5: Scroll reveal elements start hidden

*For any* element outside the initial viewport that uses `useScrollReveal`, the element's initial state (before ScrollTrigger fires) should have `opacity: 0` (for `fade-up`) or `clipPath: inset(0% 0% 100% 0%)` (for `clip-reveal`), ensuring it is not visible before scroll reaches it.

**Validates: Requirements 6.5**

---

### Property 6: Scroll reveal hook cleans up on unmount

*For any* component using `useScrollReveal`, when that component is unmounted, the associated GSAP context should be reverted (`ctx.revert()`) and the ScrollTrigger should be killed, restoring all animated elements to their pre-animation state.

**Validates: Requirements 6.4, 12.5**

---

### Property 7: ProjectCard tilt is bounded within ±8 degrees

*For any* cursor position `(x, y)` within the bounds of a `ProjectCard`, the applied `rotateX` and `rotateY` values should each be within the range `[-8, +8]` degrees — never exceeding the maximum regardless of cursor position near edges.

**Validates: Requirements 7.2**

---

### Property 8: ProjectCard always resets on mouse leave

*For any* transformation state of a `ProjectCard` (any combination of tilt, magnetic displacement, and image scale), when `mouseleave` fires, all transforms should return to their identity values: `x: 0, y: 0, rotateX: 0, rotateY: 0`, and `img scale: 1`.

**Validates: Requirements 7.4**

---

### Property 9: All data-attribute contracts are satisfied

*For any* rendered `ProjectCard`, it should carry `data-cursor="card"`. *For any* rendered navigation item in `Navbar`, it should carry both `data-magnetic` and `data-cursor="link"`. *For the* "AVAILABLE FOR WORK" link in `Footer`, it should carry `data-magnetic` and `data-cursor="link"`.

**Validates: Requirements 7.5, 4.6, 11.3**

---

### Property 10: Counter animates from 0 and displays rounded integers

*For any* `StatsCounter` with target value `N`, when triggered: (a) the initial displayed value should be 0, (b) the final displayed value should equal `N`, and (c) every intermediate displayed value during animation should equal `Math.round(currentInterpolatedValue)` — never a fractional number.

**Validates: Requirements 8.1, 8.2**

---

### Property 11: Counter animation fires exactly once per session

*For any* `StatsCounter` that has completed its animation, subsequent scroll events that would normally re-trigger the ScrollTrigger should not restart the counter animation. The counter's final displayed value should remain stable at `N`.

**Validates: Requirements 8.4**

---

### Property 12: All animations are suppressed under prefers-reduced-motion

*For any* animated element (text reveal, parallax, counter, cursor, stagger) in the application, when `window.matchMedia('(prefers-reduced-motion: reduce)').matches` is `true`, the element should be rendered at its final/visible state immediately — with no `y`, `x`, `opacity`, `scale`, or `clipPath` motion transitions applied.

**Validates: Requirements 6.6, 12.1**

---

### Property 13: LenisContext always provides a valid Lenis instance to consumers

*For any* component using `useLenis()` that is mounted inside `SmoothScroll`, the returned value should be a non-null Lenis instance that has a callable `scrollTo` method. The context value should never be `null` after `SmoothScroll` has initialized.

**Validates: Requirements 5.4**

---

### Property 14: Navbar scroll visibility follows direction invariant

*For any* scroll sequence where the user scrolls down by more than 80px, the Navbar's computed `y` transform should be `-100%` (hidden). *For any* subsequent upward scroll of at least 20px from the lowest downward position, the Navbar's `y` transform should return to `0` (visible).

**Validates: Requirements 4.1, 4.2**

---

### Property 15: Marquee maintains constant velocity

*For any* footer marquee with `repeat: -1` and `ease: 'none'`, the horizontal displacement per unit time should be constant — i.e., the instantaneous velocity at any point in the animation should equal the initial velocity (no acceleration or deceleration).

**Validates: Requirements 11.2**

---

## Error Handling

### GSAP Context Leak Prevention
Every component that creates GSAP animations wraps them in `gsap.context(scope)` and calls `ctx.revert()` in the `useEffect` cleanup. This ensures:
- All GSAP tweens, timelines, and ScrollTriggers created in that scope are killed.
- DOM elements are restored to their pre-animation state on unmount.

### Lenis Initialization Failures
If `new Lenis()` throws (rare, but possible if the environment doesn't support `smoothWheel`), the `SmoothScroll` `useEffect` catches the error and falls back to native scroll. `gsap.ticker.lagSmoothing(0)` is still applied even in fallback mode.

### MagneticCursor Guard
`MagneticCursor` performs a `typeof window !== 'undefined'` check before any `matchMedia` or `addEventListener` calls to prevent SSR crashes (Next.js App Router).

### prefers-reduced-motion Global Guard
In `useScrollReveal`, before creating any GSAP animation:
```typescript
const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
if (prefersReduced) {
  gsap.set(targets, { opacity: 1, y: 0, clipPath: 'inset(0% 0% 0% 0%)', clearProps: 'all' })
  return
}
```

### ScrollTrigger Refresh
After Preloader completes and DOM shifts, call `ScrollTrigger.refresh()` inside the `onComplete` handler to recalculate all trigger positions. Without this, parallax scrub values would be offset.

### Marquee Width Calculation
The marquee container is duplicated (`[...items, ...items]`). GSAP animates `x` from `0` to `-50%` with `repeat: -1`. If the content width is 0 (e.g. SSR render), a `ResizeObserver` triggers `gsap.invalidate()` + restart.

---

## Testing Strategy

### Dual Testing Approach

This feature uses both **unit/example tests** and **property-based tests** (PBT), targeting the pure logic and DOM behavior layers.

**PBT Library:** [fast-check](https://github.com/dubzzz/fast-check) — chosen for its TypeScript-first API and compatibility with Vitest/Jest.

### Unit / Example Tests

Organized per component, using Vitest + React Testing Library:

| Component / Hook | What to test |
|---|---|
| `Preloader` | DOM contains name + tagline; counter starts at 0; `onComplete` called |
| `MagneticCursor` | Two circle elements render on desktop; nothing renders on coarse pointer |
| `StatsCounter` | Minimum 3 stats render on homepage; font-size clamp applied |
| `Navbar` | `data-magnetic` + `data-cursor="link"` on every nav item; active indicator exists |
| `ProjectCard` | `data-cursor="card"` present; `perspective: 1000px` on container |
| `Footer` | `background: transparent`; "AVAILABLE FOR WORK" has `data-magnetic` |
| `SectionHeader` | Number label renders (01, 02…); heading uses correct tag |
| Accessibility | All images have `alt`; PlanetModel has `aria-hidden="true"` |

### Property-Based Tests

Each test corresponds to a Correctness Property above. Minimum 100 iterations per test. Tag format in comments: `// Feature: gsap-modern-portfolio, Property N: <description>`.

```typescript
// Example structure — fast-check with Vitest
import fc from 'fast-check'

// Property 3: Magnetic attraction is bounded
it('magnetic offset never exceeds 30% of cursor-to-center distance', () => {
  fc.assert(fc.property(
    fc.record({
      cursorX: fc.float({ min: 0, max: 1000 }),
      cursorY: fc.float({ min: 0, max: 1000 }),
      elemCenterX: fc.float({ min: 0, max: 1000 }),
      elemCenterY: fc.float({ min: 0, max: 1000 }),
    }),
    ({ cursorX, cursorY, elemCenterX, elemCenterY }) => {
      const dx = cursorX - elemCenterX
      const dy = cursorY - elemCenterY
      const magneticOffset = computeMagneticOffset(dx, dy) // pure function under test
      const dist = Math.sqrt(dx * dx + dy * dy)
      expect(Math.abs(magneticOffset.x)).toBeLessThanOrEqual(dist * 0.3 + 0.001)
      expect(Math.abs(magneticOffset.y)).toBeLessThanOrEqual(dist * 0.3 + 0.001)
    }
  ), { numRuns: 100 })
})
```

### Integration Tests

For scroll-based animations, GSAP and ScrollTrigger are initialized in a JSDOM environment with `@testing-library/react`. ScrollTrigger's `onEnter` callbacks are triggered manually via `ScrollTrigger.refresh()` + mock `scrollY`.

| Scenario | Validation |
|---|---|
| Lenis `on('scroll', ScrollTrigger.update)` registered | Spy on `lenis.on` and `ScrollTrigger.update` |
| ScrollEngine unmount cleanup | `lenis.destroy()` and `gsap.ticker.remove()` called |
| `SmoothScroll` provides Lenis context | Consumer gets non-null Lenis instance with `scrollTo` method |

### Reduced Motion
All PBT and unit tests have a companion `reduced-motion` variant that sets `matchMedia` mock to return `prefers-reduced-motion: reduce` and asserts elements are immediately visible (opacity 1, no transform).
