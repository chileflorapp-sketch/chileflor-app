'use client';
import { useState } from 'react';
import { createClient } from '@/utils/supabase/client';

const COMUNAS_RM = [
  'Cerrillos', 'Cerro Navia', 'Conchalí', 'El Bosque', 'Estación Central', 'Huechuraba', 'Independencia', 
  'La Cisterna', 'La Florida', 'La Granja', 'La Pintana', 'La Reina', 'Las Condes', 'Lo Barnechea', 
  'Lo Espejo', 'Lo Prado', 'Macul', 'Maipú', 'Ñuñoa', 'Pedro Aguirre Cerda', 'Peñalolén', 'Providencia', 
  'Pudahuel', 'Quilicura', 'Quinta Normal', 'Recoleta', 'Renca', 'San Bernardo', 'San Joaquín', 
  'San Miguel', 'San Ramón', 'Santiago', 'Vitacura'
];

export default function RegistroPage() {
  // Credenciales
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  // Datos Personales
  const [nombre, setNombre] = useState('');
  const [apellido, setApellido] = useState('');
  const [edad, setEdad] = useState('');
  const [sexo, setSexo] = useState('');
  const [whatsapp, setWhatsapp] = useState('+569');

  // Dirección
  const [comuna, setComuna] = useState('');
  const [calle, setCalle] = useState('');
  const [numero, setNumero] = useState('');
  const [indicaciones, setIndicaciones] = useState('');

  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const supabase = createClient();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    
    // Validaciones básicas
    if (whatsapp.length < 11 || !whatsapp.startsWith('+569')) {
      setErrorMsg('El WhatsApp debe tener un formato válido (+569XXXXXXXX)');
      return;
    }
    if (calle.length < 4) {
      setErrorMsg('Por favor ingresa una dirección válida.');
      return;
    }

    setIsLoading(true);
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: `${nombre} ${apellido}`,
            first_name: nombre,
            last_name: apellido,
            age: edad,
            gender: sexo,
            phone: whatsapp,
            comuna,
            address: calle,
            address_number: numero,
            address_notes: indicaciones
          },
        },
      });
      if (error) throw error;
      setSuccessMsg('¡Registro exitoso! Redirigiendo...');
      setTimeout(() => {
        window.location.href = '/bienvenida';
      }, 2000);
    } catch (err: any) {
      setErrorMsg(err.message || 'Error al crear la cuenta. Intenta nuevamente.');
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
      <div className="relative z-10 w-full max-w-2xl bg-white/95 backdrop-blur-3xl p-8 md:p-10 rounded-[2.5rem] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.5)] border border-white/50 animate-in fade-in zoom-in duration-500">
        
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
            <span className="text-3xl">🌸</span>
          </div>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Únete a Chileflor</h1>
          <p className="text-gray-500 mt-2 text-sm">
            Completa tus datos para disfrutar de despachos rápidos y promociones exclusivas.
          </p>
        </div>

        {errorMsg && (
          <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm font-medium text-center">
            {errorMsg}
          </div>
        )}

        {successMsg && (
          <div className="mb-6 p-6 rounded-2xl bg-green-50 border border-green-200 text-green-700 text-center animate-in zoom-in duration-300">
            <div className="text-4xl mb-2">🎉</div>
            <h3 className="font-bold text-lg mb-1">¡Cuenta creada con éxito!</h3>
            <p className="text-sm font-medium">{successMsg}</p>
          </div>
        )}

        <form onSubmit={handleRegister} className="space-y-8">
          
          {/* SECCIÓN 1: Datos Personales */}
          <div>
            <h3 className="text-lg font-bold text-gray-800 mb-4 border-b pb-2">1. Datos Personales</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Nombre</label>
                <input required type="text" placeholder="Ej: Camila" value={nombre} onChange={(e) => setNombre(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all bg-white" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Apellido</label>
                <input required type="text" placeholder="Ej: Rojas" value={apellido} onChange={(e) => setApellido(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all bg-white" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Edad</label>
                <input required type="number" min="18" max="120" placeholder="Ej: 28" value={edad} onChange={(e) => setEdad(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all bg-white" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Sexo</label>
                <select required value={sexo} onChange={(e) => setSexo(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all bg-white appearance-none">
                  <option value="" disabled>Selecciona una opción</option>
                  <option value="Femenino">Femenino</option>
                  <option value="Masculino">Masculino</option>
                  <option value="No binario">No binario</option>
                  <option value="No especifico">Prefiero no decirlo</option>
                </select>
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">WhatsApp</label>
                <input required type="tel" value={whatsapp} onChange={(e) => setWhatsapp(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all bg-white" />
              </div>
            </div>
          </div>

          {/* SECCIÓN 2: Despacho */}
          <div>
            <h3 className="text-lg font-bold text-gray-800 mb-4 border-b pb-2">2. Dirección de Entrega (Región Metropolitana)</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Comuna</label>
                <select required value={comuna} onChange={(e) => setComuna(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all bg-white appearance-none">
                  <option value="" disabled>Selecciona tu comuna</option>
                  {COMUNAS_RM.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div className="md:col-span-1">
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Calle / Pasaje</label>
                <input required type="text" placeholder="Ej: Av. Providencia" value={calle} onChange={(e) => setCalle(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all bg-white" />
              </div>
              <div className="md:col-span-1">
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">N° Casa/Depto</label>
                <input required type="text" placeholder="Ej: 1234, Depto 402" value={numero} onChange={(e) => setNumero(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all bg-white" />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Otras indicaciones (Opcional)</label>
                <textarea placeholder="Ej: Dejar en conserjería, reja roja..." value={indicaciones} onChange={(e) => setIndicaciones(e.target.value)} rows={2}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all bg-white resize-none" />
              </div>
            </div>
          </div>

          {/* SECCIÓN 3: Cuenta */}
          <div>
            <h3 className="text-lg font-bold text-gray-800 mb-4 border-b pb-2">3. Credenciales de la Cuenta</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Correo electrónico</label>
                <input required type="email" placeholder="nombre@chileflor.cl" value={email} onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all bg-white" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Contraseña (Mínimo 6 caracteres)</label>
                <input required type="password" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} minLength={6}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all bg-white" />
              </div>
            </div>
          </div>

          <button 
            type="submit"
            disabled={isLoading}
            className={`w-full bg-primary text-white font-bold text-lg py-4 rounded-xl shadow-lg shadow-primary/30 transition-transform mt-6 ${isLoading ? 'opacity-70 cursor-not-allowed' : 'hover:bg-primary-dark hover:-translate-y-0.5'}`}
          >
            {isLoading ? 'Creando tu cuenta...' : 'Crear Cuenta Segura'}
          </button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-6">
          ¿Ya tienes una cuenta? <a href="/login" className="text-primary font-bold hover:underline">Inicia sesión aquí</a>
        </p>
      </div>
    </div>
  );
}
