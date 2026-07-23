export default function ExperienceBanner({ config }: { config?: any }) {
  const badge = config?.badge || 'Conócenos';
  const title = config?.title || 'El Arte Detrás de la Belleza';
  const description = config?.description || 'Descubre la historia de Chileflor, nuestras anécdotas de taller, datos fascinantes y conoce a las personas que hacen posible cada sonrisa.';
  const buttonText = config?.buttonText || 'Descubrir Más ✨';
  const buttonLink = config?.buttonLink || '/nosotros';

  return (
    <section className="bg-gray-900 py-24 relative overflow-hidden">
      <div className="absolute inset-0 opacity-20">
         <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1596433804825-779899388c42?auto=format&fit=crop&q=80')] bg-cover bg-center mix-blend-overlay"></div>
      </div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="flex flex-col md:flex-row items-center justify-between gap-12">
          
          <div className="max-w-xl text-left">
             <div className="inline-block px-3 py-1 bg-white/10 backdrop-blur-md border border-white/20 rounded-full text-xs font-bold text-white tracking-widest uppercase mb-4">
               {badge}
             </div>
             <h2 className="text-3xl md:text-5xl font-bold text-white mb-4 font-serif leading-tight">
               {title}
             </h2>
             <p className="text-gray-300 text-lg mb-8 max-w-md">
               {description}
             </p>
             <a href={buttonLink} className="inline-flex items-center justify-center gap-2 bg-white text-gray-900 px-8 py-4 rounded-full font-bold uppercase tracking-wider text-sm shadow-xl hover:scale-105 transition-transform duration-300">
               {buttonText}
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
