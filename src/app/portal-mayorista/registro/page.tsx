'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Sparkles, ArrowRight, ShieldCheck, Tag, Truck, CheckCircle2 } from 'lucide-react';

export default function B2BRegistrationPage() {
  const router = useRouter();
  const [contact, setContact] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!contact) return;
    setSubmitted(true);
    setTimeout(() => {
      router.push('/portal-mayorista/catalogo');
    }, 1500);
  };

  return (
    <div className="relative min-h-screen bg-[#0A0A0C] py-28 px-4 font-sans overflow-hidden flex items-center justify-center text-white">
      {/* Glow background effects */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-yellow-500/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-primary/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="container mx-auto max-w-4xl relative z-10">
        
        {/* Main Banner Card */}
        <div className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-[#141418] via-[#111114] to-[#0A0A0C] border border-yellow-500/20 shadow-[0_0_80px_rgba(234,179,8,0.15)] p-8 md:p-14 text-center">
          
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-yellow-500/10 border border-yellow-500/30 rounded-full text-xs font-extrabold tracking-widest uppercase mb-6 text-yellow-400 shadow-[0_0_20px_rgba(234,179,8,0.2)]">
            <Sparkles className="w-3.5 h-3.5" />
            Portal Mayorista B2B
          </div>

          {/* Main Title & Tagline */}
          <h1 className="text-4xl md:text-6xl font-black tracking-tight mb-4 leading-tight">
            Inscríbete y recibe los <br className="hidden md:block" />
            <span className="bg-gradient-to-r from-yellow-400 via-amber-300 to-yellow-500 bg-clip-text text-transparent">
              mejores precios
            </span>
          </h1>

          <p className="text-gray-400 text-base md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed">
            Accede a tarifas preferenciales por volumen, catálogo exclusivo de insumos y despacho prioritario para tu negocio o florería.
          </p>

          {/* Form Banner */}
          <div className="max-w-xl mx-auto mb-10">
            {submitted ? (
              <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-2xl p-6 text-center animate-in zoom-in-95 duration-300">
                <CheckCircle2 className="w-12 h-12 text-yellow-400 mx-auto mb-2 animate-bounce" />
                <h3 className="text-xl font-bold text-white mb-1">¡Inscripción recibida!</h3>
                <p className="text-yellow-400/90 text-sm font-medium">Redirigiéndote al catálogo mayorista...</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
                <input
                  type="text"
                  required
                  placeholder="Tu correo o WhatsApp empresarial..."
                  value={contact}
                  onChange={(e) => setContact(e.target.value)}
                  className="flex-1 bg-[#0A0A0C] border border-white/15 rounded-2xl px-6 py-4 text-white placeholder-gray-500 focus:outline-none focus:border-yellow-500 focus:ring-2 focus:ring-yellow-500/20 text-sm md:text-base transition-all"
                />
                <button
                  type="submit"
                  className="bg-gradient-to-r from-yellow-500 to-amber-500 hover:from-yellow-400 hover:to-amber-400 text-black font-black px-8 py-4 rounded-2xl transition-all shadow-[0_0_25px_rgba(234,179,8,0.4)] hover:scale-105 active:scale-95 text-sm md:text-base flex items-center justify-center gap-2"
                >
                  <span>Inscribirme Ahora</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            )}
          </div>

          {/* Direct Catalog Access Link */}
          <div className="pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs md:text-sm text-gray-400">
            <div className="flex items-center gap-6">
              <span className="flex items-center gap-1.5"><ShieldCheck className="w-4 h-4 text-yellow-400" /> Sin contratos</span>
              <span className="flex items-center gap-1.5"><Tag className="w-4 h-4 text-yellow-400" /> Precios por volumen</span>
              <span className="flex items-center gap-1.5"><Truck className="w-4 h-4 text-yellow-400" /> Envíos express</span>
            </div>
            
            <a
              href="/portal-mayorista/catalogo"
              className="text-yellow-400 font-bold hover:underline flex items-center gap-1 hover:text-yellow-300 transition-colors"
            >
              Ver catálogo sin esperar →
            </a>
          </div>

        </div>
      </div>
    </div>
  );
}
