# Phase 4: Best Practices & Standards

## Framework & Language Findings

### High

| ID | File | Issue |
|----|------|-------|
| BP-H01 | `App.jsx` | No React Error Boundary — blank screen on any render error in production |
| BP-H02 | `StudioPage.jsx:60` | GSAP directly mutates React-managed `textContent` — race condition with reconciler |
| BP-H03 | `HomeReel.jsx:475` | GSAP calls `setAttribute('aria-hidden')` on every scroll frame — AT announcement loops |

### Medium

| ID | File | Issue |
|----|------|-------|
| BP-M01 | `usePrefersReducedMotion.js:4` | Initializes to `false` — double-render flash on reduced-motion devices |
| BP-M02 | `ThemeTransition.jsx` | Hook returning JSX — breaks React Compiler optimization; unconventional pattern |
| BP-M03 | `HomeReel.jsx:10`, `StudioPage.jsx:9`, `ProjectDetailPage.jsx:9` | `gsap.registerPlugin(ScrollTrigger)` scattered in 3 files — should be centralized in `main.jsx` or `src/lib/gsap.js` |
| BP-M04 | `main.jsx`, `App.jsx` | Legacy `BrowserRouter` + `<Routes>` — misses React Router 7 features (data loaders, error elements, `<ScrollRestoration>`) |
| BP-M05 | `vite.config.js` | No `manualChunks` — GSAP (~180KB) not guaranteed to deduplicate across lazy chunks |
| BP-M06 | `eslint.config.js` | No `eslint-plugin-jsx-a11y` — ARIA misuse not caught at lint time |
| BP-M07 | `ProjectShowcase.jsx:10` | `visibleProjects` + `disciplineLabels` recomputed on every render — need `useMemo` |
| BP-M08 | `Nav.jsx:22` | `desktopLinks` array rebuilt on every render — should be module-level static constant |
| BP-M09 | `Loader.jsx:36` | `onComplete` prop unstable (inline arrow in App) — GSAP timeline restarts if App re-renders |
| BP-M10 | `package.json:14` | `tailwindcss` + `@tailwindcss/vite` in `dependencies` not `devDependencies` |
| BP-M11 | `package.json` | No `vitest` — current `node --test` cannot test React components |
| BP-M12 | `ComparisonSlider.jsx:201` | `disabled` + `aria-disabled` both set — removes element from AT focus when `aria-disabled` alone is sufficient |

### Low

| ID | File | Issue |
|----|------|-------|
| BP-L01 | `App.jsx:20` | `handleThemeToggle` not wrapped in `useCallback` — creates new reference every render |
| BP-L02 | `ProjectDetailPage.jsx:102` | Manual `window.scrollTo` — should use `<ScrollRestoration>` from React Router 7 |
| BP-L03 | `eslint.config.js:17,20` | Duplicate `ecmaVersion` (2020 vs `latest`) — flat config conflict |
| BP-L04 | `eslint.config.js:26` | `varsIgnorePattern: '^[A-Z_]'` — too broad, masks dead constants like `COLOR_COMPARISON_ENTRY_*` |
| BP-L05 | `package.json:23` | `@types/react` + `@types/react-dom` with no TypeScript — remove or add `jsconfig.json` with `checkJs: true` |
| BP-L06 | `Nav.jsx:171`, `ProjectShowcase.jsx:43` | String concatenation for classNames — use `clsx` for safety and readability |
| BP-L07 | `TextSwap.jsx` | Not wrapped in `React.memo` — rebuilds all character spans on parent re-render |
| BP-L08 | Multiple | Inconsistent `rel="noreferrer"` vs `rel="noopener noreferrer"` on external links |

---

## CI/CD & DevOps Findings

### Critical

| ID | Finding |
|----|---------|
| CICD-C01 | **`vercel-cookie.txt` in working tree** — potential live Vercel auth token. Verify contents immediately and rotate if compromised. Add to `.gitignore`. |
| CICD-C02 | **No `vercel.json`** — direct navigation to any route (e.g. `/proyectos/slug`) returns 404 from CDN. No SPA rewrite rule. |
| CICD-C03 | **CI workflow deploys without running tests or lint** — broken code ships to production automatically |

### High

| ID | Finding |
|----|---------|
| CICD-H01 | GitHub Pages workflow missing `DEPLOY_TARGET=github-pages` env var — builds with wrong base path, all assets 404 |
| CICD-H02 | No CI gates for Vercel (primary) deployment — Vercel deploys on every push with no quality check |
| CICD-H03 | Source maps not explicitly disabled (`build.sourcemap: false` missing in vite.config.js) |
| CICD-H04 | No `npm audit` anywhere in pipeline — vulnerable dependencies ship silently |
| CICD-H05 | Direct push to `master` triggers immediate production deploy — no branch protection |
| CICD-H06 | No error tracking (Sentry or equivalent) — runtime errors in production are invisible |

### Medium

| ID | Finding |
|----|---------|
| CICD-M01 | `node --test` with no explicit file pattern — test discovery is version-dependent |
| CICD-M02 | No manual chunk strategy — GSAP bundle deduplication not guaranteed |
| CICD-M03 | No performance budget or Lighthouse CI — regressions accumulate silently |
| CICD-M04 | `.env` not excluded by `.gitignore` — a plain `.env` file with API keys would be committed |
| CICD-M05 | No `.env.example` — no authoritative list of required env vars |
| CICD-M06 | No PR-targeted CI workflow — tests never run on pull requests |
| CICD-M07 | No uptime monitoring on production domain |
| CICD-M08 | No rollback mechanism or semantic release tagging |
| CICD-M09 | No bundle size limits (`chunkSizeWarningLimit` not configured) |

### Low

| ID | Finding |
|----|---------|
| CICD-L01 | `repoName = 'Jeremy_web'` hardcoded in vite.config.js — breaks silently if repo is renamed |
| CICD-L02 | No parity enforcement between Vercel and GitHub Pages build targets |
| CICD-L03 | No analytics (Vercel Analytics free tier would give real user CWV data) |
| CICD-L04 | Missing npm scripts: `lint:fix`, `build:pages`, `audit`, `test:watch` |
