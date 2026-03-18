# Premium Transitions — Design Doc
**Date**: 2026-03-17
**Scope**: PageTransition (Cinema Shutter) + ThemeTransition (Radial Expand)

---

## 1. Page Transition — Cinema Shutter

### Concept
A solid curtain panel (`--curtain`) rises from the bottom edge of the screen, covers the viewport completely, then continues upward and exits off-screen — revealing the new page. Two clean beats. No blur, no scan line. Pure geometry + timing.

### Visual
```
[old page visible]
     ↑ panel rises (0.36s, expo.inOut)
[screen fully covered]
     → route already rendered underneath
     → set new page opacity: 1
     ↑ panel exits upward (0.48s, expo.inOut)
[new page revealed]
```

### Details
- Panel: `position: fixed`, full viewport, `background: var(--curtain)`, `z-index: 998`
- Accent line: `::after` pseudo at `top: 0` of panel — 1px, `var(--accent)`, subtle glow via box-shadow. This becomes the leading edge as the panel sweeps up.
- New page content: set to `opacity: 0` before animation, restored to `1` at midpoint (panel fully covering)
- Total duration: ~0.84s perceived but feels snappy due to expo easing
- Reduced motion: skip animation, just scroll to top

### Files changed
- `src/components/PageTransition/PageTransition.jsx` — replace scan line logic with shutter panel
- `src/components/PageTransition/PageTransition.css` — replace `.page-scan` with `.page-shutter`

---

## 2. Theme Transition — Radial Expand from Toggle

### Concept
When user clicks the theme toggle, a filled circle expands from the button's exact screen position, covering the viewport (using `clip-path: circle()`). At full coverage, the theme toggles (color variables update instantly underneath). The circle then contracts back to nothing, revealing the new theme.

### Visual
```
[click at toggle position (x, y)]
  circle(0px at x y) → circle(maxRadius at x y)  [0.42s, power2.inOut]
  → theme toggles (CSS vars update)
  circle(maxRadius at x y) → circle(0px at x y)  [0.42s, power2.inOut]
```

### Details
- Veil: `position: fixed`, full viewport, `z-index: 9999`, `pointer-events: none`
- Background: captured via `getComputedStyle(docEl).getPropertyValue('--bg')` *before* toggle — so veil matches the "departing" theme color, masking the switch
- `maxRadius = Math.hypot(max(x, W-x), max(y, H-y))` — ensures full coverage from any origin
- Origin: `e.currentTarget.getBoundingClientRect()` center from click event
- Fallback origin: center of screen (for mobile theme button without event)
- `toggleTheme(event)` signature updated to accept optional event

### Files changed
- `src/components/ThemeTransition/ThemeTransition.jsx` — replace blur with clip-path radial
- `src/components/ThemeTransition/ThemeTransition.css` — remove backdrop-filter, keep basic fixed overlay
- `src/App.jsx` — `handleThemeToggle = (e) => play(e)`
- `src/components/Nav/Nav.jsx` — pass event to `toggleTheme(e)` on desktop toggle click

---

## Accessibility
- Both transitions check `usePrefersReducedMotion()` — if true, skip animation entirely
- No `pointer-events` during transitions (already `none`)
- `aria-hidden="true"` maintained on both overlay elements
