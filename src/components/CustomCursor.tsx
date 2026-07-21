'use client';

import { useEffect, useState } from 'react';

export default function CustomCursor() {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [hidden, setHidden] = useState(false);
  const [clicked, setClicked] = useState(false);
  const [linkHovered, setLinkHovered] = useState(false);

  useEffect(() => {
    // Solo activarlo en dispositivos no táctiles (desktop)
    if (typeof window !== 'undefined' && window.matchMedia('(pointer: fine)').matches) {
      
      const addEventListeners = () => {
        document.addEventListener('mousemove', onMouseMove);
        document.addEventListener('mouseenter', onMouseEnter);
        document.addEventListener('mouseleave', onMouseLeave);
        document.addEventListener('mousedown', onMouseDown);
        document.addEventListener('mouseup', onMouseUp);
      };

      const removeEventListeners = () => {
        document.removeEventListener('mousemove', onMouseMove);
        document.removeEventListener('mouseenter', onMouseEnter);
        document.removeEventListener('mouseleave', onMouseLeave);
        document.removeEventListener('mousedown', onMouseDown);
        document.removeEventListener('mouseup', onMouseUp);
      };

      const onMouseMove = (e: MouseEvent) => {
        setPosition({ x: e.clientX, y: e.clientY });
      };

      const onMouseDown = () => {
        setClicked(true);
      };

      const onMouseUp = () => {
        setClicked(false);
      };

      const onMouseLeave = () => {
        setHidden(true);
      };

      const onMouseEnter = () => {
        setHidden(false);
      };

      const handleLinkHoverEvents = () => {
        document.querySelectorAll('a, button, input, select, textarea').forEach(el => {
          el.addEventListener('mouseover', () => setLinkHovered(true));
          el.addEventListener('mouseout', () => setLinkHovered(false));
        });
      };

      addEventListeners();
      
      // Necesario observar mutaciones para nuevos links generados por React
      const observer = new MutationObserver(() => {
        handleLinkHoverEvents();
      });
      observer.observe(document.body, { childList: true, subtree: true });
      
      handleLinkHoverEvents();

      return () => {
        removeEventListeners();
        observer.disconnect();
      };
    } else {
      setHidden(true); // Ocultarlo siempre si es celular/táctil
    }
  }, []);

  if (hidden) return null;

  return (
    <>
      {/* El punto interior */}
      <div 
        className={`fixed top-0 left-0 w-3 h-3 bg-primary rounded-full pointer-events-none z-[9998] transform -translate-x-1/2 -translate-y-1/2 transition-transform duration-100 ease-out ${clicked ? 'scale-75' : 'scale-100'} ${linkHovered ? 'scale-0 opacity-0' : 'opacity-100'}`}
        style={{ left: `${position.x}px`, top: `${position.y}px` }}
      />
      
      {/* El halo exterior */}
      <div 
        className={`fixed top-0 left-0 w-10 h-10 border border-primary/50 rounded-full pointer-events-none z-[9998] transform -translate-x-1/2 -translate-y-1/2 transition-all duration-300 ease-out ${
          clicked ? 'scale-50 border-primary/80 bg-primary/20' : 
          linkHovered ? 'scale-150 border-primary bg-primary/10 backdrop-blur-[1px]' : 'scale-100'
        }`}
        style={{ left: `${position.x}px`, top: `${position.y}px` }}
      />
    </>
  );
}
