# Auditoría de producción — Manzana Cuatro

**Fecha:** 2026-06-10 · **Branch:** `feat/m4-redesign` · **Auditor:** Mateo (studio)
**Método:** lectura completa de `src/` (28 archivos JS/JSX/CSS), `index.html`, configs, tests, scripts de build; ejecución real de `npm run lint`, `npm run test`, `npm run build`; verificación HTTP de assets remotos.

**Estado de los gates ejecutados:**

| Gate | Resultado |
|---|---|
| `npm run build` | ✅ Pasa (6s, 10 HTMLs de ruta generados) |
| `npm run test` | ✅ Pasa (9 suites) |
| `npm run lint` | ❌ **Falla — 25 errores** (archivos vendoreados en `.agents/`) |
| Visual-diff responsive (Playwright) | ⚠️ No ejecutado — MCP `playwright` no cargado en la sesión |

---

## 🔴 CRÍTICOS — bloquean producción

### C1. Todos los videos del sitio son placeholders públicos de terceros
`src/data/siteContent.js:9-14` — `portfolioPlaceholderVideos` apunta a:
- `interactive-examples.mdn.mozilla.net/.../flower.mp4`
- `filesamples.com/samples/video/...ocean_with_audio.mp4`
- `commondatastorage.googleapis.com/gtv-videos-bucket/.../ForBiggerEscapes.mp4`
- `download.samplelib.com/mp4/sample-10s.mp4`

Se usan como video de los 4 proyectos del reel **y** como los 3 casos de colorización. Además, esos URLs alimentan el JSON-LD `VideoObject.contentUrl` (datos estructurados falsos ante Google). Un portfolio de productora audiovisual mostrando el video de la flor de MDN no puede salir a producción. Dependencia de CDNs ajenos sin SLA (samplelib/filesamples pueden caer o bloquear hotlinking).

### C2. Imagen del Studio es un placeholder blanco de 2 MB
`siteContent.about.image` → `.../white.jpg` (verificado: **1.99 MB**, JPEG blanco). En `/studio` se renderiza como bloque 3:4 con parallax: 2 MB de nada.

### C3. Todo el media vive en Vercel Blob `briefs/` sin optimizar
Los 5 posters son **screenshots PNG** (verificado: ~0.6 MB c/u) con URLs que contienen narrow no-break space (`%E2%80%AF`). Problemas: (a) LCP de la home es un PNG screenshot — debería ser WebP/AVIF con `srcset`; (b) single point of failure fuera del repo y del deploy; (c) sin control de versiones ni pipeline de assets; (d) el `og:image` (mismo PNG) no es 1200×630.

### C4. Tema light: wordmark del Loader invisible (negro sobre negro)
`Loader.css:5` fija `background: #050505` (hardcoded) pero `Loader.css:41` usa `color: var(--text)`. Con `data-theme="light"` (`--text: #0a0a0a`), el wordmark y el borde de `.loader__view` quedan negro-sobre-negro. Todo usuario con tema light guardado ve el splash roto en cada visita. Fix: tokens de "stage oscura" fijos (`--stage-bg`/`--stage-text`) para el loader.

### C5. Caso de colorización con cliente ficticio
`siteContent.colorization.cases[0]` → cliente **"Maison Vale"**, que no existe en la lista real de clientes. Contenido inventado visible en la home.

---

## 🟠 MAYORES

### M1. `npm run lint` falla — gate de calidad roto
25 errores, todos en `.agents/skills/impeccable/scripts/*` (vendoreado). `eslint.config.js` solo ignora `dist`. Cualquier CI que corra lint está rojo. Fix: `globalIgnores(['dist', '.agents', '.claude', '.impeccable', '.playwright-mcp'])`.

### M2. SEO copy sin diacríticos — "campanas" en vez de "campañas"
En `index.html` (title, description, og:*, twitter:*) y en todo `src/seo/routeMeta.js`: "Produccion audiovisual", "campanas" (= bells 🔔), "filmacion", "fotografia", "ejecucion", "pagina". Es lo que Google y WhatsApp muestran al compartir. La marca aparece mal escrita en todos los snippets. (El resto del sitio sí usa acentos — la inconsistencia delata descuido.)

### M3. Los 3 videos de la galería de colorización cargan y reproducen desde el load inicial
`HomeReel.jsx:193-240` — los `<video autoPlay loop>` de la galería se montan incondicionalmente aunque esa stage está a ~7 viewports de scroll. `autoPlay` fuerza la descarga aunque tengan `preload="none"`. Los reel-videos sí están gateados (`shouldRenderReelMotionMedia`); la galería no. Costo: 3 streams de red + decode loop permanente en la home. Fix: montar el `<video>` solo cuando `colorStageActive` (o colorRaw cercano), con `poster` como fallback.

### M4. Navegación entre rutas hace smooth-scroll animado hasta arriba
`index.css:95` declara `html { scroll-behavior: smooth }` y `PageTransition.jsx:25` llama `window.scrollTo(0, 0)`, que respeta el CSS → al navegar desde el fondo de una página larga, la página vieja/nueva scrollea animada hasta el top disparando ScrollTriggers por el camino. Fix: `window.scrollTo({ top: 0, left: 0, behavior: 'instant' })` (también en `ProjectDetailPage.jsx:103`).

### M5. Deploy a GitHub Pages está roto a nivel de routing
`vite.config.js` soporta `base: '/ManzanaCuatro/'`, pero `main.jsx` usa `<BrowserRouter>` sin `basename` → bajo GH Pages ninguna ruta matchea (`/ManzanaCuatro/` no es `/`). Si GH Pages sigue siendo target soportado: `<BrowserRouter basename={import.meta.env.BASE_URL}>`. Si no, eliminar el dual-target del config y del CLAUDE.md (también canonical/sitemap apuntarían al dominio equivocado en ese target).

### M6. Jerarquía de encabezados rota
- Home: **4 `<h1>`** — `HomeReel.jsx:253` renderiza `<h1>` por cada title-card del map. Solo el brand debería ser h1; el resto h2.
- `/proyectos`: **0 `<h1>`** — `ProjectShowcase` solo tiene eyebrow + contador; los títulos de casos son h2 (y además dentro de un wrapper `aria-hidden`). El copy `projectsPage.title` existe en los datos pero nunca se renderiza.
- El Loader agrega otro `<h1>` (mitigado por `aria-hidden`).

### M7. Structured data inválida / engañosa
`routeMeta.js` (`getJsonLd`): (a) `Organization.logo` → `https://manzanacuatro.com/og-image.jpg` **que no existe** (en `public/` no hay og-image); (b) `VideoObject.contentUrl` → videos de muestra (C1); (c) `uploadDate` fabricado (`2025-01-01`); (d) el JSON-LD solo se inyecta en runtime — los HTML estáticos generados por `staticRouteBuild` no lo llevan, así que crawlers sin JS no lo ven.

### M8. Copy con faltas ortográficas en superficies de UI
- `NotFoundPage.jsx:7`: "Pagina no encontrada" → Página
- `ErrorBoundary.jsx:33-40`: "encontro", "navegacion", "esta ruta" (ésta no, pero encontró/navegación sí), "Recargar pagina"
- `Nav.jsx:200`: aria-labels "Abrir menu/Cerrar menu" y título "Menu" → menú
- `HomeEndFrame.jsx:47`: "(c) Manzana Cuatro" → © (el Footer sí usa `&copy;` — inconsistente)
- `siteContent.js`: campos `objective`/`deliverable` sin acentos ("promocion", "atmosfera", "Campana retail"), tags "Colorizacion"

---

## 🟡 MEDIANOS

### MD1. Tokenización incompleta (zero-hardcode audit: 69 hallazgos en 12 archivos)
- **69 literales de color** (`#hex`/`rgba()`) fuera de `index.css` — los peores: `HomeReel.css` (24, toda la familia `rgba(245,245,240,…)` que debería ser un token `--stage-text`), `Nav.css` (8), `Loader.css` (3).
- **Sin escala de z-index**: valores ad-hoc 1, 5, 10–14, 20, 140, 145, 150, 160, 1000, 9999, 10000, 10001. Pide tokens `--z-nav`, `--z-overlay`, `--z-loader`…
- **Sin tokens de spacing/duración**: paddings y `0.2s/0.32s/0.45s` repetidos a mano.
- `ThemeTransition.jsx:23`: flash colors `#ffffff`/`#0a0a0a` hardcoded (deberían leer `--bg` de cada tema).
- `RouteMeta.jsx:59`: theme-colors `#f5f5f0`/`#050505` duplican los tokens CSS.
- `ContactPage.css:87,150`: `cubic-bezier(0.16,1,0.3,1)` literal en vez de `var(--ease-out)`.
- `ContactPage.jsx:93`: inline style `style={{ marginTop: '3rem' }}`.
- Paleta en hex, no OKLCH (estándar del playbook).

### MD2. siteContent.js inflado con datos muertos (~25% del archivo)
Nunca consumidos: `brand.phone`, `hero.secondaryCta`, `hero.reelLabel`, `ticker[]` (8 items — HomeClientBand usa `clients`), `work{}` completo, `about.shortBio`, `projectsPage.title/intro/rail`, `filters[].description`, `servicesSection.text`, `contact.notes`, `project.objective`, `project.deliverable`. Una "única fuente de verdad" con campos fantasma engaña a quien edita contenido. Decidir: renderizar o eliminar.

### MD3. Token y asset de fuente muertos
`--font-serif` (Cormorant Garamond) declarado en `index.css` + woff2 en `public/fonts/` — **ningún selector lo usa**. Eliminar token, @font-face y archivo, o usarla (el design system la anuncia para highlights/citas).

### MD4. Acoplamiento frágil HomeReel ↔ hook
`useHomeReelScroll.js:9` hardcodea `reelTransitionCount = 3` (comentario admite que "= reelProjects.length - 1") y `REEL_SETTLE_HOLD = 0.58` está duplicado en hook y componente (`HomeReel.jsx:16`). Si mañana hay 3 o 5 proyectos en el slice, el timing se desincroniza silenciosamente. El hook debería recibir/derivar el count de los datos y exportar las constantes compartidas de un solo lugar.

### MD5. Guard muerto en useHomeReelScroll
`useHomeReelScroll.js:130-131` llama `section.querySelector(...)` **antes** del null-check de `section` (línea 133). Si `section` fuera null, lanzaría TypeError antes de llegar al guard que lo protege.

### MD6. Flash de tema (FOUC) para usuarios light
`data-theme` se aplica en un `useEffect` post-mount; `index.html` no tiene script inline que lea `localStorage('m4-theme')`. Primer paint siempre dark (`:root`). Usuarios light ven flash oscuro en cada carga. Fix estándar: script inline bloqueante de 3 líneas en `<head>`.

### MD7. CLAUDE.md desactualizado (documentación ≠ código)
- `ComparisonSlider` ya no existe — la fase 4 del HomeReel ahora es galería fullscreen, no slider before/after.
- `ThemeTransition` descrito como velo+orbe 0.78s/midpoint 0.3s — hoy es flash de 0.28s sin orbe.
- `PageTransition` documentado 0.58s — hoy 1s.
- "Falta: robots.txt, sitemap.xml" — ya existen en `public/`.
- `src/contexts/ThemeContext.jsx` y `src/utils/math.js` no documentados.

### MD8. Accesibilidad — huecos puntuales
- `role="toolbar"` en filtros (`ProjectShowcase.jsx:82`) sin navegación por flechas (el patrón ARIA toolbar la requiere; con botones simples sobra el role).
- Títulos de caso visibles dentro de `aria-hidden="true"` (`case-body`) — el aria-label del link compensa, pero AT no puede leer el texto visible.
- Sin ARIA live regions para el cambio de filtro (el contador `01/02` cambia silenciosamente).
- `mailto:` con `target="_blank"` (`ContactPage.jsx:69-85` aplica `_blank` a todos los canales, incluido Email) → pestaña en blanco en varios navegadores.

### MD9. Detalles SEO restantes
- `404.html` estático lleva canonical `https://manzanacuatro.com/ruta-inexistente` (mitigado por noindex, pero sucio).
- Sitemap sin `<lastmod>`; sin `og:locale` (`es_DO`).
- `robots.txt` con `Disallow: /api/` que no existe (inofensivo).
- Space Mono se usa above-the-fold (HUD/meta del loader y baseline) sin `<link rel="preload">` (Bebas e Inter sí lo tienen).

### MD10. `Suspense fallback={null}`
En conexión lenta, navegar a una ruta lazy deja la página en blanco (el wipe dura 1s y el chunk puede tardar más). Un fallback mínimo (barra de progreso o el propio wipe sostenido) evitaría el vacío.

### MD11. Riesgo de overflow en `/contacto` (600–900px)
`contact__title` con `white-space: nowrap` y `clamp(2.5rem, 5.5vw, 5rem)`; solo pasa a `normal` bajo 600px. Verificar viewport 600–768 con título "COMIENZA TU HISTORIA" — riesgo de scroll horizontal. (Pendiente de verificación visual — Playwright no disponible en esta sesión.)

### MD12. Animación de `top` en hamburguesa
`Nav.css:296-300` transiciona `top` (propiedad de layout) en las barras del menú. Es pequeño, pero la regla del proyecto es transform/opacity only. Fix: `translateY`/`rotate` puros.

---

## 🟢 MENORES

1. `ErrorBoundary.componentDidCatch` → `console.error` sin guard (playbook: sin console.* en runtime; aceptable en error boundary, idealmente detrás de `import.meta.env.DEV` o un reporter).
2. `HomeClientBand` con 3 copias del grupo: en ultrawide >2600px el loop puede quedarse corto un instante. Una 4ª copia o duplicación dinámica lo blinda.
3. Keys por índice en `StudioPage` (manifesto words, highlights) — funciona porque el contenido es estático, pero es el patrón débil.
4. `servicesSection.cta.href` (wa.me) ignorado — el botón de Studio navega a `/contacto` con el label "Solicita una cotización ahora". Decidir destino canónico del CTA.
5. Stat "1 país — base de operaciones" (`siteContent.stats`): estadística débil que resta más de lo que suma; un counter animado hasta "1" se ve raro.
6. `Footer.css:2` usa `--text-dim` como borde; el resto del sitio usa `--separator` con color-mix — inconsistencia de sistema.
7. `document.documentElement.dataset.homeReelTone` queda en `<html>` después de salir de la home (sin efecto práctico hoy; higiene).
8. Los reel-videos se desmontan/remontan al alejarse del frame activo → al volver, el video reinicia de 0 (aceptable como trade-off de memoria; documentarlo).
9. Bundle principal 370 KB (127 KB gzip) — sano para React 19 + GSAP + Router; sin acción necesaria, solo vigilar si se agregan plugins GSAP.
10. Flechas tipográficas `←`/`→` como iconos (ProjectDetail nav, Contact channels) — el playbook prefiere SVG (Lucide); como tipografía intencional es defendible, pero unificar criterio.

---

## ✅ Lo que está sano (no tocar)

- Build y tests verdes; prerendering híbrido (runtime + HTMLs estáticos por ruta) bien resuelto con `escapeHtml` y noindex en 404.
- `prefers-reduced-motion` respetado en **todos** los componentes GSAP y CSS (patrón ejemplar).
- `gsap.context()` + `ctx.revert()` en todos los efectos; ScrollTrigger registrado una sola vez.
- Focus trap del menú mobile completo (Escape, Tab cíclico, restauración de foco); skip link; `aria-current/expanded/pressed` correctos.
- Lazy routes con code-splitting por página; fonts self-hosted woff2 con preload de las críticas.
- BEM consistente en todo el CSS; fluid typography con clamp; `100dvh` con fallback.
- `useTheme` robusto (SSR-safe, storage try/catch, sync con system preference).

---

## Plan de remediación sugerido (orden)

1. **Sprint contenido (C1, C2, C3, C5):** reemplazar videos/posters/about-image por material real de Manzana Cuatro, optimizado (WebP/AVIF + MP4 H.264 comprimido), servido desde `public/` o un bucket propio versionado; crear `og-image.jpg` 1200×630 real.
2. **Sprint bugs (C4, M3, M4, M6, MD5, MD6, MD11):** loader theme-safe, gate de galería, scroll instant, jerarquía h1, guard, script inline de tema, verificación responsive con Playwright.
3. **Sprint calidad (M1, M2, M8, MD1, MD2, MD3):** ignores de ESLint, pasada completa de diacríticos (UI + SEO + datos), tokenización (colores stage, z-index, duraciones), poda de datos muertos y fuente serif.
4. **Sprint SEO/deploy (M5, M7, MD9):** decidir target de deploy (Vercel-only o arreglar basename), JSON-LD en HTML estático, logo real, limpiar VideoObject.
5. Actualizar CLAUDE.md (MD7) al cerrar.
