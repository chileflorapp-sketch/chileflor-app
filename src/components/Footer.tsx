'use client';
import { useState } from 'react';

const LOCATIONS = [
  {
    name: 'Chileflor',
    address: 'Las malvas 1851, La Florida, Santiago, Chile',
    mapUrl: 'https://www.google.com/maps?q=Las+malvas+1851,+La+Florida,+Santiago,+Chile&output=embed'
  },
  {
    name: 'Paco Floreria',
    address: 'Costado del estacionamiento del cementerio parque el prado Av. Camilo Henríquez N°4673, Puente Alto, Región Metropolitana',
    mapUrl: 'https://www.google.com/maps?q=Av.+Camilo+Henríquez+4673,+Puente+Alto,+Región+Metropolitana&output=embed'
  },
  {
    name: 'Floreria Los Mellizos',
    address: 'Av. La Florida esquina Walker Martinez, La Florida, Región Metropolitana',
    mapUrl: 'https://www.google.com/maps?q=Av.+La+Florida+esquina+Walker+Martinez,+La+Florida,+Region+Metropolitana&output=embed'
  },
  {
    name: 'Bodega Chileflor',
    address: 'Las malvas 1832, La Florida, Región Metropolitana',
    mapUrl: 'https://www.google.com/maps?q=Las+malvas+1832,+La+Florida,+Region+Metropolitana&output=embed'
  }
];

import { usePathname } from 'next/navigation';

export default function Footer() {
  const pathname = usePathname();
  const [selectedLocation, setSelectedLocation] = useState(0);

  if (pathname?.startsWith('/agentes')) return null;
  return (
    <footer className="bg-gray-900 text-gray-300 pt-16 pb-28 md:pb-12 border-t border-gray-800">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-12">
          
          {/* Brand */}
          <div className="flex flex-col gap-4">
            <a href="/" className="inline-block mb-2">
               <img 
                 src="/logo.png" 
                 alt="Chileflor Logo" 
                 className="h-14 md:h-16 w-auto object-contain opacity-90 hover:opacity-100 transition-opacity" 
               />
            </a>
            <p className="text-sm text-gray-400">
              Conectando emociones a través de arreglos florales, dedicatorias interactivas y mantención de cementerios con la más alta calidad y cuidado.
            </p>
            <div className="flex flex-wrap gap-3 mt-4">
              <a href="https://instagram.com/chileflor.cl" target="_blank" rel="noreferrer" className="flex items-center gap-2 px-4 py-2 rounded-full bg-gray-800 hover:bg-gradient-to-r hover:from-purple-500 hover:via-pink-500 hover:to-orange-500 hover:text-white transition-all text-gray-300">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
                <span className="font-medium text-xs">@chileflor.cl</span>
              </a>
              <a href="https://tiktok.com/@chileflor.cl" target="_blank" rel="noreferrer" className="flex items-center gap-2 px-4 py-2 rounded-full bg-gray-800 hover:bg-black hover:text-white transition-all text-gray-300">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-5.2 1.74 2.89 2.89 0 012.31-4.64 2.93 2.93 0 01.88.13V9.4a6.84 6.84 0 00-1-.05A6.33 6.33 0 005 15.66a6.34 6.34 0 0010.86-4.43v-7a8.16 8.16 0 004.77 1.52v-3.4a4.85 4.85 0 01-1.04-.06z"/></svg>
                <span className="font-medium text-xs">TikTok</span>
              </a>
            </div>
          </div>

          {/* Enlaces Rápidos */}
          <div>
            <h3 className="text-white font-semibold mb-4">Enlaces Rápidos</h3>
            <ul className="space-y-3 text-sm">
              <li><a href="/nosotros" className="hover:text-primary transition-colors">Sobre Nosotros</a></li>
              <li><a href="/catalogo" className="hover:text-primary transition-colors">Catálogo de Productos</a></li>
              <li><a href="/cementerios" className="hover:text-primary transition-colors">Mantención de Cementerios</a></li>
              <li><a href="/seguimiento" className="hover:text-primary transition-colors">Seguimiento de Pedidos</a></li>
              <li><a href="/faqs" className="hover:text-primary transition-colors">Preguntas Frecuentes</a></li>
            </ul>
          </div>

          {/* Portales */}
          <div>
            <h3 className="text-white font-semibold mb-4">Portales</h3>
            <ul className="space-y-3 text-sm">
              <li><a href="/portal-mayorista/registro" className="hover:text-primary transition-colors">Portal Mayorista B2B</a></li>
              <li><a href="/logistica" className="hover:text-primary transition-colors">Panel de Logística (Hubs)</a></li>
              <li><a href="/checkout" className="hover:text-primary transition-colors">Carrito de Compras</a></li>
            </ul>
          </div>

          {/* Contacto */}
          <div>
            <h3 className="text-white font-semibold mb-4">Atención al Cliente</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center gap-3">
                <span className="text-primary">💳</span>
                <a href="https://wa.me/56979992848" className="hover:text-primary transition-colors">Pagos: +56 9 7999 2848</a>
              </li>
              <li className="flex items-center gap-3">
                <span className="text-primary">💬</span>
                <a href="https://wa.me/56972984627" className="hover:text-primary transition-colors">Consultas: +56 9 7298 4627</a>
              </li>
              <li className="flex items-center gap-3">
                <span className="text-primary">✉️</span>
                <a href="mailto:chileflor.app@gmail.com" className="hover:text-primary transition-colors">chileflor.app@gmail.com</a>
              </li>
              <li className="pt-2">
                <a href="/contacto" className="inline-block border border-gray-600 hover:border-primary text-gray-300 hover:text-white px-4 py-2 rounded-lg transition-colors text-xs font-bold uppercase tracking-wider">
                  Ir a Contacto
                </a>
              </li>
            </ul>
          </div>

          {/* Map Locations */}
          <div className="md:col-span-2 lg:col-span-1">
             <h3 className="text-white font-semibold mb-4">Nuestras Ubicaciones</h3>
             <select 
               value={selectedLocation} 
               onChange={(e) => setSelectedLocation(Number(e.target.value))}
               className="w-full bg-gray-800 text-white border border-gray-700 rounded-lg px-4 py-2 mb-4 focus:outline-none focus:border-primary text-sm"
             >
               {LOCATIONS.map((loc, idx) => (
                 <option key={idx} value={idx}>{loc.name}</option>
               ))}
             </select>
             <div className="w-full h-32 bg-gray-800 rounded-lg overflow-hidden border border-gray-700">
               <iframe 
                 src={LOCATIONS[selectedLocation].mapUrl}
                 width="100%" 
                 height="100%" 
                 style={{ border: 0 }} 
                 allowFullScreen={false} 
                 loading="lazy" 
                 referrerPolicy="no-referrer-when-downgrade"
                 title={`Mapa de ${LOCATIONS[selectedLocation].name}`}
               ></iframe>
             </div>
             <p className="text-xs text-gray-400 mt-3 leading-relaxed flex items-start gap-2">
               <span className="text-primary">📍</span> {LOCATIONS[selectedLocation].address}
             </p>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-gray-500">
          <div className="flex flex-col md:flex-row items-center gap-2">
            <p>&copy; 2026 chileflor.cl. Todos los derechos reservados.</p>
            <p className="text-gray-400 font-medium">by Paco Floreria, by Floreria Los Mellizos</p>
          </div>
          <div className="flex gap-4">
            <a href="/privacidad" className="hover:text-white transition-colors">Políticas de Privacidad</a>
            <a href="/terminos" className="hover:text-white transition-colors">Términos y Condiciones</a>
            <span className="text-gray-700">|</span>
            <a href="/agentes" className="text-gray-600 hover:text-white transition-colors">Agentes</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
