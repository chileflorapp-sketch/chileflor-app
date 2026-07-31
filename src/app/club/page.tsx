'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase/client';
import { Crown, Sparkles, ArrowRight, ShieldCheck, Lock } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function VIPClub() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;
    
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      if (isSignUp) {
        if (!name) {
          setError('El nombre completo es requerido para crear una cuenta.');
          setLoading(false);
          return;
        }

        // 1. Crear usuario en Supabase Auth
        const { data, error: signUpError } = await supabase.auth.signUp({
          email: email.toLowerCase().trim(),
          password,
          options: {
            data: { full_name: name }
          }
        });

        if (signUpError) throw signUpError;

        // 2. Insertar en clientes_vip si el usuario se creó (solo si no existe)
        // Nota: Si requieren confirmación de email, el usuario se crea pero no hay sesión activa.
        if (data.user) {
          const { data: existing } = await supabase.from('clientes_vip').select('id').eq('email', data.user.email).maybeSingle();
          if (!existing) {
            await supabase.from('clientes_vip').insert([{
              email: data.user.email,
              full_name: name,
              tier: 'BRONZE',
              puntos_actuales: 100,
              puntos_historicos: 100,
              last_login: new Date().toISOString()
            }]);
            await supabase.from('vip_historial_puntos').insert([{
              email_cliente: data.user.email,
              cantidad: 100,
              tipo_transaccion: 'EARN',
              descripcion: 'Bono de Bienvenida al Club VIP'
            }]);
          }
        }

        setSuccess('¡Cuenta creada! Si recibes un correo de confirmación, acéptalo. Si no, puedes iniciar sesión.');
        setIsSignUp(false); // Cambiar a modo login
      } else {
        // Modo Login
        const { error: signInError, data } = await supabase.auth.signInWithPassword({
          email: email.toLowerCase().trim(),
          password
        });

        if (signInError) throw signInError;
        
        // Actualizar last_login
        if (data.user?.email) {
          await supabase.from('clientes_vip').update({ last_login: new Date().toISOString() }).eq('email', data.user.email);
        }

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
              <h2 className="text-2xl font-bold text-white mb-2">{isSignUp ? 'Crea tu Cuenta VIP' : 'Ingresa a tu Cuenta'}</h2>
              <p className="text-gray-400 text-sm">
                Inicia sesión o crea una cuenta usando tu correo electrónico y contraseña.
              </p>
            </div>
            
            <form onSubmit={handleLogin} className="space-y-4">
              
              {error && (
                <div className="bg-fuchsia-500/10 border border-fuchsia-500/50 text-fuchsia-300 px-4 py-3 rounded-xl text-sm font-medium animate-in fade-in zoom-in-95">
                  {error}
                </div>
              )}
              {success && (
                <div className="bg-emerald-500/10 border border-emerald-500/50 text-emerald-300 px-4 py-3 rounded-xl text-sm font-medium animate-in fade-in zoom-in-95">
                  {success}
                </div>
              )}

              {isSignUp && (
                <div className="animate-in fade-in slide-in-from-top-4 duration-300">
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Nombre Completo</label>
                  <input 
                    type="text" 
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Juan Pérez"
                    className="w-full bg-[#1C1C1E] border border-gray-800 rounded-xl px-4 py-3 text-white focus:border-fuchsia-500 focus:ring-1 focus:ring-fuchsia-500 outline-none transition-all placeholder:text-gray-600"
                  />
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Correo Electrónico</label>
                <input 
                  type="email" 
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="tu@correo.com"
                  className="w-full bg-[#1C1C1E] border border-gray-800 rounded-xl px-4 py-3 text-white focus:border-fuchsia-500 focus:ring-1 focus:ring-fuchsia-500 outline-none transition-all placeholder:text-gray-600"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Contraseña</label>
                <input 
                  type="password" 
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-[#1C1C1E] border border-gray-800 rounded-xl px-4 py-3 text-white focus:border-fuchsia-500 focus:ring-1 focus:ring-fuchsia-500 outline-none transition-all placeholder:text-gray-600"
                />
              </div>

              <div className="pt-2 flex flex-col gap-3">
                <button 
                  type="submit" 
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-fuchsia-600 to-purple-600 hover:from-fuchsia-500 hover:to-purple-500 text-white font-bold py-3.5 px-4 rounded-xl transition-all shadow-lg shadow-fuchsia-500/20 disabled:opacity-50 flex items-center justify-center gap-2 group"
                >
                  {loading ? (
                    <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      {isSignUp ? 'Crear Cuenta VIP' : 'Ingresar al Club'} <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setIsSignUp(!isSignUp);
                    setError('');
                    setSuccess('');
                  }}
                  className="text-gray-400 text-sm font-medium hover:text-white transition-colors"
                >
                  {isSignUp ? '¿Ya tienes cuenta? Inicia sesión' : '¿No tienes cuenta? Crea una nueva'}
                </button>
              </div>
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
