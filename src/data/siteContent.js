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
    // Placeholder/demo roster: none of these are confirmed clients yet. Replace
    // with the real roster (and logos) before launch. `logo` (image) is supported
    // per entry; without it the name renders as a monochrome wordmark. This array
    // is shared by StudioClients (logo wall) and HomeClientBand (home ticker).
    { name: 'La Bodega' },
    { name: 'Shibuya' },
    { name: 'Changan Dominicana' },
    { name: 'Farma Extra' },
    { name: 'Porsche Center Santo Domingo' },
    { name: 'Mamey' },
    { name: 'Vértice' },
    { name: 'Aurora' },
    { name: 'Lumen' },
    { name: 'Distrito 27' },
    { name: 'Solera' },
    { name: 'Cibao' },
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
    {
      id: 'production',
      title: 'Producción audiovisual',
      image: portfolioImages[0],
      description: 'Dirigimos y producimos piezas para campañas, redes y marca — de la idea a la entrega.',
      capabilities: ['Dirección y concepto', 'Rodaje multicámara', 'Dirección de arte', 'Entrega multiplataforma'],
    },
    {
      id: 'grading',
      title: 'Colorización',
      image: portfolioImages[2],
      description: 'Look cinematográfico y consistencia de color que eleva cada cuadro.',
      capabilities: ['Color grading creativo', 'Match y consistencia', 'Look de campaña', 'Finishing y entrega'],
    },
    {
      id: 'filming',
      title: 'Filmación',
      image: portfolioImages[1],
      description: 'Captura técnica sólida con sensibilidad visual para cada formato.',
      capabilities: ['Cámara y lentes', 'Iluminación', 'Movimiento y gimbal', 'Set digital'],
    },
    {
      id: 'photo',
      title: 'Fotografía',
      image: portfolioImages[3],
      description: 'Imagen fija con intención comercial para producto, marca y campaña.',
      capabilities: ['Producto y still life', 'Lifestyle y marca', 'Retoque y color', 'Dirección de arte'],
    },
    {
      id: 'content',
      title: 'Creación de contenido',
      image: portfolioImages[4],
      description: 'Contenido pensado para social: rápido, consistente y a la altura de la marca.',
      capabilities: ['Reels y short-form', 'Series de campaña', 'Edición y motion', 'Calendario de entregas'],
    },
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
      tagline: 'Sala de edición con mentalidad de estudio: convertimos marcas en imágenes que se sienten como cine.',
      poster: portfolioImages[4],
      ambientSrc: portfolioPlaceholderVideos[2],
      fullSrc: portfolioPlaceholderVideos[2],
    },
    values: ['Crear', 'Mover', 'Acelerar'],
    valuesAccent: 'Mover',
    // PLACEHOLDER behind-the-scenes photos — swap for real set shots.
    // Only 5 unique placeholder URLs exist (portfolioImages[0..4]); they are
    // interleaved so the same image never lands adjacent, and each carries a
    // `shape` that maps to a CSS aspect-ratio so the repetition reads as a
    // curated wall rather than obvious dupes. Keep the {src, alt, shape} shape
    // when real set photography is swapped in.
    behindScenes: [
      { src: portfolioImages[0], alt: 'Rodaje en set', shape: 'portrait' },
      { src: portfolioImages[2], alt: 'Detrás de cámara', shape: 'square' },
      { src: portfolioImages[4], alt: 'Producción en locación', shape: 'landscape' },
      { src: portfolioImages[1], alt: 'Equipo de filmación', shape: 'tall' },
      { src: portfolioImages[3], alt: 'Iluminación de set', shape: 'square' },
      { src: portfolioImages[0], alt: 'Dirección de arte', shape: 'wide' },
      { src: portfolioImages[2], alt: 'Captura en exteriores', shape: 'portrait' },
      { src: portfolioImages[4], alt: 'Monitoreo de toma', shape: 'square' },
      { src: portfolioImages[1], alt: 'Colorización en estudio', shape: 'landscape' },
      { src: portfolioImages[3], alt: 'Montaje de cámara', shape: 'square' },
      { src: portfolioImages[0], alt: 'Set de iluminación nocturna', shape: 'tall' },
      { src: portfolioImages[2], alt: 'Revisión de encuadre', shape: 'wide' },
      { src: portfolioImages[4], alt: 'Dirección en rodaje', shape: 'portrait' },
      { src: portfolioImages[1], alt: 'Backstage de producción', shape: 'square' },
      { src: portfolioImages[3], alt: 'Detalle de arte de set', shape: 'landscape' },
      { src: portfolioImages[0], alt: 'Composición de plano', shape: 'square' },
      { src: portfolioImages[2], alt: 'Cierre de jornada de rodaje', shape: 'tall' },
    ],
    // PLACEHOLDER testimonials — swap for real quotes/photos/brands.
    testimonials: [
      {
        quote:
          'Trabajar con Manzana Cuatro fue tener un socio que entiende la marca y la eleva: ejecución impecable y una calma creativa que se nota en el resultado.',
        name: 'Nombre Apellido',
        role: 'Marketing Lead',
        brand: 'La Bodega',
        photo: portfolioImages[0],
      },
      {
        quote:
          'Rápidos, precisos y con un estándar visual altísimo. Cada entrega se sintió pensada para nuestra audiencia y para la conversación cultural del momento.',
        name: 'Nombre Apellido',
        role: 'Brand Manager',
        brand: 'Shibuya',
        photo: portfolioImages[1],
      },
      {
        quote:
          'La colorización y el acabado llevaron la campaña a otro nivel. Profesionales de principio a fin; volveríamos a producir con ellos sin dudarlo.',
        name: 'Nombre Apellido',
        role: 'Head of Content',
        brand: 'Changan',
        photo: portfolioImages[2],
      },
    ],
  },
}
