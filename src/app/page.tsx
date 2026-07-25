'use client';
import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import HeroSlider from '@/components/HeroSlider';
import SubscriptionBanner from '@/components/SubscriptionBanner';
import { Loader2, ShoppingBag, Star, ArrowRight, Truck, Shield, Clock, Sparkles, Heart, ChevronRight } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';

// ── Hook de reveal on scroll ──
function useReveal() {
  useEffect(() => {
    const els = document.querySelectorAll('.reveal');
    const observer = new IntersectionObserver(
      (entries) => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('active'); }),
      { threshold: 0.1 }
    );
    els.forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, []);
}

// ── Componente: Ticker de confianza ──
function TrustTicker() {
  const items = [
    '🌹 +12.000 ramos entregados', '⚡ Entrega el mismo día', '💳 Pago seguro 100%',
    '🌿 Flores frescas garantizadas', '📦 Seguimiento en tiempo real', '❤️ Más de 5.000 clientes felices',
    '🏆 La floristería N°1 de Chile', '🎁 Regalos personalizados con IA', '📸 Evidencia fotográfica en cada entrega',
  ];
  const doubled = [...items, ...items];

  return (
    <div className="bg-gray-900 text-white py-3 overflow-hidden border-y border-gray-800 relative z-20">
      <div className="flex gap-12 animate-ticker whitespace-nowrap">
        {doubled.map((item, i) => (
          <span key={i} className="text-sm font-medium text-gray-300 shrink-0 flex items-center gap-2">
            {item}
            <span className="text-primary mx-4 opacity-40">•</span>
          </span>
        ))}
      </div>
    </div>
  );
}

// ── Componente: Categorías visuales ──
const CATS = [
  { emoji: '🌹', name: 'Rosas', sub: 'Clásicas y de temporada', link: '/catalogo?cat=Flores', color: 'from-rose-900 to-rose-700', img: 'https://images.unsplash.com/photo-1561181286-d3fee7d55364?auto=format&fit=crop&w=800&q=80' },
  { emoji: '💐', name: 'Ramos', sub: 'Para toda ocasión', link: '/catalogo?cat=Ramos de Flores', color: 'from-pink-900 to-fuchsia-700', img: 'https://images.unsplash.com/photo-1490750967868-88df5691cc8b?auto=format&fit=crop&w=800&q=80' },
  { emoji: '💒', name: 'Matrimonios', sub: 'Decoración nupcial', link: '/catalogo?cat=Matrimonios', color: 'from-amber-900 to-orange-700', img: 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=800&q=80' },
  { emoji: '🕊️', name: 'Homenajes', sub: 'Con amor y respeto', link: '/catalogo?cat=Homenajes', color: 'from-slate-800 to-slate-600', img: 'https://images.unsplash.com/photo-1509841811836-37dd6b1e5de1?auto=format&fit=crop&w=800&q=80' },
  { emoji: '🎁', name: 'Regalos', sub: 'Sorprende a alguien', link: '/catalogo?cat=Regalos', color: 'from-emerald-900 to-teal-700', img: 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=800&q=80' },
  { emoji: '🌸', name: 'Día Madre', sub: 'Lo mejor para mamá', link: '/catalogo?cat=Día de la Madre', color: 'from-purple-900 to-violet-700', img: 'https://images.unsplash.com/photo-1487530811176-3780de880c2d?auto=format&fit=crop&w=800&q=80' },
];

function CategoryGrid() {
  return (
    <section className="container mx-auto px-4 py-16 reveal">
      <div className="text-center mb-12">
        <p className="text-primary text-sm font-bold uppercase tracking-[0.3em] mb-3">Nuestras Colecciones</p>
        <h2 className="text-3xl md:text-5xl font-bold text-gray-900 leading-tight">
          Encuentra el arreglo <br className="hidden md:block" />
          <span className="bg-gradient-to-r from-primary via-pink-500 to-rose-400 bg-clip-text text-transparent animate-text-shimmer">perfecto para ti</span>
        </h2>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
        {CATS.map((cat, i) => (
          <a key={i} href={cat.link} className="cat-card group relative rounded-3xl overflow-hidden aspect-[3/4] block shadow-lg">
            {/* Imagen fija de fondo */}
            <div className="absolute inset-0">
              <img src={cat.img} alt={cat.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
              <div className={`absolute inset-0 bg-gradient-to-t ${cat.color} opacity-70 group-hover:opacity-60 transition-opacity duration-500`} />
            </div>
            {/* Contenido */}
            <div className="absolute inset-0 flex flex-col justify-end p-5 md:p-7">
              <div className="text-3xl md:text-4xl mb-2 group-hover:scale-110 transition-transform duration-300 drop-shadow-lg">{cat.emoji}</div>
              <h3 className="text-white font-bold text-xl md:text-2xl drop-shadow-lg">{cat.name}</h3>
              <p className="text-white/70 text-sm mt-1 drop-shadow">{cat.sub}</p>
              <div className="mt-4 flex items-center gap-2 text-white/80 text-sm font-semibold opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-400">
                Explorar <ChevronRight className="w-4 h-4" />
              </div>
            </div>
          </a>
        ))}
      </div>
    </section>
  );
}

// ── Componente: Por qué Chileflor ──
function WhyChileflor() {
  const perks = [
    {
      icon: <Truck className="w-7 h-7" />,
      title: 'Entrega el mismo día',
      desc: 'Pedidos antes de las 14:00 se entregan ese mismo día dentro de Santiago.',
      color: 'from-blue-500 to-cyan-500',
      bg: 'bg-blue-50',
      ring: 'ring-blue-100',
    },
    {
      icon: <Shield className="w-7 h-7" />,
      title: 'Frescura garantizada',
      desc: 'Todas nuestras flores tienen garantía de frescura por 7 días o te la reponemos.',
      color: 'from-emerald-500 to-green-500',
      bg: 'bg-emerald-50',
      ring: 'ring-emerald-100',
    },
    {
      icon: <Sparkles className="w-7 h-7" />,
      title: 'Diseño personalizado',
      desc: 'Escríbenos por WhatsApp y nuestros floristas crean el arreglo de tus sueños.',
      color: 'from-purple-500 to-fuchsia-500',
      bg: 'bg-purple-50',
      ring: 'ring-purple-100',
    },
    {
      icon: <Clock className="w-7 h-7" />,
      title: 'Seguimiento en vivo',
      desc: 'Sigue tu pedido en tiempo real desde el momento en que sale de nuestra tienda.',
      color: 'from-orange-500 to-amber-500',
      bg: 'bg-orange-50',
      ring: 'ring-orange-100',
    },
  ];

  return (
    <section className="bg-gradient-to-b from-gray-50 to-white py-20 md:py-28 reveal">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <p className="text-primary text-sm font-bold uppercase tracking-[0.3em] mb-3">¿Por qué elegirnos?</p>
          <h2 className="text-3xl md:text-5xl font-bold text-gray-900">
            La diferencia <span className="text-primary">Chileflor</span>
          </h2>
          <p className="text-gray-500 mt-4 text-lg max-w-2xl mx-auto">
            Más que flores, entregamos experiencias memorables con el nivel de servicio que mereces.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {perks.map((p, i) => (
            <div key={i} className={`group relative p-8 rounded-3xl ${p.bg} ring-1 ${p.ring} hover:ring-2 hover:shadow-xl transition-all duration-500 hover:-translate-y-2`}>
              {/* Icono con gradiente */}
              <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${p.color} flex items-center justify-center text-white mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                {p.icon}
              </div>
              <h3 className="font-bold text-gray-900 text-lg mb-3">{p.title}</h3>
              <p className="text-gray-500 text-sm leading-relaxed">{p.desc}</p>
              {/* Número decorativo de fondo */}
              <span className="absolute top-6 right-6 text-6xl font-black text-black/5 select-none leading-none">
                {String(i + 1).padStart(2, '0')}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── Componente: Estadísticas animadas ──
function StatsBar() {
  const stats = [
    { value: '12.000+', label: 'Pedidos entregados', icon: '📦' },
    { value: '5.000+', label: 'Clientes felices', icon: '❤️' },
    { value: '98%', label: 'Satisfacción', icon: '⭐' },
    { value: '+7 años', label: 'En el mercado', icon: '🏆' },
  ];

  return (
    <div className="bg-gray-900 py-16 relative overflow-hidden reveal">
      {/* Blobs decorativos */}
      <div className="absolute -top-20 -left-20 w-64 h-64 bg-primary/20 rounded-full blur-3xl animate-blob" />
      <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-pink-500/10 rounded-full blur-3xl animate-blob" style={{animationDelay:'3s'}} />

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12">
          {stats.map((s, i) => (
            <div key={i} className="text-center group">
              <div className="text-4xl mb-3 group-hover:scale-125 transition-transform duration-300">{s.icon}</div>
              <div className="text-4xl md:text-5xl font-black text-white tracking-tighter mb-2">
                {s.value}
              </div>
              <p className="text-gray-400 text-sm font-medium uppercase tracking-widest">{s.label}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Componente: Testimonios premium ──
function Testimonials() {
  const reviews = [
    {
      name: 'María González', role: 'Cliente frecuente', rating: 5,
      text: 'Los arreglos son hermosos y llegaron a tiempo. Mi mamá quedó encantada con las flores por su cumpleaños.',
      date: 'Julio 2025', avatar: 'M', color: 'bg-rose-500',
    },
    {
      name: 'Juan Pérez', role: 'Primera compra', rating: 5,
      text: 'Excelente servicio. La calidad de las rosas es impresionante, duraron mucho tiempo. 100% recomendados.',
      date: 'Junio 2025', avatar: 'J', color: 'bg-blue-500',
    },
    {
      name: 'Camila Rojas', role: 'Miembro Club VIP', rating: 5,
      text: 'Muy amables en la atención y el proceso de compra es muy fácil. Las flores llegaron frescas y hermosas.',
      date: 'Mayo 2025', avatar: 'C', color: 'bg-purple-500',
    },
  ];

  return (
    <section className="py-20 md:py-28 bg-gradient-to-br from-rose-50 via-white to-pink-50 relative overflow-hidden reveal">
      {/* Decoración */}
      <div className="absolute top-0 left-0 w-72 h-72 bg-primary/5 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-pink-400/5 rounded-full blur-3xl translate-x-1/3 translate-y-1/3" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-14">
          <p className="text-primary text-sm font-bold uppercase tracking-[0.3em] mb-3">Testimonios</p>
          <h2 className="text-3xl md:text-5xl font-bold text-gray-900">Lo que dicen nuestros clientes</h2>
          <div className="flex items-center justify-center gap-2 mt-4">
            {[1,2,3,4,5].map(i => <Star key={i} className="w-5 h-5 text-yellow-400 fill-yellow-400" />)}
            <span className="text-gray-500 text-sm ml-2">4.9/5 basado en +500 reseñas</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {reviews.map((r, i) => (
            <div key={i} className="group bg-white rounded-3xl p-8 shadow-md hover:shadow-2xl border border-gray-100 hover:border-primary/20 transition-all duration-500 hover:-translate-y-2 relative overflow-hidden">
              {/* Quote decoration */}
              <div className="absolute top-6 right-8 text-8xl text-primary/5 font-serif leading-none select-none">"</div>

              <div className="flex gap-1 mb-5">
                {Array(r.rating).fill(0).map((_, j) => (
                  <Star key={j} className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                ))}
              </div>
              <p className="text-gray-700 leading-relaxed mb-6 relative z-10">"{r.text}"</p>
              <div className="flex items-center gap-3 mt-auto">
                <div className={`w-10 h-10 rounded-full ${r.color} text-white flex items-center justify-center font-bold text-sm flex-shrink-0`}>
                  {r.avatar}
                </div>
                <div>
                  <p className="font-bold text-gray-900 text-sm">{r.name}</p>
                  <p className="text-gray-400 text-xs">{r.role} · {r.date}</p>
                </div>
                <div className="ml-auto">
                  <span className="text-[10px] font-bold bg-green-100 text-green-700 px-2 py-1 rounded-full">✓ Verificado</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── Componente: Newsletter banner ──
function NewsletterBanner() {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);

  return (
    <section className="container mx-auto px-4 py-8 reveal">
      <div className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-primary via-rose-500 to-pink-600 p-10 md:p-16 text-white shadow-2xl">
        {/* Blobs */}
        <div className="absolute -top-16 -left-16 w-64 h-64 bg-white/10 rounded-full blur-3xl animate-blob" />
        <div className="absolute -bottom-16 -right-16 w-80 h-80 bg-white/5 rounded-full blur-3xl animate-blob" style={{animationDelay:'4s'}} />

        <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-10">
          <div className="text-center lg:text-left max-w-lg">
            <div className="inline-block bg-white/20 backdrop-blur px-4 py-1.5 rounded-full text-sm font-bold mb-4 border border-white/20">
              🎁 Oferta exclusiva para nuevos suscriptores
            </div>
            <h2 className="text-3xl md:text-4xl font-bold leading-tight mb-3">
              Obtén <span className="underline decoration-white/50 underline-offset-4">10% de descuento</span> en tu primera compra
            </h2>
            <p className="text-white/80 text-lg">Suscríbete y recibe ofertas exclusivas, inspiración floral y acceso a lanzamientos de temporada.</p>
          </div>
          <div className="w-full lg:w-auto flex flex-col gap-3 min-w-[320px]">
            {sent ? (
              <div className="bg-white/20 backdrop-blur rounded-2xl p-6 text-center border border-white/30">
                <div className="text-4xl mb-2">🎉</div>
                <p className="font-bold text-lg">¡Listo! Te enviamos tu código al correo.</p>
              </div>
            ) : (
              <>
                <input
                  type="email"
                  placeholder="tu@correo.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="w-full px-6 py-4 rounded-2xl bg-white/20 backdrop-blur border border-white/30 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/50 text-base font-medium"
                />
                <button
                  onClick={() => { if (email) setSent(true); }}
                  className="w-full bg-white text-primary font-bold py-4 rounded-2xl hover:bg-gray-50 transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-0.5 text-base"
                >
                  Quiero mi 10% de descuento →
                </button>
                <p className="text-white/60 text-xs text-center">Sin spam. Puedes darte de baja cuando quieras.</p>
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

// ── Componente: Quick App Actions (Accesos Rápidos Estilo App) ──
const APP_SHORTCUTS = [
  { icon: '⚡', label: 'Entrega Hoy', link: '/catalogo?badge=Entrega+Hoy', badge: 'Hoy', color: 'bg-yellow-500/10 text-yellow-600 border-yellow-500/30' },
  { icon: '🌹', label: 'Rosas', link: '/catalogo?cat=Flores', color: 'bg-rose-500/10 text-rose-600 border-rose-500/30' },
  { icon: '💐', label: 'Ramos', link: '/catalogo?cat=Ramos de Flores', color: 'bg-pink-500/10 text-pink-600 border-pink-500/30' },
  { icon: '💌', label: 'Tarjeta QR', link: '/dedicatoria/nueva', badge: 'Nuevo', color: 'bg-fuchsia-500/10 text-fuchsia-600 border-fuchsia-500/30' },
  { icon: '📱', label: 'Escáner QR', link: '/escaner', color: 'bg-purple-500/10 text-purple-600 border-purple-500/30' },
  { icon: '🕊️', label: 'Homenajes', link: '/catalogo?cat=Homenajes', color: 'bg-slate-500/10 text-slate-600 border-slate-500/30' },
  { icon: '🎁', label: 'Regalos', link: '/catalogo?cat=Regalos', color: 'bg-emerald-500/10 text-emerald-600 border-emerald-500/30' },
  { icon: '⛪', label: 'Cementerios', link: '/cementerios', color: 'bg-amber-500/10 text-amber-600 border-amber-500/30' },
];

function QuickAppActions() {
  return (
    <section className="bg-white py-6 border-b border-gray-100 shadow-sm sticky top-[56px] md:top-[72px] z-40 backdrop-blur-md bg-white/90">
      <div className="container mx-auto px-4">
        <div className="flex gap-3 overflow-x-auto no-scrollbar pb-1 snap-x">
          {APP_SHORTCUTS.map((item, i) => (
            <a
              key={i}
              href={item.link}
              className={`shrink-0 snap-start flex items-center gap-2.5 px-4 py-2.5 rounded-2xl border ${item.color} font-bold text-xs md:text-sm hover:scale-105 active:scale-95 transition-all shadow-xs relative group`}
            >
              <span className="text-base">{item.icon}</span>
              <span>{item.label}</span>
              {item.badge && (
                <span className="text-[9px] bg-primary text-white font-extrabold uppercase px-1.5 py-0.5 rounded-full leading-none shadow-xs">
                  {item.badge}
                </span>
              )}
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── Componente: Producto card premium (Optimizado para Touch/Móvil) ──
function ProductCard({ item, addToCart, toggleWishlist, isInWishlist }: any) {
  const [wishActive, setWishActive] = useState(false);
  const [added, setAdded] = useState(false);

  const handleWish = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setWishActive(!wishActive);
    toggleWishlist?.(item);
  };

  const handleAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart({
      id: parseInt(item.id.replace('p-', '')),
      name: item.nombre,
      price: item.precio_base,
      image: item.imagen,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  return (
    <a href={`/catalogo/${item.id}`} className="group flex flex-col bg-white rounded-3xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-xl transition-all duration-300 relative">
      <div className="aspect-[4/5] relative overflow-hidden bg-gray-50">
        <Image
          src={item.imagen}
          alt={item.nombre}
          fill
          sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
          quality={85}
          className="object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
        />

        {/* Badge */}
        {item.badge && (
          <div className="absolute top-2.5 left-2.5 z-10">
            <span className={`text-[9px] md:text-[10px] font-extrabold uppercase tracking-widest px-2.5 py-1 rounded-full shadow-md ${
              item.badge.includes('Entrega Hoy') ? 'bg-yellow-400 text-yellow-950' :
              item.badge.includes('Premium') ? 'bg-gray-900 text-yellow-400' :
              'bg-primary text-white'
            }`}>
              {item.badge}
            </span>
          </div>
        )}

        {/* Wishlist button */}
        <button 
          onClick={handleWish} 
          className="absolute top-2.5 right-2.5 z-10 w-8 h-8 md:w-9 md:h-9 bg-white/90 backdrop-blur-md rounded-full flex items-center justify-center shadow-md hover:scale-110 active:scale-90 transition-transform"
          aria-label="Guardar en favoritos"
        >
          <Heart className={`w-4 h-4 transition-colors ${wishActive ? 'fill-primary text-primary' : 'text-gray-400'}`} />
        </button>

        {/* Quick Add Button Mobile & Desktop - Siempre visible y fácil de tocar */}
        <button
          onClick={handleAdd}
          className={`absolute bottom-2.5 right-2.5 z-10 p-3 rounded-2xl font-bold shadow-lg transition-all active:scale-90 flex items-center justify-center gap-1.5 ${
            added 
              ? 'bg-green-500 text-white scale-105' 
              : 'bg-primary text-white hover:bg-primary-dark shadow-primary/30'
          }`}
          title="Agregar al carrito"
        >
          <ShoppingBag className="w-4 h-4" />
          <span className="hidden md:inline text-xs font-bold">{added ? '¡Agregado!' : 'Agregar'}</span>
        </button>
      </div>

      <div className="p-4 flex flex-col flex-grow justify-between">
        <div>
          <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-1">{item.subcategoria || item.categoria}</p>
          <h3 className="font-bold text-gray-900 line-clamp-2 text-sm md:text-base group-hover:text-primary transition-colors leading-snug">
            {item.nombre}
          </h3>
        </div>
        <div className="mt-3 flex items-center justify-between pt-2 border-t border-gray-50">
          <div>
            <span className="font-black text-lg md:text-xl text-gray-900 tracking-tight">
              ${item.precio_base.toLocaleString('es-CL')}
            </span>
          </div>
          <div className="flex items-center gap-1 text-xs text-gray-400 bg-gray-50 px-2 py-0.5 rounded-md">
            <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
            <span className="font-bold text-gray-700">4.9</span>
          </div>
        </div>
      </div>
    </a>
  );
}

// ── Componente: Sección Flash Sale / Urgencia ──
function UrgencyBar() {
  const [timeLeft, setTimeLeft] = useState({ h: 5, m: 47, s: 33 });

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft(prev => {
        let { h, m, s } = prev;
        s--;
        if (s < 0) { s = 59; m--; }
        if (m < 0) { m = 59; h--; }
        if (h < 0) { h = 23; m = 59; s = 59; }
        return { h, m, s };
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const pad = (n: number) => String(n).padStart(2, '0');

  return (
    <div className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 border-b border-gray-700 py-2.5 px-4 relative z-10">
      <div className="container mx-auto flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-6 text-white text-sm">
        <div className="flex items-center gap-2">
          <span className="relative flex w-2 h-2">
            <span className="animate-ring absolute inline-flex h-full w-full rounded-full bg-yellow-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-yellow-400" />
          </span>
          <span className="font-bold text-yellow-400 text-xs uppercase tracking-widest">⚡ Entrega hoy disponible</span>
        </div>
        <span className="text-gray-600 hidden sm:block">|</span>
        <div className="flex items-center gap-2">
          <span className="text-gray-300 text-xs">Cierre de despacho hoy en:</span>
          <div className="flex gap-1">
            {[pad(timeLeft.h), pad(timeLeft.m), pad(timeLeft.s)].map((unit, i) => (
              <span key={i} className="bg-primary text-white font-mono font-black text-xs md:text-sm px-2 py-0.5 rounded-md">{unit}</span>
            ))}
          </div>
        </div>
        <a href="/catalogo?badge=Entrega+Hoy" className="hidden md:flex items-center gap-1 text-primary text-xs font-bold hover:underline">
          Ver disponibles <ArrowRight className="w-3 h-3" />
        </a>
      </div>
    </div>
  );
}

// ── Página Principal ──
export default function HomePage() {
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const [catalogoDB, setCatalogoDB] = useState<any[]>([]);
  const [siteConfig, setSiteConfig] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<string>('todos');

  useReveal();

  useEffect(() => {
    fetch('/api/catalogo')
      .then(res => res.json())
      .then(data => setCatalogoDB(data))
      .catch(err => console.error(err));

    fetch(`/api/config?t=${Date.now()}`, { cache: 'no-store' })
      .then(res => res.json())
      .then(data => setSiteConfig(data))
      .catch(err => console.error(err));
  }, []);

  if (!siteConfig) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-rose-50 to-pink-50">
        <div className="text-center">
          <div className="text-5xl mb-4 animate-float">🌹</div>
          <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto" />
          <p className="text-gray-400 mt-4 text-sm font-medium">Preparando tu experiencia floral...</p>
        </div>
      </div>
    );
  }

  const fontStyle = `
    :root {
      --font-heading: "${siteConfig.fonts?.heading || 'Inter'}", sans-serif;
      --font-body: "${siteConfig.fonts?.body || 'Inter'}", sans-serif;
    }
    h1, h2, h3, h4, h5, h6, .font-serif {
      font-family: var(--font-heading) !important;
    }
    body, p, span, a, div {
      font-family: var(--font-body);
    }
  `;

  // Filtrado de productos dinámico en la portada
  const allProducts = (Array.isArray(catalogoDB) ? catalogoDB : []).filter(p => p?.estado !== 'fuera_de_temporada');

  const filteredProducts = allProducts.filter(p => {
    if (activeTab === 'todos') return true;
    if (activeTab === 'rosas') return p.categoria === 'Flores' || p.nombre.toLowerCase().includes('rosa');
    if (activeTab === 'ramos') return p.categoria === 'Ramos de Flores' || p.nombre.toLowerCase().includes('ramo');
    if (activeTab === 'hoy') return p.badge?.includes('Entrega Hoy');
    if (activeTab === 'regalos') return p.categoria === 'Regalos';
    return true;
  }).slice(0, 8);

  return (
    <div className="flex flex-col min-h-screen bg-gray-50/50">
      <style dangerouslySetInnerHTML={{ __html: fontStyle }} />

      {/* Hero Slider */}
      <HeroSlider config={siteConfig.heroSlider} timings={siteConfig.timings} />

      {/* Barra de urgencia */}
      <UrgencyBar />

      {/* Accesos rápidos Estilo App */}
      <QuickAppActions />

      {/* Ticker de confianza */}
      <TrustTicker />

      {/* Categorías visuales */}
      <CategoryGrid />

      {/* Por qué Chileflor */}
      <WhyChileflor />

      {/* Stats */}
      <StatsBar />

      {/* Catálogo Destacado Interactivo estilo App */}
      <section className="container mx-auto px-4 py-16 md:py-20 reveal">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <p className="text-primary text-xs md:text-sm font-bold uppercase tracking-[0.3em] mb-2">Descubre y Compra</p>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Arreglos Destacados</h2>
            <p className="text-gray-500 mt-1 text-sm md:text-base">Selecciona tu categoría favorita para explorar.</p>
          </div>

          {/* Filter Tabs */}
          <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
            {[
              { id: 'todos', label: 'Todos' },
              { id: 'hoy', label: '⚡ Entrega Hoy' },
              { id: 'rosas', label: '🌹 Rosas' },
              { id: 'ramos', label: '💐 Ramos' },
              { id: 'regalos', label: '🎁 Regalos' },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2 rounded-full font-bold text-xs md:text-sm whitespace-nowrap transition-all ${
                  activeTab === tab.id
                    ? 'bg-primary text-white shadow-md shadow-primary/30'
                    : 'bg-white text-gray-600 border border-gray-200 hover:border-gray-300'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {filteredProducts.length === 0 ? (
          <div className="text-center py-16 text-gray-400 bg-white rounded-3xl border border-gray-100">
            <div className="text-4xl mb-3">🌿</div>
            <p className="font-semibold text-gray-600">No encontramos productos en esta categoría por ahora.</p>
            <a href="/catalogo" className="mt-4 inline-block text-primary font-bold text-sm hover:underline">Ver catálogo completo</a>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-6">
            {filteredProducts.map(item => (
              <ProductCard
                key={item.id}
                item={item}
                addToCart={addToCart}
                toggleWishlist={toggleWishlist}
                isInWishlist={isInWishlist}
              />
            ))}
          </div>
        )}

        <div className="mt-10 text-center">
          <a
            href="/catalogo"
            className="inline-flex items-center gap-2 bg-gray-900 text-white hover:bg-primary font-bold px-8 py-4 rounded-full shadow-lg transition-all hover:scale-105 active:scale-95 text-sm md:text-base"
          >
            Explorar Todo el Catálogo <ArrowRight className="w-4 h-4" />
          </a>
        </div>
      </section>

      {/* Suscripción cementerios */}
      <section className="container mx-auto px-4 py-8 reveal">
        <SubscriptionBanner config={siteConfig.subscriptionBanner} />
      </section>

      {/* Testimonios */}
      <Testimonials />

      {/* Newsletter */}
      <NewsletterBanner />

      {/* Espacio inferior para MobileNav */}
      <div className="pb-16 md:pb-8" />
    </div>
  );
}
