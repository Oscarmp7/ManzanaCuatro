import { showcaseProjects } from '../data/siteContent.js'
import { getRouteMeta, getJsonLd, THEME_COLORS } from './routeMeta.js'

const HEAD_CLOSE_TAG = '</head>'

const escapeHtml = (value) =>
  String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')

const replaceOrAppend = (html, matcher, replacement) => {
  if (matcher.test(html)) {
    return html.replace(matcher, replacement)
  }

  return html.replace(HEAD_CLOSE_TAG, `  ${replacement}\n${HEAD_CLOSE_TAG}`)
}

const buildMetaTag = (attribute, name, value) =>
  `<meta ${attribute}="${name}" content="${escapeHtml(value)}" />`

const buildCanonicalTag = (value) =>
  `<link rel="canonical" href="${escapeHtml(value)}" />`

export function getStaticRouteEntries() {
  return [
    '/',
    '/proyectos',
    '/studio',
    '/contacto',
    '/404',
    ...showcaseProjects.map((project) => `/proyectos/${project.slug}`),
  ].map((pathname) => ({
    pathname,
    meta: getRouteMeta(pathname),
    jsonLd: getJsonLd(pathname),
  }))
}

export function renderRouteHtml(template, meta, jsonLd = null) {
  let html = template

  html = replaceOrAppend(html, /<title>[\s\S]*?<\/title>/, `<title>${escapeHtml(meta.title)}</title>`)
  html = replaceOrAppend(
    html,
    /<meta name="description" content="[\s\S]*?"\s*\/?>/,
    buildMetaTag('name', 'description', meta.description),
  )
  html = replaceOrAppend(
    html,
    /<meta name="theme-color" content="[\s\S]*?"\s*\/?>/,
    buildMetaTag('name', 'theme-color', meta.themeColor ?? '#050505'),
  )
  html = replaceOrAppend(
    html,
    /<meta name="robots" content="[\s\S]*?"\s*\/?>/,
    buildMetaTag('name', 'robots', meta.robots),
  )
  html = replaceOrAppend(
    html,
    /<meta property="og:type" content="[\s\S]*?"\s*\/?>/,
    buildMetaTag('property', 'og:type', meta.ogType),
  )
  html = replaceOrAppend(
    html,
    /<meta property="og:title" content="[\s\S]*?"\s*\/?>/,
    buildMetaTag('property', 'og:title', meta.title),
  )
  html = replaceOrAppend(
    html,
    /<meta property="og:description" content="[\s\S]*?"\s*\/?>/,
    buildMetaTag('property', 'og:description', meta.description),
  )
  html = replaceOrAppend(
    html,
    /<meta property="og:url" content="[\s\S]*?"\s*\/?>/,
    buildMetaTag('property', 'og:url', meta.canonicalUrl),
  )
  html = replaceOrAppend(
    html,
    /<meta property="og:image" content="[\s\S]*?"\s*\/?>/,
    buildMetaTag('property', 'og:image', meta.image),
  )
  html = replaceOrAppend(
    html,
    /<meta name="twitter:title" content="[\s\S]*?"\s*\/?>/,
    buildMetaTag('name', 'twitter:title', meta.title),
  )
  html = replaceOrAppend(
    html,
    /<meta name="twitter:description" content="[\s\S]*?"\s*\/?>/,
    buildMetaTag('name', 'twitter:description', meta.description),
  )
  html = replaceOrAppend(
    html,
    /<meta name="twitter:image" content="[\s\S]*?"\s*\/?>/,
    buildMetaTag('name', 'twitter:image', meta.image),
  )
  html = replaceOrAppend(
    html,
    /<link rel="canonical" href="[\s\S]*?"\s*\/?>/,
    buildCanonicalTag(meta.canonicalUrl),
  )

  if (jsonLd) {
    const jsonLdTag = `<script type="application/ld+json">${
      JSON.stringify(jsonLd).replace(/</g, '\\u003c')
    }</script>`
    html = replaceOrAppend(
      html,
      /<script type="application\/ld\+json">[\s\S]*?<\/script>/,
      jsonLdTag,
    )
  }

  return html
}

export { THEME_COLORS }
