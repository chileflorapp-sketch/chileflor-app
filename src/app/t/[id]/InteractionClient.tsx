'use client';
import { useState } from 'react';
import confetti from 'canvas-confetti';

interface InteractionClientProps {
  id: string;
  initialAgradecido: boolean;
}

export default function InteractionClient({ id, initialAgradecido }: InteractionClientProps) {
  const [agradecido, setAgradecido] = useState(initialAgradecido);
  const [loading, setLoading] = useState(false);

  const handleAgradecer = async () => {
    if (agradecido) return;
    
    setLoading(true);
    try {
      const res = await fetch('/api/tarjeta/agradecer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id })
      });
      
      if (res.ok) {
        setAgradecido(true);
        // Lanza confeti!
        confetti({
          particleCount: 150,
          spread: 80,
          origin: { y: 0.6 },
          colors: ['#E95374', '#F472B6', '#FCA5A5', '#FFF']
        });
      }
    } catch (err) {
      console.error('Error al agradecer', err);
    }
    setLoading(false);
  };

  if (agradecido) {
    return (
      <div className="bg-white rounded-3xl p-8 text-center shadow-xl border border-gray-100 flex flex-col items-center animate-in fade-in zoom-in duration-500">
        <div className="w-16 h-16 bg-pink-50 text-pink-500 rounded-full flex items-center justify-center mb-4">
          <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
          </svg>
        </div>
        <h3 className="text-2xl font-black text-gray-900 mb-2">¡Agradecimiento Enviado!</h3>
        <p className="text-gray-500">
          Le hemos notificado que recibiste su sorpresa. Esta página desaparecerá pronto.
        </p>
      </div>
    );
  }

  return (
    <button 
      onClick={handleAgradecer}
      disabled={loading}
      className="w-full bg-black text-white font-black text-xl py-5 rounded-2xl shadow-xl hover:scale-105 transition-all active:scale-[0.98] flex items-center justify-center gap-3 disabled:opacity-70 disabled:scale-100"
    >
      {loading ? (
        <span>Enviando amor...</span>
      ) : (
        <>
          <svg className="w-6 h-6 text-pink-500" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
          </svg>
          <span>¡Decir Gracias!</span>
        </>
      )}
    </button>
  );
}
