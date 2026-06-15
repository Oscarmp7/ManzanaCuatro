import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { siteContent } from '../../data/siteContent'
import usePrefersReducedMotion from '../../hooks/usePrefersReducedMotion'
import './StudioServices.css'

export default function StudioServices() {
  const reduced = usePrefersReducedMotion()
  const rootRef = useRef(null)
  const scrollerRef = useRef(null)

  const { services, servicesSection } = siteContent

  // Cards stagger in on enter (children of the scroller — ref-scoped).
  useEffect(() => {
    if (reduced) return undefined
    const ctx = gsap.context(() => {
      const cards = scrollerRef.current?.children
      if (!cards || !cards.length) return undefined
      gsap.from(cards, {
        opacity: 0,
        y: 30,
        duration: 0.7,
        ease: 'expo.out',
        stagger: 0.09,
        scrollTrigger: { trigger: rootRef.current, start: 'top 78%', once: true },
      })
      return undefined
    }, rootRef)
    return () => ctx.revert()
  }, [reduced])

  const scrollByCard = (dir) => {
    const scroller = scrollerRef.current
    if (!scroller) return
    const card = scroller.querySelector('.studio-services__card')
    const amount = card ? card.offsetWidth + 24 : scroller.clientWidth * 0.8
    scroller.scrollBy({ left: dir * amount, behavior: 'smooth' })
  }

  // Pointer drag-to-scroll (snap re-applies on release via CSS scroll-snap).
  const onPointerDown = (e) => {
    const scroller = scrollerRef.current
    if (!scroller || e.pointerType === 'touch') return // native touch scroll handles it
    const startX = e.clientX
    const startLeft = scroller.scrollLeft
    let moved = false
    scroller.setPointerCapture?.(e.pointerId)
    scroller.classList.add('studio-services__scroller--dragging')
    const move = (ev) => {
      const dx = ev.clientX - startX
      if (Math.abs(dx) > 3) moved = true
      scroller.scrollLeft = startLeft - dx
    }
    const up = () => {
      scroller.classList.remove('studio-services__scroller--dragging')
      scroller.removeEventListener('pointermove', move)
      scroller.removeEventListener('pointerup', up)
      // Prevent the drag-end from triggering a click navigation
      if (moved) {
        const block = (ev) => {
          ev.preventDefault()
          ev.stopPropagation()
        }
        scroller.addEventListener('click', block, { capture: true, once: true })
      }
    }
    scroller.addEventListener('pointermove', move)
    scroller.addEventListener('pointerup', up)
  }

  return (
    <section ref={rootRef} className="studio-services">
      <div className="studio-services__head">
        <div>
          <span className="studio-services__eyebrow">{servicesSection.eyebrow}</span>
          <h2 className="studio-services__title">{servicesSection.title}</h2>
        </div>
        <div className="studio-services__nav">
          <button
            type="button"
            className="studio-services__arrow"
            onClick={() => scrollByCard(-1)}
            aria-label="Servicio anterior"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
              <polyline points="15 5 8 12 15 19" />
            </svg>
          </button>
          <button
            type="button"
            className="studio-services__arrow"
            onClick={() => scrollByCard(1)}
            aria-label="Servicio siguiente"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
              <polyline points="9 5 16 12 9 19" />
            </svg>
          </button>
        </div>
      </div>

      <div
        ref={scrollerRef}
        className="studio-services__scroller"
        onPointerDown={onPointerDown}
      >
        {services.map((s) => (
          <article className="studio-services__card" key={s.id}>
            <div className="studio-services__card-media">
              <img src={s.image} alt="" loading="lazy" decoding="async" />
            </div>
            <h3 className="studio-services__card-title">{s.title}</h3>
            <p className="studio-services__card-desc">{s.description}</p>
            <ul className="studio-services__caps">
              {s.capabilities.map((c) => (
                <li key={c} className="studio-services__cap">
                  <span className="studio-services__check" aria-hidden="true">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                      <polyline points="5 12 10 17 19 7" />
                    </svg>
                  </span>
                  {c}
                </li>
              ))}
            </ul>
          </article>
        ))}
      </div>

      <div className="studio-services__cta">
        <a
          href={servicesSection.cta.href}
          className="studio-services__cta-btn"
          target="_blank"
          rel="noopener noreferrer"
        >
          {servicesSection.cta.label}
        </a>
      </div>
    </section>
  )
}
