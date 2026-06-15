import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { siteContent } from '../../data/siteContent'
import usePrefersReducedMotion from '../../hooks/usePrefersReducedMotion'
import './StudioBehindScenes.css'

const COLS = 3
const SHIFT = [9, -13, 7] // differential parallax per column

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
        const d = SHIFT[i] ?? 0
        gsap.fromTo(
          col,
          { yPercent: -d * 0.5 },
          {
            yPercent: d * 0.5,
            ease: 'none',
            scrollTrigger: {
              trigger: rootRef.current,
              start: 'top bottom',
              end: 'bottom top',
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
