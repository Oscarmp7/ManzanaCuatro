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

  // Infinite marquee driven by a GSAP tween (robust under React StrictMode —
  // the previous gsap.ticker.add inside gsap.context could end up with its tick
  // removed on the StrictMode mount/cleanup cycle, freezing the strip).
  // Scroll velocity briefly speeds it up, then it eases back to the base speed.
  useEffect(() => {
    if (reduced) return undefined
    const track = trackRef.current
    if (!track) return undefined

    const half = track.scrollWidth / 2
    if (!half) return undefined

    const wrap = gsap.utils.wrap(-half, 0)
    const tween = gsap.to(track, {
      x: `-=${half}`,
      duration: half / 110, // ~110px/s base speed
      ease: 'none',
      repeat: -1,
      modifiers: { x: (value) => `${wrap(parseFloat(value))}px` },
    })

    let settle
    const st = ScrollTrigger.create({
      onUpdate: (self) => {
        const velocity = self.getVelocity()
        if (!velocity) return
        tween.timeScale(gsap.utils.clamp(1, 6, 1 + Math.abs(velocity) / 300))
        settle?.kill()
        settle = gsap.to(tween, { timeScale: 1, duration: 0.8, ease: 'power2.out' })
      },
    })

    return () => {
      settle?.kill()
      st.kill()
      tween.kill()
      gsap.set(track, { clearProps: 'transform' })
    }
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
