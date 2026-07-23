'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

export default function ScrollReveal() {
  const pathname = usePathname();

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
        }
      });
    }, {
      threshold: 0.05,
      rootMargin: '0px 0px 50px 0px'
    });

    const updateObservers = () => {
      const elements = document.querySelectorAll('.reveal:not(.active)');
      elements.forEach((el) => observer.observe(el));
    };

    updateObservers();

    // Observar cambios en el DOM para capturar elementos renderizados de forma asíncrona (como los sliders)
    const mutationObserver = new MutationObserver(() => {
      updateObservers();
    });

    mutationObserver.observe(document.body, {
      childList: true,
      subtree: true,
    });

    return () => {
      mutationObserver.disconnect();
      observer.disconnect();
    };
  }, [pathname]);

  return null;
}
