'use client';

import { useState } from 'react';
import { useAgentAuth } from '@/context/AgentAuthContext';

export default function AgentesLogin() {
  const { login } = useAgentAuth();
  const [username, setUsername] = useState('');
  const [clave, setClave] = useState('');
  const [error, setError] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const success = login(username, clave);
    if (!success) {
      setError(true);
      setClave('');
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center p-4">
      <div className="bg-[#1C1C1E] w-full max-w-md rounded-3xl p-8 border border-gray-800 shadow-2xl relative overflow-hidden">
        
        {/* Glow background effect */}
        <div className="absolute -top-32 -left-32 w-64 h-64 bg-primary/20 blur-[100px] rounded-full pointer-events-none"></div>

        <div className="relative z-10 text-center mb-8">
           <img src="/logo.png" alt="Chileflor" className="h-12 mx-auto mb-6 opacity-80" />
           <h1 className="text-2xl font-bold text-white mb-2 font-serif">Backboard de Agentes</h1>
           <p className="text-sm text-gray-400">Acceso restringido para personal autorizado.</p>
        </div>

        <form onSubmit={handleSubmit} className="relative z-10 space-y-5">
          {error && (
            <div className="bg-red-500/10 border border-red-500/50 text-red-500 text-sm px-4 py-3 rounded-xl text-center font-medium animate-in shake">
              Credenciales inválidas. Intente nuevamente.
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Usuario / Correo Institucional</label>
            <input 
              type="text" 
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full bg-[#111111] border border-gray-800 rounded-xl px-4 py-3 text-white focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
              placeholder="Ej: Chileflor1987 o nombre@chileflor.cl"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Clave de Seguridad</label>
            <input 
              type="password" 
              required
              value={clave}
              onChange={(e) => setClave(e.target.value)}
              className="w-full bg-[#111111] border border-gray-800 rounded-xl px-4 py-3 text-white focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
              placeholder="••••••••"
            />
          </div>

          <button type="submit" className="w-full bg-white text-black font-bold py-4 rounded-xl hover:bg-gray-200 transition-colors shadow-[0_0_20px_rgba(255,255,255,0.1)] hover:shadow-[0_0_30px_rgba(255,255,255,0.2)]">
            Acceder al Sistema
          </button>
        </form>

      </div>
    </div>
  );
}
