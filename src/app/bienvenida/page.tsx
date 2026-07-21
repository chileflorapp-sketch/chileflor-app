'use client';

export default function BienvenidaPage() {
  return (
    <div className="relative min-h-[calc(100vh-64px)] flex items-center justify-center p-4 overflow-hidden py-12">
      {/* Cinematic Background */}
      <div className="absolute inset-0 z-0">
        <img 
          src="https://images.unsplash.com/photo-1582794543139-8ac9cb0f7b11?auto=format&fit=crop&w=2000&q=80" 
          alt="Flores Bienvenida Fondo" 
          className="w-full h-full object-cover opacity-80"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900/95 via-gray-900/80 to-primary/40 backdrop-blur-sm"></div>
      </div>

      {/* Welcome Card */}
      <div className="relative z-10 w-full max-w-3xl bg-white/95 backdrop-blur-3xl p-8 md:p-12 rounded-[2.5rem] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.5)] border border-white/50 animate-in fade-in zoom-in duration-700">
        
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary/10 mb-6 animate-bounce">
            <span className="text-4xl">🎉</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight mb-4">
            ¡Bienvenido a <span className="text-primary">Chileflor</span>!
          </h1>
          <p className="text-gray-500 text-lg max-w-xl mx-auto">
            Tu cuenta ha sido creada exitosamente. A partir de hoy, eres parte del club de flores más exclusivo de Chile.
          </p>
        </div>

        {/* Benefits Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
          <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100 hover:border-primary/30 transition-colors">
            <div className="text-3xl mb-3">🚀</div>
            <h3 className="font-bold text-gray-900 mb-2">Despacho Express</h3>
            <p className="text-sm text-gray-600">Al tener tu dirección guardada, tus futuras compras se procesarán en segundos para despachos prioritarios.</p>
          </div>
          <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100 hover:border-primary/30 transition-colors">
            <div className="text-3xl mb-3">🏆</div>
            <h3 className="font-bold text-gray-900 mb-2">Club Chileflor</h3>
            <p className="text-sm text-gray-600">Acumula puntos por cada peso que gastes y canjéalos por descuentos y arreglos florales gratis.</p>
          </div>
          <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100 hover:border-primary/30 transition-colors">
            <div className="text-3xl mb-3">📅</div>
            <h3 className="font-bold text-gray-900 mb-2">Agenda de Vínculos</h3>
            <p className="text-sm text-gray-600">Guarda cumpleaños y aniversarios en tu perfil. Te avisaremos con anticipación para que nunca lo olvides.</p>
          </div>
          <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100 hover:border-primary/30 transition-colors">
            <div className="text-3xl mb-3">⭐</div>
            <h3 className="font-bold text-gray-900 mb-2">Ofertas Exclusivas</h3>
            <p className="text-sm text-gray-600">Acceso anticipado a promociones del Día de la Madre, San Valentín y descuentos sorpresa solo para miembros.</p>
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center">
          <a 
            href="/catalogo"
            className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-primary to-primary-dark text-white font-bold text-lg px-10 py-5 rounded-2xl shadow-lg shadow-primary/30 hover:-translate-y-1 transition-all duration-300 w-full md:w-auto"
          >
            <span>Ir a Comprar</span>
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </a>
          <p className="mt-4 text-sm text-gray-400">
            Revisa tu correo para verificar tu cuenta cuando tengas un tiempo libre.
          </p>
        </div>

      </div>
    </div>
  );
}
