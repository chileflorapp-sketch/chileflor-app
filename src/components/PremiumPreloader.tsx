'use client';

import { useEffect, useState } from 'react';

export default function PremiumPreloader() {
  const [loading, setLoading] = useState(true);
  const [fade, setFade] = useState(false);

  useEffect(() => {
    // Evitar que el scroll funcione mientras carga
    document.body.style.overflow = 'hidden';

    // Tiempo de carga (ej. 2 segundos)
    const timer = setTimeout(() => {
      setFade(true); // Comienza la animación de salida
      setTimeout(() => {
        setLoading(false); // Quita el componente del DOM
        document.body.style.overflow = 'auto'; // Restaura el scroll
      }, 800); // 800ms es lo que dura la transición CSS
    }, 1800);

    return () => {
      clearTimeout(timer);
      document.body.style.overflow = 'auto';
    };
  }, []);

  if (!loading) return null;

  return (
    <div 
      className={`fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#0a0a0c] transition-opacity duration-700 ease-in-out ${
        fade ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
    >
      {/* Contenedor del Logo con animación de respiración sutil */}
      <div className="relative animate-pulse-slow">
        <h1 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-[#FF2651] to-[#FF5E7E] tracking-tight">
          chileflor
        </h1>
        {/* Un destello sutil pasando por el texto */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full animate-shimmer" />
      </div>
      
      {/* Línea de carga muy fina abajo */}
      <div className="mt-8 w-48 h-[2px] bg-gray-800 rounded-full overflow-hidden">
        <div className="h-full bg-primary rounded-full animate-progress-bar"></div>
      </div>
    </div>
  );
}
