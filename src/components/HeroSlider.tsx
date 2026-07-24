'use client';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import { ShoppingBag, ArrowRight, Star } from 'lucide-react';

export default function HeroSlider({ config, timings }: { config?: any[], timings?: any }) {
  const [current, setCurrent] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  const slides = config || [];
  const transitionTime = timings?.heroSliderTransition || 5500;

  useEffect(() => {
    setIsVisible(true);
    if (slides.length <= 1) return;
    const timer = setInterval(() => {
      setIsVisible(false);
      setTimeout(() => {
        setCurrent(prev => (prev === slides.length - 1 ? 0 : prev + 1));
        setIsVisible(true);
      }, 300);
    }, transitionTime);
    return () => clearInterval(timer);
  }, [slides.length, transitionTime]);

  if (slides.length === 0) return null;

  return (
    <section className="relative w-full h-[75vh] md:h-[90vh] min-h-[560px] overflow-hidden bg-gray-900 group">

      {/* Progress bar */}
      <div className="absolute top-0 left-0 right-0 z-50 h-0.5 bg-white/10">
        <div
          key={current}
          className="h-full bg-primary origin-left animate-progress-bar"
          style={{ animationDuration: `${transitionTime}ms` }}
        />
      </div>

      {/* Slides */}
      {slides.map((slide, index) => (
        <div
          key={slide.id || index}
          className={`absolute inset-0 transition-all duration-1000 ease-in-out ${
            index === current ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
          }`}
        >
          {/* Background Image with Ken Burns */}
          <div className="absolute inset-0">
            {slide.image && (
              <Image
                src={slide.image}
                alt={slide.title || 'Slide background'}
                fill
                priority={index === 0}
                sizes="100vw"
                quality={90}
                className={`object-cover transition-transform duration-[12000ms] ease-out ${
                  index === current ? 'scale-110' : 'scale-100'
                }`}
              />
            )}
            {/* Multi-layer gradients for dramatic depth */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/50 to-black/10" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
            {/* Subtle vignette */}
            <div className="absolute inset-0" style={{background: 'radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.4) 100%)'}} />
          </div>

          {/* Content */}
          <div className="container mx-auto px-4 md:px-10 h-full flex items-center pt-28 md:pt-36 pb-12 relative z-20">
            <div className={`max-w-3xl text-left transition-all duration-700 delay-200 ${
              index === current && isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}>

              {/* Badge */}
              <div className="inline-flex items-center gap-2 bg-primary/90 backdrop-blur-md text-white text-xs font-bold uppercase tracking-widest px-4 py-2 rounded-full mb-6 shadow-lg border border-primary-light/30">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
                </span>
                {slide.badge || '⚡ Entrega Hoy Disponible'}
              </div>

              {/* Title with staggered reveal */}
              <h1 className="text-5xl md:text-6xl lg:text-8xl font-bold font-serif text-white mb-5 leading-[1.05] drop-shadow-2xl">
                {slide.title}
              </h1>

              <p className="text-lg md:text-xl lg:text-2xl text-gray-200/90 mb-8 max-w-2xl font-medium leading-relaxed drop-shadow-lg">
                {slide.subtitle}
              </p>

              {/* Social proof */}
              <div className="flex items-center gap-3 mb-8">
                <div className="flex -space-x-2">
                  {['bg-rose-400', 'bg-pink-500', 'bg-fuchsia-500', 'bg-purple-500', 'bg-indigo-500'].map((c, i) => (
                    <div key={i} className={`w-8 h-8 rounded-full ${c} border-2 border-white flex items-center justify-center text-white text-[10px] font-bold`}>
                      {['M','J','C','A','L'][i]}
                    </div>
                  ))}
                </div>
                <div className="text-white/80 text-sm">
                  <div className="flex gap-0.5 mb-0.5">
                    {[1,2,3,4,5].map(i => <Star key={i} className="w-3 h-3 text-yellow-400 fill-yellow-400" />)}
                  </div>
                  <span className="text-xs">+5.000 clientes satisfechos</span>
                </div>
              </div>

              {/* CTA buttons */}
              <div className="flex flex-wrap gap-4">
                <a
                  href={slide.buttonLink || '/catalogo'}
                  className="inline-flex items-center gap-2.5 bg-primary hover:bg-primary-dark text-white font-bold px-8 py-4 rounded-full transition-all duration-300 shadow-2xl shadow-primary/40 hover:-translate-y-1 hover:shadow-primary/60 text-base"
                >
                  <ShoppingBag className="w-5 h-5" />
                  {slide.buttonText || 'Ver Catálogo'}
                </a>
                <a
                  href="/catalogo"
                  className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 backdrop-blur-md text-white font-bold px-8 py-4 rounded-full border border-white/20 transition-all duration-300 hover:-translate-y-1 text-base"
                >
                  Ver colección
                  <ArrowRight className="w-5 h-5" />
                </a>
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* Navigation arrows */}
      <button
        onClick={() => setCurrent(current === 0 ? slides.length - 1 : current - 1)}
        className="absolute left-4 md:left-6 top-1/2 -translate-y-1/2 z-40 w-12 h-12 flex items-center justify-center bg-black/30 hover:bg-primary text-white rounded-full backdrop-blur-sm transition-all duration-300 md:opacity-0 md:group-hover:opacity-100 border border-white/10 hover:border-primary hover:scale-110"
        aria-label="Anterior"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
        </svg>
      </button>
      <button
        onClick={() => setCurrent(current === slides.length - 1 ? 0 : current + 1)}
        className="absolute right-4 md:right-6 top-1/2 -translate-y-1/2 z-40 w-12 h-12 flex items-center justify-center bg-black/30 hover:bg-primary text-white rounded-full backdrop-blur-sm transition-all duration-300 md:opacity-0 md:group-hover:opacity-100 border border-white/10 hover:border-primary hover:scale-110"
        aria-label="Siguiente"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
        </svg>
      </button>

      {/* Slide number + indicators */}
      <div className="absolute bottom-8 left-0 right-0 z-30 flex items-center justify-center gap-4">
        <span className="text-white/40 text-xs font-mono hidden md:block">
          {String(current + 1).padStart(2, '0')} / {String(slides.length).padStart(2, '0')}
        </span>
        <div className="flex gap-2">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrent(index)}
              className={`transition-all duration-500 rounded-full h-1.5 ${
                index === current
                  ? 'bg-primary w-10 shadow-[0_0_15px_rgba(255,38,81,0.8)]'
                  : 'bg-white/30 hover:bg-white/60 w-2'
              }`}
              aria-label={`Ir al slide ${index + 1}`}
            />
          ))}
        </div>
      </div>

      {/* Floating decorative flower petal elements */}
      <div className="absolute bottom-16 right-8 md:right-16 z-20 hidden md:block pointer-events-none">
        <div className="text-4xl animate-float opacity-60">🌸</div>
      </div>
      <div className="absolute top-24 right-24 z-20 hidden md:block pointer-events-none">
        <div className="text-3xl animate-float-delay opacity-30">🌿</div>
      </div>

    </section>
  );
}
