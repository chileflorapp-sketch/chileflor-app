'use client';
import { useState, useEffect } from 'react';

export default function WelcomeBanner() {
  const [userName, setUserName] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const storedName = localStorage.getItem('userName');
    if (storedName) {
      setUserName(storedName);
    }
  }, []);

  if (!mounted) return null; // Prevenir errores de hidratación en Next.js

  if (userName) {
    return (
      <section className="container mx-auto px-4 py-8">
        <div className="bg-gradient-to-r from-primary/10 to-pink-50 rounded-3xl p-8 flex flex-col md:flex-row items-center justify-between border border-primary/20 shadow-sm animate-in fade-in zoom-in duration-500">
          <div>
            <h2 className="text-2xl md:text-3xl font-extrabold text-gray-900 tracking-tight">
              ¡Qué alegría verte de nuevo, {userName.split(' ')[0]}! <span className="inline-block animate-bounce">👋</span>
            </h2>
            <p className="text-gray-600 mt-2 text-lg">Tenemos nuevas colecciones esperándote con envíos prioritarios por ser miembro.</p>
          </div>
          <a href="/catalogo" className="mt-6 md:mt-0 bg-primary text-white font-bold text-lg px-8 py-4 rounded-full shadow-[0_10px_25px_-5px_rgba(255,38,81,0.4)] hover:bg-primary-dark hover:-translate-y-1 transition-all whitespace-nowrap">
            Ver Novedades
          </a>
        </div>
      </section>
    );
  }

  return (
    <section className="container mx-auto px-4 py-8">
      <div className="bg-gray-900 rounded-3xl p-8 flex flex-col md:flex-row items-center justify-between overflow-hidden relative shadow-xl min-h-[300px]">
        {/* Imagen de Fondo */}
        <div className="absolute inset-0 z-0">
          <img 
            src="/banner_miembro.png" 
            alt="Fondo Membresía" 
            className="w-full h-full object-cover opacity-60 mix-blend-overlay md:opacity-100 md:mix-blend-normal"
          />
          {/* Gradiente para asegurar lectura de texto */}
          <div className="absolute inset-0 bg-gradient-to-r from-gray-900 via-gray-900/80 to-transparent md:to-transparent/20"></div>
        </div>

        <div className="relative z-10 md:pr-12 md:max-w-xl">
          <div className="inline-flex items-center gap-2 bg-black/40 backdrop-blur px-3 py-1 rounded-full text-white text-xs font-bold mb-4 border border-white/20">
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span> Club Chileflor
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-white tracking-tight drop-shadow-md">¿Aún no eres miembro?</h2>
          <p className="text-gray-200 mt-3 text-lg drop-shadow">Regístrate en segundos y accede a envíos rápidos, seguimiento en vivo y dedicatorias asistidas por IA.</p>
        </div>
        <a href="/registro" className="relative z-10 mt-8 md:mt-0 bg-primary hover:bg-primary-dark text-white font-extrabold text-lg px-8 py-4 rounded-full shadow-lg shadow-primary/30 hover:-translate-y-1 transition-all whitespace-nowrap">
          Crear Cuenta Gratis
        </a>
      </div>
    </section>
  );
}
