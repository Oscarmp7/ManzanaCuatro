import { useEffect, useRef } from 'react'
import { Link } from 'react-router'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { siteContent } from '../data/siteContent'
import usePrefersReducedMotion from '../hooks/usePrefersReducedMotion'
import './StudioPage.css'

export default function StudioPage() {
  const sectionRef = useRef(null)
  const aboutImageRef = useRef(null)
  const statRefs = useRef([])
  const reducedMotion = usePrefersReducedMotion()

  const { about, stats, services, servicesSection } = siteContent
  const manifestoWords = about.title.replace(/\.$/, '').split(' ')

  useEffect(() => {
    if (reducedMotion) {
      return undefined
    }

    const ctx = gsap.context(() => {
      // --- Manifesto word-by-word reveal ---
      gsap.to('.manifesto__word', {
        opacity: 1,
        stagger: 0.1,
        scrollTrigger: {
          trigger: '.manifesto',
          start: 'top 80%',
          end: 'bottom 50%',
          scrub: true,
        },
      })

      // --- About image parallax ---
      if (aboutImageRef.current) {
        gsap.fromTo(
          aboutImageRef.current,
          { yPercent: -10 },
          {
            yPercent: 10,
            ease: 'none',
            scrollTrigger: {
              trigger: aboutImageRef.current.parentElement,
              start: 'top bottom',
              end: 'bottom top',
              scrub: true,
            },
          }
        )
      }

      // --- Stats counter animation ---
      stats.forEach((stat, i) => {
        const el = statRefs.current[i]
        if (!el) return
        gsap.fromTo(
          el,
          { textContent: 0 },
          {
            textContent: stat.value,
            duration: 1.5,
            ease: 'expo.out',
            snap: { textContent: 1 },
            scrollTrigger: { trigger: el, start: 'top 85%', once: true },
          }
        )
      })

      // --- Services stagger fade-in ---
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
  }, [reducedMotion, stats])

  return (
    <div
      className={`page page--studio${reducedMotion ? ' page--reduced-motion' : ''}`}
      ref={sectionRef}
    >
      <h1 className="studio__sr-title">{about.eyebrow}</h1>

      {/* ── Section 1: Manifesto ── */}
      <section className="manifesto">
        <p className="manifesto__text">
          {manifestoWords.map((word, i) => (
            <span key={i} className="manifesto__word">
              {word}
            </span>
          ))}
        </p>
      </section>

      {/* ── Section 2: About ── */}
      <div className="separator" />
      <section className="studio-about">
        <div className="studio-about__grid">
          <div className="studio-about__content">
            <span className="studio-about__eyebrow">{about.eyebrow}</span>
            <p className="studio-about__text">{about.text}</p>
            <ul className="studio-about__highlights">
              {about.highlights.map((h, i) => (
                <li key={i} className="studio-about__highlight">
                  <span className="studio-about__dot" />
                  {h}
                </li>
              ))}
            </ul>
          </div>
          <div className="studio-about__image-wrap">
            <img
              ref={aboutImageRef}
              src={about.image}
              alt="Manzana Cuatro studio"
              className="studio-about__image"
              loading="lazy"
              decoding="async"
            />
          </div>
        </div>
      </section>

      {/* ── Section 3: Stats ── */}
      <div className="separator" />
      <section className="stats">
        <div className="stats__grid">
          {stats.map((stat, i) => (
            <div key={stat.label} className="stats__item">
              <div className="stats__number-row">
                <span
                  className="stats__value"
                  ref={(el) => (statRefs.current[i] = el)}
                >
                  0
                </span>
                <span className="stats__suffix">{stat.suffix}</span>
              </div>
              <span className="stats__label">{stat.label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ── Section 4: Services ── */}
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
          <Link to="/contacto" className="button button--primary">
            {servicesSection.cta.label}
          </Link>
        </div>
      </section>
    </div>
  )
}
