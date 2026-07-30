'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

export default function ContactoPage() {
  const [formData, setFormData] = useState({ nombre: '', email: '', asunto: 'Consulta', mensaje: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      await fetch("https://formsubmit.co/ajax/chileflor.app@gmail.com", {
        method: "POST",
        headers: { 
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify({
            nombre: formData.nombre,
            email: formData.email,
            asunto: formData.asunto,
            mensaje: formData.mensaje
        })
      });
      setSubmitted(true);
    } catch (error) {
      console.error("Error enviando formulario:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="min-h-screen bg-[#FDFBF7] pt-32 pb-24">
      <div className="container mx-auto px-4 max-w-6xl">
        
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-gray-900 mb-4">Ponte en Contacto</h1>
          <p className="text-gray-600 max-w-2xl mx-auto text-lg">
            Estamos aquí para ayudarte. Ya sea para una duda sobre tu pedido o una consulta corporativa, nuestro equipo te responderá a la brevedad.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-12 items-start">
          
          {/* Información de Contacto */}
          <div className="lg:col-span-1 space-y-6">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
            >
              <div className="w-12 h-12 bg-primary/10 text-primary rounded-full flex items-center justify-center mb-4 text-xl">✉️</div>
              <h3 className="font-bold text-gray-900 mb-1">Correo Electrónico</h3>
              <p className="text-sm text-gray-500 mb-2">Respuestas en menos de 24 hrs.</p>
              <a href="mailto:chileflor.app@gmail.com" className="text-primary font-medium hover:underline">chileflor.app@gmail.com</a>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
            >
              <div className="w-12 h-12 bg-green-500/10 text-green-600 rounded-full flex items-center justify-center mb-4 text-xl">💬</div>
              <h3 className="font-bold text-gray-900 mb-1">WhatsApp Pagos</h3>
              <p className="text-gray-500 text-sm mb-2">Confirmación de transferencias e información de pagos.</p>
              <a href="https://wa.me/56979992848" className="text-green-600 font-medium hover:underline">+56 9 7999 2848</a>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
            >
              <div className="w-12 h-12 bg-blue-500/10 text-blue-600 rounded-full flex items-center justify-center mb-4 text-xl">📱</div>
              <h3 className="font-bold text-gray-900 mb-1">Consultas Generales</h3>
              <p className="text-gray-500 text-sm mb-2">Dudas sobre pedidos, horarios y despachos.</p>
              <a href="https://wa.me/56972984627" className="text-blue-600 font-medium hover:underline">+56 9 7298 4627</a>
            </motion.div>
          </div>

          {/* Formulario de Contacto */}
          <div className="lg:col-span-2">
            <div className="bg-white p-8 md:p-12 rounded-[2.5rem] shadow-xl border border-gray-50 relative overflow-hidden">
              <AnimatePresence mode="wait">
                {!submitted ? (
                  <motion.form 
                    key="form"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    onSubmit={handleSubmit} 
                    className="space-y-6"
                  >
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">Envíanos un mensaje</h2>
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-sm font-semibold text-gray-700">Nombre completo</label>
                        <input 
                          required 
                          name="nombre"
                          value={formData.nombre}
                          onChange={handleChange}
                          type="text" 
                          placeholder="Ej: Camila Rojas"
                          className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-5 py-4 text-gray-900 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-semibold text-gray-700">Correo electrónico</label>
                        <input 
                          required 
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          type="email" 
                          placeholder="correo@ejemplo.com"
                          className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-5 py-4 text-gray-900 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-gray-700">¿Sobre qué nos escribes?</label>
                      <div className="relative">
                        <select 
                          required
                          name="asunto"
                          value={formData.asunto}
                          onChange={handleChange}
                          className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-5 py-4 text-gray-900 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all appearance-none cursor-pointer"
                        >
                          <option value="Consulta">Consulta</option>
                          <option value="Sugerencia">Sugerencias</option>
                          <option value="Reclamo">Reclamos</option>
                          <option value="Felicitaciones">Felicitaciones</option>
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-500">
                          <ChevronDown className="h-5 w-5" />
                        </div>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-gray-700">Tu mensaje</label>
                      <textarea 
                        required 
                        name="mensaje"
                        value={formData.mensaje}
                        onChange={handleChange}
                        rows={5} 
                        placeholder="¿En qué te podemos ayudar hoy?"
                        className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-5 py-4 text-gray-900 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all resize-none"
                      ></textarea>
                    </div>
                    
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full md:w-auto bg-primary text-white font-bold py-4 px-10 rounded-2xl hover:bg-primary-dark transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-primary/30 active:scale-[0.98] flex items-center justify-center gap-2"
                    >
                      {isSubmitting ? (
                        <>
                          <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Enviando...
                        </>
                      ) : (
                        'Enviar Mensaje'
                      )}
                    </button>
                  </motion.form>
                ) : (
                  <motion.div 
                    key="success"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ type: "spring", stiffness: 200, damping: 20 }}
                    className="py-12 text-center"
                  >
                    <div className="w-24 h-24 bg-green-100 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6 text-5xl">
                      ✓
                    </div>
                    <h2 className="text-3xl font-bold text-gray-900 mb-4">¡Mensaje Enviado!</h2>
                    <p className="text-gray-500 mb-8 max-w-md mx-auto">
                      Gracias por escribirnos. Hemos recibido tu mensaje y uno de nuestros agentes se pondrá en contacto contigo muy pronto.
                    </p>
                    <button 
                      onClick={() => {
                        setSubmitted(false);
                        setFormData({ nombre: '', email: '', asunto: 'Consulta', mensaje: '' });
                      }}
                      className="inline-block bg-gray-900 text-white font-medium px-8 py-3 rounded-xl shadow-lg hover:bg-gray-800 transition-colors"
                    >
                      Enviar otro mensaje
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
