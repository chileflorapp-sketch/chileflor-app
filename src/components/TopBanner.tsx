'use client';
import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';

export default function TopBanner() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);

  if (pathname?.startsWith('/agentes')) return null;

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div 
      className={`fixed w-full z-[60] bg-gray-900 text-white text-xs md:text-sm h-9 flex items-center justify-center px-2 text-center transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
        scrolled ? '-translate-y-full' : 'translate-y-0'
      }`}
    >
      <span className="mr-2">🕒</span>
      <span className="hidden md:inline"><strong>Horario de Atención:</strong> Lunes a Sábado de 09:00 a 20:00 hrs | Domingo de 10:00 a 14:00 hrs</span>
      <span className="md:hidden truncate"><strong>Horario:</strong> Lun-Sáb 09-20h | Dom 10-14h</span>
    </div>
  );
}
