# Repo Stabilization Design

## Goal

Corregir los problemas reales del repo `jeremy-adonai` en SEO, performance, responsive, deploy y resiliencia sin degradar la dirección visual desktop actual.

## Constraints

- Mantener la estética existente como baseline.
- Limitar cambios visibles a estados ya defectuosos, especialmente mobile/tablet.
- No mezclar este trabajo con los artefactos previos de `.full-review/`.
- Preferir soluciones locales al repo antes que añadir dependencias nuevas.

## Approach Options

### Option A: Big-bang fix

Arreglar todo en una sola pasada sin separar capas técnicas y visuales.

- Ventaja: menos overhead de coordinación.
- Desventaja: difícil aislar regresiones y demasiado riesgo para la visual.

### Option B: Stabilization by layers

Separar el trabajo en capas: runtime/SEO/deploy, luego performance, luego responsive, luego cleanup/testing.

- Ventaja: reduce riesgo, facilita verificación y conserva la visual.
- Desventaja: requiere más disciplina de implementación.

### Option C: Visual redesign + fixes

Rehacer partes visuales mientras se corrigen problemas técnicos.

- Ventaja: permite rehacer patrones débiles.
- Desventaja: cambia demasiado el producto y no responde al objetivo actual.

## Recommendation

Usar **Option B**.

La prioridad será:

1. Blindar runtime, rutas, metadata inicial y deploy.
2. Reducir la carga innecesaria de media y trabajo por frame.
3. Corregir responsive en mobile/tablet solo donde hoy falla.
4. Cerrar con cleanup y validación.

## Design

### Runtime, SEO and Deploy

- Añadir una capa de tolerancia a `localStorage` y `prefers-reduced-motion`.
- Envolver la app con un `ErrorBoundary`.
- Mantener `RouteMeta` para navegación cliente, pero generar HTML por ruta en build para que las metas existan antes de hidratar.
- Alinear GitHub Pages con el `base` correcto y añadir `vercel.json` solo con headers útiles, sin romper rutas reales generadas.

### Performance

- Dejar de montar toda la media pesada del home al cargar.
- Renderizar solo los videos imprescindibles al principio y activar el resto por etapa.
- Cachear mediciones del `HomeReel` fuera del loop de scroll.
- Eliminar peso muerto del pipeline CSS si no aporta a la UI actual.

### Responsive

- Corregir las combinaciones que hoy rompen mobile/tablet: sticky horizontal filters, overlays fuera de viewport y labels inconsistentes.
- Mantener desktop intacto salvo correcciones de bugs evidentes como el offset del detail page.

### Testing and Verification

- Reforzar los tests que sí podemos cubrir con `node:test`.
- Verificar cada fase con `npm run lint`, `npm test` y `npm run build`.

## Expected Outcome

El sitio debe quedar con el mismo lenguaje visual general, mejorando:

- metadata por ruta y previews sociales,
- robustez ante fallos de runtime,
- peso inicial y suavidad del home,
- responsive en mobile/tablet,
- consistencia del deploy.
