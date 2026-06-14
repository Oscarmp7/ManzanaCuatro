# Phase 3: Testing & Documentation Review

## Test Coverage Findings

### Executive Summary
5 test files, zero third-party testing libraries. ~95% of assertions are source-text regex scans — not behavioral tests. Only 2 genuine unit tests: `getRouteMeta()` and Vite base-path resolution. No DOM, no component rendering, no E2E, no visual/mobile tests.

### Critical

| ID | Issue |
|----|-------|
| TEST-C01 | `applyStage()` 280-line scroll engine — zero behavioral tests; utility functions (`clamp01`, `normalizeRange`, `lerp`) untestable as private module functions |
| TEST-C02 | GSAP `textContent` mutation in `StudioPage` — completely untestable with current Node-only test runner |

### High

| ID | Issue |
|----|-------|
| TEST-H01 | `ProjectDetailPage` missing `.page` class — no test detects this; the bug is in production now |
| TEST-H02 | `useTheme` hook — not tested at all (localStorage read/write, DOM attribute sync, toggle cycle) |
| TEST-H03 | `usePrefersReducedMotion` — not tested; the `false` default causes double-render on reduced-motion devices |
| TEST-H04 | `ComparisonSlider` keyboard/pointer interaction — entirely untested despite being a complex interactive component |
| TEST-H05 | No React rendering infrastructure (no Vitest/jsdom) — cannot test any component behavior |
| TEST-H06 | Zero mobile viewport tests — iOS Safari `sticky`+`overflow` bug invisible to test suite |

### Medium

| ID | Issue |
|----|-------|
| TEST-M01 | `ProjectShowcase` filter logic — `visibleProjects` filter never exercised |
| TEST-M02 | Source maps in production — no CI assertion that `build.sourcemap` is false |
| TEST-M03 | Video autoplay/reduced-motion fallback (`<video>` → `<img>`) — untested |
| TEST-M04 | Error/not-found state of `ProjectDetailPage` — never rendered in tests |
| TEST-M05 | `normalizePath` edge cases (empty string, missing leading slash, double trailing slash) |

### Test Quality Issues

| Issue | Impact |
|-------|--------|
| ~95% of assertions are `assert.match(source, /pattern/)` — regex over raw file text | Tests pass even if code is dead/commented; fail on safe renames |
| No coverage collection configured | No way to know what % of logic is actually exercised |
| No CI pipeline found | Tests never run automatically on push |

### Recommended Infrastructure Additions
1. **Vitest + jsdom + @testing-library/react** — enables component rendering tests
2. **Playwright** — E2E + mobile viewport simulation (iPhone 14, 375px)
3. **`--experimental-test-coverage`** in npm test script
4. **Extract `applyStage` utilities** to `src/utils/math.js` → makes them unit-testable

---

## Documentation Findings

### Critical

| ID | File | Issue |
|----|------|-------|
| DOC-C01 | `README.md` | Default Vite scaffold — zero project-specific info. Project identity, setup, deployment targets, placeholder media status all undocumented |
| DOC-C02 | `HomeReel.jsx:198–478` | `applyStage()` has zero inline comments — 280 lines, 6 animation systems, impossible to navigate without running the animation |

### High

| ID | File | Issue |
|----|------|-------|
| DOC-H01 | `HomeReel.jsx:50–90` | ~12 animation constants with opaque purpose (`REEL_SETTLE_HOLD`, `COLOR_TITLE_ENTRY_SCALE`, etc.) — values and units undocumented |
| DOC-H02 | `ThemeTransition.jsx` | Hook returning JSX — unconventional pattern with no comment explaining the design rationale |
| DOC-H03 | `HomeReel.jsx:148–154` | Ref-mirrored state pattern — no comment explaining the stale-closure reason |
| DOC-H04 | `HomeReel.jsx:176–182` + `Nav.jsx:47` | `home-reel-stagechange` custom event contract completely undocumented — tone values, data attribute fallback, event shape all implicit |

### Medium

| ID | File | Issue |
|----|------|-------|
| DOC-M01 | Multiple components | Props undocumented: `HomeReel({ ready })`, `ComparisonSlider({ interactive })`, `useThemeTransition(onMidpoint)` |
| DOC-M02 | `HomeReel.css` | Layered opacity system (`--grade-title-cover/rest/fill-opacity`) unexplained; `--reel-frames` scroll height mechanism has no comment |
| DOC-M03 | All CSS files | 6 breakpoint values (560, 720, 900, 960, 1080, 1200px) with no named tokens or convention guide |
| DOC-M04 | Root | No `.claude/CLAUDE.md` — no AI assistant context for the project's complex animation architecture |

### Low

| ID | Issue |
|----|-------|
| DOC-L01 | `reelRaw`, `colorRaw` variable names — "raw" is unclear without context |
| DOC-L02 | `REEL_SETTLE_HOLD` — "settle" doesn't communicate it's a pause between reel and color phases |
| DOC-L03 | `StoryMedia` component name — private component, but `ColorizationMedia` would be more descriptive |
| DOC-L04 | `vercel-cookie.txt` committed to repo with no explanation |
