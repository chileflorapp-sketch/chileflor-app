'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import { Mail, Phone, User, Calendar, ArrowRight, Loader2, CheckCircle } from 'lucide-react';
import Link from 'next/link';

export default function ClientRegister() {
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [requireConfirmation, setRequireConfirmation] = useState(false);
  const router = useRouter();

  // Función para generar una contraseña aleatoria y segura de forma invisible
  const generateRandomPassword = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
    let pass = '';
    for (let i = 0; i < 16; i++) {
      pass += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return pass + 'A1!'; // Asegurar requisitos mínimos
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Validaciones básicas
    if (parseInt(age) < 18) {
      setError('Debes ser mayor de 18 años para inscribirte.');
      setLoading(false);
      return;
    }

    const randomPassword = generateRandomPassword();

    const { data, error } = await supabase.auth.signUp({
      email,
      password: randomPassword,
      options: {
        data: {
          full_name: name,
          edad: age,
          telefono: phone,
          club_member: true
        },
      },
    });

    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      setSuccess(true);
      setLoading(false);
      
      // Si la sesión es null, significa que Supabase requiere confirmar el correo
      if (!data.session) {
        setRequireConfirmation(true);
      } else {
        setTimeout(() => {
          router.push('/mi-cuenta');
        }, 3000);
      }
    }
  };

  if (success) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 bg-gray-50">
        <div className="max-w-md w-full bg-white p-10 rounded-3xl shadow-xl border border-gray-100 text-center">
          <CheckCircle className="w-20 h-20 text-green-500 mx-auto mb-6" />
          <h2 className="text-3xl font-extrabold text-gray-900 mb-2">¡Bienvenido al Club!</h2>
          
          {requireConfirmation ? (
            <div className="mt-4">
              <p className="text-gray-700 font-medium mb-4">Te hemos enviado un correo electrónico para confirmar tu cuenta.</p>
              <p className="text-sm text-gray-500 mb-6">Por favor revisa tu bandeja de entrada (y la carpeta de spam) y haz clic en el enlace mágico para activar tu cuenta e ingresar automáticamente.</p>
              <Link href="/mi-cuenta/login" className="bg-primary text-white px-6 py-3 rounded-xl font-bold hover:bg-primary-dark transition-colors inline-block">
                Ir al Inicio de Sesión
              </Link>
            </div>
          ) : (
            <>
              <p className="text-gray-500 mb-6">Inscripción exitosa. Redirigiendo a tu cuenta...</p>
              <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto" />
            </>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gray-50">
      <div className="max-w-md w-full bg-white p-8 rounded-3xl shadow-xl border border-gray-100">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 text-primary mb-4">
            <User className="w-8 h-8" />
          </div>
          <h2 className="text-3xl font-extrabold text-gray-900">Únete al Club</h2>
          <p className="mt-2 text-sm text-gray-500">Inscríbete y obtén beneficios exclusivos</p>
        </div>

        <form className="space-y-5" onSubmit={handleRegister}>
          {error && (
            <div className="bg-red-50 text-red-500 p-3 rounded-xl text-sm text-center border border-red-100">
              {error}
            </div>
          )}

          <div className="space-y-4">
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full pl-11 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                placeholder="Nombre completo"
              />
            </div>

            <div className="flex gap-4">
              <div className="relative w-1/3">
                <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="number"
                  required
                  min="18"
                  max="120"
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  className="w-full pl-11 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                  placeholder="Edad"
                />
              </div>

              <div className="relative w-2/3">
                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full pl-11 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                  placeholder="Teléfono"
                />
              </div>
            </div>

            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-11 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                placeholder="Tu correo electrónico"
              />
            </div>
            
            <p className="text-xs text-gray-500 text-center px-4">
              Usaremos tu correo para enviarte un enlace de acceso mágico. No necesitas memorizar contraseñas.
            </p>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 bg-primary hover:bg-primary-dark text-white font-bold py-4 px-4 rounded-2xl transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 disabled:opacity-70 disabled:hover:translate-y-0 mt-2"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : (
              <>Inscribirme al Club <ArrowRight className="w-5 h-5" /></>
            )}
          </button>
        </form>

        <div className="mt-8 text-center text-sm text-gray-500">
          ¿Ya eres miembro?{' '}
          <Link href="/mi-cuenta/login" className="font-bold text-primary hover:underline">
            Ingresa aquí
          </Link>
        </div>
      </div>
    </div>
  );
}
