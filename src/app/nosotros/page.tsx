'use client';
import { motion } from 'framer-motion';

export default function NosotrosPage() {
  return (
    <div className="min-h-screen bg-[#FDFBF7] pt-24 pb-20">
      
      {/* Hero Section */}
      <section className="container mx-auto px-4 max-w-5xl mb-24">
        <div className="text-center">
          <motion.p 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-primary font-bold tracking-widest uppercase text-sm mb-4"
          >
            Nuestra Historia
          </motion.p>
          <motion.h1 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-5xl md:text-6xl font-serif font-bold text-gray-900 mb-8 leading-tight"
          >
            La unión de dos legados florales.
          </motion.h1>
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative w-full h-[60vh] rounded-[2.5rem] overflow-hidden shadow-2xl"
          >
            <img 
              src="https://images.unsplash.com/photo-1596160534241-11a546c4ab0a?auto=format&fit=crop&w=2000&q=80" 
              alt="Florería con arreglos hermosos"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end">
              <div className="p-10 md:p-16 text-left">
                <p className="text-white/90 text-lg md:text-2xl font-serif max-w-2xl leading-relaxed">
                  "Chileflor nace de la colaboración de mentes apasionadas por transformar emociones en arte natural."
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Orígenes Section */}
      <section className="container mx-auto px-4 max-w-4xl mb-24">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl font-serif font-bold text-gray-900 mb-6">Nuestros Fundadores</h2>
            <p className="text-gray-600 leading-relaxed mb-4 text-lg">
              Chileflor no es solo una florería digital, es el resultado de la unión estratégica entre dos grandes pioneros de la industria en Chile: <strong>Paco Florería</strong> y <strong>Florería Los Mellizos</strong>.
            </p>
            <p className="text-gray-600 leading-relaxed text-lg">
              Al combinar décadas de experiencia, logística especializada y un compromiso inquebrantable con la calidad, logramos ofrecer una experiencia floral y un servicio de mantención de cementerios sin precedentes en la Región Metropolitana.
            </p>
          </motion.div>
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="grid grid-cols-2 gap-4"
          >
            <div className="space-y-4">
              <img src="https://images.unsplash.com/photo-1600861194942-f883de0dfe96?auto=format&fit=crop&w=500&q=80" alt="Detalle Floral" className="w-full h-48 object-cover rounded-2xl shadow-md" />
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <h3 className="font-bold text-gray-900 mb-1">Paco Florería</h3>
                <p className="text-sm text-gray-500">Tradición y Excelencia</p>
              </div>
            </div>
            <div className="space-y-4 mt-8">
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <h3 className="font-bold text-gray-900 mb-1">Los Mellizos</h3>
                <p className="text-sm text-gray-500">Logística y Vanguardia</p>
              </div>
              <img src="https://images.unsplash.com/photo-1563241598-a28a2a8db422?auto=format&fit=crop&w=500&q=80" alt="Taller Floral" className="w-full h-48 object-cover rounded-2xl shadow-md" />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Valores */}
      <section className="bg-gray-900 text-white py-24">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-serif font-bold mb-6">Nuestro Compromiso</h2>
            <div className="w-20 h-1 bg-primary mx-auto rounded-full"></div>
          </div>
          
          <div className="grid md:grid-cols-3 gap-10">
            {[
              { icon: '🌱', title: 'Frescura Garantizada', desc: 'Trabajamos con agricultores locales para asegurar que cada flor llegue en su estado más vibrante.' },
              { icon: '🚀', title: 'Logística de Precisión', desc: 'Una flota dedicada para despachos rápidos y cuidadosos en La Florida, Puente Alto y todo Santiago.' },
              { icon: '❤️', title: 'Empatía y Respeto', desc: 'Entendemos el valor de cada entrega, ya sea para celebrar la vida o para honrar la memoria en nuestros cementerios.' },
            ].map((valor, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="bg-gray-800/50 p-8 rounded-3xl border border-gray-700/50 backdrop-blur-sm hover:bg-gray-800 transition-colors"
              >
                <div className="text-4xl mb-4">{valor.icon}</div>
                <h3 className="text-xl font-bold mb-3">{valor.title}</h3>
                <p className="text-gray-400 leading-relaxed">{valor.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
}


