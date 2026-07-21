import InteractiveBouquet from '@/components/InteractiveBouquet';
import LogisticsSimulator from '@/components/LogisticsSimulator';

export default function ExperienciaPage() {
  return (
    <div className="min-h-screen bg-[#FDFBF7]">
      
      {/* Header */}
      <section className="container mx-auto px-4 py-20 text-center max-w-3xl">
        <h1 className="text-4xl md:text-5xl font-serif font-bold text-gray-900 mb-6">
          La Experiencia Chileflor
        </h1>
        <p className="text-gray-600 text-lg">
          Descubre la meticulosa ingeniería detrás de cada arreglo floral y acompaña nuestra red de despachos en tiempo real por el corazón de La Florida.
        </p>
      </section>

      {/* Zero Gravity Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="flex flex-col lg:flex-row gap-12 items-center">
          <div className="lg:w-1/3">
            <h2 className="text-3xl font-serif font-bold text-gray-900 mb-4">Deconstrucción Floral</h2>
            <p className="text-gray-600 mb-6 leading-relaxed">
              Cada ramo es ensamblado con precisión arquitectónica. Presiona "Deconstruir" para separar las capas en nuestro lienzo de gravedad cero. Observa cómo el eucalipto, los lirios y las rosas rojas flotan independientemente antes de volver a su posición perfecta.
            </p>
            <ul className="space-y-4 text-sm text-gray-700">
              <li className="flex gap-3"><span className="text-primary">🌿</span> 4 Ramas de Eucalipto (Soporte Estructural)</li>
              <li className="flex gap-3"><span className="text-primary">🌸</span> 3 Lirios Blancos (Volumen y Aroma)</li>
              <li className="flex gap-3"><span className="text-primary">🌹</span> 5 Rosas Rojas Premium (Foco Central)</li>
            </ul>
          </div>
          <div className="lg:w-2/3 w-full">
            <InteractiveBouquet />
          </div>
        </div>
      </section>

      {/* Logistics Section */}
      <section className="bg-[#121212] py-24 mt-16 text-white border-t border-gray-800">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row gap-12 items-center">
            <div className="lg:w-2/3 w-full order-2 lg:order-1">
              <LogisticsSimulator />
            </div>
            <div className="lg:w-1/3 order-1 lg:order-2">
              <div className="inline-block px-3 py-1 bg-white/10 border border-white/20 rounded-full text-xs font-bold tracking-widest uppercase mb-4 text-gray-300">
                Logística Hiperlocal
              </div>
              <h2 className="text-3xl font-serif font-bold mb-4">Despacho de Precisión</h2>
              <p className="text-gray-400 mb-6 leading-relaxed">
                Nuestra red de repartidores en tiempo real. Observa cómo nuestros vehículos navegan por la intersección crítica de <strong>Av. La Florida con Walker Martínez</strong>.
              </p>
              <p className="text-gray-400 leading-relaxed mb-6">
                Monitoreamos las variables ambientales y el estado del tráfico para garantizar que las flores lleguen con la temperatura y el cuidado óptimo.
              </p>
              <a href="/catalogo" className="inline-flex items-center justify-center gap-2 bg-primary text-white px-8 py-4 rounded-full font-bold uppercase tracking-wider text-sm shadow-xl shadow-primary/20 hover:bg-[#d61e42] transition-colors">
                Ver Catálogo
              </a>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}


