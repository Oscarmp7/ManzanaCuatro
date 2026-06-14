import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'

test('vite builds against the root base for the single Vercel target', async () => {
  const { default: viteConfig } = await import('../vite.config.js')

  assert.equal(viteConfig.base, '/')
})

test('the github pages dual-target plumbing stays removed', () => {
  const viteSource = readFileSync(new URL('../vite.config.js', import.meta.url), 'utf8')

  assert.doesNotMatch(viteSource, /DEPLOY_TARGET/)
  assert.doesNotMatch(viteSource, /github-pages/)
})
