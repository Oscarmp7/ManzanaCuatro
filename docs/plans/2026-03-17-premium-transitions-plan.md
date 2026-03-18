# Premium Transitions Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Replace the page scan-line transition with a Cinema Shutter (panel wipe) and the theme blur-veil with a Radial Expand from the toggle button.

**Architecture:** Two self-contained changes — PageTransition.jsx/.css and ThemeTransition.jsx/.css — plus minimal wiring in App.jsx and Nav.jsx to pass the click event origin for the radial.

**Tech Stack:** GSAP 3, React 19, CSS custom properties, `clip-path: circle()`

---

### Task 1: Cinema Shutter — CSS

**Files:**
- Modify: `src/components/PageTransition/PageTransition.css`

**Step 1: Replace the CSS**

Replace the entire file with:

```css
.page-stage {
  will-change: transform, opacity;
}

.page-shutter {
  position: fixed;
  inset: 0;
  z-index: 998;
  display: none;
  pointer-events: none;
  will-change: transform;
  background: var(--curtain);
}

.page-shutter::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 1px;
  background: var(--accent);
  box-shadow:
    0 0 6px var(--accent),
    0 0 18px color-mix(in srgb, var(--accent) 35%, transparent);
}

@media (max-width: 900px), (prefers-reduced-motion: reduce) {
  .page-stage,
  .page-shutter {
    will-change: auto;
  }
}
```

**Step 2: Verify visually — no broken styles**
Run `npm run dev`, navigate between pages — old scan line should be gone (will look broken until Task 2).

---

### Task 2: Cinema Shutter — JSX

**Files:**
- Modify: `src/components/PageTransition/PageTransition.jsx`

**Step 1: Rewrite the component**

```jsx
import { useRef, useLayoutEffect } from 'react'
import { useLocation } from 'react-router'
import gsap from 'gsap'
import usePrefersReducedMotion from '../../hooks/usePrefersReducedMotion'
import './PageTransition.css'

export default function PageTransition({ children }) {
  const stageRef = useRef(null)
  const shutterRef = useRef(null)
  const location = useLocation()
  const isFirstRender = useRef(true)
  const reducedMotion = usePrefersReducedMotion()

  useLayoutEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false
      return
    }

    if (reducedMotion) {
      window.scrollTo(0, 0)
      return
    }

    window.scrollTo(0, 0)

    const tl = gsap.timeline()

    // Phase 1: panel rises from below to cover screen (new page hidden underneath)
    // Phase 2: panel continues up and exits, revealing new page
    tl.set(stageRef.current, { opacity: 0 })
      .set(shutterRef.current, { display: 'block', yPercent: 100 })
      .to(shutterRef.current, {
        yPercent: 0,
        duration: 0.36,
        ease: 'expo.inOut',
      })
      .set(stageRef.current, { opacity: 1 })
      .to(shutterRef.current, {
        yPercent: -100,
        duration: 0.48,
        ease: 'expo.inOut',
      })
      .set(shutterRef.current, { display: 'none' })
  }, [location.pathname, reducedMotion])

  return (
    <>
      <div ref={stageRef} className="page-stage" data-route={location.pathname}>
        {children}
      </div>
      <div ref={shutterRef} className="page-shutter" aria-hidden="true" />
    </>
  )
}
```

**Step 2: Test in browser**
- Navigate between `/`, `/proyectos`, `/studio`, `/contacto`
- The curtain panel should rise from the bottom, fully cover, then exit upward
- Accent glow line should be visible at the leading edge
- On first load: no animation (correct)

**Step 3: Commit**
```bash
git add src/components/PageTransition/PageTransition.jsx src/components/PageTransition/PageTransition.css
git commit -m "feat: replace scan-line with cinema shutter page transition"
```

---

### Task 3: Radial Theme Transition — CSS

**Files:**
- Modify: `src/components/ThemeTransition/ThemeTransition.css`

**Step 1: Replace the CSS**

```css
.theme-veil {
  position: fixed;
  inset: 0;
  z-index: 9999;
  display: none;
  pointer-events: none;
  will-change: clip-path;
}

@media (prefers-reduced-motion: reduce) {
  .theme-veil {
    will-change: auto;
  }
}
```

---

### Task 4: Radial Theme Transition — Hook

**Files:**
- Modify: `src/components/ThemeTransition/ThemeTransition.jsx`

**Step 1: Rewrite the hook**

```jsx
import { useRef, useCallback } from 'react'
import gsap from 'gsap'
import usePrefersReducedMotion from '../../hooks/usePrefersReducedMotion'
import './ThemeTransition.css'

export default function useThemeTransition(onMidpoint) {
  const veilRef = useRef(null)
  const animatingRef = useRef(false)
  const reducedMotion = usePrefersReducedMotion()

  const play = useCallback((originEvent) => {
    if (animatingRef.current) return

    if (reducedMotion) {
      onMidpoint?.()
      return
    }

    animatingRef.current = true

    // Determine circle origin from click event or fallback to screen center
    let originX = window.innerWidth / 2
    let originY = window.innerHeight / 2

    if (originEvent?.currentTarget) {
      const rect = originEvent.currentTarget.getBoundingClientRect()
      originX = rect.left + rect.width / 2
      originY = rect.top + rect.height / 2
    }

    // Capture current bg color BEFORE theme toggles so the veil matches the departing theme
    const currentBg = getComputedStyle(document.documentElement)
      .getPropertyValue('--bg')
      .trim()

    // Max radius to guarantee full coverage from any corner
    const maxRadius = Math.hypot(
      Math.max(originX, window.innerWidth - originX),
      Math.max(originY, window.innerHeight - originY),
    )

    const veil = veilRef.current
    veil.style.background = currentBg

    const tl = gsap.timeline({
      onComplete: () => {
        animatingRef.current = false
        veil.style.clipPath = ''
        veil.style.background = ''
      },
    })

    tl.set(veil, {
      display: 'block',
      clipPath: `circle(0px at ${originX}px ${originY}px)`,
    })
      .to(veil, {
        clipPath: `circle(${maxRadius}px at ${originX}px ${originY}px)`,
        duration: 0.42,
        ease: 'power2.inOut',
      })
      .call(() => onMidpoint?.())
      .to(veil, {
        clipPath: `circle(0px at ${originX}px ${originY}px)`,
        duration: 0.42,
        ease: 'power2.inOut',
      })
      .set(veil, { display: 'none' })
  }, [onMidpoint, reducedMotion])

  const curtain = <div ref={veilRef} className="theme-veil" aria-hidden="true" />

  return { curtain, play }
}
```

---

### Task 5: Wire event through App.jsx and Nav.jsx

**Files:**
- Modify: `src/App.jsx` line 22
- Modify: `src/components/Nav/Nav.jsx` line 220

**Step 1: Update App.jsx**

Change line 22 from:
```jsx
const handleThemeToggle = () => play()
```
to:
```jsx
const handleThemeToggle = (e) => play(e)
```

**Step 2: Update Nav.jsx desktop toggle**

Change line 220 from:
```jsx
onClick={toggleTheme}
```
to:
```jsx
onClick={(e) => toggleTheme(e)}
```

**Step 3: Test in browser**
- Click Dark/Light toggle on desktop — circle should expand from button position
- Click mobile theme button — circle should expand from approximate center (no event position)
- Toggle rapidly — second click should be blocked while animating (correct)
- Toggle in both light and dark modes

**Step 4: Commit**
```bash
git add src/components/ThemeTransition/ThemeTransition.jsx src/components/ThemeTransition/ThemeTransition.css src/App.jsx src/components/Nav/Nav.jsx
git commit -m "feat: replace blur veil with radial expand theme transition"
```

---

### Task 6: Verify reduced motion

**Step 1: Enable `prefers-reduced-motion` in browser devtools**
Chrome: Rendering panel → Emulate prefers-reduced-motion: reduce

**Step 2: Verify**
- Page transitions: no animation, just instant scroll to top ✓
- Theme toggle: instant switch, no circle animation ✓

**Step 3: Run existing tests**
```bash
npm run test
```
Expected: all pass (no tests cover GSAP animations directly)
