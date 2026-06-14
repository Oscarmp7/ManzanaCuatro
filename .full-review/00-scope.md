# Review Scope

## Target

Full codebase of **jeremy-adonai** — a React + Vite portfolio/studio website for an audiovisual production company in Santo Domingo. The review focuses on: all optimization opportunities, dead/redundant code, performance (especially frontend bundle), mobile responsive issues, SEO, code quality, and architecture.

## Files

### Source
- `src/App.jsx`
- `src/main.jsx`
- `src/index.css`
- `src/data/siteContent.js`
- `src/hooks/usePrefersReducedMotion.js`
- `src/hooks/useTheme.js`
- `src/layouts/MainLayout.jsx`
- `src/seo/routeMeta.js` / `src/seo/RouteMeta.jsx`
- `src/pages/HomePage.jsx`
- `src/pages/ProjectsPage.jsx`
- `src/pages/ProjectDetailPage.jsx` / `.css`
- `src/pages/StudioPage.jsx` / `.css`
- `src/pages/ContactPage.jsx` / `.css`
- `src/pages/NotFoundPage.jsx`
- `src/components/Nav/Nav.jsx` / `.css`
- `src/components/HomeReel/HomeReel.jsx` / `.css`
- `src/components/HomeEndFrame/HomeEndFrame.jsx` / `.css`
- `src/components/HomeClientBand/HomeClientBand.jsx` / `.css`
- `src/components/ComparisonSlider/ComparisonSlider.jsx` / `.css`
- `src/components/Footer/Footer.jsx` / `.css`
- `src/components/Loader/Loader.jsx` / `.css`
- `src/components/PageTransition/PageTransition.jsx` / `.css`
- `src/components/ProjectShowcase/ProjectShowcase.jsx` / `.css`
- `src/components/TextSwap/TextSwap.jsx` / `.css`
- `src/components/ThemeTransition/ThemeTransition.jsx` / `.css`

### Config
- `vite.config.js`
- `eslint.config.js`
- `package.json`

### Tests
- `tests/layout-direction.test.js`
- `tests/nav-layout.test.js`
- `tests/route-meta.test.js`
- `tests/site-content.test.js`
- `tests/vite-base.test.js`

## Flags

- Security Focus: no
- Performance Critical: yes (frontend SPA, visual-heavy)
- Strict Mode: no
- Framework: React + Vite (no TypeScript, CSS modules per component)

## Review Phases

1. Code Quality & Architecture
2. Security & Performance
3. Testing & Documentation
4. Best Practices & Standards
5. Consolidated Report
