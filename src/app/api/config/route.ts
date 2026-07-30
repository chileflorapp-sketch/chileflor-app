import { NextResponse } from 'next/server';
import { supabaseAdmin as supabase } from '@/lib/supabase-admin';

export const dynamic = 'force-dynamic';

const DEFAULT_CONFIG = {
  fonts: { heading: "Inter", body: "Inter" },
  timings: { heroSliderTransition: 5000, infoSliderTransition: 5000 },
  heroSlider: [
    {
      id: 1,
      title: "La Primavera Llegó a Chileflor",
      subtitle: "Descubre nuestra nueva colección de ramos de temporada con las flores más frescas del país.",
      image: "/slider/slider2.png",
      buttonText: "Ver Colección",
      buttonLink: "/catalogo?cat=Primavera"
    },
    {
      id: 2,
      title: "Amor que Perdura",
      subtitle: "Rosas importadas de calidad premium para esos momentos inolvidables.",
      image: "/slider/slider3.png",
      buttonText: "Ramos de Rosas",
      buttonLink: "/catalogo?cat=Ramos de Rosas"
    },
    {
      id: 3,
      title: "Cuidado Eterno",
      subtitle: "Suscríbete a nuestros planes bimensuales de mantención de cementerios.",
      image: "/slider/slider2.png",
      buttonText: "Ver Planes",
      buttonLink: "/cementerios"
    }
  ],
  infoSlider: [
    {
      id: 1,
      tag: "Mantención",
      title: "Cuidamos tu recuerdo",
      subtitle: "La diferencia entre el olvido y la memoria eterna. Nosotros vamos por ti.",
      media: "/slider/slider1.mp4",
      type: "video",
      primaryLink: "/cementerios",
      primaryText: "Ver Planes",
      secondaryLink: "/catalogo",
      secondaryText: "Catálogo"
    },
    {
      id: 2,
      tag: "Emociones",
      title: "Conecta emociones",
      subtitle: "El instante exacto donde las flores se convierten en el puente entre dos corazones.",
      media: "/slider/slider2.png",
      type: "image",
      primaryLink: "/catalogo",
      primaryText: "Comprar Arreglos",
      secondaryLink: "",
      secondaryText: ""
    },
    {
      id: 3,
      tag: "Innovación",
      title: "Únete al Club Chileflor",
      subtitle: "Acumula puntos con cada compra, obtén descuentos exclusivos y disfruta de beneficios pensados para ti.",
      media: "/slider/slider3.png",
      type: "image",
      primaryLink: "/club",
      primaryText: "Beneficios del Club",
      secondaryLink: "",
      secondaryText: ""
    }
  ],
  experienceBanner: {
    badge: "Conócenos",
    title: "El Arte Detrás de la Belleza",
    description: "Descubre la historia de Chileflor, nuestras anécdotas de taller, datos fascinantes y conoce a las personas que hacen posible cada sonrisa.",
    buttonText: "Descubrir Más ✨",
    buttonLink: "/nosotros"
  },
  subscriptionBanner: {
    badge: "PLAN RECOMENDADO",
    title: "Suscripción Bimensual",
    description: "Despreocúpate. Nuestro equipo visitará la sepultura de tu ser querido dos veces al mes para mantenerla impecable.",
    features: [
      "Limpieza profunda de lápida.",
      "Recambio de flores frescas de temporada.",
      "Evidencia fotográfica enviada a tu celular."
    ],
    priceLabel: "Valor por visita",
    price: "$25.990",
    priceSubtext: "Cobro por visita realizada.",
    buttonText: "Suscribirse Ahora",
    buttonLink: "/cementerios/suscripcion",
    image: "/slider/slider2.png"
  },
  nosotros: {
    hero: {
      badge: "Nuestra Historia",
      title: "La unión de dos legados florales.",
      quote: "Chileflor nace de la colaboración de mentes apasionadas por transformar emociones en arte natural.",
      heroImage: "https://images.unsplash.com/photo-1596160534241-11a546c4ab0a?auto=format&fit=crop&w=2000&q=80"
    },
    fundadores: {
      title: "Nuestros Fundadores",
      text1: "Chileflor no es solo una florería digital, es el resultado de la unión estratégica entre dos grandes pioneros de la industria en Chile: Paco Florería y Florería Los Mellizos.",
      text2: "Al combinar décadas de experiencia, logística especializada y un compromiso inquebrantable con la calidad, logramos ofrecer una experiencia floral y un servicio de mantención de cementerios sin precedentes en la Región Metropolitana.",
      founder1Name: "Paco Florería",
      founder1Role: "Tradición y Excelencia",
      founder1Image: "https://images.unsplash.com/photo-1600861194942-f883de0dfe96?auto=format&fit=crop&w=500&q=80",
      founder2Name: "Los Mellizos",
      founder2Role: "Logística y Vanguardia",
      founder2Image: "https://images.unsplash.com/photo-1563241598-a28a2a8db422?auto=format&fit=crop&w=500&q=80"
    },
    taller: {
      badge: "Historias de Taller",
      title: "El Corazón de Chileflor",
      text1: "Cada mañana en nuestro taller es un concierto de aromas y colores. Desde que recibimos los botones frescos al amanecer, nuestras floristas comienzan el meticuloso trabajo de selección y limpieza.",
      text2: "No es solo unir flores; es una arquitectura de emociones. Aquí, cada cinta anudada y cada tallo cortado cuenta la historia de alguien que quiere decir \"Te quiero\", \"Perdón\" o \"Feliz Cumpleaños\" de la manera más hermosa posible.",
      tallerImage: "https://images.unsplash.com/photo-1595460592965-0222045e05a8?auto=format&fit=crop&w=800&q=80"
    },
    stats: [
      { num: "+50k", text: "Rosas Entregadas" },
      { num: "45m", text: "Armado Promedio" },
      { num: "100%", text: "Flores Frescas" },
      { num: "24/7", text: "Amor en cada ramo" }
    ],
    equipo: [
      { img: "https://images.unsplash.com/photo-1544717301-9cdcb1f5940f?auto=format&fit=crop&w=500&q=80", name: "Carmen", role: "Diseñadora Botánica", desc: "Con más de 15 años de experiencia, Carmen lidera la creación de nuestros ramos más exclusivos." },
      { img: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=500&q=80", name: "Andrea", role: "Especialista en Eventos", desc: "La mente creativa detrás de los montajes para matrimonios y ocasiones especiales." },
      { img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=500&q=80", name: "Roberto", role: "Jefe de Logística", desc: "Asegura que cada arreglo llegue en perfectas condiciones y en el tiempo exacto." }
    ],
    valores: [
      { icon: "🌱", title: "Frescura Garantizada", desc: "Trabajamos con agricultores locales para asegurar que cada flor llegue en su estado más vibrante." },
      { icon: "🚀", title: "Logística de Precisión", desc: "Una flota dedicada para despachos rápidos y cuidadosos en La Florida, Puente Alto y todo Santiago." },
    ]
  },
  colecciones: {
    title: "Nuestras Colecciones",
    subtitle: "Encuentra el arreglo",
    subtitleHighlight: "perfecto para ti",
    items: [
      { emoji: '🌹', name: 'Rosas', sub: 'Clásicas y de temporada', link: '/catalogo?cat=Flores', color: 'from-rose-900 to-rose-700', img: 'https://images.unsplash.com/photo-1561181286-d3fee7d55364?auto=format&fit=crop&w=800&q=80' },
      { emoji: '💐', name: 'Ramos', sub: 'Para toda ocasión', link: '/catalogo?cat=Ramos de Flores', color: 'from-pink-900 to-fuchsia-700', img: 'https://images.unsplash.com/photo-1490750967868-88df5691cc8b?auto=format&fit=crop&w=800&q=80' },
      { emoji: '💒', name: 'Matrimonios', sub: 'Decoración nupcial', link: '/catalogo?cat=Matrimonios', color: 'from-amber-900 to-orange-700', img: 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=800&q=80' },
      { emoji: '🕊️', name: 'Homenajes', sub: 'Con amor y respeto', link: '/catalogo?cat=Homenajes', color: 'from-slate-800 to-slate-600', img: 'https://images.unsplash.com/photo-1509841811836-37dd6b1e5de1?auto=format&fit=crop&w=800&q=80' },
      { emoji: '🎁', name: 'Regalos', sub: 'Sorprende a alguien', link: '/catalogo?cat=Regalos', color: 'from-emerald-900 to-teal-700', img: 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=800&q=80' },
      { emoji: '🌸', name: 'Día Madre', sub: 'Lo mejor para mamá', link: '/catalogo?cat=Día de la Madre', color: 'from-purple-900 to-violet-700', img: 'https://images.unsplash.com/photo-1487530811176-3780de880c2d?auto=format&fit=crop&w=800&q=80' }
    ]
  },
  categorias: [],
  urgencyBar: {
    enabled: true,
    badgeText: "⚡ Entrega hoy disponible",
    countdownText: "Cierre de despacho hoy en:",
    linkText: "Ver disponibles",
    linkUrl: "/catalogo?badge=Entrega+Hoy",
    hours: 5
  },
  quickShortcuts: [
    { icon: '⚡', label: 'Entrega Hoy', link: '/catalogo?badge=Entrega+Hoy', badge: 'Hoy', color: 'bg-yellow-500/10 text-yellow-600 border-yellow-500/30' },
    { icon: '🌹', label: 'Rosas', link: '/catalogo?cat=Flores', badge: '', color: 'bg-rose-500/10 text-rose-600 border-rose-500/30' },
    { icon: '💐', label: 'Ramos', link: '/catalogo?cat=Ramos de Flores', badge: '', color: 'bg-pink-500/10 text-pink-600 border-pink-500/30' },
    { icon: '💌', label: 'Tarjeta QR', link: '/dedicatoria/nueva', badge: 'Nuevo', color: 'bg-fuchsia-500/10 text-fuchsia-600 border-fuchsia-500/30' },
    { icon: '📱', label: 'Escáner QR', link: '/escaner', badge: '', color: 'bg-purple-500/10 text-purple-600 border-purple-500/30' },
    { icon: '🕊️', label: 'Homenajes', link: '/catalogo?cat=Homenajes', badge: '', color: 'bg-slate-500/10 text-slate-600 border-slate-500/30' },
    { icon: '🎁', label: 'Regalos', link: '/catalogo?cat=Regalos', badge: '', color: 'bg-emerald-500/10 text-emerald-600 border-emerald-500/30' },
    { icon: '⛪', label: 'Cementerios', link: '/cementerios', badge: '', color: 'bg-amber-500/10 text-amber-600 border-amber-500/30' }
  ],
  trustTicker: [
    '🌹 +12.000 ramos entregados', '⚡ Entrega el mismo día', '💳 Pago seguro 100%',
    '🌿 Flores frescas garantizadas', '📦 Seguimiento en tiempo real', '❤️ Más de 5.000 clientes felices',
    '🏆 La floristería N°1 de Chile', '🎁 Regalos personalizados con IA', '📸 Evidencia fotográfica en cada entrega'
  ]
};

export async function GET() {
  try {
    const { data, error } = await supabase
      .from('site_config')
      .select('data')
      .eq('id', 'home_config')
      .single();

    if (error || !data?.data) {
      console.error('Error fetching config (fallback will be used):', error?.message);
      return NextResponse.json(DEFAULT_CONFIG);
    }

    const mergedConfig = {
      ...DEFAULT_CONFIG,
      ...data.data,
      fonts: { ...DEFAULT_CONFIG.fonts, ...(data.data.fonts || {}) },
      timings: { ...DEFAULT_CONFIG.timings, ...(data.data.timings || {}) },
      heroSlider: (Array.isArray(data.data.heroSlider) && data.data.heroSlider.length > 0) ? data.data.heroSlider : DEFAULT_CONFIG.heroSlider,
      infoSlider: (Array.isArray(data.data.infoSlider) && data.data.infoSlider.length > 0) ? data.data.infoSlider : DEFAULT_CONFIG.infoSlider,
      experienceBanner: { ...DEFAULT_CONFIG.experienceBanner, ...(data.data.experienceBanner || {}) },
      subscriptionBanner: { ...DEFAULT_CONFIG.subscriptionBanner, ...(data.data.subscriptionBanner || {}) },
      nosotros: {
        ...DEFAULT_CONFIG.nosotros,
        ...(data.data.nosotros || {}),
        hero: { ...DEFAULT_CONFIG.nosotros.hero, ...(data.data.nosotros?.hero || {}) },
        fundadores: { ...DEFAULT_CONFIG.nosotros.fundadores, ...(data.data.nosotros?.fundadores || {}) },
        taller: { ...DEFAULT_CONFIG.nosotros.taller, ...(data.data.nosotros?.taller || {}) },
        stats: (Array.isArray(data.data.nosotros?.stats) && data.data.nosotros.stats.length > 0) ? data.data.nosotros.stats : DEFAULT_CONFIG.nosotros.stats,
        equipo: (Array.isArray(data.data.nosotros?.equipo) && data.data.nosotros.equipo.length > 0) ? data.data.nosotros.equipo : DEFAULT_CONFIG.nosotros.equipo,
        valores: (Array.isArray(data.data.nosotros?.valores) && data.data.nosotros.valores.length > 0) ? data.data.nosotros.valores : DEFAULT_CONFIG.nosotros.valores,
      },
      categorias: (Array.isArray(data.data.categorias) && data.data.categorias.length > 0) ? data.data.categorias : DEFAULT_CONFIG.categorias,
      urgencyBar: { ...DEFAULT_CONFIG.urgencyBar, ...(data.data.urgencyBar || {}) },
      quickShortcuts: (Array.isArray(data.data.quickShortcuts) && data.data.quickShortcuts.length > 0) ? data.data.quickShortcuts : DEFAULT_CONFIG.quickShortcuts,
      trustTicker: (Array.isArray(data.data.trustTicker) && data.data.trustTicker.length > 0) ? data.data.trustTicker : DEFAULT_CONFIG.trustTicker,
      colecciones: {
        ...DEFAULT_CONFIG.colecciones,
        ...(data.data.colecciones || {}),
        items: (Array.isArray(data.data.colecciones?.items) && data.data.colecciones.items.length > 0) ? data.data.colecciones.items : DEFAULT_CONFIG.colecciones.items
      },
    };

    return NextResponse.json(mergedConfig);
  } catch (error) {
    console.error('Server error fetching config:', error);
    return NextResponse.json(DEFAULT_CONFIG);
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    
    // Usar upsert para insertar o actualizar según corresponda
    const { error } = await supabase
      .from('site_config')
      .upsert({ id: 'home_config', data: body, updated_at: new Date().toISOString() });

    if (error) {
      console.error('Error updating config:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Server error updating config:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
