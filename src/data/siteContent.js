const portfolioImages = [
  'https://wol7zpzfeh2wdhnp.public.blob.vercel-storage.com/briefs/1773101803911-Screenshot%202026-03-09%20at%208.16.27%E2%80%AFPM.png',
  'https://wol7zpzfeh2wdhnp.public.blob.vercel-storage.com/briefs/1773101803882-Screenshot%202026-03-09%20at%208.16.04%E2%80%AFPM.png',
  'https://wol7zpzfeh2wdhnp.public.blob.vercel-storage.com/briefs/1773101803886-Screenshot%202026-03-09%20at%208.15.30%E2%80%AFPM.png',
  'https://wol7zpzfeh2wdhnp.public.blob.vercel-storage.com/briefs/1773101803868-Screenshot%202026-03-09%20at%208.14.46%E2%80%AFPM.png',
  'https://wol7zpzfeh2wdhnp.public.blob.vercel-storage.com/briefs/1773101803929-Screenshot%202026-03-09%20at%208.14.35%E2%80%AFPM.png',
]

const portfolioPlaceholderVideos = [
  'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4',
  'https://filesamples.com/samples/video/mp4/sample_960x400_ocean_with_audio.mp4',
  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
  'https://download.samplelib.com/mp4/sample-10s.mp4',
]

export const showcaseProjects = [
  {
    slug: 'la-bodega-dia-de-los-padres',
    title: 'La Bodega Día de los Padres',
    client: 'La Bodega',
    category: 'Campaña estacional',
    year: '2025',
    poster: portfolioImages[0],
    video: portfolioPlaceholderVideos[0],
    disciplines: ['production', 'color', 'content'],
    summary:
      'Una campaña pensada para conectar emoción, producto y recordación en una pieza social con acabado cinematográfico.',
    scope: ['Producción audiovisual', 'Filmación', 'Colorización'],
    details: [
      'Dirección visual enfocada en cercanía y valor de marca.',
      'Ritmo de edición pensado para redes y formatos publicitarios.',
      'Entrega final optimizada para difusión digital.',
    ],
  },
  {
    slug: 'shibuya-casa-de-campo',
    title: 'Shibuya Casa de Campo',
    client: 'Shibuya',
    category: 'Hospitality / lifestyle',
    year: '2025',
    poster: portfolioImages[1],
    video: portfolioPlaceholderVideos[1],
    disciplines: ['photo', 'content'],
    summary:
      'Contenido audiovisual premium para traducir atmósfera, diseño y experiencia en una presencia visual más aspiracional.',
    scope: ['Fotografía', 'Filmación', 'Creación de contenido'],
    details: [
      'Tratamiento visual limpio con intención comercial.',
      'Captura de espacios y experiencia de marca.',
      'Piezas pensadas para campañas, reels y posicionamiento.',
    ],
  },
  {
    slug: 'changan-dominicana',
    title: 'Changan Dominicana',
    client: 'Changan Dominicana',
    category: 'Automotriz',
    year: '2025',
    poster: portfolioImages[2],
    video: portfolioPlaceholderVideos[2],
    disciplines: ['production', 'content'],
    summary:
      'Producción de contenido para una marca automotriz que exige presencia, energía y ejecución técnica sólida.',
    scope: ['Producción audiovisual', 'Filmación', 'Creación de contenido'],
    details: [
      'Composición pensada para transmitir potencia y modernidad.',
      'Visuales diseñados para campañas de marca y medios digitales.',
      'Acabado consistente con una imagen comercial premium.',
    ],
  },
  {
    slug: 'farma-extra',
    title: 'Farma Extra',
    client: 'Farma Extra',
    category: 'Retail / salud',
    year: '2024',
    poster: portfolioImages[3],
    video: portfolioPlaceholderVideos[3],
    disciplines: ['production', 'photo', 'content'],
    summary:
      'Piezas claras y actuales para comunicar confianza, dinamismo y cercanía en el punto exacto entre utilidad y marca.',
    scope: ['Producción audiovisual', 'Fotografía', 'Creación de contenido'],
    details: [
      'Lenguaje visual accesible sin perder pulido.',
      'Contenido adaptable para campañas y redes sociales.',
      'Producción enfocada en claridad del mensaje y presencia visual.',
    ],
  },
  {
    slug: 'porsche-center-santo-domingo',
    title: 'Porsche Center Santo Domingo',
    client: 'Porsche Center Santo Domingo',
    category: 'Luxury automotive',
    year: '2025',
    poster: portfolioImages[4],
    disciplines: ['color', 'photo'],
    summary:
      'Una dirección visual más sobria y precisa para una marca que demanda detalle, carácter y una ejecución impecable.',
    scope: ['Filmación', 'Colorización', 'Fotografía'],
    details: [
      'Tratamiento premium con énfasis en textura, forma y presencia.',
      'Narrativa visual enfocada en sofisticación y performance.',
      'Postproducción calibrada para una imagen de alto nivel.',
    ],
  },
]

export const siteContent = {
  brand: {
    name: 'Manzana Cuatro',
    location: 'Santo Domingo, República Dominicana',
    email: 'info@manzanacuatro.com',
    whatsappHref: 'https://wa.me/18498633817',
    instagramHref: 'https://instagram.com/manzanacuatro',
    instagramLabel: '@manzanacuatro',
    domain: 'manzanacuatro.com',
  },
  nav: [
    { label: 'Proyectos', href: '/proyectos' },
    { label: 'Estudio', href: '/studio' },
    { label: 'Contacto', href: '/contacto' },
  ],
  clients: [
    { name: 'La Bodega' },
    { name: 'Shibuya' },
    { name: 'Changan Dominicana' },
    { name: 'Farma Extra' },
    { name: 'Porsche Center Santo Domingo' },
  ],
  hero: {
    eyebrow: 'Producción audiovisual / RD',
    title: 'IMPACTO VISUAL CON VISIÓN DE MARCA.',
    text:
      'Creamos piezas audiovisuales para campañas, redes sociales y marcas que necesitan verse a la altura de lo que están construyendo.',
    primaryCta: { label: 'Ver portafolio', href: '/proyectos' },
    availability: 'Disponible para campañas, contenido social y producción comercial.',
  },
  projectsPage: {
    eyebrow: 'Trabajo seleccionado',
    title: 'Casos construidos para que la marca se vea a la altura de su ambición.',
    filters: [
      { id: 'all', label: 'Todos' },
      { id: 'production', label: 'Producción' },
      { id: 'color', label: 'Colorización' },
      { id: 'photo', label: 'Fotografía' },
      { id: 'content', label: 'Contenido' },
    ],
  },
  about: {
    eyebrow: 'Estudio',
    title: 'Pasión por elevar marcas a través de los audiovisuales.',
    text:
      'Manzana Cuatro trabaja como aliado audiovisual para agencias, empresas, creadores y marcas que necesitan una producción cuidada, moderna y confiable sin pasar por estructuras pesadas.',
    image:
      'https://wol7zpzfeh2wdhnp.public.blob.vercel-storage.com/briefs/1773102078593-white.jpg',
    highlights: [
      'Contenido pensado para campañas y redes sociales.',
      'Ejecución ágil con estándar visual premium.',
      'Un partner audiovisual local con mentalidad de estudio.',
    ],
  },
  stats: [
    { value: '10', suffix: ' años', label: 'de experiencia' },
    { value: '300', suffix: ' proyectos', label: 'producidos' },
    { value: '1', suffix: ' país', label: 'base de operaciones' },
  ],
  services: [
    { id: 'production', title: 'Producción audiovisual' },
    { id: 'grading', title: 'Colorización' },
    { id: 'filming', title: 'Filmación' },
    { id: 'photo', title: 'Fotografía' },
    { id: 'content', title: 'Creación de contenido' },
  ],
  servicesSection: {
    eyebrow: 'Servicios',
    title: 'Capacidad de estudio para campañas que necesitan nivel.',
    cta: { label: 'Solicita una cotización ahora', href: 'https://wa.me/18498633817' },
  },
  colorization: {
    title: 'Colorización',
    cases: [
      {
        title: 'Beauty / retail grade',
        client: 'Maison Vale',
        category: 'Retail social',
        year: '2025',
        tags: ['Colorización', 'Retail', 'Vertical'],
        media: portfolioPlaceholderVideos[0],
        poster: portfolioImages[0],
        isVideo: true,
      },
      {
        title: 'Hospitality look pass',
        client: 'Shibuya Casa de Campo',
        category: 'Hospitality reel',
        year: '2025',
        tags: ['Finishing', 'Hospitality', 'Campaign'],
        media: portfolioPlaceholderVideos[1],
        poster: portfolioImages[1],
        isVideo: true,
      },
      {
        title: 'Automotive finishing',
        client: 'Changan Dominicana',
        category: 'Launch spot',
        year: '2025',
        tags: ['Colorización', 'Automotive', 'Commercial'],
        media: portfolioPlaceholderVideos[2],
        poster: portfolioImages[2],
        isVideo: true,
      },
    ],
  },
  contact: {
    eyebrow: 'Contacto',
    title: 'Comienza tu historia',
    text:
      'Si tienes una campaña, una idea o una marca que necesita una ejecución visual más fuerte, conversemos por la vía más directa.',
    primaryCta: { label: 'Escríbenos por WhatsApp', href: 'https://wa.me/18498633817' },
  },

  // Studio page (/studio). PLACEHOLDER media — swap reel/poster for the real
  // ones when available (ambientSrc = muted loop bg; fullSrc = reel with audio).
  studio: {
    reel: {
      eyebrow: 'Showreel 2026',
      tagline: 'Sala de edición con mentalidad de estudio: convertimos marcas en imágenes que se sienten como cine.',
      poster: portfolioImages[4],
      ambientSrc: portfolioPlaceholderVideos[2],
      fullSrc: portfolioPlaceholderVideos[2],
    },
    values: ['Crear', 'Mover', 'Acelerar'],
    valuesAccent: 'Mover',
  },
}
