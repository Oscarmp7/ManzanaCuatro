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
