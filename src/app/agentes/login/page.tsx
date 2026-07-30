'use client';

import { useState, useEffect, useRef } from 'react';
import { useAgentAuth } from '@/context/AgentAuthContext';
import { ShieldCheck, Lock, User, RefreshCw, KeyRound, AlertTriangle } from 'lucide-react';

export default function AgentesLogin() {
  const { login } = useAgentAuth();
  const [username, setUsername] = useState('');
  const [clave, setClave] = useState('');
  const [captchaInput, setCaptchaInput] = useState('');
  const [captchaCode, setCaptchaCode] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Generar código CAPTCHA aleatorio
  const generateCaptcha = () => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let code = '';
    for (let i = 0; i < 5; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setCaptchaCode(code);
    setCaptchaInput('');
  };

  useEffect(() => {
    generateCaptcha();
  }, []);

  // Renderizar CAPTCHA en Canvas con ruido visual de seguridad
  useEffect(() => {
    if (!canvasRef.current || !captchaCode) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Fondo oscuro con degradado
    const grad = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    grad.addColorStop(0, '#120D1D');
    grad.addColorStop(1, '#0E0E12');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Líneas de ruido de seguridad
    for (let i = 0; i < 6; i++) {
      ctx.strokeStyle = `rgba(217, 70, 239, ${0.15 + Math.random() * 0.25})`;
      ctx.lineWidth = 1 + Math.random() * 2;
      ctx.beginPath();
      ctx.moveTo(Math.random() * canvas.width, Math.random() * canvas.height);
      ctx.lineTo(Math.random() * canvas.width, Math.random() * canvas.height);
      ctx.stroke();
    }

    // Puntos de distorsión
    for (let i = 0; i < 30; i++) {
      ctx.fillStyle = `rgba(255, 255, 255, ${Math.random() * 0.3})`;
      ctx.fillRect(Math.random() * canvas.width, Math.random() * canvas.height, 2, 2);
    }

    // Dibujar cada caracter distorsionado
    ctx.font = 'bold 22px monospace';
    ctx.textBaseline = 'middle';

    const colors = ['#f472b6', '#c084fc', '#38bdf8', '#34d399', '#fbbf24'];
    for (let i = 0; i < captchaCode.length; i++) {
      const char = captchaCode[i];
      const x = 18 + i * 22;
      const y = canvas.height / 2 + (Math.random() * 4 - 2);
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate((Math.random() - 0.5) * 0.4);
      ctx.fillStyle = colors[i % colors.length];
      ctx.fillText(char, 0, 0);
      ctx.restore();
    }
  }, [captchaCode]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    // 1. Validar CAPTCHA
    if (captchaInput.trim().toUpperCase() !== captchaCode) {
      setErrorMessage('⚠️ Código CAPTCHA de seguridad incorrecto. Intente nuevamente.');
      generateCaptcha();
      return;
    }

    // 2. Validar Credenciales de Usuario y Clave
    const success = login(username, clave);
    if (!success) {
      setErrorMessage('🔒 Credenciales de acceso no autorizadas. Usuario o clave incorrectos.');
      setClave('');
      generateCaptcha();
    }
  };

  return (
    <div className="min-h-screen bg-[#070709] flex items-center justify-center p-4 relative overflow-hidden">
      
      {/* Malla ambient glow de fondo */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-900/20 rounded-full blur-[130px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-fuchsia-900/20 rounded-full blur-[130px] pointer-events-none" />

      <div className="bg-[#0E0E12]/90 backdrop-blur-2xl w-full max-w-md rounded-3xl p-8 border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.8)] relative z-10">
        
        {/* Encabezado */}
        <div className="text-center mb-8">
           <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-fuchsia-500/10 border border-fuchsia-500/20 text-fuchsia-400 text-[10px] font-extrabold uppercase tracking-widest mb-4">
             <ShieldCheck size={14} /> Centro de Seguridad Agentes
           </div>
           <img src="/logo.png" alt="Chileflor CRM" className="h-10 mx-auto mb-4 opacity-95" />
           <h1 className="text-2xl font-black text-white tracking-tight mb-1">Acceso CRM Chileflor</h1>
           <p className="text-xs text-gray-400">Autenticación de seguridad requerida para ingresar al cerebro operativo.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          
          {errorMessage && (
            <div className="bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs px-4 py-3 rounded-2xl flex items-start gap-2.5 font-medium animate-in fade-in duration-300">
              <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Campo Usuario */}
          <div>
            <label className="block text-[10px] font-extrabold text-gray-400 uppercase tracking-widest mb-1.5 flex items-center gap-1.5">
              <User size={12} className="text-fuchsia-400" /> Usuario / Correo Institucional
            </label>
            <input 
              type="text" 
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full bg-[#141418] border border-white/10 rounded-xl px-4 py-3 text-white focus:border-fuchsia-500 focus:ring-1 focus:ring-fuchsia-500 outline-none transition-all text-sm"
              placeholder="chilflor1234 o nombre@chileflor.cl"
            />
          </div>

          {/* Campo Clave */}
          <div>
            <label className="block text-[10px] font-extrabold text-gray-400 uppercase tracking-widest mb-1.5 flex items-center gap-1.5">
              <KeyRound size={12} className="text-fuchsia-400" /> Clave de Seguridad
            </label>
            <input 
              type="password" 
              required
              value={clave}
              onChange={(e) => setClave(e.target.value)}
              className="w-full bg-[#141418] border border-white/10 rounded-xl px-4 py-3 text-white focus:border-fuchsia-500 focus:ring-1 focus:ring-fuchsia-500 outline-none transition-all text-sm"
              placeholder="••••••••••••"
            />
          </div>

          {/* Campo CAPTCHA (Verificación Anti-Bot) */}
          <div className="pt-2 border-t border-white/5">
            <label className="block text-[10px] font-extrabold text-gray-400 uppercase tracking-widest mb-2 flex items-center justify-between">
              <span className="flex items-center gap-1.5"><Lock size={12} className="text-cyan-400" /> Verificación CAPTCHA Anti-Bot</span>
              <button 
                type="button" 
                onClick={generateCaptcha} 
                className="text-fuchsia-400 hover:text-fuchsia-300 flex items-center gap-1 text-[10px] font-bold"
                title="Generar nuevo código CAPTCHA"
              >
                <RefreshCw size={10} /> Nuevo Código
              </button>
            </label>

            <div className="flex gap-3 items-center">
              <canvas 
                ref={canvasRef} 
                width={130} 
                height={44} 
                className="rounded-xl border border-white/10 shrink-0 shadow-inner bg-[#120D1D]" 
              />
              <input 
                type="text" 
                required
                maxLength={5}
                value={captchaInput}
                onChange={(e) => setCaptchaInput(e.target.value)}
                className="w-full bg-[#141418] border border-white/10 rounded-xl px-4 py-2.5 text-white focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 outline-none transition-all text-sm font-mono tracking-widest uppercase text-center font-bold"
                placeholder="CÓDIGO"
              />
            </div>
          </div>

          {/* Botón Ingreso */}
          <button 
            type="submit" 
            className="w-full mt-4 bg-gradient-to-r from-fuchsia-600 via-purple-600 to-rose-600 hover:from-fuchsia-500 hover:to-rose-500 text-white font-extrabold py-3.5 rounded-xl transition-all shadow-[0_0_25px_rgba(217,70,239,0.3)] hover:shadow-[0_0_35px_rgba(217,70,239,0.5)] text-sm flex items-center justify-center gap-2"
          >
            <ShieldCheck size={18} /> Validar Acceso Seguro
          </button>
        </form>

        <p className="text-[10px] text-gray-500 text-center mt-6">
          🔒 Encriptación SSL & Verificación CAPTCHA Activa. Sistema Chileflor.
        </p>

      </div>
    </div>
  );
}
