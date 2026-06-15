import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { siteContent } from '../data/siteContent'
import usePrefersReducedMotion from '../hooks/usePrefersReducedMotion'
import StudioHero from '../components/studio/StudioHero'
import StudioManifesto from '../components/studio/StudioManifesto'
import './StudioPage.css'

export default function StudioPage() {
  const sectionRef = useRef(null)
  const reducedMotion = usePrefersReducedMotion()

  const { about, services, servicesSection } = siteContent

  // Services list stagger (becomes the Block 4 carousel later).
  useEffect(() => {
    if (reducedMotion) return undefined
    const ctx = gsap.context(() => {
      gsap.from('.services__item', {
        opacity: 0,
        y: 20,
        stagger: 0.08,
        duration: 0.6,
        ease: 'expo.out',
        scrollTrigger: {
          trigger: '.services__list',
          start: 'top 85%',
          once: true,
        },
      })
    }, sectionRef)
    return () => ctx.revert()
  }, [reducedMotion])

  return (
    <div
      className={`page page--studio${reducedMotion ? ' page--reduced-motion' : ''}`}
      ref={sectionRef}
    >
      <h1 className="studio__sr-title">{about.eyebrow}</h1>

      <StudioHero />

      <StudioManifesto />

      {/* ── Services (Block 4 will turn this into a carousel) ── */}
      <div className="separator" />
      <section className="services">
        <span className="services__eyebrow">{servicesSection.eyebrow}</span>
        <h2 className="services__title">{servicesSection.title}</h2>
        <ul className="services__list">
          {services.map((s) => (
            <li key={s.id} className="services__item">
              {s.title}
            </li>
          ))}
        </ul>
        <div className="services__cta">
          <a
            href={servicesSection.cta.href}
            className="button button--primary"
            target="_blank"
            rel="noopener noreferrer"
          >
            {servicesSection.cta.label}
          </a>
        </div>
      </section>
    </div>
  )
}
