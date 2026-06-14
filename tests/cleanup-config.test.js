import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'

test('build config no longer carries unused tailwind plumbing', () => {
  const viteSource = readFileSync(new URL('../vite.config.js', import.meta.url), 'utf8')
  const packageSource = readFileSync(new URL('../package.json', import.meta.url), 'utf8')
  const cssSource = readFileSync(new URL('../src/index.css', import.meta.url), 'utf8')

  assert.doesNotMatch(viteSource, /tailwindcss/)
  assert.doesNotMatch(packageSource, /@tailwindcss\/vite/)
  assert.doesNotMatch(packageSource, /"tailwindcss"/)
  assert.doesNotMatch(cssSource, /@import "tailwindcss"/)
  assert.doesNotMatch(cssSource, /@theme/)
})

test('readme documents the actual project instead of the stock vite template', () => {
  const readmeSource = readFileSync(new URL('../README.md', import.meta.url), 'utf8')

  assert.match(readmeSource, /Manzana Cuatro/)
  assert.match(readmeSource, /npm run build/)
  assert.match(readmeSource, /Vercel/)
  assert.doesNotMatch(readmeSource, /GitHub Pages/)
  assert.doesNotMatch(readmeSource, /This template provides a minimal setup/)
})
