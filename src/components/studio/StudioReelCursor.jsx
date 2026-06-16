import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import './StudioReelCursor.css'

// Only fine-pointer + hover devices get the custom cursor (touch falls back to
// the visible cue in StudioHero). Disabled under reduced motion.
const FINE_POINTER = '(hover: hover) and (pointer: fine)'

/**
 * A reel "lens" that follows the cursor over the hero: a circular window showing
 * the hero poster rippled via an SVG displacement filter, so the image appears
 * to wave under the cursor. A "Ver reel" outline ring rides on top.
 *
 * Perf: the SVG filter is applied to a STATIC <img> (the reel poster), so the
 * browser computes the displacement ONCE and caches the filtered layer. Both
 * the lens and the slice offset move via `transform` only (compositor) — no
 * per-frame layout, no per-frame filter re-rasterization (a live <video> under
 * an SVG filter forces a GPU→CPU readback every frame, which is what stuttered).
 */
export default function StudioReelCursor({ targetRef, media }) {
  const rootRef = useRef(null)
  const [enabled, setEnabled] = useState(false)

  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return undefined
    const mq = window.matchMedia(FINE_POINTER)
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)')
    const sync = () => setEnabled(mq.matches && !reduce.matches)
    sync()
    mq.addEventListener('change', sync)
    reduce.addEventListener('change', sync)
    return () => {
      mq.removeEventListener('change', sync)
      reduce.removeEventListener('change', sync)
    }
  }, [])

  useEffect(() => {
    if (!enabled) return undefined
    const target = targetRef.current
    const root = rootRef.current
    if (!target || !root) return undefined

    let rect = target.getBoundingClientRect()
    const measure = () => {
      rect = target.getBoundingClientRect()
      root.style.setProperty('--hero-w', `${rect.width}px`)
      root.style.setProperty('--hero-h', `${rect.height}px`)
    }
    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(target)

    // Lerp the rendered position toward the pointer target so the lens glides
    // (no per-event jumps), and drive BOTH the lens transform and the media
    // slice offset from the same smoothed value so they stay aligned.
    let raf = 0
    let tx = rect.width / 2
    let ty = rect.height / 2
    let rx = tx
    let ry = ty
    let firstMove = true
    const render = () => {
      rx += (tx - rx) * 0.2
      ry += (ty - ry) * 0.2
      root.style.setProperty('--mx', `${rx}px`)
      root.style.setProperty('--my', `${ry}px`)
      raf = requestAnimationFrame(render)
    }
    const onMove = (e) => {
      tx = e.clientX - rect.left
      ty = e.clientY - rect.top
      if (firstMove) {
        rx = tx
        ry = ty
        firstMove = false
      }
    }
    const onEnter = () => {
      firstMove = true
      target.classList.add('studio-hero--cursor-active')
      if (!raf) raf = requestAnimationFrame(render)
      gsap.to(root, { autoAlpha: 1, duration: 0.3, ease: 'power3.out' })
      gsap.fromTo(
        root,
        { '--lens-scale': 0.55 },
        { '--lens-scale': 1, duration: 0.5, ease: 'expo.out' },
      )
    }
    const onLeave = () => {
      target.classList.remove('studio-hero--cursor-active')
      gsap.to(root, {
        autoAlpha: 0,
        duration: 0.25,
        ease: 'power3.out',
        onComplete: () => {
          if (raf) {
            cancelAnimationFrame(raf)
            raf = 0
          }
        },
      })
    }

    target.addEventListener('pointermove', onMove)
    target.addEventListener('pointerenter', onEnter)
    target.addEventListener('pointerleave', onLeave)
    return () => {
      ro.disconnect()
      if (raf) cancelAnimationFrame(raf)
      target.removeEventListener('pointermove', onMove)
      target.removeEventListener('pointerenter', onEnter)
      target.removeEventListener('pointerleave', onLeave)
      target.classList.remove('studio-hero--cursor-active')
      gsap.set(root, { autoAlpha: 0 })
    }
  }, [enabled, targetRef])

  if (!enabled) return null

  return (
    <div ref={rootRef} className="studio-reel-cursor" aria-hidden="true">
      <svg className="studio-reel-cursor__defs" width="0" height="0" aria-hidden="true" focusable="false">
        <filter id="studio-reel-ripple" x="-25%" y="-25%" width="150%" height="150%">
          <feTurbulence type="fractalNoise" baseFrequency="0.016 0.022" numOctaves="2" seed="7" result="noise" />
          <feDisplacementMap in="SourceGraphic" in2="noise" scale="24" xChannelSelector="R" yChannelSelector="G" />
        </filter>
      </svg>

      <div className="studio-reel-cursor__lens">
        <img className="studio-reel-cursor__media" src={media.poster} alt="" decoding="async" />
      </div>

      <div className="studio-reel-cursor__ring">
        <span className="studio-reel-cursor__label">Ver reel</span>
      </div>
    </div>
  )
}
