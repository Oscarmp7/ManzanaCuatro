# Manzana Cuatro

Sitio portfolio de Manzana Cuatro construido con `React`, `Vite`, `React Router` y transiciones basadas en `GSAP`.

## Scripts

- `npm run dev`: servidor local de desarrollo.
- `npm test`: suite de checks del repo.
- `npm run lint`: validación de ESLint.
- `npm run build`: build de producción más generación de HTML estático por ruta para SEO y deep links.

## Deploy

- `Vercel` (único target): el build produce HTML por ruta (`/`, `/proyectos`, `/studio`, `/contacto` y detalles de proyecto) para que los previews sociales y las rutas directas no dependan de mutaciones de metadatos en cliente.

## Notas Técnicas

- La home usa `GSAP ScrollTrigger` para la secuencia principal: reel de proyectos, stage de colorización y galería fullscreen.
- El loader es un "grade reveal": el title-card de la home en estado log que se coloriza en vivo antes de abrir la escena.
- El build postprocesa `dist/index.html` para emitir metadatos canónicos y JSON-LD por ruta.
- El proyecto prioriza una visual desktop fuerte sin sacrificar mobile ni crawlers.
