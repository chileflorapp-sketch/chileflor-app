'use client';
import { useState, useEffect } from 'react';
import { ArrowRight } from 'lucide-react';

export default function UrgencyBar({ config }: { config?: any }) {
  const [timeLeft, setTimeLeft] = useState({ h: config?.hours || 5, m: 47, s: 33 });

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft(prev => {
        let { h, m, s } = prev;
        s--;
        if (s < 0) { s = 59; m--; }
        if (m < 0) { m = 59; h--; }
        if (h < 0) { h = 23; m = 59; s = 59; }
        return { h, m, s };
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const pad = (n: number) => String(n).padStart(2, '0');

  return (
    <div className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 border-b border-gray-700 py-2.5 px-4 relative z-20">
      <div className="container mx-auto flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-6 text-white text-sm">
        <div className="flex items-center gap-2">
          <span className="relative flex w-2 h-2">
            <span className="animate-ring absolute inline-flex h-full w-full rounded-full bg-yellow-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-yellow-400" />
          </span>
          <span className="font-bold text-yellow-400 text-xs uppercase tracking-widest">{config?.badgeText || '⚡ Entrega hoy disponible'}</span>
        </div>
        <span className="text-gray-600 hidden sm:block">|</span>
        <div className="flex items-center gap-2">
          <span className="text-gray-300 text-xs">{config?.countdownText || 'Cierre de despacho hoy en:'}</span>
          <div className="flex gap-1">
            {[pad(timeLeft.h), pad(timeLeft.m), pad(timeLeft.s)].map((unit, i) => (
              <span key={i} className="bg-primary text-white font-mono font-black text-xs md:text-sm px-2 py-0.5 rounded-md">{unit}</span>
            ))}
          </div>
        </div>
        <a href={config?.linkUrl || '/catalogo?badge=Entrega+Hoy'} className="hidden md:flex items-center gap-1 text-primary text-xs font-bold hover:underline">
          {config?.linkText || 'Ver disponibles'} <ArrowRight className="w-3 h-3" />
        </a>
      </div>
    </div>
  );
}
