'use client';

import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';

export default function LogisticsSimulator() {
  const [trafficLevel, setTrafficLevel] = useState<'Alto' | 'Medio' | 'Bajo'>('Medio');
  
  // Simular cambios en el tráfico
  useEffect(() => {
    const interval = setInterval(() => {
      const levels: ('Alto' | 'Medio' | 'Bajo')[] = ['Alto', 'Medio', 'Bajo'];
      setTrafficLevel(levels[Math.floor(Math.random() * levels.length)]);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative w-full max-w-2xl mx-auto h-[600px] bg-[#1C1C1E] rounded-3xl overflow-hidden shadow-2xl border border-gray-800 font-serif">
      {/* HUD Header */}
      <div className="absolute top-0 left-0 w-full p-6 z-50 flex justify-between items-start text-white bg-gradient-to-b from-black/80 to-transparent">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Despacho en Curso</h2>
          <p className="text-gray-400 text-sm tracking-widest uppercase">Av. La Florida esq. Walker Martínez</p>
        </div>
        <div className="text-right flex flex-col items-end">
          <span className="text-xs uppercase tracking-wider text-gray-500 mb-1">Tráfico Intersección</span>
          <div className="flex items-center gap-2 bg-black/50 px-3 py-1.5 rounded-full border border-gray-700 backdrop-blur-md">
            <div className={`w-2 h-2 rounded-full animate-pulse ${
              trafficLevel === 'Alto' ? 'bg-red-500' : trafficLevel === 'Medio' ? 'bg-yellow-500' : 'bg-green-500'
            }`}></div>
            <span className="text-sm font-semibold">{trafficLevel}</span>
          </div>
        </div>
      </div>

      {/* Grid del Mapa Estilizado */}
      <div className="absolute inset-0 bg-[#121212]" style={{ backgroundImage: 'radial-gradient(#333 1px, transparent 1px)', backgroundSize: '40px 40px' }}>
        
        {/* Calles Principales */}
        {/* Av La Florida (Vertical) */}
        <div className="absolute left-1/2 top-0 bottom-0 w-24 bg-[#1a1a1a] border-l border-r border-gray-800 -translate-x-1/2 flex justify-center">
          <div className="w-0.5 h-full border-l-2 border-dashed border-yellow-500/30"></div>
        </div>
        
        {/* Walker Martinez (Horizontal) */}
        <div className="absolute top-1/2 left-0 right-0 h-16 bg-[#1a1a1a] border-t border-b border-gray-800 -translate-y-1/2 flex items-center">
          <div className="w-full h-0.5 border-t-2 border-dashed border-yellow-500/30"></div>
        </div>

        {/* Círculo Intersección */}
        <div className="absolute top-1/2 left-1/2 w-32 h-32 -translate-x-1/2 -translate-y-1/2 border border-gray-700 rounded-full flex items-center justify-center bg-[#1a1a1a]">
          <div className="w-24 h-24 border border-gray-700/50 rounded-full flex items-center justify-center">
             <div className="w-16 h-16 border border-gray-700/30 rounded-full"></div>
          </div>
        </div>

        {/* Nodos de Interés (Tiendas/Clientes) */}
        <div className="absolute top-1/4 left-1/4 flex flex-col items-center gap-1">
          <div className="w-4 h-4 rounded-full bg-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.5)]"></div>
          <span className="text-[10px] text-gray-500 uppercase tracking-widest bg-black/80 px-2 py-0.5 rounded">Origen</span>
        </div>

        <div className="absolute bottom-1/4 right-1/4 flex flex-col items-center gap-1">
          <div className="w-4 h-4 rounded-full bg-green-500 shadow-[0_0_15px_rgba(34,197,94,0.5)]"></div>
          <span className="text-[10px] text-gray-500 uppercase tracking-widest bg-black/80 px-2 py-0.5 rounded">Destino</span>
        </div>

        {/* Animación del Repartidor */}
        <motion.div
          className="absolute text-3xl drop-shadow-[0_0_10px_rgba(255,38,81,0.5)] z-40"
          initial={{ x: -150, y: -150 }}
          animate={{
            x: [
              -150, // Origen
              -40,  // Entrando a Walker Martinez
              0,    // Intersección (Centro)
              0,    // Semáforo rojo / Esperando
              0,    // Giro hacia Av La Florida Sur
              100   // Llegando a Destino
            ],
            y: [
              -150, // Origen
              0,    // En Walker Martinez
              0,    // Intersección (Centro)
              0,    // Semáforo rojo / Esperando
              150,  // Bajando por La Florida
              150   // Llegando a Destino
            ],
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            times: [0, 0.3, 0.5, 0.6, 0.8, 1],
            ease: "easeInOut"
          }}
          style={{ originX: 0.5, originY: 0.5, transform: 'translate(-50%, -50%)' }}
        >
          {/* Vehículo del repartidor */}
          <div className="relative">
            <span className="absolute -inset-2 bg-[#FF2651] blur-md opacity-50 rounded-full animate-pulse"></span>
            <span className="relative">🛵</span>
          </div>
        </motion.div>
        
      </div>
      
      {/* Footer HUD */}
      <div className="absolute bottom-0 left-0 w-full p-6 z-50 text-white bg-gradient-to-t from-black to-transparent">
        <div className="flex justify-between items-end">
          <div>
            <div className="text-sm text-gray-400 mb-1">Estimación de Arribo</div>
            <div className="text-3xl font-light font-mono">14 MIN</div>
          </div>
          <div className="flex gap-4">
             <div className="text-right">
               <div className="text-xs text-gray-500 uppercase tracking-wider mb-1">Temperatura</div>
               <div className="text-lg">18°C</div>
             </div>
             <div className="text-right">
               <div className="text-xs text-gray-500 uppercase tracking-wider mb-1">Cuidado</div>
               <div className="text-lg text-primary">Óptimo</div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}
