# Phase 2: Security & Performance Review

## Security Findings

**Overall Risk: LOW** — No backend, no user auth, no user-generated content, zero dangerouslySetInnerHTML uses, no API keys in source code.

### Medium

| ID | File | Issue |
|----|------|-------|
| SEC-M01 | `App.jsx` (entire tree) | No React Error Boundary — blank white screen on any render error |
| SEC-M02 | Missing `vercel.json` | No security headers: no CSP, no X-Frame-Options, no HSTS, no Referrer-Policy |
| SEC-M03 | `vite.config.js` | Source maps enabled in production — exposes full source code structure |
| SEC-M04 | `useTheme.js:5,10` | `localStorage` read/write without try/catch — crashes in sandboxed/SSR environments |

### Low

| ID | File | Issue |
|----|------|-------|
| SEC-L01 | `HomeEndFrame.jsx:14`, `Nav.jsx:275` | Missing `noopener` on external links (only `noreferrer`) |
| SEC-L02 | `HomeReel.jsx:181`, `Nav.jsx:47` | Custom DOM events bypass React data flow — exploitable only for cosmetic changes |
| SEC-L03 | `siteContent.js:9–14` | Placeholder video URLs from 3rd-party domains (MDN, filesamples.com) — replace before launch |

### Informational (no action needed)
- Zero XSS vulnerabilities — no dangerouslySetInnerHTML anywhere
- Zero sensitive data in source code — no API keys, tokens, credentials
- All dependencies current, no known CVEs
- `private: true` in package.json prevents accidental publish

### Quick wins (security)
1. `vercel.json` with security headers — **30 min** (biggest bang for buck)
2. Disable production source maps in vite.config.js — **5 min**
3. Add Error Boundary — **30 min**
4. localStorage try/catch — **15 min**

---

## Performance Findings

### Critical

| ID | File | Issue | Mobile Impact |
|----|------|-------|---------------|
| PERF-C01 | `HomeReel.jsx:390,397` | `getBoundingClientRect()` on every GSAP tick → layout thrashing | 60fps → 15–20fps during scroll |
| PERF-C02 | `HomeReel.jsx:113–138` | 4 autoplay videos render simultaneously on page load | Blocks LCP by 2–4s on 4G |
| PERF-C03 | `HomeReel.jsx:554–613` | 6 comparison videos also render on page load (never visible until deep scroll) | 10 concurrent videos total |
| PERF-C04 | `siteContent.js:1–7` | All portfolio images are raw PNG screenshots (~2–5MB each) | LCP estimate: 4–8s on mobile |
| PERF-C05 | `HomeReel.css` + 14 other CSS files | 15 permanent `will-change` declarations — never removed after animation | 80–150MB GPU memory waste |
| PERF-C06 | Multiple CSS files | Multiple simultaneous `backdrop-filter: blur()` layers | 60fps → sub-30fps on mobile |
| PERF-C07 | `HomeReel.jsx:198–478` | `applyStage()` = 280 lines, ~80 DOM ops, React state updates inside GSAP tick | Main thread stalls every interaction during scroll |

### High

| ID | File | Issue |
|----|------|-------|
| PERF-H01 | `vite.config.js` | No `manualChunks` — GSAP (~180KB) may duplicate across lazy chunks |
| PERF-H02 | `index.css:46` | Tailwind imported + processed with zero utility classes used |
| PERF-H03 | `PageTransition.css:2` | `will-change: transform, opacity` on `.page-stage` — promotes ENTIRE PAGE to GPU layer |
| PERF-H04 | `TextSwap.css:59` | `will-change` on every letter layer permanently — ~48 GPU layers for nav alone |
| PERF-H05 | `HomeReel.css:532–540` | `home-reel-drift` CSS animation runs infinite on invisible elements |
| PERF-H06 | `HomeClientBand.jsx:4–5` | 60 DOM nodes for 5 client names (6× repetition, only 2× needed = 20 nodes) |
| PERF-H07 | `ComparisonSlider.jsx:55` | 21 video event listeners active simultaneously (3 sliders × 7 events) |
| PERF-H08 | `HomeReel.css:495–498` | CSS `filter: grayscale+saturate+contrast+brightness` on playing video — 60× GPU processing/sec |

### Medium

| ID | File | Issue |
|----|------|-------|
| PERF-M01 | `index.html` | Missing `<link rel="preconnect">` for Vercel Blob CDN — +200–600ms cold load |
| PERF-M02 | `index.html:37–38` | SpaceMono-Regular not preloaded — FOUT on all UI micro-labels visible at paint |
| PERF-M03 | `HomeReel.jsx:122` | First video has `preload="auto"` — may download entire file on desktop |
| PERF-M04 | `HomeReel.jsx:116` | Poster images are unoptimized PNGs — LCP candidate loads last in waterfall |
| PERF-M05 | `usePrefersReducedMotion.js:4` | Initializes to `false` — double-render on reduced-motion devices |
| PERF-M06 | `StudioPage.jsx:127` | Studio about image missing `width`/`height` — CLS risk |
| PERF-M07 | `index.css:108` | `scroll-behavior: smooth` conflicts with GSAP scroll resets — visual glitch on route change |
| PERF-M08 | Multiple CSS | No `@media (hover: hover)` guard — hover animations "stuck" after tap on mobile |
| PERF-M09 | `HomeReel.css:62–64` | `clip-path: inset(calc(...))` with CSS vars updated 60×/sec — repaint boundary |
| PERF-M10 | `Nav.jsx:68–75` | GSAP tween on mobile menu not killed on close — orphaned tweens accumulate |
| PERF-M11 | `ProjectDetailPage.jsx:27` | GSAP context not scoped to sectionRef — may target wrong elements in transitions |
| PERF-M12 | `index.css` | Cormorant Garamond loaded on every page, only used in `/proyectos` |

### Core Web Vitals Risk Summary

| Metric | Target | Estimated Current | Primary Causes |
|--------|--------|-------------------|----------------|
| **LCP** | < 2.5s | **4–8s mobile** | JS-blocked render, unoptimized PNGs, no CDN preconnect, 10 competing video requests |
| **CLS** | < 0.1 | **0.15–0.3** | Space Mono FOUT, studio image no dimensions, client band font shift |
| **INP** | < 200ms | **300–500ms** | React state inside GSAP tick, layout thrashing, 6 video decoders competing for CPU |

---

## Critical Issues for Phase 3 Context

1. **No React Error Boundary** — test coverage should include error states
2. **10 autoplay videos** — tests should verify lazy loading behavior
3. **Permanent `will-change`** — consider testing animation setup/teardown
4. **`applyStage` complexity** — test coverage for scroll logic is critical given 280-line function
5. **Source maps in production** — CI should enforce `sourcemap: false` for production builds
6. **Placeholder video URLs** — tests reference real external URLs that may break
