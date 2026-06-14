import { useRef, useEffect } from 'react'
import { useParams, Link } from 'react-router'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { showcaseProjects, siteContent } from '../data/siteContent'
import usePrefersReducedMotion from '../hooks/usePrefersReducedMotion'
import './ProjectDetailPage.css'


export default function ProjectDetailPage() {
  const { slug } = useParams()
  const reducedMotion = usePrefersReducedMotion()

  const containerRef = useRef(null)
  const heroImgRef = useRef(null)
  const titleRef = useRef(null)
  const metaRef = useRef(null)
  const scopeRef = useRef(null)
  const processRef = useRef(null)

  const projectIndex = showcaseProjects.findIndex((p) => p.slug === slug)
  const project = showcaseProjects[projectIndex]

  useEffect(() => {
    if (!project || reducedMotion) return undefined

    const ctx = gsap.context(() => {
      if (heroImgRef.current) {
        gsap.fromTo(
          heroImgRef.current,
          { yPercent: -5 },
          {
            yPercent: 5,
            ease: 'none',
            scrollTrigger: {
              trigger: heroImgRef.current.parentElement,
              start: 'top top',
              end: 'bottom top',
              scrub: true,
            },
          }
        )
      }

      // Title mask reveal — fires after hero image loads (or immediately if already cached)
      if (titleRef.current && heroImgRef.current) {
        const titleInner = titleRef.current.querySelector('.project-detail__title-inner')
        const revealTitle = () => {
          gsap.from(titleInner, { yPercent: 100, duration: 0.8, ease: 'expo.out' })
          if (metaRef.current) {
            gsap.from(metaRef.current, {
              opacity: 0,
              y: 10,
              duration: 0.6,
              ease: 'expo.out',
              delay: 0.3,
            })
          }
        }
        if (heroImgRef.current.complete) {
          revealTitle()
        } else {
          heroImgRef.current.addEventListener('load', revealTitle, { once: true })
        }
      }

      // Scope tags stagger
      if (scopeRef.current) {
        gsap.from(scopeRef.current.querySelectorAll('.project-detail__scope-tag'), {
          opacity: 0,
          y: 15,
          duration: 0.5,
          stagger: 0.1,
          ease: 'expo.out',
          scrollTrigger: {
            trigger: scopeRef.current,
            start: 'top 85%',
          },
        })
      }

      // Process steps stagger
      if (processRef.current) {
        gsap.from(processRef.current.querySelectorAll('.project-detail__process-step'), {
          opacity: 0,
          y: 15,
          duration: 0.5,
          stagger: 0.12,
          ease: 'expo.out',
          scrollTrigger: {
            trigger: processRef.current,
            start: 'top 85%',
          },
        })
      }
    }, containerRef)

    return () => ctx.revert()
  }, [project, reducedMotion])

  // Scroll to top on slug change
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' })
  }, [slug])

  if (!project) {
    return (
      <div className="page project-detail__not-found">
        <h2>Proyecto no encontrado</h2>
        <Link to="/proyectos">← Volver a proyectos</Link>
      </div>
    )
  }

  const total = showcaseProjects.length
  const prevProject = showcaseProjects[(projectIndex - 1 + total) % total]
  const nextProject = showcaseProjects[(projectIndex + 1) % total]

  return (
    <div ref={containerRef} className="page page--project-detail">
      {/* Hero */}
      <section className="project-detail__hero">
        <img
          ref={heroImgRef}
          className="project-detail__hero-img"
          src={project.poster}
          alt={project.title}
          loading="eager"
          fetchPriority="high"
          decoding="async"
        />
        <div className="project-detail__hero-overlay" />
      </section>

      {/* Body */}
      <div className="project-detail__body">
        {/* Header */}
        <h1 className="project-detail__title" ref={titleRef}>
          <span className="project-detail__title-inner">{project.title}</span>
        </h1>

        <div className="project-detail__meta" ref={metaRef}>
          <span>{project.client}</span>
          <span className="project-detail__meta-sep">&middot;</span>
          <span>{project.year}</span>
          <span className="project-detail__meta-sep">&middot;</span>
          <span>{project.category}</span>
        </div>

        {/* Separator */}
        <div className="project-detail__separator" />

        {/* Scope */}
        <div ref={scopeRef}>
          <p className="project-detail__section-label">Alcance</p>
          <div className="project-detail__scope-list">
            {project.scope.map((tag) => (
              <span key={tag} className="project-detail__scope-tag">
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* Process */}
        <div className="project-detail__process" ref={processRef}>
          <p className="project-detail__section-label">Proceso</p>
          <ol className="project-detail__process-list">
            {project.details.map((step, i) => (
              <li key={i} className="project-detail__process-step">
                <span className="project-detail__process-num">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <span>{step}</span>
              </li>
            ))}
          </ol>
        </div>

        {/* Separator */}
        <div className="project-detail__separator" />

        {/* CTA */}
        <div className="project-detail__cta">
          <p className="project-detail__cta-title">Solicita una cotización</p>
          <a
            className="project-detail__cta-btn"
            href={siteContent.brand.whatsappHref}
            target="_blank"
            rel="noopener noreferrer"
          >
            Escríbenos por WhatsApp
          </a>
        </div>

        {/* Project navigation */}
        <nav className="project-detail__nav">
          <Link
            className="project-detail__nav-link project-detail__nav-link--prev"
            to={`/proyectos/${prevProject.slug}`}
          >
            <span aria-hidden="true">←</span> {prevProject.title}
          </Link>
          <Link
            className="project-detail__nav-link project-detail__nav-link--next"
            to={`/proyectos/${nextProject.slug}`}
          >
            {nextProject.title} <span aria-hidden="true">→</span>
          </Link>
        </nav>
      </div>
    </div>
  )
}
