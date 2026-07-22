# Design — Page Transition & Preloader Enhancement

## PageTransition Component

### Structure
```
<div>                          ← content wrapper (contentRef)
  {children}
</div>
<div>                          ← slide overlay (overlayRef), fixed full-screen
  <div>                        ← text container (textRef), centered
    <h1>{pageTitle}</h1>
    <p>{pageDescription}</p>
  </div>
</div>
```

### Route Map
```ts
const ROUTE_META: Record<string, { title: string; description: string }> = {
  "/":        { title: "Home",     description: "Welcome to my portfolio" },
  "/about":   { title: "About",    description: "Designer & Developer from Indonesia" },
  "/projects":{ title: "Projects", description: "A collection of my work" },
  "/writing": { title: "Writing",  description: "Thoughts & ideas in writing" },
  "/resume":  { title: "Resume",   description: "My professional journey" },
};
```

### GSAP Timeline (route change)
1. **Slide IN** — overlay from `x: "100%"` to `x: "0%"`, duration 0.55s, ease `power3.inOut`
2. **Text fade in** — textRef from `opacity: 0, y: 20` to `opacity: 1, y: 0`, duration 0.3s, ease `power2.out`, overlap with end of slide-in
3. **Hold** — 0.45s pause
4. **Text fade out** — textRef `opacity: 0, y: -10`, duration 0.2s, ease `power2.in`
5. **Slide OUT** — overlay from `x: "0%"` to `x: "-100%"`, duration 0.5s, ease `power3.inOut`
6. **Content reveal** — contentRef `opacity: 1`, duration 0.3s

### First-load reveal (unchanged behavior)
- When `isReady` becomes true: `gsap.fromTo(contentRef, { opacity: 0, filter: "blur(12px)" }, { opacity: 1, filter: "blur(0px)", duration: 0.8, ease: "power2.out" })`
- Overlay is not shown on first load

### Overlay Styles
```
position: fixed
inset: 0
z-index: 9999
background: linear-gradient(135deg, #000000 0%, #0a0a1a 60%, #1e3a5f 100%)
display: flex
align-items: center
justify-content: center
transform: translateX(100%)   ← initial state (off-screen right)
pointer-events: none          ← when not animating
```

### Title Styles
```
color: white
font-size: clamp(3rem, 10vw, 7rem)
font-weight: 700
letter-spacing: -0.03em
text-align: center
```

### Description Styles
```
color: rgba(255,255,255,0.7)
font-size: clamp(0.9rem, 2vw, 1.2rem)
text-align: center
margin-top: 0.75rem
```

---

## Preloader Component

### Structure
```
<div ref={wrapperRef}>          ← full-screen fixed wrapper
  <div ref={glowRef} />         ← blue radial glow (absolute)
  <div ref={counterRef}>        ← counter number + % sign
    {count}%
  </div>
  <div ref={descRef}>           ← description text below counter
    Hi, I'm Alif Sya'bani...
  </div>
</div>
```

### GSAP Timeline
1. **Init** — counterRef, descRef, glowRef all `autoAlpha: 0`
2. **Glow fade in** — `opacity: 1`, duration 0.35s
3. **Counter fade in** — `autoAlpha: 1`, duration 0.3s, overlapping glow
4. **Desc fade in** — `autoAlpha: 1`, duration 0.4s, overlapping counter
5. **Count 0→100** — tween object `val: 0 → 100`, duration 1.8s, ease `power1.inOut`, updates `setCount`
6. **Hold** — 0.25s
7. **Fade out** — all elements `autoAlpha: 0, filter: "blur(8px)"`, duration 0.4s
8. **Call onComplete**

### Total duration: ~2.5s

### Counter Styles (unchanged from current)
```
fontSize: clamp(6rem, 22vw, 14rem)
background: linear-gradient(160deg, #ffffff 20%, #93c5fd 65%, #3b82f6 100%)
WebkitBackgroundClip: text / WebkitTextFillColor: transparent
filter: drop-shadow(0 0 32px rgba(59,130,246,0.75))
```

### Description Styles
```
color: rgba(255,255,255,0.65)
font-size: clamp(0.75rem, 1.5vw, 0.95rem)
text-align: center
max-width: 480px
line-height: 1.6
margin-top: 1.5rem
padding: 0 1.5rem
```
