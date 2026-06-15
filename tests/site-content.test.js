import test from 'node:test'
import assert from 'node:assert/strict'

import { showcaseProjects, siteContent } from '../src/data/siteContent.js'

test('site content reflects the Manzana Cuatro brief and dedicated client band data', () => {
  assert.equal(siteContent.brand.name, 'Manzana Cuatro')
  assert.equal(siteContent.brand.email, 'info@manzanacuatro.com')
  assert.match(siteContent.brand.whatsappHref, /18498633817/)
  assert.equal(siteContent.hero.primaryCta.label, 'Ver portafolio')
  assert.equal(siteContent.contact.title, 'Comienza tu historia')
  // Roster is placeholder/demo content (no confirmed clients yet); this guards
  // the first 5 seed entries against accidental change until the real roster lands.
  assert.deepEqual(
    siteContent.clients.slice(0, 5).map((client) => client.name),
    [
      'La Bodega',
      'Shibuya',
      'Changan Dominicana',
      'Farma Extra',
      'Porsche Center Santo Domingo',
    ],
  )
  assert.ok(siteContent.clients.length >= 5)
  assert.ok(siteContent.clients.every((client) => typeof client.name === 'string'))
})

test('showcase projects, services, and reel videos match the brief inventory', () => {
  assert.equal(showcaseProjects.length, 5)
  assert.deepEqual(
    showcaseProjects.map((project) => project.title),
    [
      'La Bodega Día de los Padres',
      'Shibuya Casa de Campo',
      'Changan Dominicana',
      'Farma Extra',
      'Porsche Center Santo Domingo',
    ],
  )

  assert.deepEqual(
    siteContent.services.map((service) => service.title),
    [
      'Producción audiovisual',
      'Colorización',
      'Filmación',
      'Fotografía',
      'Creación de contenido',
    ],
  )

  assert.equal(showcaseProjects.slice(0, 4).every((project) => typeof project.video === 'string'), true)
  assert.equal(new Set(showcaseProjects.slice(0, 4).map((project) => project.video)).size, 4)
  assert.ok(
    new Set(
      showcaseProjects
        .slice(0, 4)
        .map((project) => new URL(project.video).hostname),
    ).size >= 3,
  )

  assert.equal(
    showcaseProjects.every(
      (project) => Array.isArray(project.disciplines)
        && project.disciplines.length >= 1
        && typeof project.summary === 'string',
    ),
    true,
  )
})

test('credibility stats preserve the brief numbers', () => {
  assert.deepEqual(
    siteContent.stats.map((stat) => stat.value),
    ['10', '300', '1'],
  )
})

test('shared navigation uses the approved spanish-first information architecture', () => {
  assert.deepEqual(
    siteContent.nav.map((link) => link.label),
    ['Proyectos', 'Estudio', 'Contacto'],
  )
  assert.equal(siteContent.about.eyebrow, 'Estudio')
})

test('colorization content exposes the gallery cases', () => {
  assert.equal(siteContent.colorization.title, 'Colorización')
  assert.equal(Array.isArray(siteContent.colorization.cases), true)
  assert.equal(siteContent.colorization.cases.length >= 1, true)
  assert.equal(
    siteContent.colorization.cases.every(
      (c) => typeof c.title === 'string'
        && typeof c.client === 'string'
        && typeof c.category === 'string'
        && typeof c.year === 'string'
        && Array.isArray(c.tags)
        && c.tags.length >= 1
        && typeof c.media === 'string'
        && typeof c.poster === 'string',
    ),
    true,
  )
})

test('projects page content exposes editorial framing and service filters', () => {
  assert.equal(typeof siteContent.projectsPage.title, 'string')
  assert.equal(Array.isArray(siteContent.projectsPage.filters), true)
  assert.deepEqual(
    siteContent.projectsPage.filters.map((filter) => filter.id),
    ['all', 'production', 'color', 'photo', 'content'],
  )
  assert.equal(
    siteContent.projectsPage.filters.every((filter) => typeof filter.label === 'string'),
    true,
  )
})
