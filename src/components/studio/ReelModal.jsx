import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import gsap from 'gsap'
import usePrefersReducedMotion from '../../hooks/usePrefersReducedMotion'
import { getLenis } from '../../hooks/useLenis'
import './ReelModal.css'

const fmt = (s) => {
  if (!Number.isFinite(s)) return '0:00'
  const m = Math.floor(s / 60)
  const sec = Math.floor(s % 60)
  return `${m}:${String(sec).padStart(2, '0')}`
}

// Full-screen reel lightbox with a custom video player. The heavy <video> only
// exists while open (lazy mount → unload on close).
export default function ReelModal({ open, onClose, src, poster, title }) {
  const reduced = usePrefersReducedMotion()
  const [mounted, setMounted] = useState(false)

  const backdropRef = useRef(null)
  const dialogRef = useRef(null)
  const videoRef = useRef(null)
  const closeRef = useRef(null)
  const lastFocusRef = useRef(null)
  const volumeRef = useRef(1)
  const hideTimerRef = useRef(null)

  const [playing, setPlaying] = useState(false)
  const [muted, setMuted] = useState(false)
  const [volume, setVolume] = useState(1)
  const [current, setCurrent] = useState(0)
  const [duration, setDuration] = useState(0)
  const [controlsVisible, setControlsVisible] = useState(true)
  const [isFullscreen, setIsFullscreen] = useState(false)

  const progress = duration > 0 ? current / duration : 0

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- mount on open so the entrance animation can run (animate-presence)
    if (open) setMounted(true)
  }, [open])

  // Open / close lifecycle: scroll-lock, entrance/exit tween, focus, playback.
  useLayoutEffect(() => {
    if (!mounted) return undefined

    if (open) {
      lastFocusRef.current = document.activeElement
      getLenis()?.stop()
      document.body.style.overflow = 'hidden'

      const ctx = gsap.context(() => {
        gsap.fromTo(backdropRef.current, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.3, ease: 'power2.out' })
        if (reduced) {
          gsap.fromTo(dialogRef.current, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.25 })
        } else {
          gsap.fromTo(
            dialogRef.current,
            { autoAlpha: 0, scale: 0.92 },
            { autoAlpha: 1, scale: 1, duration: 0.5, ease: 'expo.out' },
          )
        }
      })

      closeRef.current?.focus()
      const v = videoRef.current
      if (v) {
        v.currentTime = 0
        v.muted = false
        v.volume = volumeRef.current
        const p = v.play()
        if (p?.catch) p.catch(() => {})
      }
      return () => ctx.revert()
    }

    // open === false but still mounted → animate out, then unmount + restore
    const finish = () => {
      videoRef.current?.pause()
      getLenis()?.start()
      document.body.style.overflow = ''
      lastFocusRef.current?.focus?.()
      setMounted(false)
    }
    if (reduced) {
      gsap.to([backdropRef.current, dialogRef.current], { autoAlpha: 0, duration: 0.2, onComplete: finish })
    } else {
      gsap.to(dialogRef.current, { autoAlpha: 0, scale: 0.95, duration: 0.3, ease: 'power2.in' })
      gsap.to(backdropRef.current, { autoAlpha: 0, duration: 0.32, delay: 0.04, onComplete: finish })
    }
    return undefined
  }, [open, mounted, reduced])

  // Safety: always restore scroll on unmount.
  useEffect(
    () => () => {
      getLenis()?.start()
      document.body.style.overflow = ''
      clearTimeout(hideTimerRef.current)
    },
    [],
  )

  // Keyboard: Esc closes, Tab is trapped inside the dialog.
  useEffect(() => {
    if (!open || !mounted) return undefined
    const onKey = (e) => {
      if (e.key === 'Escape') {
        e.preventDefault()
        onClose()
        return
      }
      if (e.key !== 'Tab' || !dialogRef.current) return
      const focusable = dialogRef.current.querySelectorAll(
        'button, [href], input, [tabindex]:not([tabindex="-1"])',
      )
      if (!focusable.length) return
      const first = focusable[0]
      const last = focusable[focusable.length - 1]
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault()
        last.focus()
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault()
        first.focus()
      }
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [open, mounted, onClose])

  // Track native fullscreen changes (e.g. user exits with Esc/F).
  useEffect(() => {
    const onFs = () => setIsFullscreen(Boolean(document.fullscreenElement))
    document.addEventListener('fullscreenchange', onFs)
    return () => document.removeEventListener('fullscreenchange', onFs)
  }, [])

  const revealControls = () => {
    setControlsVisible(true)
    clearTimeout(hideTimerRef.current)
    hideTimerRef.current = setTimeout(() => {
      if (videoRef.current && !videoRef.current.paused) setControlsVisible(false)
    }, 3000)
  }

  const togglePlay = () => {
    const v = videoRef.current
    if (!v) return
    if (v.paused) v.play().catch(() => {})
    else v.pause()
  }

  // Keep React state in sync with the media element via its volumechange event
  const syncVolume = () => {
    const v = videoRef.current
    if (!v) return
    setMuted(v.muted)
    setVolume(v.volume)
    volumeRef.current = v.volume
  }

  const toggleMute = () => {
    const v = videoRef.current
    if (v) v.muted = !v.muted
  }

  const onVolume = (e) => {
    const val = Number(e.target.value)
    const v = videoRef.current
    if (v) {
      v.volume = val
      v.muted = val === 0
    }
  }

  const seekTo = (clientX, track) => {
    const v = videoRef.current
    if (!v || !track || !duration) return
    const rect = track.getBoundingClientRect()
    const fraction = Math.min(1, Math.max(0, (clientX - rect.left) / rect.width))
    v.currentTime = fraction * duration
    setCurrent(v.currentTime)
  }

  const onScrubPointerDown = (e) => {
    const track = e.currentTarget
    track.setPointerCapture?.(e.pointerId)
    seekTo(e.clientX, track)
    const move = (ev) => seekTo(ev.clientX, track)
    const up = () => {
      track.removeEventListener('pointermove', move)
      track.removeEventListener('pointerup', up)
    }
    track.addEventListener('pointermove', move)
    track.addEventListener('pointerup', up)
  }

  const toggleFullscreen = () => {
    const el = dialogRef.current
    if (!document.fullscreenElement) el?.requestFullscreen?.()
    else document.exitFullscreen?.()
  }

  if (!mounted) return null

  return createPortal(
    <div className="reel-modal" role="dialog" aria-modal="true" aria-label={`Reel — ${title}`}>
      <div
        ref={backdropRef}
        className="reel-modal__backdrop"
        onClick={onClose}
        aria-hidden="true"
      />
      <div
        ref={dialogRef}
        className={`reel-modal__dialog${controlsVisible ? '' : ' reel-modal__dialog--idle'}`}
        onMouseMove={revealControls}
        onPointerDown={revealControls}
      >
        <video
          ref={videoRef}
          className="reel-modal__video"
          src={src}
          poster={poster}
          playsInline
          onClick={togglePlay}
          onPlay={() => setPlaying(true)}
          onPause={() => setPlaying(false)}
          onTimeUpdate={() => setCurrent(videoRef.current?.currentTime ?? 0)}
          onLoadedMetadata={() => setDuration(videoRef.current?.duration ?? 0)}
          onVolumeChange={syncVolume}
          onEnded={() => setPlaying(false)}
        />

        <button
          ref={closeRef}
          type="button"
          className="reel-modal__close"
          onClick={onClose}
          aria-label="Cerrar reel"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
            <line x1="6" y1="6" x2="18" y2="18" />
            <line x1="18" y1="6" x2="6" y2="18" />
          </svg>
        </button>

        <div className="reel-modal__controls">
          <button
            type="button"
            className="reel-modal__btn"
            onClick={togglePlay}
            aria-label={playing ? 'Pausar' : 'Reproducir'}
          >
            {playing ? (
              <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <rect x="6" y="5" width="4" height="14" />
                <rect x="14" y="5" width="4" height="14" />
              </svg>
            ) : (
              <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <polygon points="7 4 20 12 7 20" />
              </svg>
            )}
          </button>

          <span className="reel-modal__time">{fmt(current)}</span>

          <div
            className="reel-modal__track"
            onPointerDown={onScrubPointerDown}
            role="slider"
            aria-label="Progreso del reel"
            aria-valuemin={0}
            aria-valuemax={Math.round(duration)}
            aria-valuenow={Math.round(current)}
            aria-valuetext={`${fmt(current)} de ${fmt(duration)}`}
            tabIndex={0}
            onKeyDown={(e) => {
              const v = videoRef.current
              if (!v) return
              if (!['ArrowRight', 'ArrowLeft', 'Home', 'End'].includes(e.key)) return
              e.preventDefault() // don't scroll the page while seeking
              if (e.key === 'ArrowRight') v.currentTime = Math.min(duration, v.currentTime + 5)
              if (e.key === 'ArrowLeft') v.currentTime = Math.max(0, v.currentTime - 5)
              if (e.key === 'Home') v.currentTime = 0
              if (e.key === 'End') v.currentTime = duration
            }}
          >
            <span className="reel-modal__track-fill" style={{ transform: `scaleX(${progress})` }} />
            <span className="reel-modal__track-knob" style={{ left: `${progress * 100}%` }} />
          </div>

          <span className="reel-modal__time reel-modal__time--total">{fmt(duration)}</span>

          <button
            type="button"
            className="reel-modal__btn"
            onClick={toggleMute}
            aria-label={muted ? 'Activar sonido' : 'Silenciar'}
          >
            {muted ? (
              <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <polygon points="4 9 8 9 13 5 13 19 8 15 4 15" />
                <line x1="16" y1="9" x2="21" y2="14" stroke="currentColor" strokeWidth="1.8" />
                <line x1="21" y1="9" x2="16" y2="14" stroke="currentColor" strokeWidth="1.8" />
              </svg>
            ) : (
              <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <polygon points="4 9 8 9 13 5 13 19 8 15 4 15" />
                <path d="M16 8a5 5 0 0 1 0 8" fill="none" stroke="currentColor" strokeWidth="1.8" />
              </svg>
            )}
          </button>

          <input
            className="reel-modal__volume"
            type="range"
            min="0"
            max="1"
            step="0.05"
            value={muted ? 0 : volume}
            onChange={onVolume}
            aria-label="Volumen"
          />

          <button
            type="button"
            className="reel-modal__btn"
            onClick={toggleFullscreen}
            aria-label={isFullscreen ? 'Salir de pantalla completa' : 'Pantalla completa'}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
              <polyline points="4 9 4 4 9 4" />
              <polyline points="20 9 20 4 15 4" />
              <polyline points="4 15 4 20 9 20" />
              <polyline points="20 15 20 20 15 20" />
            </svg>
          </button>
        </div>
      </div>
    </div>,
    document.body,
  )
}
