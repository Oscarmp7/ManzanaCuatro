import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'

test('theme hook is hardened for storage-less environments and system preference fallback', () => {
  const source = readFileSync(new URL('../src/hooks/useTheme.js', import.meta.url), 'utf8')

  assert.match(source, /typeof window === 'undefined'/)
  assert.match(source, /window\.matchMedia\('\(prefers-color-scheme: light\)'\)/)
  assert.match(source, /try \{/)
  assert.match(source, /catch/)
  assert.doesNotMatch(source, /return localStorage\.getItem\('m4-theme'\) \|\| 'dark'/)
})

test('reduced motion hook reads the current preference on first render without assuming browser globals', () => {
  const source = readFileSync(
    new URL('../src/hooks/usePrefersReducedMotion.js', import.meta.url),
    'utf8',
  )

  assert.match(source, /useState\(\(\) =>/)
  assert.match(source, /typeof window === 'undefined'/)
  assert.match(source, /window\.matchMedia\('\(prefers-reduced-motion: reduce\)'\)/)
})

test('app shell includes an error boundary around routed content', () => {
  const source = readFileSync(new URL('../src/App.jsx', import.meta.url), 'utf8')

  assert.match(source, /import ErrorBoundary from '\.\/components\/ErrorBoundary\/ErrorBoundary'/)
  assert.match(source, /<ErrorBoundary>/)
  assert.match(source, /<\/ErrorBoundary>/)
})

test('project detail and 404 pages use dedicated resilient page wrappers', () => {
  const detailSource = readFileSync(new URL('../src/pages/ProjectDetailPage.jsx', import.meta.url), 'utf8')
  const notFoundSource = readFileSync(new URL('../src/pages/NotFoundPage.jsx', import.meta.url), 'utf8')

  assert.match(detailSource, /className="page page--project-detail"/)
  assert.match(notFoundSource, /import '\.\/NotFoundPage\.css'/)
  assert.match(notFoundSource, /className="page not-found-page"/)
})

test('project hygiene ignores local env files and vercel browser cookie artifacts', () => {
  const gitignoreSource = readFileSync(new URL('../.gitignore', import.meta.url), 'utf8')

  assert.match(gitignoreSource, /^\.env$/m)
  assert.match(gitignoreSource, /^\.env\.\*$/m)
  assert.match(gitignoreSource, /^vercel-cookie\.txt$/m)
})
