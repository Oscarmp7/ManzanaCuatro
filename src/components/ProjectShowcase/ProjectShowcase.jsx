import { useState, useEffect, useLayoutEffect, useRef } from 'react'
import { Link, useSearchParams } from 'react-router'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Flip } from 'gsap/Flip'
import { showcaseProjects, siteContent } from '../../data/siteContent'
import usePrefersReducedMotion from '../../hooks/usePrefersReducedMotion'
import useDebouncedValue from '../../hooks/useDebouncedValue'
import { setSharedThumb } from '../../transitions/sharedThumbStore'
import {
  VIEWS,
  VIEW_OPTIONS,
  DEFAULT_VIEW,
  getInitialView,
  storeView,
  readUrlParam,
} from './projectsView'
import './ProjectShowcase.css'

// ---------------------------------------------------------------------------
// View-switcher glyphs — decorative; each button carries its own aria-label.
// ---------------------------------------------------------------------------

const VIEW_ICONS = {
  [VIEWS.LARGE]: (
    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.4" aria-hidden="true">
      <rect x="1.5" y="2.5" width="13" height="11" rx="1" />
    </svg>
  ),
  [VIEWS.LIST]: (
    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.4" aria-hidden="true">
      <line x1="2" y1="4" x2="14" y2="4" />
      <line x1="2" y1="8" x2="14" y2="8" />
      <line x1="2" y1="12" x2="14" y2="12" />
    </svg>
  ),
  [VIEWS.GRID]: (
    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.4" aria-hidden="true">
      <rect x="1.5" y="1.5" width="5.5" height="5.5" rx="0.5" />
      <rect x="9" y="1.5" width="5.5" height="5.5" rx="0.5" />
      <rect x="1.5" y="9" width="5.5" height="5.5" rx="0.5" />
      <rect x="9" y="9" width="5.5" height="5.5" rx="0.5" />
    </svg>
  ),
}

// ---------------------------------------------------------------------------
// Cinematic full-bleed card — used by the large and grid views.
// ---------------------------------------------------------------------------

function CaseCard({
  project,
  number,
  disciplineLabels,
  eager = false,
  reducedMotion = false,
}) {
  const [hover, setHover] = useState(false)
  const videoRef = useRef(null)
  const showVideo = hover && !reducedMotion && Boolean(project.video)

  // Lazy play/pause the thumbnail video only while hovered/focused.
  useEffect(() => {
    const v = videoRef.current
    if (!v) return
    if (showVideo) {
      const played = v.play()
      if (played?.catch) played.catch(() => {})
    } else {
      v.pause()
    }
  }, [showVideo])

  return (
    <article
      className={`projects-showcase__case${
        showVideo ? ' projects-showcase__case--playing' : ''
      }`}
      data-flip-id={project.slug}
    >
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
          state={{ sharedThumb: true }}
          className="projects-showcase__case-link projects-showcase__case-link--media"
          aria-label={`Ver proyecto ${project.title}`}
          onMouseEnter={() => setHover(true)}
          onMouseLeave={() => setHover(false)}
          onFocus={() => setHover(true)}
          onBlur={() => setHover(false)}
          onClick={(e) => {
            const img = e.currentTarget.querySelector('.projects-showcase__case-image')
            if (img) {
              setSharedThumb({ slug: project.slug, rect: img.getBoundingClientRect() })
            }
          }}
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
            {showVideo && (
              <video
                ref={videoRef}
                className="projects-showcase__case-video"
                src={project.video}
                poster={project.poster}
                muted
                loop
                playsInline
                preload="none"
                aria-hidden="true"
              />
            )}
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

// ---------------------------------------------------------------------------
// Compact row — used by the list view.
// ---------------------------------------------------------------------------

function CaseRow({ project, number, disciplineLabels, onHover }) {
  return (
    <article
      className="projects-showcase__row"
      data-flip-id={project.slug}
      onMouseEnter={() => onHover?.(project)}
      onFocus={() => onHover?.(project)}
    >
      <Link
        to={`/proyectos/${project.slug}`}
        className="projects-showcase__row-link"
        aria-label={`Ver proyecto ${project.title}`}
      >
        <span className="projects-showcase__row-index">#{number}</span>
        <span className="projects-showcase__row-title">{project.title}</span>
        <span className="projects-showcase__row-meta">
          <span className="projects-showcase__row-client">
            {project.client} · {project.year}
          </span>
          <span className="projects-showcase__row-category">{project.category}</span>
        </span>
        <ul className="projects-showcase__row-tags" aria-label="Servicios aplicados">
          {project.disciplines.map((discipline) => (
            <li key={discipline} className="projects-showcase__row-tag">
              {disciplineLabels[discipline] ?? discipline}
            </li>
          ))}
        </ul>
      </Link>
    </article>
  )
}

export default function ProjectShowcase() {
  const [activeFilter, setActiveFilter] = useState(() => {
    const cat = readUrlParam('cat')
    return cat && siteContent.projectsPage.filters.some((f) => f.id === cat)
      ? cat
      : 'all'
  })
  const [view, setView] = useState(() => getInitialView())
  const [query, setQuery] = useState(() => readUrlParam('q') ?? '')
  const debouncedQuery = useDebouncedValue(query, 150)
  // List-view hover background video (kept mounted during fade-out → bgProject
  // persists; bgVisible drives the fade and play/pause).
  const [bgProject, setBgProject] = useState(null)
  const [bgVisible, setBgVisible] = useState(false)
  const [, setSearchParams] = useSearchParams()
  const { projectsPage } = siteContent
  const sectionRef = useRef(null)
  const listRef = useRef(null)
  const flipStateRef = useRef(null)
  const bgRef = useRef(null)
  const bgVideoRef = useRef(null)
  const searchInputRef = useRef(null)
  const reducedMotion = usePrefersReducedMotion()
  const isInitialMount = useRef(true)
  const urlSyncSkipRef = useRef(true)

  const disciplineLabels = Object.fromEntries(
    projectsPage.filters
      .filter((f) => f.id !== 'all')
      .map((f) => [f.id, f.label]),
  )

  // Live search (debounced) crossed with the active category filter.
  const normalizedQuery = debouncedQuery.trim().toLowerCase()
  const matchesQuery = (project) => {
    if (!normalizedQuery) return true
    const haystack = [
      project.title,
      project.client,
      project.category,
      ...project.disciplines.map((d) => disciplineLabels[d] ?? d),
    ]
      .join(' ')
      .toLowerCase()
    return haystack.includes(normalizedQuery)
  }

  const visibleProjects = showcaseProjects.filter(
    (project) =>
      (activeFilter === 'all' || project.disciplines.includes(activeFilter)) &&
      matchesQuery(project),
  )

  const shownCount = String(visibleProjects.length).padStart(2, '0')
  const totalCount = String(showcaseProjects.length).padStart(2, '0')

  // Stable signature of the current result set — drives the entrance stagger so
  // it only replays when results actually change, not on every keystroke.
  const resultKey = visibleProjects.map((p) => p.slug).join('|')

  // Hover background is only truly active in list view with results — derived so
  // it auto-clears on view/filter/search change without a state-setting effect.
  const bgActive = bgVisible && view === VIEWS.LIST && Boolean(resultKey)

  // Switch layout with a GSAP Flip transition: capture the current geometry
  // before React re-renders into the new view, then tween from it.
  const handleViewChange = (next) => {
    if (next === view) return
    if (!reducedMotion && listRef.current) {
      flipStateRef.current = Flip.getState(
        listRef.current.querySelectorAll(
          '.projects-showcase__case, .projects-showcase__row',
        ),
        { props: 'opacity' },
      )
    }
    storeView(next)
    setView(next)
  }

  // Hero + filters entry
  useEffect(() => {
    if (reducedMotion) return
    const ctx = gsap.context(() => {
      gsap
        .timeline({ defaults: { ease: 'expo.out' } })
        .from('.projects-showcase__hero', { y: 10, opacity: 0, duration: 0.5 })
        .from('.projects-showcase__filters', { y: 8, opacity: 0, duration: 0.45 }, '-=0.3')
    }, sectionRef)
    return () => ctx.revert()
  }, [reducedMotion])

  // Case reveals — scroll on first mount, immediate stagger on filter change
  useEffect(() => {
    if (reducedMotion) return
    const ctx = gsap.context(() => {
      const items = listRef.current?.querySelectorAll(
        '.projects-showcase__case, .projects-showcase__row',
      )
      if (!items || !items.length) return
      if (isInitialMount.current) {
        isInitialMount.current = false
        ScrollTrigger.batch(items, {
          onEnter: (elements) => {
            gsap.from(elements, {
              opacity: 0,
              scale: 1.025,
              duration: 1,
              ease: 'expo.out',
              stagger: 0.14,
              clearProps: 'scale',
            })
            // Mask/clip-path reveal of titles as each card enters the viewport
            const titles = elements.flatMap((el) => [
              ...el.querySelectorAll(
                '.projects-showcase__case-title, .projects-showcase__row-title',
              ),
            ])
            if (titles.length) {
              gsap.from(titles, {
                clipPath: 'inset(0 0 100% 0)',
                duration: 0.9,
                ease: 'expo.out',
                stagger: 0.14,
                delay: 0.08,
              })
            }
          },
          start: 'top 94%',
          once: true,
        })
      } else {
        gsap.from(items, {
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
  }, [resultKey, reducedMotion])

  // Flip between layout views (large ↔ list ↔ grid)
  useLayoutEffect(() => {
    const state = flipStateRef.current
    flipStateRef.current = null
    if (!state || reducedMotion) return
    const ctx = gsap.context(() => {
      Flip.from(state, {
        duration: 0.5,
        ease: 'expo.out',
        absolute: true,
        stagger: 0.03,
        onEnter: (els) => gsap.fromTo(els, { opacity: 0 }, { opacity: 1, duration: 0.3 }),
        onLeave: (els) => gsap.to(els, { opacity: 0, duration: 0.3 }),
      })
    }, listRef)
    return () => ctx.revert()
  }, [view, reducedMotion])

  // Reflect view / category / search into the URL (replace — no history spam).
  // Initial values are hydrated from the URL via the useState initializers
  // above, so this effect only writes on real changes (first run is skipped).
  useEffect(() => {
    if (urlSyncSkipRef.current) {
      urlSyncSkipRef.current = false
      return
    }
    const params = new URLSearchParams()
    if (view !== DEFAULT_VIEW) params.set('view', view)
    if (activeFilter !== 'all') params.set('cat', activeFilter)
    if (query.trim()) params.set('q', query.trim())
    setSearchParams(params, { replace: true })
  }, [view, activeFilter, query, setSearchParams])

  // List-view hover background — show the hovered project's video full-bleed.
  const handleRowHover = (project) => {
    setBgProject(project)
    setBgVisible(true)
  }
  const handleBgLeave = () => setBgVisible(false)

  // Fade the background in on hover (and re-fade when switching rows), out on
  // leave. Reduced motion snaps instead of tweening.
  useEffect(() => {
    const el = bgRef.current
    if (!el) return
    if (!bgActive) {
      if (reducedMotion) gsap.set(el, { autoAlpha: 0 })
      else gsap.to(el, { autoAlpha: 0, duration: 0.4, ease: 'power2.out' })
      return
    }
    if (reducedMotion) gsap.set(el, { autoAlpha: 1 })
    else gsap.fromTo(el, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.4, ease: 'power2.out' })
  }, [bgProject, bgActive, reducedMotion])

  // Play only while the background is active; pause otherwise (and reduced motion).
  useEffect(() => {
    const v = bgVideoRef.current
    if (!v) return
    if (bgActive && !reducedMotion) {
      const played = v.play()
      if (played?.catch) played.catch(() => {})
    } else {
      v.pause()
    }
  }, [bgProject, bgActive, reducedMotion])

  return (
    <section className="projects-showcase" ref={sectionRef}>
      <h1 className="sr-only">{projectsPage.title}</h1>
      <header className="projects-showcase__hero">
        <span className="projects-showcase__eyebrow">{projectsPage.eyebrow}</span>
        <span className="projects-showcase__hero-rule" aria-hidden="true" />
        <span className="projects-showcase__rail">
          <span aria-hidden="true">
            {shownCount} / {totalCount}
          </span>
          <span className="sr-only" aria-live="polite">
            {visibleProjects.length === 0
              ? 'Sin resultados'
              : `${visibleProjects.length} de ${showcaseProjects.length} proyectos`}
          </span>
        </span>

        <div className="projects-showcase__tools">
          <div className="projects-showcase__search">
            <svg
              className="projects-showcase__search-icon"
              viewBox="0 0 16 16"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.4"
              aria-hidden="true"
            >
              <circle cx="7" cy="7" r="4.5" />
              <line x1="10.5" y1="10.5" x2="14" y2="14" />
            </svg>
            <input
              ref={searchInputRef}
              type="search"
              className="projects-showcase__search-input"
              placeholder="Buscar"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              aria-label="Buscar proyectos por título, cliente o servicio"
            />
            {query && (
              <button
                type="button"
                className="projects-showcase__search-clear"
                onClick={() => {
                  setQuery('')
                  searchInputRef.current?.focus()
                }}
                aria-label="Limpiar búsqueda"
              >
                <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
                  <line x1="4" y1="4" x2="12" y2="12" />
                  <line x1="12" y1="4" x2="4" y2="12" />
                </svg>
              </button>
            )}
          </div>

          <div
            className="projects-showcase__view-switch"
            role="group"
            aria-label="Tipo de vista"
          >
            <span className="projects-showcase__view-label" aria-hidden="true">
              VIEW
            </span>
            {VIEW_OPTIONS.map((opt) => (
              <button
                key={opt.id}
                type="button"
                className={`projects-showcase__view-btn${
                  view === opt.id ? ' projects-showcase__view-btn--active' : ''
                }`}
                onClick={() => handleViewChange(opt.id)}
                aria-label={opt.aria}
                aria-pressed={view === opt.id}
              >
                {VIEW_ICONS[opt.id]}
              </button>
            ))}
          </div>
        </div>
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

      <div
        className={`projects-showcase__list projects-showcase__list--${view}`}
        ref={listRef}
        data-view={view}
        data-bg-active={bgActive ? 'true' : undefined}
        onMouseLeave={view === VIEWS.LIST ? handleBgLeave : undefined}
        onBlur={
          view === VIEWS.LIST
            ? (e) => {
                if (!e.currentTarget.contains(e.relatedTarget)) handleBgLeave()
              }
            : undefined
        }
      >
        {view === VIEWS.LIST && bgProject && (
          <div className="projects-showcase__bg" ref={bgRef} aria-hidden="true">
            {!reducedMotion && bgProject.video ? (
              <video
                key={bgProject.slug}
                ref={bgVideoRef}
                className="projects-showcase__bg-media"
                src={bgProject.video}
                poster={bgProject.poster}
                muted
                loop
                playsInline
                preload="none"
              />
            ) : (
              <img
                key={bgProject.slug}
                className="projects-showcase__bg-media"
                src={bgProject.poster}
                alt=""
              />
            )}
            <div className="projects-showcase__bg-overlay" />
          </div>
        )}
        {visibleProjects.length === 0 ? (
          <div className="projects-showcase__empty" role="status">
            <p className="projects-showcase__empty-title">Sin resultados</p>
            <p className="projects-showcase__empty-text">
              No encontramos proyectos que coincidan con tu búsqueda o filtro.
            </p>
            <button
              type="button"
              className="projects-showcase__empty-reset"
              onClick={() => {
                setQuery('')
                setActiveFilter('all')
                searchInputRef.current?.focus()
              }}
            >
              Limpiar filtros
            </button>
          </div>
        ) : (
          visibleProjects.map((project, index) =>
            view === VIEWS.LIST ? (
              <CaseRow
                key={project.slug}
                project={project}
                number={index + 1}
                disciplineLabels={disciplineLabels}
                onHover={handleRowHover}
              />
            ) : (
              <CaseCard
                key={project.slug}
                project={project}
                number={index + 1}
                disciplineLabels={disciplineLabels}
                eager={index === 0}
                reducedMotion={reducedMotion}
              />
            ),
          )
        )}
      </div>
    </section>
  )
}
