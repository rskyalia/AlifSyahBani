# Requirements Document

## Introduction

Redesain portfolio Alif Sya'bani menjadi "GSAP Style Modern Portfolio" — sebuah pengalaman web kreatif bergaya studio/creative agency berkelas Awwwards. Redesain ini memanfaatkan infrastruktur yang sudah ada (Next.js 16, React 19, TypeScript, Tailwind CSS v4, GSAP v3.15 + @gsap/react, Lenis, react-three-fiber) dan memperbarui seluruh komponen visual dan animasi sehingga menghasilkan portofolio yang dramatis, sinematik, dan berkesan.

Perubahan mencakup: cinematic preloader, magnetic cursor, Hero parallax + text reveal, Navbar dengan smooth scroll-aware transitions, scroll-triggered animations pada semua section, card hover dengan magnetic/distortion effect, number counter, typografi besar ala Awwwards, dan integrasi Lenis ↔ ScrollTrigger yang lebih ketat.

---

## Glossary

- **Portfolio_App**: Aplikasi Next.js 16 keseluruhan sebagai sistem utama.
- **Preloader**: Komponen full-screen yang ditampilkan saat halaman pertama kali dimuat sebelum konten utama terungkap (`components/Preloader.tsx`).
- **Cursor**: Komponen kursor kustom yang menggantikan kursor default browser (`components/MagneticCursor.tsx` — baru).
- **Navbar**: Komponen navigasi tetap di bagian atas halaman (`components/Navbar.tsx`).
- **Hero**: Seksi pertama halaman utama yang memuat nama, subjudul, CTA, dan model planet (`components/Hero.tsx`).
- **ScrollEngine**: Sistem integrasi Lenis + GSAP ScrollTrigger yang dikelola di `components/SmoothScroll.tsx`.
- **ProjectCard**: Kartu item dalam grid proyek (`components/ProjectCard.tsx`).
- **ExperienceAwards**: Seksi experience dan penghargaan (`components/ExperienceAwards.tsx`).
- **PageTransition**: Komponen overlay transisi antar halaman (`components/PageTransition.tsx`).
- **SectionHeader**: Komponen judul dan deskripsi section (`components/SectionHeader.tsx`).
- **TextReveal**: Teknik animasi teks di mana baris teks terungkap dari balik mask/clip-path.
- **MagneticEffect**: Efek di mana elemen bergerak mendekati kursor saat kursor berada dalam radius tertentu.
- **ParallaxLayer**: Layer visual yang bergerak dengan kecepatan berbeda terhadap scroll.
- **StaggerAnimation**: Animasi di mana beberapa elemen anak dianimasikan secara berurutan dengan jeda waktu kecil.
- **ScrollTrigger**: Plugin GSAP untuk mengaitkan animasi ke posisi scroll.
- **Counter**: Angka yang dianimasikan dari nol ke nilai target saat masuk viewport.
- **ClipPath**: Teknik CSS/GSAP untuk menyembunyikan elemen di balik bentuk geometris yang kemudian dianimasikan terbuka.
- **ThemeContext**: React context yang menyimpan state tema gelap/terang (`components/ThemeContext.tsx`).

---

## Requirements

### Requirement 1: Cinematic Preloader

**User Story:** Sebagai pengunjung, saya ingin melihat loading screen yang sinematik dan berkesan saat halaman pertama kali dibuka, sehingga saya mendapatkan kesan pertama yang kuat tentang portofolio ini.

#### Acceptance Criteria

1. WHEN halaman pertama kali dimuat, THE Preloader SHALL menampilkan layar penuh hitam (`#000000`) dengan counter animasi 0–100%.
2. WHEN counter mencapai 100%, THE Preloader SHALL menjalankan animasi exit dengan efek clip-path yang terbuka dari tengah ke tepi layar, mengungkap konten di baliknya dalam durasi 1.0–1.4 detik.
3. THE Preloader SHALL menampilkan nama "ALIF SYA'BANI" dalam tipografi besar (minimum `clamp(3rem, 10vw, 7rem)`) menggunakan huruf kapital dengan `letter-spacing` minimum `-0.04em` di atas counter.
4. THE Preloader SHALL menampilkan tagline pendek di bawah nama dalam font-size minimum `clamp(0.75rem, 1.5vw, 1rem)` dengan warna `rgba(255,255,255,0.55)`.
5. WHEN Preloader selesai, THE Preloader SHALL memanggil callback `onComplete` dan melepas diri dari DOM (unmount) agar tidak memblokir interaksi pengguna.
6. WHILE Preloader aktif, THE Portfolio_App SHALL memblokir scroll halaman utama (`overflow: hidden` pada `body`).
7. THE Preloader SHALL menggunakan `gsap.timeline()` tunggal dengan `ease: "power4.inOut"` untuk seluruh urutan animasi, agar kurva gerakan terasa sinematik dan konsisten.

---

### Requirement 2: Magnetic Custom Cursor

**User Story:** Sebagai pengunjung desktop, saya ingin kursor kustom yang bereaksi terhadap elemen interaktif di halaman, sehingga pengalaman navigasi terasa lebih hidup dan bertekstur.

#### Acceptance Criteria

1. THE Cursor SHALL merender dua lingkaran konsentris: lingkaran dalam (`dot`) berdiameter 8px yang mengikuti posisi mouse secara instan, dan lingkaran luar (`ring`) berdiameter 40px yang mengikuti posisi mouse dengan jeda (`lerp` 0.1–0.15) menggunakan GSAP ticker.
2. WHEN kursor memasuki elemen yang memiliki atribut `data-magnetic`, THE Cursor SHALL menerapkan MagneticEffect — elemen tersebut bergerak hingga 30% dari jarak kursor ke pusat elemen menggunakan `gsap.to()` dengan `ease: "power2.out"` dan `duration: 0.4`.
3. WHEN kursor meninggalkan elemen `data-magnetic`, THE Cursor SHALL mengembalikan elemen ke posisi aslinya dengan `gsap.to()` `duration: 0.7` `ease: "elastic.out(1, 0.3)"`.
4. WHEN kursor memasuki elemen yang memiliki atribut `data-cursor="link"` (anchor, button, nav item), THE Cursor SHALL memperbesar `ring` menjadi 64px dan mengubah blend-mode menjadi `mix-blend-mode: difference`.
5. WHEN kursor memasuki elemen `data-cursor="card"`, THE Cursor SHALL menampilkan teks "VIEW" di dalam `ring` yang diperbesar menjadi 80px.
6. WHERE perangkat adalah mobile atau touchscreen (`window.matchMedia('(pointer: coarse)')`), THE Cursor SHALL tidak merender sama sekali agar tidak mengganggu UX touch.
7. THE Cursor SHALL selalu berada di atas semua elemen lain dengan `z-index: 99999` dan `pointer-events: none` agar tidak memblokir klik.

---

### Requirement 3: Hero — Parallax & Dramatic Text Reveal

**User Story:** Sebagai pengunjung, saya ingin melihat seksi Hero yang dramatis dengan animasi masuk yang kuat dan efek parallax saat scroll, sehingga saya langsung terpukau saat halaman terbuka.

#### Acceptance Criteria

1. WHEN Preloader selesai dan Hero mount, THE Hero SHALL menjalankan TextReveal pada setiap baris heading — setiap baris dibungkus dalam container overflow-hidden, dan teks muncul dari bawah dengan `y: 110%` → `y: 0%` menggunakan `ease: "power4.out"` dalam `duration: 1.0` dengan stagger 0.12s antar baris.
2. THE Hero SHALL menampilkan nama "ALIF SYA'BANI" dalam tipografi minimum `clamp(3.5rem, 8vw, 7rem)` font-weight 800–900, huruf kapital, dengan `letter-spacing: -0.03em`.
3. WHEN Hero masuk ke viewport dan pengguna scroll ke bawah, THE Hero SHALL menerapkan ParallaxLayer pada teks heading dengan faktor `y: -20%` (bergerak lebih lambat dari scroll speed) menggunakan ScrollTrigger `scrub: 1`.
4. WHEN Hero masuk ke viewport dan pengguna scroll ke bawah, THE Hero SHALL menerapkan ParallaxLayer pada PlanetModel dengan faktor `y: -35%` dan `rotate: 15deg` menggunakan ScrollTrigger `scrub: 1.5`.
5. THE Hero SHALL menampilkan angka statistik minimal 2 buah (contoh: "3+ Years Coding", "10+ Projects") yang muncul dengan StaggerAnimation setelah TextReveal selesai, dengan jeda 0.15s antar item.
6. WHEN pengguna scroll melewati Hero (lebih dari 80% tinggi viewport), THE Hero SHALL memudarkan konten teks dengan `opacity: 0` dan `y: -30px` secara smooth menggunakan ScrollTrigger `scrub: 1`.
7. THE Hero SHALL mempertahankan PlanetModel (react-three-fiber) yang sudah ada dan mengintegrasikannya sebagai elemen parallax tanpa merusak rendering 3D.

---

### Requirement 4: Navbar — Scroll-Aware Elegant Transitions

**User Story:** Sebagai pengunjung, saya ingin Navbar yang berperilaku elegan saat scroll — menyembunyikan diri saat scroll ke bawah dan muncul kembali saat scroll ke atas — sehingga area konten maksimal saat membaca.

#### Acceptance Criteria

1. WHEN pengguna scroll ke bawah lebih dari 80px dari posisi awal, THE Navbar SHALL bersembunyi dengan animasi `y: -100%` menggunakan `gsap.to()` `duration: 0.4` `ease: "power3.in"`.
2. WHEN pengguna scroll ke atas setidaknya 20px dari posisi terakhir scroll ke bawah, THE Navbar SHALL muncul kembali dengan animasi `y: 0` menggunakan `gsap.to()` `duration: 0.5` `ease: "power3.out"`.
3. WHEN halaman pertama kali dimuat (setelah Preloader selesai), THE Navbar SHALL masuk dengan animasi `y: -60px` → `y: 0` `opacity: 0` → `opacity: 1` `duration: 0.8` `ease: "power3.out"`.
4. THE Navbar SHALL menampilkan active indicator sebagai garis horizontal tipis (2px) di bawah item aktif yang bergerak smooth dari satu item ke item lain menggunakan GSAP `duration: 0.3` `ease: "power2.inOut"` alih-alih CSS transition.
5. WHEN Navbar dalam keadaan scroll (scrolled > 20px), THE Navbar SHALL menerapkan `backdrop-filter: blur(24px)` dengan background `rgba(0,0,0,0.85)` di dark mode dan `rgba(255,255,255,0.92)` di light mode.
6. THE Navbar SHALL menerapkan atribut `data-magnetic` dan `data-cursor="link"` pada setiap item navigasi untuk kompatibilitas dengan Cursor.
7. IF menu mobile dibuka, THE Navbar SHALL menampilkan menu dropdown dengan animasi clip-path `inset(0% 0% 100% 0%)` → `inset(0% 0% 0% 0%)` dalam `duration: 0.5` `ease: "power4.inOut"`.

---

### Requirement 5: ScrollEngine — Lenis dan GSAP ScrollTrigger Terintegrasi

**User Story:** Sebagai pengunjung, saya ingin scroll halaman yang sangat halus dan animasi yang terkait scroll berjalan mulus tanpa jitter atau frame drop, sehingga pengalaman browsing terasa premium.

#### Acceptance Criteria

1. THE ScrollEngine SHALL menginisialisasi Lenis dengan `duration: 1.4`, `easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t))`, dan `smoothWheel: true`.
2. THE ScrollEngine SHALL mendaftarkan callback Lenis scroll ke `ScrollTrigger.update` menggunakan `lenis.on('scroll', ScrollTrigger.update)` untuk menjaga sinkronisasi posisi scroll.
3. THE ScrollEngine SHALL menjalankan `lenis.raf(time * 1000)` di dalam `gsap.ticker.add()` dan menetapkan `gsap.ticker.lagSmoothing(0)` untuk frame rate yang stabil.
4. THE ScrollEngine SHALL mengekspor instance Lenis melalui React context (`LenisContext`) sehingga komponen lain dapat memanggil `lenis.scrollTo()` untuk navigasi programatik.
5. WHEN komponen ScrollEngine di-unmount, THE ScrollEngine SHALL memanggil `lenis.destroy()` dan menghapus ticker callback untuk mencegah memory leak.
6. THE ScrollEngine SHALL mendaftarkan plugin `ScrollTrigger`, `ScrollToPlugin`, dan `CustomEase` ke GSAP satu kali di level modul menggunakan `gsap.registerPlugin()`, bukan di dalam `useEffect`.

---

### Requirement 6: Scroll-Triggered Section Animations

**User Story:** Sebagai pengunjung, saya ingin setiap section muncul dengan animasi dramatis saat masuk ke viewport saat scroll, sehingga setiap bagian halaman terasa hidup dan engaging.

#### Acceptance Criteria

1. WHEN SectionHeader masuk viewport (threshold 20% dari bawah), THE SectionHeader SHALL menjalankan TextReveal pada label dan judul dengan ClipPath `clipPath: "inset(0% 0% 100% 0%)"` → `"inset(0% 0% 0% 0%)"` `duration: 0.8` `ease: "power4.out"` per baris.
2. WHEN ProjectCard masuk viewport, THE ProjectCard SHALL muncul dengan `y: 60px` `opacity: 0` → `y: 0` `opacity: 1` dengan StaggerAnimation 0.1s antar kartu menggunakan ScrollTrigger `start: "top 85%"`.
3. WHEN ExperienceAwards masuk viewport, THE ExperienceAwards SHALL menjalankan animasi masuk pada setiap timeline item dengan stagger 0.08s menggunakan `x: -30px` → `x: 0` `opacity: 0` → `opacity: 1`.
4. THE Portfolio_App SHALL menyediakan custom React hook `useScrollReveal(ref, options)` yang membungkus pola ScrollTrigger yang umum digunakan (fade-in-up, clip-reveal, stagger) untuk meminimalkan duplikasi kode.
5. WHEN halaman pertama kali load tanpa scroll, THE Portfolio_App SHALL memastikan semua elemen di luar viewport awal tersembunyi (opacity 0 / clip-path tertutup) hingga ScrollTrigger memicunya saat di-scroll ke.
6. IF pengguna menggunakan `prefers-reduced-motion: reduce`, THE Portfolio_App SHALL menonaktifkan semua ScrollTrigger animations dan menampilkan elemen langsung tanpa animasi gerak.

---

### Requirement 7: ProjectCard — Magnetic Hover & Distortion Effect

**User Story:** Sebagai pengunjung, saya ingin merasakan efek hover yang kaya pada kartu proyek — seperti kartu yang "menarik" kursor dan gambar yang sedikit terdistorsi — sehingga interaksi terasa berdimensi dan menyenangkan.

#### Acceptance Criteria

1. WHEN kursor memasuki area ProjectCard, THE ProjectCard SHALL menerapkan MagneticEffect ringan pada seluruh kartu: kartu bergerak hingga maksimum 12px dari pusat menuju kursor menggunakan `gsap.to()` `duration: 0.4` `ease: "power2.out"`.
2. WHEN kursor bergerak di dalam ProjectCard, THE ProjectCard SHALL menerapkan efek tilt 3D dengan `rotateX` dan `rotateY` maksimum ±8 derajat menggunakan `gsap.to()` berdasarkan posisi kursor relatif terhadap kartu.
3. WHEN kursor memasuki ProjectCard, THE ProjectCard SHALL memperbesar gambar (`img`) dengan `scale: 1.08` dalam `duration: 0.6` `ease: "power2.out"`.
4. WHEN kursor meninggalkan ProjectCard, THE ProjectCard SHALL mengembalikan semua transformasi ke nilai asal (`scale: 1`, `rotateX: 0`, `rotateY: 0`, `x: 0`, `y: 0`) dengan `duration: 0.8` `ease: "elastic.out(1, 0.3)"`.
5. THE ProjectCard SHALL menerapkan `data-cursor="card"` agar Cursor menampilkan label "VIEW" saat hover.
6. THE ProjectCard SHALL membungkus konten dalam `perspective: 1000px` container dan menggunakan `transform-style: preserve-3d` untuk efek tilt 3D yang akurat.

---

### Requirement 8: Number Counter Animation

**User Story:** Sebagai pengunjung, saya ingin melihat angka-angka statistik beranimasi dari nol ke nilai target saat section tersebut pertama kali masuk viewport, sehingga pencapaian terasa lebih impresif dan berkesan.

#### Acceptance Criteria

1. WHEN seksi yang mengandung Counter masuk viewport (ScrollTrigger `start: "top 75%"`), THE Counter SHALL menganimasikan nilai dari 0 ke angka target menggunakan `gsap.to()` pada objek `{ val: 0 }` dengan `ease: "power2.out"` dan `duration: 2.0`.
2. THE Counter SHALL menggunakan `onUpdate` callback untuk memperbarui tampilan angka dibulatkan ke bilangan bulat terdekat (`Math.round`).
3. THE Counter SHALL menampilkan angka dalam tipografi minimum `clamp(2.5rem, 5vw, 4rem)` font-weight 800 dengan unit/suffix yang sesuai (contoh: "+", "x", "%").
4. THE Counter SHALL hanya dianimasikan sekali per sesi halaman — setelah mencapai nilai target, ScrollTrigger untuk Counter tersebut SHALL di-`kill()` menggunakan `once: true`.
5. THE Portfolio_App SHALL menampilkan minimal 3 Counter di halaman utama: "Projects Completed", "Years of Learning", dan satu statistik relevan lainnya (contoh: "Awards Won").

---

### Requirement 9: Cinematic Page Transition

**User Story:** Sebagai pengunjung, saya ingin transisi antar halaman yang sinematik — bukan sekadar fade — sehingga perpindahan halaman terasa seperti pengalaman yang berkelanjutan dan kohesif.

#### Acceptance Criteria

1. WHEN pengguna berpindah halaman, THE PageTransition SHALL menjalankan dua fase: fase "cover" (overlay menutup layar) dan fase "reveal" (overlay membuka layar untuk menampilkan halaman baru).
2. WHEN fase cover dijalankan, THE PageTransition SHALL menampilkan judul halaman tujuan dalam tipografi minimum `clamp(3rem, 10vw, 7rem)` huruf kapital di tengah overlay, yang masuk dengan animasi `y: 60px` → `y: 0` `opacity: 0` → `opacity: 1`.
3. THE PageTransition SHALL menggunakan teknik multi-layer: layer 1 (warna aksen biru `#2563eb`) expand dari kiri dengan `scaleX: 0` → `scaleX: 1` `ease: "power4.inOut"` `duration: 0.9`, dan layer 2 (hitam `#000000`) mengikuti dengan delay 0.1s.
4. WHEN fase reveal dijalankan, THE PageTransition SHALL menarik kedua layer kembali ke kanan dengan `transformOrigin: "right"` secara berurutan, kemudian mengungkap konten halaman baru dengan `opacity: 0` → `opacity: 1` `filter: blur(12px)` → `blur(0)`.
5. THE PageTransition SHALL menyelesaikan seluruh siklus cover + reveal dalam maksimum 2.2 detik agar tidak terasa lambat.
6. WHEN PageTransition aktif (overlay menutupi layar), THE Portfolio_App SHALL mencegah interaksi pengguna (`pointer-events: none` pada overlay) dan menunggu animasi selesai sebelum memperbarui konten.

---

### Requirement 10: Tipografi Besar Ala Awwwards

**User Story:** Sebagai pengunjung, saya ingin melihat tipografi yang besar, bold, dan berkarakter kuat di seluruh halaman — seperti portofolio di Awwwards — sehingga visual hierarchy terasa tegas dan profesional.

#### Acceptance Criteria

1. THE Portfolio_App SHALL menggunakan font Cabinet Grotesk (yang sudah tersedia di `public/fonts/`) sebagai font utama pada semua heading dengan font-weight minimum 700 (Bold) dan untuk hero menggunakan weight 800–900 (ExtraBold/Black).
2. THE Portfolio_App SHALL menetapkan skala tipografi heading sebagai berikut: H1/Hero minimum `clamp(3.5rem, 8vw, 7rem)`, H2/Section title minimum `clamp(2rem, 4vw, 3.5rem)`, H3/Card title minimum `clamp(1.25rem, 2vw, 1.75rem)`.
3. THE Portfolio_App SHALL menerapkan `letter-spacing` negatif pada semua heading besar: minimum `-0.03em` untuk H1 dan minimum `-0.02em` untuk H2.
4. THE Portfolio_App SHALL menetapkan `line-height` pada heading besar maksimum `1.05–1.1` untuk kesan display yang padat dan tegas.
5. THE SectionHeader SHALL menampilkan nomor section (01, 02, 03…) dalam tipografi `clamp(0.65rem, 1vw, 0.8rem)` huruf kapital `letter-spacing: 0.15em` sebagai super-label di atas judul section.
6. WHERE dark mode aktif, THE Portfolio_App SHALL menerapkan gradient teks putih → biru-100 → biru-400 pada heading utama. WHERE light mode aktif, THE Portfolio_App SHALL menerapkan gradient abu-gelap → biru-800 pada heading utama.

---

### Requirement 11: Footer — Animated Entry & Marquee

**User Story:** Sebagai pengunjung, saya ingin footer yang terasa sebagai penutup dramatis — bukan sekadar baris teks kecil — sehingga keseluruhan portofolio terasa lengkap dan berkesan hingga akhir.

#### Acceptance Criteria

1. WHEN Footer masuk viewport, THE Footer SHALL menjalankan TextReveal pada nama "ALIF SYA'BANI" dalam tipografi besar `clamp(3rem, 8vw, 6rem)` yang terungkap dari bawah dengan ClipPath `duration: 0.9` `ease: "power4.out"`.
2. THE Footer SHALL menampilkan sebuah teks marquee/ticker horizontal berisi daftar teknologi atau tagline yang berulang secara terus menerus dengan kecepatan konstan (~40px/s) menggunakan GSAP `repeat: -1` `ease: "none"`.
3. THE Footer SHALL menampilkan link "AVAILABLE FOR WORK" dalam huruf kapital yang memiliki MagneticEffect dan menerapkan atribut `data-magnetic` serta `data-cursor="link"`.
4. WHEN pengguna hover pada link sosial di Footer, THE Footer SHALL menerapkan efek underline animasi yang muncul dari kiri dengan `scaleX: 0` → `scaleX: 1` `transformOrigin: "left"` `duration: 0.3` `ease: "power2.out"`.
5. THE Footer SHALL menggunakan `background: transparent` dan mengandalkan background halaman (space/room scene) sebagai backdrop, tanpa menambahkan background solid tersendiri.

---

### Requirement 12: Aksesibilitas & Performa

**User Story:** Sebagai pengunjung dengan kebutuhan aksesibilitas atau perangkat low-end, saya ingin portofolio tetap dapat digunakan dan performan, sehingga tidak ada pengunjung yang dikecualikan.

#### Acceptance Criteria

1. IF media query `prefers-reduced-motion: reduce` aktif, THE Portfolio_App SHALL menggantikan semua animasi GSAP (TextReveal, parallax, stagger, counter) dengan `opacity: 1` instan tanpa transisi gerak.
2. THE Cursor SHALL tidak dirender pada perangkat touch (`pointer: coarse`) dan tidak boleh memblokir event klik atau tap pada semua perangkat.
3. THE Portfolio_App SHALL mempertahankan semantic HTML: semua heading menggunakan tag `<h1>`–`<h3>` yang hierarkis, semua link menggunakan `<a>`, dan semua button menggunakan `<button>` dengan `aria-label` yang deskriptif.
4. THE Portfolio_App SHALL memastikan rasio kontras teks terhadap background minimum 4.5:1 untuk teks berukuran normal dan 3:1 untuk heading besar, di kedua mode (dark dan light).
5. WHEN animasi scroll-triggered diinisialisasi, THE Portfolio_App SHALL menggunakan `gsap.context()` untuk membungkus semua animasi per komponen dan memanggil `ctx.revert()` di cleanup function `useEffect` untuk mencegah memory leak.
6. THE Portfolio_App SHALL memastikan semua image memiliki atribut `alt` yang deskriptif, dan PlanetModel memiliki `aria-label="Animated 3D planet decoration"` serta `aria-hidden="true"` karena bersifat dekoratif.
