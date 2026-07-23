import React from 'react';
import Image from 'next/image';

export default function SubscriptionBanner({ config }: { config?: any }) {
  const badge = config?.badge || 'PLAN RECOMENDADO';
  const title = config?.title || 'Suscripción Bimensual';
  const description = config?.description || 'Despreocúpate. Nuestro equipo visitará la sepultura de tu ser querido dos veces al mes para mantenerla impecable.';
  const image = config?.image || '/slider/slider2.png';
  const features = config?.features || [
    'Limpieza profunda de lápida.',
    'Recambio de flores frescas de temporada.',
    'Evidencia fotográfica enviada a tu celular.'
  ];
  const priceLabel = config?.priceLabel || 'Valor por visita';
  const price = config?.price || '$25.990';
  const priceSubtext = config?.priceSubtext || 'Cobro por visita realizada.';
  const buttonText = config?.buttonText || 'Suscribirse Ahora';
  const buttonLink = config?.buttonLink || '/cementerios/suscripcion';

  return (
    <div className="bg-[#1C202B] rounded-[2rem] p-8 md:p-12 text-white shadow-xl flex flex-col lg:flex-row items-center justify-between gap-8 w-full relative overflow-hidden">
      
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gradient-to-bl from-pink-500/10 to-transparent rounded-full -translate-y-1/2 translate-x-1/3 pointer-events-none blur-3xl"></div>

      {/* Image Reference */}
      <div className="w-full md:w-[280px] lg:w-[320px] h-[240px] md:h-[320px] rounded-3xl overflow-hidden shrink-0 shadow-lg relative z-10">
        <Image 
          src={image} 
          alt={title} 
          fill 
          sizes="(max-width: 768px) 100vw, 320px"
          quality={85}
          className="object-cover" 
        />
      </div>

      {/* Center Content */}
      <div className="flex-1 z-10">
        <div className="inline-block px-3 py-1 rounded-full border border-pink-500/30 bg-pink-500/10 text-pink-400 text-[10px] font-bold tracking-wider mb-6 uppercase">
          {badge}
        </div>
        
        <h2 className="text-3xl md:text-4xl font-bold mb-4 tracking-tight text-white">
          {title}
        </h2>
        
        <p className="text-gray-400 text-lg mb-8 max-w-lg leading-relaxed">
          {description}
        </p>

        <ul className="space-y-4">
          {features.map((item: string, index: number) => (
            <li key={index} className="flex items-start gap-3 text-gray-300">
              <svg className="w-5 h-5 text-pink-500 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
              </svg>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Right Content (Pricing Card) */}
      <div className="w-full lg:w-[320px] bg-white rounded-3xl p-8 text-center text-gray-900 shadow-2xl relative z-10 shrink-0">
        <p className="text-[11px] font-bold text-gray-400 tracking-widest uppercase mb-2">
          {priceLabel}
        </p>
        <div className="text-5xl font-black mb-2 tracking-tighter text-[#1C202B]">
          {price}
        </div>
        <p className="text-sm text-gray-500 mb-8 font-medium">
          {priceSubtext}
        </p>
        
        <a href={buttonLink} className="w-full bg-[#FF2D55] hover:bg-[#E0264A] text-white font-bold py-4 px-6 rounded-2xl transition-all shadow-lg shadow-[#FF2D55]/30 active:scale-95 text-lg flex justify-center items-center gap-2">
          {buttonText}
        </a>
      </div>
    </div>
  );
}
