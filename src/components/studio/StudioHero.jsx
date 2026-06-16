import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { siteContent } from '../../data/siteContent'
import usePrefersReducedMotion from '../../hooks/usePrefersReducedMotion'
import ReelModal from './ReelModal'
import StudioReelCursor from './StudioReelCursor'
import './StudioHero.css'

export default function StudioHero() {
  const reduced = usePrefersReducedMotion()
  const rootRef = useRef(null)
  const videoRef = useRef(null)
  const titleInnerRef = useRef(null)
  const taglineRef = useRef(null)
  const [reelOpen, setReelOpen] = useState(false)

  const { brand } = siteContent
  const { reel } = siteContent.studio

  // Ambient background autoplay — skipped under reduced motion (poster shows).
  useEffect(() => {
    const v = videoRef.current
    if (!v || reduced) return
    const p = v.play()
    if (p?.catch) p.catch(() => {})
  }, [reduced])

  // Entrance: brand wordmark mask reveal → tagline clip-path.
  useEffect(() => {
    if (reduced) return undefined
    const ctx = gsap.context(() => {
      gsap
        .timeline({ defaults: { ease: 'expo.out' } })
        .from(titleInnerRef.current, { yPercent: 110, duration: 0.95 })
        .from(
          taglineRef.current,
          { clipPath: 'inset(100% 0 0 0)', duration: 0.85 },
          '-=0.5',
        )
    }, rootRef)
    return () => ctx.revert()
  }, [reduced])

  return (
    <section ref={rootRef} className="studio-hero">
      <div className="studio-hero__bg">
        {reduced ? (
          <img src={reel.poster} alt="" className="studio-hero__bg-media" />
        ) : (
          <video
            ref={videoRef}
            className="studio-hero__bg-media"
            src={reel.ambientSrc}
            poster={reel.poster}
            muted
            loop
            playsInline
            preload="metadata"
            aria-hidden="true"
          />
        )}
        <div className="studio-hero__bg-overlay" />
        <div className="studio-hero__blend" aria-hidden="true" />
      </div>

      {/* Whole hero opens the reel — one accessible control covering it */}
      <button
        type="button"
        className="studio-hero__trigger"
        onClick={() => setReelOpen(true)}
        aria-label={`Reproducir el reel completo de ${brand.name}`}
      />

      <div className="studio-hero__content">
        <span className="studio-hero__title">
          <span ref={titleInnerRef} className="studio-hero__title-inner">
            {brand.name}
          </span>
        </span>
        <p ref={taglineRef} className="studio-hero__tagline">
          {reel.tagline}
        </p>
        {/* Visible affordance only where there is no hovering cursor
            (touch devices) or while the trigger is keyboard-focused. */}
        <span className="studio-hero__cue" aria-hidden="true">
          <span className="studio-hero__cue-dot">
            <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <polygon points="8 5 19 12 8 19" />
            </svg>
          </span>
          Ver reel
        </span>
      </div>

      <StudioReelCursor targetRef={rootRef} media={reel} />

      <ReelModal
        open={reelOpen}
        onClose={() => setReelOpen(false)}
        src={reel.fullSrc}
        poster={reel.poster}
        title={brand.name}
      />
    </section>
  )
}
