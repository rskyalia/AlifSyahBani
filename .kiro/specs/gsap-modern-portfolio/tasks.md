# Implementation Plan: GSAP Modern Portfolio Redesign

## Overview

Upgrade portfolio Alif Sya'bani ke level creative-agency/Awwwards menggunakan infrastruktur yang sudah ada (Next.js 16, React 19, TypeScript, Tailwind CSS v4, GSAP v3.15, Lenis v1.3.25). Implementasi dilakukan secara incremental: fondasi scroll engine → komponen baru → upgrade komponen bestehende → CSS tokens → aksesibilitas.

## Tasks

- [x] 1. Update CSS typography tokens dan cursor styles di globals.css
  - Tambahkan CSS custom properties: `--text-hero`, `--text-h2`, `--text-h3`, `--text-counter`, `--text-preloader`, `--text-section-label`, `--ls-hero`, `--ls-h2`, `--lh-display`
  - Tambahkan cursor CSS classes: `.cursor-dot`, `.cursor-ring` dengan `pointer-events: none`, `position: fixed`, `z-index: 99999`
  - Nilai mengacu pada token map di design: `clamp(3.5rem, 8vw, 7rem)` untuk hero, dst.
  - _Requirements: 10.1, 10.2, 10.3, 10.4_


- [x] 2. Buat `LenisContext` (`components/LenisContext.tsx`)
  - [x] 2.1 Implementasi `LenisContext` dan `useLenis` hook
    - Buat `createContext<Lenis | null>(null)` dan export `LenisContext`
    - Export `useLenis(): Lenis | null` yang memanggil `useContext(LenisContext)`
    - _Requirements: 5.4_

  - [x] 2.2 Write unit test untuk LenisContext
    - Test bahwa `useLenis()` mengembalikan `null` di luar provider
    - Test bahwa `useLenis()` mengembalikan instance Lenis di dalam provider
    - _Requirements: 5.4_

- [x] 3. Upgrade `SmoothScroll` (`components/SmoothScroll.tsx`)
  - [x] 3.1 Pindahkan GSAP plugin registration ke module-level dan upgrade Lenis config
    - Pindahkan `gsap.registerPlugin(ScrollTrigger, ScrollToPlugin, CustomEase)` ke luar komponen (module scope)
    - Update Lenis config: `duration: 1.4` (dari 1.2)
    - Simpan ticker callback dalam `const tick` sebelum `gsap.ticker.add(tick)` agar cleanup bisa remove exact reference
    - Wrap children dengan `<LenisContext.Provider value={lenisRef.current}>`
    - _Requirements: 5.1, 5.2, 5.3, 5.5, 5.6_

  - [x] 3.2 Write property test untuk LenisContext selalu menyediakan instance valid (Property 13)
    - **Property 13: LenisContext always provides a valid Lenis instance to consumers**
    - **Validates: Requirements 5.4**


- [x] 4. Buat `useScrollReveal` hook (`hooks/useScrollReveal.ts`)
  - [x] 4.1 Implementasi hook dengan preset `fade-up`, `clip-reveal`, dan `stagger`
    - Buat direktori `hooks/` jika belum ada
    - Definisikan interface `ScrollRevealOptions` dengan field `preset`, `staggerTargets`, `staggerDelay`, `start`, `duration`, `ease`, `once`
    - Implementasi `fade-up`: set `{ y: 60, opacity: 0 }` → `{ y: 0, opacity: 1 }` via ScrollTrigger
    - Implementasi `clip-reveal`: set `clipPath: 'inset(0% 0% 100% 0%)'` → `'inset(0% 0% 0% 0%)'`
    - Implementasi `stagger`: terapkan `fade-up` ke setiap child matching `staggerTargets`
    - Guard `prefers-reduced-motion`: jika `true`, langsung set elemen ke final state tanpa animasi
    - Cleanup: `gsap.context(scope)` + `ctx.revert()` di return cleanup
    - _Requirements: 6.4, 6.5, 6.6, 12.1, 12.5_

  - [x] 4.2 Write property test untuk scroll reveal elements start hidden (Property 5)
    - **Property 5: Scroll reveal elements start hidden**
    - **Validates: Requirements 6.5**

  - [x] 4.3 Write property test untuk cleanup on unmount (Property 6)
    - **Property 6: Scroll reveal hook cleans up on unmount**
    - **Validates: Requirements 6.4, 12.5**

  - [x] 4.4 Write property test untuk animasi disuppress saat reduced-motion (Property 12)
    - **Property 12: All animations are suppressed under prefers-reduced-motion**
    - **Validates: Requirements 6.6, 12.1**


- [x] 5. Buat `MagneticCursor` (`components/MagneticCursor.tsx`)
  - [x] 5.1 Implementasi cursor dot + ring dengan GSAP lerp
    - Guard `pointer: coarse` — return `null` jika true
    - Guard SSR: `typeof window !== 'undefined'` sebelum `matchMedia`
    - Render dua `<div>`: `dotRef` (8px) dan `ringRef` (40px), `position: fixed`, `pointer-events: none`, `z-index: 99999`
    - Global `mousemove` listener mengupdate posisi ref `{ x, y }`
    - `gsap.ticker` callback: interpolasi ring position `rx += (mx - rx) * 0.12`
    - `gsap.set(dotRef)` untuk instant dot follow
    - Cleanup: remove listeners, `gsap.ticker.remove`, kill tweens
    - _Requirements: 2.1, 2.6, 2.7_

  - [x] 5.2 Implementasi cursor state changes: `link`, `card`, idle
    - Tambahkan global listeners untuk `data-cursor="link"`: ring → 64px + `mix-blend-mode: difference`
    - Tambahkan global listeners untuk `data-cursor="card"`: ring → 80px + show "VIEW" text
    - Reset ke idle state pada `mouseleave`
    - _Requirements: 2.4, 2.5_

  - [x] 5.3 Implementasi magnetic effect pada `data-magnetic` elements
    - `document.querySelectorAll('[data-magnetic]')` — attach handlers
    - `mousemove`: hitung offset 30% dari `(cursorX - elemCenterX)`, apply `gsap.to(elem, { x, y, duration: 0.4, ease: 'power2.out' })`
    - `mouseleave`: `gsap.to(elem, { x: 0, y: 0, duration: 0.7, ease: 'elastic.out(1, 0.3)' })`
    - _Requirements: 2.2, 2.3_

  - [-] 5.4 Write property test: cursor tidak render pada coarse pointer (Property 2)
    - **Property 2: Cursor never renders on touch/coarse-pointer devices**
    - **Validates: Requirements 2.6, 12.2**

  - [-] 5.5 Write property test: magnetic attraction bounded 30% (Property 3)
    - Ekstrak `computeMagneticOffset(dx, dy)` sebagai pure function untuk testability
    - **Property 3: Magnetic attraction is bounded**
    - **Validates: Requirements 2.2**

  - [-] 5.6 Write property test: magnetic element always returns to origin (Property 4)
    - **Property 4: Magnetic element always returns to origin**
    - **Validates: Requirements 2.3**


- [x] 6. Buat `StatsCounter` (`components/StatsCounter.tsx`)
  - [x] 6.1 Implementasi counter dengan ScrollTrigger dan animasi GSAP
    - Definisikan interface `StatItem { value: number; suffix: string; label: string }`
    - Definisikan interface `StatsCounterProps { stats: StatItem[]; className?: string }`
    - Setiap stat: `<span aria-label="{value}{suffix} {label}">`
    - ScrollTrigger `start: "top 75%"` + `once: true`
    - `gsap.to({ val: 0 }, { val: target, duration: 2.0, ease: 'power2.out', onUpdate() { display = Math.round(...) } })`
    - Font size via CSS class menggunakan `var(--text-counter)` dari globals.css
    - Guard `prefers-reduced-motion`: tampilkan nilai akhir langsung
    - _Requirements: 8.1, 8.2, 8.3, 8.4_

  - [x] 6.2 Write property test: counter animates from 0 and displays integers (Property 10)
    - **Property 10: Counter animates from 0 and displays rounded integers**
    - **Validates: Requirements 8.1, 8.2**

  - [x] 6.3 Write property test: counter fires exactly once per session (Property 11)
    - **Property 11: Counter animation fires exactly once per session**
    - **Validates: Requirements 8.4**

- [x] 7. Checkpoint — pastikan semua komponen baru terbuild tanpa error TypeScript
  - Pastikan semua tests pass, tanyakan kepada user jika ada pertanyaan.


- [x] 8. Upgrade `Preloader` (`components/Preloader.tsx`)
  - [x] 8.1 Restruktur DOM dan tambahkan name/tagline layout
    - Ubah urutan DOM: name → tagline → counter (dari: counter → tagline)
    - Tambahkan `<h1>` "ALIF SYA'BANI": `fontSize: 'var(--text-preloader)'`, `fontWeight: 800`, `letterSpacing: '-0.04em'`, `color: '#ffffff'`
    - Tambahkan tagline: `fontSize: 'var(--text-preloader-tagline)'` ≈ `clamp(0.75rem, 1.5vw, 1rem)`, `color: 'rgba(255,255,255,0.55)'`
    - Set `document.body.style.overflow = 'hidden'` on mount, restore `''` on unmount/onComplete
    - _Requirements: 1.1, 1.3, 1.4, 1.6_

  - [x] 8.2 Ganti exit animation dengan clip-path cinematic reveal
    - Ganti current fade/blur exit dengan: `gsap.to(wrapperRef.current, { clipPath: 'inset(50% 0% 50% 0%)', duration: 1.2, ease: 'power4.inOut', onComplete })`
    - Animasi collapse dari atas dan bawah secara bersamaan (top 0%→50%, bottom 0%→50%)
    - Seluruh sequence dalam satu `gsap.timeline()` dengan `ease: 'power4.inOut'`
    - Panggil `onComplete` saat timeline selesai
    - _Requirements: 1.2, 1.5, 1.7_

  - [x] 8.3 Write property test: onComplete dipanggil tepat satu kali (Property 1)
    - **Property 1: Preloader onComplete is always called exactly once**
    - **Validates: Requirements 1.5**


- [ ] 9. Upgrade `Navbar` (`components/Navbar.tsx`)
  - [x] 9.1 Ganti CSS transitions dengan GSAP hide/show scroll-aware
    - Tambahkan `navRef` pada elemen `<nav>`
    - Hapus semua class `transition-all` dari nav — gunakan GSAP sepenuhnya
    - Scroll listener: track `lastScrollY` dan arah; downward > 80px → `gsap.to(navRef, { y: '-100%', duration: 0.4, ease: 'power3.in' })`; upward ≥ 20px → `gsap.to(navRef, { y: '0%', duration: 0.5, ease: 'power3.out' })`
    - Entry animation on `isReady` (dari `ReadyContext`): `gsap.fromTo(navRef, { y: -60, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out' })`
    - _Requirements: 4.1, 4.2, 4.3_

  - [x] 9.2 Implementasi active indicator dengan GSAP dan tambahkan data attributes
    - Tambahkan `indicatorRef` — `<div>` absolut 2px tall, background `blue-400`, di bawah nav items
    - Pada route change: baca `getBoundingClientRect()` dari active link, `gsap.to(indicatorRef, { x: ..., width: ..., duration: 0.3, ease: 'power2.inOut' })`
    - Tambahkan `data-magnetic` dan `data-cursor="link"` pada setiap nav item `<Link>`
    - _Requirements: 4.4, 4.5, 4.6_

  - [-] 9.3 Implementasi mobile menu clip-path animation
    - Ganti `{menuOpen && ...}` dengan elemen yang selalu render tapi dikontrol clip-path
    - Open: `gsap.to(menuRef, { clipPath: 'inset(0% 0% 0% 0%)', duration: 0.5, ease: 'power4.inOut' })`
    - Close: `gsap.to(menuRef, { clipPath: 'inset(0% 0% 100% 0%)', duration: 0.5, ease: 'power4.inOut' })`
    - _Requirements: 4.7_

  - [-] 9.4 Write property test: navbar scroll visibility invariant (Property 14)
    - **Property 14: Navbar scroll visibility follows direction invariant**
    - **Validates: Requirements 4.1, 4.2**

  - [-] 9.5 Write unit test: data-magnetic dan data-cursor="link" ada di semua nav items
    - Test bahwa setiap NAV_ITEMS memiliki `data-magnetic` dan `data-cursor="link"`
    - **Validates: Requirements 4.6**


- [ ] 10. Upgrade `Hero` (`components/Hero.tsx`)
  - [x] 10.1 Implementasi TextReveal struktur pada heading
    - Wrap setiap baris heading dalam `<div style="overflow: hidden"><span ref>`
    - GSAP animasi: `y: '110%'` → `y: '0%'`, stagger 0.12s antar baris
    - Update font size ke `var(--text-hero)`, `fontWeight: 800`, `letterSpacing: 'var(--ls-hero)'`, `lineHeight: 'var(--lh-display)'`
    - Trigger animasi dari `isReady` (ReadyContext), bukan langsung mount
    - _Requirements: 3.1, 3.2_

  - [x] 10.2 Integrasikan `StatsCounter` dan tambahkan parallax ScrollTrigger
    - Mount `StatsCounter` dengan stats: `[{ value: 3, suffix: '+', label: 'Years Coding' }, { value: 10, suffix: '+', label: 'Projects Built' }, { value: 5, suffix: '+', label: 'Awards Won' }]`
    - Stats muncul dengan StaggerAnimation 0.15s setelah TextReveal selesai
    - ScrollTrigger parallax pada heading: `scrub: 1`, `y: '-20%'`
    - ScrollTrigger parallax pada PlanetModel container: `scrub: 1.5`, `y: '-35%'`, `rotate: 15`
    - ScrollTrigger fade-out: scroll > 80% vh → text `opacity: 0`, `y: -30px`, `scrub: 1`
    - Tambahkan `aria-label="Animated 3D planet decoration"` dan `aria-hidden="true"` pada PlanetModel wrapper
    - _Requirements: 3.3, 3.4, 3.5, 3.6, 3.7, 12.6_

  - [-] 10.3 Write unit test: Hero menampilkan minimal 3 statistik
    - Test bahwa StatsCounter menerima array 3+ stats
    - _Requirements: 8.5_


- [x] 11. Upgrade `SectionHeader` (`components/SectionHeader.tsx`)
  - [x] 11.1 Tambahkan nomor section dan useScrollReveal clip-reveal
    - Ubah komponen menjadi `"use client"` dan tambahkan `useRef`
    - Tambahkan prop opsional `number?: string` (contoh: "01", "02")
    - Render `<span>` nomor dengan `fontSize: 'var(--text-section-label)'`, `letterSpacing: '0.15em'`, huruf kapital
    - Terapkan `useScrollReveal(ref, { preset: 'clip-reveal', duration: 0.8, ease: 'power4.out' })` pada label dan judul
    - Update heading ke `var(--text-h2)` dengan `letterSpacing: 'var(--ls-h2)'`
    - _Requirements: 6.1, 10.2, 10.3, 10.5_

  - [x] 11.2 Write unit test: SectionHeader merender nomor section dengan benar
    - Test bahwa number label render saat prop `number` diberikan
    - _Requirements: 10.5_

- [ ] 12. Upgrade `ProjectCard` (`components/ProjectCard.tsx`)
  - [x] 12.1 Tambahkan 3D tilt + magnetic hover effect
    - Ubah menjadi `"use client"`, tambahkan `useRef<HTMLDivElement>(null)` untuk `cardRef` dan `imgRef`
    - Tambahkan `perspective: '1000px'` dan `transform-style: 'preserve-3d'` pada container
    - Tambahkan `data-cursor="card"` pada container
    - `mouseenter`: `gsap.to(imgRef, { scale: 1.08, duration: 0.6, ease: 'power2.out' })`
    - `mousemove`: hitung `(rx, ry)` normalized -1..1 → terapkan tilt `rotateX: -ry*8, rotateY: rx*8` + magnetic `x: rx*12, y: ry*12`
    - `mouseleave`: reset semua transforms + `imgRef scale: 1`, `duration: 0.8, ease: 'elastic.out(1, 0.3)'`
    - Hapus class `card-float` CSS hover transitions
    - _Requirements: 7.1, 7.2, 7.3, 7.4, 7.5, 7.6_

  - [x] 12.2 Tambahkan scroll-reveal via useScrollReveal
    - Terapkan `useScrollReveal(cardRef, { preset: 'fade-up', start: 'top 85%' })` untuk scroll entry
    - _Requirements: 6.2_

  - [-] 12.3 Write property test: tilt bounded ±8 degrees (Property 7)
    - Ekstrak `computeTiltValues(rx, ry)` sebagai pure function
    - **Property 7: ProjectCard tilt is bounded within ±8 degrees**
    - **Validates: Requirements 7.2**

  - [x] 12.4 Write property test: ProjectCard resets on mouse leave (Property 8)
    - **Property 8: ProjectCard always resets on mouse leave**
    - **Validates: Requirements 7.4**

  - [x] 12.5 Write property test: data-attribute contracts satisfied (Property 9, card portion)
    - Test bahwa `data-cursor="card"` ada pada setiap ProjectCard yang dirender
    - **Property 9: All data-attribute contracts are satisfied**
    - **Validates: Requirements 7.5**


- [x] 13. Upgrade `ExperienceAwards` (`components/ExperienceAwards.tsx`)
  - [x] 13.1 Ganti IntersectionObserver dengan useScrollReveal stagger
    - Hapus `useState(visible)` dan `useEffect` IntersectionObserver
    - Terapkan `useScrollReveal(ref, { preset: 'stagger', staggerTargets: '.timeline-item', staggerDelay: 0.08, start: 'top 85%' })`
    - Tambahkan animasi `x: -30px` → `x: 0` pada setiap `.timeline-item` (custom via stagger preset atau inline)
    - Hapus class `transition-all opacity-0 translate-y-10` yang sebelumnya dipakai untuk CSS transition
    - _Requirements: 6.3_

  - [x] 13.2 Write unit test: ExperienceAwards menggunakan useScrollReveal stagger
    - Test bahwa timeline items muncul dengan stagger animation
    - _Requirements: 6.3_

- [x] 14. Upgrade `Footer` (`components/Footer.tsx`)
  - [x] 14.1 Tambahkan large name heading dengan TextReveal dan marquee
    - Tambahkan `<h2>` "ALIF SYA'BANI" dengan `fontSize: 'clamp(3rem, 8vw, 6rem)'`, `fontWeight: 800`, `letterSpacing: '-0.02em'`
    - Terapkan `useScrollReveal(headingRef, { preset: 'clip-reveal', duration: 0.9, ease: 'power4.out' })`
    - Tambahkan marquee: duplikat tech-stack text, `gsap.to(marqueeRef, { x: '-50%', duration: 20, ease: 'none', repeat: -1 })`
    - Guard: `ResizeObserver` trigger `gsap.invalidate()` + restart jika marquee width = 0
    - _Requirements: 11.1, 11.2_

  - [x] 14.2 Tambahkan "AVAILABLE FOR WORK" link magnetic dan social link underline
    - Tambahkan link "AVAILABLE FOR WORK" dengan `data-magnetic` dan `data-cursor="link"`
    - Social links: wrap `<span>` underline dengan `scaleX: 0` → `scaleX: 1` on hover, `transformOrigin: 'left'`
    - Pastikan `background: transparent` dipertahankan
    - _Requirements: 11.3, 11.4, 11.5_

  - [x] 14.3 Write unit test: Footer memiliki data-magnetic pada "AVAILABLE FOR WORK"
    - Test bahwa link "AVAILABLE FOR WORK" memiliki `data-magnetic` dan `data-cursor="link"`
    - Test bahwa `background: transparent` diterapkan
    - **Property 9 (footer portion): data-attribute contracts**
    - **Validates: Requirements 11.3**

  - [x] 14.4 Write property test: marquee maintains constant velocity (Property 15)
    - **Property 15: Marquee maintains constant velocity**
    - **Validates: Requirements 11.2**


- [x] 15. Update `ClientRoot` untuk merender `MagneticCursor`
  - Tambahkan `<MagneticCursor />` di dalam `<SmoothScroll>`, sebelum `<PageTransition>`
  - Pastikan posisi di luar page content agar tidak terpengaruh layout
  - _Requirements: 2.1, 2.7_

- [x] 16. Panggil `ScrollTrigger.refresh()` setelah Preloader selesai
  - Di `ClientRoot`, tambahkan `ScrollTrigger.refresh()` di dalam callback `onComplete` Preloader
  - Ini memastikan semua ScrollTrigger positions dihitung ulang setelah DOM shift
  - _Requirements: 5.2_

- [x] 17. Accessibility final pass
  - [x] 17.1 Pastikan semua images memiliki `alt` yang deskriptif
    - Audit semua `<img>` tag di ProjectCard, AboutPhoto, dan halaman lain
    - Tambahkan `alt` jika belum ada
    - _Requirements: 12.6_

  - [x] 17.2 Tambahkan `aria-label` dan `aria-hidden` pada PlanetModel
    - Tambahkan `aria-label="Animated 3D planet decoration"` pada wrapper `<div>` PlanetModel
    - Tambahkan `aria-hidden="true"` karena bersifat dekoratif
    - Pastikan semua `<button>` memiliki `aria-label` yang deskriptif
    - _Requirements: 12.3, 12.6_

  - [x] 17.3 Write unit test: PlanetModel wrapper memiliki aria-label dan aria-hidden
    - Test bahwa wrapper PlanetModel memiliki `aria-label="Animated 3D planet decoration"` dan `aria-hidden="true"`
    - _Requirements: 12.6_

- [x] 18. Checkpoint final — semua tests pass dan feature siap
  - Pastikan semua tests pass, build TypeScript sukses tanpa error, dan tanyakan kepada user jika ada pertanyaan.


## Notes

- Tasks bertanda `*` bersifat opsional dan bisa di-skip untuk MVP yang lebih cepat
- Setiap task mereferensikan requirement spesifik untuk traceability
- Checkpoints memastikan validasi incremental di setiap milestone besar
- Property-based tests menggunakan **fast-check** (perlu diinstall: `npm install --save-dev fast-check vitest @testing-library/react @testing-library/user-event`)
- Unit tests menggunakan **Vitest + React Testing Library**
- Semua animasi GSAP dibungkus `gsap.context()` + `ctx.revert()` untuk mencegah memory leak
- Guard `prefers-reduced-motion` wajib ada di semua komponen animasi
- Komponen baru yang perlu dibuat dari nol: `MagneticCursor`, `LenisContext`, `StatsCounter`, dan hook `useScrollReveal`
- Direktori `hooks/` perlu dibuat baru di root project

## Task Dependency Graph

```json
{
  "waves": [
    { "id": 0, "tasks": ["2.1", "4.1"] },
    { "id": 1, "tasks": ["2.2", "3.1", "4.2", "4.3", "4.4"] },
    { "id": 2, "tasks": ["3.2", "5.1", "6.1"] },
    { "id": 3, "tasks": ["5.2", "5.3", "6.2", "6.3", "8.1"] },
    { "id": 4, "tasks": ["5.4", "5.5", "5.6", "8.2", "9.1", "10.1", "11.1", "12.1", "13.1", "14.1"] },
    { "id": 5, "tasks": ["8.3", "9.2", "10.2", "11.2", "12.2", "13.2", "14.2"] },
    { "id": 6, "tasks": ["9.3", "9.4", "9.5", "10.3", "12.3", "12.4", "12.5", "14.3", "14.4"] },
    { "id": 7, "tasks": ["17.1", "17.2"] },
    { "id": 8, "tasks": ["17.3"] }
  ]
}
```
