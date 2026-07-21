'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';
import { ShoppingBag, Star, Gift, Check, Shield, Sparkles, Sprout, Leaf, Flower2 } from 'lucide-react';

export default function ClubPage() {
  const [user, setUser] = useState<any>(null);
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    'https://images.unsplash.com/photo-1563241527-20042457fb1e?auto=format&fit=crop&q=80&w=2000',
    'https://images.unsplash.com/photo-1582794543139-8ac9cb0f7b11?auto=format&fit=crop&q=80&w=2000',
    'https://images.unsplash.com/photo-1457089328109-e5d9f7259f5b?auto=format&fit=crop&q=80&w=2000'
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  
  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user);
    });
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 pb-24 md:pb-12">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-24 pb-32">
        <div className="absolute inset-0 bg-gray-900">
          {slides.map((src, index) => (
            <img 
              key={src}
              src={src}
              alt="Fondo floral Club Chileflor"
              className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${index === currentSlide ? 'opacity-40' : 'opacity-0'}`}
            />
          ))}
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/80 to-gray-900/40"></div>
          <div className="absolute inset-0 bg-gradient-to-br from-[#FF2651]/30 via-transparent to-purple-900/40 mix-blend-overlay"></div>
        </div>
        
        <div className="container relative z-10 mx-auto px-4 text-center max-w-4xl">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white text-sm font-medium mb-6">
            <Sparkles className="w-4 h-4 text-[#FF2651]" />
            Nuevo Programa de Beneficios
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-6 tracking-tight">
            Mucho más que flores.<br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF2651] to-purple-400">
              Únete a Club Chileflor.
            </span>
          </h1>
          <p className="text-lg md:text-xl text-gray-300 mb-10 max-w-2xl mx-auto leading-relaxed">
            Acumula puntos con cada compra, desbloquea descuentos exclusivos y disfruta de beneficios pensados especialmente para ti.
          </p>
          
          <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
            {user ? (
              <a href="/mi-cuenta" className="bg-[#FF2651] text-white font-bold px-8 py-4 rounded-xl shadow-lg shadow-[#FF2651]/30 hover:-translate-y-1 hover:bg-[#E01E42] transition-all w-full sm:w-auto text-center">
                Ver mis puntos
              </a>
            ) : (
              <>
                <a href="/login" className="bg-[#FF2651] text-white font-bold px-8 py-4 rounded-xl shadow-lg shadow-[#FF2651]/30 hover:-translate-y-1 hover:bg-[#E01E42] transition-all w-full sm:w-auto text-center">
                  Unirme gratis ahora
                </a>
                <a href="/catalogo" className="bg-white/10 backdrop-blur-md text-white font-bold px-8 py-4 rounded-xl border border-white/20 hover:bg-white/20 transition-all w-full sm:w-auto text-center">
                  Explorar catálogo
                </a>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Cómo Funciona */}
      <section className="py-24 bg-white relative">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">¿Cómo funciona?</h2>
            <p className="text-gray-500 max-w-2xl mx-auto">Tres simples pasos para convertir cada compra en recompensas increíbles.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-gray-50 p-8 rounded-3xl text-center hover:shadow-xl transition-shadow border border-gray-100">
              <div className="w-16 h-16 bg-[#FF2651]/10 text-[#FF2651] rounded-2xl flex items-center justify-center mx-auto mb-6">
                <ShoppingBag className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">1. Compra</h3>
              <p className="text-gray-600">Elige el arreglo perfecto para esa persona especial desde nuestro catálogo.</p>
            </div>
            
            <div className="bg-gray-50 p-8 rounded-3xl text-center hover:shadow-xl transition-shadow border border-gray-100 relative">
              <div className="hidden md:block absolute top-1/2 -left-4 w-8 h-0.5 bg-gray-200"></div>
              <div className="hidden md:block absolute top-1/2 -right-4 w-8 h-0.5 bg-gray-200"></div>
              <div className="w-16 h-16 bg-purple-100 text-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Star className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">2. Acumula</h3>
              <p className="text-gray-600">Gana 1 punto automáticamente por cada $100 de compra. ¡Así de fácil!</p>
            </div>

            <div className="bg-gray-50 p-8 rounded-3xl text-center hover:shadow-xl transition-shadow border border-gray-100">
              <div className="w-16 h-16 bg-green-100 text-green-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Gift className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">3. Disfruta</h3>
              <p className="text-gray-600">Usa tus puntos como dinero (1 punto = $1) para pagar menos en tu próximo pedido.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Niveles del Club */}
      <section className="py-24 bg-gray-50">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Tus Beneficios Crecen Contigo</h2>
            <p className="text-gray-500 max-w-2xl mx-auto">A medida que compras, subes de nivel y desbloqueas ventajas exclusivas.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
            
            {/* Nivel Semilla */}
            <div className="bg-white rounded-3xl p-8 border border-gray-200 shadow-sm relative">
              <div className="text-green-600 mb-4"><Sprout className="w-10 h-10" /></div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Semilla</h3>
              <p className="text-gray-500 text-sm mb-6">Para todos al registrarse</p>
              
              <ul className="space-y-4 mb-8">
                <li className="flex items-start gap-3 text-gray-700">
                  <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <span>Acumula <strong>1%</strong> en puntos</span>
                </li>
                <li className="flex items-start gap-3 text-gray-700">
                  <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <span>Acceso al programa de referidos</span>
                </li>
                <li className="flex items-start gap-3 text-gray-400">
                  <span className="w-5 h-5 border-2 border-gray-200 rounded-full flex-shrink-0 mt-0.5"></span>
                  <span>Despacho prioritario</span>
                </li>
              </ul>
            </div>

            {/* Nivel Brote */}
            <div className="bg-white rounded-3xl p-8 border-2 border-[#FF2651] shadow-2xl relative transform md:-translate-y-4">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#FF2651] text-white text-xs font-bold px-4 py-1.5 rounded-full uppercase tracking-wider">
                Más Popular
              </div>
              <div className="text-[#FF2651] mb-4"><Leaf className="w-12 h-12" /></div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Brote</h3>
              <p className="text-gray-500 text-sm mb-6">Desde tu 3ra compra</p>
              
              <ul className="space-y-4 mb-8">
                <li className="flex items-start gap-3 text-gray-700">
                  <Check className="w-5 h-5 text-[#FF2651] flex-shrink-0 mt-0.5" />
                  <span>Acumula <strong>2%</strong> en puntos</span>
                </li>
                <li className="flex items-start gap-3 text-gray-700">
                  <Check className="w-5 h-5 text-[#FF2651] flex-shrink-0 mt-0.5" />
                  <span><strong>Envío gratis</strong> en comunas seleccionadas</span>
                </li>
                <li className="flex items-start gap-3 text-gray-700">
                  <Check className="w-5 h-5 text-[#FF2651] flex-shrink-0 mt-0.5" />
                  <span>Atención prioritaria por WhatsApp</span>
                </li>
              </ul>
            </div>

            {/* Nivel Flor */}
            <div className="bg-white rounded-3xl p-8 border border-gray-200 shadow-sm relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-5"><Flower2 className="w-32 h-32" /></div>
              <div className="text-purple-600 mb-4"><Flower2 className="w-10 h-10" /></div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Flor VIP</h3>
              <p className="text-gray-500 text-sm mb-6">10+ compras anuales</p>
              
              <ul className="space-y-4 mb-8 relative z-10">
                <li className="flex items-start gap-3 text-gray-700">
                  <Check className="w-5 h-5 text-purple-500 flex-shrink-0 mt-0.5" />
                  <span>Acumula <strong>5%</strong> en puntos</span>
                </li>
                <li className="flex items-start gap-3 text-gray-700">
                  <Check className="w-5 h-5 text-purple-500 flex-shrink-0 mt-0.5" />
                  <span>Envíos <strong>nocturnos gratuitos</strong></span>
                </li>
                <li className="flex items-start gap-3 text-gray-700">
                  <Check className="w-5 h-5 text-purple-500 flex-shrink-0 mt-0.5" />
                  <span>Catálogo de flores exclusivas VIP</span>
                </li>
              </ul>
            </div>

          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 max-w-4xl text-center">
          <div className="bg-gradient-to-r from-gray-900 to-gray-800 rounded-3xl p-8 md:p-16 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#FF2651] opacity-20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-500 opacity-20 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>
            
            <div className="relative z-10">
              <Shield className="w-16 h-16 text-white/50 mx-auto mb-6" />
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">Tu lealtad tiene recompensa</h2>
              <p className="text-gray-300 text-lg mb-8 max-w-2xl mx-auto">
                No pierdas la oportunidad de ganar en cada regalo. Al unirte, recibirás beneficios inmediatos para tu primera compra.
              </p>
              
              {!user && (
                <a href="/login" className="inline-block bg-white text-gray-900 font-bold px-8 py-4 rounded-xl shadow-lg hover:bg-gray-100 transition-colors">
                  Crear mi cuenta gratis
                </a>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}


