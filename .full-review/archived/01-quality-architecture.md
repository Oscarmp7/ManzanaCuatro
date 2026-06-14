# Phase 1: Code Quality & Architecture Review

## Code Quality Findings

### Critical

| ID | Finding | File | Line |
|----|---------|------|------|
| C1 | Test suite `layout-direction.test.js` references deleted components — tests will crash | tests/layout-direction.test.js | 17-33 |
| C2 | Vite `base` path uses stale repo name (`Jeremy_web`), will break production routing; `BrowserRouter` has no matching `basename` | vite.config.js | 5-8 |

### High

| ID | Finding | File | Line |
|----|---------|------|------|
| H1 | GSAP `gsap.context()` not scoped in `ProjectDetailPage` — animation leak | src/pages/ProjectDetailPage.jsx | 94 |
| H2 | Duplicated GSAP animation patterns (fade-in + stagger + cleanup) across 6+ components | Multiple | — |
| H3 | `ScrollTrigger.registerPlugin` called at module scope in 7 separate files | Multiple | — |
| H4 | No React Error Boundary — GSAP failures or bad data will white-screen the app | App.jsx | — |
| H5 | `Loader` component has `onComplete` in useEffect dependency array — potential infinite loop | src/components/Loader/Loader.jsx | 44 |

### Medium

| ID | Finding | File | Line |
|----|---------|------|------|
| M1 | Hardcoded strings in Hero, Footer, ContactPage that duplicate `siteContent` data | Multiple | — |
| M2 | Marquee `clients` list is hardcoded, duplicating `showcaseProjects` data | src/components/Marquee/Marquee.jsx | 3 |
| M3 | Inconsistent GSAP import style (default vs named) across codebase | Multiple | — |
| M4 | `ProjectShowcase` renders all images simultaneously — no lazy loading | src/components/ProjectShowcase/ProjectShowcase.jsx | 23-32 |
| M5 | `Separator` uses inline styles instead of CSS class; two competing separator implementations | src/components/Separator/Separator.jsx | 31-39 |
| M6 | No `404` / catch-all route — undefined URLs render empty layout | src/App.jsx | 25-32 |
| M7 | `Nav` active link matching is exact-only — nested routes won't highlight | src/components/Nav/Nav.jsx | 64 |
| M8 | `useLayoutEffect` in `PageTransition` may warn in SSR contexts | src/components/PageTransition/PageTransition.jsx | 11 |

### Low

| ID | Finding | File | Line |
|----|---------|------|------|
| L1 | Copyright year hardcoded in Hero (`2026`) | src/components/Hero/Hero.jsx | 103 |
| L2 | Marquee uses array index as React key | src/components/Marquee/Marquee.jsx | 9 |
| L3 | StudioPage manifesto uses array index as key | src/pages/StudioPage.jsx | 91 |
| L4 | Missing `aria-label` on theme toggle and prev/next project links | Multiple | — |
| L5 | `package.json` name is `jeremy-adonai` — does not match the brand | package.json | 2 |

---

## Architecture Findings

### High

| ID | Finding | Impact |
|----|---------|--------|
| A-H1 | Inconsistent ScrollTrigger cleanup — `Separator.jsx` and `HomePage.jsx` use fragile manual `ScrollTrigger.getAll().forEach()` pattern instead of `ctx.revert()` | Memory leaks and stale scroll handlers; `ref.current` may be null during cleanup |
| A-H2 | Loader `onComplete` callback instability (same as H5 above) | Potential GSAP timeline re-creation mid-animation |

### Medium

| ID | Finding | Impact |
|----|---------|--------|
| A-M1 | `ThemeTransition` is a hook exported from a `.jsx` component file | Confusing module contract; breaks naming conventions |
| A-M2 | Theme state prop-drilled (App → MainLayout → Nav) instead of Context | Does not scale; any new theme-aware component requires threading |
| A-M3 | No data validation or TypeScript types on `siteContent.js` | Runtime fragility as content grows; TS type packages already installed but unused |
| A-M4 | GSAP animation boilerplate repeated in 7 components | Maintenance cost; inconsistent behavior across components |
| A-M5 | Inconsistent page padding convention (`page` vs `page--*` vs inline) | Layout fragility; new developers won't know which class to apply |
| A-M6 | Hero background image coupled to `showcaseProjects[0].poster` | Hero visual identity changes silently if project order changes |
| A-M7 | No route-level code splitting (all pages eagerly imported) | All page code loads upfront |
| A-M8 | Mobile menu (`role="dialog"`, `aria-modal="true"`) lacks focus trap | WCAG 2.1 SC 2.4.3 violation |
| A-M9 | Tailwind `@theme` font tokens duplicate `:root` CSS custom properties | Potential drift between two font systems |

### Low

| ID | Finding | Impact |
|----|---------|--------|
| A-L1 | Marquee hardcodes client list (same as M2) | Data duplication risk |
| A-L2 | ContactPage derives data at module scope | Tight coupling to module load order; harder to test |
| A-L3 | Inconsistent gsap import style (same as M3) | Minor inconsistency |
| A-L4 | Linear project lookup without accessor function | No encapsulation; manageable at 5 projects |
| A-L5 | Hero hardcodes text that exists in `siteContent` (same as M1) | Data source inconsistency |
| A-L6 | Only 2 of 4 font families preloaded | FOUT risk for Space Mono and Cormorant Garamond |
| A-L7 | `ProjectShowcase` list items focus indicator may be clipped by `overflow: hidden` | Minor accessibility gap |

---

## Critical Issues for Phase 2 Context

These findings should inform the Security and Performance reviews:

1. **Broken tests** (C1) — CI pipeline is non-functional; security scanning gates cannot run
2. **Stale Vite base path** (C2) — production asset paths will 404; potential for serving assets from wrong path
3. **No Error Boundary** (H4) — any runtime error (including from malformed external data or images) causes full app crash
4. **All showcase images load eagerly** (M4) — performance bottleneck on projects page
5. **No code splitting** (A-M7) — entire app loaded on first visit
6. **Mobile menu lacks focus trap** (A-M8) — accessibility/security overlap (keyboard users can interact with hidden content)
7. **Hero image coupled to external URL** (A-M6) — if the Vercel Blob Storage URL changes or is compromised, the hero breaks silently
