'use client';
import { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

interface Slide {
  id: number;
  tag: string;
  title: string;
  subtitle: string;
  media: string;
  type: string;
  primaryLink: string;
  primaryText: string;
  secondaryLink?: string;
  secondaryText?: string;
}

export default function HeroSlider() {
  const [slides, setSlides] = useState<Slide[]>([]);
  const [current, setCurrent] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  const heroRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const fetchSlides = async () => {
      try {
        const response = await fetch(`/slider/config.json?v=${Date.now()}`, {
          cache: 'no-store'
        });
        const data = await response.json();
        setSlides(data);
      } catch (error) {
        console.error("Error cargando los sliders:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchSlides();
  }, []);

  // Animación GSAP (Antigravedad y Parallax) - SOLO PARA HERO SI ES NECESARIO
  // Eliminamos el efecto del ramo a pedido del usuario.
  useEffect(() => {
    // Si necesitas animar el hero con scroll en el futuro, hazlo aquí.
  }, [isLoading]);

  // Animación del slider
  useEffect(() => {
    if (slides.length <= 1 || isHovered) return;
    
    const timer = setInterval(() => {
      setCurrent((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
    }, 6000);
    return () => clearInterval(timer);
  }, [slides.length, isHovered]);

  if (isLoading) {
    return (
      <section className="relative w-full h-[100svh] min-h-[600px] overflow-hidden bg-[#FDFBF7] flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </section>
    );
  }

  if (slides.length === 0) return null;

  return (
    <section 
      ref={heroRef}
      className="relative w-full h-[100svh] min-h-[600px] overflow-hidden bg-[#1A1A1A] group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Slides (Capa 0 y 1) */}
      {slides.map((slide, index) => (
        <div 
          key={slide.id}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${index === current ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'}`}
        >
          {/* Fondo Multimedia */}
          <div className="absolute inset-0">
             {slide.type === 'video' ? (
               <video 
                 src={slide.media} 
                 autoPlay 
                 loop 
                 muted 
                 playsInline 
                 className={`w-full h-full object-cover transition-transform duration-[10000ms] ${index === current ? 'scale-105' : 'scale-100'}`} 
               />
             ) : (
               <img 
                 src={slide.media} 
                 alt={slide.title} 
                 loading={index === 0 ? "eager" : "lazy"}
                 fetchPriority={index === 0 ? "high" : "low"}
                 className={`w-full h-full object-cover transition-transform duration-[10000ms] opacity-50 ${index === current ? 'scale-105' : 'scale-100'}`} 
               />
             )}
             <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent mix-blend-multiply"></div>
             <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
          </div>
          
          {/* Contenido (Textos - Capa 1) */}
          <div className="container mx-auto px-4 h-full flex flex-col justify-center relative z-20">
            <div className="max-w-2xl transform transition-all duration-700 translate-y-0">
              {slide.tag && (
                <span className="inline-block bg-primary text-white text-xs font-bold px-3 py-1 rounded-full mb-4 uppercase tracking-wider shadow-[0_0_15px_rgba(255,38,81,0.4)]">
                  {slide.tag}
                </span>
              )}
              <h1 className="text-4xl md:text-7xl font-black tracking-tight text-white mb-6 leading-tight drop-shadow-2xl">
                {slide.title}
              </h1>
              <p className="text-gray-200 text-lg md:text-2xl mb-10 max-w-xl drop-shadow-lg font-medium">
                {slide.subtitle}
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <a href={slide.primaryLink} className="bg-primary text-white text-center font-bold px-8 py-4 rounded-full shadow-[0_0_20px_rgba(255,38,81,0.5)] hover:bg-primary-dark transition-all hover:-translate-y-1 hover:shadow-[0_0_30px_rgba(255,38,81,0.7)]">
                  {slide.primaryText}
                </a>
                {slide.secondaryLink && slide.secondaryText && (
                  <a href={slide.secondaryLink} className="bg-white/10 backdrop-blur-md border border-white/20 text-white text-center font-medium px-8 py-4 rounded-full hover:bg-white/20 transition-all shadow-lg">
                    {slide.secondaryText}
                  </a>
                )}
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

      {/* Puntos de Navegación */}
      <div className="absolute bottom-8 left-0 right-0 z-40 flex justify-center gap-3">
        {slides.map((_, index) => (
          <button 
            key={index}
            onClick={() => setCurrent(index)}
            className={`w-3 h-3 rounded-full transition-all duration-300 shadow-sm ${index === current ? 'bg-primary w-8' : 'bg-white/50 hover:bg-white'}`}
            aria-label={`Ir al slide ${index + 1}`}
          />
        ))}
      </div>
    </section>
  );
}
