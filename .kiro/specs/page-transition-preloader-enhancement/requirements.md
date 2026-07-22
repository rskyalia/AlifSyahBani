# Requirements — Page Transition & Preloader Enhancement

## 1. PageTransition — Slide Overlay

- REQ-1: When the user navigates to a new route, a full-screen overlay slides in from the right edge of the viewport and travels to the center (x: 100% → 0%).
- REQ-2: The overlay background uses a dark black-to-blue gradient: `linear-gradient(135deg, #000000 0%, #0a0a1a 60%, #1e3a5f 100%)`.
- REQ-3: While the overlay is centered, the destination page title is displayed in large white text in the center of the overlay.
- REQ-4: A short description subtitle is displayed in smaller white text directly below the title.
- REQ-5: The title and description text fade in smoothly while the overlay holds at center.
- REQ-6: After a brief hold, the text fades out, then the overlay slides out to the left (x: 0% → -100%).
- REQ-7: The new page content is revealed after the overlay exits.
- REQ-8: Per-route labels and descriptions:
  - `/` → "Home" / "Welcome to my portfolio"
  - `/about` → "About" / "Designer & Developer from Indonesia"
  - `/projects` → "Projects" / "A collection of my work"
  - `/writing` → "Writing" / "Thoughts & ideas in writing"
  - `/resume` → "Resume" / "My professional journey"
- REQ-9: On first load (after preloader), the page content reveals with the existing blur-fade (no slide overlay).
- REQ-10: All animations use GSAP timeline.

## 2. Preloader

- REQ-11: Background is solid black (`#000000`).
- REQ-12: An animated counter counts from 0 to 100 with a `%` suffix, displayed in large gradient white-to-blue text with blue glow.
- REQ-13: Total preloader duration is approximately 2.5 seconds.
- REQ-14: A portfolio description text is shown below the counter in white.
  - Text: *"Hi, I'm Alif Sya'bani. An Informatics Engineering graduate from State Polytechnic of Malang who is passionate about technology, digital innovation, and problem-solving. I love turning ideas into practical solutions through software and continuously exploring new opportunities to grow as a tech professional."*
- REQ-15: The description fades in alongside the counter appearance.
- REQ-16: On exit, the entire preloader wrapper fades out with a blur effect before calling `onComplete`.
- REQ-17: The preloader sits above all other content (z-index highest).
