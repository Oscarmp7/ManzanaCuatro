import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync, readdirSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join, extname } from 'node:path'

// Regression guards for the pre-launch production hardening pass:
// brand safety, cross-browser fallbacks, dead-code removal, and the studio
// hero/reel fixes. Mirrors the suite's file-content assertion style.

const here = dirname(fileURLToPath(import.meta.url))
const srcDir = join(here, '..', 'src')

const walk = (dir) => {
  const out = []
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name)
    if (entry.isDirectory()) out.push(...walk(full))
    else out.push(full)
  }
  return out
}

const allFiles = walk(srcDir)
const cssFiles = allFiles.filter((f) => extname(f) === '.css')
const read = (f) => readFileSync(f, 'utf8')

// ----------------------------------------------------------------- Brand

test('brand: the word "Amber" never ships in src (wrong brand name)', () => {
  const offenders = allFiles
    .filter((f) => /\.(jsx?|css|html)$/.test(f))
    .filter((f) => /amber/i.test(read(f)))
    .map((f) => f.slice(srcDir.length + 1))
  assert.deepEqual(offenders, [], `"Amber" found in: ${offenders.join(', ')}`)
})

// ----------------------------------------------------------------- Cross-browser

test('cross-browser: every blur backdrop-filter has a -webkit- twin (Safari)', () => {
  const missing = cssFiles
    .filter((f) => {
      const css = read(f)
      const hasStandard = /(^|[^-])backdrop-filter:\s*blur/m.test(css)
      const hasWebkit = /-webkit-backdrop-filter:\s*blur/.test(css)
      return hasStandard && !hasWebkit
    })
    .map((f) => f.slice(srcDir.length + 1))
  assert.deepEqual(missing, [], `backdrop-filter without -webkit- twin: ${missing.join(', ')}`)
})

// ----------------------------------------------------------------- Dead code

test('dead code: StudioPage.css is trimmed to the live sr-title only', () => {
  const css = read(join(srcDir, 'pages', 'StudioPage.css'))
  assert.match(css, /\.studio__sr-title/)
  // the old inline studio design (rebuilt as studio/Studio* components) is gone
  assert.doesNotMatch(css, /\.manifesto\b/)
  assert.doesNotMatch(css, /\.stats\b/)
  assert.doesNotMatch(css, /\.studio-about/)
  assert.doesNotMatch(css, /\.services\b/)
})

test('dead code: orphaned utils/math.js is removed (its callers inline their own)', () => {
  const mathFile = allFiles.find((f) => f.endsWith('math.js'))
  assert.equal(mathFile, undefined, 'src/utils/math.js should be deleted (no importers)')
})

// ----------------------------------------------------------------- Studio hero / reel

test('studio hero: a legibility scrim sits behind the cream wordmark', () => {
  const css = read(join(srcDir, 'components', 'studio', 'StudioHero.css'))
  assert.match(css, /studio-hero__content::before/)
  assert.match(css, /radial-gradient/)
})

test('studio reel lens does not eagerly fetch a second copy of the hero reel', () => {
  const cur = read(join(srcDir, 'components', 'studio', 'StudioReelCursor.jsx'))
  assert.match(cur, /preload="none"/)
})

test('reel modal progress slider exposes valuetext and traps seek keys', () => {
  const modal = read(join(srcDir, 'components', 'studio', 'ReelModal.jsx'))
  assert.match(modal, /aria-valuetext=/)
  assert.match(modal, /'Home'/)
  assert.match(modal, /'End'/)
})
