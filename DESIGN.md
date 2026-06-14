---
name: Manzana Cuatro
description: Portfolio cinematográfico de productora audiovisual dominicana — silencioso, preciso, premium.
colors:
  void-black: "#050505"
  surface-elevated: "#0a0a0a"
  cream-white: "#f5f5f0"
  text-muted: "#888888"
  text-dim: "#444444"
  calibration-blue: "#2f78ff"
  calibration-blue-hover: "#4a8fff"
  separator: "#333333"
  text-muted-light: "#666666"
  text-dim-light: "#aaaaaa"
  separator-light: "#dddddd"
typography:
  display:
    fontFamily: "'Bebas Neue', Impact, sans-serif"
    fontSize: "clamp(2.8rem, 6.5vw, 7rem)"
    fontWeight: 400
    lineHeight: 0.89
    letterSpacing: "0.02em"
  title:
    fontFamily: "'Bebas Neue', Impact, sans-serif"
    fontSize: "clamp(1rem, 1.6vw, 1.25rem)"
    fontWeight: 400
    lineHeight: 1
    letterSpacing: "0.16em"
  label:
    fontFamily: "'Space Mono', 'Courier New', monospace"
    fontSize: "0.68rem"
    fontWeight: 400
    lineHeight: 1.4
    letterSpacing: "0.12em"
  body:
    fontFamily: "'Inter', system-ui, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 400
    lineHeight: 1.5
    letterSpacing: "normal"
  serif-accent:
    fontFamily: "'Cormorant Garamond', Georgia, serif"
    fontSize: "clamp(1.25rem, 3vw, 2rem)"
    fontWeight: 400
    lineHeight: 1.2
    letterSpacing: "normal"
rounded:
  none: "0"
  micro: "2px"
  hairline: "1px"
spacing:
  nav-height: "96px"
  layout-pad: "clamp(18px, 4vw, 48px)"
  layout-max: "1320px"
components:
  button-primary:
    backgroundColor: "{colors.calibration-blue}"
    textColor: "#ffffff"
    rounded: "{rounded.micro}"
    padding: "12px 24px"
  button-primary-hover:
    backgroundColor: "{colors.calibration-blue-hover}"
    textColor: "#ffffff"
    rounded: "{rounded.micro}"
    padding: "12px 24px"
  button-ghost:
    backgroundColor: "transparent"
    textColor: "{colors.cream-white}"
    rounded: "{rounded.micro}"
    padding: "12px 24px"
  button-ghost-hover:
    backgroundColor: "transparent"
    textColor: "{colors.cream-white}"
    rounded: "{rounded.micro}"
    padding: "12px 24px"
  filter-chip:
    backgroundColor: "transparent"
    textColor: "{colors.text-muted}"
    rounded: "{rounded.none}"
    borderBottom: "1px solid transparent"
    padding: "0.5rem 0.1rem"
  filter-chip-active:
    backgroundColor: "transparent"
    textColor: "{colors.cream-white}"
    rounded: "{rounded.none}"
    borderBottom: "1px solid {colors.cream-white}"
    padding: "0.5rem 0.1rem"
---

# Design System: Manzana Cuatro

## 1. Overview

**Creative North Star: "El Corte Final"**

El sistema visual de Manzana Cuatro es una sala de edición: oscura, silenciosa, focal. Cada elemento sobrevivió al corte. Lo que aparece en pantalla está ahí porque era necesario — no porque se olvidó eliminar. La interfaz opera como el montaje de una película de autor: ritmo deliberado, silencios calculados, y un único momento de color que corta el negro cuando tiene algo que decir.

La paleta es casi monocromática por diseño. El fondo es near-void (#050505), no negro absoluto. El texto es cream-white (#f5f5f0), no blanco. El único color real es el Calibration Blue (#2f78ff): el azul de las tarjetas de calibración de cámara, frío y técnico, que aparece donde la interfaz necesita precisión, no decoración. El scroll es narrativa. La tipografía no decora: Bebas Neue condensa el drama en pocas palabras; Space Mono convierte los metadatos en HUD técnico; Cormorant aparece una vez, cuando el tono lo pide.

Este sistema rechaza explícitamente: el espectáculo sin argumento (morphing blobs, gradientes neon, glassmorphism por defecto), el grid uniforme de productora latinoamericana clásica, la estética SaaS con acento púrpura y testimonios en grid de cards idénticas, y el motion design ruidoso que grita donde debería mostrar.

**Key Characteristics:**
- Near-void como canvas: el negro ligeramente elevado define la profundidad sin sombras
- Un solo acento de color, restrained ≤10% de cualquier pantalla
- Cuatro voces tipográficas con roles distintos: nunca intercambiables
- Flat por doctrina: sin sombras, profundidad a través de líneas de separación de 1px
- Scroll como montaje: cada fase tiene ritmo de corte, no de scroll genérico
- El espacio vacío es parte del diseño, no ausencia de contenido

## 2. Colors: La Paleta del Cuarto Oscuro

El color más importante de este sistema es el que se omite. La paleta es austera: cerca del negro, cerca del blanco, y un único acento técnico que aparece cuando la interfaz necesita señalar precisión.

### Primary

- **Calibration Blue** (#2f78ff): El único color de acento. Nombre derivado de las tarjetas de calibración de cámara — frío, técnico, no decorativo. Se usa en: focus rings, selection highlights, el botón primario, el texto de categoría sobre imágenes de proyectos. Aparece con rareza deliberada. El hover es #4a8fff, más luminoso en 5 puntos de lightness.

### Neutral

- **Void Black** (#050505): El background principal en modo oscuro. No es #000 — tiene una tinta ultraligera que evita el negro absoluto. El canvas de la sala de edición.
- **Surface Elevated** (#0a0a0a): El fondo ligeramente elevado en modo oscuro. La diferencia con Void Black es tonal, perceptible solo en contexto.
- **Cream White** (#f5f5f0): El texto principal en modo oscuro y el background principal en modo claro. Un blanco cálido que evita el blanco absoluto, igual que Void Black evita el negro absoluto.
- **Signal Muted** (#888888 oscuro / #666666 claro): El texto secundario — metadatos, labels, información contextual que informa sin competir.
- **Ghost** (#444444 oscuro / #aaaaaa claro): El texto de menor jerarquía — timestamps, copyright, decoración textual que casi desaparece.
- **Separator** (#333333 oscuro / #dddddd claro): Las líneas de 1px que dividen el espacio. El único mecanismo de elevación del sistema.

### Named Rules

**The Calibration Rule.** El Calibration Blue aparece en ≤10% de cualquier pantalla. Su rareza es su poder. Usarlo más de una vez por viewport quiebra el contrato. Si se siente tentador usarlo en un elemento decorativo, no va ahí.

**The Near-Void Rule.** Nunca #000 ni #fff. Siempre Void Black (#050505) y Cream White (#f5f5f0). La diferencia es invisible aislada, y definitiva en contexto.

## 3. Typography: Cuatro Voces, Un Solo Uso Cada Una

**Display Font:** Bebas Neue (con fallback Impact, sans-serif) — condensada, dramática, siempre en uppercase implícito por morfología.
**Body Font:** Inter Variable (con fallback system-ui) — variable weight, legible, invisible en el buen sentido.
**Label / HUD Font:** Space Mono (con fallback Courier New) — monoespaciada, técnica, de set de filmación.
**Accent / Editorial Font:** Cormorant Garamond Italic (con fallback Georgia) — aparece exactamente cuando el tono lo requiere. No más.

**Character:** Bebas Neue habla como el título de un poster de cine de Cannes. Space Mono opera como el HUD de una cámara de cine. Inter no se nota porque no debe notarse. Cormorant entra cuando el ritmo lo pide — una sola vez por sección, máximo.

### Hierarchy

- **Display** (Bebas Neue 400, clamp(2.8rem, 6.5vw, 7rem), line-height 0.89): Títulos de proyectos sobre imágenes. El tamaño más grande del sistema. Usa el condensado de Bebas para comprimir drama en el espacio del encuadre.
- **Title** (Bebas Neue 400, clamp(1rem, 1.6vw, 1.25rem), letter-spacing 0.16em): Nombre de marca en Nav y referencias a sección. Bebas en tamaño compacto con tracking amplio.
- **Body** (Inter 400, 0.875rem, line-height 1.5): Copy de descripción, textos de párrafo, información de proyectos. Max-width 65ch en columnas de texto.
- **Label / HUD** (Space Mono 400, 0.6rem–0.82rem, letter-spacing 0.09em–0.18em, UPPERCASE): Metadatos, año, cliente, disciplinas, filtros, theme dock, numeración de escenas. Todo lo que es información técnica, no narrativa.
- **Serif Accent** (Cormorant Garamond 400 italic, clamp(1.25rem, 3vw, 2rem)): Highlights editoriales y citas. Nunca más de una aparición por sección.

### Named Rules

**The Four-Voice Rule.** Bebas Neue, Space Mono, Inter y Cormorant tienen roles exclusivos y no intercambiables. Bebas no aparece en body copy. Space Mono no aparece en títulos principales. Cormorant no aparece en HUD. Cada fuente tiene una función, no una colección.

**The HUD Doctrine.** Space Mono es el lenguaje técnico del sistema: números de escena, años, disciplinas, conteos. Si la información es metadata de producción, va en Space Mono uppercase. Si es narrativa, va en Inter.

## 4. Elevation

Este sistema es flat por doctrina. No existen sombras en el token system ni en ningún componente. La profundidad se transmite exclusivamente a través de líneas de separación de 1px en el color separator correspondiente al tema.

La jerarquía visual de superficies usa variación tonal mínima: Void Black (#050505) como base y Surface Elevated (#0a0a0a) como nivel superior. La diferencia es imperceptible en aislamiento y legible en contexto — exactamente como la profundidad en un frame de cine de autor.

### Shadow Vocabulary

Ninguno. El sistema no tiene sombras.

### Named Rules

**The No-Shadow Rule.** Ningún elemento del sistema proyecta sombra. Si se siente que algo necesita una sombra para definirse, el problema es la jerarquía de color o el contraste tipográfico — no la falta de sombra.

**The 1px Line Rule.** Las líneas de separación son de exactamente 1px, en color `var(--separator)` o `color-mix(in srgb, var(--separator) X%, transparent)` para variantes de opacidad. Nunca más de 1px. Nunca un border con color diferente al separator. La línea divide; no decora.

## 5. Components

### Buttons

Los botones del sistema son directos, sin ornamento. Sin gradientes, sin efectos en el borde. El único radio es 2px — apenas suficiente para no ser sharp absoluto.

- **Shape:** Esquinas casi rectas (2px radius). Nunca pill en botones de acción primaria.
- **Primary** (`.button--primary`): Calibration Blue (#2f78ff) sobre fondo, texto blanco (#ffffff), padding 12px 24px. Hover: Calibration Blue hover (#4a8fff), transición 0.2s.
- **Ghost** (`.button--ghost`): Fondo transparente, borde 1px en separator, texto cream-white. Hover: borde cambia a text color. Nunca fondo visible en reposo.
- **Hover / Focus:** Transiciones en 0.2s con `ease`. Focus ring: 2px solid Calibration Blue, offset 3px. Esto aplica a todos los elementos interactivos del sistema (`--accent` para el outline).
- **No modifiers:** Sin variantes de tamaño — el único sistema de tamaño es el spacing contextual donde se usa.

### Filter Tabs (Underline Markers)

> Corrección de doctrina (jun 2026): el sistema rechazó la forma pill (border-radius 999px). El pill contradecía las reglas del propio sistema — "esquinas casi rectas", "flat por doctrina", "la línea divide, no decora". Los filtros leían como UI de SaaS genérico, especialmente en light mode. El filtro ahora es un **marcador de subrayado**: la misma línea de 1px que define toda la elevación del sistema, aplicada como indicador de estado. Sin fondo, sin cápsula, sin radio.

- **Shape:** Sin caja. Texto plano + un subrayado de 1px que aparece/se afirma. `border-radius: 0`. El único radio permitido aquí es `none`. Padding vertical `0.5rem`, padding horizontal mínimo (`0.1rem`) — el track de filtros es una fila de marcas, no de botones.
- **Default:** Fondo transparente, sin borde superior/laterales, `border-bottom: 1px solid transparent`, texto en `color-mix(text 48%, bg)`. Es metadata en reposo.
- **Hover / Focus:** Texto sube a `color-mix(text 80%, bg)`, el subrayado aparece a `color-mix(text 24%, transparent)`. Anima `color` y `border-bottom-color` en 0.2s `--ease-out`. Sin fondo. Focus-visible añade el outline estándar del sistema (2px accent, offset 3px).
- **Active:** Texto pleno (`var(--text)`), `border-bottom: 1px solid var(--text)` — la marca firme. **Excepción de precisión opcional:** el filtro activo puede subrayarse en `var(--accent)` (Calibration Blue) en lugar de text — esto cuenta como la única aparición de color del viewport y debe respetar la Calibration Rule (≤10%, una vez). Elegir UNA de las dos: text-underline (silencioso) o accent-underline (precision signal). No ambas en distintos filtros.
- **Track:** La fila de filtros se asienta sobre una línea base de 1px separator (border-bottom del contenedor sticky), de modo que los subrayados activos parecen "encender" un segmento de esa línea. Es la doctrina de la línea aplicada como navegación.
- **Label:** Space Mono 0.68rem, uppercase, letter-spacing 0.14em. Los filtros comunican metadata técnica de disciplina, no copy.

### Count Marker (Conteo de casos)

- El conteo de casos (p.ej. `05`) **NUNCA** va en pill ni en caja. Es metadata de set, no un badge.
- **Shape:** Bebas Neue como cifra a media altura junto al eyebrow, separado por una barra `/` o por un espacio en Space Mono. Formato recomendado: `TRABAJO SELECCIONADO` (Space Mono) + separador `—` o `/` de 1px/glifo + `05` en Bebas Neue tamaño ~1.4× el eyebrow, en `color-mix(text 32%, bg)`. Sin borde, sin fondo, sin radio.
- **Lenguaje:** lee como un slate de claqueta (`SCENE 05`), no como un contador de notificaciones.

### Discipline Chips (bajo cada caso)

- Los chips de disciplina bajo cada caso comparten el lenguaje del filtro: sin pill, sin fondo de cápsula.
- **Shape:** `border-radius: 0`. Etiquetas separadas por un divisor de 1px vertical (`·` o un span de 1px), o encerradas en un borde de 1px recto (radius 0, no 999px) si necesitan delimitación. Preferido: lista inline separada por puntos/divisores, en Space Mono, sin caja. Es el strip de metadata de un frame, no una nube de tags.
- **Label:** Space Mono 0.6rem, uppercase, letter-spacing 0.12em, color `color-mix(text 58%, bg)`.

### Cards / Case Frames (Signature Component)

El componente más distintivo del sistema. No es una card con border-radius y sombra — es un frame cinematográfico.

- **Corner Style:** Sin radius (0). El encuadre es recto, como un monitor de edición.
- **Background:** La imagen llena el frame, `object-fit: cover`.
- **Aspect ratio:** 16:9 en desktop, 4:3 en mobile (≤720px).
- **Overlay:** Gradiente de texto al fondo (`linear-gradient(to top, rgba(0,0,0,0.88) 0%, rgba(0,0,0,0.42) 50%, transparent 80%)`). El título y la categoría se imprimen sobre el gradiente en color cream-white.
- **Hover:** La imagen hace scale(1.045) en 0.85s expo.out. El overlay body sube 4px en translateY. Nada más — ningún efecto adicional.
- **Border:** Solo border-top 1px separator entre casos. Sin card border propiamente dicho.

### Showcase Layout — El Ritmo del Carrete (escalabilidad)

La lista de proyectos no es un grid. Es un **carrete editorial con ritmo de montaje**: escala de 5 a 20+ casos sin convertirse en grid uniforme, porque alterna la escala del plano como un editor alterna planos generales y de detalle.

- **Featured (plano general):** los primeros N casos (recomendado 3) ocupan el frame full-width 16:9 — la lista escénica actual. Es el "primer acto".
- **Index / Créditos (planos de detalle):** a partir del caso N+1 el carrete cambia a un **índice de créditos**: filas tipográficas de 1px (índice Bebas + título + cliente + año + disciplinas en Space Mono) sin frame de imagen permanente; al hover, una **preview thumbnail** (16:9 reducido) aparece. Es el "archivo" — denso, escaneable, cinematográfico, no grid.
- **Regla de transición:** el cambio featured→index ocurre por umbral de cantidad, no por ruptura visual brusca: una línea de 1px separator con un slate (`ARCHIVO / 12 CASOS` en Space Mono) marca el corte de acto.
- A 5 casos: 3 featured + 2 en índice (o los 5 featured si se prefiere). A 20 casos: 3 featured + 17 en índice compacto. El scroll nunca se vuelve eterno porque el índice tiene densidad de tabla de créditos.

### Brand Wordmark — Token compartido

El wordmark "MANZANA CUATRO" aparece en tres superficies con métricas idénticas: el brand card del HomeReel, el primer frame del Loader (Grade Reveal) y — heredado — los title-cards de proyecto. **Solo el brand card escala al tamaño imponente; los title-cards de proyecto mantienen la escala display estándar.** El tamaño del wordmark de marca vive en un token compartido `--brand-display-size` (definido en `:root`), consumido por `.home-reel__title-card--brand .home-reel__title` y `.loader__wordmark`. Loader y home deben calzar pixel-perfect: cambiar el token los mueve a ambos en sincronía. Los title-cards de proyecto siguen usando `clamp(4rem, 12vw, 10rem)` — NO el token de marca.

### Navigation

- **Desktop:** 4 columnas en grid, centradas en la pantalla. Brand en Bebas Neue con letter-spacing 0.16em. Links en Inter 0.7rem uppercase, texto text-muted por defecto, text en hover/active.
- **Scrolled state:** `backdrop-filter: blur(10px)` + fondo bg 84% opacidad + border-bottom separator. Transición suave en 0.3s.
- **Home stage:** Cuando el HomeReel está activo, el Nav y la marca cambian a rgba(255,255,255,0.72) sobre el video, con text-shadow para legibilidad.
- **Mobile (≤900px):** Menú hamburguesa 24×18px con 3 barras, animadas en X al abrir. El overlay mobile es bg 95% + backdrop-filter blur(14px). Los links del mobile overlay son en Bebas Neue clamp(2rem, 9vw, 3rem).
- **Theme Dock:** Vertical a la izquierda, rotado -90deg, en Space Mono 0.72rem. Light/Dark como opciones inline.

### TextSwap (Microinteraction Signature)

Los links de navegación usan un swap de caracteres en hover. Dos capas — primary se desliza hacia arriba con blur; secondary sube desde abajo y aparece. Stagger de 24ms por carácter, duración 420ms. Shift de 0.78em. Este efecto es exclusivo del Nav desktop.

## 6. Do's and Don'ts

### Do:

- **Do** usar Void Black (#050505) como fondo base y Cream White (#f5f5f0) como texto — nunca #000 ni #fff.
- **Do** reservar el Calibration Blue para precision signals: focus rings, botones de acción primaria, categorías de proyectos. Máximo una aparición visible por viewport.
- **Do** usar Space Mono para toda metadata técnica: año, cliente, numeración, disciplinas, filtros, theme dock. Es el lenguaje del set, no del copy.
- **Do** mantener la jerarquía tipográfica: Bebas Neue para títulos dramáticos, Inter para cuerpo, Cormorant solo para el momento editorial correcto.
- **Do** separar superficies con líneas de 1px en separator. Es el único mecanismo de elevación permitido.
- **Do** respetar `prefers-reduced-motion` en todos los componentes GSAP. El sistema ya lo implementa — nunca eliminar ese guard.
- **Do** usar `clamp()` para todas las medidas de tipo y spacing que deben ser fluidas. El sistema no tiene breakpoints de tamaño de fuente separados.
- **Do** mantener el aspect-ratio 16:9 (desktop) y 4:3 (mobile) para los case frames. La proporción cinematográfica es parte de la identidad.

### Don't:

- **Don't** usar sombras en ningún componente. Si algo necesita una sombra para definirse, el problema está en la jerarquía de color, no en la falta de efecto.
- **Don't** usar `border-left` o `border-right` mayor a 1px como acento de color en cards, items de lista o callouts. El sistema divide con líneas horizontales, no franjas laterales.
- **Don't** usar `background-clip: text` con gradiente. El único sistema de énfasis tipográfico es peso o tamaño — nunca gradiente de texto.
- **Don't** hacer glassmorphism decorativo. El `backdrop-filter` existe solo en Nav scrolled y mobile overlay, con propósito funcional. No en cards, tooltips ni elementos de contenido.
- **Don't** usar gradientes de color como acento visual. El gradiente del overlay de las case frames es funcional (legibilidad del texto sobre imagen) — no decorativo.
- **Don't** crear grids de cards idénticas: mismo tamaño, mismo icono, mismo heading, mismo texto repetido en loop. El sistema usa listas escénicas (cases) con proporción cinematográfica.
- **Don't** usar morphing blobs, gráficas 3D infladas, gradientes neon ni ninguna estética awwwards-bait que priorice el espectáculo sobre el argumento.
- **Don't** imitar productoras latinoamericanas clásicas: fondos blancos, grid uniforme de fotos, copy corporativo sin punto de vista.
- **Don't** imitar SaaS / tech startup: acento púrpura, hero con CTA grande, testimonios con avatar redondo en grid de cards idénticas.
- **Don't** usar overproduced motion: bounce, elastic, o múltiples animaciones simultáneas que compiten. El sistema usa `expo.out` y tiempos lentos (0.85s para imágenes, 0.3s para UI). Un elemento animado a la vez.
- **Don't** mezclar las voces tipográficas: Bebas Neue no va en body copy, Space Mono no va en títulos de sección, Cormorant no va en metadata técnica.
