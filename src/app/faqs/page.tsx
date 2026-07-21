'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

const FAQ_CATEGORIES = [
  {
    title: 'Envíos y Entregas',
    icon: '🚀',
    faqs: [
      { q: '¿A qué comunas realizan despachos?', a: 'Actualmente despachamos a toda la Región Metropolitana. Especialmente en La Florida y Puente Alto contamos con tiempos de entrega reducidos gracias a nuestra logística hiperlocal.' },
      { q: '¿Puedo elegir la hora exacta de entrega?', a: 'Ofrecemos rangos horarios de entrega (Ej: 09:00 - 13:00 o 14:00 - 18:00) para garantizar que nuestras rutas logísticas optimicen la frescura de los arreglos.' },
      { q: '¿Qué pasa si el destinatario no está en casa?', a: 'El repartidor se comunicará al número de contacto proporcionado y puede dejar el arreglo con conserjería o un vecino de confianza según tus indicaciones.' }
    ]
  },
  {
    title: 'Medios de Pago',
    icon: '💳',
    faqs: [
      { q: '¿Qué formas de pago aceptan?', a: 'Aceptamos transferencias bancarias, tarjetas de débito y crédito a través de Webpay, así como link de pago seguro por MercadoPago.' },
      { q: '¿Es seguro pagar en línea?', a: 'Absolutamente. Todas las transacciones están encriptadas y son procesadas por pasarelas de pago certificadas que garantizan la seguridad de tus datos bancarios.' },
      { q: '¿Emiten boleta o factura?', a: 'Sí, al momento del pago puedes solicitar boleta o factura indicando tus datos tributarios. El documento llegará automáticamente a tu correo electrónico.' }
    ]
  },
  {
    title: 'Club Chileflor',
    icon: '🎁',
    faqs: [
      { q: '¿Cómo funciona el Club de Beneficios?', a: 'Al crear tu cuenta, automáticamente eres miembro. Acumularás puntos con cada compra que puedes canjear por descuentos, despachos gratis o productos exclusivos.' },
      { q: '¿Los puntos tienen fecha de vencimiento?', a: 'Sí, los puntos acumulados vencen a los 12 meses desde el momento en que se ganan, por lo que te sugerimos usarlos en tus próximas compras o eventos importantes.' },
      { q: '¿Puedo transferir mis puntos a otra persona?', a: 'Por el momento los puntos son personales e intransferibles, sin embargo, puedes utilizarlos para comprar regalos y enviarlos a quien desees.' }
    ]
  }
];

export default function FaqsPage() {
  const [openIndex, setOpenIndex] = useState<string | null>(null);

  const toggleFaq = (categoryIndex: number, faqIndex: number) => {
    const id = `${categoryIndex}-${faqIndex}`;
    setOpenIndex(openIndex === id ? null : id);
  };

  return (
    <div className="min-h-screen bg-[#FDFBF7] pt-24 pb-20">
      
      <section className="container mx-auto px-4 max-w-4xl text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-serif font-bold text-gray-900 mb-6">Preguntas Frecuentes</h1>
        <p className="text-gray-600 text-lg max-w-2xl mx-auto">
          Encuentra respuestas a las dudas más comunes sobre nuestros servicios. Si no encuentras lo que buscas, no dudes en contactarnos.
        </p>
      </section>

      <section className="container mx-auto px-4 max-w-3xl">
        {FAQ_CATEGORIES.map((category, cIdx) => (
          <div key={cIdx} className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
              <span className="text-3xl">{category.icon}</span>
              {category.title}
            </h2>
            
            <div className="space-y-4">
              {category.faqs.map((faq, fIdx) => {
                const id = `${cIdx}-${fIdx}`;
                const isOpen = openIndex === id;
                return (
                  <motion.div 
                    key={fIdx}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: (cIdx * 0.1) + (fIdx * 0.05) }}
                    className={`bg-white rounded-2xl border transition-all duration-300 overflow-hidden ${isOpen ? 'border-primary shadow-md' : 'border-gray-200 hover:border-primary/50'}`}
                  >
                    <button
                      onClick={() => toggleFaq(cIdx, fIdx)}
                      className="w-full px-6 py-5 flex items-center justify-between text-left focus:outline-none"
                    >
                      <span className={`font-semibold pr-8 transition-colors ${isOpen ? 'text-primary' : 'text-gray-800'}`}>
                        {faq.q}
                      </span>
                      <motion.div
                        animate={{ rotate: isOpen ? 180 : 0 }}
                        transition={{ duration: 0.3 }}
                        className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-colors ${isOpen ? 'bg-primary/10 text-primary' : 'bg-gray-50 text-gray-400'}`}
                      >
                        <ChevronDown className="w-5 h-5" />
                      </motion.div>
                    </button>
                    
                    <AnimatePresence>
                      {isOpen && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3, ease: "easeInOut" }}
                        >
                          <div className="px-6 pb-6 text-gray-600 leading-relaxed border-t border-gray-50 pt-4">
                            {faq.a}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                );
              })}
            </div>
          </div>
        ))}
        
        <div className="mt-16 bg-gray-900 text-white p-8 md:p-12 rounded-[2.5rem] text-center shadow-xl relative overflow-hidden">
          {/* Fondo estético */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2"></div>
          
          <div className="relative z-10">
            <h3 className="text-2xl font-bold mb-4">¿Sigues con dudas?</h3>
            <p className="text-gray-400 mb-8 max-w-lg mx-auto">
              Nuestro equipo de soporte está listo para asistirte. Hablemos y resolveremos todas tus inquietudes de inmediato.
            </p>
            <a 
              href="/contacto" 
              className="inline-block bg-primary text-white font-bold px-8 py-4 rounded-xl shadow-lg shadow-primary/30 hover:bg-primary-dark transition-colors"
            >
              Ir a Contacto
            </a>
          </div>
        </div>
      </section>

    </div>
  );
}


