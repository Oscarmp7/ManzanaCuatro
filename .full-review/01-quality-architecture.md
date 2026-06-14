# Phase 1: Code Quality & Architecture Review

## Code Quality Findings

### Critical

| ID | File | Issue |
|----|------|-------|
| CRIT-1 | `useTheme.js:4` | `localStorage` read in render without SSR/env guard — breaks any prerender or test env |
| CRIT-2 | `ProjectDetailPage.jsx:116` | Crash path when `showcaseProjects` is empty (`NaN % 0` → undefined → `.slug` throws) |
| CRIT-3 | `ComparisonSlider.jsx:201` | `<button role="slider">` — invalid ARIA + `aria-disabled` conflicts with native `disabled` |

### High

| ID | File | Issue |
|----|------|-------|
| HIGH-1 | `HomeReel.jsx:390,397` | `getBoundingClientRect()` called on every GSAP scroll frame → forced layout thrashing |
| HIGH-2 | `ThemeTransition.jsx:6` | Hook returns JSX (`curtain`) — anti-pattern, implicit DOM coupling, creates JSX on every render |
| HIGH-3 | `Nav.jsx:54` | Body overflow unlock races with page transition animation — may cause jitter |
| HIGH-5 | `StudioPage.jsx:60` | GSAP mutates React-managed `textContent` directly — re-render resets counter to 0 |
| HIGH-6 | `HomeReel.jsx:176` | `dataset.homeReelTone` race condition on fast unmount/remount cycles |
| HIGH-7 | `ProjectDetailPage.jsx:120` | **Missing `.page` class** — fixed nav overlaps hero image (visual regression in production) |
| MOBILE-1 | `ProjectShowcase.css:74,392` | `position: sticky` + `overflow-x: auto` = broken on iOS Safari (well-documented incompatibility) |
| MOBILE-2 | `HomeReel.css:399` | Comparison details absolute positioning overflows viewport at 1081–1200px |

### Medium

| ID | File | Issue |
|----|------|-------|
| MED-1 | `NotFoundPage.jsx:5` | Borrows `project-detail__not-found` CSS without importing file → unstyled 404 on direct navigation |
| MED-2 | `index.css:50–75` | Font vars declared twice: Tailwind `@theme` block + `:root` — duplicate definitions, order-of-precedence risk |
| MED-3 | `HomeReel.jsx:198` | `applyStage` is 280 lines mixing 6+ concerns — highest maintainability risk in the project |
| MED-4 | `HomeReel.jsx:61–63` | 3 dead constants: `COLOR_COMPARISON_ENTRY_Y/SCALE/ROTATE` — never referenced |
| MED-5 | `ProjectShowcase.jsx:108` | Disciplines + scope chips both rendered in same `<ul>` — redundant, potential duplicate keys |
| MED-6 | `useTheme.js:4` | Ignores `prefers-color-scheme` on first visit — always defaults to dark |
| MED-7 | `HomeReel.css:70–84` | Z-index hardcoded for exactly 4 frames — breaks if slice count changes |
| MED-8 | `ContactPage.jsx:49` | Title animation has no initial CSS state — flashes if GSAP is delayed |
| MOBILE-3 | `HomeReel.jsx:646` | Baseline spans lack semantic grouping on mobile stacked layout |
| MOBILE-4 | `Nav.jsx:247` | Mobile menu dialog labeled "Menu" (English) in a Spanish-first site |
| MOBILE-5 | `ContactPage.jsx:28` | Non-interactive "Web" card shows hover feedback suggesting it's a link |

### Low

| ID | File | Issue |
|----|------|-------|
| LOW-1 | `Footer.jsx:13` | Brand name hardcoded as string instead of `siteContent.brand.name` |
| LOW-2 | `HomeEndFrame.jsx:45` | Copyright year hardcoded as `2026` — should use `new Date().getFullYear()` |
| LOW-3 | `StudioPage.jsx:27` | Unscoped global GSAP selectors (pattern works but risky in multi-instance scenarios) |
| LOW-4 | `siteContent.js` | Missing accent marks in several Spanish strings (affects SEO meta descriptions) |
| LOW-5 | `Nav.jsx:113,137` | Shadowed `firstFocusable` variable in focus-trap handler — readability issue |
| LOW-6 | `ProjectDetailPage.jsx:170` | Array index used as `key` for static list (safe today, not best practice) |

---

## Architecture Findings

### Critical

| ID | Area | Issue |
|----|------|-------|
| ARCH-CRIT-1 | SEO | **All meta tags injected via `useEffect`** — search engines and social scrapers (WhatsApp, Instagram) see zero metadata. Shared links render as blank previews. This directly undermines the studio's marketing pipeline. |

### High

| ID | Area | Issue |
|----|------|-------|
| ARCH-HIGH-1 | Components | `HomeReel.jsx` is 655 lines managing 6 distinct animation systems — monolith with ~180 lines of imperative DOM code in a single `useEffect` |
| ARCH-HIGH-2 | State | Ref-mirrored state pattern (`activeComparisonIndex` + `activeComparisonIndexRef`) is error-prone and adds cognitive overhead |
| ARCH-HIGH-3 | Performance | Up to 10 autoplay videos load simultaneously on homepage — critical issue on mobile networks |
| ARCH-HIGH-4 | CSS | **Tailwind CSS imported + processed but zero utility classes used** — dead weight in bundle, processing overhead, conflicting `@theme` declarations |

### Medium

| ID | Area | Issue |
|----|------|-------|
| ARCH-MED-1 | Data Flow | `theme`/`toggleTheme` prop-drilled 3 levels — candidate for React Context |
| ARCH-MED-2 | Events | `CustomEvent` on `window` for HomeReel→Nav tone communication — bypasses React data model, invisible dependency |
| ARCH-MED-3 | Routing | `<Suspense fallback={null}>` — empty content flash on slow connections |
| ARCH-MED-4 | Routing | No centralized scroll restoration — manual `scrollTo(0,0)` in two places |
| ARCH-MED-5 | SEO | No structured data (JSON-LD) — missing `LocalBusiness`, `Organization`, `CreativeWork` schemas |
| ARCH-MED-6 | Performance | `will-change` applied permanently via CSS to many elements — GPU memory waste on mobile |
| ARCH-MED-7 | Performance | Multiple `backdrop-filter: blur()` layers active simultaneously — compounding GPU cost |
| ARCH-MED-8 | CSS | No CSS Modules or scoping — BEM manually enforced, collision risk as project grows |
| ARCH-MED-9 | CSS | 8 different breakpoint values across files (560px, 600px, 720px, 768px, 900px, 960px, 1080px, 1200px) — no shared convention |
| ARCH-MED-10 | Build | No `manualChunks` — GSAP (~60KB) potentially duplicated across chunks |
| ARCH-MED-11 | Mobile | Desktop-first CSS — mobile overrides on all files (performance suboptimal for mobile-first audience) |
| ARCH-MED-12 | Error Handling | No React Error Boundary anywhere — any render error crashes entire app to white screen |

### Low

| ID | Area | Issue |
|----|------|-------|
| ARCH-LOW-1 | Components | `ThemeTransition` lives in `components/` but exports a hook — misleading location |
| ARCH-LOW-2 | Components | `NotFoundPage` implicit CSS dependency on `ProjectDetailPage.css` |
| ARCH-LOW-3 | SEO | OG image hosted on external Vercel Blob URL — single point of failure for social previews |
| ARCH-LOW-4 | Performance | `HomeClientBand` creates 60 DOM nodes — reducible to 20 with 2 loop repetitions |
| ARCH-LOW-5 | Build | No font `<link rel="preload">` for critical path fonts (Bebas Neue, Inter) |
| ARCH-LOW-6 | Dependencies | `@types/react` + `@types/react-dom` in devDeps — unused, no TypeScript in project |
| ARCH-LOW-7 | Data | Module-level `siteContent` destructuring — will silently break if ever made dynamic |

---

## Critical Issues for Phase 2 Context

1. **Client-side-only SEO** — affects crawlability, directly relevant to security headers review (CSP, canonical URLs)
2. **10 concurrent autoplay videos** — primary performance bottleneck for mobile users
3. **No Error Boundary** — any unhandled error exposes raw React stack traces to users (security/UX)
4. **Unused Tailwind** — adds unnecessary build surface and bundle overhead
5. **`PROJECT_DETAIL` missing `.page` class** — HIGH-7 is likely visually broken in production right now
6. **`MOBILE-1` sticky+overflow** — iOS Safari silent break on project filters
