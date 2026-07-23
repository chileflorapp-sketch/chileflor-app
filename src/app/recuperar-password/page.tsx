'use client';
import { useState } from 'react';
import { createClient } from '@/utils/supabase/client';

export default function RecuperarPasswordPage() {
  const [email, setEmail] = useState('');
  const [statusMsg, setStatusMsg] = useState<{type: 'error'|'success', text: string} | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const supabase = createClient();

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatusMsg(null);
    setIsLoading(true);

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      
      if (error) throw error;
      
      setStatusMsg({
        type: 'success',
        text: '¡Enviado! Revisa tu correo electrónico para encontrar el enlace de recuperación. (Revisa también la carpeta de spam).'
      });
      setEmail('');
    } catch (err: any) {
      setStatusMsg({
        type: 'error',
        text: err.message || 'Ocurrió un error al intentar enviar el correo. Por favor intenta de nuevo.'
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative min-h-[calc(100vh-64px)] flex items-center justify-center p-4 overflow-hidden py-12">
      {/* Cinematic Background */}
      <div className="absolute inset-0 z-0">
        <img 
          src="https://images.unsplash.com/photo-1522068936647-97d8b5a004dc?auto=format&fit=crop&w=2000&q=80" 
          alt="Flores Fondo" 
          className="w-full h-full object-cover opacity-80"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900/90 via-gray-900/70 to-primary/40 backdrop-blur-sm"></div>
      </div>

      {/* Form Card */}
      <div className="relative z-10 w-full max-w-md bg-white/95 backdrop-blur-3xl p-8 md:p-10 rounded-[2.5rem] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.5)] border border-white/50 animate-in fade-in zoom-in duration-500">
        
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
            <span className="text-3xl">📧</span>
          </div>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Recuperar Clave</h1>
          <p className="text-gray-500 mt-2 text-sm">
            Ingresa el correo con el que te registraste y te enviaremos un enlace mágico para restablecer tu contraseña.
          </p>
        </div>

        {statusMsg && (
          <div className={`mb-6 p-4 rounded-xl text-sm font-medium text-center border ${
            statusMsg.type === 'success' ? 'bg-green-50 border-green-200 text-green-700' : 'bg-red-50 border-red-200 text-red-600'
          }`}>
            {statusMsg.text}
          </div>
        )}

        <form onSubmit={handleResetPassword} className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Correo electrónico</label>
            <input required type="email" placeholder="nombre@chileflor.cl" value={email} onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all bg-white" />
          </div>

          <button 
            type="submit"
            disabled={isLoading}
            className={`w-full bg-primary text-white font-bold text-lg py-4 rounded-xl shadow-lg shadow-primary/30 transition-transform mt-2 ${isLoading ? 'opacity-70 cursor-not-allowed' : 'hover:bg-primary-dark hover:-translate-y-0.5'}`}
          >
            {isLoading ? 'Enviando enlace...' : 'Enviar enlace de recuperación'}
          </button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-6">
          <a href="/login" className="text-gray-600 font-bold hover:text-primary transition-colors flex items-center justify-center gap-2">
            <span>←</span> Volver a iniciar sesión
          </a>
        </p>
      </div>
    </div>
  );
}
