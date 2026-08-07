# Requirements Document

## Introduction

Fitur Black Hole Visual Theme adalah transformasi visual menyeluruh pada portfolio website dari tema space aurora biru/ungu menjadi estetika black hole — hitam pekat dengan aksen golden/amber (terinspirasi Gargantua dari film Interstellar). Perubahan mencakup: penggantian model 3D background dengan `black_hole.glb` menggunakan React Three Fiber, pembaruan color palette dark mode ke hitam pekat (`#000000`) dan golden amber (`#F59E0B`), penataan ulang semua heading menjadi center-aligned, serta komponen baru `BlackHoleBackground.tsx` sebagai fullscreen fixed background canvas.

Stack: Next.js 14, TypeScript, React Three Fiber (R3F), @react-three/drei, GSAP, Tailwind CSS v4.

---

## Glossary

- **BlackHoleBackground**: Komponen React baru yang merender model `black_hole.glb` sebagai fullscreen fixed-position R3F Canvas di dark mode.
- **BackgroundScene**: Komponen orchestrator background yang memilih antara `BlackHoleBackground` (dark) dan `RoomBackground` (light).
- **PlanetModel**: Komponen model 3D yang tampil di Hero section (kanan, desktop). Diupdate untuk load `black_hole.glb`.
- **SectionHeader**: Komponen heading section reusable. Default alignment diubah ke `"center"`.
- **Hero**: Komponen halaman utama/home. Layout diubah fullwidth center-aligned.
- **Navbar**: Komponen navigasi atas. Warna dark mode diupdate ke hitam pekat + border golden.
- **ThemeToggle**: Komponen tombol switch light/dark. Warna ikon dark mode diubah ke amber/golden.
- **ThemeContext**: Context React yang menyediakan nilai `theme` (`"light"` | `"dark"`) ke seluruh komponen.
- **R3F Canvas**: React Three Fiber Canvas element — renderer WebGL untuk 3D scene.
- **GLTF**: Format file 3D binary (`.glb`) yang diload via `useGLTF` hook dari `@react-three/drei`.
- **Accretion_Disk**: Efek pencahayaan golden di sekitar model black hole, disimulasikan via point lights berwarna amber.
- **Dark_Mode_Token**: CSS variable yang dikontrol oleh ThemeContext, menentukan warna background, foreground, dan accent pada dark mode.
- **Opacity_Invariant**: Properti yang menyatakan nilai opacity model 3D selalu berada dalam rentang `[0.0, 1.0]`.
- **Z_Index_Layer**: Urutan lapisan rendering visual — BackgroundScene selalu di `z-index: -1`, konten halaman di `z-index: 0` atau lebih tinggi.

---

## Requirements

### Requirement 1: BlackHoleBackground Component

**User Story:** As a visitor, I want to see a black hole visual as the fullscreen background in dark mode, so that the portfolio has a dramatic and immersive Interstellar-inspired aesthetic.

#### Acceptance Criteria

1. THE BlackHoleBackground SHALL mount an R3F Canvas with `position: fixed`, `inset: 0`, and `z-index: -1` when dark mode is active.
2. WHEN the BlackHoleBackground component mounts, THE BlackHoleBackground SHALL load `black_hole.glb` from `/models/black_hole.glb` via `useGLTF`.
3. WHEN `black_hole.glb` is loaded, THE BlackHoleBackground SHALL scale the model so that its maximum bounding box dimension equals `3.0` units.
4. WHEN `black_hole.glb` is loaded, THE BlackHoleBackground SHALL center the model at the scene origin by offsetting `position` to the negation of the bounding box center.
5. THE BlackHoleBackground SHALL render with `pointerEvents: "none"` so that it does not capture user interactions.
6. THE BlackHoleBackground SHALL set `aria-hidden="true"` on its container element so that screen readers ignore the decorative background.

---

### Requirement 2: Black Hole Model Fade-In Animation

**User Story:** As a visitor, I want the black hole background to appear smoothly rather than pop in abruptly, so that the visual transition feels polished and cinematic.

#### Acceptance Criteria

1. WHEN BlackHoleBackground mounts, THE BlackHoleBackground SHALL initialize all mesh materials with `transparent: true` and `opacity: 0`.
2. WHEN each animation frame renders, THE BlackHoleBackground SHALL increment the model opacity by `delta * 0.8` per frame until opacity reaches `1.0`.
3. WHILE the model opacity is less than `1.0`, THE BlackHoleBackground SHALL apply the current opacity value to all mesh materials in the scene.
4. WHEN the model opacity reaches `1.0` or is at `0.0` and not incrementing, THE BlackHoleBackground SHALL stop modifying material opacity on subsequent frames.
5. THE BlackHoleBackground SHALL ensure opacity never exceeds `1.0` at any frame (clamped via `Math.min(1, value)`).

---

### Requirement 3: Black Hole Model Rotation

**User Story:** As a visitor, I want the black hole to slowly rotate continuously, so that the visual effect feels alive and gravitationally authentic.

#### Acceptance Criteria

1. WHILE BlackHoleBackground is mounted, THE BlackHoleBackground SHALL rotate the model around the Y-axis by `delta * 0.05` radians per frame.
2. THE BlackHoleBackground SHALL apply rotation at a speed of `0.05` radians per frame-second, producing a slow and dramatic rotation effect.

---

### Requirement 4: Black Hole Lighting — Accretion Disk Effect

**User Story:** As a visitor, I want the black hole model to be lit with golden/amber lights simulating an accretion disk, so that the visual resembles the Gargantua depiction from Interstellar.

#### Acceptance Criteria

1. THE BlackHoleBackground SHALL render an ambient light with `intensity: 0.05` to provide minimal fill lighting.
2. THE BlackHoleBackground SHALL render a point light at position `[0, 0, 4]` with `color: "#FFB300"`, `intensity: 12`, and `distance: 30`.
3. THE BlackHoleBackground SHALL render a point light at position `[4, 2, 2]` with `color: "#F59E0B"`, `intensity: 6`, and `distance: 25`.
4. THE BlackHoleBackground SHALL render a point light at position `[-4, -2, 2]` with `color: "#D97706"`, `intensity: 4`, and `distance: 20`.
5. THE BlackHoleBackground SHALL render a directional light at position `[0, 5, 5]` with `color: "#FDE68A"` and `intensity: 0.8`.
6. THE BlackHoleBackground SHALL use `THREE.ACESFilmicToneMapping` with `toneMappingExposure: 1.4` fully applied to the R3F Canvas renderer, and the renderer SHALL be considered non-compliant if the tone mapping configuration is not applied.

---

### Requirement 5: BackgroundScene Orchestration

**User Story:** As a developer, I want BackgroundScene to switch between BlackHoleBackground and RoomBackground based on theme, so that each mode has its appropriate visual background.

#### Acceptance Criteria

1. WHEN `theme === "dark"`, THE BackgroundScene SHALL render `BlackHoleBackground` and SHALL NOT render `RoomBackground`.
2. WHEN `theme === "light"`, THE BackgroundScene SHALL render `RoomBackground` and SHALL NOT render `BlackHoleBackground`.
3. THE BackgroundScene SHALL read the theme value from `ThemeContext` via the `useTheme` hook.
4. THE BackgroundScene SHALL NOT import or render `PlanetModel` or `SpaceBackground` components.

---

### Requirement 6: Dark Mode Color Token Update

**User Story:** As a visitor, I want the dark mode color scheme to use pure black and golden/amber accents instead of blue, so that the theme is consistent with the black hole aesthetic.

#### Acceptance Criteria

1. THE Dark_Mode_Token for `--background` SHALL have the value `#000000` in dark mode.
2. THE Dark_Mode_Token for `--foreground` SHALL have the value `#f5f0e8` (warm white) in dark mode.
3. THE Dark_Mode_Token for `--accent` SHALL have the value `#F59E0B` (amber-500) in dark mode.
4. THE Dark_Mode_Token for `--accent-glow` SHALL have the value `rgba(245,158,11,0.35)` in dark mode.
5. IF the current theme is dark mode, THEN THE globals.css SHALL NOT define any `--accent` or `--accent-glow` value that contains a blue (`#3b82f6`) color component.

---

### Requirement 7: Section and UI Element Golden Accent

**User Story:** As a visitor, I want all accent colors, borders, and glows in dark mode to use golden/amber tones, so that the visual language is coherent across all UI elements.

#### Acceptance Criteria

1. WHEN dark mode is active, THE SectionHeader SHALL render the `.section-label` element with `color: rgba(251,191,36,0.75)` and `border: 1px solid rgba(245,158,11,0.25)`.
2. WHEN dark mode is active, THE SectionHeader SHALL render the `.section-title` gradient as `linear-gradient(135deg, #ffffff 0%, #FDE68A 50%, #F59E0B 100%)`.
3. WHEN dark mode is active, THE Hero SHALL render the `.btn-primary` button with `background: linear-gradient(135deg, #D97706, #F59E0B)` and `box-shadow: 0 0 24px rgba(245,158,11,0.3)`.
4. WHEN dark mode is active, THE Hero SHALL render the `.hero-heading--dark` gradient as `linear-gradient(135deg, #ffffff 0%, #FDE68A 55%, #F59E0B 100%)`.
5. WHEN dark mode is active, THE Hero SHALL render subheading text using `text-amber-100/65` Tailwind class instead of blue.
6. WHEN dark mode is active, THE Hero SHALL render secondary subtext using `text-amber-200/45` Tailwind class instead of blue.

---

### Requirement 8: Heading Center Alignment

**User Story:** As a visitor, I want all section headings to be centered across all pages, so that the layout feels modern and symmetrical with the black hole centered background.

#### Acceptance Criteria

1. THE SectionHeader component SHALL use `align="center"` as its default value for the `align` prop.
2. WHEN SectionHeader renders with the default `align` prop, THE SectionHeader SHALL apply both `text-center` AND `mx-auto` CSS classes to the heading element, and the component SHALL be considered non-compliant if either class is missing.
3. WHEN SectionHeader renders on the About page, Projects page, and Writing page, THE SectionHeader SHALL display headings as center-aligned.

---

### Requirement 9: Hero Layout Center Alignment

**User Story:** As a visitor, I want the Hero section content to be centered on all viewport sizes, so that the layout is balanced and works harmoniously with the fullscreen black hole background.

#### Acceptance Criteria

1. THE Hero SHALL render its main content column as fullwidth (`w-full`) with `items-center` and `text-center` on all viewport sizes.
2. THE Hero SHALL NOT apply `md:text-left` or `md:w-[52%]` responsive modifiers to the main content column.
3. WHEN the badge element renders in Hero, THE Hero SHALL apply `flex justify-center` to its container only when the badge element is actually present in the render output.
4. WHEN the socials element renders in Hero, THE Hero SHALL apply `flex justify-center` to its container only when the socials element is actually present in the render output.
5. WHEN the CTA buttons render in Hero, THE Hero SHALL apply `flex flex-wrap items-center justify-center` to its container only when the CTA buttons are actually present in the render output.
6. WHEN the stats element renders in Hero, THE Hero SHALL apply `mt-6 flex justify-center` to its container only when the stats element is actually present in the render output.

---

### Requirement 10: PlanetModel Update to Black Hole

**User Story:** As a visitor, I want the 3D model displayed in the Hero section to show a black hole instead of a planet, so that the Hero visual is consistent with the overall black hole theme.

#### Acceptance Criteria

1. THE PlanetModel SHALL load `/models/black_hole.glb` as its 3D model source.
2. WHEN dark mode is active, THE PlanetModel SHALL use `toneMappingExposure: 1.2` for the R3F Canvas renderer.
3. WHEN dark mode is active, THE PlanetModel SHALL render a directional light with `color: "#FFB300"`.
4. WHEN dark mode is active, THE PlanetModel SHALL render a key point light with `color: "#F59E0B"` and `intensity: 10`.
5. WHEN dark mode is active, THE PlanetModel SHALL render a fill point light with `color: "#D97706"` and `intensity: 6`.
6. THE PlanetModel SHALL use `autoRotateSpeed: 0.4` (reduced from 0.8) for a slower, more dramatic rotation.
7. THE PlanetModel SHALL preload the model via `useGLTF.preload("/models/black_hole.glb")` at module level.

---

### Requirement 11: Navbar Dark Mode Update

**User Story:** As a visitor, I want the navbar in dark mode to use pure black with golden border accents instead of blue-tinted backgrounds, so that the navigation is consistent with the black hole theme.

#### Acceptance Criteria

1. WHEN dark mode is active and the navbar is in scrolled state, THE Navbar SHALL apply `bg-[rgba(0,0,0,0.88)]` as its background.
2. WHEN dark mode is active and the navbar is in scrolled state, THE Navbar SHALL apply `shadow-[0_8px_32px_rgba(0,0,0,0.8),0_0_0_1px_rgba(251,191,36,0.12)]` as its shadow, and the scrolled shadow SHALL always be present when the navbar is in scrolled state.
3. WHEN dark mode is active and the navbar is in default (unscrolled) state, THE Navbar SHALL apply `bg-[rgba(0,0,0,0.65)]` as its background.
4. WHEN dark mode is active and the navbar is in default state, THE Navbar SHALL apply `shadow-[0_4px_24px_rgba(0,0,0,0.6),0_0_0_1px_rgba(251,191,36,0.08)]` as its shadow.
5. WHEN dark mode activates, THE Navbar SHALL remove any blue-tinted background classes (`rgba(8,14,35,*)` or `rgba(10,18,45,*)`) and replace them with the required black backgrounds.
---

### Requirement 12: ThemeToggle Dark Mode Update

**User Story:** As a visitor, I want the theme toggle button to use golden/amber styling in dark mode, so that the toggle button is visually consistent with the overall golden accent theme.

#### Acceptance Criteria

1. WHEN dark mode is active, THE ThemeToggle SHALL apply `border border-amber-400/20` to its button element.
2. WHEN dark mode is active, THE ThemeToggle SHALL apply `hover:bg-amber-400/10` hover state to its button element.
3. WHEN dark mode is active, THE ThemeToggle SHALL apply `text-amber-300` for the icon color.
4. WHEN dark mode is active, THE ThemeToggle button MAY retain blue-family classes in the DOM as long as amber styling (`border-amber-400/20`, `hover:bg-amber-400/10`, `text-amber-300`) takes visual precedence through CSS specificity.

---

### Requirement 13: Error Resilience — Model Load Failure

**User Story:** As a visitor, I want the website to remain usable even if the black hole 3D model fails to load, so that a WebGL or file loading error does not break the user experience.

#### Acceptance Criteria

1. IF `black_hole.glb` fails to load, THEN THE BlackHoleBackground SHALL display an empty background without crashing the page.
2. IF `black_hole.glb` fails to load, THEN THE page content SHALL remain readable using the CSS `--background: #000000` fallback.
3. IF the browser does not support WebGL, THEN THE BackgroundScene SHALL gracefully degrade to a CSS-only background without a JavaScript error propagating to the page.
4. IF `black_hole.glb` fails to load in PlanetModel, THEN THE PlanetModel SHALL display a loading indicator via `<Html center>Loading…</Html>` from `@react-three/drei`.

---

### Requirement 14: Z-Index Layer Separation

**User Story:** As a visitor, I want the black hole background to always stay behind the page content, so that text, buttons, and interactive elements are always visible and clickable.

#### Acceptance Criteria

1. THE BlackHoleBackground Canvas container SHALL have `z-index: -1` at all times.
2. THE page content rendered by ClientRoot, Navbar, and page components SHALL have `z-index: 0` or higher.
3. WHEN BackgroundScene renders, THE Z_Index_Layer order SHALL ensure background is always visually behind all interactive content.

---

### Requirement 15: Performance — Single Canvas Strategy

**User Story:** As a developer, I want the application to manage WebGL contexts efficiently, so that rendering performance is maintained especially on mobile devices.

#### Acceptance Criteria

1. THE BackgroundScene SHALL render at most one R3F Canvas for the background at any given time.
2. THE BlackHoleBackground SHALL call `useGLTF.preload("/models/black_hole.glb")` at module level to begin asset download before component mount.
3. WHEN the model opacity reaches `1.0`, THE BlackHoleBackground SHALL skip material traversal on subsequent frames to avoid unnecessary per-frame computation.
4. THE BlackHoleBackground Canvas container SHALL have `pointerEvents: "none"` to prevent unnecessary event processing.
