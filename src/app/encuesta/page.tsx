'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function EncuestaPage() {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simular guardado en backend
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitted(true);
    }, 1500);
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center p-4 bg-gray-50/50 overflow-hidden">
      <AnimatePresence mode="wait">
        {!submitted ? (
          <motion.div 
            key="form"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="bg-white p-8 md:p-10 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.08)] max-w-lg w-full border border-gray-100"
          >
            <div className="text-center mb-8">
              <motion.div 
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.2 }}
                className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4"
              >
                <span className="text-3xl block">🌸</span>
              </motion.div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">¿Cómo fue tu experiencia?</h1>
              <p className="text-gray-500">Nos encantaría saber cómo te fue con tu compra y servicio en Chileflor.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Star Rating */}
              <div className="flex flex-col items-center">
                <label className="block text-sm font-semibold text-gray-700 mb-4 uppercase tracking-wider">Califica nuestro servicio</label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(0)}
                      className="text-4xl focus:outline-none"
                    >
                      <span className={`transition-colors duration-200 ${(hoverRating || rating) >= star ? 'text-yellow-400 drop-shadow-md' : 'text-gray-200'}`}>
                        ★
                      </span>
                    </motion.button>
                  ))}
                </div>
                <div className="h-6 mt-3">
                  <AnimatePresence>
                    {rating > 0 && (
                      <motion.span 
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -5 }}
                        className="inline-block text-sm font-bold text-primary bg-primary/10 px-3 py-1 rounded-full"
                      >
                        {rating === 1 && 'No muy buena 😕'}
                        {rating === 2 && 'Podría mejorar 😐'}
                        {rating === 3 && 'Buena 🙂'}
                        {rating === 4 && 'Muy buena 😊'}
                        {rating === 5 && '¡Excelente! 😍'}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </div>
              </div>

              {/* Feedback Textarea */}
              <div>
                <label htmlFor="feedback" className="block text-sm font-semibold text-gray-700 mb-2">
                  Cuéntanos más detalles (Opcional)
                </label>
                <textarea
                  id="feedback"
                  rows={4}
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  placeholder="¿Qué te parecieron las flores? ¿Llegaron a tiempo? ¿Cómo fue la atención?"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all resize-none bg-white shadow-sm"
                ></textarea>
              </div>

              {/* Submit Button */}
              <motion.button
                whileHover={{ scale: rating > 0 ? 1.02 : 1 }}
                whileTap={{ scale: rating > 0 ? 0.98 : 1 }}
                type="submit"
                disabled={rating === 0 || isSubmitting}
                className="w-full bg-primary text-white font-bold py-4 rounded-xl hover:bg-[#d91e42] transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-primary/30 flex items-center justify-center gap-3 relative overflow-hidden"
              >
                {isSubmitting ? (
                  <span className="flex items-center gap-2">
                    <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Enviando...
                  </span>
                ) : (
                  <>
                    <span>Enviar mis comentarios</span>
                    <span>✨</span>
                  </>
                )}
              </motion.button>
            </form>
          </motion.div>
        ) : (
          <motion.div 
            key="success"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 20 }}
            className="bg-white p-10 rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.1)] text-center max-w-md w-full border border-gray-100 relative overflow-hidden"
          >
            {/* Confetti background effect */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-30">
              <div className="absolute top-0 left-1/4 w-2 h-2 bg-pink-500 rounded-full animate-[ping_2s_infinite]"></div>
              <div className="absolute top-1/4 right-1/4 w-3 h-3 bg-yellow-400 rounded-full animate-[ping_3s_infinite_1s]"></div>
              <div className="absolute bottom-1/4 left-1/3 w-2 h-2 bg-blue-400 rounded-full animate-[ping_2.5s_infinite_0.5s]"></div>
            </div>

            <motion.div 
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.2 }}
              className="w-24 h-24 bg-gradient-to-tr from-green-400 to-green-500 text-white rounded-full flex items-center justify-center mx-auto mb-6 text-5xl shadow-lg shadow-green-500/40"
            >
              ✓
            </motion.div>
            
            <motion.h2 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-2xl font-bold text-gray-900 mb-4"
            >
              ¡Gracias por tu opinión!
            </motion.h2>
            
            <motion.p 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="text-gray-500 mb-8 leading-relaxed"
            >
              Valoramos mucho tu experiencia. Nos ayuda a seguir mejorando para entregar siempre el mejor servicio y las flores más hermosas.
            </motion.p>
            
            <motion.a 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              href="/" 
              className="inline-block bg-primary text-white font-medium px-8 py-3 rounded-full shadow-lg shadow-primary/30 hover:bg-[#d91e42] transition-colors"
            >
              Volver al inicio
            </motion.a>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
