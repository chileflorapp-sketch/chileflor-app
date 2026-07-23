'use client';
import { useState, useEffect } from 'react';

import Image from 'next/image';

const SLIDES = [
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
    primaryText: "Comprar Arreglos"
  },
  {
    id: 3,
    tag: "Innovación",
    title: "Únete al Club Chileflor",
    subtitle: "Acumula puntos con cada compra, obtén descuentos exclusivos y disfruta de beneficios pensados para ti.",
    media: "/slider/slider3.png",
    type: "image",
    primaryLink: "/club",
    primaryText: "Beneficios del Club"
  }
];

export default function InfoSlider({ config, timings }: { config?: any[], timings?: any }) {
  const [current, setCurrent] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  const slides = config || [];
  const transitionTime = timings?.infoSliderTransition || 5000;

  useEffect(() => {
    if (isHovered || slides.length <= 1) return;
    const timer = setInterval(() => {
      setCurrent((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
    }, transitionTime);
    return () => clearInterval(timer);
  }, [isHovered, slides.length, transitionTime]);

  if (slides.length === 0) return null;

  return (
    <section 
      className="relative w-full h-[500px] rounded-3xl overflow-hidden group shadow-xl"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {slides.map((slide, index) => (
        <div 
          key={slide.id}
          className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${index === current ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'}`}
        >
          {/* Background */}
          <div className="absolute inset-0">
             {slide.type === 'video' ? (
               <video 
                 src={slide.media} 
                 autoPlay 
                 loop 
                 muted 
                 playsInline 
                 className={`w-full h-full object-cover transition-transform duration-[8000ms] ${index === current ? 'scale-105' : 'scale-100'}`} 
               />
             ) : (
               slide.media && (
                 <Image 
                   src={slide.media} 
                   alt={slide.title || 'Info background'} 
                   fill
                   priority={index === 0}
                   sizes="(max-width: 768px) 100vw, 1024px"
                   quality={85}
                   className={`object-cover transition-transform duration-[8000ms] ${index === current ? 'scale-105' : 'scale-100'}`} 
                 />
               )
             )}
             <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-black/10 to-transparent mix-blend-multiply"></div>
             <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent"></div>
          </div>
          
          {/* Content */}
          <div className="container mx-auto px-6 md:px-12 h-full flex flex-col justify-center relative z-20">
            <div className="max-w-xl">
              {slide.tag && (
                <span className="inline-block bg-primary text-white text-[10px] md:text-xs font-bold px-3 py-1 rounded-full mb-3 uppercase tracking-wider shadow-sm">
                  {slide.tag}
                </span>
              )}
              <h2 className="text-3xl md:text-5xl font-black tracking-tight text-white mb-4 leading-tight drop-shadow-[0_5px_15px_rgba(0,0,0,0.6)]">
                {slide.title}
              </h2>
              <p className="text-white text-base md:text-xl mb-8 drop-shadow-[0_4px_8px_rgba(0,0,0,0.8)] font-medium">
                {slide.subtitle}
              </p>
              <div className="flex flex-wrap gap-3">
                <a href={slide.primaryLink} className="bg-primary text-white text-sm font-bold px-6 py-3 rounded-xl shadow-[0_0_20px_rgba(255,38,81,0.5)] hover:bg-primary-dark transition-all hover:-translate-y-1 hover:shadow-[0_0_30px_rgba(255,38,81,0.7)]">
                  {slide.primaryText}
                </a>
                {slide.secondaryLink && slide.secondaryText && (
                  <a href={slide.secondaryLink} className="bg-white/10 backdrop-blur border border-white/20 text-white text-sm font-bold px-6 py-3 rounded-xl hover:bg-white/20 transition-all">
                    {slide.secondaryText}
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* Nav Buttons */}
      <button 
        onClick={() => setCurrent(current === 0 ? slides.length - 1 : current - 1)}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-30 w-10 h-10 flex items-center justify-center bg-white/10 hover:bg-white/30 text-white rounded-full backdrop-blur-md transition-all opacity-0 group-hover:opacity-100"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
      </button>
      <button 
        onClick={() => setCurrent(current === slides.length - 1 ? 0 : current + 1)}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-30 w-10 h-10 flex items-center justify-center bg-white/10 hover:bg-white/30 text-white rounded-full backdrop-blur-md transition-all opacity-0 group-hover:opacity-100"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
      </button>

      {/* Dots */}
      <div className="absolute bottom-6 left-0 right-0 z-30 flex justify-center gap-2">
        {slides.map((_, index) => (
          <button 
            key={index}
            onClick={() => setCurrent(index)}
            className={`h-2 rounded-full transition-all duration-300 shadow-sm ${index === current ? 'bg-primary w-6' : 'bg-white/50 hover:bg-white w-2'}`}
          />
        ))}
      </div>
    </section>
  );
}
