'use client';
import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { CheckCircle2, MessageCircle, Home } from 'lucide-react';
import { motion } from 'framer-motion';

export default function CheckoutExitoPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [orderId, setOrderId] = useState<string | null>(null);

  useEffect(() => {
    // Flow redirige con token y order (nuestro param custom)
    const order = searchParams.get('order');
    if (order) {
      setOrderId(order);
    }
  }, [searchParams]);

  return (
    <div className="min-h-screen bg-[#FDFBF7] pt-32 pb-24 flex items-center justify-center">
      <div className="container mx-auto px-4 max-w-md">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 20 }}
          className="bg-white p-10 text-center rounded-[2.5rem] shadow-xl border border-gray-100"
        >
          <div className="w-24 h-24 bg-green-100 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-12 h-12" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-4">¡Pago Exitoso!</h2>
          <p className="text-gray-500 mb-2">
            Hemos recibido tu pago correctamente a través de Flow.
          </p>
          {orderId && (
            <p className="text-sm font-semibold text-gray-700 bg-gray-50 inline-block px-4 py-2 rounded-xl mt-2 mb-6">
              N° de Orden: {orderId}
            </p>
          )}
          
          <div className="space-y-3 mt-6">
            <button 
              onClick={() => router.push('/')}
              className="w-full bg-primary text-white font-bold py-4 rounded-2xl hover:bg-primary-dark transition-all flex items-center justify-center gap-2"
            >
              <Home className="w-5 h-5" />
              Volver al inicio
            </button>
            <a 
              href={`https://wa.me/56979992848?text=${encodeURIComponent(`Hola Chileflor, acabo de pagar mi orden ${orderId || 'en su web'} por Flow.`)}`}
              target="_blank"
              rel="noreferrer"
              className="w-full bg-[#25D366] text-white font-bold py-4 rounded-2xl hover:bg-[#1ebd5a] transition-all flex items-center justify-center gap-2"
            >
              <MessageCircle className="w-5 h-5" />
              Avisar por WhatsApp
            </a>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
