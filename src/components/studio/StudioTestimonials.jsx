import { useEffect, useState } from 'react'
import { siteContent } from '../../data/siteContent'
import usePrefersReducedMotion from '../../hooks/usePrefersReducedMotion'
import './StudioTestimonials.css'

const DURATION = 6000

export default function StudioTestimonials() {
  const reduced = usePrefersReducedMotion()
  const { testimonials } = siteContent.studio
  const count = testimonials.length

  const [index, setIndex] = useState(0)
  const [paused, setPaused] = useState(false)

  const go = (i) => setIndex(((i % count) + count) % count)

  // Autoplay (pausable) — setState in an interval callback (async), not on mount.
  useEffect(() => {
    if (reduced || paused || count < 2) return undefined
    const id = setInterval(() => setIndex((p) => (p + 1) % count), DURATION)
    return () => clearInterval(id)
  }, [reduced, paused, count])

  return (
    <section
      className="studio-testi"
      aria-label="Testimonios"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={() => setPaused(false)}
    >
      <div className="studio-testi__inner">
        {/* Segmented progress (keyed by index so the active fill restarts) */}
        <div className="studio-testi__progress" key={index}>
          {testimonials.map((t, i) => (
            <span className="studio-testi__seg" key={t.brand + i}>
              <span
                className={`studio-testi__seg-fill${i < index ? ' is-done' : ''}${
                  i === index ? ' is-active' : ''
                }${paused ? ' is-paused' : ''}${reduced ? ' is-static' : ''}`}
              />
            </span>
          ))}
        </div>

        <div className="studio-testi__stage">
          {testimonials.map((t, i) => (
            <article
              className={`studio-testi__slide${i === index ? ' is-active' : ''}`}
              key={t.brand + i}
              aria-hidden={i !== index}
            >
              <div className="studio-testi__photo">
                <img src={t.photo} alt="" loading="lazy" decoding="async" />
              </div>
              <div className="studio-testi__body">
                <blockquote className="studio-testi__quote">{t.quote}</blockquote>
                <div className="studio-testi__meta">
                  <span className="studio-testi__name">{t.name}</span>
                  <span className="studio-testi__role">
                    {t.role} · {t.brand}
                  </span>
                </div>
              </div>
            </article>
          ))}
        </div>

        <div className="studio-testi__nav">
          <button
            type="button"
            className="studio-testi__arrow"
            onClick={() => go(index - 1)}
            aria-label="Testimonio anterior"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
              <polyline points="15 5 8 12 15 19" />
            </svg>
          </button>
          <button
            type="button"
            className="studio-testi__arrow"
            onClick={() => go(index + 1)}
            aria-label="Testimonio siguiente"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
              <polyline points="9 5 16 12 9 19" />
            </svg>
          </button>
        </div>
      </div>
    </section>
  )
}
