import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { showcaseProjects, siteContent } from '../../data/siteContent'
import usePrefersReducedMotion from '../../hooks/usePrefersReducedMotion'
import './Loader.css'

// ---------------------------------------------------------------------------
// Grade Reveal loader
//
// The loader is the home title-card in an ungraded "log" state. A horizontal
// mask wipe grades the scene (same mask language as the color-stage title
// fill), the colorist HUD retires, and the background opens onto the home —
// whose brand title-card sits at the exact same metrics, so the wordmark
// never appears to move. One scene, two states.
// ---------------------------------------------------------------------------

const FPS = 24
const GRADE_X_FROM = -12 // mask feather spans +12%, so start fully covered
const GRADE_X_TO = 112 // and end fully revealed
const GRADE_X_SPAN = GRADE_X_TO - GRADE_X_FROM

const pad2 = (value) => String(value).padStart(2, '0')

const formatTimecode = (frames) => {
  const ff = Math.floor(frames % FPS)
  const ss = Math.floor(frames / FPS) % 60
  return `TC 00:00:${pad2(ss)}:${pad2(ff)}`
}

function TitleCard() {
  return (
    <div className="loader__title-card">
      {/* Meta is rendered but hidden during the load (reserves its space so the
          wordmark stays at the exact home metrics); it reveals on the home. */}
      <p className="loader__meta">{siteContent.hero.eyebrow}</p>
      <p className="loader__wordmark">{siteContent.brand.name}</p>
      {/* Empty CTA-height spacer: no CTA text during the load, but the wordmark
          keeps the home brand-card metrics so the handoff never jumps. */}
      <span className="loader__view-space" aria-hidden="true" />
    </div>
  )
}

export default function Loader({ onComplete }) {
  const loaderRef = useRef(null)
  const backdropRef = useRef(null)
  const logRef = useRef(null)
  const hudRef = useRef(null)
  const timecodeRef = useRef(null)
  const gradeRef = useRef(null)
  const gradeFillRef = useRef(null)
  const gradePctRef = useRef(null)
  const reducedMotionHandledRef = useRef(false)
  const reducedMotion = usePrefersReducedMotion()
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    if (reducedMotion) {
      // No grade bar / HUD / morph: compose the hero underneath, then a short
      // fade from the black backdrop onto the already-composed hero.
      if (!reducedMotionHandledRef.current) {
        reducedMotionHandledRef.current = true
        onComplete?.()
      }

      const fade = gsap.to(backdropRef.current, {
        autoAlpha: 0,
        duration: 0.4,
        ease: 'power2.out',
        onComplete: () => setVisible(false),
      })

      return () => fade.kill()
    }

    // Grade driven by REAL asset loading (fonts + the home's first reel poster)
    // blended with a comfortable minimum so the wipe never feels cut short.
    const MIN_MS = 1500 // grade never completes faster than this
    const TIMEOUT_MS = 3500 // safety: enter the hero no matter what

    const grade = { x: GRADE_X_FROM }
    const root = loaderRef.current
    const hud = hudRef.current
    const backdrop = backdropRef.current
    let exited = false
    let forced = false
    let safety
    let unmountFallback

    const applyGrade = () => {
      logRef.current?.style.setProperty('--grade-x', `${grade.x.toFixed(2)}%`)
      const pct = Math.round(
        Math.min(100, Math.max(0, ((grade.x - GRADE_X_FROM) / GRADE_X_SPAN) * 100)),
      )
      if (gradeFillRef.current) gradeFillRef.current.style.width = `${pct}%`
      if (gradePctRef.current) gradePctRef.current.textContent = `${pct}%`
    }

    const renderTimecode = (elapsedMs) => {
      if (timecodeRef.current) {
        timecodeRef.current.textContent = formatTimecode(Math.floor((elapsedMs / 1000) * FPS))
      }
    }

    // Real load signals: web fonts + the home's first reel poster.
    const ASSET_TOTAL = 2
    let assetsLoaded = 0
    const markAsset = () => { assetsLoaded += 1 }

    if (typeof document !== 'undefined' && document.fonts?.ready) {
      document.fonts.ready.then(markAsset, markAsset)
    } else {
      markAsset()
    }

    const poster = new Image()
    poster.onload = markAsset
    poster.onerror = markAsset
    const posterSrc = showcaseProjects[0]?.poster
    if (posterSrc) poster.src = posterSrc
    else markAsset()

    // HUD entrance (one-shot). The title sits a hair larger in the "log" state
    // and settles to the exact hero scale at the handoff (see finish()).
    gsap.set(root, { '--loader-title-settle': 1.04 })
    gsap.set(hud, { autoAlpha: 0, y: 6 })
    gsap.to(hud, { autoAlpha: 1, y: 0, duration: 0.4, ease: 'power1.out', delay: 0.05 })

    const start = performance.now()

    function finish() {
      if (exited) return
      exited = true
      gsap.ticker.remove(tick)
      clearTimeout(safety)

      grade.x = GRADE_X_TO
      applyGrade()
      gradeRef.current?.classList.add('loader__grade--done')

      // Compose the hero underneath FIRST (directly, not via a tween) so the
      // handoff is robust even if rAF is throttled (e.g. a backgrounded tab).
      onComplete?.()

      // Cinematic exit: the title settles to its exact hero scale, the HUD
      // apparatus cuts away, then the void backdrop opens onto the home (whose
      // identical brand title-card sits underneath at scale 1).
      gsap.to(root, { '--loader-title-settle': 1, duration: 0.6, ease: 'expo.out' })
      gsap.to(hud, { autoAlpha: 0, y: -6, duration: 0.35, ease: 'power1.in' })
      // Open the void onto the reel with a smooth, even dissolve (not the
      // front-loaded expo pop) so the video/photo fades up gradually.
      gsap.to(backdrop, {
        autoAlpha: 0,
        duration: 1.5,
        delay: 0.15,
        ease: 'power2.inOut',
        onComplete: () => setVisible(false),
      })
      // Hard fallback: always unmount even if the fade never ticks.
      unmountFallback = setTimeout(() => setVisible(false), 2300)
    }

    function tick() {
      const elapsed = performance.now() - start
      renderTimecode(elapsed)

      const timeCeiling = Math.min(1, elapsed / MIN_MS)
      const realFraction = forced ? 1 : Math.min(1, assetsLoaded / ASSET_TOTAL)
      const targetX = GRADE_X_FROM + Math.min(realFraction, timeCeiling) * GRADE_X_SPAN
      grade.x += (targetX - grade.x) * 0.12
      applyGrade()

      const ready = forced || assetsLoaded >= ASSET_TOTAL
      if (!exited && ready && elapsed >= MIN_MS && GRADE_X_TO - grade.x < 1.2) {
        finish()
      }
    }

    applyGrade()
    gsap.ticker.add(tick)

    // Safety net: force the handoff if assets stall (never hang on the loader).
    safety = setTimeout(() => {
      forced = true
      finish()
    }, TIMEOUT_MS)

    return () => {
      gsap.ticker.remove(tick)
      clearTimeout(safety)
      clearTimeout(unmountFallback)
      poster.onload = null
      poster.onerror = null
      gsap.killTweensOf([hud, backdrop, root])
    }
  }, [onComplete, reducedMotion])

  if (!visible) return null

  return (
    <div ref={loaderRef} className="loader" aria-hidden="true">
      {/* Void backdrop — the only layer the reveal fades */}
      <div className="loader__backdrop" ref={backdropRef} />

      {!reducedMotion && (
        <>
          {/* Graded scene (final state) */}
          <div className="loader__scene">
            <TitleCard />
          </div>

          {/* Log scene (raw state) — masked away by the grade wipe */}
          <div className="loader__scene loader__scene--log" ref={logRef}>
            <TitleCard />
          </div>

          {/* Colorist HUD */}
          <div className="loader__hud" ref={hudRef}>
            <div className="loader__hud-row">
              <span ref={timecodeRef}>TC 00:00:00:00</span>
              <span>LOG &#9656; REC.709</span>
            </div>
            <div className="loader__hud-row">
              <span className="loader__hud-side">M4 &middot; Santo Domingo</span>
              <span className="loader__grade" ref={gradeRef}>
                <span className="loader__grade-label">Grade</span>
                <span className="loader__grade-bar">
                  <span className="loader__grade-fill" ref={gradeFillRef} />
                </span>
                <span className="loader__grade-pct" ref={gradePctRef}>
                  0%
                </span>
              </span>
              <span className="loader__hud-side">24 fps</span>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
