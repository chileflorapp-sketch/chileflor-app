'use client';
import { useState, useEffect } from 'react';
import HeroSlider from '@/components/HeroSlider';
import WelcomeBanner from '@/components/WelcomeBanner';
import InfoSlider from '@/components/InfoSlider';
import ExperienceBanner from '@/components/ExperienceBanner';

import { useCart } from '@/context/CartContext';

export default function HomePage() {
  const { addToCart } = useCart();
  const [catalogoDB, setCatalogoDB] = useState<any[]>([]);

  useEffect(() => {
    fetch('/api/catalogo')
      .then(res => res.json())
      .then(data => setCatalogoDB(data))
      .catch(err => console.error(err));
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      <HeroSlider />

      {/* Category Scroll */}
      <section className="container mx-auto px-4 -mt-8 relative z-30">
        <div className="flex gap-4 overflow-x-auto pb-6 scrollbar-hide snap-x relative z-30">
          {[
            { name: 'Ramos de Flores', link: '/catalogo?cat=Ramos de Flores' },
            { name: 'Ramos de Rosas', link: '/catalogo?cat=Ramos de Rosas' },
            { name: 'Día de la Madre', link: '/catalogo?cat=Día de la Madre' },
            { name: 'Día del Padre', link: '/catalogo?cat=Día del Padre' },
            { name: 'Bautizos', link: '/catalogo?cat=Bautizos' },
            { name: 'Matrimonios', link: '/catalogo?cat=Matrimonios' },
            { name: 'Defunciones', link: '/catalogo?cat=Defunciones' },
            { name: 'Ocasiones Especiales', link: '/catalogo?cat=Ocasiones Especiales' },
            { name: 'Amor', link: '/catalogo?cat=Amor' },
            { name: 'Amistad', link: '/catalogo?cat=Amistad' },
            { name: 'Accesorios', link: '/catalogo?cat=Accesorios' }
          ].map((cat, i) => (
            <div key={i} className="snap-start shrink-0">
              <a href={cat.link} className={`inline-block px-6 py-3 rounded-full font-medium shadow-sm border ${i === 0 ? 'bg-gray-900 text-white border-gray-900' : 'bg-white text-gray-700 border-gray-200 hover:border-primary/30'} transition-colors whitespace-nowrap`}>
                {cat.name}
              </a>
            </div>
          ))}
        </div>
      </section>

      <section className="container mx-auto px-4 py-8 relative z-30 reveal">
        <InfoSlider />
      </section>

      <div className="reveal">
        <ExperienceBanner />
      </div>

      <div className="reveal">
        <WelcomeBanner />
      </div>



      {/* Best Sellers Grid */}
      <section className="container mx-auto px-4 py-16 reveal">
        <div className="flex items-end justify-between mb-8">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900">Más Vendidos</h2>
            <p className="text-gray-500 mt-2">Los arreglos favoritos de nuestra comunidad.</p>
          </div>
          <a href="/catalogo" className="hidden md:block text-primary font-medium hover:underline">
            Ver todos →
          </a>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {catalogoDB.filter(p => p.estado !== 'fuera_de_temporada')
            .sort((a, b) => b.ventas - a.ventas)
            .slice(0, 8)
            .map((item) => (
            <a href={`/catalogo/${item.id}`} key={item.id} className="group flex flex-col bg-white rounded-3xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-premium transition-all duration-500 hover:-translate-y-2">
              <div className="aspect-[4/5] relative overflow-hidden bg-gray-50">
                <img src={item.imagen} alt={item.nombre} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-[cubic-bezier(0.25,1,0.5,1)]" />
                
                <div className="absolute top-3 left-3 flex flex-col gap-1 z-10">
                  {item.badge && (
                    <span className={`backdrop-blur-md text-[10px] font-extrabold uppercase tracking-widest px-3 py-1 rounded-full shadow-sm ${
                      item.badge.includes('Entrega Hoy') ? 'bg-yellow-400/90 text-yellow-900' :
                      item.badge.includes('Premium') ? 'bg-gray-900/90 text-yellow-400' :
                      'bg-green-500/90 text-white'
                    }`}>
                      {item.badge}
                    </span>
                  )}
                </div>

                <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-md text-xs font-extrabold px-3 py-1 rounded-full shadow-sm text-gray-800 z-10">
                  🔥 {item.ventas}
                </div>
                
                {/* Subtle gradient overlay for better text contrast if needed */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              </div>
              
              <div className="p-5 flex flex-col flex-grow justify-between bg-white relative z-20">
                <div>
                  <h3 className="font-bold text-gray-900 line-clamp-1 text-lg group-hover:text-primary transition-colors">{item.nombre}</h3>
                  <p className="text-sm text-gray-500 mt-1 font-medium">{item.subcategoria}</p>
                </div>
                <div className="mt-5 flex items-center justify-between">
                  <span className="font-black text-xl text-gray-900 tracking-tight">${item.precio_base.toLocaleString('es-CL')}</span>
                  <button 
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      addToCart({ 
                        id: parseInt(item.id.replace('p-','')), 
                        name: item.nombre, 
                        price: item.precio_base, 
                        image: item.imagen 
                      });
                    }}
                    className="w-10 h-10 rounded-2xl bg-gray-50 text-gray-900 hover:bg-primary hover:text-white flex items-center justify-center transition-all duration-300 shadow-sm hover:shadow-primary/30 hover:scale-110 active:scale-95 group/btn"
                  >
                    <svg className="w-5 h-5 transition-transform group-hover/btn:rotate-90" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" /></svg>
                  </button>
                </div>
              </div>
            </a>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section className="container mx-auto px-4 py-16 bg-gray-50/50 rounded-3xl mb-16 border border-gray-100 reveal">
        <div className="text-center mb-12">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900">Lo que dicen nuestros clientes</h2>
          <p className="text-gray-500 mt-2">Experiencias reales con Chileflor</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { name: "María González", text: "Los arreglos son hermosos y llegaron a tiempo. Mi mamá quedó encantada con las flores por su cumpleaños.", rating: 5 },
            { name: "Juan Pérez", text: "Excelente servicio. La calidad de las rosas es impresionante, duraron mucho tiempo. 100% recomendados.", rating: 5 },
            { name: "Camila Rojas", text: "Muy amables en la atención al cliente y el proceso de compra es muy fácil. Las flores llegaron frescas y hermosas.", rating: 5 }
          ].map((testimonial, idx) => (
            <div key={idx} className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 flex flex-col gap-4 hover:-translate-y-1 transition-transform">
              <div className="text-yellow-400 flex gap-1">
                {Array(testimonial.rating).fill(0).map((_, i) => <span key={i}>⭐</span>)}
              </div>
              <p className="text-gray-600 italic">"{testimonial.text}"</p>
              <div className="mt-auto font-semibold text-gray-900 flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold">
                  {testimonial.name.charAt(0)}
                </div>
                {testimonial.name}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
