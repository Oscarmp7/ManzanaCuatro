import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { showcaseProjects, siteContent } from '../../data/siteContent'
import usePrefersReducedMotion from '../../hooks/usePrefersReducedMotion'
import './ProjectShowcase.css'

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

  const projectCount = String(visibleProjects.length).padStart(2, '0')
  const disciplineLabels = Object.fromEntries(
    projectsPage.filters
      .filter((f) => f.id !== 'all')
      .map((f) => [f.id, f.label]),
  )

  // Hero entry animation — runs once on mount
  useEffect(() => {
    if (reducedMotion) return
    const ctx = gsap.context(() => {
      gsap.timeline({ defaults: { ease: 'expo.out' } })
        .from('.projects-showcase__hero-meta', { y: 14, opacity: 0, duration: 0.6 })
        .from('.projects-showcase__title', { yPercent: 105, duration: 0.88 }, '-=0.42')
        .from('.projects-showcase__intro', { y: 18, opacity: 0, duration: 0.72 }, '-=0.58')
        .from('.projects-showcase__filters', { y: 12, opacity: 0, duration: 0.52 }, '-=0.46')
    }, sectionRef)
    return () => ctx.revert()
  }, [reducedMotion])

  // Case reveal — scroll on first mount, stagger on filter change
  useEffect(() => {
    if (reducedMotion) return
    const ctx = gsap.context(() => {
      if (isInitialMount.current) {
        isInitialMount.current = false
        gsap.from('.projects-showcase__case', {
          y: 48,
          opacity: 0,
          duration: 0.82,
          ease: 'expo.out',
          stagger: 0.1,
          scrollTrigger: {
            trigger: listRef.current,
            start: 'top 82%',
          },
        })
      } else {
        gsap.from('.projects-showcase__case', {
          y: 24,
          opacity: 0,
          duration: 0.62,
          ease: 'expo.out',
          stagger: 0.08,
        })
      }
    }, listRef)
    return () => ctx.revert()
  }, [activeFilter, reducedMotion])

  return (
    <section className="projects-showcase" ref={sectionRef}>
      <header className="projects-showcase__hero">
        <div className="projects-showcase__hero-meta">
          <span className="projects-showcase__eyebrow">{projectsPage.eyebrow}</span>
          <span className="projects-showcase__rail">{projectCount}</span>
        </div>
        <div className="projects-showcase__title-wrap">
          <h1 className="projects-showcase__title">{projectsPage.title}</h1>
        </div>
        <p className="projects-showcase__intro">{projectsPage.intro}</p>
      </header>

      <nav
        className="projects-showcase__filters"
        role="toolbar"
        aria-label="Filtrar proyectos"
      >
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
        {visibleProjects.map((project, index) => (
          <article key={project.slug} className="projects-showcase__case">
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
                    loading={index === 0 ? 'eager' : 'lazy'}
                    fetchPriority={index === 0 ? 'high' : 'auto'}
                    decoding="async"
                  />
                  <div className="projects-showcase__case-overlay" aria-hidden="true">
                    <span className="projects-showcase__case-overlay-label">Ver caso</span>
                  </div>
                </div>
              </Link>
            </div>

            <div className="projects-showcase__case-body">
              <div className="projects-showcase__case-topline">
                <span className="projects-showcase__case-index">
                  {String(index + 1).padStart(2, '0')}
                </span>
                <span>{project.client}</span>
                <span className="projects-showcase__case-dot" aria-hidden="true" />
                <span>{project.year}</span>
              </div>

              <p className="projects-showcase__case-category">{project.category}</p>

              <h2 className="projects-showcase__case-title">
                <Link
                  to={`/proyectos/${project.slug}`}
                  className="projects-showcase__case-link"
                >
                  {project.title}
                </Link>
              </h2>

              <p className="projects-showcase__case-objective">{project.objective}</p>

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
                <span>Ver caso completo</span>
                <span className="projects-showcase__case-cta-icon" aria-hidden="true" />
              </Link>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}
