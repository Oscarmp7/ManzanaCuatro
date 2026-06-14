# Action Plan — Manzana Cuatro
**Total: 154 hallazgos | Generado: 2026-03-14**

---

## 🔴 P0 — Arreglar HOY (antes de compartir el link)

### 1. Verificar `vercel-cookie.txt`
**Riesgo:** Posible token de Vercel expuesto en el repo
```bash
cat vercel-cookie.txt
# Si tiene contenido sensible → ir a vercel.com/account/tokens y rotar
echo "vercel-cookie.txt" >> .gitignore
```

### 2. Nav cubre el hero en ProjectDetailPage
**Archivo:** `src/pages/ProjectDetailPage.jsx:120`
```jsx
// ANTES
<div className="page--project-detail">
// DESPUÉS
<div className="page page--project-detail">
```

### 3. iOS Safari: filtros de proyectos rotos
**Archivo:** `src/components/ProjectShowcase/ProjectShowcase.css`
`position: sticky` + `overflow-x: auto` = combinación inválida en iOS Safari
```css
/* Añadir al final del archivo */
@media (max-width: 720px) {
  .projects-showcase__filters {
    position: static; /* quitar sticky en mobile */
  }
}
```

### 4. Crear `vercel.json` (SPA rewrite + security headers)
**Problema:** Rutas directas devuelven 404. Sin headers de seguridad.
```json
{
  "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }],
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        { "key": "X-Frame-Options", "value": "DENY" },
        { "key": "X-Content-Type-Options", "value": "nosniff" },
        { "key": "Referrer-Policy", "value": "strict-origin-when-cross-origin" },
        { "key": "Strict-Transport-Security", "value": "max-age=63072000; includeSubDomains; preload" }
      ]
    },
    {
      "source": "/assets/(.*)",
      "headers": [
        { "key": "Cache-Control", "value": "public, max-age=31536000, immutable" }
      ]
    }
  ]
}
```

### 5. Deshabilitar source maps en producción
**Archivo:** `vite.config.js`
```js
export default defineConfig(({ command }) => ({
  base: resolveBase({ command }),
  plugins: [react()],  // también quitar tailwindcss() si se elimina Tailwind
  build: {
    sourcemap: false,
  },
}))
```

### 6. Eliminar Tailwind (importado pero sin usar)
**Archivos:** `src/index.css`, `package.json`
```css
/* src/index.css — ELIMINAR estas líneas: */
@import "tailwindcss";
@theme { ... } /* todo el bloque @theme */
```
```bash
npm uninstall tailwindcss @tailwindcss/vite
```

### 7. Agregar preconnect al CDN de Vercel Blob
**Archivo:** `index.html` — añadir en `<head>`:
```html
<link rel="preconnect" href="https://wol7zpzfeh2wdhnp.public.blob.vercel-storage.com" crossorigin />
<link rel="dns-prefetch" href="https://wol7zpzfeh2wdhnp.public.blob.vercel-storage.com" />
```

### 8. Preload SpaceMono (evitar FOUT en todo el UI)
**Archivo:** `index.html` — añadir junto a los otros preloads:
```html
<link rel="preload" href="/fonts/SpaceMono-Regular.woff2" as="font" type="font/woff2" crossorigin />
```

---

## 🟠 P1 — Sprint de Performance (LCP 4–8s → <2.5s)

### 9. Convertir imágenes PNG a WebP
**Impacto:** De 2–5MB a ~200–400KB por imagen (-80%)
**Archivos:** Todas las URLs en `src/data/siteContent.js`
- Subir versiones WebP al Vercel Blob o usar Cloudinary
- Actualizar URLs en `siteContent.js`
- Añadir `width` y `height` a todos los `<img>` (evita CLS)

### 10. Lazy-load videos de reel (frames 2–4)
**Archivo:** `src/components/HomeReel/HomeReel.jsx`
Solo renderizar el primer video inmediatamente. Los demás, cuando el scroll se acerque:
```jsx
// Patrón: solo montar video si el frame es el activo o el siguiente
{(index === 0 || index <= activeFrameIndex + 1) ? (
  <video src={project.video} autoPlay muted playsInline loop preload="metadata" />
) : (
  <img src={project.poster} alt="" />
)}
```

### 11. Gate comparison videos detrás del scroll
**Archivo:** `src/components/HomeReel/HomeReel.jsx`
Añadir estado `colorStageReady` — solo renderizar los 6 comparison videos cuando el usuario llegue a esa sección:
```jsx
const [colorStageReady, setColorStageReady] = useState(false)
// En applyStage, cuando colorRaw > 0 por primera vez:
// if (!colorStageReady && colorRaw > 0) setColorStageReady(true)

{colorStageReady && (
  <div className="home-reel__color-stage">...</div>
)}
```

### 12. Eliminar layout thrashing en applyStage
**Archivo:** `src/components/HomeReel/HomeReel.jsx:390,397`
```js
// Añadir refs para cachear las mediciones
const cachedTitleHeight = useRef(0)
const cachedComparisonHeight = useRef(0)

// Medir UNA VEZ en el setup del ScrollTrigger, no en onUpdate
// Y refrescar con ResizeObserver:
useEffect(() => {
  const observer = new ResizeObserver(() => {
    cachedTitleHeight.current = colorTitleShell?.getBoundingClientRect().height || 0
    cachedComparisonHeight.current = comparisonFrame?.getBoundingClientRect().height || 0
    ScrollTrigger.refresh()
  })
  if (colorTitleShell) observer.observe(colorTitleShell)
  return () => observer.disconnect()
}, [])

// En applyStage: usar cachedTitleHeight.current en lugar de getBoundingClientRect()
```

### 13. Quitar `will-change` permanentes del CSS
**Archivos:** `HomeReel.css`, `PageTransition.css`, `TextSwap.css`, `HomeClientBand.css`, `ThemeTransition.css`
```css
/* ELIMINAR de CSS (aplicar solo via JS antes/después de animaciones): */
.home-reel__frame { will-change: clip-path; } /* eliminar */
.page-stage { will-change: transform, opacity; } /* eliminar */
.text-swap__layer { will-change: transform, opacity, filter; } /* eliminar */
/* ... y todos los demás will-change permanentes */
```
```js
// En GSAP, antes de animar:
element.style.willChange = 'transform, opacity'
// En onComplete:
element.style.willChange = 'auto'
```

### 14. Reducir backdrop-filter simultáneos
**Archivos:** `ComparisonSlider.css`, `Nav.css`
```css
/* Reemplazar backdrop-filter en labels pequeños del slider */
.comparison-slider__label {
  /* ANTES: backdrop-filter: blur(16px); */
  background: rgba(0, 0, 0, 0.6); /* sólido, sin costo GPU */
}
```

### 15. Agregar manualChunks para GSAP
**Archivo:** `vite.config.js`
```js
build: {
  sourcemap: false,
  rollupOptions: {
    output: {
      manualChunks: {
        'vendor-gsap': ['gsap'],
        'vendor-react': ['react', 'react-dom', 'react-router'],
      }
    }
  }
}
```

---

## 🟠 P1 — Bugs activos de código

### 16. GSAP muta textContent en StudioPage (resetea a 0 en re-render)
**Archivo:** `src/pages/StudioPage.jsx:60`
```jsx
// ANTES (mutación directa del DOM):
gsap.fromTo(el, { textContent: 0 }, { textContent: stat.value, snap: { textContent: 1 } })

// DESPUÉS (via React state):
const [counts, setCounts] = useState(stats.map(() => 0))

// En el GSAP tween, usar onUpdate:
stats.forEach((stat, i) => {
  const obj = { val: 0 }
  gsap.to(obj, {
    val: stat.value,
    duration: 1.5,
    ease: 'power2.out',
    scrollTrigger: { trigger: el, start: 'top 80%' },
    onUpdate: () => setCounts(prev => {
      const next = [...prev]
      next[i] = Math.round(obj.val)
      return next
    })
  })
})
```

### 17. Añadir Error Boundary
**Archivo:** Crear `src/components/ErrorBoundary.jsx`
```jsx
import { Component } from 'react'

export default class ErrorBoundary extends Component {
  state = { hasError: false }
  static getDerivedStateFromError() { return { hasError: true } }
  render() {
    if (this.state.hasError) return (
      <div style={{ padding: '4rem', textAlign: 'center' }}>
        <h1>Algo salió mal</h1>
        <a href="/">Volver al inicio</a>
      </div>
    )
    return this.props.children
  }
}
```
```jsx
// En App.jsx, envolver el Suspense:
<ErrorBoundary>
  <Suspense fallback={null}>
    <Routes>...</Routes>
  </Suspense>
</ErrorBoundary>
```

### 18. Arreglar localStorage sin guard en useTheme
**Archivo:** `src/hooks/useTheme.js`
```js
const getInitialTheme = () => {
  try {
    const stored = localStorage.getItem('m4-theme')
    if (stored === 'light' || stored === 'dark') return stored
  } catch {}
  // Respetar preferencia del sistema en primera visita
  if (typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: light)').matches) {
    return 'light'
  }
  return 'dark'
}

const [theme, setTheme] = useState(getInitialTheme)

const toggle = useCallback(() => {
  setTheme(t => {
    const next = t === 'dark' ? 'light' : 'dark'
    try { localStorage.setItem('m4-theme', next) } catch {}
    return next
  })
}, [])
```

### 19. NotFoundPage: CSS ausente en navegación directa
**Archivos:** Crear `src/pages/NotFoundPage.css`
```css
/* Mover o duplicar estilos de .project-detail__not-found aquí */
/* Cambiar clase en NotFoundPage.jsx: */
```
```jsx
// NotFoundPage.jsx
import './NotFoundPage.css'
<section className="page not-found">
```

### 20. usePrefersReducedMotion inicializa en false
**Archivo:** `src/hooks/usePrefersReducedMotion.js:4`
```js
// ANTES:
const [prefersReducedMotion, setPrefersReducedMotion] = useState(false)

// DESPUÉS:
const [prefersReducedMotion, setPrefersReducedMotion] = useState(
  () => typeof window !== 'undefined'
    ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
    : false
)
```

---

## 🟡 P2 — Próximo sprint

### 21. Centralizar registro de GSAP
```js
// Crear src/lib/gsap.js:
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
gsap.registerPlugin(ScrollTrigger)
export { gsap, ScrollTrigger }

// Importar de ahí en todos los componentes en lugar de registrar 3 veces
```

### 22. Reducir HomeClientBand de 60 a 20 nodos
**Archivo:** `src/components/HomeClientBand/HomeClientBand.jsx`
```js
// ANTES: Array.from({ length: 6 }, () => clients).flat() → 30 items × 2 groups = 60 nodos
// DESPUÉS: 2 repeticiones es suficiente para loop sin corte
const loopItems = [...clients, ...clients] // 10 items × 2 groups = 20 nodos
```

### 23. Hover animations solo en dispositivos con hover
**Añadir en todos los archivos CSS con hover:**
```css
/* Envolver animaciones de hover en: */
@media (hover: hover) and (pointer: fine) {
  .nav__item:hover .text-swap__layer--primary { ... }
  .projects-showcase__case-image:hover { ... }
  /* etc */
}
```

### 24. Arreglar GSAP aria-hidden en cada frame
**Archivo:** `HomeReel.jsx:475`
```js
// Guardar último valor y solo setAttribute cuando cambia:
const lastAriaHidden = useRef({})
// En applyStage:
const newAriaHidden = colorStageOpacity > 0.12 ? 'false' : 'true'
if (lastAriaHidden.current.colorStage !== newAriaHidden) {
  colorStage.setAttribute('aria-hidden', newAriaHidden)
  lastAriaHidden.current.colorStage = newAriaHidden
}
```

### 25. Mover desktopLinks fuera del componente Nav
**Archivo:** `src/components/Nav/Nav.jsx`
```js
// Antes del componente (módulo-level, es data estática):
const desktopLinks = [
  { href: '/', label: siteContent.brand.name, kind: 'brand' },
  ...siteContent.nav,
]
```

### 26. Texto "Menu" en inglés → español
**Archivo:** `src/components/Nav/Nav.jsx:247`
```jsx
<h2 id="nav-mobile-title" className="nav__mobile-title">Menú</h2>
```

### 27. Memoizar cálculos en ProjectShowcase
**Archivo:** `src/components/ProjectShowcase/ProjectShowcase.jsx`
```js
const visibleProjects = useMemo(
  () => activeFilter === 'all'
    ? showcaseProjects
    : showcaseProjects.filter(p => p.disciplines.includes(activeFilter)),
  [activeFilter]
)
```

### 28. Estabilizar onComplete del Loader
**Archivo:** `src/App.jsx`
```jsx
const handleLoaded = useCallback(() => setLoaded(true), [])
<Loader onComplete={handleLoaded} />
```

### 29. Tailwind → devDependencies (si no se elimina)
**Archivo:** `package.json`
```json
// Mover de "dependencies" a "devDependencies":
"@tailwindcss/vite": "^4.2.1",
"tailwindcss": "^4.2.1"
```

### 30. Añadir CI quality gate al workflow
**Archivo:** `.github/workflows/deploy-pages.yml`
```yaml
jobs:
  validate:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: 20, cache: npm }
      - run: npm ci
      - run: npm run lint
      - run: npm test
  build:
    needs: validate
    # ... pasos existentes
```

---

## 🟡 P2 — SEO (crítico para el negocio)

### 31. Prerendering para social previews
**Problema:** WhatsApp/Instagram no ejecutan JS → links sin preview
```bash
npm install -D vite-plugin-prerender
```
```js
// vite.config.js
import { PrerenderPlugin } from 'vite-plugin-prerender'

plugins: [
  react(),
  PrerenderPlugin({
    routes: ['/', '/proyectos', '/studio', '/contacto'],
  })
]
```

### 32. JSON-LD structured data
**Añadir en `src/seo/RouteMeta.jsx` o directamente en `index.html`:**
```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "name": "Manzana Cuatro",
  "url": "https://manzanacuatro.com",
  "address": { "@type": "PostalAddress", "addressLocality": "Santo Domingo" },
  "sameAs": ["https://instagram.com/manzanacuatro"]
}
</script>
```

---

## 🟢 P3 — Backlog

| # | Archivo | Fix |
|---|---------|-----|
| 33 | `Footer.jsx:13` | `"MANZANA CUATRO"` → `{brand.name.toUpperCase()}` |
| 34 | `HomeEndFrame.jsx:45` | `2026` → `{new Date().getFullYear()}` |
| 35 | `siteContent.js` | Agregar acentos faltantes: `promoción`, `campañas`, `ejecución` |
| 36 | `package.json` | Eliminar `@types/react` + `@types/react-dom` (no hay TypeScript) |
| 37 | `Nav.jsx:171` | Usar `clsx` para className assembly en vez de template literals |
| 38 | `HomeReel.jsx:61` | Eliminar 3 constantes muertas: `COLOR_COMPARISON_ENTRY_Y/SCALE/ROTATE` |
| 39 | `TextSwap.jsx` | `export default React.memo(TextSwap)` |
| 40 | `index.css` | Documentar los 4 breakpoints canónicos: 560, 720, 900, 1200px |
| 41 | `README.md` | Reemplazar boilerplate de Vite con info real del proyecto |
| 42 | `.gitignore` | Agregar `.env` y `.env.*` al gitignore |
| 43 | `eslint.config.js` | Agregar `eslint-plugin-jsx-a11y` |
| 44 | `package.json` | Agregar scripts: `lint:fix`, `build:pages`, `audit`, `test:watch` |
| 45 | Testing | Agregar Vitest + jsdom + @testing-library/react |
| 46 | Testing | Extraer utils de scroll a `src/utils/math.js` y unit-testear |
| 47 | Deploy | Configurar Vercel Analytics (free tier, 0 config) |
| 48 | Deploy | Configurar uptime monitoring (UptimeRobot free) |

---

## Orden recomendado de ejecución

```
HOY:      1, 2, 3, 4, 5, 6, 7, 8
Sprint 1: 9, 10, 11, 12, 13, 14, 15
Sprint 2: 16, 17, 18, 19, 20, 30, 31
Sprint 3: 21–29, 32
Backlog:  33–48
```
