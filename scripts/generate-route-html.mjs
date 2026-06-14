import { mkdir, readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { getStaticRouteEntries, renderRouteHtml, THEME_COLORS } from '../src/seo/staticRouteBuild.js'

const currentFile = fileURLToPath(import.meta.url)
const rootDir = path.resolve(path.dirname(currentFile), '..')
const distDir = path.join(rootDir, 'dist')
const templatePath = path.join(distDir, 'index.html')

const resolveOutputPath = (pathname) => {
  if (pathname === '/') {
    return path.join(distDir, 'index.html')
  }

  if (pathname === '/404') {
    return path.join(distDir, '404.html')
  }

  return path.join(distDir, pathname.slice(1), 'index.html')
}

const template = await readFile(templatePath, 'utf8')
const routeEntries = getStaticRouteEntries()

await Promise.all(
  routeEntries.map(async ({ pathname, meta, jsonLd }) => {
    const outputPath = resolveOutputPath(pathname)
    const html = renderRouteHtml(template, { ...meta, themeColor: THEME_COLORS.dark }, jsonLd)

    await mkdir(path.dirname(outputPath), { recursive: true })
    await writeFile(outputPath, html)
  }),
)

console.log(`Generated ${routeEntries.length} route HTML files.`)
