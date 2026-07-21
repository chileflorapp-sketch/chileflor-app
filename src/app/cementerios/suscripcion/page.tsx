'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function SuscripcionCementerioPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    nombre: '',
    whatsapp: '',
    correo: '',
    cementerio: '',
    sector: '',
    lapida: '',
    nombreDifunto: '',
    preferenciaFlores: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const mensaje = `¡Hola Chileflor! 🌸 Quiero suscribirme al plan bimensual de mantención de cementerios ($25.990 por visita).
    
*Mis Datos:*
- Nombre: ${formData.nombre}
- WhatsApp: ${formData.whatsapp}
- Correo: ${formData.correo}

*Datos de Ubicación:*
- Cementerio: ${formData.cementerio}
- Sector/Patio: ${formData.sector}
- Nº Lápida/Sepultura: ${formData.lapida}

*Datos del Recuerdo:*
- Nombre del Difunto: ${formData.nombreDifunto}
- Preferencia Floral: ${formData.preferenciaFlores || 'Las más frescas de temporada (Sin preferencia específica)'}

Por favor, indíquenme los pasos para realizar el primer pago y agendar la primera visita. ¡Gracias!`;

    const url = `https://wa.me/56979992848?text=${encodeURIComponent(mensaje)}`;
    window.open(url, '_blank');
    
    // Redirigir al inicio o mostrar éxito
    router.push('/cementerios');
  };

  return (
    <div className="min-h-screen bg-gray-50 py-20">
      <div className="container mx-auto px-4 max-w-2xl">
        <div className="text-center mb-12">
          <div className="inline-block px-4 py-1.5 bg-primary/10 border border-primary/20 rounded-full text-xs font-bold tracking-widest uppercase mb-6 text-primary">
            Suscripción Bimensual
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Mantención de Cementerios
          </h1>
          <p className="text-gray-500 text-lg">
            Asegura el cuidado constante y las flores más hermosas para tus seres queridos. Por solo <strong className="text-gray-900">$25.990</strong> por visita.
          </p>
        </div>

        <div className="bg-white rounded-[2.5rem] p-8 md:p-12 shadow-xl border border-gray-100 relative overflow-hidden">
          
          {/* Progress Bar */}
          <div className="flex gap-2 mb-10">
            <div className={`h-1.5 flex-1 rounded-full transition-colors duration-500 ${step >= 1 ? 'bg-primary' : 'bg-gray-100'}`}></div>
            <div className={`h-1.5 flex-1 rounded-full transition-colors duration-500 ${step >= 2 ? 'bg-primary' : 'bg-gray-100'}`}></div>
            <div className={`h-1.5 flex-1 rounded-full transition-colors duration-500 ${step >= 3 ? 'bg-primary' : 'bg-gray-100'}`}></div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
            
            {step === 1 && (
              <div className="animate-in fade-in slide-in-from-right-4 duration-500">
                <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                  <span className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center text-sm">1</span> 
                  Tus Datos de Contacto
                </h3>
                <p className="text-gray-500 mb-6 text-sm">Necesitamos tus datos para enviarte las fotografías de evidencia tras cada mantención.</p>
                <div className="space-y-5">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Nombre Completo</label>
                    <input required name="nombre" value={formData.nombre} onChange={handleChange} type="text" className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-4 py-3.5 text-gray-900 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all" placeholder="Ej: Camila Rojas" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">WhatsApp</label>
                    <input required name="whatsapp" value={formData.whatsapp} onChange={handleChange} type="tel" className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-4 py-3.5 text-gray-900 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all" placeholder="+56 9 1234 5678" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Correo Electrónico</label>
                    <input required name="correo" value={formData.correo} onChange={handleChange} type="email" className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-4 py-3.5 text-gray-900 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all" placeholder="correo@ejemplo.cl" />
                  </div>
                </div>
                <button type="button" onClick={() => setStep(2)} className="w-full mt-8 bg-gray-900 text-white font-bold py-4 rounded-xl hover:bg-gray-800 transition-colors shadow-lg">
                  Siguiente: Ubicación Exacta
                </button>
              </div>
            )}

            {step === 2 && (
              <div className="animate-in fade-in slide-in-from-right-4 duration-500">
                <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                  <span className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center text-sm">2</span> 
                  Ubicación de la Sepultura
                </h3>
                <p className="text-gray-500 mb-6 text-sm">Asegúrate de entregarnos la ubicación exacta para garantizar que las flores lleguen a su destino.</p>
                <div className="space-y-5">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Cementerio</label>
                    <select 
                      required 
                      name="cementerio" 
                      value={formData.cementerio} 
                      onChange={handleChange} 
                      className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-4 py-3.5 text-gray-900 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all appearance-none"
                    >
                      <option value="" disabled>Seleccione el recinto</option>
                      <option value="Cementerio Parque El Prado">Cementerio Parque El Prado</option>
                      <option value="Parque Del Recuerdo Cordillera">Parque Del Recuerdo Cordillera</option>
                    </select>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">Sector / Patio</label>
                      <input required name="sector" value={formData.sector} onChange={handleChange} type="text" className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-4 py-3.5 text-gray-900 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all" placeholder="Ej: Sector C" />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">Nº Lápida</label>
                      <input required name="lapida" value={formData.lapida} onChange={handleChange} type="text" className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-4 py-3.5 text-gray-900 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all" placeholder="Ej: 421" />
                    </div>
                  </div>
                </div>
                <div className="flex gap-4 mt-8">
                  <button type="button" onClick={() => setStep(1)} className="w-1/3 bg-white text-gray-900 border border-gray-200 font-bold py-4 rounded-xl hover:bg-gray-50 transition-colors">Volver</button>
                  <button type="button" onClick={() => setStep(3)} className="w-2/3 bg-gray-900 text-white font-bold py-4 rounded-xl hover:bg-gray-800 transition-colors shadow-lg">Siguiente: Detalles Finales</button>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="animate-in fade-in slide-in-from-right-4 duration-500">
                <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                  <span className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center text-sm">3</span> 
                  Detalles del Recuerdo
                </h3>
                <p className="text-gray-500 mb-6 text-sm">Personaliza tu suscripción indicando a quién honramos y si tienes alguna preferencia floral especial.</p>
                <div className="space-y-5">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Nombre en la Lápida (Difunto)</label>
                    <input required name="nombreDifunto" value={formData.nombreDifunto} onChange={handleChange} type="text" className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-4 py-3.5 text-gray-900 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all" placeholder="Ej: María Angélica Fuentes" />
                    <p className="text-[10px] text-gray-400 mt-1.5">Esto nos ayuda a verificar que estamos en el lugar correcto.</p>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Preferencia de Flores (Opcional)</label>
                    <textarea name="preferenciaFlores" value={formData.preferenciaFlores} onChange={handleChange} rows={2} className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-4 py-3.5 text-gray-900 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all resize-none" placeholder="Ej: Solo rosas blancas, evitar claveles..." />
                    <p className="text-[10px] text-gray-400 mt-1.5">Si lo dejas en blanco, nuestros floristas elegirán las opciones de temporada más hermosas y resistentes.</p>
                  </div>
                </div>
                
                <div className="mt-8 bg-primary/5 border border-primary/20 rounded-xl p-4 flex gap-4 items-start">
                  <span className="text-2xl">🔒</span>
                  <div>
                    <p className="font-bold text-gray-900 text-sm">Confirmación Segura</p>
                    <p className="text-xs text-gray-500 mt-1">Al continuar, serás redirigido a WhatsApp para confirmar tu suscripción y organizar el primer pago de manera segura directamente con nuestro equipo.</p>
                  </div>
                </div>

                <div className="flex gap-4 mt-8">
                  <button type="button" onClick={() => setStep(2)} className="w-1/3 bg-white text-gray-900 border border-gray-200 font-bold py-4 rounded-xl hover:bg-gray-50 transition-colors">Volver</button>
                  <button type="submit" className="w-2/3 bg-primary text-white font-bold py-4 rounded-xl hover:bg-primary-dark transition-all shadow-lg shadow-primary/30 flex items-center justify-center gap-2 group">
                    Confirmar Suscripción
                    <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                  </button>
                </div>
              </div>
            )}

          </form>
        </div>
      </div>
    </div>
  );
}


