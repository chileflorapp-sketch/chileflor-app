'use client';
import { ArrowRight } from 'lucide-react';

export default function RaspeBanner() {
  return (
    <section className="container mx-auto px-4 py-8 reveal">
      <div className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-rose-700 via-pink-600 to-red-600 p-8 md:p-14 text-white shadow-2xl flex flex-col md:flex-row items-center justify-between gap-10 border-4 border-rose-400/30">

        <div className="absolute -left-20 -bottom-20 w-64 h-64 bg-white/20 rounded-full blur-3xl animate-blob" />
        <div className="absolute right-10 top-10 w-40 h-40 bg-yellow-300/40 rounded-full blur-2xl animate-pulse" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />

        <div className="relative z-10 max-w-xl text-center md:text-left">
          <div className="inline-block bg-gradient-to-r from-yellow-300 to-yellow-500 text-yellow-950 font-black px-5 py-1.5 rounded-full text-xs uppercase tracking-widest mb-6 shadow-lg shadow-yellow-500/30 animate-bounce">
            🎟️ Promoción Exclusiva en Local
          </div>
          <h2 className="text-4xl md:text-6xl font-black leading-tight mb-4 tracking-tighter drop-shadow-xl" style={{ textShadow: '2px 4px 10px rgba(0,0,0,0.3)' }}>
            ¡Ven por tu <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-b from-yellow-200 via-yellow-400 to-yellow-600 drop-shadow-sm font-extrabold uppercase tracking-tighter">
              Raspe y Gana!
            </span>
          </h2>
          <p className="text-white/95 text-base md:text-lg mb-8 leading-relaxed font-medium max-w-md mx-auto md:mx-0 drop-shadow">
            Realiza tu compra en nuestro local y exige tu tarjeta oficial de <strong className="text-yellow-300">Chileflor</strong>. ¡Hay miles de premios instantáneos, descuentos y flores gratis!
            <br /><br />
            <strong className="text-white bg-black/20 px-3 py-1.5 rounded-lg border border-white/10 inline-block text-sm font-bold">
              📍 Ubicación: A un costado del estacionamiento del Cementerio Parque El Prado, Local 4. ¡Preguntar por Paco!
            </strong>
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
            <a href="https://www.google.com/maps/search/?api=1&query=Cementerio+Parque+El+Prado" target="_blank" rel="noreferrer" className="bg-white text-rose-700 hover:bg-gray-50 font-black px-8 py-4 rounded-2xl shadow-xl transition-all hover:-translate-y-1 hover:shadow-2xl text-sm md:text-base flex items-center justify-center gap-2 group">
              🗺️ Abrir en Google Maps <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </a>
          </div>
        </div>

        {/* Tarjeta visual Raspe y Gana */}
        <div className="relative z-10 flex-shrink-0 w-64 h-64 md:w-80 md:h-96 hidden sm:flex items-center justify-center">
          <div className="absolute inset-0 bg-white rounded-3xl shadow-xl -rotate-12 transform scale-90 translate-x-4 translate-y-4 border-[8px] border-white opacity-50 -z-10" />
          <div className="relative w-[220px] h-[320px] bg-gradient-to-br from-rose-100 to-pink-50 rounded-3xl shadow-2xl rotate-6 transform hover:rotate-2 hover:scale-105 transition-all duration-500 border-8 border-white overflow-hidden flex flex-col p-4 group cursor-pointer">
            <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-rose-400 via-transparent to-transparent" />
            <div className="w-full relative z-10 flex flex-col items-center">
              <h3 className="text-rose-700 font-black text-2xl tracking-tighter leading-none mb-1 drop-shadow-sm">chileflor</h3>
              <p className="text-[8px] text-rose-500 font-bold uppercase tracking-widest mb-4">Contigo Siempre</p>
            </div>
            <div className="w-full text-center relative z-10 mb-4">
              <h4 className="text-transparent bg-clip-text bg-gradient-to-b from-yellow-400 to-yellow-600 font-black text-3xl italic tracking-tighter drop-shadow-sm leading-none">¡RASPA</h4>
              <h4 className="text-transparent bg-clip-text bg-gradient-to-b from-yellow-400 to-yellow-600 font-black text-3xl italic tracking-tighter drop-shadow-sm leading-none -mt-1">Y GANA!</h4>
            </div>
            <div className="flex-1 w-full bg-white rounded-full border-4 border-dashed border-rose-300 flex items-center justify-center flex-col relative overflow-hidden shadow-inner mb-2 aspect-square">
              <div className="absolute inset-0 bg-gradient-to-br from-gray-300 via-gray-400 to-gray-500 z-10 transition-all duration-1000 group-hover:opacity-0 flex items-center justify-center overflow-hidden">
                <span className="text-gray-100/80 font-black text-lg transform -rotate-12 bg-gray-600/50 px-3 py-1 rounded-full backdrop-blur-sm shadow-inner uppercase tracking-wider border border-gray-400/50">RASPA AQUÍ</span>
              </div>
              <span className="text-4xl mb-1 animate-bounce">🎁</span>
              <span className="text-rose-600 font-black text-center leading-tight text-sm">¡GANASTE<br />UN DESCUENTO!</span>
            </div>
            <p className="text-[6px] text-center text-rose-800/60 font-bold mt-auto leading-tight px-2">
              *Válido solo para compras presenciales en local. Consulta bases y condiciones.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
