import { useEffect } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

// ---------------------------------------------------------------------------
// Timing constants — reel section
// ---------------------------------------------------------------------------

const reelTransitionCount = 3 // must equal reelProjects.length - 1 (checked at runtime in dev)
export const REEL_SETTLE_HOLD = 0.58

const TITLE_FADE_OUT_START = 0.38
const TITLE_FADE_OUT_END = 0.58
const TITLE_FADE_IN_START = 0.48
const TITLE_FADE_IN_END = 0.74
const TITLE_MAX_BLUR = 6
const TITLE_MAX_SHIFT = 6

// ---------------------------------------------------------------------------
// Timing constants — color title section
// ---------------------------------------------------------------------------

const COLOR_STAGE_FADE_IN_START = 0.04
const COLOR_STAGE_FADE_IN_END = 0.26
const COLOR_WASH_START = 0.06
const COLOR_WASH_END = 0.34
const LEGACY_UI_FADE_OUT_START = 0.04
const LEGACY_UI_FADE_OUT_END = 0.18
const COLOR_TONE_SWITCH_START = 0.14
const COLOR_TITLE_DROP_START = 0.08
const COLOR_TITLE_DROP_END = 0.56
const COLOR_TITLE_FILL_START = 0.66
const COLOR_TITLE_FILL_END = 1
const COLOR_TITLE_ENTRY_SCALE = 1.76
const COLOR_TITLE_ENTRY_BLUR = 18
const COLOR_TITLE_ENTRY_Y = -240
const COLOR_TITLE_ENTRY_ROTATE = -28
const COLOR_TITLE_COVER_START = 0.74
const COLOR_TITLE_COVER_END = 1
const COLOR_TITLE_COVER_Y = -42
const COLOR_TITLE_COVER_SCALE = 0.968

// ---------------------------------------------------------------------------
// Timing constants — fullscreen gallery section
// ---------------------------------------------------------------------------

const GALLERY_INTRO_HOLD = 0.4     // pause after title settles (colorRaw 1.0 → 1.4)
const GALLERY_ENTRY_DURATION = 0.45 // slide-in duration per image
const GALLERY_HOLD_DURATION = 0.85  // hold with metadata per image
const GALLERY_START_COLORRAW = 1.0 + GALLERY_INTRO_HOLD // = 1.4
const GALLERY_PERIOD = GALLERY_ENTRY_DURATION + GALLERY_HOLD_DURATION // = 1.3
const GALLERY_N_CASES = 3
const GALLERY_FIRST_ENTRY_END = GALLERY_START_COLORRAW + GALLERY_ENTRY_DURATION // = 1.85

// colorRaw 0 → GALLERY_START_COLORRAW: title animation
// colorRaw GALLERY_START_COLORRAW → end: gallery
const COLOR_STAGE_TRANSITION_COUNT = GALLERY_START_COLORRAW + GALLERY_N_CASES * GALLERY_PERIOD
// = 1.4 + 3 * 1.3 = 5.3

export const TOTAL_TRANSITION_COUNT = reelTransitionCount + REEL_SETTLE_HOLD + COLOR_STAGE_TRANSITION_COUNT
// = 3 + 0.58 + 5.3 = 8.88

const REEL_TRANSITION_COUNT = reelTransitionCount

// ---------------------------------------------------------------------------
// Pure math helpers
// ---------------------------------------------------------------------------

const clamp01 = (value) => Math.min(1, Math.max(0, value))
const normalizeRange = (value, start, end) => clamp01((value - start) / (end - start))
const lerp = (start, end, progress) => start + ((end - start) * progress)

// ---------------------------------------------------------------------------
// Hook
// ---------------------------------------------------------------------------

/**
 * useHomeReelScroll
 *
 * Encapsulates the GSAP ScrollTrigger logic for the HomeReel component.
 * The hook receives all refs by ref-object (reads .current inside the effect)
 * and state-setter callbacks. It owns no state itself.
 *
 * @param {object} params
 * @param {boolean}  params.ready
 * @param {boolean}  params.reducedMotion
 * @param {object}   params.refs          - all DOM / value refs from HomeReel
 * @param {object}   params.setters       - React state setters from HomeReel
 * @param {Array}    params.titleFrames   - the titleFrames data array
 * @param {Array}    params.reelProjects  - the reel project data array
 */
export default function useHomeReelScroll({
  ready,
  reducedMotion,
  refs,
  setters,
  titleFrames,
  reelProjects,
}) {
  const {
    sectionRef,
    frameRefs,
    titleRefs,
    colorStageRef,
    galleryItemRefs,
    measurementRef,
    toneRef,
    activeReelIndexRef,
    colorStageActiveRef,
  } = refs

  const {
    setActiveReelIndex,
    setColorStageActive,
  } = setters

  useEffect(() => {
    if (!ready || reducedMotion) {
      activeReelIndexRef.current = 0
      colorStageActiveRef.current = false
      document.documentElement.dataset.homeReelTone = 'media'
      return () => {
        delete document.documentElement.dataset.homeReelTone
      }
    }

    if (import.meta.env.DEV && reelProjects.length - 1 !== reelTransitionCount) {
      console.warn(
        `useHomeReelScroll: reelTransitionCount (${reelTransitionCount}) is out of sync with `
        + `reelProjects (${reelProjects.length}). Scroll timing will drift.`,
      )
    }

    const section = sectionRef.current
    const frames = frameRefs.current.filter(Boolean)
    const titles = titleRefs.current.filter(Boolean)
    const colorStage = colorStageRef.current
    const galleryItems = (galleryItemRefs.current || []).filter(Boolean)

    if (
      !section
      || !frames.length
      || !titles.length
      || !colorStage
      || !galleryItems.length
    ) {
      return undefined
    }

    const titleWindow = section.querySelector('.home-reel__title-window')
    const colorTitleShell = colorStage.querySelector('.home-reel__color-title-shell')

    if (!colorTitleShell) {
      return undefined
    }

    const announceTone = (tone) => {
      if (toneRef.current === tone) return

      toneRef.current = tone
      document.documentElement.dataset.homeReelTone = tone
      window.dispatchEvent(new CustomEvent('home-reel-stagechange', { detail: { tone } }))
    }

    const syncReelState = (nextIndex) => {
      if (activeReelIndexRef.current !== nextIndex) {
        activeReelIndexRef.current = nextIndex
        setActiveReelIndex(nextIndex)
      }
    }

    const syncColorStageState = (nextActive) => {
      if (colorStageActiveRef.current !== nextActive) {
        colorStageActiveRef.current = nextActive
        setColorStageActive(nextActive)
      }
    }

    const syncMeasurements = () => {
      const viewportHeight = window.innerHeight || measurementRef.current.viewportHeight || 0
      // Batch all DOM reads before writing
      const titleFrameHeight = colorTitleShell.offsetHeight
      const titleWindowHeight = titleWindow?.offsetHeight ?? 0

      measurementRef.current = {
        titleFrameHeight: titleFrameHeight || Math.round(viewportHeight * 0.34),
        titleWindowHeight,
        viewportHeight,
      }
    }

    syncMeasurements()

    const resizeObserver = typeof ResizeObserver === 'function'
      ? new ResizeObserver(() => {
        syncMeasurements()
      })
      : null

    resizeObserver?.observe(colorTitleShell)
    if (titleWindow) resizeObserver?.observe(titleWindow)
    window.addEventListener('resize', syncMeasurements, { passive: true })

    const state = { progress: 0 }

    const applyStage = () => {
      const raw = state.progress * TOTAL_TRANSITION_COUNT
      const reelRaw = Math.min(REEL_TRANSITION_COUNT, raw)
      const transitionIndex = reelRaw >= REEL_TRANSITION_COUNT
        ? REEL_TRANSITION_COUNT - 1
        : Math.min(REEL_TRANSITION_COUNT - 1, Math.max(0, Math.floor(reelRaw)))
      const localProgress = reelRaw >= REEL_TRANSITION_COUNT ? 1 : reelRaw - transitionIndex
      const currentTitleIndex = Math.min(titleFrames.length - 1, transitionIndex)
      const nextTitleIndex = Math.min(titleFrames.length - 1, transitionIndex + 1)
      const fadeOutProgress = normalizeRange(
        localProgress,
        TITLE_FADE_OUT_START,
        TITLE_FADE_OUT_END,
      )
      const fadeInProgress = normalizeRange(
        localProgress,
        TITLE_FADE_IN_START,
        TITLE_FADE_IN_END,
      )
      const stageReelIndex = reelRaw >= REEL_TRANSITION_COUNT
        ? reelProjects.length - 1
        : Math.min(
          reelProjects.length - 1,
          transitionIndex + (localProgress >= 0.5 ? 1 : 0),
        )

      section.style.setProperty('--band-y', `${100 - (localProgress * 100)}%`)

      frames.forEach((frame, index) => {
        // Frame 1 slides over the opening frame as a physical sheet (no clip-path).
        // During the slide it needs z-index above title-window (10) so it covers the title.
        // Once settled, it drops back to z-index 2 so the title-window shows above it again.
        if (index === 1) {
          if (transitionIndex === 0) {
            frame.style.setProperty('--reveal', '100%')
            frame.style.setProperty('--frame1-slide-y', `${lerp(100, 0, localProgress).toFixed(2)}%`)
            frame.style.setProperty('--frame-title-opacity', '1')
          } else {
            frame.style.setProperty('--reveal', '100%')
            frame.style.setProperty('--frame1-slide-y', '0%')
            frame.style.setProperty('--frame-title-opacity', '0')
          }
          return
        }

        let reveal = 0

        if (index === 0 || index <= transitionIndex) {
          reveal = 100
        } else if (index === transitionIndex + 1) {
          reveal = localProgress * 100
        }

        frame.style.setProperty('--reveal', `${reveal}%`)
      })

      titles.forEach((titleCard, index) => {
        let opacity = 0
        let blur = TITLE_MAX_BLUR
        let translateY = TITLE_MAX_SHIFT

        // During 0→1 transition: title card 1 is hidden — Frame 1 carries it physically
        if (transitionIndex === 0 && index === 1) {
          titleCard.style.setProperty('--title-opacity', '0')
          titleCard.style.setProperty('--title-blur', `${TITLE_MAX_BLUR}px`)
          titleCard.style.setProperty('--title-y', `${TITLE_MAX_SHIFT}px`)
          titleCard.style.pointerEvents = 'none'
          titleCard.setAttribute('aria-hidden', 'true')
          titleCard.querySelector('.home-reel__view')?.setAttribute('tabindex', '-1')
          return
        }

        // During 0→1 transition: opening title is static — frame 1 physically covers it
        if (transitionIndex === 0 && index === 0) {
          titleCard.style.setProperty('--title-opacity', '1')
          titleCard.style.setProperty('--title-blur', '0px')
          titleCard.style.setProperty('--title-y', '0px')
          titleCard.style.pointerEvents = 'none'
          titleCard.setAttribute('aria-hidden', 'false')
          titleCard.querySelector('.home-reel__view')?.setAttribute('tabindex', '-1')
          return
        }

        if (reelRaw >= REEL_TRANSITION_COUNT) {
          if (index === titleFrames.length - 1) {
            opacity = 1
            blur = 0
            translateY = 0
          }
        } else {
          if (index === currentTitleIndex) {
            opacity = 1 - fadeOutProgress
            blur = fadeOutProgress * TITLE_MAX_BLUR
            translateY = fadeOutProgress * -TITLE_MAX_SHIFT
          }

          if (index === nextTitleIndex) {
            opacity = fadeInProgress
            blur = (1 - fadeInProgress) * TITLE_MAX_BLUR
            translateY = (1 - fadeInProgress) * TITLE_MAX_SHIFT
          }

          if (localProgress <= TITLE_FADE_OUT_START && index === currentTitleIndex) {
            opacity = 1
            blur = 0
            translateY = 0
          }

          if (localProgress >= TITLE_FADE_OUT_END && index === currentTitleIndex) {
            opacity = 0
            blur = TITLE_MAX_BLUR
            translateY = -TITLE_MAX_SHIFT
          }

          if (localProgress <= TITLE_FADE_IN_START && index === nextTitleIndex) {
            opacity = 0
            blur = TITLE_MAX_BLUR
            translateY = TITLE_MAX_SHIFT
          }

          if (localProgress >= TITLE_FADE_IN_END && index === nextTitleIndex) {
            opacity = 1
            blur = 0
            translateY = 0
          }
        }

        titleCard.style.setProperty('--title-opacity', opacity.toFixed(3))
        titleCard.style.setProperty('--title-blur', `${blur.toFixed(2)}px`)
        titleCard.style.setProperty('--title-y', `${translateY.toFixed(2)}px`)
        titleCard.style.pointerEvents = opacity > 0.72 ? 'auto' : 'none'
        titleCard.setAttribute('aria-hidden', opacity > 0.12 ? 'false' : 'true')
        titleCard
          .querySelector('.home-reel__view')
          ?.setAttribute('tabindex', opacity > 0.72 ? '0' : '-1')
      })

      // Clip title-window to match frame 1's top edge as it slides up,
      // creating the effect of frame 1 physically covering the title.
      if (titleWindow) {
        if (transitionIndex === 0) {
          const { viewportHeight, titleWindowHeight } = measurementRef.current
          const vh = viewportHeight || window.innerHeight
          const topPx = lerp(vh, 0, localProgress)
          const titleWindowBottom = vh / 2 + titleWindowHeight / 2
          const clipFromBottom = Math.max(0, titleWindowBottom - topPx)
          titleWindow.style.clipPath = `inset(0 0 ${clipFromBottom.toFixed(2)}px 0)`
        } else {
          titleWindow.style.clipPath = ''
        }
      }

      // ---------------------------------------------------------------------------
      // Color stage — title animation
      // ---------------------------------------------------------------------------

      const colorRaw = Math.max(0, raw - REEL_TRANSITION_COUNT - REEL_SETTLE_HOLD)
      const colorIntroProgress = clamp01(colorRaw)
      const colorStageOpacity = colorRaw > 0.001 ? 1 : 0
      const washProgress = normalizeRange(colorIntroProgress, COLOR_WASH_START, COLOR_WASH_END)
      const legacyUiOpacity = 1 - normalizeRange(
        colorIntroProgress,
        LEGACY_UI_FADE_OUT_START,
        LEGACY_UI_FADE_OUT_END,
      )
      const titleDropProgress = normalizeRange(
        colorIntroProgress,
        COLOR_TITLE_DROP_START,
        COLOR_TITLE_DROP_END,
      )
      const titleFillProgress = normalizeRange(
        colorIntroProgress,
        COLOR_TITLE_FILL_START,
        COLOR_TITLE_FILL_END,
      )
      const titleFillOpacity = titleFillProgress <= 0
        ? 0
        : normalizeRange(titleFillProgress, 0, 0.12)
      const titleCoverProgress = colorRaw > 1
        ? 1
        : normalizeRange(
          colorIntroProgress,
          COLOR_TITLE_COVER_START,
          COLOR_TITLE_COVER_END,
        )

      const tone = colorIntroProgress >= COLOR_TONE_SWITCH_START ? 'pure' : 'media'
      const { titleFrameHeight, viewportHeight } = measurementRef.current
      const safeViewportHeight = viewportHeight || window.innerHeight || 0
      const titleEntryDistance = Math.max(
        safeViewportHeight + (titleFrameHeight * 0.7),
        safeViewportHeight * 1.12,
      )

      announceTone(tone)
      syncReelState(stageReelIndex)
      syncColorStageState(colorRaw > 0.001)

      section.style.setProperty('--legacy-ui-opacity', legacyUiOpacity.toFixed(3))
      section.style.setProperty('--grade-stage-opacity', colorStageOpacity.toFixed(3))
      section.style.setProperty('--color-wash-opacity', washProgress.toFixed(3))
      section.style.setProperty('--color-wash-blur', `${lerp(0, 18, washProgress).toFixed(2)}px`)
      section.style.setProperty('--grade-title-opacity', colorStageOpacity.toFixed(3))
      section.style.setProperty('--grade-title-scale', lerp(
        COLOR_TITLE_ENTRY_SCALE,
        1,
        titleDropProgress,
      ).toFixed(3))
      section.style.setProperty('--grade-title-blur', `${lerp(
        COLOR_TITLE_ENTRY_BLUR,
        0,
        titleDropProgress,
      ).toFixed(2)}px`)
      section.style.setProperty('--grade-title-y', `${lerp(
        -titleEntryDistance,
        0,
        titleDropProgress,
      ).toFixed(2)}px`)
      section.style.setProperty('--grade-title-rotate', `${lerp(
        COLOR_TITLE_ENTRY_ROTATE,
        0,
        titleDropProgress,
      ).toFixed(2)}deg`)
      section.style.setProperty('--grade-title-fill', `${lerp(0, 100, titleFillProgress).toFixed(2)}%`)
      section.style.setProperty('--grade-title-fill-opacity', titleFillOpacity.toFixed(3))
      section.style.setProperty('--grade-title-cover-y', `${lerp(
        0,
        COLOR_TITLE_COVER_Y,
        titleCoverProgress,
      ).toFixed(2)}px`)
      section.style.setProperty('--grade-title-cover-scale', lerp(
        1,
        COLOR_TITLE_COVER_SCALE,
        titleCoverProgress,
      ).toFixed(3))
      section.style.setProperty('--grade-title-cover-opacity', lerp(
        1,
        0.86,
        titleCoverProgress,
      ).toFixed(3))

      // Collapse the title once the first gallery image has fully covered it
      section.style.setProperty('--grade-title-covered', colorRaw >= GALLERY_FIRST_ENTRY_END ? '0' : '1')

      colorStage.setAttribute('aria-hidden', colorStageOpacity > 0.12 ? 'false' : 'true')

      // ---------------------------------------------------------------------------
      // Fullscreen gallery — alternating slide-in from right / left / right
      // ---------------------------------------------------------------------------

      galleryItems.forEach((item, i) => {
        const entryStart = GALLERY_START_COLORRAW + i * GALLERY_PERIOD
        const entryEnd = entryStart + GALLERY_ENTRY_DURATION
        const metaEnd = entryEnd + 0.3  // metadata fades in over first 0.3 of hold

        const entryP = clamp01(normalizeRange(colorRaw, entryStart, entryEnd))
        const startOffset = i % 2 === 0 ? 100 : -100  // right, left, right...
        const x = lerp(startOffset, 0, entryP)
        item.style.setProperty('--gallery-x', `${x.toFixed(2)}%`)

        const metaP = clamp01(normalizeRange(colorRaw, entryEnd, metaEnd))
        item.style.setProperty('--gallery-meta-opacity', metaP.toFixed(3))
      })
    }

    announceTone('media')
    applyStage()

    const ctx = gsap.context(() => {
      gsap.to(state, {
        progress: 1,
        ease: 'none',
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: 'bottom bottom',
          scrub: true,
          onRefresh: syncMeasurements,
        },
        onUpdate: applyStage,
      })
    }, section)

    return () => {
      ctx.revert()
      resizeObserver?.disconnect()
      window.removeEventListener('resize', syncMeasurements)
      frames[1]?.style.removeProperty('--frame1-slide-y')
      frames[1]?.style.removeProperty('--frame-title-opacity')
      if (titleWindow) titleWindow.style.clipPath = ''
      toneRef.current = ''
      activeReelIndexRef.current = 0
      colorStageActiveRef.current = false
      announceTone('media')
      delete document.documentElement.dataset.homeReelTone
    }
  }, [ready, reducedMotion]) // eslint-disable-line react-hooks/exhaustive-deps
}
