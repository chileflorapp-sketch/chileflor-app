'use client';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import { ShoppingBag } from 'lucide-react';

export default function HeroSlider({ config, timings }: { config?: any[], timings?: any }) {
  const [current, setCurrent] = useState(0);

  const slides = config || [];
  const transitionTime = timings?.heroSliderTransition || 5000;

  useEffect(() => {
    if (slides.length <= 1) return;
    const timer = setInterval(() => {
      setCurrent((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
    }, transitionTime);
    return () => clearInterval(timer);
  }, [slides.length, transitionTime]);

  if (slides.length === 0) return null;

  return (
    <section className="relative w-full h-[65vh] md:h-[80vh] min-h-[500px] overflow-hidden bg-gray-900 group">
      
      {/* Slides */}
      {slides.map((slide, index) => (
        <div 
          key={slide.id || index}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${index === current ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'}`}
        >
          {/* Background Image */}
          <div className="absolute inset-0">
             {slide.image && (
               <Image 
                 src={slide.image} 
                 alt={slide.title || 'Slide background'} 
                 fill
                 priority={index === 0}
                 sizes="100vw"
                 quality={85}
                 className={`object-cover transition-transform duration-[10000ms] ease-out ${index === current ? 'scale-110' : 'scale-100'}`} 
               />
             )}
             <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent"></div>
             <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
          </div>
          
          {/* Content */}
          <div className="container mx-auto px-4 md:px-8 h-full flex items-center relative z-20">
            <div className="max-w-2xl text-left mt-16 md:mt-0">
              <h2 className="text-4xl md:text-6xl lg:text-7xl font-bold font-serif text-white mb-6 leading-tight drop-shadow-2xl">
                {slide.title}
              </h2>
              <p className="text-lg md:text-2xl text-gray-200 mb-8 max-w-xl font-medium drop-shadow-lg leading-relaxed">
                {slide.subtitle}
              </p>
              
              <div className="flex gap-4">
                <a href={slide.buttonLink} className="inline-flex items-center gap-2 bg-primary hover:bg-[#d61e42] text-white font-bold px-8 py-4 rounded-full transition-all duration-300 shadow-xl shadow-primary/30 hover:-translate-y-1">
                  <ShoppingBag className="w-5 h-5" />
                  {slide.buttonText}
                </a>
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* Flechas de Navegación */}
      <button 
        onClick={() => setCurrent(current === 0 ? slides.length - 1 : current - 1)}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-40 w-12 h-12 flex items-center justify-center bg-black/20 hover:bg-black/50 text-white rounded-full backdrop-blur-sm transition-all md:opacity-0 md:group-hover:opacity-100"
        aria-label="Anterior"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
      </button>
      <button 
        onClick={() => setCurrent(current === slides.length - 1 ? 0 : current + 1)}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-40 w-12 h-12 flex items-center justify-center bg-black/20 hover:bg-black/50 text-white rounded-full backdrop-blur-sm transition-all md:opacity-0 md:group-hover:opacity-100"
        aria-label="Siguiente"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
      </button>

      {/* Slide Indicators */}
      <div className="absolute bottom-8 left-0 right-0 z-30 flex justify-center gap-3">
        {slides.map((_, index) => (
          <button 
            key={index}
            onClick={() => setCurrent(index)}
            className={`transition-all duration-500 rounded-full h-1.5 ${index === current ? 'bg-primary w-8 shadow-[0_0_10px_rgba(255,38,81,0.8)]' : 'bg-white/40 hover:bg-white w-2'}`}
            aria-label={`Ir al slide ${index + 1}`}
          />
        ))}
      </div>
      
    </section>
  );
}
