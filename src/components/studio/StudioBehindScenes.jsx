import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { siteContent } from '../../data/siteContent'
import usePrefersReducedMotion from '../../hooks/usePrefersReducedMotion'
import './StudioBehindScenes.css'

export default function StudioBehindScenes() {
  const reduced = usePrefersReducedMotion()
  const rootRef = useRef(null)
  const tileRefs = useRef([])
  const subtitleRef = useRef(null)

  const { behindScenes } = siteContent.studio

  useEffect(() => {
    if (reduced) return undefined

    const tiles = tileRefs.current.filter(Boolean)
    if (!tiles.length) return undefined

    const ctx = gsap.context(() => {
      // Every tile rises from below + fades in. The stagger runs from the centre
      // of the wall outward so the composition reads as "centralizándose" —
      // assembling toward the middle — rather than a flat one-speed slide.
      gsap.fromTo(
        tiles,
        { yPercent: 22, y: 44, autoAlpha: 0 },
        {
          yPercent: 0,
          y: 0,
          autoAlpha: 1,
          ease: 'power2.out',
          stagger: { each: 0.04, from: 'center' },
          scrollTrigger: {
            trigger: rootRef.current,
            // Begin as the section enters from the bottom and force the whole
            // rise to COMPLETE exactly when the section is centred — then nothing
            // is bound to scroll, so the grid settles centred and holds before
            // the page scrolls on. ("se centralizan antes de seguir bajando")
            start: 'top bottom',
            end: 'center center',
            scrub: 0.6,
            invalidateOnRefresh: true,
          },
        },
      )

      // The serif line resolves in the tail of the same window, settled at centre.
      if (subtitleRef.current) {
        gsap.fromTo(
          subtitleRef.current,
          { autoAlpha: 0, y: 24 },
          {
            autoAlpha: 1,
            y: 0,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: rootRef.current,
              start: 'top 30%',
              end: 'center center',
              scrub: 0.6,
              invalidateOnRefresh: true,
            },
          },
        )
      }
    }, rootRef)

    // Lazy images can change tile heights after the triggers are measured;
    // one refresh after first paint keeps the start/end math honest.
    const refreshId = requestAnimationFrame(() => ScrollTrigger.refresh())

    return () => {
      cancelAnimationFrame(refreshId)
      ctx.revert()
    }
  }, [reduced])

  return (
    <section ref={rootRef} className="studio-bts">
      <span className="studio-bts__bg-title" aria-hidden="true">
        Detrás de cámara
      </span>

      <div className="studio-bts__inner">
        <div className="studio-bts__grid">
          {behindScenes.map((img, i) => (
            <figure
              className={`studio-bts__item studio-bts__item--${img.shape ?? 'square'}`}
              key={`${i}-${img.alt}`}
              ref={(el) => {
                tileRefs.current[i] = el
              }}
            >
              <img src={img.src} alt={img.alt} loading="lazy" decoding="async" />
            </figure>
          ))}
        </div>

        <p className="studio-bts__subtitle" ref={subtitleRef}>
          Construyendo cultura, cuadro a cuadro.
        </p>
      </div>
    </section>
  )
}
