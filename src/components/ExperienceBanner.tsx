export default function ExperienceBanner() {
  return (
    <section className="container mx-auto px-4 py-8">
      <div className="relative rounded-3xl overflow-hidden shadow-2xl group cursor-pointer block bg-gray-900 border border-gray-800">
        
        {/* Background Floral Overlay */}
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1563241527-20042457fb1e?auto=format&fit=crop&q=80&w=2000')] bg-cover bg-center opacity-40 group-hover:opacity-50 transition-opacity duration-700"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-gray-900 via-gray-900/80 to-transparent"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-primary/30 to-transparent mix-blend-overlay"></div>

        {/* Content */}
        <div className="relative z-10 p-8 md:p-16 flex flex-col md:flex-row items-center justify-between gap-8 h-full">
          
          <div className="max-w-xl text-left">
             <div className="inline-block px-3 py-1 bg-white/10 backdrop-blur-md border border-white/20 rounded-full text-xs font-bold text-white tracking-widest uppercase mb-4">
               Laboratorio Chileflor
             </div>
             <h2 className="text-3xl md:text-5xl font-bold text-white mb-4 font-serif leading-tight">
               El Arte Detrás de la Belleza
             </h2>
             <p className="text-gray-300 text-lg mb-8 max-w-md">
               Experimenta la deconstrucción botánica en gravedad cero y acompaña nuestra logística en tiempo real por La Florida.
             </p>
             <a href="/experiencia" className="inline-flex items-center justify-center gap-2 bg-white text-gray-900 px-8 py-4 rounded-full font-bold uppercase tracking-wider text-sm shadow-xl hover:scale-105 transition-transform duration-300">
               Vivir la Experiencia <span className="text-lg">✨</span>
             </a>
          </div>

          <div className="hidden md:block">
            {/* Pequeño preview visual (estático) */}
            <div className="relative w-48 h-48 border border-white/20 rounded-full flex items-center justify-center backdrop-blur-sm bg-white/5 shadow-2xl group-hover:scale-105 transition-transform duration-700">
              <span className="text-6xl drop-shadow-2xl absolute -translate-x-8 -translate-y-6">🌸</span>
              <span className="text-6xl drop-shadow-2xl absolute translate-x-6 -translate-y-8">🌿</span>
              <span className="text-6xl drop-shadow-2xl absolute translate-y-8 z-10">🌹</span>
            </div>
          </div>
          
        </div>
      </div>
    </section>
  );
}
