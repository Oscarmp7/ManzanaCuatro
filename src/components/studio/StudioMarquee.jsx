import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { siteContent } from '../../data/siteContent'
import usePrefersReducedMotion from '../../hooks/usePrefersReducedMotion'
import './StudioMarquee.css'

const COPIES = 6

export default function StudioMarquee() {
  const reduced = usePrefersReducedMotion()
  const rootRef = useRef(null)
  const trackRef = useRef(null)

  const { values, valuesAccent } = siteContent.studio

  // Infinite marquee: constant base speed; scroll velocity accelerates/inverts it.
  useEffect(() => {
    if (reduced) return undefined
    const ctx = gsap.context(() => {
      const track = trackRef.current
      if (!track) return undefined
      const half = track.scrollWidth / 2
      let x = 0
      const tick = (time, deltaMs) => {
        const factor = (deltaMs || 16.667) / 16.667
        const scrollVel = ScrollTrigger.getVelocity() / 280
        x += (-1.8 - scrollVel) * factor
        x = gsap.utils.wrap(-half, 0, x)
        track.style.transform = `translate3d(${x}px, 0, 0)`
      }
      gsap.ticker.add(tick)
      return () => gsap.ticker.remove(tick)
    }, rootRef)
    return () => ctx.revert()
  }, [reduced])

  return (
    <section
      ref={rootRef}
      className="studio-marquee"
      aria-label={values.join('. ')}
    >
      <div ref={trackRef} className="studio-marquee__track" aria-hidden="true">
        {Array.from({ length: COPIES }, (_, c) =>
          values.map((word, i) => (
            <span className="studio-marquee__group" key={`${c}-${i}`}>
              <span
                className={`studio-marquee__word${
                  word === valuesAccent ? ' studio-marquee__word--accent' : ''
                }`}
              >
                {word}.
              </span>
              <span className="studio-marquee__sep" aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M5 12h12" />
                  <path d="M13 6l6 6-6 6" />
                </svg>
              </span>
            </span>
          )),
        )}
      </div>
    </section>
  )
}
