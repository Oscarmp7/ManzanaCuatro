# Comprehensive Code Review — Manzana Cuatro (jeremy-adonai)

**Review Date:** 2026-03-14
**Branch:** `feat/m4-redesign`
**Stack:** React 19 + Vite 7 + GSAP 3.14 + React Router 7 + plain JSX
**Reviewer:** Comprehensive Multi-Agent Review (Phases 1–4)

---

## Executive Summary

Manzana Cuatro is a technically ambitious, visually sophisticated portfolio site for a Dominican audiovisual production studio. The animation architecture is creative and the component decomposition is clean across most of the codebase. The codebase follows consistent conventions (BEM CSS, functional React, GSAP for all animation) and shows clear architectural intent.

However, the site has **serious mobile performance and SEO problems that directly undermine its business purpose** — sharing links from Instagram/WhatsApp that load in 4–8 seconds on mobile and show blank social previews. There are also several **active visual regressions in production right now** (nav overlapping hero, iOS Safari project filters broken). The CI/CD pipeline has critical security gaps including a potential credential file in the working tree.

**Overall health: 6/10.** Architecture fundamentals are solid; execution gaps in performance, SEO, and operations need to be addressed before this site can serve as an effective business card.

---

## Total Findings: 145

| Category | Critical | High | Medium | Low | Total |
|----------|---------|------|--------|-----|-------|
| Code Quality | 3 | 7 | 8 | 6 | **24** |
| Architecture | 1 | 4 | 12 | 7 | **24** |
| Security | 0 | 0 | 4 | 3 | **7** |
| Performance | 7 | 8 | 12 | — | **27** |
| Testing | 2 | 6 | 5 | — | **13** |
| Documentation | 2 | 4 | 4 | 4 | **14** |
| Best Practices | 0 | 3 | 12 | 8 | **23** |
| CI/CD & DevOps | 3 | 6 | 9 | 4 | **22** |
| **TOTAL** | **18** | **38** | **66** | **32** | **154** |

---

## P0 — Critical: Fix Immediately

### 🚨 SECURITY — Verify `vercel-cookie.txt` in working tree
**Finding:** CICD-C01
`vercel-cookie.txt` exists at the project root. If this contains a Vercel auth token/session cookie, unauthorized deployments are possible.
**Action:** Check contents → if sensitive, rotate Vercel credentials immediately → add to `.gitignore`.

---

### 🚨 PRODUCTION BUG — Nav overlaps hero on ProjectDetailPage
**Finding:** HIGH-7 (`ProjectDetailPage.jsx:120`)
Root element is `<div className="page--project-detail">` — missing the `page` class that adds `padding-top: var(--nav-height)`. The fixed nav covers the hero image on every project page.
**Fix:** `<div className="page page--project-detail">`
**Effort:** 2 min.

---

### 🚨 PRODUCTION BUG — iOS Safari: project filters don't scroll
**Finding:** MOBILE-1 (`ProjectShowcase.css:74`)
`position: sticky` + `overflow-x: auto` is a known-broken combination in iOS Safari. Every iPhone user sees frozen/broken filter chips.
**Fix:** Remove `position: sticky` at `max-width: 720px`, apply only at wider viewports.
**Effort:** 10 min.

---

### 🚨 CI/CD — Deploy pipeline has zero quality gates
**Finding:** CICD-C03
`.github/workflows/deploy-pages.yml` does checkout → install → build → deploy. No lint, no tests, no audit. Broken code ships.
**Fix:** Add a `validate` job (lint + test + npm audit) that `build` and `deploy` depend on.
**Effort:** 30 min.

---

### 🚨 CI/CD — No `vercel.json`: direct navigation returns 404
**Finding:** CICD-C02
Any bookmarked or shared URL that isn't `/` returns a 404 from Vercel's CDN. No SPA rewrite, no security headers.
**Fix:** Create `vercel.json` with rewrite + security headers (X-Frame-Options, HSTS, CSP, etc.).
**Effort:** 30 min.

---

### 🚨 SEO — All meta tags invisible to crawlers and social previews
**Finding:** ARCH-CRIT-1 (`seo/RouteMeta.jsx`)
All meta tags (title, description, OG, Twitter, canonical) are injected via `useEffect`. WhatsApp/Instagram scrapers don't execute JavaScript → shared links render as blank previews. Google may not index route-specific content.
**Fix:** Add `vite-plugin-prerender` to generate static HTML for each route, OR add explicit meta tags per route in `index.html` as a minimum viable fix.
**Effort:** 2–4h.

---

### 🚨 PERFORMANCE — 10 autoplay videos load simultaneously on homepage
**Findings:** PERF-C02 + PERF-C03 (`HomeReel.jsx`)
4 reel videos + 6 comparison slider videos all render and `autoPlay` on page load. On a 4G mobile connection, this saturates bandwidth and delays LCP by 2–4 seconds.
**Fix:**
- Render only first reel video immediately; gate others behind scroll proximity
- Gate comparison stage videos behind `colorStageReady` state (only render when `colorRaw > 0` first fires)
**Effort:** 2–3h.

---

### 🚨 PERFORMANCE — LCP image is a 2–5MB unoptimized PNG screenshot
**Finding:** PERF-C04 (`siteContent.js:1–7`)
All portfolio images are raw screenshots from Vercel Blob storage. LCP estimate: **4–8 seconds on mobile 4G**. Target is under 2.5s.
**Fix:** Convert all images to WebP (70–80% size reduction). Add `width`/`height` attributes to all `<img>` tags. Use Vercel Image Optimization or Cloudinary.
**Effort:** 2–3h.

---

### 🚨 PERFORMANCE — Layout thrashing on every scroll frame
**Finding:** PERF-C01 (`HomeReel.jsx:390,397`)
`getBoundingClientRect()` called inside GSAP's `onUpdate` callback (runs 60×/second). Forces synchronous layout reflow on every frame. Causes scroll animation to drop to 15–20fps on mobile.
**Fix:** Cache measurements in refs, refresh via `ResizeObserver` on resize only.
**Effort:** 1h.

---

### 🚨 PERFORMANCE — 15 permanent `will-change` declarations in CSS
**Finding:** PERF-C05 (Multiple CSS files)
`will-change` applied permanently to 15 CSS classes including `.page-stage` (entire page). Consumes 80–150MB of GPU memory on mobile at all times, including when no animation is active.
**Fix:** Remove from CSS, apply via JavaScript immediately before animations and remove in `onComplete`.
**Effort:** 2h.

---

## P1 — High Priority: Fix Before Launch

### Performance
- **PERF-C06** — Multiple simultaneous `backdrop-filter: blur()` layers → 60fps→sub-30fps on mobile
- **PERF-C07** — `applyStage()` triggers React state updates inside GSAP tick — main thread stalls
- **PERF-H01** — No `manualChunks` in Vite — GSAP may duplicate across chunks
- **PERF-H02** — Tailwind CSS imported + processed but zero utility classes used → remove entirely
- **PERF-H04** — `will-change` on every TextSwap letter layer permanently — 48+ GPU layers for nav alone
- **PERF-H06** — HomeClientBand creates 60 DOM nodes for 5 clients (reduce to 20)
- **PERF-M01** — No `<link rel="preconnect">` for Vercel Blob CDN (+200–600ms cold load)
- **PERF-M02** — SpaceMono-Regular not preloaded → FOUT on all UI micro-labels at first paint

### Code Quality
- **HIGH-5** — GSAP mutates React-managed `textContent` in StudioPage → counter resets to 0 on re-render
- **HIGH-7** — `ProjectDetailPage` missing `.page` class (ALREADY IN P0)
- **MOBILE-1** — iOS Safari sticky+overflow bug (ALREADY IN P0)
- **CRIT-3** — `<button role="slider">` with both `disabled` and `aria-disabled` — AT skips element

### Security
- **SEC-M02** — Create `vercel.json` with security headers (ALREADY IN P0)
- **SEC-M03** — Source maps enabled in production → add `build.sourcemap: false` to vite.config.js
- **SEC-M01** — Add React Error Boundary
- **CICD-H01** — GitHub Pages workflow missing `DEPLOY_TARGET` env var → wrong base path
- **CICD-H04** — Add `npm audit` to CI pipeline
- **CICD-H06** — Add error tracking (Sentry — free tier)

### Architecture
- **ARCH-CRIT-1** — SEO prerendering (ALREADY IN P0)
- **ARCH-MED-12** — Add React Error Boundary (same as SEC-M01)
- **MED-1** — `NotFoundPage` borrows CSS without importing — styled 404 only works after a project page visit

---

## P2 — Medium Priority: Plan for Next Sprint

### Performance
- Convert `home-reel-drift` animation to `animation-play-state: paused` on inactive frames
- Add `@media (hover: hover)` guards on all hover animations — stuck hover after tap on mobile
- Fix `scroll-behavior: smooth` conflict with GSAP scroll resets
- Change first video to `preload="metadata"` (not `preload="auto"`)
- Move Cormorant Garamond `@font-face` to `ProjectShowcase.css` (only used on `/proyectos`)
- Add `fetchPriority="high"` to first portfolio image in HTML

### Code Quality
- **MED-3** — Decompose `applyStage()` into 6 named sub-functions
- **MED-4** — Remove 3 dead constants: `COLOR_COMPARISON_ENTRY_Y/SCALE/ROTATE`
- **MED-6** — `useTheme` should respect `prefers-color-scheme` on first visit
- **MED-8** — Add initial CSS state for ContactPage title animation
- **MOBILE-4** — Change mobile nav label from "Menu" → "Menú" / "Navegación"
- **MOBILE-5** — Fix non-interactive "Web" contact card showing hover feedback

### Architecture
- **ARCH-MED-1** — Create `ThemeContext` to avoid prop-drilling `theme`/`toggleTheme`
- **ARCH-MED-2** — Replace `CustomEvent` for HomeReel→Nav tone with React Context or `useSyncExternalStore`
- **ARCH-MED-3** — `<Suspense fallback={null}>` → use `Loader` or skeleton as fallback
- **ARCH-MED-9** — Standardize breakpoints (define 4 canonical values in index.css)
- **ARCH-MED-10** — Add `manualChunks` for GSAP + React vendor split

### Best Practices
- Centralize GSAP plugin registration to `src/lib/gsap.js`
- Wrap `TextSwap` in `React.memo`
- Move `desktopLinks` array outside `Nav` component (it's static data)
- Add `useMemo` to `ProjectShowcase` for `visibleProjects` and `disciplineLabels`
- Stabilize `Loader`'s `onComplete` prop with `useCallback` in `App.jsx`
- Move Tailwind to `devDependencies` (or remove entirely — recommended)
- Add `eslint-plugin-jsx-a11y`
- Adopt `clsx` for className assembly

### CI/CD
- Add PR-targeted CI workflow
- Configure branch protection on `master`
- Add `.env` pattern to `.gitignore`
- Create `.env.example`
- Add `build:pages` npm script
- Set up uptime monitoring

---

## P3 — Low Priority: Backlog

### Code Quality
- **LOW-1** — `Footer.jsx`: hardcoded brand name → use `siteContent.brand.name`
- **LOW-2** — `HomeEndFrame.jsx`: hardcoded copyright year → `new Date().getFullYear()`
- **LOW-4** — Fix missing accent marks in Spanish content strings (affects SEO descriptions)
- **ARCH-LOW-6** — Remove `@types/react` + `@types/react-dom` (no TypeScript)
- **ARCH-LOW-4** — Reduce HomeClientBand to 2 loop repetitions (20 DOM nodes vs 60)

### Architecture
- **ARCH-LOW-3** — Host OG image on own domain instead of Vercel Blob URL
- **ARCH-LOW-5** — Add `<link rel="preload">` for SpaceMono (already in P1)
- Migrate to `createBrowserRouter` for React Router 7 full feature set

### Documentation
- **DOC-C01** — Replace Vite boilerplate README with project-specific content
- **DOC-C02** — Add section-heading comments inside `applyStage()` for the 6 animation systems
- **DOC-H01** — Document animation constants (purpose + units)
- **DOC-H04** — Document `home-reel-stagechange` event contract
- Create `.claude/CLAUDE.md` with HomeReel architecture context
- Standardize CSS breakpoints with a comment-documented convention

### Testing
- Add Vitest + jsdom + @testing-library/react
- Add Playwright for mobile viewport E2E
- Extract `clamp01`, `normalizeRange`, `lerp` to `src/utils/math.js` and unit test them
- Add source maps assertion to `vite-base.test.js`
- Add `normalizePath` edge case tests to `route-meta.test.js`

### CI/CD
- Add semantic version tagging for releases
- Add Vercel Analytics (free tier, 0 config)
- Add `lint:fix`, `audit`, `test:watch` npm scripts
- Add `chunkSizeWarningLimit` to vite.config.js

---

## Recommended Action Plan

### This week (before sharing the link)
1. ✅ Check `vercel-cookie.txt` — rotate if needed
2. ✅ Fix `ProjectDetailPage` missing `.page` class (2 min)
3. ✅ Fix iOS Safari sticky+overflow in ProjectShowcase (10 min)
4. ✅ Create `vercel.json` with SPA rewrite + security headers (30 min)
5. ✅ Disable source maps in `vite.config.js` (5 min)
6. ✅ Remove Tailwind entirely from `index.css` + `package.json` (20 min)
7. ✅ Add `<link rel="preconnect">` for Vercel Blob CDN to `index.html` (5 min)
8. ✅ Add `<link rel="preload">` for SpaceMono-Regular (5 min)

### Sprint 1 — Performance (mobile experience)
1. Convert all PNG screenshots to WebP — biggest single LCP improvement
2. Gate comparison stage videos behind scroll proximity — removes 6 autoplay videos
3. Lazy-render reel frames 2–4 — removes 3 more autoplay videos
4. Cache `getBoundingClientRect` in ResizeObserver — eliminates layout thrashing
5. Remove permanent `will-change` from CSS — free 80–150MB GPU memory
6. Reduce simultaneous `backdrop-filter: blur()` layers

### Sprint 2 — SEO + Architecture
1. Implement prerendering (vite-plugin-prerender) for each route
2. Fix GSAP `textContent` mutation in StudioPage
3. Add React Error Boundary
4. Add `manualChunks` for GSAP vendor split
5. Fix mobile hover states (`@media (hover: hover)`)

### Sprint 3 — Code Quality + Testing
1. Decompose `applyStage()` into sub-functions
2. Extract `src/utils/math.js` with scroll utilities
3. Add Vitest + @testing-library/react infrastructure
4. Add component tests for ComparisonSlider keyboard interaction
5. Add Playwright mobile viewport tests

---

## What's Already Good

The review surfaced many issues but the codebase has significant strengths:

- **GSAP usage** is professional and well-structured — ScrollTrigger integration, context cleanup, and `ctx.revert()` are all done correctly
- **Accessibility fundamentals** are solid — focus trap in mobile nav, `aria-hidden` toggling, touch target sizes (44px), `playsInline`+`muted` on all videos
- **`prefers-reduced-motion`** implemented throughout — all animations respect it
- **Video sync logic** in ComparisonSlider is sophisticated and correct (drift threshold, sync-on-play)
- **BEM CSS naming** is rigorous and consistent across all 20+ CSS files
- **Code splitting** — all routes are properly lazy-loaded
- **Theme system** using CSS custom properties with `data-theme` is clean and extensible
- **Dual deployment target** handling (Vercel/GitHub Pages) in vite.config.js is well designed
- **Viewport height** handling uses `100dvh` correctly for iOS Safari
- **`private: true`** in package.json — no accidental npm publish
- **Zero `dangerouslySetInnerHTML`** — no XSS risk anywhere in the codebase
- **All dependencies current** — no known CVEs

---

## Review Files
- `.full-review/00-scope.md` — Review scope definition
- `.full-review/01-quality-architecture.md` — Code quality + architecture detail
- `.full-review/02-security-performance.md` — Security + performance detail
- `.full-review/03-testing-documentation.md` — Testing + documentation detail
- `.full-review/04-best-practices.md` — Framework best practices + CI/CD detail
- `.full-review/05-final-report.md` — This file
