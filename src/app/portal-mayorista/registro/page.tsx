'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import gsap from 'gsap';

export default function B2BRegistrationPage() {
  const router = useRouter();
  const [isLogin, setIsLogin] = useState(false);
  const [step, setStep] = useState(1);
  
  const [formData, setFormData] = useState({
    rut: '',
    password: '',
    nombre: '',
    telefono: '',
    direccion: '',
    razonSocial: ''
  });
  
  const cardRef = useRef<HTMLDivElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (cardRef.current) {
      gsap.to(cardRef.current, {
        y: -10,
        duration: 4,
        repeat: -1,
        yoyo: true,
        ease: "power1.inOut"
      });
    }
    if (bgRef.current) {
      gsap.to(bgRef.current, {
        rotation: 10,
        scale: 1.05,
        duration: 30,
        repeat: -1,
        yoyo: true,
        ease: "none"
      });
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Acceso directo simulado
    router.push('/portal-mayorista/catalogo');
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    // Creación de cuenta y acceso directo (sin aprobación)
    router.push('/portal-mayorista/catalogo');
  };

  return (
    <div className="relative min-h-screen bg-[#0A0A0A] py-24 font-serif overflow-hidden flex items-center justify-center">
      {/* Background Decor (Ajustado para no tapar contenido superior) */}
      <div 
        ref={bgRef}
        className="absolute inset-0 z-0 opacity-15 pointer-events-none"
        style={{
          backgroundImage: 'url(/hero_b2c_bouquet.png)',
          backgroundSize: '50%',
          backgroundPosition: 'right 20%',
          backgroundRepeat: 'no-repeat',
          filter: 'blur(10px)'
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/90 z-0 pointer-events-none" />

      <div className="container mx-auto px-4 max-w-lg relative z-10 w-full pt-10">
        <div className="text-center mb-8">
          <div className="inline-block px-4 py-1.5 bg-yellow-500/10 border border-yellow-500/20 rounded-full text-xs font-bold tracking-widest uppercase mb-4 text-yellow-500 shadow-[0_0_15px_rgba(234,179,8,0.2)]">
            Portal Mayorista B2B
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2 drop-shadow-lg">
            {isLogin ? 'Iniciar Sesión' : 'Crear Cuenta'}
          </h1>
          <p className="text-gray-400 text-sm drop-shadow-md">
            {isLogin ? 'Accede a tu cuenta de mayorista para ver los precios preferenciales.' : 'Regístrate y obtén acceso inmediato a nuestro catálogo mayorista.'}
          </p>
        </div>

        {/* Pestañas (Tabs) */}
        <div className="flex bg-[#151515] rounded-xl p-1 mb-8 border border-white/5 shadow-lg">
          <button 
            onClick={() => { setIsLogin(false); setStep(1); }}
            className={`flex-1 py-3 text-sm font-bold rounded-lg transition-all ${!isLogin ? 'bg-white/10 text-yellow-500 shadow-md' : 'text-gray-500 hover:text-gray-300'}`}
          >
            Registrarse
          </button>
          <button 
            onClick={() => setIsLogin(true)}
            className={`flex-1 py-3 text-sm font-bold rounded-lg transition-all ${isLogin ? 'bg-white/10 text-yellow-500 shadow-md' : 'text-gray-500 hover:text-gray-300'}`}
          >
            Ya tengo cuenta
          </button>
        </div>

        {/* Tarjeta Flotante (Glassmorphism) */}
        <div 
          ref={cardRef}
          className="bg-white/5 backdrop-blur-xl rounded-3xl p-6 md:p-10 shadow-[0_30px_60px_rgba(0,0,0,0.5)] border border-white/10"
        >
          {isLogin ? (
            /* FORMULARIO DE LOGIN */
            <form onSubmit={handleLogin} className="space-y-6 animate-in fade-in duration-500">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">RUT</label>
                <input required name="rut" value={formData.rut} onChange={handleChange} type="text" className="w-full bg-[#111111] border border-gray-800 rounded-xl px-4 py-3 text-white focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500 outline-none transition-all" placeholder="12.345.678-9" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Contraseña</label>
                <input required name="password" value={formData.password} onChange={handleChange} type="password" className="w-full bg-[#111111] border border-gray-800 rounded-xl px-4 py-3 text-white focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500 outline-none transition-all" placeholder="********" />
              </div>
              <button type="submit" className="w-full relative group bg-yellow-500 text-black font-bold py-4 rounded-xl transition-all hover:-translate-y-1 mt-4">
                <div className="absolute inset-0 bg-yellow-500 rounded-xl blur-md opacity-0 group-hover:opacity-50 transition-opacity duration-300"></div>
                <span className="relative">Ingresar al Catálogo</span>
              </button>
            </form>
          ) : (
            /* FORMULARIO DE REGISTRO (Simplificado) */
            <form onSubmit={handleRegister} className="space-y-6">
              
              {step === 1 && (
                <div className="animate-in fade-in slide-in-from-right-4 duration-500 space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">RUT de Empresa o Persona</label>
                    <input required name="rut" value={formData.rut} onChange={handleChange} type="text" className="w-full bg-[#111111] border border-gray-800 rounded-xl px-4 py-3 text-white focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500 outline-none transition-all" placeholder="76.123.456-7" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">Crea tu Contraseña</label>
                    <input required name="password" value={formData.password} onChange={handleChange} type="password" className="w-full bg-[#111111] border border-gray-800 rounded-xl px-4 py-3 text-white focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500 outline-none transition-all" placeholder="Min. 6 caracteres" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">Nombre de Contacto</label>
                    <input required name="nombre" value={formData.nombre} onChange={handleChange} type="text" className="w-full bg-[#111111] border border-gray-800 rounded-xl px-4 py-3 text-white focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500 outline-none transition-all" placeholder="Juan Pérez" />
                  </div>
                  <button type="button" onClick={() => setStep(2)} className="w-full mt-6 bg-white/10 text-white font-bold py-4 rounded-xl hover:bg-white/20 transition-colors border border-white/10">
                    Siguiente Paso
                  </button>
                </div>
              )}

              {step === 2 && (
                <div className="animate-in fade-in slide-in-from-right-4 duration-500 space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">WhatsApp de Contacto</label>
                    <input required name="telefono" value={formData.telefono} onChange={handleChange} type="tel" className="w-full bg-[#111111] border border-gray-800 rounded-xl px-4 py-3 text-white focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500 outline-none transition-all" placeholder="+56 9 1234 5678" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">Dirección de Entrega</label>
                    <input required name="direccion" value={formData.direccion} onChange={handleChange} type="text" className="w-full bg-[#111111] border border-gray-800 rounded-xl px-4 py-3 text-white focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500 outline-none transition-all" placeholder="Región, Comuna, Calle" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">Razón Social o Giro (Opcional)</label>
                    <input name="razonSocial" value={formData.razonSocial} onChange={handleChange} type="text" className="w-full bg-[#111111] border border-gray-800 rounded-xl px-4 py-3 text-white focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500 outline-none transition-all" placeholder="Venta de flores al por menor" />
                  </div>
                  
                  <div className="flex gap-4 mt-8">
                    <button type="button" onClick={() => setStep(1)} className="w-1/3 bg-[#111111] text-white border border-gray-800 font-bold py-4 rounded-xl hover:bg-gray-800 transition-colors">Atrás</button>
                    <button type="submit" className="w-2/3 relative group bg-yellow-500 text-black font-bold py-4 rounded-xl transition-all hover:-translate-y-1">
                      <div className="absolute inset-0 bg-yellow-500 rounded-xl blur-md opacity-0 group-hover:opacity-50 transition-opacity duration-300"></div>
                      <span className="relative">Crear Cuenta</span>
                    </button>
                  </div>
                </div>
              )}
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
