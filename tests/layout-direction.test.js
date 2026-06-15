import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'

test('app keeps the multipage shell without legacy chrome', () => {
  const appSource = readFileSync(new URL('../src/App.jsx', import.meta.url), 'utf8')

  assert.doesNotMatch(appSource, /Cursor/)
  assert.doesNotMatch(appSource, /FilmGrain/)
  assert.doesNotMatch(appSource, /Marquee/)
  assert.match(appSource, /lazy\(\(\)\s*=>\s*import/)
  assert.match(appSource, /Suspense/)
  assert.match(appSource, /path="proyectos"/)
  assert.match(appSource, /path="proyectos\/:slug"/)
  assert.match(appSource, /path="studio"/)
  assert.match(appSource, /path="contacto"/)
  assert.match(appSource, /path="\*"/)
})

test('home page is rebuilt around a pinned reel and integrated end frame', () => {
  const homeSource = readFileSync(new URL('../src/pages/HomePage.jsx', import.meta.url), 'utf8')

  assert.match(homeSource, /HomeReel/)
  assert.match(homeSource, /HomeClientBand/)
  assert.match(homeSource, /HomeEndFrame/)
  assert.doesNotMatch(homeSource, /HomeHeroStage/)
  assert.doesNotMatch(homeSource, /HomeMediaFlow/)
  assert.doesNotMatch(homeSource, /HomeClosingCta/)
  assert.doesNotMatch(homeSource, /from '\.\.\/components\/Hero\/Hero'/)
  assert.doesNotMatch(homeSource, /from '\.\.\/components\/Marquee\/Marquee'/)
  assert.doesNotMatch(homeSource, /from '\.\.\/components\/ProjectsPreview\/ProjectsPreview'/)
})

test('loader plays the grade reveal: log scene, mask wipe, colorist HUD and stage tokens', () => {
  const loaderSource = readFileSync(new URL('../src/components/Loader/Loader.jsx', import.meta.url), 'utf8')
  const loaderCss = readFileSync(new URL('../src/components/Loader/Loader.css', import.meta.url), 'utf8')

  // Title card mirrors the home brand card content
  assert.match(loaderSource, /siteContent\.brand\.name/)
  assert.match(loaderSource, /siteContent\.hero\.eyebrow/)
  assert.match(loaderSource, /siteContent\.hero\.primaryCta\.label/)
  assert.doesNotMatch(loaderSource, />M4</)

  // Grade reveal structure
  assert.match(loaderSource, /loader__scene--log/)
  assert.match(loaderSource, /loader__hud/)
  assert.match(loaderSource, /--grade-x/)
  assert.match(loaderCss, /mask-image/)
  assert.match(loaderCss, /var\(--grade-x\)/)
  assert.match(loaderCss, /\.loader__view/)
  assert.match(loaderCss, /\.loader__grade-bar/)

  // Theme-safe: the stage never reads themable text/background tokens
  assert.match(loaderCss, /var\(--stage-bg\)/)
  assert.match(loaderCss, /var\(--stage-text\)/)
  assert.doesNotMatch(loaderCss, /color:\s*var\(--text\)/)
  assert.doesNotMatch(loaderCss, /background:\s*#050505/)
})

test('home reel exposes pinned frames and fullscreen gallery with scroll-driven CSS variables', () => {
  const reelSource = readFileSync(new URL('../src/components/HomeReel/HomeReel.jsx', import.meta.url), 'utf8')
  const reelCss = readFileSync(new URL('../src/components/HomeReel/HomeReel.css', import.meta.url), 'utf8')
  const hookSource = readFileSync(new URL('../src/hooks/useHomeReelScroll.js', import.meta.url), 'utf8')

  // Structure
  assert.match(reelSource, /home-reel__sticky/)
  assert.match(reelSource, /home-reel__title-card/)
  assert.match(reelSource, /siteContent\.colorization\.title/)
  assert.match(reelSource, /siteContent\.colorization\.cases/)
  assert.match(reelSource, /home-reel__color-stage/)
  assert.match(reelSource, /home-reel__color-wash/)
  assert.match(reelSource, /home-reel__gallery-stage/)
  assert.match(reelSource, /home-reel__gallery-item/)
  assert.match(reelSource, /--gallery-x/)
  assert.match(reelSource, /c\.client/)
  assert.match(reelSource, /c\.year/)
  assert.match(reelSource, /c\.tags\.map/)
  assert.match(reelSource, /<video/)
  assert.match(reelSource, /autoPlay/)
  assert.match(reelSource, /muted/)
  assert.match(reelSource, /loop/)
  assert.match(reelSource, /playsInline/)
  assert.match(reelSource, /showcaseProjects\.slice\(0,\s*4\)/)
  assert.match(reelSource, /'--reel-frames': reducedMotion \? 1 : reelProjects\.length \+ REEL_SETTLE_HOLD \+ COLOR_STAGE_TRANSITION_COUNT/)

  // Hook timing constants
  assert.match(hookSource, /const TITLE_FADE_OUT_START = 0\.38/)
  assert.match(hookSource, /const TITLE_FADE_OUT_END = 0\.58/)
  assert.match(hookSource, /const TITLE_FADE_IN_START = 0\.48/)
  assert.match(hookSource, /const TITLE_FADE_IN_END = 0\.74/)
  assert.match(hookSource, /const COLOR_TITLE_DROP_END = 0\.56/)
  assert.match(hookSource, /const COLOR_TITLE_FILL_START = 0\.66/)
  assert.match(hookSource, /const REEL_SETTLE_HOLD = 0\.58/)
  assert.match(hookSource, /const GALLERY_ENTRY_DURATION =/)
  assert.match(hookSource, /const GALLERY_HOLD_DURATION =/)
  assert.match(hookSource, /const GALLERY_FIRST_ENTRY_END =/)
  assert.match(hookSource, /--grade-title-covered/)
  assert.match(hookSource, /--gallery-x/)
  assert.match(hookSource, /--gallery-meta-opacity/)
  assert.match(hookSource, /querySelector\('\.home-reel__color-title-shell'\)/)
  assert.match(hookSource, /const titleEntryDistance = Math\.max\(/)
  assert.match(hookSource, /normalizeRange\(\s*localProgress,\s*TITLE_FADE_IN_START,\s*TITLE_FADE_IN_END,\s*\)/)
  assert.match(hookSource, /scrollTrigger:\s*\{[\s\S]*scrub:\s*true/)

  // CSS structure — title animation intact
  assert.match(reelCss, /\.home-reel__frame/)
  assert.match(reelCss, /\.home-reel__band/)
  assert.match(reelCss, /\.home-reel__color-title/)
  assert.match(reelCss, /\.home-reel__color-title-shell[\s\S]*padding-block:\s*0\.14em 0\.18em;/)
  assert.match(reelCss, /\.home-reel__color-title-shell[\s\S]*justify-items:\s*center;/)
  assert.match(reelCss, /\.home-reel__color-title-copy[\s\S]*padding-block:\s*0\.14em 0\.18em;/)
  assert.match(reelCss, /\.home-reel__color-title-copy[\s\S]*overflow:\s*visible;/)
  assert.match(reelCss, /\.home-reel__color-title-copy[\s\S]*grid-area:\s*1\s*\/\s*1;/)
  assert.match(reelCss, /--grade-title-fill-opacity:/)
  assert.match(reelCss, /--grade-title-covered:/)
  assert.match(reelCss, /\.home-reel__color-wash/)

  // CSS structure — new gallery
  assert.match(reelCss, /\.home-reel__gallery-stage/)
  assert.match(reelCss, /\.home-reel__gallery-item/)
  assert.match(reelCss, /translateX\(var\(--gallery-x/)
  assert.match(reelCss, /\.home-reel__gallery-meta/)
  assert.match(reelCss, /--gallery-meta-opacity/)

  // CSS structure — general
  assert.match(reelCss, /--grade-title-rest-opacity:/)
  assert.match(reelCss, /--title-step:/)
  assert.match(reelCss, /\.home-reel__title-window/)
  assert.match(reelCss, /--title-opacity:/)
  assert.match(reelCss, /--title-blur:/)
  assert.match(reelCss, /\.home-reel__title-card[\s\S]*filter:\s*blur\(var\(--title-blur\)\)/)
  assert.match(reelCss, /min-height:\s*calc\(var\(--reel-frames\)\s*\*\s*100dvh\)/)
  assert.match(reelCss, /height:\s*100dvh/)
  assert.doesNotMatch(reelCss, /100svh/)
  assert.doesNotMatch(reelSource, /home-reel__color-reel/)
  assert.doesNotMatch(reelCss, /\.home-reel__color-reel/)
  assert.doesNotMatch(reelSource, /home-reel__brand-band/)
  assert.doesNotMatch(reelSource, /BRAND_BAND_FADE_START/)
  assert.doesNotMatch(reelSource, /ComparisonSlider/)
  assert.doesNotMatch(reelCss, /\.home-reel__comparison-stage/)
})

test('gallery stage renders fullscreen items driven by scroll CSS variables', () => {
  const reelSource = readFileSync(new URL('../src/components/HomeReel/HomeReel.jsx', import.meta.url), 'utf8')
  const reelCss = readFileSync(new URL('../src/components/HomeReel/HomeReel.css', import.meta.url), 'utf8')

  assert.match(reelSource, /home-reel__gallery-stage/)
  assert.match(reelSource, /home-reel__gallery-item/)
  assert.match(reelSource, /--gallery-x/)
  assert.match(reelCss, /\.home-reel__gallery-item/)
  assert.match(reelCss, /translateX\(var\(--gallery-x/)
})

test('home client band renders a continuous loop before the closing frame', () => {
  const bandSource = readFileSync(new URL('../src/components/HomeClientBand/HomeClientBand.jsx', import.meta.url), 'utf8')
  const bandCss = readFileSync(new URL('../src/components/HomeClientBand/HomeClientBand.css', import.meta.url), 'utf8')

  assert.match(bandSource, /home-client-band/)
  assert.match(bandSource, /home-client-band__group/)
  assert.match(bandSource, /siteContent\.clients/)
  assert.doesNotMatch(bandSource, /showcaseProjects/)
  assert.match(bandCss, /\.home-client-band__track/)
  assert.match(bandCss, /\.home-client-band__group/)
  assert.match(bandCss, /animation:\s*home-client-band-scroll/)
  assert.match(bandCss, /42s linear infinite/)
})

test('home end frame integrates contact and lower support links without the old client list', () => {
  const endSource = readFileSync(new URL('../src/components/HomeEndFrame/HomeEndFrame.jsx', import.meta.url), 'utf8')
  const endCss = readFileSync(new URL('../src/components/HomeEndFrame/HomeEndFrame.css', import.meta.url), 'utf8')
  const contactSource = readFileSync(new URL('../src/pages/ContactPage.jsx', import.meta.url), 'utf8')

  assert.match(endSource, /siteContent\.contact\.title/)
  assert.match(endSource, /TextSwap/)
  assert.match(contactSource, /contact\.title/)
  assert.match(endSource, /home-end__footer-links/)
  assert.match(endCss, /\.home-end__title-label/)
  assert.match(endCss, /\.home-end__title-label[\s\S]*text-shadow:/)
  assert.match(endCss, /\.home-end__title:is\(:hover,\s*:focus-visible\)\s+\.text-swap__layer[\s\S]*transition-delay:/)
  assert.match(endCss, /\.home-end[\s\S]*background:\s*var\(--bg\)/)
  assert.match(endCss, /min-height:\s*100dvh/)
  assert.doesNotMatch(endCss, /100svh/)
  assert.doesNotMatch(endCss, /\.home-end[\s\S]*background:\s*#020202/)
  assert.doesNotMatch(endSource, /home-end__top-list/)
})

test('studio page keeps a structural heading even with the manifesto-led layout', () => {
  const studioSource = readFileSync(new URL('../src/pages/StudioPage.jsx', import.meta.url), 'utf8')

  assert.match(studioSource, /<h1 className="studio__sr-title">/)
})

test('projects page uses an editorial filtered case-study layout', () => {
  const projectsSource = readFileSync(new URL('../src/pages/ProjectsPage.jsx', import.meta.url), 'utf8')
  const showcaseSource = readFileSync(new URL('../src/components/ProjectShowcase/ProjectShowcase.jsx', import.meta.url), 'utf8')
  const showcaseCss = readFileSync(new URL('../src/components/ProjectShowcase/ProjectShowcase.css', import.meta.url), 'utf8')

  assert.match(projectsSource, /ProjectShowcase/)
  assert.match(showcaseSource, /const \{ projectsPage \} = siteContent/)
  assert.match(showcaseSource, /const \[activeFilter,\s*setActiveFilter\] = useState\(/)
  assert.match(showcaseSource, /projectsPage\.filters\.map/)
  assert.match(showcaseSource, /aria-pressed=\{filter\.id === activeFilter\}/)
  assert.match(showcaseSource, /showcaseProjects\.filter/)
  assert.match(showcaseSource, /project\.disciplines\.includes\(activeFilter\)/)
  assert.match(showcaseSource, /projects-showcase__hero/)
  assert.match(showcaseSource, /projects-showcase__filters/)
  assert.match(showcaseSource, /projects-showcase__rail/)
  assert.match(showcaseSource, /projects-showcase__case/)
  assert.match(showcaseSource, /projects-showcase__case-media/)
  assert.match(showcaseSource, /projects-showcase__case-body/)
  assert.match(showcaseSource, /projects-showcase__case-link/)
  assert.match(showcaseSource, /projects-showcase__case-chip/)
  assert.match(showcaseCss, /\.projects-showcase__hero/)
  assert.match(showcaseCss, /\.projects-showcase__filters/)
  assert.match(showcaseCss, /\.projects-showcase__case/)
  assert.match(showcaseCss, /\.projects-showcase__case-media/)
  assert.match(showcaseCss, /\.projects-showcase__case-body/)
  assert.match(showcaseCss, /\.projects-showcase__case-chip/)
  assert.match(showcaseCss, /@media \(max-width: 960px\)/)
  assert.match(showcaseCss, /@media \(max-width: 720px\)/)
  assert.doesNotMatch(showcaseSource, /showcase__arrow/)
  assert.doesNotMatch(showcaseSource, /setActiveIndex/)
  assert.doesNotMatch(showcaseCss, /\.showcase__arrow/)
})
