# Implementation Plan: Black Hole Visual Theme

## Overview

Transformasi visual portfolio dari tema space aurora biru/ungu ke estetika black hole — hitam pekat dengan aksen golden/amber (terinspirasi Gargantua dari Interstellar). Implementasi dilakukan secara inkremental: mulai dari CSS tokens, lalu komponen baru `BlackHoleBackground`, kemudian update komponen yang sudah ada, dan diakhiri property-based tests.

Stack: Next.js 14, TypeScript, React Three Fiber, @react-three/drei, GSAP, Tailwind CSS v4, fast-check.

---

## Tasks

- [x] 1. Update dark mode CSS tokens di `globals.css`
  - [x] 1.1 Update CSS variable dark mode: `--background`, `--foreground`, `--accent`, `--accent-glow`
    - Ubah `:root` default tokens: `--background: #000000`, `--foreground: #f5f0e8`, `--accent: #F59E0B`, `--accent-glow: rgba(245,158,11,0.35)`
    - Hapus nilai biru (`#3b82f6`) dari semua token dark mode di `:root`
    - Update `::-webkit-scrollbar-track` dari `#000005` ke `#000000`
    - _Requirements: 6.1, 6.2, 6.3, 6.4, 6.5_

  - [x] 1.2 Update CSS classes accent dari biru ke golden
    - `.section-label`: ganti `color: rgba(147,197,253,0.7)` → `rgba(251,191,36,0.75)`, border dari `rgba(59,130,246,0.25)` → `rgba(245,158,11,0.25)`, background dari `rgba(59,130,246,0.08)` → `rgba(245,158,11,0.08)`
    - `.section-title`: ganti gradient dari `#bfdbfe 50%, #60a5fa 100%` → `#FDE68A 50%, #F59E0B 100%`, drop-shadow dari `rgba(59,130,246,0.3)` → `rgba(245,158,11,0.3)`
    - `.btn-primary`: ganti gradient dari `#2563eb, #3b82f6` → `#D97706, #F59E0B`, border dari `rgba(96,165,250,0.4)` → `rgba(251,191,36,0.4)`, box-shadow glow dari `rgba(59,130,246,0.3)` → `rgba(245,158,11,0.3)`
    - `.hero-heading--dark`: ganti gradient dari `#bfdbfe 50%, #60a5fa 100%` → `#FDE68A 55%, #F59E0B 100%`, drop-shadow dari `rgba(59,130,246,0.35)` → `rgba(245,158,11,0.4)`
    - `.timeline-item::before`: ganti gradient dari `#3b82f6, #60a5fa` → `#D97706, #F59E0B`, box-shadow dari `rgba(59,130,246,0.6)` → `rgba(245,158,11,0.6)`
    - `.timeline-item::after`: ganti warna dari `rgba(59,130,246,0.4)` → `rgba(245,158,11,0.4)`
    - `.description-muted`: ganti `rgba(147,197,253,0.65)` → `rgba(253,230,138,0.65)`
    - `.card-float:hover`: ganti glow dari `rgba(59,130,246,0.1)` → `rgba(245,158,11,0.12)`
    - _Requirements: 7.1, 7.2, 7.3, 7.4_

- [ ] 2. Buat komponen `BlackHoleBackground.tsx`
  - [x] 2.1 Buat file `components/BlackHoleBackground.tsx` dengan struktur dasar
    - Buat container `div` dengan `position: fixed`, `inset: 0`, `zIndex: -1`, `pointerEvents: none`, `aria-hidden`
    - Mount R3F `<Canvas>` fullscreen dengan `camera={{ position: [0,0,8], fov: 45 }}` dan `gl={{ toneMapping: THREE.ACESFilmicToneMapping, toneMappingExposure: 1.4, alpha: true }}`
    - Tambahkan lighting: `ambientLight intensity={0.05}`, tiga `pointLight` (golden `#FFB300`, `#F59E0B`, `#D97706`), satu `directionalLight` (`#FDE68A`)
    - Tambahkan `<OrbitControls enableZoom={false} enablePan={false} enableRotate={false} />`
    - Panggil `useGLTF.preload("/models/black_hole.glb")` di module level
    - _Requirements: 1.1, 1.5, 1.6, 4.1, 4.2, 4.3, 4.4, 4.5, 4.6, 15.2, 15.4_

  - [x] 2.2 Implementasi inner component `BlackHoleSceneModel` di dalam file yang sama
    - Load model via `useGLTF("/models/black_hole.glb")`
    - Di `useEffect([scene])`: hitung bounding box, center model di origin (`position = -center`), scale ke `TARGET_DIM = 3.0`, set semua material `transparent: true, opacity: 0`
    - Di `useFrame(delta)`: fade-in opacity `+= delta * 0.8` (clamped ke 1.0), rotasi Y `+= delta * 0.05`; skip traversal saat `opacity >= 1`
    - Wrap dengan `<Suspense fallback={null}>` untuk graceful degradation
    - _Requirements: 1.2, 1.3, 1.4, 2.1, 2.2, 2.3, 2.4, 2.5, 3.1, 3.2, 13.1, 13.2, 15.3_

  - [-] 2.3 Write property test untuk opacity invariant (Property 3)
    - **Property 3: Opacity Monotonically Increases and Clamps at 1.0**
    - **Validates: Requirements 2.2, 2.5**
    - Buat file `components/BlackHoleBackground.property.test.tsx`
    - Gunakan `fc.float({ min: 0, max: 0.9999 })` untuk initial opacity dan `fc.float({ min: 0.001, max: 0.1 })` untuk delta
    - Assert: `Math.min(1, opacity + delta * 0.8) >= opacity` dan `<= 1`

  - [-] 2.4 Write property test untuk scale invariant (Property 1)
    - **Property 1: Scale Invariant — Model Fits Target Dimension**
    - **Validates: Requirements 1.3**
    - Gunakan `fc.float({ min: 0.01, max: 1000 })` untuk maxDim dan `fc.float({ min: 0.01, max: 10 })` untuk targetDim
    - Assert: hasil `targetDim / maxDim` selalu `> 0` dan `isFinite`

- [x] 3. Checkpoint — Pastikan `BlackHoleBackground.tsx` dapat di-import tanpa error TypeScript
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 4. Update `BackgroundScene.tsx`
  - [x] 4.1 Refactor `BackgroundScene` untuk menggunakan `BlackHoleBackground`
    - Hapus `import SpaceBackground` dan `import PlanetModel`
    - Tambahkan `import BlackHoleBackground from "./BlackHoleBackground"`
    - Ubah render: `theme === "dark"` → `<BlackHoleBackground />`, else → `<RoomBackground />`
    - Hapus blok `<div className="model-bg-canvas"><PlanetModel /></div>`
    - _Requirements: 5.1, 5.2, 5.3, 5.4, 14.1, 14.3, 15.1_

  - [-] 4.2 Write property test untuk theme switch renders exactly one background (Property 7)
    - **Property 7: Theme Switch Renders Exactly One Background**
    - **Validates: Requirements 5.1, 5.2**
    - Buat file `components/BackgroundScene.property.test.tsx`
    - Mock `useTheme` dengan `fc.constantFrom("dark", "light")`
    - Assert: saat dark hanya `BlackHoleBackground` yang render; saat light hanya `RoomBackground`

- [x] 5. Update `PlanetModel.tsx` — ganti model path + lighting golden
  - [x] 5.1 Update `MODEL_PATH` dan lighting ke golden
    - Ubah `MODEL_PATH` dari `/models/hantavirus.glb` → `/models/black_hole.glb`
    - Update `toneMappingExposure`: `isDark ? 1.2 : 0.85` (dari `0.65 : 0.85`)
    - Update `directionalLight` primary color: `isDark ? "#FFB300" : "#ffffff"` (dari `"#fff5e0"`)
    - Update `pointLight` key: `isDark ? "#F59E0B" : "#93c5fd"`, intensity `isDark ? 10 : 3` (dari `"#60a5fa"`, 6)
    - Update `pointLight` fill: `isDark ? "#D97706" : "#93c5fd"`, intensity `isDark ? 6 : 2`
    - Ubah `autoRotateSpeed` dari `0.8` → `0.4`
    - Update `useGLTF.preload` ke path baru
    - Hapus `directionalLight` biru kedua dan ketiga yang sudah tidak relevan untuk dark mode
    - _Requirements: 10.1, 10.2, 10.3, 10.4, 10.5, 10.6, 10.7, 13.4_

- [ ] 6. Update `Hero.tsx` — center alignment + warna accent golden
  - [x] 6.1 Update layout `leftColRef` menjadi fullwidth center-aligned
    - Ubah className `leftColRef` div: hapus `md:w-[52%]`, `md:pl-20 md:pr-8`, `md:text-left`; tambah `items-center`, `md:px-16`, `text-center` (no responsive override)
    - Hapus `md:justify-start` dari container `badgeRef` (hanya `flex justify-center`)
    - Hapus `md:justify-start` dari container `socialsRef`
    - Hapus `md:justify-start` dari container `btnsRef`
    - Hapus `md:justify-start` dari container `statsRef`
    - _Requirements: 9.1, 9.2, 9.3, 9.4, 9.5, 9.6_

  - [x] 6.2 Update warna subtext dari biru ke amber
    - Ubah `text-blue-100/65` → `text-amber-100/65` pada subheading paragraph
    - Ubah `text-blue-200/45` → `text-amber-200/45` pada secondary subtext span
    - Ubah `text-blue-200/30` → `text-amber-300/30` pada scroll indicator
    - Ubah `from-blue-400/50` → `from-amber-400/50` pada scroll indicator line gradient
    - _Requirements: 7.5, 7.6_

  - [-] 6.3 Write property test untuk Hero center alignment (Property 9)
    - **Property 9: Hero Layout Always Center-Aligned**
    - **Validates: Requirements 9.1, 9.2**
    - Buat file `components/Hero.property.test.tsx`
    - Render `Hero` dan assert: `leftColRef` container memiliki `items-center` dan `text-center`; tidak ada `md:text-left` atau `md:w-[52%]` di className

  - [-] 6.4 Write property test untuk Hero container children centered (Property 10)
    - **Property 10: Hero Container Children Always Centered**
    - **Validates: Requirements 9.3, 9.4, 9.5, 9.6**
    - Assert: container badge, socials, CTA, stats masing-masing memiliki `justify-center` dalam className

- [x] 7. Update `SectionHeader.tsx` — default align center
  - [x] 7.1 Ubah default nilai prop `align` dari `"left"` ke `"center"`
    - Ubah parameter default: `align = "center"` (dari `align = "left"`)
    - Pastikan `alignClass` sudah menggunakan `"text-center mx-auto"` saat `align === "center"` (logika sudah benar, hanya default yang berubah)
    - _Requirements: 8.1, 8.2, 8.3_

  - [x] 7.2 Write property test untuk SectionHeader default alignment (Property 8)
    - **Property 8: SectionHeader Default Alignment Classes**
    - **Validates: Requirements 8.1, 8.2**
    - Buat file `components/SectionHeader.property.test.tsx`
    - Render `SectionHeader` tanpa prop `align`; assert container memiliki class `text-center` DAN `mx-auto`

- [x] 8. Update `Navbar.tsx` — warna dark mode hitam + golden border
  - [x] 8.1 Ganti `navBgScrolled` dan `navBgDefault` dark mode values
    - `navBgScrolled` dark: ganti `bg-[rgba(8,14,35,0.85)]` → `bg-[rgba(0,0,0,0.88)]`, shadow ganti ke `shadow-[0_8px_32px_rgba(0,0,0,0.8),0_0_0_1px_rgba(251,191,36,0.12)]`
    - `navBgDefault` dark: ganti `bg-[rgba(10,18,45,0.65)]` → `bg-[rgba(0,0,0,0.65)]`, shadow ganti ke `shadow-[0_4px_24px_rgba(0,0,0,0.6),0_0_0_1px_rgba(251,191,36,0.08)]`
    - Update mobile dropdown `background` dark dari `rgba(8,14,35,0.90)` → `rgba(0,0,0,0.90)`
    - Update mobile dropdown `boxShadow` dark untuk menggunakan warna hitam pekat
    - _Requirements: 11.1, 11.2, 11.3, 11.4, 11.5_

- [x] 9. Update `ThemeToggle.tsx` — warna ikon golden
  - [x] 9.1 Ganti class dark mode dari biru ke amber
    - Ubah dark mode className: `"border border-white/10 bg-white/5 hover:bg-white/12 text-blue-200"` → `"border border-amber-400/20 bg-white/5 hover:bg-amber-400/10 text-amber-300"`
    - _Requirements: 12.1, 12.2, 12.3, 12.4_

- [x] 10. Checkpoint — Semua komponen ter-update, jalankan build untuk verifikasi TypeScript
  - Ensure all tests pass, ask the user if questions arise.

- [x] 11. Property-based tests — opacity, scale, alignment invariants
  - [x] 11.1 Write property test untuk rotation increment correctness (Property 6)
    - **Property 6: Rotation Increment Correctness**
    - **Validates: Requirements 3.1, 3.2**
    - Buat atau extend `BlackHoleBackground.property.test.tsx`
    - Gunakan `fc.float({ min: -Math.PI * 10, max: Math.PI * 10 })` untuk `prevRotationY` dan `fc.float({ min: 0.001, max: 0.1 })` untuk delta
    - Assert: `prevRotationY + delta * 0.05 === newRotationY` (dalam floating-point tolerance)

  - [x] 11.2 Write property test untuk opacity stable state (Property 5)
    - **Property 5: Opacity Stable State — No Redundant Traversal**
    - **Validates: Requirements 2.3, 2.4, 15.3**
    - Assert: saat `opacity === 1.0`, fungsi frame-update tidak mengubah nilai opacity (output === input)

  - [x] 11.3 Write unit test untuk error resilience — model load failure (Requirement 13)
    - Mock `useGLTF` untuk throw error
    - Assert: `BlackHoleBackground` render tanpa crash (Suspense fallback `null` ditampilkan)
    - Assert: `PlanetModel` menampilkan `<Html center>Loading…</Html>` saat Suspense pending
    - _Requirements: 13.1, 13.2, 13.3, 13.4_

- [x] 12. Final checkpoint — Pastikan semua test lulus dan build bersih
  - Ensure all tests pass, ask the user if questions arise.

---

## Notes

- Tasks bertanda `*` adalah optional dan bisa di-skip untuk MVP yang lebih cepat
- Semua dependency sudah tersedia: `@react-three/fiber`, `@react-three/drei`, `three`, `gsap`, `tailwindcss`, `fast-check`
- File model `public/models/black_hole.glb` diasumsikan sudah tersedia
- `SpaceBackground.tsx` tidak dihapus dari codebase — hanya tidak lagi digunakan oleh `BackgroundScene`
- Perubahan `SectionHeader` default align ke `"center"` berdampak ke semua halaman (About, Projects, Writing) secara otomatis
- Setiap task mereferensikan requirement spesifik untuk traceability
- Property tests memvalidasi invariant universal yang disebutkan di design document

## Task Dependency Graph

```json
{
  "waves": [
    { "id": 0, "tasks": ["1.1", "1.2"] },
    { "id": 1, "tasks": ["2.1", "4.1", "7.1", "8.1", "9.1"] },
    { "id": 2, "tasks": ["2.2", "5.1", "6.1", "6.2"] },
    { "id": 3, "tasks": ["2.3", "2.4", "4.2", "6.3", "6.4", "7.2"] },
    { "id": 4, "tasks": ["11.1", "11.2", "11.3"] }
  ]
}
```
