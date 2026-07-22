# Implementation Plan: Page Transition & Preloader Enhancement

## Overview
Enhance PageTransition with a right-to-left slide overlay showing page title and description, and update Preloader with a portfolio description text, blur-fade exit, and extended 2.5s duration.

## Tasks

- [ ] 1. Update Preloader component
  - Add `descRef` for the description text element
  - Add description text below the counter: *"Hi, I'm Alif Sya'bani. An Informatics Engineering graduate from State Polytechnic of Malang who is passionate about technology, digital innovation, and problem-solving. I love turning ideas into practical solutions through software and continuously exploring new opportunities to grow as a tech professional."*
  - Fade in description alongside counter (descRef starts `autoAlpha: 0`, fades to `autoAlpha: 1`)
  - Extend counter tween duration to 1.8s so total is ~2.5s
  - On exit, add `filter: "blur(8px)"` to the fade-out tween for all elements (counter, glow, desc)
  - Add `%` suffix to the counter display (change `{count}` to `{count}%`)
  - Description styles: `color: rgba(255,255,255,0.65)`, `fontSize: clamp(0.75rem, 1.5vw, 0.95rem)`, centered, `maxWidth: 480px`, `lineHeight: 1.6`, `marginTop: 1.5rem`
  - Fix Tailwind warning: change `z-[99999]` to `z-99999`

- [ ] 2. Update PageTransition component
  - Add a fixed full-screen slide overlay div (`overlayRef`) with position fixed, inset 0, z-index 9999, background `linear-gradient(135deg, #000000 0%, #0a0a1a 60%, #1e3a5f 100%)`, initial transform `translateX(100%)`, flex centered
  - Add a text container div (`textRef`) inside overlay with title `<h2>` and description `<p>`
  - Add route meta map for `/`, `/about`, `/projects`, `/writing`, `/resume` with title and description per route
  - Add `useState` for current page meta (title + description) updated before animation starts
  - Replace the route-change blur/fade with a GSAP timeline: set overlay x to 100% and textRef opacity 0 and y 20, update page meta, slide overlay in (x 100% to 0%, 0.55s power3.inOut), text fade in (opacity 0 y20 to opacity 1 y0, 0.3s power2.out), hold 0.45s, text fade out (opacity 0 y-10, 0.2s power2.in), slide overlay out (x 0% to -100%, 0.5s power3.inOut), reveal content (opacity 1, 0.3s power2.out)
  - Keep first-load blur-fade reveal unchanged; overlay NOT shown on first load
  - Title styles: white, `clamp(3rem, 10vw, 7rem)`, fontWeight 700, letterSpacing -0.03em, centered
  - Description styles: `rgba(255,255,255,0.7)`, `clamp(0.9rem, 2vw, 1.2rem)`, centered, marginTop 0.75rem
  - Content wrapper starts at opacity 0 and is reset to opacity 0 at start of each route-change before revealing at end

## Task Dependency Graph

```json
{
  "waves": [
    ["1", "2"]
  ]
}
```

Tasks 1 and 2 are independent and can run in parallel.

## Notes
- Both files: `components/Preloader.tsx` and `components/PageTransition.tsx`
- Uses GSAP for all animations, no new dependencies needed
- `ClientRoot.tsx` does not need changes
