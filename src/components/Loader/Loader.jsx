import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { siteContent } from '../../data/siteContent'
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
const CLOCK_SECONDS = 3
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
      <p className="loader__meta">{siteContent.hero.eyebrow}</p>
      <p className="loader__wordmark">{siteContent.brand.name}</p>
      <span className="loader__view">{siteContent.hero.primaryCta.label}</span>
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
      if (!reducedMotionHandledRef.current) {
        reducedMotionHandledRef.current = true
        onComplete?.()
      }

      return undefined
    }

    const grade = { x: GRADE_X_FROM }
    const clock = { frames: 0 }

    const renderTimecode = () => {
      if (timecodeRef.current) {
        timecodeRef.current.textContent = formatTimecode(clock.frames)
      }
    }

    const applyGrade = () => {
      logRef.current?.style.setProperty('--grade-x', `${grade.x.toFixed(2)}%`)

      const pct = Math.round(
        Math.min(100, Math.max(0, ((grade.x - GRADE_X_FROM) / GRADE_X_SPAN) * 100)),
      )

      if (gradeFillRef.current) {
        gradeFillRef.current.style.width = `${pct}%`
      }

      if (gradePctRef.current) {
        gradePctRef.current.textContent = `${pct}%`
      }
    }

    // Beat sheet (art direction): hold the raw log state, grade it slowly,
    // hold the graded result with the bar in Calibration Blue, then open the
    // void. Only the backdrop fades — the card never crossfades, because its
    // home twin sits at the exact same metrics underneath.
    const tl = gsap.timeline({
      onComplete: () => setVisible(false),
    })

    tl.set(hudRef.current, { autoAlpha: 0, y: 6 })
      .to(clock, {
        frames: FPS * CLOCK_SECONDS,
        duration: CLOCK_SECONDS,
        ease: 'none',
        onUpdate: renderTimecode,
      }, 0)
      .to(hudRef.current, { autoAlpha: 1, y: 0, duration: 0.4, ease: 'power1.out' }, 0.05)
      // 0.40–0.55: hold — read the raw log state
      .to(grade, {
        x: GRADE_X_TO,
        duration: 1.4,
        ease: 'power2.inOut',
        onUpdate: applyGrade,
      }, 0.55)
      // Grade complete: the bar ticks to Calibration Blue and holds.
      .add(() => gradeRef.current?.classList.add('loader__grade--done'), 1.95)
      // Solidify the home behind the loader (app-shell fades in over 1.05s,
      // fully opaque at ~3.4s — before the backdrop starts opening).
      .call(() => onComplete?.(), [], 2.35)
      .to(hudRef.current, { autoAlpha: 0, y: -6, duration: 0.35, ease: 'power1.in' }, 2.65)
      // Reveal: fade ONLY the void backdrop. The graded card stays solid over
      // its identical home twin, so unmounting is invisible.
      .to(backdropRef.current, { autoAlpha: 0, duration: 0.95, ease: 'expo.out' }, 3.2)

    return () => tl.kill()
  }, [onComplete, reducedMotion])

  if (reducedMotion) return null
  if (!visible) return null

  return (
    <div ref={loaderRef} className="loader" aria-hidden="true">
      {/* Void backdrop — the only layer the reveal fades */}
      <div className="loader__backdrop" ref={backdropRef} />

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
    </div>
  )
}
