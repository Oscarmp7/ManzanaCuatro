# Repo Stabilization Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** estabilizar el repo corrigiendo SEO por ruta, resiliencia, deploy, performance del home y responsive móvil sin degradar la visual actual.

**Architecture:** se mantiene la SPA actual, pero el build generará HTML estático por ruta para exponer metadata inicial. Los fixes de performance se concentrarán en `HomeReel` y en CSS costoso. Los ajustes responsive serán puntuales y limitados a estados hoy defectuosos.

**Tech Stack:** React 19, React Router 7, Vite 7, GSAP 3, CSS modular por componente, node:test

---

### Task 1: Runtime and App Shell

**Files:**
- Modify: `src/hooks/useTheme.js`
- Modify: `src/hooks/usePrefersReducedMotion.js`
- Create: `src/components/ErrorBoundary/ErrorBoundary.jsx`
- Modify: `src/App.jsx`

**Step 1: Write the failing test**

Add tests for:
- theme bootstrap without crashing when storage is unavailable
- reduced-motion initial value from `matchMedia`

**Step 2: Run test to verify it fails**

Run: `npm test`
Expected: failing assertions around runtime guards or missing exports/helpers

**Step 3: Write minimal implementation**

- Guard `localStorage`
- Respect system theme on first visit
- Initialize reduced motion from `matchMedia`
- Add `ErrorBoundary` around routed content

**Step 4: Run test to verify it passes**

Run: `npm test`
Expected: PASS

**Step 5: Commit**

```bash
git add src/hooks/useTheme.js src/hooks/usePrefersReducedMotion.js src/components/ErrorBoundary/ErrorBoundary.jsx src/App.jsx tests
git commit -m "fix: harden app shell runtime behavior"
```

### Task 2: Route Metadata and Build Output

**Files:**
- Modify: `src/seo/routeMeta.js`
- Modify: `src/seo/RouteMeta.jsx`
- Create: `scripts/generate-route-html.mjs`
- Modify: `package.json`
- Modify: `index.html`

**Step 1: Write the failing test**

Add tests for generated route metadata/build route list.

**Step 2: Run test to verify it fails**

Run: `npm test`
Expected: FAIL because build route generation does not exist yet

**Step 3: Write minimal implementation**

- Keep client-side meta updates
- Generate route HTML files at build time with correct titles/descriptions/canonical/OG
- Keep home HTML as default entry

**Step 4: Run test to verify it passes**

Run: `npm test && npm run build`
Expected: PASS and route HTML files created under `dist/`

**Step 5: Commit**

```bash
git add src/seo/routeMeta.js src/seo/RouteMeta.jsx scripts/generate-route-html.mjs package.json index.html tests
git commit -m "feat: generate static route metadata output"
```

### Task 3: Deploy and Repo Hygiene

**Files:**
- Create: `vercel.json`
- Modify: `.github/workflows/deploy-pages.yml`
- Modify: `.gitignore`
- Modify: `README.md`

**Step 1: Write the failing test**

Add assertions for GitHub Pages env/build path expectations where feasible.

**Step 2: Run test to verify it fails**

Run: `npm test`
Expected: FAIL on deploy config assertions

**Step 3: Write minimal implementation**

- Set `DEPLOY_TARGET=github-pages` in workflow
- Add lint/test gates before deploy
- Add security/cache headers in `vercel.json`
- Ignore `.env` and `vercel-cookie.txt`
- Replace boilerplate README

**Step 4: Run test to verify it passes**

Run: `npm test`
Expected: PASS

**Step 5: Commit**

```bash
git add vercel.json .github/workflows/deploy-pages.yml .gitignore README.md tests
git commit -m "chore: align deploy and repo hygiene"
```

### Task 4: Home Reel Performance

**Files:**
- Modify: `src/components/HomeReel/HomeReel.jsx`
- Modify: `src/components/HomeReel/HomeReel.css`
- Modify: `src/components/ComparisonSlider/ComparisonSlider.jsx`
- Modify: `src/components/ComparisonSlider/ComparisonSlider.css`

**Step 1: Write the failing test**

Add tests that assert lazy stage activation and safer slider semantics.

**Step 2: Run test to verify it fails**

Run: `npm test`
Expected: FAIL because current markup mounts all media and keeps old slider contract

**Step 3: Write minimal implementation**

- Gate comparison media until stage activation
- Limit reel video mounts to needed frames
- Cache measurements with `ResizeObserver`
- Reduce permanent expensive CSS hints
- Improve slider semantics and mobile cost

**Step 4: Run test to verify it passes**

Run: `npm test && npm run build`
Expected: PASS

**Step 5: Commit**

```bash
git add src/components/HomeReel/HomeReel.jsx src/components/HomeReel/HomeReel.css src/components/ComparisonSlider/ComparisonSlider.jsx src/components/ComparisonSlider/ComparisonSlider.css tests
git commit -m "perf: stabilize home reel rendering"
```

### Task 5: Responsive and Page-Level Fixes

**Files:**
- Modify: `src/pages/ProjectDetailPage.jsx`
- Modify: `src/pages/ProjectDetailPage.css`
- Modify: `src/components/ProjectShowcase/ProjectShowcase.css`
- Modify: `src/components/ProjectShowcase/ProjectShowcase.jsx`
- Modify: `src/components/Nav/Nav.jsx`
- Modify: `src/pages/ContactPage.css`
- Modify: `src/pages/ContactPage.jsx`
- Modify: `src/pages/NotFoundPage.jsx`
- Create: `src/pages/NotFoundPage.css`

**Step 1: Write the failing test**

Add tests for:
- project detail page root shell class
- mobile filter behavior contract
- not-found page styling import

**Step 2: Run test to verify it fails**

Run: `npm test`
Expected: FAIL on new structural assertions

**Step 3: Write minimal implementation**

- Fix project detail nav offset
- Remove sticky+overflow conflict on mobile
- Clamp comparison metadata layouts
- Localize mobile labels
- Remove misleading hover for non-link contact card
- Give 404 its own stylesheet

**Step 4: Run test to verify it passes**

Run: `npm test && npm run build`
Expected: PASS

**Step 5: Commit**

```bash
git add src/pages/ProjectDetailPage.jsx src/pages/ProjectDetailPage.css src/components/ProjectShowcase/ProjectShowcase.css src/components/ProjectShowcase/ProjectShowcase.jsx src/components/Nav/Nav.jsx src/pages/ContactPage.css src/pages/ContactPage.jsx src/pages/NotFoundPage.jsx src/pages/NotFoundPage.css tests
git commit -m "fix: stabilize responsive page behaviors"
```

### Task 6: Weight Reduction and Final Cleanup

**Files:**
- Modify: `vite.config.js`
- Modify: `src/index.css`
- Modify: `package.json`
- Modify: `src/components/HomeClientBand/HomeClientBand.jsx`
- Modify: `src/components/HomeEndFrame/HomeEndFrame.jsx`
- Modify: `src/components/Footer/Footer.jsx`

**Step 1: Write the failing test**

Add tests for removed Tailwind wiring and reduced repeated DOM.

**Step 2: Run test to verify it fails**

Run: `npm test`
Expected: FAIL on old assumptions

**Step 3: Write minimal implementation**

- Remove unused Tailwind wiring
- Reduce repeated client-band items
- Normalize footer/home-end small content inconsistencies

**Step 4: Run test to verify it passes**

Run: `npm test && npm run build && npm run lint`
Expected: PASS

**Step 5: Commit**

```bash
git add vite.config.js src/index.css package.json src/components/HomeClientBand/HomeClientBand.jsx src/components/HomeEndFrame/HomeEndFrame.jsx src/components/Footer/Footer.jsx tests
git commit -m "chore: remove dead weight and finish cleanup"
```
