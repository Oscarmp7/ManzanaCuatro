import { showcaseProjects } from '../data/siteContent.js'

export const SITE_URL = 'https://manzanacuatro.com'

// Single source of truth for the browser chrome color per theme.
// Mirrors --bg in src/index.css.
export const THEME_COLORS = {
  dark: '#050505',
  light: '#f5f5f0',
}

const BASE_TITLE = 'Manzana Cuatro'
const BASE_DESCRIPTION =
  'Estudio de producción audiovisual en Santo Domingo para campañas, contenido social y marcas que necesitan una ejecución visual premium.'
const DEFAULT_IMAGE = showcaseProjects[0]?.poster ?? `${SITE_URL}/favicon.svg`

const normalizePath = (pathname = '/') => {
  if (!pathname) {
    return '/'
  }

  const path = pathname.startsWith('/') ? pathname : `/${pathname}`

  if (path.length > 1 && path.endsWith('/')) {
    return path.slice(0, -1)
  }

  return path
}

const createMeta = ({
  title,
  description,
  pathname,
  image = DEFAULT_IMAGE,
  ogType = 'website',
  robots = 'index, follow',
}) => ({
  title,
  description,
  canonicalUrl: `${SITE_URL}${pathname === '/' ? '/' : pathname}`,
  image,
  ogType,
  robots,
})

export function getRouteMeta(pathname) {
  const normalizedPath = normalizePath(pathname)

  if (normalizedPath === '/') {
    return createMeta({
      title: `${BASE_TITLE} | Producción audiovisual en Santo Domingo`,
      description: BASE_DESCRIPTION,
      pathname: normalizedPath,
    })
  }

  if (normalizedPath === '/proyectos') {
    return createMeta({
      title: `Proyectos | ${BASE_TITLE}`,
      description:
        'Casos seleccionados de producción audiovisual, filmación, fotografía y contenido de marca desarrollados por Manzana Cuatro.',
      pathname: normalizedPath,
    })
  }

  if (normalizedPath.startsWith('/proyectos/')) {
    const slug = normalizedPath.replace('/proyectos/', '')
    const project = showcaseProjects.find((entry) => entry.slug === slug)

    if (project) {
      return createMeta({
        title: `${project.title} | ${BASE_TITLE}`,
        description: project.summary,
        pathname: normalizedPath,
        image: project.poster,
        ogType: 'article',
      })
    }
  }

  if (normalizedPath === '/studio') {
    return createMeta({
      title: `Estudio | ${BASE_TITLE}`,
      description:
        'Conoce el enfoque, los servicios y la capacidad de estudio de Manzana Cuatro para marcas y campañas audiovisuales.',
      pathname: normalizedPath,
    })
  }

  if (normalizedPath === '/contacto') {
    return createMeta({
      title: `Contacto | ${BASE_TITLE}`,
      description:
        'Habla con Manzana Cuatro para cotizaciones, contenido social, producción comercial y campañas audiovisuales en RD.',
      pathname: normalizedPath,
    })
  }

  return createMeta({
    title: `404 | ${BASE_TITLE}`,
    description:
      'La página solicitada no existe. Explora el portafolio o vuelve al inicio de Manzana Cuatro.',
    pathname: normalizedPath,
    robots: 'noindex, nofollow',
  })
}

export function getJsonLd(pathname) {
  const normalizedPath = normalizePath(pathname)

  if (normalizedPath === '/') {
    return {
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'Organization',
          '@id': `${SITE_URL}/#organization`,
          name: BASE_TITLE,
          url: SITE_URL,
          sameAs: ['https://instagram.com/manzanacuatro'],
        },
        {
          '@type': 'WebSite',
          '@id': `${SITE_URL}/#website`,
          url: SITE_URL,
          name: BASE_TITLE,
          publisher: { '@id': `${SITE_URL}/#organization` },
        },
      ],
    }
  }

  if (normalizedPath.startsWith('/proyectos/')) {
    const slug = normalizedPath.replace('/proyectos/', '')
    const project = showcaseProjects.find((entry) => entry.slug === slug)

    if (project) {
      const schema = {
        '@context': 'https://schema.org',
        '@type': 'CreativeWork',
        '@id': `${SITE_URL}/proyectos/${project.slug}`,
        name: project.title,
        description: project.summary,
        url: `${SITE_URL}/proyectos/${project.slug}`,
        image: project.poster,
        dateCreated: project.year,
        creator: {
          '@type': 'Organization',
          '@id': `${SITE_URL}/#organization`,
          name: BASE_TITLE,
        },
        about: project.client,
        genre: project.category,
      }

      if (project.video) {
        schema['@type'] = 'VideoObject'
        schema.thumbnailUrl = project.poster
        schema.contentUrl = project.video
        schema.uploadDate = `${project.year}-01-01`
      }

      return schema
    }
  }

  return null
}
