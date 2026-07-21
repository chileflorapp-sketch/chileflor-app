'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';

// Definición de las piezas del ramo
const pieces = [
  // Eucalipto (Fondo)
  { id: 'euc-1', emoji: '🌿', type: 'greenery', angle: -30, distance: 100, zIndex: 1, delay: 0 },
  { id: 'euc-2', emoji: '🌿', type: 'greenery', angle: 30, distance: 100, zIndex: 1, delay: 0.1 },
  { id: 'euc-3', emoji: '🌿', type: 'greenery', angle: -60, distance: 110, zIndex: 1, delay: 0.2 },
  { id: 'euc-4', emoji: '🌿', type: 'greenery', angle: 60, distance: 110, zIndex: 1, delay: 0.3 },

  // Lirios Blancos (Medio)
  { id: 'lily-1', emoji: '💮', type: 'lily', angle: -20, distance: 60, zIndex: 2, delay: 0.4 },
  { id: 'lily-2', emoji: '💮', type: 'lily', angle: 20, distance: 60, zIndex: 2, delay: 0.5 },
  { id: 'lily-3', emoji: '💮', type: 'lily', angle: 0, distance: 80, zIndex: 2, delay: 0.6 },

  // Rosas Rojas (Frente)
  { id: 'rose-1', emoji: '🌹', type: 'rose', angle: -10, distance: 20, zIndex: 3, delay: 0.7 },
  { id: 'rose-2', emoji: '🌹', type: 'rose', angle: 10, distance: 20, zIndex: 3, delay: 0.8 },
  { id: 'rose-3', emoji: '🌹', type: 'rose', angle: -40, distance: 40, zIndex: 3, delay: 0.9 },
  { id: 'rose-4', emoji: '🌹', type: 'rose', angle: 40, distance: 40, zIndex: 3, delay: 1.0 },
  { id: 'rose-5', emoji: '🌹', type: 'rose', angle: 0, distance: 0, zIndex: 4, delay: 1.1 },
];

export default function InteractiveBouquet() {
  const [isDeconstructed, setIsDeconstructed] = useState(false);

  // Helper para generar una posición aleatoria para la dispersión
  const getRandomPosition = (id: string) => {
    // Generar un hash determinístico basado en el ID para mantener la misma posición aleatoria
    const hash = id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const angle = (hash * 137.5) % 360;
    const distance = 150 + (hash % 100);
    const x = Math.cos(angle * (Math.PI / 180)) * distance;
    const y = Math.sin(angle * (Math.PI / 180)) * distance;
    return { x, y, rotate: (hash % 360) - 180 };
  };

  // Posición inicial ensamblada
  const getInitialPosition = (piece: any) => {
    const x = Math.sin(piece.angle * (Math.PI / 180)) * piece.distance;
    const y = -Math.cos(piece.angle * (Math.PI / 180)) * piece.distance;
    return { x, y, rotate: piece.angle };
  };

  return (
    <div className="relative w-full max-w-2xl mx-auto h-[600px] bg-gradient-to-b from-[#FDFBF7] to-[#F3EBE1] rounded-3xl overflow-hidden shadow-2xl border border-gray-100 flex flex-col items-center justify-center font-serif text-gray-900">
      
      {/* Título */}
      <div className="absolute top-8 left-0 w-full text-center z-50">
        <h2 className="text-3xl font-bold tracking-tight mb-2">Ingeniería Floral</h2>
        <p className="text-gray-500 text-sm tracking-widest uppercase">Gravedad Cero</p>
      </div>

      {/* Contenedor del Ramo */}
      <div className="relative w-full h-full flex items-center justify-center">
        
        {/* Envoltura y Cinta (Se ocultan al deconstruir) */}
        <motion.div 
          className="absolute z-0 w-64 h-64 flex items-center justify-center translate-y-12"
          initial={false}
          animate={{
            opacity: isDeconstructed ? 0 : 1,
            scale: isDeconstructed ? 0.8 : 1,
            y: isDeconstructed ? 100 : 48 // 48px is translate-y-12
          }}
          transition={{ duration: 0.8, ease: "easeInOut", delay: isDeconstructed ? 0 : 1.2 }}
        >
          {/* Papel kraft simulado */}
          <div className="absolute inset-0 bg-[#C19A6B] rounded-b-full rounded-t-lg transform -rotate-12 shadow-inner blur-[1px]"></div>
          <div className="absolute inset-0 bg-[#D4B58A] rounded-b-full rounded-t-lg transform rotate-12 shadow-inner blur-[1px]"></div>
          {/* Cinta */}
          <div className="absolute bottom-16 text-6xl drop-shadow-xl z-50 transform rotate-12">🎀</div>
        </motion.div>

        {/* Flores */}
        {pieces.map((piece) => {
          const assembled = getInitialPosition(piece);
          const scattered = getRandomPosition(piece.id);

          return (
            <motion.div
              key={piece.id}
              className="absolute text-6xl select-none drop-shadow-2xl"
              style={{ zIndex: piece.zIndex }}
              initial={false}
              animate={{
                x: isDeconstructed ? scattered.x : assembled.x,
                y: isDeconstructed ? scattered.y : assembled.y,
                rotate: isDeconstructed ? scattered.rotate : assembled.rotate,
                scale: isDeconstructed ? 1.2 : 1,
              }}
              transition={{
                type: 'spring',
                stiffness: 40,
                damping: 15,
                mass: 1,
                // Si deconstruimos, salen rápido sin orden estricto. Si ensamblamos, tienen el delay escalonado.
                delay: isDeconstructed ? (piece.zIndex * 0.1) : piece.delay,
              }}
            >
              {/* Animación de Levitación Constante (Idle) */}
              <motion.div
                animate={{
                  y: isDeconstructed ? [0, -10, 0] : 0,
                  rotate: isDeconstructed ? [0, 5, -5, 0] : 0,
                }}
                transition={{
                  duration: 4 + (piece.zIndex * 0.5), // Velocidades variables para parecer natural
                  repeat: isDeconstructed ? Infinity : 0,
                  ease: "easeInOut"
                }}
              >
                {piece.emoji}
              </motion.div>
            </motion.div>
          );
        })}
      </div>

      {/* Controles */}
      <div className="absolute bottom-8 left-0 w-full flex justify-center gap-4 z-50">
        <button
          onClick={() => setIsDeconstructed(!isDeconstructed)}
          className={`px-8 py-4 rounded-full font-bold uppercase tracking-wider text-sm transition-all duration-500 shadow-xl border ${
            isDeconstructed 
              ? 'bg-[#1C1C1E] text-white border-black hover:bg-black hover:scale-105' 
              : 'bg-[#FF2651] text-white border-red-500 hover:bg-red-600 hover:scale-105'
          }`}
        >
          {isDeconstructed ? 'Reensamblar' : 'Deconstruir'}
        </button>
      </div>
      
    </div>
  );
}
