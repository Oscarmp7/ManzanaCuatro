import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router'
import gsap from 'gsap'
import { showcaseProjects, siteContent } from '../../data/siteContent'
import usePrefersReducedMotion from '../../hooks/usePrefersReducedMotion'
import useHomeReelScroll, { TOTAL_TRANSITION_COUNT, REEL_SETTLE_HOLD } from '../../hooks/useHomeReelScroll'
import './HomeReel.css'

// ---------------------------------------------------------------------------
// Module-level data
// ---------------------------------------------------------------------------

const reelProjects = showcaseProjects.slice(0, 4)
const colorizationCases = siteContent.colorization.cases
const REEL_TRANSITION_COUNT = reelProjects.length - 1
const COLOR_STAGE_TRANSITION_COUNT = TOTAL_TRANSITION_COUNT - REEL_TRANSITION_COUNT - REEL_SETTLE_HOLD

const titleFrames = [
  {
    title: 'MANZANA CUATRO',
    meta: siteContent.hero.eyebrow,
    href: siteContent.hero.primaryCta.href,
    action: siteContent.hero.primaryCta.label,
  },
  ...reelProjects.slice(1).map((project) => ({
    title: project.title,
    meta: `${project.year} · ${project.category}`,
    href: `/proyectos/${project.slug}`,
    action: 'Ver caso',
  })),
]

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

function ReelMedia({ project, index, reducedMotion, shouldPlayVideo = true }) {
  if (shouldPlayVideo && !reducedMotion && project.video) {
    return (
      <video
        src={project.video}
        poster={project.poster}
        autoPlay
        muted
        loop
        playsInline
        preload={index === 0 ? 'auto' : 'metadata'}
        aria-hidden="true"
      />
    )
  }

  return (
    <img
      src={project.poster}
      alt={project.title}
      loading={index === 0 ? 'eager' : 'lazy'}
      fetchPriority={index === 0 ? 'high' : 'auto'}
      decoding="async"
    />
  )
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function HomeReel({ ready = true, firstLoad = false }) {
  const sectionRef = useRef(null)
  const frameRefs = useRef([])
  const titleRefs = useRef([])
  const colorStageRef = useRef(null)
  const galleryItemRefs = useRef([])
  const measurementRef = useRef({
    titleFrameHeight: 0,
    titleWindowHeight: 0,
    viewportHeight: typeof window === 'undefined' ? 0 : window.innerHeight,
  })
  const toneRef = useRef('')
  const activeReelIndexRef = useRef(0)
  const colorStageActiveRef = useRef(false)
  const [activeReelIndex, setActiveReelIndex] = useState(0)
  const [colorStageActive, setColorStageActive] = useState(false)
  const scrollHintRef = useRef(null)
  const brandRevealedRef = useRef(false)
  const reducedMotion = usePrefersReducedMotion()
  const safeActiveReelIndex = ready && !reducedMotion ? activeReelIndex : 0
  const safeColorStageActive = ready && !reducedMotion ? colorStageActive : false
  const shouldRenderReelMotionMedia = (index) =>
    !safeColorStageActive && Math.abs(index - safeActiveReelIndex) <= 1

  useEffect(() => {
    const hint = scrollHintRef.current
    if (!hint) return

    if (!ready || reducedMotion) {
      gsap.set(hint, { autoAlpha: 0 })
      return
    }

    gsap.fromTo(hint, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.8, delay: 0.6, ease: 'expo.out' })

    const handleScroll = () => {
      if (window.scrollY > 0) {
        gsap.to(hint, { autoAlpha: 0, duration: 0.35, ease: 'power2.in' })
        window.removeEventListener('scroll', handleScroll)
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [ready, reducedMotion])

  // First-load handoff: as the loader settles its wordmark and opens the scene,
  // the brand card's subtitle + CTA reveal beneath the (continuous) wordmark.
  // Animates the children's own opacity/transform only — never the title-card
  // CSS vars the pinned ScrollTrigger drives, so the pin stays untouched.
  useEffect(() => {
    if (!ready || !firstLoad || reducedMotion || brandRevealedRef.current) return undefined
    const brandCard = titleRefs.current[0]
    if (!brandCard) return undefined
    const targets = [
      brandCard.querySelector('.home-reel__meta'),
      brandCard.querySelector('.home-reel__view'),
    ].filter(Boolean)
    if (!targets.length) return undefined

    brandRevealedRef.current = true
    const ctx = gsap.context(() => {
      gsap.from(targets, {
        autoAlpha: 0,
        y: 14,
        duration: 0.7,
        stagger: 0.12,
        ease: 'expo.out',
        delay: 0.5,
      })
    })
    return () => ctx.revert()
  }, [ready, firstLoad, reducedMotion])

  useHomeReelScroll({
    ready,
    reducedMotion,
    refs: {
      sectionRef,
      frameRefs,
      titleRefs,
      colorStageRef,
      galleryItemRefs,
      measurementRef,
      toneRef,
      activeReelIndexRef,
      colorStageActiveRef,
    },
    setters: {
      setActiveReelIndex,
      setColorStageActive,
    },
    titleFrames,
    reelProjects,
  })

  return (
    <section
      className="home-reel"
      ref={sectionRef}
      style={{
        '--reel-frames': reducedMotion ? 1 : reelProjects.length + REEL_SETTLE_HOLD + COLOR_STAGE_TRANSITION_COUNT,
      }}
    >
      <div className="home-reel__sticky">
        <div className="home-reel__viewport">
          {reelProjects.map((project, index) => (
            <article
              key={project.slug}
              className={`home-reel__frame${index === 0 ? ' home-reel__frame--opening' : ''}`}
              ref={(element) => {
                frameRefs.current[index] = element
              }}
            >
              <div className="home-reel__media">
                <ReelMedia
                  project={project}
                  index={index}
                  reducedMotion={reducedMotion}
                  shouldPlayVideo={shouldRenderReelMotionMedia(index)}
                />
              </div>
              <div className="home-reel__overlay" />
              {index === 1 && (
                <div className="home-reel__frame-title" aria-hidden="true">
                  <p className="home-reel__meta">{`${project.year} · ${project.category}`}</p>
                  <h2 className="home-reel__title">{project.title}</h2>
                  <Link
                    to={`/proyectos/${project.slug}`}
                    className="home-reel__view"
                    tabIndex={-1}
                  >
                    Ver caso
                  </Link>
                </div>
              )}
            </article>
          ))}

          <div className="home-reel__color-stage" ref={colorStageRef} aria-hidden="true">
            <div className="home-reel__color-wash" />

            <div className="home-reel__color-title">
              <div className="home-reel__color-title-shell">
                <span className="home-reel__color-title-copy">
                  {siteContent.colorization.title}
                </span>
                <span className="home-reel__color-title-copy home-reel__color-title-copy--fill" aria-hidden="true">
                  {siteContent.colorization.title}
                </span>
              </div>
            </div>

            <div className="home-reel__gallery-stage" aria-hidden="true">
              {colorizationCases.map((c, i) => (
                <div
                  key={c.title}
                  className="home-reel__gallery-item"
                  ref={(el) => { galleryItemRefs.current[i] = el }}
                  style={{
                    zIndex: 10 + i,
                    '--gallery-x': `${i % 2 === 0 ? 100 : -100}%`,
                  }}
                >
                  {c.isVideo && safeColorStageActive ? (
                    // Mounted only once the color stage is near: autoPlay videos
                    // download regardless of preload, so gating saves 3 streams
                    // on the initial page load.
                    <video
                      className="home-reel__gallery-media"
                      src={c.media}
                      poster={c.poster}
                      autoPlay
                      muted
                      loop
                      playsInline
                      preload="none"
                    />
                  ) : (
                    <img
                      className="home-reel__gallery-media"
                      src={c.isVideo ? c.poster : c.media}
                      alt=""
                      loading="lazy"
                      decoding="async"
                    />
                  )}
                  <div className="home-reel__gallery-meta">
                    <span className="home-reel__gallery-kicker">
                      {c.category}
                      {' — '}
                      {c.year}
                    </span>
                    <p className="home-reel__gallery-title">{c.title}</p>
                    <p className="home-reel__gallery-client">{c.client}</p>
                    <ul className="home-reel__gallery-tags" aria-label="Tags del caso">
                      {c.tags.map((tag) => (
                        <li key={tag} className="home-reel__gallery-tag">{tag}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="home-reel__title-window">
            {titleFrames.map((item, index) => (
              <div
                className={`home-reel__title-card${index === 0 ? ' home-reel__title-card--brand' : ''}`}
                key={item.title}
                ref={(element) => {
                  titleRefs.current[index] = element
                }}
              >
                <p className="home-reel__meta">{item.meta}</p>
                {/* Only the brand card is the page h1; project cards are h2 */}
                {index === 0 ? (
                  <h1 className="home-reel__title">{item.title}</h1>
                ) : (
                  <h2 className="home-reel__title">{item.title}</h2>
                )}
                {index === 0 ? (
                  <button
                    type="button"
                    className="home-reel__view"
                    onClick={() => window.scrollBy({ top: window.innerHeight * 1.5, behavior: 'smooth' })}
                  >
                    {item.action}
                  </button>
                ) : (
                  <Link
                    to={item.href}
                    className="home-reel__view"
                    tabIndex={-1}
                  >
                    {item.action}
                  </Link>
                )}
              </div>
            ))}
          </div>

          <div className="home-reel__band">
            <div className="home-reel__band-fill" />
          </div>

          <div className="home-reel__baseline">
            <span>{siteContent.brand.location}</span>
            <span>{siteContent.brand.instagramLabel}</span>
            <span>{siteContent.hero.availability}</span>
          </div>

          <div className="home-reel__scroll-hint" ref={scrollHintRef} aria-hidden="true">
            <span className="home-reel__scroll-label">Scroll</span>
            <span className="home-reel__scroll-line" />
          </div>
        </div>
      </div>
    </section>
  )
}
