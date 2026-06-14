import { useEffect } from 'react'
import { useLocation } from 'react-router'
import { getRouteMeta, getJsonLd, THEME_COLORS } from './routeMeta'

const ensureMetaTag = (selector, attributes) => {
  let element = document.head.querySelector(selector)

  if (!element) {
    element = document.createElement('meta')
    document.head.appendChild(element)
  }

  Object.entries(attributes).forEach(([key, value]) => {
    element.setAttribute(key, value)
  })

  return element
}

const ensureJsonLd = (data) => {
  let el = document.head.querySelector('script[type="application/ld+json"]')

  if (data === null) {
    if (el) {
      el.remove()
    }
    return
  }

  if (!el) {
    el = document.createElement('script')
    el.type = 'application/ld+json'
    document.head.appendChild(el)
  }

  el.textContent = JSON.stringify(data).replace(/</g, '\\u003c')
}

const ensureLinkTag = (selector, attributes) => {
  let element = document.head.querySelector(selector)

  if (!element) {
    element = document.createElement('link')
    document.head.appendChild(element)
  }

  Object.entries(attributes).forEach(([key, value]) => {
    element.setAttribute(key, value)
  })

  return element
}

export default function RouteMeta({ theme = 'dark' }) {
  const location = useLocation()

  useEffect(() => {
    const meta = getRouteMeta(location.pathname)
    const themeColor = THEME_COLORS[theme] ?? THEME_COLORS.dark

    document.title = meta.title

    ensureMetaTag('meta[name="description"]', {
      name: 'description',
      content: meta.description,
    })
    ensureMetaTag('meta[name="robots"]', {
      name: 'robots',
      content: meta.robots,
    })
    ensureMetaTag('meta[name="theme-color"]', {
      name: 'theme-color',
      content: themeColor,
    })
    ensureMetaTag('meta[property="og:type"]', {
      property: 'og:type',
      content: meta.ogType,
    })
    ensureMetaTag('meta[property="og:title"]', {
      property: 'og:title',
      content: meta.title,
    })
    ensureMetaTag('meta[property="og:description"]', {
      property: 'og:description',
      content: meta.description,
    })
    ensureMetaTag('meta[property="og:url"]', {
      property: 'og:url',
      content: meta.canonicalUrl,
    })
    ensureMetaTag('meta[property="og:image"]', {
      property: 'og:image',
      content: meta.image,
    })
    ensureMetaTag('meta[property="og:site_name"]', {
      property: 'og:site_name',
      content: 'Manzana Cuatro',
    })
    ensureMetaTag('meta[name="twitter:card"]', {
      name: 'twitter:card',
      content: 'summary_large_image',
    })
    ensureMetaTag('meta[name="twitter:title"]', {
      name: 'twitter:title',
      content: meta.title,
    })
    ensureMetaTag('meta[name="twitter:description"]', {
      name: 'twitter:description',
      content: meta.description,
    })
    ensureMetaTag('meta[name="twitter:image"]', {
      name: 'twitter:image',
      content: meta.image,
    })
    ensureLinkTag('link[rel="canonical"]', {
      rel: 'canonical',
      href: meta.canonicalUrl,
    })

    ensureJsonLd(getJsonLd(location.pathname))
  }, [location.pathname, theme])

  return null
}
