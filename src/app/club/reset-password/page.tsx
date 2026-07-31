'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase/client';
import { ShieldCheck, Eye, EyeOff, ArrowRight } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function ResetPassword() {
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [verifying, setVerifying] = useState(true);

  useEffect(() => {
    // Check if the user arrived here via an email link and has a session/access token
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        // If there's no session, they shouldn't be here (or the link expired)
        // Note: Sometimes Supabase hash routing takes a split second to exchange.
        // We will just listen for auth state changes briefly.
      }
      setVerifying(false);
    };
    checkSession();
  }, []);

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden.');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const { error } = await supabase.auth.updateUser({
        password: password
      });

      if (error) throw error;

      setSuccess('¡Tu contraseña ha sido actualizada exitosamente! Redirigiendo a tu cuenta...');
      setTimeout(() => {
        router.push('/mi-cuenta');
      }, 3000);
    } catch (err: any) {
      setError(`Ocurrió un error: ${err.message}`);
      setLoading(false);
    }
  };

  if (verifying) {
    return (
      <div className="min-h-screen bg-[#0A0A0C] text-white flex flex-col font-sans">
        <Header />
        <main className="flex-1 flex items-center justify-center p-4 py-20 relative">
          <span className="w-8 h-8 border-2 border-white/30 border-t-fuchsia-500 rounded-full animate-spin" />
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0A0A0C] text-white flex flex-col font-sans">
      <Header />
      
      <main className="flex-1 flex items-center justify-center p-4 py-20 relative overflow-hidden">
        
        {/* Background Effects */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] bg-fuchsia-600/20 rounded-full blur-[120px]" />
        </div>

        <div className="relative z-10 w-full max-w-md flex flex-col bg-[#111116]/80 backdrop-blur-xl border border-white/5 rounded-3xl overflow-hidden shadow-2xl p-8">
          
          <div className="mb-8 text-center">
            <div className="mx-auto w-12 h-12 bg-fuchsia-500/10 rounded-full flex items-center justify-center mb-4 border border-fuchsia-500/20">
              <ShieldCheck className="text-fuchsia-400" size={24} />
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">Nueva Contraseña</h2>
            <p className="text-gray-400 text-sm">
              Ingresa y confirma tu nueva contraseña para acceder a tu cuenta VIP.
            </p>
          </div>
          
          <form onSubmit={handleUpdatePassword} className="space-y-4">
            
            {error && (
              <div className="bg-red-500/10 border border-red-500/50 text-red-300 px-4 py-3 rounded-xl text-sm font-medium">
                {error}
              </div>
            )}
            {success && (
              <div className="bg-emerald-500/10 border border-emerald-500/50 text-emerald-300 px-4 py-3 rounded-xl text-sm font-medium">
                {success}
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Nueva Contraseña</label>
              <div className="relative">
                <input 
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-[#1C1C1E] border border-gray-800 rounded-xl px-4 py-3 text-white focus:border-fuchsia-500 focus:ring-1 focus:ring-fuchsia-500 outline-none transition-all placeholder:text-gray-600"
                />
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Confirmar Contraseña</label>
              <div className="relative">
                <input 
                  type={showPassword ? "text" : "password"}
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-[#1C1C1E] border border-gray-800 rounded-xl px-4 py-3 text-white focus:border-fuchsia-500 focus:ring-1 focus:ring-fuchsia-500 outline-none transition-all placeholder:text-gray-600"
                />
              </div>
            </div>

            <div className="pt-4 flex flex-col gap-3">
              <button 
                type="submit" 
                disabled={loading || !!success}
                className="w-full bg-gradient-to-r from-fuchsia-600 to-purple-600 hover:from-fuchsia-500 hover:to-purple-500 text-white font-bold py-3.5 px-4 rounded-xl transition-all shadow-lg shadow-fuchsia-500/20 disabled:opacity-50 flex items-center justify-center gap-2 group"
              >
                {loading ? (
                  <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>Guardar Nueva Contraseña <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" /></>
                )}
              </button>
            </div>
          </form>
          
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
