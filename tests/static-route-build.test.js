import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'

test('static route build exposes route entries for marketing pages and project detail pages', async () => {
  const { getStaticRouteEntries } = await import('../src/seo/staticRouteBuild.js')

  const entries = getStaticRouteEntries()
  const routePaths = entries.map((entry) => entry.pathname)

  assert.deepEqual(routePaths.slice(0, 5), ['/', '/proyectos', '/studio', '/contacto', '/404'])
  assert.equal(routePaths.includes('/proyectos/changan-dominicana'), true)
  assert.equal(routePaths.includes('/proyectos/farma-extra'), true)
})

test('static route build injects canonical and social metadata into html templates', async () => {
  const { renderRouteHtml } = await import('../src/seo/staticRouteBuild.js')

  const template = `<!doctype html>
<html lang="es">
  <head>
    <meta charset="UTF-8" />
    <meta name="description" content="Base description" />
    <meta name="theme-color" content="#050505" />
    <meta name="robots" content="index, follow" />
    <meta property="og:site_name" content="Manzana Cuatro" />
    <meta property="og:type" content="website" />
    <meta property="og:title" content="Base title" />
    <meta property="og:description" content="Base description" />
    <meta property="og:url" content="https://manzanacuatro.com/" />
    <meta property="og:image" content="https://manzanacuatro.com/base.jpg" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="Base title" />
    <meta name="twitter:description" content="Base description" />
    <meta name="twitter:image" content="https://manzanacuatro.com/base.jpg" />
    <link rel="canonical" href="https://manzanacuatro.com/" />
    <title>Base title</title>
  </head>
  <body></body>
</html>`

  const html = renderRouteHtml(template, {
    title: 'Changan Dominicana | Manzana Cuatro',
    description: 'Contenido automotriz con foco comercial.',
    canonicalUrl: 'https://manzanacuatro.com/proyectos/changan-dominicana',
    image: 'https://manzanacuatro.com/changan.jpg',
    ogType: 'article',
    robots: 'index, follow',
    themeColor: '#050505',
  })

  assert.match(html, /<title>Changan Dominicana \| Manzana Cuatro<\/title>/)
  assert.match(
    html,
    /<meta property="og:url" content="https:\/\/manzanacuatro\.com\/proyectos\/changan-dominicana" \/>/,
  )
  assert.match(
    html,
    /<link rel="canonical" href="https:\/\/manzanacuatro\.com\/proyectos\/changan-dominicana" \/>/,
  )
  assert.match(html, /<meta property="og:type" content="article" \/>/)
  assert.match(html, /<meta name="twitter:image" content="https:\/\/manzanacuatro\.com\/changan\.jpg" \/>/)
})

test('production build runs the static route html generator after vite', () => {
  const packageSource = readFileSync(new URL('../package.json', import.meta.url), 'utf8')

  assert.match(packageSource, /"build":\s*"vite build && node scripts\/generate-route-html\.mjs"/)
})
