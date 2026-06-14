import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { showcaseProjects, siteContent } from '../../data/siteContent'
import usePrefersReducedMotion from '../../hooks/usePrefersReducedMotion'
import './ProjectShowcase.css'

// ---------------------------------------------------------------------------
// Editorial rhythm: full-width case, then a 2-up pair, then full again
// (1 / 2-2 / 1 / 2-2 ...). A trailing single case renders full-width so a
// pair never shows half-empty.
// ---------------------------------------------------------------------------

const groupCases = (projects) => {
  const blocks = []
  let index = 0

  while (index < projects.length) {
    const slot = blocks.length % 3 // 0: full · 1: pair · 2: pair
    const remaining = projects.length - index
    const take = slot === 0 || remaining === 1 ? 1 : 2

    blocks.push({
      type: take === 1 ? 'full' : 'pair',
      items: projects.slice(index, index + take).map((project, offset) => ({
        project,
        number: index + offset + 1,
      })),
    })
    index += take
  }

  return blocks
}

function CaseCard({ project, number, disciplineLabels, eager = false }) {
  return (
    <article className="projects-showcase__case">
      <div className="projects-showcase__case-topline">
        <span className="projects-showcase__case-index">
          {String(number).padStart(2, '0')}
        </span>
        <span>{project.client}</span>
        <span className="projects-showcase__case-dot" aria-hidden="true" />
        <span>{project.year}</span>
      </div>

      <div className="projects-showcase__case-media">
        <Link
          to={`/proyectos/${project.slug}`}
          className="projects-showcase__case-link projects-showcase__case-link--media"
          aria-label={`Ver proyecto ${project.title}`}
        >
          <div className="projects-showcase__case-frame">
            <img
              src={project.poster}
              alt={project.title}
              className="projects-showcase__case-image"
              loading={eager ? 'eager' : 'lazy'}
              fetchPriority={eager ? 'high' : 'auto'}
              decoding="async"
            />
            <div className="projects-showcase__case-body" aria-hidden="true">
              <p className="projects-showcase__case-category">{project.category}</p>
              <h2 className="projects-showcase__case-title">{project.title}</h2>
            </div>
          </div>
        </Link>
      </div>

      <div className="projects-showcase__case-strip">
        <ul className="projects-showcase__case-chips" aria-label="Servicios aplicados">
          {project.disciplines.map((discipline) => (
            <li key={discipline} className="projects-showcase__case-chip">
              {disciplineLabels[discipline] ?? discipline}
            </li>
          ))}
        </ul>
        <Link
          to={`/proyectos/${project.slug}`}
          className="projects-showcase__case-link projects-showcase__case-link--cta"
        >
          Ver caso
          <span className="projects-showcase__case-cta-icon" aria-hidden="true" />
        </Link>
      </div>
    </article>
  )
}

export default function ProjectShowcase() {
  const [activeFilter, setActiveFilter] = useState('all')
  const { projectsPage } = siteContent
  const sectionRef = useRef(null)
  const listRef = useRef(null)
  const reducedMotion = usePrefersReducedMotion()
  const isInitialMount = useRef(true)

  const visibleProjects = showcaseProjects.filter(
    (project) => activeFilter === 'all' || project.disciplines.includes(activeFilter),
  )

  const caseBlocks = groupCases(visibleProjects)
  const projectCount = String(visibleProjects.length).padStart(2, '0')
  const disciplineLabels = Object.fromEntries(
    projectsPage.filters
      .filter((f) => f.id !== 'all')
      .map((f) => [f.id, f.label]),
  )

  // Hero + filters entry
  useEffect(() => {
    if (reducedMotion) return
    const ctx = gsap.context(() => {
      gsap.timeline({ defaults: { ease: 'expo.out' } })
        .from('.projects-showcase__hero', { y: 10, opacity: 0, duration: 0.5 })
        .from('.projects-showcase__filters', { y: 8, opacity: 0, duration: 0.45 }, '-=0.3')
    }, sectionRef)
    return () => ctx.revert()
  }, [reducedMotion])

  // Case reveals — scroll on first mount, immediate stagger on filter change
  useEffect(() => {
    if (reducedMotion) return
    const ctx = gsap.context(() => {
      if (isInitialMount.current) {
        isInitialMount.current = false
        ScrollTrigger.batch('.projects-showcase__case', {
          onEnter: (elements) => {
            gsap.from(elements, {
              opacity: 0,
              scale: 1.025,
              duration: 1,
              ease: 'expo.out',
              stagger: 0.14,
              clearProps: 'scale',
            })
          },
          start: 'top 94%',
          once: true,
        })
      } else {
        gsap.from('.projects-showcase__case', {
          opacity: 0,
          scale: 1.02,
          duration: 0.72,
          ease: 'expo.out',
          stagger: 0.09,
          clearProps: 'scale',
        })
      }
    }, listRef)
    return () => ctx.revert()
  }, [activeFilter, reducedMotion])

  return (
    <section className="projects-showcase" ref={sectionRef}>
      <h1 className="sr-only">{projectsPage.title}</h1>
      <header className="projects-showcase__hero">
        <span className="projects-showcase__eyebrow">{projectsPage.eyebrow}</span>
        <span className="projects-showcase__hero-rule" aria-hidden="true" />
        <span className="projects-showcase__rail" aria-live="polite">
          {projectCount}
        </span>
      </header>

      <nav className="projects-showcase__filters" aria-label="Filtrar proyectos">
        {projectsPage.filters.map((filter) => (
          <button
            key={filter.id}
            type="button"
            className={`projects-showcase__filter${
              filter.id === activeFilter ? ' projects-showcase__filter--active' : ''
            }`}
            onClick={() => setActiveFilter(filter.id)}
            aria-pressed={filter.id === activeFilter}
          >
            <span className="projects-showcase__filter-label">{filter.label}</span>
          </button>
        ))}
      </nav>

      <div className="projects-showcase__list" ref={listRef}>
        {caseBlocks.map((block) => {
          const blockKey = block.items.map(({ project }) => project.slug).join('+')

          return (
            <div
              key={blockKey}
              className={`projects-showcase__block projects-showcase__block--${block.type}`}
            >
              {block.items.map(({ project, number }) => (
                <CaseCard
                  key={project.slug}
                  project={project}
                  number={number}
                  disciplineLabels={disciplineLabels}
                  eager={number === 1}
                />
              ))}
            </div>
          )
        })}
      </div>
    </section>
  )
}
