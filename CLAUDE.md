# CLAUDE.md — Jeremy Adonai / Manzana Cuatro

> Portfolio creativo de **Manzana Cuatro** — productora audiovisual dominicana especializada en producción, colorización, fotografía y contenido. El sitio es una SPA React con scroll experiences avanzadas, animaciones GSAP y un sistema de temas claro/oscuro.

---

## Stack Técnico

| Tecnología | Versión | Rol |
|---|---|---|
| React | ^19.2.0 | UI framework |
| Vite + SWC | ^7.3.1 | Build bundler (usar `npm run dev`) |
| GSAP + ScrollTrigger | ^3.14.2 | Todas las animaciones |
| React Router | ^7.13.1 | Routing SPA |
| Node `--test` | built-in | Test runner (archivos en `/tests/`) |

**Sin TypeScript. Sin Tailwind. Sin librerías de UI.** CSS puro + GSAP.

---

## Estructura del Proyecto

```
src/
├── App.jsx                    # Root: routing, theme state, loader, error boundary
├── index.css                  # Variables CSS globales (colores, fuentes, layout)
├── main.jsx                   # Entry point
│
├── contexts/
│   └── ThemeContext.jsx       # Context { theme, toggleTheme } + useThemeContext()
│
├── hooks/
│   ├── useTheme.js            # Tema light/dark con localStorage + system preference
│   ├── usePrefersReducedMotion.js  # Media query (prefers-reduced-motion)
│   └── useHomeReelScroll.js   # GSAP ScrollTrigger logic extraída de HomeReel
│
├── utils/
│   └── math.js                # clamp / lerp / mapRange
│
├── layouts/
│   └── MainLayout.jsx         # Envuelve todas las páginas: Nav + PageTransition + Footer
│
├── components/
│   ├── Nav/                   # Navegación fija, theme dock, menú mobile accesible
│   ├── Footer/                # Pie de página
│   ├── Loader/                # ⭐ Grade Reveal: title-card en log + wipe de grade + HUD (~4.1s, backdrop separado)
│   ├── ErrorBoundary/         # Class component para capturar errores de render
│   ├── PageTransition/        # Wipe GSAP (1s) al cambiar de ruta + scroll instant a top
│   ├── ThemeTransition/       # Hook { curtain JSX, play() } — flash veil 0.1s in / 0.18s out
│   ├── TextSwap/              # Microinteracción: hover anima caracteres (CSS puro)
│   ├── ProjectShowcase/       # Casos en ritmo editorial 1/2-2 + filtros underline (sin pills)
│   ├── HomeReel/              # ⚠️ Componente crítico. Scroll experience + scroll hint HUD
│   ├── HomeClientBand/        # Ticker infinito CSS de clientes (4 grupos, -25% loop)
│   └── HomeEndFrame/          # CTA final de la home
│
├── pages/
│   ├── HomePage.jsx           # HomeReel + HomeClientBand + HomeEndFrame
│   ├── ProjectsPage.jsx       # ProjectShowcase
│   ├── ProjectDetailPage.jsx  # Vista de proyecto con GSAP parallax + stagger
│   ├── StudioPage.jsx         # About: manifesto word reveal + parallax + stats counter
│   ├── ContactPage.jsx        # Contacto con GSAP reveals
│   └── NotFoundPage.jsx       # 404
│
├── data/
│   └── siteContent.js         # ⭐ ÚNICA fuente de verdad: copy, proyectos, servicios, clientes
│
└── seo/
    ├── RouteMeta.jsx          # Componente que actualiza meta tags en runtime por ruta
    ├── routeMeta.js           # Genera objeto de metadata por pathname
    └── staticRouteBuild.js    # Post-build: genera HTMLs con meta tags por ruta

scripts/
└── generate-route-html.mjs    # Llama staticRouteBuild después de vite build

tests/                         # 9 archivos de test con Node --test
```

---

## Rutas

| Path | Componente | Descripción |
|---|---|---|
| `/` | HomePage | Home principal con scroll experience |
| `/proyectos` | ProjectsPage | Galería editorial de proyectos |
| `/proyectos/:slug` | ProjectDetailPage | Detalle de proyecto por slug |
| `/studio` | StudioPage | About del estudio |
| `/contacto` | ContactPage | Página de contacto |
| `*` | NotFoundPage | 404 |

---

## Sistema de Temas

- Script inline en `index.html` aplica `data-theme` ANTES del primer paint (evita FOUC)
- Hook `useTheme` → lee localStorage (`m4-theme`) → fallback a system preference
- Aplica `data-theme="dark|light"` en `<html>`
- CSS responde a ese atributo con las variables en `index.css`
- Animación de cambio: `ThemeTransition` (hook) → flash veil (overexpose a light / shutter a dark), 0.1s in → `toggle()` → 0.18s out
- `App.jsx` gestiona `theme` y lo expone vía `ThemeContext` (`useThemeContext()`)

**Variables clave del tema:**
```css
--bg, --bg-elevated, --text, --text-muted, --text-dim
--accent (#2f78ff), --separator, --curtain, --overlay
```

**Tokens theme-independent (escena cinematográfica):**
```css
--stage-bg (#050505), --stage-text (#f5f5f0)   /* loader + reel siempre oscuros */
--brand-display-size, --brand-card-step        /* wordmark compartido loader↔home (handoff pixel-perfect) */
--flash-overexpose, --flash-shutter            /* theme veil */
--z-nav, --z-theme-dock, --z-mobile-menu, --z-nav-open,
--z-page-wipe, --z-theme-veil, --z-loader, --z-skip-link
```

---

## Tipografía

| Variable | Fuente | Uso |
|---|---|---|
| `--font-display` | Bebas Neue | Headings dramáticos |
| `--font-hud` | Space Mono | Metadata, HUD, UI técnica |
| `--font-body` | Inter | Cuerpo de texto |
| `--font-serif` | Cormorant Garamond | Highlights, citas |

---

## Convenciones CSS

- **BEM**: `.block__element--modifier`
- **Fluid typography**: `clamp(min, preferred, max)` — sin breakpoints fijos en su mayoría
- **Layout max**: `var(--layout-max)` = 1320px, padding = `var(--layout-pad)` = `clamp(18px, 4vw, 48px)`
- **Animaciones**: siempre respetar `usePrefersReducedMotion()` — si es true, skip o simplify
- **Will-change**: solo en elementos que se animan activamente (HomReel frames, TextSwap layers)

---

## Animaciones GSAP — Reglas

1. **Siempre crear un contexto** para cleanup automático:
   ```js
   const ctx = gsap.context(() => { /* animaciones */ }, scopeRef)
   return () => ctx.revert()
   ```

2. **ScrollTrigger** se registra una vez en main.jsx. No re-registrar.

3. **Respetar reduced motion**:
   ```js
   const prefersReducedMotion = usePrefersReducedMotion()
   if (prefersReducedMotion) return // skip animation
   ```

4. **Easing custom** del proyecto:
   ```css
   --ease-out: cubic-bezier(0.16, 1, 0.3, 1) /* también usado en GSAP como 'expo.out' */
   ```

5. **Patrones comunes**:
   - Slide up (mask reveal): `overflow: hidden` + `yPercent: 100 → 0`
   - Parallax: `yPercent: -5 → 5, ease: 'none', scrub: true`
   - Stagger: `stagger: 0.08, y: 20 → 0, opacity: 0 → 1`
   - Clip-path reveal: `inset(calc(100% - var(--reveal)) 0 0 0)`

---

## HomeReel — Componente Crítico

**Es el corazón del sitio**. No modificar sin entenderlo completo.

La lógica de scroll está extraída en `useHomeReelScroll.js` — HomeReel.jsx maneja solo el render.

**Fases del scroll (progress 0–1)**:
1. **Reels** (0–3 transiciones): 4 proyectos con clip-path reveal suave
2. **Color Stage**: wash desaturado fade in, tone cambia a `pure`
3. **Color Title**: título entra desde arriba con rotación + escala + blur, luego fill con mask wipe
4. **Gallery**: 3 casos de colorización entran fullscreen alternando derecha/izquierda (videos gateados — solo montan cuando la color stage está activa)

**Scroll Hint** (`.home-reel__scroll-hint`):
- "SCROLL" en Space Mono + línea animada con gota que cae
- Fade-in GSAP (0.8s, delay 0.6s) cuando `ready = true`
- Fade-out GSAP (0.35s) al primer `window.scroll` — listener se elimina tras disparar
- Oculto en mobile con `display: none` a `max-width: 720px`
- `z-index: 14` (por encima del overlay `z-13` y baseline `z-12`)
- `visibility: hidden` en CSS — GSAP `autoAlpha` gestiona visibility + opacity

**Comunicación con Nav**:
- Dispara `window.dispatchEvent(new CustomEvent('home-reel-stagechange', { detail: { tone } }))`
- Nav escucha ese evento para cambiar color del texto (blanco en stage oscura)

**Props**: `ready` (boolean) — espera a que el Loader complete antes de activar scroll.

---

## Datos — siteContent.js

**Modificar SOLO aquí para cambiar contenido.** Estructura:

```js
showcaseProjects[]     // 5 proyectos: slug, title, client, category, year, poster, video?, disciplines, summary, scope, details
siteContent.brand      // Nombre, email, WhatsApp, Instagram, dominio, ubicación
siteContent.nav[]      // Links de navegación
siteContent.clients[]  // Lista de clientes para el ticker
siteContent.hero       // eyebrow, title, text, primaryCta, availability
siteContent.projectsPage // eyebrow, title (h1 sr-only), filters[{id,label}]
siteContent.about      // Copy del studio
siteContent.stats[]    // Estadísticas del estudio
siteContent.services[] // 5 servicios + servicesSection (CTA → WhatsApp)
siteContent.colorization // título + cases[] de la galería (title, client, tags, media, poster, isVideo)
siteContent.contact    // Copy de contacto
```

> Nota: el archivo se podó en 2026-06 — solo quedan campos que la UI renderiza (o SEO consume, como `summary`). No agregar campos sin consumidor.

**Disciplinas válidas**: `'production' | 'color' | 'photo' | 'content'`

---

## SEO

**Estrategia híbrida** (SPA + prerendering manual):

1. `RouteMeta.jsx` — actualiza `<title>`, metas og/twitter, canonical en runtime
2. `staticRouteBuild.js` — script que post-build inyecta las metas en cada HTML estático
3. El build genera un HTML por ruta en `dist/`

**Rutas con SEO configurado**: `/`, `/proyectos`, `/proyectos/:slug`, `/studio`, `/contacto`

**Implementado**: JSON-LD (runtime + inyectado en HTML estático), robots.txt, sitemap.xml (con lastmod), og:locale, theme-color compartido vía `THEME_COLORS` en `routeMeta.js`

**Pendiente (depende de contenido del cliente)**: og-image 1200×630 real, logo para Organization schema

---

## Build y Deploy

```bash
npm run dev          # Dev server en localhost:5173
npm run build        # vite build + genera HTMLs por ruta
npm run preview      # Preview del build
npm run test         # node --test (tests en /tests/)
npm run lint         # ESLint
```

**Deploy**:
- Target único: Vercel (base `/`). El dual-target de GitHub Pages se eliminó en 2026-06 (BrowserRouter nunca soportó el subpath)
- Branch activa: `feat/m4-redesign` → merge target: `master`

---

## Patrones de Código

### Custom Events (HomeReel ↔ Nav)
```js
// Dispatch (en HomeReel)
window.dispatchEvent(new CustomEvent('home-reel-stagechange', { detail: { tone: 'pure' } }))

// Listen (en Nav)
window.addEventListener('home-reel-stagechange', handler)
// Cleanup: window.removeEventListener(...)
```

### Gating de videos en HomeReel
- Reel: solo el frame activo ±1 monta `<video>` (`shouldRenderReelMotionMedia`); el resto usa `<img poster>`
- Galería de colorización: los `<video>` solo montan cuando `colorStageActive` (autoPlay fuerza descarga aunque `preload="none"`)
- Loader Grade Reveal: dos capas del mismo title-card (log arriba, graded debajo), mask wipe horizontal vía `--grade-x`, HUD con timecode GSAP

### Meta Tags en Runtime
```js
const ensureMetaTag = (selector, attributes) => {
  let el = document.head.querySelector(selector) ?? document.createElement('meta')
  Object.entries(attributes).forEach(([k, v]) => el.setAttribute(k, v))
  document.head.appendChild(el) // no-op si ya existe
}
```

---

## Accesibilidad (Estado actual)

**Implementado correctamente**:
- Skip link (`#main-content`)
- Focus trap en menú mobile (Escape key, Tab cíclico)
- `aria-current`, `aria-expanded`, `aria-hidden`, `aria-label`, `role="slider"`, `role="toolbar"`, `role="dialog"`
- Texto SR-only en TextSwap (`.text-swap__sr-only`)
- `prefers-reduced-motion` respetado en TODOS los componentes GSAP

**Pendiente**: ARIA live regions, contrast ratio en light mode, testing con screen readers

---

## Tests (node --test)

9 archivos en `/tests/`:
- `cleanup-config.test.js` — configuración de limpieza
- `layout-direction.test.js` — dirección del layout
- `nav-layout.test.js` — Nav structure
- `performance-responsive.test.js` — performance/responsiveness
- `route-meta.test.js` — SEO meta tags por ruta
- `runtime-hardening.test.js` — robustez en runtime
- `site-content.test.js` — siteContent.js validation
- `static-route-build.test.js` — generación de HTMLs estáticos
- `vite-base.test.js` — configuración de vite base

---

## ⚠️ Lo que NO tocar sin cuidado

1. **HomeReel.jsx** — sistema de timing/progress es frágil. Cambiar constantes de scroll afecta toda la secuencia
2. **ThemeTransition.jsx** — el midpoint timing (0.3s) debe coincidir con la transición CSS del tema
3. **staticRouteBuild.js** — asume estructura específica del HTML de Vite post-build
4. **siteContent.js** — la shape de `showcaseProjects` es consumida por múltiples componentes; cambiar campos puede romper ProjectShowcase, HomeReel, ProjectDetailPage simultáneamente
5. **`data-theme` en `<html>`** — todas las variables CSS dependen de este atributo

---

## Contexto de Negocio

- **Cliente**: Manzana Cuatro, productora audiovisual, Santo Domingo, República Dominicana
- **Propósito**: Portfolio/showcase para atraer clientes de producción audiovisual, colorización y fotografía
- **Audiencia**: Marcas dominicanas e internacionales buscando producción de alto nivel
- **Rama activa**: `feat/m4-redesign` (rediseño completo en curso)
