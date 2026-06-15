import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { siteContent } from '../../data/siteContent'
import usePrefersReducedMotion from '../../hooks/usePrefersReducedMotion'
import './StudioClients.css'

export default function StudioClients() {
  const reduced = usePrefersReducedMotion()
  const rootRef = useRef(null)
  const gridRef = useRef(null)

  const { clients } = siteContent

  useEffect(() => {
    if (reduced) return undefined
    const ctx = gsap.context(() => {
      const cells = gridRef.current?.children
      if (!cells || !cells.length) return undefined
      gsap.from(cells, {
        opacity: 0,
        y: 24,
        duration: 0.6,
        ease: 'expo.out',
        stagger: 0.08,
        scrollTrigger: { trigger: rootRef.current, start: 'top 78%', once: true },
      })
      return undefined
    }, rootRef)
    return () => ctx.revert()
  }, [reduced])

  return (
    <section ref={rootRef} className="studio-clients">
      <div className="studio-clients__inner">
        <div className="studio-clients__head">
          <span className="studio-clients__eyebrow">Clientes</span>
          <h2 className="studio-clients__title">
            Marcas que han confiado en el estudio.
          </h2>
        </div>

        <div ref={gridRef} className="studio-clients__grid">
          {clients.map((c) => (
            <div className="studio-clients__cell" key={c.name}>
              {c.logo ? (
                <img
                  className="studio-clients__logo-img"
                  src={c.logo}
                  alt={c.name}
                  loading="lazy"
                  decoding="async"
                />
              ) : (
                <span className="studio-clients__logo">{c.name}</span>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
