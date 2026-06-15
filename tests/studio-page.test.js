import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'

const read = (relativePath) =>
  readFileSync(new URL(relativePath, import.meta.url), 'utf8')

// ----------------------------------------------------------------- Block 1

test('studio page keeps its sr heading and mounts the hero', () => {
  const page = read('../src/pages/StudioPage.jsx')
  assert.match(page, /<h1 className="studio__sr-title">/)
  assert.match(page, /StudioHero/)
})

test('studio hero plays an ambient reel loop and opens the reel modal', () => {
  const hero = read('../src/components/studio/StudioHero.jsx')
  assert.match(hero, /ReelModal/)
  assert.match(hero, /muted/)
  assert.match(hero, /loop/)
  assert.match(hero, /playsInline/)
  assert.match(hero, /setReelOpen/)
  // reduced motion → poster instead of autoplay video
  assert.match(hero, /reduced \? \(/)
  // tagline clip-path reveal
  assert.match(hero, /clipPath: 'inset\(100% 0 0 0\)'/)
  // custom reel lens cursor is wired in
  assert.match(hero, /StudioReelCursor/)
})

test('studio reel cursor: fine-pointer-gated lens with SVG ripple on the media', () => {
  const cur = read('../src/components/studio/StudioReelCursor.jsx')
  assert.match(cur, /\(hover: hover\) and \(pointer: fine\)/) // not on touch
  assert.match(cur, /prefers-reduced-motion/) // disabled under reduced motion
  assert.match(cur, /feDisplacementMap/) // real image displacement, not an overlay
  assert.match(cur, /studio-reel-cursor__lens/)
  const css = read('../src/components/studio/StudioReelCursor.css')
  // filter sits on the small lens-sized warp, not the full-size media (perf)
  assert.match(css, /\.studio-reel-cursor__warp/)
  assert.match(css, /filter: url\(#studio-reel-ripple\)/)
})

test('reel modal is a lazy, accessible custom player with scroll-lock', () => {
  const modal = read('../src/components/studio/ReelModal.jsx')
  assert.match(modal, /createPortal/)
  assert.match(modal, /aria-modal="true"/)
  // scroll lock through Lenis + body overflow
  assert.match(modal, /getLenis\(\)\?\.stop\(\)/)
  assert.match(modal, /document\.body\.style\.overflow = 'hidden'/)
  // close affordances: Esc + backdrop + button
  assert.match(modal, /Escape/)
  assert.match(modal, /onClick=\{onClose\}/)
  // custom controls
  assert.match(modal, /requestFullscreen/)
  assert.match(modal, /reel-modal__track/)
  assert.match(modal, /aria-label="Volumen"/)
  // reduced-motion path (fade, no scale)
  assert.match(modal, /if \(reduced\)/)
})

// ----------------------------------------------------------------- Block 2

test('studio manifesto: two-column reveal + stats count-up, refs & reduced-motion', () => {
  const m = read('../src/components/studio/StudioManifesto.jsx')
  assert.match(m, /studio-manifesto__cols/)
  // reveal targets collected via refs (no global selectors)
  assert.match(m, /addReveal/)
  assert.match(m, /ScrollTrigger/)
  // robust count-up (tween a proxy → write textContent)
  assert.match(m, /onUpdate/)
  // reduced motion shows the final number, not 0
  assert.match(m, /reduced \? stat\.value : '0'/)

  const page = read('../src/pages/StudioPage.jsx')
  assert.match(page, /<h1 className="studio__sr-title">/)
  assert.match(page, /StudioManifesto/)
})

// ----------------------------------------------------------------- Block 3

test('studio marquee: infinite velocity-reactive tween, accent word + circular separator', () => {
  const mq = read('../src/components/studio/StudioMarquee.jsx')
  assert.match(mq, /repeat:\s*-1/) // infinite loop tween (robust under StrictMode)
  assert.match(mq, /getVelocity/) // scroll velocity reacts
  assert.match(mq, /timeScale/) // velocity modulates speed
  assert.match(mq, /gsap\.utils\.wrap/) // seamless wrap
  assert.match(mq, /studio-marquee__word--accent/)
  assert.match(mq, /studio-marquee__sep/)
  const css = read('../src/components/studio/StudioMarquee.css')
  assert.match(css, /prefers-reduced-motion/)
  assert.match(read('../src/pages/StudioPage.jsx'), /StudioMarquee/)
})

// ----------------------------------------------------------------- Block 4

test('studio services carousel: cards + capabilities, arrows, drag, snap, stagger', () => {
  const sv = read('../src/components/studio/StudioServices.jsx')
  assert.match(sv, /scrollByCard/)
  assert.match(sv, /onPointerDown/)
  assert.match(sv, /capabilities\.map/)
  assert.match(sv, /studio-services__caps/)
  const css = read('../src/components/studio/StudioServices.css')
  assert.match(css, /scroll-snap-type/)
  // data extended with descriptions + capabilities
  const data = read('../src/data/siteContent.js')
  assert.match(data, /capabilities:/)
  assert.match(read('../src/pages/StudioPage.jsx'), /StudioServices/)
})

// ----------------------------------------------------------------- Block 5

test('studio behind-the-scenes: bg title + dense rise-then-settle masonry, lazy', () => {
  const bts = read('../src/components/studio/StudioBehindScenes.jsx')
  assert.match(bts, /studio-bts__bg-title/)
  // per-tile refs collected (no global selectors)
  assert.match(bts, /tileRefs/)
  // staggered rise that converges + settles exactly when the section is centred
  assert.match(bts, /stagger:/)
  assert.match(bts, /end: 'center center'/)
  assert.match(bts, /loading="lazy"/)
  // dense masonry via CSS multi-column
  const css = read('../src/components/studio/StudioBehindScenes.css')
  assert.match(css, /column-count/)
  const data = read('../src/data/siteContent.js')
  assert.match(data, /behindScenes:/)
  assert.match(read('../src/pages/StudioPage.jsx'), /StudioBehindScenes/)
})

// ----------------------------------------------------------------- Blocks 6-8

test('studio clients: centered head + count-agnostic grayscale logo wall', () => {
  const cl = read('../src/components/studio/StudioClients.jsx')
  assert.match(cl, /studio-clients__grid/)
  const css = read('../src/components/studio/StudioClients.css')
  assert.match(css, /flex-wrap/) // wall fills any row count cleanly
  assert.match(css, /text-align: center/) // centered heading on top
  assert.match(css, /grayscale/) // image logos desaturated by default
  assert.match(read('../src/pages/StudioPage.jsx'), /StudioClients/)
})

test('studio testimonials: pausable autoplay + segmented progress + arrows', () => {
  const t = read('../src/components/studio/StudioTestimonials.jsx')
  assert.match(t, /setInterval/)
  assert.match(t, /setPaused/)
  assert.match(t, /studio-testi__seg/)
  const css = read('../src/components/studio/StudioTestimonials.css')
  assert.match(css, /studio-testi-fill/)
  assert.match(read('../src/data/siteContent.js'), /testimonials:/)
  assert.match(read('../src/pages/StudioPage.jsx'), /StudioTestimonials/)
})

test('studio closing: solid wordmark grade-reveal + slate HUD (no gradient text)', () => {
  const c = read('../src/components/studio/StudioClosing.jsx')
  assert.match(c, /studio-closing__wordmark/)
  assert.match(c, /studio-closing__hud/) // cinematic slate
  const css = read('../src/components/studio/StudioClosing.css')
  assert.match(css, /--fill/) // grade-reveal wipe variable
  assert.match(css, /clip-path/) // mask wipe, not a colour gradient
  assert.doesNotMatch(css, /background-clip:\s*text/) // doctrine: no gradient text
  assert.match(read('../src/pages/StudioPage.jsx'), /StudioClosing/)
})
