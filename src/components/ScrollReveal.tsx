'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

export default function ScrollReveal() {
  const pathname = usePathname();

  useEffect(() => {
    // Función para manejar la intersección
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
          // Opcional: Desobservar si solo queremos que aparezca una vez
          // observer.unobserve(entry.target); 
        } else {
          // Remover si queremos que vuelva a animarse al hacer scroll arriba/abajo
          // entry.target.classList.remove('active');
        }
      });
    }, {
      threshold: 0.1, // 10% del elemento debe ser visible para dispararse
      rootMargin: '0px 0px -50px 0px' // Se activa un poco antes de llegar al borde inferior
    });

    // Encontrar todos los elementos con la clase .reveal
    const elements = document.querySelectorAll('.reveal');
    elements.forEach((el) => observer.observe(el));

    return () => {
      elements.forEach((el) => observer.unobserve(el));
      observer.disconnect();
    };
  }, [pathname]); // Re-ejecutar cada vez que cambiamos de página

  return null; // Este componente no renderiza nada en pantalla
}
