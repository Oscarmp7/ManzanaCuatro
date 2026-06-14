# Phase 2: Security & Performance Review

## Security Findings

### High

| ID | Finding | File | CVSS | CWE |
|----|---------|------|------|-----|
| S-H1 | Stale Vite `base` path (`/Jeremy_web/`) causes production asset 404s | vite.config.js:5-8 | 7.5 | CWE-1188 |
| S-H2 | No React Error Boundary — runtime errors crash entire app (white screen) | App.jsx | 7.5 | CWE-755 |

### Medium

| ID | Finding | File | CVSS | CWE |
|----|---------|------|------|-----|
| S-M1 | External assets on Vercel Blob Storage with no fallback, no SRI, no error handling (6 URLs from single domain) | siteContent.js:1-7 | 5.3 | CWE-829 |
| S-M2 | Missing security headers: no CSP, no X-Frame-Options, no X-Content-Type-Options, no Referrer-Policy | index.html | 5.3 | CWE-1021, CWE-693 |
| S-M3 | Mobile nav menu lacks focus trap — keyboard users can interact with hidden content behind overlay | Nav.jsx:107-146 | 4.3 | — |
| S-M4 | Broken CI pipeline — no functional tests, no SAST, no dependency scanning gates | package.json:9 | 5.0 | CWE-1127 |
| S-M5 | Inconsistent `rel` attributes on external links — Nav uses only `rel="noreferrer"`, others use `rel="noopener noreferrer"` | Nav.jsx:85-87 | 4.3 | CWE-200 |

### Low

| ID | Finding | File | CVSS | CWE |
|----|---------|------|------|-----|
| S-L1 | localStorage theme value used without validation in `setAttribute` | useTheme.js:4-5 | 3.3 | CWE-20 |
| S-L2 | Route `:slug` parameter used without format validation | ProjectDetailPage.jsx:11,19 | 3.1 | CWE-20 |
| S-L3 | Contact info (email, phone) hardcoded in JS bundle — easily scrapable | siteContent.js:97-98 | 3.7 | CWE-540 |
| S-L4 | No `crossorigin` attribute on external images — prevents SRI and tainted canvas | Multiple img tags | 2.4 | CWE-346 |

### Informational

| ID | Finding |
|----|---------|
| S-I1 | No `.env` file handling or environment variable strategy; `.gitignore` doesn't explicitly cover `.env` |
| S-I2 | No deployment hardening config (`vercel.json`, `_headers`, etc.) |
| S-I3 | ESLint has no security-focused plugins (`eslint-plugin-security`, etc.) |

### Positive Security Observations

- Zero instances of `dangerouslySetInnerHTML`, `eval()`, or `Function()` constructors
- No user input forms — minimal attack surface
- `rel="noopener noreferrer"` on most external links (Footer, ContactPage)
- React StrictMode enabled
- `prefers-reduced-motion` respected in CSS
- Passive scroll listeners used in Nav
- GSAP license note: verify commercial license compliance for agency site

---

## Performance Findings

### Critical

| ID | Finding | File | Impact |
|----|---------|------|--------|
| P-C1 | No route-level code splitting — all 5 pages eagerly imported | App.jsx:4-8 | ~40-60% larger initial JS payload |
| P-C2 | All 5 showcase images load eagerly (hidden via CSS opacity) | ProjectShowcase.jsx:23-31 | ~2-5MB unnecessary data on /proyectos |
| P-C3 | Separator ScrollTrigger memory leak — cleanup uses fragile `ref.current` match pattern | Separator.jsx | Accumulating ScrollTrigger instances across navigations |

### High

| ID | Finding | File | Impact |
|----|---------|------|--------|
| P-H1 | No responsive image sizing — same full-resolution image served to all viewports, no `srcset`/`sizes` | Multiple | 3-5x oversized images on mobile |
| P-H2 | No `width`/`height` on any `<img>` tag — CLS risk | Multiple | Layout shift > 0.1 during image load |
| P-H3 | Hero image missing `fetchpriority="high"` — LCP not optimized | Hero.jsx:78 | Slower LCP by 200-500ms |
| P-H4 | HomePage CTA uses same fragile ScrollTrigger cleanup as Separator | HomePage.jsx:33-36 | Leaked ScrollTrigger on navigation |
| P-H5 | Only 2 of 5 font files preloaded — Space Mono (nav, footer) not preloaded | index.html:10-11 | FOUT for above-the-fold nav elements |

### Medium

| ID | Finding | File | Impact |
|----|---------|------|--------|
| P-M1 | GSAP registered in 7 separate files instead of centralized | Multiple | Maintenance + unnecessary evaluation cost |
| P-M2 | No Vite `manualChunks` config — GSAP (~60KB gzipped) bundled in main chunk | vite.config.js | Suboptimal chunk splitting |
| P-M3 | PageTransition creates new timeline per navigation without killing previous | PageTransition.jsx | Overlapping timelines on rapid nav |
| P-M4 | Nav mobile menu GSAP animations never cleaned up | Nav.jsx:31-40 | Stale animation instances on rapid toggle |
| P-M5 | CSS marquee animation runs continuously even when off-screen | Marquee.css | ~5-10% CPU on low-end mobile |
| P-M6 | Loader `onComplete` instability — inline callback creates new ref each render | Loader.jsx:44 | Potential double animation |
| P-M7 | No `React.memo` on any component — full tree re-renders on theme toggle | Multiple | Unnecessary cascade re-renders |

### Low

| ID | Finding | File | Impact |
|----|---------|------|--------|
| P-L1 | `will-change` applied permanently on manifesto words and detail images | StudioPage.css, ProjectDetailPage.css | ~2-4MB extra GPU memory per element |
| P-L2 | Duplicate CSS custom properties (Tailwind `@theme` vs `:root`) | index.css | Maintenance overhead |
| P-L3 | `scroll-behavior: smooth` conflicts with programmatic `scrollTo(0,0)` | index.css:108 | Janky scroll on navigation |
| P-L4 | `font-display: swap` on all fonts including display fonts | index.css | Visible FOUT on slow connections |
| P-L5 | `statRefs` accumulation pattern in StudioPage | StudioPage.jsx:13 | Minimal — bounded by 3 items |

---

## Critical Issues for Phase 3 Context

1. **Broken CI pipeline** (S-M4) — no tests can run, no security scanning gates exist
2. **No Error Boundary** (S-H2) — untested error paths will crash the entire app
3. **External asset dependency** (S-M1) — no fallback for failed image loads; testing should cover degraded states
4. **Missing security headers** (S-M2) — deployment docs should include header configuration
5. **GSAP memory leaks** (P-C3, P-H4) — tests should verify cleanup on unmount
6. **No code splitting** (P-C1) — build/bundle analysis should be part of CI
7. **GSAP license compliance** — commercial use requires verification
