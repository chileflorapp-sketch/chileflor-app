export default function CementeriosPage() {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Banner Hero */}
      <section className="relative w-full overflow-hidden bg-gray-900 pt-32 pb-24 px-4">
        <div className="absolute inset-0 opacity-40">
           <img src="https://images.unsplash.com/photo-1563241527-3004b7be0ffd?auto=format&fit=crop&w=1600&q=80" alt="Flores Cementerio" className="w-full h-full object-cover grayscale" />
        </div>
        <div className="container mx-auto max-w-4xl relative z-10 text-center text-white">
          <span className="inline-block bg-primary text-white text-xs font-bold px-3 py-1 rounded-full mb-4 uppercase tracking-wider shadow-sm">
            Servicio Especializado
          </span>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 tracking-tight">Cuidamos tu recuerdo</h1>
          <p className="text-lg md:text-xl text-gray-300 max-w-2xl mx-auto mb-10 leading-relaxed">
            La diferencia entre el olvido y la memoria eterna. Nosotros vamos por ti. Suscríbete a nuestros planes de limpieza y renovación floral bimensual.
          </p>
          <a href="#planes" className="inline-block bg-primary text-white font-bold px-8 py-4 rounded-full shadow-lg shadow-primary/30 hover:bg-primary-dark transition-all hover:-translate-y-1">
            Ver Planes de Mantención
          </a>
        </div>
      </section>

      {/* Cobertura Exclusiva */}
      <section className="container mx-auto px-4 py-16 max-w-5xl -mt-10 relative z-20">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-gray-900">Nuestra Cobertura</h2>
          <p className="text-gray-500 mt-2">Operamos exclusivamente en los siguientes recintos para garantizar un servicio de excelencia.</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Parque El Prado */}
          <div className="bg-white rounded-3xl p-8 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.1)] border border-gray-100 flex flex-col items-center text-center hover:border-primary/30 transition-colors group">
            <div className="w-20 h-20 bg-green-50 text-green-600 rounded-full flex items-center justify-center text-4xl mb-6 group-hover:scale-110 transition-transform">
              🕊️
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Cementerio Parque El Prado</h3>
            <span className="bg-green-100 text-green-700 text-xs font-bold px-3 py-1 rounded-full mb-4">Cobertura Activa</span>
            <p className="text-gray-500 text-sm">Realizamos entregas directas a la sepultura y mantenimientos periódicos con total respeto y cuidado.</p>
          </div>

          {/* Parque Del Recuerdo Cordillera */}
          <div className="bg-white rounded-3xl p-8 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.1)] border border-gray-100 flex flex-col items-center text-center hover:border-primary/30 transition-colors group">
            <div className="w-20 h-20 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center text-4xl mb-6 group-hover:scale-110 transition-transform">
              🪦
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Parque Del Recuerdo Cordillera</h3>
            <span className="bg-green-100 text-green-700 text-xs font-bold px-3 py-1 rounded-full mb-4">Cobertura Activa</span>
            <p className="text-gray-500 text-sm">Nuestros especialistas conocen cada sector del parque para asegurar que tus flores lleguen a su destino.</p>
          </div>
        </div>
      </section>

      {/* Cómo Funciona */}
      <section className="bg-white py-16 border-y border-gray-100">
        <div className="container mx-auto px-4 max-w-5xl">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">¿Cómo Funciona?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-gray-900 text-white rounded-2xl flex items-center justify-center text-2xl font-bold mx-auto mb-4 shadow-lg">1</div>
              <h3 className="font-bold text-gray-900 mb-2">Seleccionas</h3>
              <p className="text-gray-500 text-sm">Eliges un ramo de nuestro catálogo o te suscribes al plan de mantención bimensual.</p>
            </div>
            <div className="text-center relative">
              <div className="hidden md:block absolute top-8 -left-4 w-full h-0.5 bg-gray-100 -z-10"></div>
              <div className="w-16 h-16 bg-gray-900 text-white rounded-2xl flex items-center justify-center text-2xl font-bold mx-auto mb-4 shadow-lg">2</div>
              <h3 className="font-bold text-gray-900 mb-2">Nosotros vamos</h3>
              <p className="text-gray-500 text-sm">Ubicamos la sepultura exacta mediante geolocalización, limpiamos y colocamos las flores frescas.</p>
            </div>
            <div className="text-center relative">
              <div className="hidden md:block absolute top-8 -left-4 w-full h-0.5 bg-gray-100 -z-10"></div>
              <div className="w-16 h-16 bg-primary text-white rounded-2xl flex items-center justify-center text-2xl font-bold mx-auto mb-4 shadow-lg shadow-primary/30">3</div>
              <h3 className="font-bold text-gray-900 mb-2">Recibes Evidencia</h3>
              <p className="text-gray-500 text-sm">Te enviamos fotografías del antes y el después directamente a tu WhatsApp y a tu Panel.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Planes de Suscripción */}
      <section id="planes" className="container mx-auto px-4 py-20 max-w-4xl">
        <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-[2.5rem] p-8 md:p-12 shadow-2xl relative overflow-hidden">
          {/* Decoración */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 rounded-full blur-[80px] -mr-20 -mt-20 pointer-events-none"></div>
          
          <div className="relative z-10 flex flex-col md:flex-row items-center gap-10">
            <div className="flex-1 text-white">
              <div className="inline-block bg-primary/20 text-primary border border-primary/30 text-xs font-bold px-3 py-1 rounded-full mb-4">
                PLAN RECOMENDADO
              </div>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Suscripción Bimensual</h2>
              <p className="text-gray-400 mb-6 leading-relaxed">
                Despreocúpate. Nuestro equipo visitará la sepultura de tu ser querido dos veces al mes para mantenerla impecable.
              </p>
              <ul className="space-y-4 mb-8">
                <li className="flex items-center gap-3 text-gray-300">
                  <span className="text-primary">✓</span> Limpieza profunda de lápida.
                </li>
                <li className="flex items-center gap-3 text-gray-300">
                  <span className="text-primary">✓</span> Recambio de flores frescas de temporada.
                </li>
                <li className="flex items-center gap-3 text-gray-300">
                  <span className="text-primary">✓</span> Evidencia fotográfica enviada a tu celular.
                </li>
              </ul>
            </div>
            
            <div className="bg-white rounded-3xl p-8 w-full md:w-80 text-center shadow-xl transform hover:scale-105 transition-transform">
              <p className="text-gray-500 font-medium mb-2 uppercase text-sm tracking-wider">Valor por Visita</p>
              <p className="text-5xl font-black text-gray-900 mb-2">$25.990</p>
              <p className="text-sm text-gray-400 mb-8">Cobro por visita realizada.</p>
              <a href="/cementerios/suscripcion" className="block w-full bg-primary text-white font-bold py-4 rounded-xl shadow-lg shadow-primary/30 hover:bg-primary-dark transition-all">
                Suscribirse Ahora
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}


