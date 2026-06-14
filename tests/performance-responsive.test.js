import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'

test('home reel caches stage measurements and limits how many videos stay live', () => {
  const source = readFileSync(new URL('../src/components/HomeReel/HomeReel.jsx', import.meta.url), 'utf8')

  assert.match(source, /const measurementRef = useRef/)
  assert.match(source, /const \[activeReelIndex,\s*setActiveReelIndex\] = useState\(0\)/)
  assert.match(source, /const shouldRenderReelMotionMedia =/)
  assert.match(source, /galleryItemRefs/)
  assert.match(source, /shouldPlayVideo=\{shouldRenderReelMotionMedia\(index\)\}/)
  assert.doesNotMatch(source, /getBoundingClientRect\(\)/)
})

test('gallery stage renders fullscreen items driven by scroll CSS variables', () => {
  const source = readFileSync(new URL('../src/components/HomeReel/HomeReel.css', import.meta.url), 'utf8')

  assert.match(source, /\.home-reel__gallery-stage/)
  assert.match(source, /\.home-reel__gallery-item/)
  assert.match(source, /translateX\(var\(--gallery-x/)
  assert.match(source, /\.home-reel__gallery-meta/)
  assert.doesNotMatch(source, /\.home-reel__comparison-stage/)
})

test('projects filter rail stops being sticky when it becomes a horizontal scroller on small screens', () => {
  const source = readFileSync(
    new URL('../src/components/ProjectShowcase/ProjectShowcase.css', import.meta.url),
    'utf8',
  )

  assert.match(
    source,
    /@media \(max-width: 720px\)\s*\{[\s\S]*\.projects-showcase__filters[\s\S]*position:\s*static;/,
  )
})

test('home client band duplicates only the base client list per marquee group', () => {
  const source = readFileSync(
    new URL('../src/components/HomeClientBand/HomeClientBand.jsx', import.meta.url),
    'utf8',
  )

  assert.match(source, /clients\.map/)
  assert.doesNotMatch(source, /loopItems/)
  assert.doesNotMatch(source, /Array\.from\(\{ length: 6 \}/)
})

test('closing frame keeps the current year dynamic and hardens external links', () => {
  const source = readFileSync(new URL('../src/components/HomeEndFrame/HomeEndFrame.jsx', import.meta.url), 'utf8')

  assert.match(source, /new Date\(\)\.getFullYear\(\)/)
  assert.match(source, /rel="noopener noreferrer"/)
  assert.doesNotMatch(source, /2026/)
})

test('mobile navigation hardens external links opened from the dialog', () => {
  const source = readFileSync(new URL('../src/components/Nav/Nav.jsx', import.meta.url), 'utf8')

  assert.match(source, /rel="noopener noreferrer"/)
})

test('transition-heavy layers release will-change hints on smaller screens or reduced motion', () => {
  const themeCss = readFileSync(
    new URL('../src/components/ThemeTransition/ThemeTransition.css', import.meta.url),
    'utf8',
  )
  const pageCss = readFileSync(
    new URL('../src/components/PageTransition/PageTransition.css', import.meta.url),
    'utf8',
  )
  const textSwapCss = readFileSync(
    new URL('../src/components/TextSwap/TextSwap.css', import.meta.url),
    'utf8',
  )

  assert.match(themeCss, /@media \(max-width: 900px\), \(prefers-reduced-motion: reduce\)/)
  assert.match(pageCss, /@media \(max-width: 900px\), \(prefers-reduced-motion: reduce\)/)
  assert.match(textSwapCss, /will-change:\s*auto;/)
})
