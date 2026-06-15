import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'

const read = (relativePath) =>
  readFileSync(new URL(relativePath, import.meta.url), 'utf8')

// ----------------------------------------------------------------- Block A

test('main registers the Flip plugin alongside ScrollTrigger', () => {
  const source = read('../src/main.jsx')
  assert.match(source, /import \{ Flip \} from 'gsap\/Flip'/)
  assert.match(source, /registerPlugin\([^)]*Flip/)
})

test('projects view module exposes the three layout modes and persistence', () => {
  const source = read('../src/components/ProjectShowcase/projectsView.js')
  assert.match(source, /LARGE:\s*'large'/)
  assert.match(source, /LIST:\s*'list'/)
  assert.match(source, /GRID:\s*'grid'/)
  assert.match(source, /m4-projects-view/)
  assert.match(source, /export const getInitialView/)
})

test('showcase wires a persisted, Flip-animated view switcher', () => {
  const source = read('../src/components/ProjectShowcase/ProjectShowcase.jsx')
  assert.match(source, /import \{ Flip \} from 'gsap\/Flip'/)
  assert.match(source, /Flip\.getState/)
  assert.match(source, /Flip\.from/)
  assert.match(source, /projects-showcase__view-switch/)
  assert.match(source, /role="group"/)
  assert.match(source, /projects-showcase__view-btn/)
  assert.match(source, /aria-pressed=\{view === opt\.id\}/)
  // Existing filter contract must remain intact while we extend it
  assert.match(source, /const \[activeFilter,\s*setActiveFilter\] = useState\(/)
  assert.match(source, /project\.disciplines\.includes\(activeFilter\)/)
})

test('showcase css defines the three view layouts and compact list rows', () => {
  const css = read('../src/components/ProjectShowcase/ProjectShowcase.css')
  assert.match(css, /\.projects-showcase__list--large/)
  assert.match(css, /\.projects-showcase__list--list/)
  assert.match(css, /\.projects-showcase__list--grid/)
  assert.match(css, /\.projects-showcase__view-switch/)
  assert.match(css, /\.projects-showcase__view-btn--active/)
  assert.match(css, /\.projects-showcase__row-link/)
})

// ----------------------------------------------------------------- Block B

test('debounced value hook clears its timer on change', () => {
  const source = read('../src/hooks/useDebouncedValue.js')
  assert.match(source, /setTimeout/)
  assert.match(source, /clearTimeout/)
})

test('showcase adds live search + dynamic counter + empty state, composed with filters', () => {
  const source = read('../src/components/ProjectShowcase/ProjectShowcase.jsx')
  assert.match(source, /useDebouncedValue/)
  assert.match(source, /type="search"/)
  assert.match(source, /projects-showcase__search-clear/)
  assert.match(source, /\{shownCount\} \/ \{totalCount\}/)
  assert.match(source, /projects-showcase__empty/)
  // search must cross title/client/category/disciplines
  assert.match(source, /project\.title/)
  assert.match(source, /project\.client/)
  assert.match(source, /project\.category/)
  // and still compose with the category filter contract
  assert.match(source, /project\.disciplines\.includes\(activeFilter\)/)
})

test('showcase css styles the search field and empty state', () => {
  const css = read('../src/components/ProjectShowcase/ProjectShowcase.css')
  assert.match(css, /\.projects-showcase__search-input/)
  assert.match(css, /\.projects-showcase__empty-title/)
  assert.match(css, /\.projects-showcase__empty-reset/)
})

// ----------------------------------------------------------------- Block C

test('showcase syncs view, category and search with the URL', () => {
  const source = read('../src/components/ProjectShowcase/ProjectShowcase.jsx')
  const viewMod = read('../src/components/ProjectShowcase/projectsView.js')
  assert.match(source, /useSearchParams/)
  // hydrate initial state from the URL via lazy initializers + helper
  assert.match(source, /readUrlParam/)
  assert.match(viewMod, /window\.location\.search/)
  // write each piece of state back to the URL
  assert.match(source, /params\.set\('view'/)
  assert.match(source, /params\.set\('cat'/)
  assert.match(source, /params\.set\('q'/)
  // replace (no history spam)
  assert.match(source, /replace: true/)
})

// ----------------------------------------------------------------- Block D

test('list view renders a lazy, reduced-motion-aware hover background video', () => {
  const source = read('../src/components/ProjectShowcase/ProjectShowcase.jsx')
  assert.match(source, /projects-showcase__bg/)
  assert.match(source, /bgProject/)
  assert.match(source, /onMouseEnter/)
  assert.match(source, /preload="none"/)
  assert.match(source, /muted/)
  assert.match(source, /loop/)
  assert.match(source, /playsInline/)
  // reduced motion (or no video) → poster image instead of <video>
  assert.match(source, /!reducedMotion && bgProject\.video/)
})

test('hover background css is full-bleed with a tunable overlay variable', () => {
  const css = read('../src/components/ProjectShowcase/ProjectShowcase.css')
  assert.match(css, /--projects-bg-overlay/)
  assert.match(css, /\.projects-showcase__bg-media/)
  assert.match(css, /\.projects-showcase__bg-overlay/)
  assert.match(css, /width:\s*100vw/)
})

// ----------------------------------------------------------------- Block E

test('large/grid cards play a hover video and reveal titles via clip-path', () => {
  const source = read('../src/components/ProjectShowcase/ProjectShowcase.jsx')
  assert.match(source, /projects-showcase__case-video/)
  assert.match(source, /projects-showcase__case--playing/)
  assert.match(source, /onMouseEnter=\{\(\) => setHover\(true\)\}/)
  assert.match(source, /clipPath: 'inset\(0 0 100% 0\)'/)
  // reduced motion guards the hover video
  assert.match(source, /showVideo = hover && !reducedMotion/)
})

test('thumbnail hover video css fades over the poster', () => {
  const css = read('../src/components/ProjectShowcase/ProjectShowcase.css')
  assert.match(css, /\.projects-showcase__case-video/)
  assert.match(css, /\.projects-showcase__case--playing \.projects-showcase__case-video/)
})

// ------------------------------------------ Review hardening (post-review fixes)

test('review fixes: a11y, light-theme contrast, bg reset, mobile scroll lock', () => {
  const showcase = read('../src/components/ProjectShowcase/ProjectShowcase.jsx')
  // self-describing live counter + empty state announced
  assert.match(showcase, /de \$\{showcaseProjects\.length\} proyectos/)
  assert.match(showcase, /role="status"/)
  // focus returns to the search input after clearing
  assert.match(showcase, /searchInputRef\.current\?\.focus\(\)/)
  // hover background auto-clears (derived) when leaving list view / no results
  assert.match(showcase, /const bgActive = bgVisible && view === VIEWS\.LIST && Boolean\(resultKey\)/)
  // light-theme contrast hook for the hover background
  assert.match(showcase, /data-bg-active=/)

  const css = read('../src/components/ProjectShowcase/ProjectShowcase.css')
  assert.match(css, /\[data-bg-active='true'\] \.projects-showcase__row-title/)
  assert.match(css, /\.projects-showcase__search-clear[\s\S]*width:\s*1\.5rem/)

  const nav = read('../src/components/Nav/Nav.jsx')
  assert.match(nav, /getLenis/)
  assert.match(nav, /lenis\.stop\(\)/)
})

// ----------------------------------------------------------------- Block F

test('lenis smooth scroll is wired, synced to ScrollTrigger and reduced-motion aware', () => {
  const hook = read('../src/hooks/useLenis.js')
  assert.match(hook, /import Lenis from 'lenis'/)
  assert.match(hook, /lenis\.on\('scroll', ScrollTrigger\.update\)/)
  assert.match(hook, /gsap\.ticker\.add/)
  assert.match(hook, /lenis\.destroy\(\)/)
  assert.match(hook, /export const getLenis/)
  const layout = read('../src/layouts/MainLayout.jsx')
  assert.match(layout, /useLenis\(!reducedMotion\)/)
})

test('lenis css overrides native scroll-behavior while active', () => {
  const css = read('../src/index.css')
  assert.match(css, /\.lenis\.lenis-smooth/)
  assert.match(css, /scroll-behavior:\s*auto\s*!important/)
})

test('page transition and project detail reset scroll through lenis', () => {
  const pt = read('../src/components/PageTransition/PageTransition.jsx')
  assert.match(pt, /getLenis/)
  assert.match(pt, /lenis\.scrollTo\(0, \{ immediate: true \}\)/)
  const detail = read('../src/pages/ProjectDetailPage.jsx')
  assert.match(detail, /getLenis/)
})

// ----------------------------------------------------------------- Block G

test('shared-element transition captures the thumbnail and grows the hero', () => {
  const showcase = read('../src/components/ProjectShowcase/ProjectShowcase.jsx')
  assert.match(showcase, /setSharedThumb/)
  assert.match(showcase, /getBoundingClientRect/)
  assert.match(showcase, /state=\{\{ sharedThumb: true \}\}/)

  const detail = read('../src/pages/ProjectDetailPage.jsx')
  assert.match(detail, /consumeSharedThumb/)
  assert.match(detail, /transformOrigin: 'top left'/)

  const store = read('../src/transitions/sharedThumbStore.js')
  assert.match(store, /export const setSharedThumb/)
  assert.match(store, /export const consumeSharedThumb/)

  const pt = read('../src/components/PageTransition/PageTransition.jsx')
  assert.match(pt, /location\.state\?\.sharedThumb/)
})
