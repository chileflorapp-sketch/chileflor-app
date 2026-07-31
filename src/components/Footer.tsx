'use client';
import { usePathname } from 'next/navigation';

const LOCATIONS = [
  { name: 'Chileflor', address: 'Las Malvas 1851, La Florida, Santiago', mapsUrl: 'https://maps.google.com/?q=Las+malvas+1851,+La+Florida,+Santiago' },
  { name: 'Paco Florería', address: 'Av. Camilo Henríquez 4673, Puente Alto', mapsUrl: 'https://maps.google.com/?q=Av.+Camilo+Henríquez+4673,+Puente+Alto' },
  { name: 'Florería Los Mellizos', address: 'Av. La Florida esq. Walker Martínez, La Florida', mapsUrl: 'https://maps.google.com/?q=Av.+La+Florida+esq.+Walker+Martinez,+La+Florida' },
  { name: 'Bodega Chileflor', address: 'Las Malvas 1832, La Florida', mapsUrl: 'https://maps.google.com/?q=Las+malvas+1832,+La+Florida' },
];

const QUICK_LINKS = [
  { label: 'Inicio', href: '/' },
  { label: 'Catálogo de Flores', href: '/catalogo' },
  { label: 'Mantención de Cementerios', href: '/cementerios' },
  { label: 'Sobre Nosotros', href: '/nosotros' },
  { label: 'Preguntas Frecuentes', href: '/faqs' },
  { label: 'Contacto', href: '/contacto' },
];

const PORTAL_LINKS = [
  { label: 'Portal B2B Mayorista', href: '/portal-mayorista/registro' },
  { label: 'Club VIP / Mi Cuenta', href: '/club' },
  { label: 'Panel de Logística', href: '/logistica' },
  { label: 'Carrito de Compras', href: '/checkout' },
];

const SCHEDULE = [
  { day: 'Lunes a Viernes', hours: '09:00 – 19:00' },
  { day: 'Sábado', hours: '09:00 – 17:00' },
  { day: 'Domingo', hours: '10:00 – 14:00' },
];

export default function Footer() {
  const pathname = usePathname();
  if (pathname?.startsWith('/agentes')) return null;

  return (
    <footer className="bg-gray-950 text-gray-300 pt-16 pb-28 md:pb-12 border-t border-gray-800/50">
      <div className="container mx-auto px-4">
        {/* Grid principal */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 mb-14">

          {/* Columna 1: Marca */}
          <div className="lg:col-span-1 flex flex-col gap-5">
            <a href="/" className="inline-block">
              <img src="/logo.png" alt="Chileflor Logo" className="h-12 w-auto object-contain opacity-90 hover:opacity-100 transition-opacity" />
            </a>
            <p className="text-sm text-gray-400 leading-relaxed">
              Conectando emociones a través de arreglos florales únicos, dedicatorias interactivas y mantención de cementerios con la más alta calidad.
            </p>

            {/* Horarios */}
            <div className="bg-gray-900 rounded-2xl p-4 border border-gray-800">
              <p className="text-xs font-bold text-white uppercase tracking-wider mb-3 flex items-center gap-2">
                🕐 Horarios de Atención
              </p>
              {SCHEDULE.map((s, i) => (
                <div key={i} className="flex justify-between text-xs py-1 border-b border-gray-800/50 last:border-0">
                  <span className="text-gray-400">{s.day}</span>
                  <span className="text-white font-semibold">{s.hours}</span>
                </div>
              ))}
            </div>

            {/* Social */}
            <div className="flex gap-3">
              <a href="https://instagram.com/chileflor.cl" target="_blank" rel="noreferrer"
                className="flex items-center gap-2 px-3 py-2 rounded-xl bg-gray-900 border border-gray-800 hover:border-pink-500/40 hover:bg-gradient-to-r hover:from-purple-500/20 hover:to-pink-500/20 transition-all text-gray-300 hover:text-white text-xs font-medium">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" /></svg>
                Instagram
              </a>
              <a href="https://tiktok.com/@chileflor.cl" target="_blank" rel="noreferrer"
                className="flex items-center gap-2 px-3 py-2 rounded-xl bg-gray-900 border border-gray-800 hover:border-white/20 hover:bg-black/60 transition-all text-gray-300 hover:text-white text-xs font-medium">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-5.2 1.74 2.89 2.89 0 012.31-4.64 2.93 2.93 0 01.88.13V9.4a6.84 6.84 0 00-1-.05A6.33 6.33 0 005 15.66a6.34 6.34 0 0010.86-4.43v-7a8.16 8.16 0 004.77 1.52v-3.4a4.85 4.85 0 01-1.04-.06z" /></svg>
                TikTok
              </a>
            </div>
          </div>

          {/* Columna 2: Links rápidos */}
          <div>
            <h3 className="text-white font-bold mb-5 text-sm uppercase tracking-widest">Navegación</h3>
            <ul className="space-y-2.5">
              {QUICK_LINKS.map((link, i) => (
                <li key={i}>
                  <a href={link.href} className="text-sm text-gray-400 hover:text-white hover:translate-x-1 transition-all inline-flex items-center gap-1.5 group">
                    <span className="w-1 h-1 rounded-full bg-primary opacity-0 group-hover:opacity-100 transition-opacity" />
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Columna 3: Portales */}
          <div>
            <h3 className="text-white font-bold mb-5 text-sm uppercase tracking-widest">Portales</h3>
            <ul className="space-y-2.5 mb-8">
              {PORTAL_LINKS.map((link, i) => (
                <li key={i}>
                  <a href={link.href} className="text-sm text-gray-400 hover:text-white hover:translate-x-1 transition-all inline-flex items-center gap-1.5 group">
                    <span className="w-1 h-1 rounded-full bg-primary opacity-0 group-hover:opacity-100 transition-opacity" />
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>

            <h3 className="text-white font-bold mb-4 text-sm uppercase tracking-widest">Contacto</h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <a href="https://wa.me/56979992848" className="flex items-center gap-2 text-gray-400 hover:text-green-400 transition-colors">
                  <span>💳</span> +56 9 7999 2848 <span className="text-xs text-gray-600">(Pagos)</span>
                </a>
              </li>
              <li>
                <a href="https://wa.me/56972984627" className="flex items-center gap-2 text-gray-400 hover:text-green-400 transition-colors">
                  <span>💬</span> +56 9 7298 4627 <span className="text-xs text-gray-600">(Consultas)</span>
                </a>
              </li>
              <li>
                <a href="mailto:chileflor.app@gmail.com" className="flex items-center gap-2 text-gray-400 hover:text-primary transition-colors">
                  <span>✉️</span> chileflor.app@gmail.com
                </a>
              </li>
            </ul>
          </div>

          {/* Columna 4: Ubicaciones */}
          <div>
            <h3 className="text-white font-bold mb-5 text-sm uppercase tracking-widest">Nuestras Tiendas</h3>
            <div className="space-y-3">
              {LOCATIONS.map((loc, i) => (
                <a
                  key={i}
                  href={loc.mapsUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-start gap-3 p-3 bg-gray-900 rounded-2xl border border-gray-800 hover:border-primary/30 hover:bg-gray-800/80 transition-all group"
                >
                  <span className="text-primary text-lg mt-0.5 shrink-0">📍</span>
                  <div>
                    <p className="text-white text-sm font-semibold group-hover:text-primary transition-colors">{loc.name}</p>
                    <p className="text-gray-500 text-xs mt-0.5 leading-relaxed">{loc.address}</p>
                    <p className="text-primary text-[10px] font-bold mt-1.5 uppercase tracking-wider">Ver en Google Maps →</p>
                  </div>
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Barra inferior */}
        <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex flex-col md:flex-row items-center gap-2 text-xs text-gray-500">
            <p>© 2026 chileflor.cl — Todos los derechos reservados.</p>
            <span className="hidden md:inline text-gray-700">|</span>
            <p className="text-gray-600">Paco Florería · Florería Los Mellizos</p>
          </div>

          {/* Medios de pago */}
          <div className="flex items-center gap-3">
            <span className="text-xs text-gray-600 font-medium">Pago seguro con:</span>
            <div className="flex gap-2">
              <span className="bg-gray-800 border border-gray-700 text-xs text-gray-300 px-3 py-1 rounded-lg font-bold">Webpay</span>
              <span className="bg-gray-800 border border-gray-700 text-xs text-gray-300 px-3 py-1 rounded-lg font-bold">Flow</span>
            </div>
          </div>

          <div className="flex gap-4 text-xs">
            <a href="/privacidad" className="text-gray-500 hover:text-white transition-colors">Privacidad</a>
            <a href="/terminos" className="text-gray-500 hover:text-white transition-colors">Términos</a>
            <span className="text-gray-700">|</span>
            <a href="/agentes" className="text-gray-700 hover:text-gray-400 transition-colors">Panel Agentes</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
