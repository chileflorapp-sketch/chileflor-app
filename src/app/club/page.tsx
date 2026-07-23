'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';
import { ShoppingBag, Star, Gift, Check, Shield, Sparkles, Sprout, Leaf, Flower2, ChevronDown, Calculator, Crown } from 'lucide-react';

export default function ClubPage() {
  const [user, setUser] = useState<any>(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [spendAmount, setSpendAmount] = useState(50000);
  const [openFaq, setOpenFaq] = useState<number | null>(0);

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

  const faqs = [
    {
      q: '¿Cómo me inscribo al Club Chileflor?',
      a: '¡Es automático y 100% gratis! Al crear tu cuenta en nuestra tienda, ya eres parte del nivel Semilla y comienzas a acumular puntos desde tu primera compra.'
    },
    {
      q: '¿A cuánto equivale 1 punto?',
      a: '1 punto equivale a $1 peso chileno. Así de simple. Si tienes 5.000 puntos, tienes $5.000 de descuento real para tu próxima compra.'
    },
    {
      q: '¿Mis puntos vencen?',
      a: 'Tus puntos tienen una vigencia de 12 meses desde el momento en que los ganas. Te enviaremos un recordatorio por correo antes de que expiren.'
    },
    {
      q: '¿Cómo uso mis puntos al comprar?',
      a: 'Al momento de ir al Checkout (caja), verás una opción que dice "Usar mis puntos". Podrás elegir cuántos puntos aplicar y verás el descuento reflejado inmediatamente en tu total.'
    }
  ];

  return (
    <div className="min-h-screen bg-[#FDFBF7] pb-24 md:pb-12 font-sans selection:bg-[#FF2651]/20">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-32 pb-40">
        <div className="absolute inset-0 bg-gray-950">
          {slides.map((src, index) => (
            <img 
              key={src}
              src={src}
              alt="Fondo floral Club Chileflor"
              className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${index === currentSlide ? 'opacity-50 scale-105' : 'opacity-0 scale-100'}`}
              style={{ transitionProperty: 'opacity, transform' }}
            />
          ))}
          <div className="absolute inset-0 bg-gradient-to-t from-[#FDFBF7] via-gray-900/60 to-gray-900/30"></div>
          <div className="absolute inset-0 bg-gradient-to-br from-[#FF2651]/40 via-transparent to-purple-900/50 mix-blend-overlay"></div>
        </div>
        
        <div className="container relative z-10 mx-auto px-4 text-center max-w-4xl">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-xl border border-white/20 text-white text-sm font-bold mb-8 shadow-[0_0_20px_rgba(255,38,81,0.3)]">
            <Sparkles className="w-4 h-4 text-yellow-300 animate-pulse" />
            El Nuevo Programa de Recompensas
          </div>
          <h1 className="text-5xl md:text-7xl font-black text-white mb-8 tracking-tight drop-shadow-2xl">
            Mucho más que flores.<br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF2651] via-pink-400 to-purple-400">
              Únete a Club Chileflor.
            </span>
          </h1>
          <p className="text-lg md:text-2xl text-gray-200 mb-12 max-w-2xl mx-auto leading-relaxed drop-shadow-md font-medium">
            Acumula puntos con cada compra, desbloquea envíos gratis y disfruta de privilegios pensados especialmente para ti.
          </p>
          
          <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
            {user ? (
              <a href="/mi-cuenta" className="bg-[#FF2651] text-white font-black px-10 py-5 rounded-2xl shadow-[0_0_30px_rgba(255,38,81,0.4)] hover:-translate-y-1 hover:shadow-[0_10px_40px_rgba(255,38,81,0.6)] hover:bg-[#E01E42] transition-all w-full sm:w-auto text-center text-lg">
                Ver mis puntos y nivel
              </a>
            ) : (
              <>
                <a href="/login" className="bg-[#FF2651] text-white font-black px-10 py-5 rounded-2xl shadow-[0_0_30px_rgba(255,38,81,0.4)] hover:-translate-y-1 hover:shadow-[0_10px_40px_rgba(255,38,81,0.6)] hover:bg-[#E01E42] transition-all w-full sm:w-auto text-center text-lg">
                  Unirme gratis ahora
                </a>
                <a href="/catalogo" className="bg-white/10 backdrop-blur-xl text-white font-bold px-10 py-5 rounded-2xl border border-white/20 hover:bg-white/20 transition-all w-full sm:w-auto text-center text-lg">
                  Explorar catálogo
                </a>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Cómo Funciona */}
      <section className="py-24 relative z-20 -mt-16">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            <div className="bg-white p-10 rounded-[32px] text-center shadow-xl shadow-gray-200/50 hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 border border-gray-100 group">
              <div className="w-20 h-20 bg-[#FF2651]/10 text-[#FF2651] rounded-3xl flex items-center justify-center mx-auto mb-8 group-hover:scale-110 group-hover:bg-[#FF2651] group-hover:text-white transition-all duration-300">
                <ShoppingBag className="w-10 h-10" />
              </div>
              <h3 className="text-2xl font-black text-gray-900 mb-4">1. Compra</h3>
              <p className="text-gray-600 font-medium">Elige el arreglo perfecto para esa persona especial en nuestro catálogo.</p>
            </div>
            
            <div className="bg-white p-10 rounded-[32px] text-center shadow-xl shadow-gray-200/50 hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 border border-gray-100 relative group">
              <div className="hidden md:block absolute top-1/2 -left-6 w-12 h-1 bg-gradient-to-r from-gray-100 to-gray-200 rounded-full"></div>
              <div className="hidden md:block absolute top-1/2 -right-6 w-12 h-1 bg-gradient-to-r from-gray-200 to-gray-100 rounded-full"></div>
              <div className="w-20 h-20 bg-purple-100 text-purple-600 rounded-3xl flex items-center justify-center mx-auto mb-8 group-hover:scale-110 group-hover:bg-purple-600 group-hover:text-white transition-all duration-300 shadow-[0_0_30px_rgba(168,85,247,0.2)]">
                <Star className="w-10 h-10" />
              </div>
              <h3 className="text-2xl font-black text-gray-900 mb-4">2. Acumula</h3>
              <p className="text-gray-600 font-medium">Gana hasta 5 puntos por cada $100 de compra, dependiendo de tu nivel.</p>
            </div>

            <div className="bg-white p-10 rounded-[32px] text-center shadow-xl shadow-gray-200/50 hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 border border-gray-100 group">
              <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-3xl flex items-center justify-center mx-auto mb-8 group-hover:scale-110 group-hover:bg-emerald-500 group-hover:text-white transition-all duration-300">
                <Gift className="w-10 h-10" />
              </div>
              <h3 className="text-2xl font-black text-gray-900 mb-4">3. Disfruta</h3>
              <p className="text-gray-600 font-medium">Usa tus puntos como dinero real (1 pt = $1) para pagar menos en el futuro.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Calculadora Interactiva */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="bg-white rounded-[40px] p-8 md:p-16 shadow-[0_20px_50px_-15px_rgba(0,0,0,0.05)] border border-gray-100 text-center relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none">
              <Calculator className="w-40 h-40" />
            </div>
            
            <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-4">Calculadora de Puntos</h2>
            <p className="text-gray-500 text-lg mb-10 max-w-2xl mx-auto">Descubre cuántos puntos podrías ganar en tu próxima compra y a cuánto dinero equivalen.</p>
            
            <div className="max-w-2xl mx-auto relative z-10">
              <div className="mb-12">
                <div className="flex justify-between items-end mb-4">
                  <span className="text-sm font-bold text-gray-500 uppercase tracking-widest">Si gastas</span>
                  <span className="text-4xl font-black text-gray-900">${spendAmount.toLocaleString('es-CL')}</span>
                </div>
                
                <input 
                  type="range" 
                  min="10000" 
                  max="200000" 
                  step="5000"
                  value={spendAmount}
                  onChange={(e) => setSpendAmount(Number(e.target.value))}
                  className="w-full h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#FF2651]"
                />
                <div className="flex justify-between text-xs text-gray-400 mt-2 font-bold">
                  <span>$10.000</span>
                  <span>$200.000+</span>
                </div>
              </div>

              <div className="bg-gray-50 rounded-3xl p-6 md:p-8 border border-gray-100">
                <p className="text-sm font-bold text-gray-500 uppercase tracking-widest mb-4">Podrías ganar hasta</p>
                <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-8">
                  <div className="text-center">
                    <span className="block text-5xl font-black text-[#FF2651] drop-shadow-sm">
                      {Math.floor(spendAmount * 0.05).toLocaleString('es-CL')}
                    </span>
                    <span className="text-sm font-bold text-[#FF2651]/70 uppercase tracking-widest">Puntos VIP</span>
                  </div>
                  <div className="hidden md:block w-px h-16 bg-gray-200"></div>
                  <div className="text-center">
                    <span className="block text-5xl font-black text-emerald-500 drop-shadow-sm">
                      ${Math.floor(spendAmount * 0.05).toLocaleString('es-CL')}
                    </span>
                    <span className="text-sm font-bold text-emerald-500/70 uppercase tracking-widest">Ahorro Real</span>
                  </div>
                </div>
                <p className="text-xs text-gray-400 mt-6">*Cálculo basado en el nivel Flor VIP (5%). Nivel Semilla acumularía {Math.floor(spendAmount * 0.01)} puntos.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Niveles del Club */}
      <section className="py-24 bg-gray-900 relative overflow-hidden">
        {/* Decorative blobs */}
        <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-[#FF2651]/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2 pointer-events-none"></div>
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-purple-500/10 rounded-full blur-3xl translate-x-1/2 translate-y-1/2 pointer-events-none"></div>

        <div className="container mx-auto px-4 max-w-7xl relative z-10">
          <div className="text-center mb-16 md:mb-24">
            <h2 className="text-3xl md:text-5xl font-black text-white mb-6 tracking-tight">Tus Beneficios Crecen Contigo</h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">A medida que compras, subes de nivel y desbloqueas privilegios cada vez más exclusivos.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
            
            {/* Nivel Semilla */}
            <div className="bg-[#1A1A1A] rounded-[32px] p-8 border border-white/10 hover:border-white/20 transition-all flex flex-col">
              <div className="w-16 h-16 bg-green-500/10 rounded-2xl flex items-center justify-center text-green-400 mb-6"><Sprout className="w-8 h-8" /></div>
              <h3 className="text-3xl font-black text-white mb-2">Semilla</h3>
              <p className="text-gray-400 text-sm mb-8 font-medium bg-black/30 inline-block px-3 py-1 rounded-full self-start">Nivel Inicial • Gratis</p>
              
              <ul className="space-y-5 mb-8 flex-grow">
                <li className="flex items-start gap-3 text-gray-300">
                  <Check className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                  <span>Acumula <strong>1%</strong> en puntos (1 pt por cada $100)</span>
                </li>
                <li className="flex items-start gap-3 text-gray-300">
                  <Check className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                  <span>Acceso al programa de referidos</span>
                </li>
              </ul>
              
              {!user && (
                <a href="/login" className="w-full block text-center bg-white/5 hover:bg-white/10 text-white font-bold py-4 rounded-xl transition-colors border border-white/10">
                  Comenzar en Semilla
                </a>
              )}
            </div>

            {/* Nivel Brote */}
            <div className="bg-gradient-to-b from-[#2A1A1F] to-[#1A1A1A] rounded-[32px] p-8 border border-[#FF2651]/40 shadow-[0_0_40px_rgba(255,38,81,0.15)] relative transform md:-translate-y-6 flex flex-col">
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-[#FF2651] to-orange-500 text-white text-xs font-black px-6 py-2 rounded-full uppercase tracking-widest shadow-lg">
                Más Popular
              </div>
              <div className="w-16 h-16 bg-[#FF2651]/20 rounded-2xl flex items-center justify-center text-[#FF2651] mb-6 mt-2"><Leaf className="w-8 h-8" /></div>
              <h3 className="text-3xl font-black text-white mb-2">Brote</h3>
              <p className="text-gray-400 text-sm mb-8 font-medium bg-black/30 inline-block px-3 py-1 rounded-full self-start">Desde tu 3ra compra</p>
              
              <ul className="space-y-5 mb-8 flex-grow">
                <li className="flex items-start gap-3 text-white">
                  <Check className="w-5 h-5 text-[#FF2651] flex-shrink-0 mt-0.5" />
                  <span>Acumula <strong className="text-[#FF2651]">2%</strong> en puntos</span>
                </li>
                <li className="flex items-start gap-3 text-white">
                  <Check className="w-5 h-5 text-[#FF2651] flex-shrink-0 mt-0.5" />
                  <span><strong>Envío gratis</strong> en comunas seleccionadas</span>
                </li>
                <li className="flex items-start gap-3 text-gray-300">
                  <Check className="w-5 h-5 text-[#FF2651] flex-shrink-0 mt-0.5" />
                  <span>Atención prioritaria por WhatsApp</span>
                </li>
              </ul>
            </div>

            {/* Nivel Flor VIP (Premium Dark Theme) */}
            <div className="bg-gradient-to-br from-[#1A1423] via-[#110D17] to-black rounded-[32px] p-8 border border-purple-500/30 shadow-[0_0_40px_rgba(168,85,247,0.2)] relative overflow-hidden flex flex-col group hover:border-purple-500/60 transition-colors">
              <div className="absolute top-0 right-0 p-4 opacity-[0.03] group-hover:opacity-[0.05] transition-opacity"><Crown className="w-48 h-48" /></div>
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-2xl flex items-center justify-center text-white mb-6 shadow-lg shadow-purple-500/30">
                <Crown className="w-8 h-8" />
              </div>
              <h3 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-300 via-pink-300 to-yellow-200 mb-2">Flor VIP</h3>
              <p className="text-purple-200/60 text-sm mb-8 font-medium bg-purple-900/20 border border-purple-500/20 inline-block px-3 py-1 rounded-full self-start">10+ compras anuales</p>
              
              <ul className="space-y-5 mb-8 flex-grow relative z-10">
                <li className="flex items-start gap-3 text-white">
                  <Check className="w-5 h-5 text-purple-400 flex-shrink-0 mt-0.5" />
                  <span>Acumula <strong className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-200 to-yellow-500">5%</strong> en puntos</span>
                </li>
                <li className="flex items-start gap-3 text-white">
                  <Check className="w-5 h-5 text-purple-400 flex-shrink-0 mt-0.5" />
                  <span>Envíos <strong>nocturnos gratuitos</strong></span>
                </li>
                <li className="flex items-start gap-3 text-white">
                  <Check className="w-5 h-5 text-purple-400 flex-shrink-0 mt-0.5" />
                  <span>Catálogo VIP con <strong>diseños exclusivos</strong></span>
                </li>
                <li className="flex items-start gap-3 text-white">
                  <Check className="w-5 h-5 text-purple-400 flex-shrink-0 mt-0.5" />
                  <span>Regalo sorpresa en tu cumpleaños</span>
                </li>
              </ul>
            </div>

          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-24 bg-[#FDFBF7]">
        <div className="container mx-auto px-4 max-w-3xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-4">Preguntas Frecuentes</h2>
            <p className="text-gray-500 text-lg">Todo lo que necesitas saber sobre el Club Chileflor.</p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div 
                key={index} 
                className={`bg-white border rounded-2xl transition-all duration-300 overflow-hidden ${openFaq === index ? 'border-[#FF2651] shadow-md' : 'border-gray-200 hover:border-gray-300'}`}
              >
                <button 
                  onClick={() => setOpenFaq(openFaq === index ? null : index)}
                  className="w-full flex items-center justify-between p-6 text-left focus:outline-none"
                >
                  <span className={`font-bold text-lg ${openFaq === index ? 'text-[#FF2651]' : 'text-gray-900'}`}>
                    {faq.q}
                  </span>
                  <ChevronDown className={`w-5 h-5 transition-transform duration-300 ${openFaq === index ? 'rotate-180 text-[#FF2651]' : 'text-gray-400'}`} />
                </button>
                <div 
                  className={`px-6 transition-all duration-300 ease-in-out ${openFaq === index ? 'pb-6 opacity-100 max-h-40' : 'max-h-0 opacity-0 overflow-hidden'}`}
                >
                  <p className="text-gray-600 leading-relaxed">{faq.a}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="py-12 bg-[#FDFBF7]">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="bg-gradient-to-br from-gray-900 via-[#111] to-gray-900 rounded-[40px] p-10 md:p-20 shadow-2xl relative overflow-hidden text-center">
            <div className="absolute top-0 right-0 w-96 h-96 bg-[#FF2651] opacity-20 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2"></div>
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-600 opacity-20 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/2"></div>
            
            <div className="relative z-10">
              <Shield className="w-20 h-20 text-white/20 mx-auto mb-8" />
              <h2 className="text-4xl md:text-5xl font-black text-white mb-6 tracking-tight">Tu lealtad tiene recompensa</h2>
              <p className="text-gray-300 text-xl mb-12 max-w-2xl mx-auto leading-relaxed">
                No pierdas la oportunidad de ganar en cada regalo. Al unirte, recibirás beneficios inmediatos para tu primera compra.
              </p>
              
              {!user ? (
                <a href="/login" className="inline-block bg-[#FF2651] hover:bg-[#E01E42] text-white font-black px-12 py-5 rounded-2xl shadow-[0_10px_30px_rgba(255,38,81,0.4)] hover:shadow-[0_15px_40px_rgba(255,38,81,0.6)] hover:-translate-y-1 transition-all text-lg">
                  Crear mi cuenta gratis
                </a>
              ) : (
                <a href="/mi-cuenta" className="inline-block bg-white hover:bg-gray-100 text-gray-900 font-black px-12 py-5 rounded-2xl shadow-xl hover:-translate-y-1 transition-all text-lg">
                  Ir a mi Panel de Puntos
                </a>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
