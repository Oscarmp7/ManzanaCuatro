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

test('studio marquee: scroll-velocity ticker, accent word + circular separator', () => {
  const mq = read('../src/components/studio/StudioMarquee.jsx')
  assert.match(mq, /ScrollTrigger\.getVelocity/)
  assert.match(mq, /gsap\.ticker\.add/)
  assert.match(mq, /gsap\.utils\.wrap/)
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

test('studio behind-the-scenes: bg title + per-column parallax masonry, lazy', () => {
  const bts = read('../src/components/studio/StudioBehindScenes.jsx')
  assert.match(bts, /studio-bts__bg-title/)
  assert.match(bts, /colRefs/)
  assert.match(bts, /scrub: true/)
  assert.match(bts, /loading="lazy"/)
  const data = read('../src/data/siteContent.js')
  assert.match(data, /behindScenes:/)
  assert.match(read('../src/pages/StudioPage.jsx'), /StudioBehindScenes/)
})

// ----------------------------------------------------------------- Blocks 6-8

test('studio clients: sticky header + grayscale→color logo grid', () => {
  const cl = read('../src/components/studio/StudioClients.jsx')
  assert.match(cl, /studio-clients__grid/)
  const css = read('../src/components/studio/StudioClients.css')
  assert.match(css, /position: sticky/)
  assert.match(css, /grayscale/)
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

test('studio closing: CTA + blue glow + oversized wordmark', () => {
  const c = read('../src/components/studio/StudioClosing.jsx')
  assert.match(c, /studio-closing__wordmark/)
  const css = read('../src/components/studio/StudioClosing.css')
  assert.match(css, /studio-closing__glow/)
  assert.match(css, /radial-gradient/)
  assert.match(read('../src/pages/StudioPage.jsx'), /StudioClosing/)
})
