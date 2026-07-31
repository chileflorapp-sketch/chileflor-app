'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase/client';
import { Crown, Sparkles, ArrowRight, ShieldCheck, Mail } from 'lucide-react';
import { FcGoogle } from 'react-icons/fc';
import { FaApple } from 'react-icons/fa';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function VIPClub() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleOAuthLogin = async (provider: 'google' | 'apple') => {
    setLoading(true);
    setError('');
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });
      if (error) throw error;
    } catch (err: any) {
      setError(`Error al iniciar sesión con ${provider}: ${err.message}`);
      setLoading(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    
    setLoading(true);
    setError('');

    try {
      // 1. Buscar si el cliente ya existe
      const { data: existingClient, error: fetchError } = await supabase
        .from('clientes_vip')
        .select('*')
        .eq('email', email.toLowerCase().trim())
        .maybeSingle();

      if (existingClient) {
        // Ya existe, actualizar last_login y entrar
        await supabase.from('clientes_vip').update({ last_login: new Date().toISOString() }).eq('email', existingClient.email);
        localStorage.setItem('vip_customer_email', existingClient.email);
        router.push('/mi-cuenta');
      } else {
        // 2. No existe, requiere Nombre para registrarse
        if (!name) {
          setError('Como es tu primera vez, necesitamos tu nombre completo para el registro VIP.');
          setLoading(false);
          return;
        }

        const { error: insertError } = await supabase.from('clientes_vip').insert([{
          email: email.toLowerCase().trim(),
          full_name: name,
          tier: 'BRONZE',
          puntos_actuales: 100, // Bono de bienvenida
          puntos_historicos: 100,
          last_login: new Date().toISOString()
        }]);

        if (insertError) throw insertError;

        // Registrar primeros 100 puntos en auditoría
        await supabase.from('vip_historial_puntos').insert([{
          email_cliente: email.toLowerCase().trim(),
          cantidad: 100,
          tipo_transaccion: 'EARN',
          descripcion: 'Bono de Bienvenida al Club VIP'
        }]);

        localStorage.setItem('vip_customer_email', email.toLowerCase().trim());
        router.push('/mi-cuenta');
      }
    } catch (err: any) {
      setError(`Ocurrió un error: ${err.message || JSON.stringify(err)}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0A0C] text-white flex flex-col font-sans">
      <Header />
      
      <main className="flex-1 flex items-center justify-center p-4 py-20 relative overflow-hidden">
        
        {/* Background Effects */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] bg-fuchsia-600/20 rounded-full blur-[120px]" />
          <div className="absolute top-[40%] -right-[10%] w-[40%] h-[40%] bg-purple-600/20 rounded-full blur-[100px]" />
        </div>

        <div className="relative z-10 w-full max-w-5xl flex flex-col md:flex-row bg-[#111116]/80 backdrop-blur-xl border border-white/5 rounded-3xl overflow-hidden shadow-2xl">
          
          {/* Info Side */}
          <div className="md:w-1/2 bg-gradient-to-br from-fuchsia-900/40 to-purple-900/20 p-8 md:p-12 flex flex-col justify-center border-r border-white/5">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-fuchsia-500/10 border border-fuchsia-500/20 text-fuchsia-300 text-xs font-bold uppercase tracking-widest mb-6 w-max">
              <Crown size={14} /> Membresía Exclusiva
            </div>
            
            <h1 className="text-3xl md:text-5xl font-extrabold text-white tracking-tight mb-6 leading-tight">
              Únete al <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-400 to-purple-400">Club Chileflor VIP</span>
            </h1>
            
            <ul className="space-y-4 mb-8">
              {[
                'Agenda tus fechas importantes y recibe recordatorios',
                'Acumula puntos en cada compra',
                'Accede a ofertas exclusivas para miembros',
                'Sigue el estado de tus pedidos en tiempo real'
              ].map((benefit, i) => (
                <li key={i} className="flex items-start gap-3">
                  <ShieldCheck className="text-fuchsia-400 shrink-0 mt-0.5" size={20} />
                  <span className="text-gray-300 font-medium leading-relaxed">{benefit}</span>
                </li>
              ))}
            </ul>
          </div>
          
          {/* Login Side */}
          <div className="md:w-1/2 p-8 md:p-12 flex flex-col justify-center bg-[#111116]">
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-white mb-2">Ingresa a tu Cuenta</h2>
              <p className="text-gray-400 text-sm">
                Fricción cero: Solo necesitamos tu correo electrónico para identificarte. Si eres nuevo, te pediremos tu nombre.
              </p>
            </div>
            
            {/* Social Login Buttons */}
            <div className="flex flex-col gap-3 mb-6">
              <button 
                onClick={() => handleOAuthLogin('google')}
                disabled={loading}
                className="w-full flex items-center justify-center gap-3 bg-white hover:bg-gray-100 text-gray-900 font-bold px-4 py-3.5 rounded-xl transition-all disabled:opacity-50"
              >
                <FcGoogle size={22} />
                Continuar con Google
              </button>
              
              <button 
                onClick={() => handleOAuthLogin('apple')}
                disabled={loading}
                className="w-full flex items-center justify-center gap-3 bg-black hover:bg-gray-900 border border-gray-700 text-white font-bold px-4 py-3.5 rounded-xl transition-all disabled:opacity-50"
              >
                <FaApple size={22} />
                Continuar con Apple
              </button>
            </div>

            <div className="relative flex items-center py-5">
              <div className="flex-grow border-t border-gray-800"></div>
              <span className="flex-shrink-0 mx-4 text-gray-500 text-xs uppercase tracking-widest font-bold">O usa tu correo</span>
              <div className="flex-grow border-t border-gray-800"></div>
            </div>

            <form onSubmit={handleLogin} className="space-y-5">
              
              {error && (
                <div className="bg-fuchsia-500/10 border border-fuchsia-500/50 text-fuchsia-300 px-4 py-3 rounded-xl text-sm font-medium animate-in fade-in zoom-in-95">
                  {error}
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Correo Electrónico (Ingreso Rápido)</label>
                <input 
                  type="email" 
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="tu@correo.com"
                  className="w-full bg-[#1C1C1E] border border-gray-800 rounded-xl px-4 py-3.5 text-white focus:border-fuchsia-500 focus:ring-1 focus:ring-fuchsia-500 outline-none transition-all placeholder:text-gray-600"
                />
              </div>

              {/* Mostrar Nombre solo si hay error de que falta o si el usuario quiere llenar todo */}
              <div className={`transition-all duration-300 overflow-hidden ${error.includes('primera vez') || name.length > 0 ? 'max-h-24 opacity-100' : 'max-h-0 opacity-0'}`}>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Nombre Completo</label>
                <input 
                  type="text" 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Juan Pérez"
                  className="w-full bg-[#1C1C1E] border border-gray-800 rounded-xl px-4 py-3.5 text-white focus:border-fuchsia-500 focus:ring-1 focus:ring-fuchsia-500 outline-none transition-all placeholder:text-gray-600"
                />
              </div>

              <button 
                type="submit" 
                disabled={loading}
                className="w-full bg-gradient-to-r from-fuchsia-600 to-purple-600 hover:from-fuchsia-500 hover:to-purple-500 text-white font-bold py-4 rounded-xl transition-all shadow-[0_0_20px_rgba(192,38,211,0.3)] hover:shadow-[0_0_30px_rgba(192,38,211,0.5)] flex items-center justify-center gap-2 group disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <span className="animate-spin text-xl">⏳</span>
                ) : (
                  <>
                    Acceder a mi portal
                    <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
              
            </form>
            
            <p className="text-center text-xs text-gray-500 mt-8">
              Al ingresar, aceptas nuestros <a href="/terminos" className="text-fuchsia-400 hover:underline">Términos y Condiciones</a> y <a href="/privacidad" className="text-fuchsia-400 hover:underline">Políticas de Privacidad</a>.
            </p>
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}
