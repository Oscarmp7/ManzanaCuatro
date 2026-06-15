import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { siteContent } from '../../data/siteContent'
import usePrefersReducedMotion from '../../hooks/usePrefersReducedMotion'
import './StudioBehindScenes.css'

const COLS = 3
// How far (in % of its own height) each column starts below before rising into
// place — differential per column gives the masonry a sense of depth.
const RISE = [32, 56, 42]

export default function StudioBehindScenes() {
  const reduced = usePrefersReducedMotion()
  const rootRef = useRef(null)
  const colRefs = useRef([])

  const { behindScenes } = siteContent.studio
  const columns = Array.from({ length: COLS }, () => [])
  behindScenes.forEach((img, i) => columns[i % COLS].push(img))

  useEffect(() => {
    if (reduced) return undefined
    const ctx = gsap.context(() => {
      colRefs.current.forEach((col, i) => {
        if (!col) return
        gsap.fromTo(
          col,
          { yPercent: RISE[i] ?? 40, autoAlpha: 0.3 },
          {
            yPercent: 0,
            autoAlpha: 1,
            ease: 'none',
            scrollTrigger: {
              trigger: rootRef.current,
              start: 'top bottom',
              end: 'center 62%',
              scrub: true,
            },
          },
        )
      })
    }, rootRef)
    return () => ctx.revert()
  }, [reduced])

  return (
    <section ref={rootRef} className="studio-bts">
      <span className="studio-bts__bg-title" aria-hidden="true">
        Detrás de cámara
      </span>

      <div className="studio-bts__inner">
        <div className="studio-bts__grid">
          {columns.map((col, ci) => (
            <div
              className="studio-bts__col"
              key={ci}
              ref={(el) => (colRefs.current[ci] = el)}
            >
              {col.map((img, ii) => (
                <figure className="studio-bts__item" key={`${ci}-${ii}`}>
                  <img src={img.src} alt={img.alt} loading="lazy" decoding="async" />
                </figure>
              ))}
            </div>
          ))}
        </div>

        <p className="studio-bts__subtitle">Construyendo cultura, cuadro a cuadro.</p>
      </div>
    </section>
  )
}
