'use client';
import { useCart } from '@/context/CartContext';
import { useRouter } from 'next/navigation';

export default function FloatingCartToast() {
  const { toastProduct, hideToast } = useCart();
  const router = useRouter();

  if (!toastProduct) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center pointer-events-none p-4">
      {/* Overlay opcional para atenuar el fondo */}
      <div className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm pointer-events-auto transition-opacity" onClick={hideToast}></div>
      
      {/* Toast Content */}
      <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-sm overflow-hidden pointer-events-auto animate-in zoom-in-95 fade-in duration-300">
        
        <div className="p-6">
          <div className="flex items-start gap-4 mb-6">
            <div className="w-20 h-24 rounded-2xl overflow-hidden flex-shrink-0 bg-gray-50 border border-gray-100 shadow-sm">
              <img src={toastProduct.image} alt={toastProduct.name} className="w-full h-full object-cover" />
            </div>
            <div>
              <div className="flex items-center gap-1.5 mb-1">
                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                <span className="text-xs font-bold text-green-600 uppercase tracking-wider">Agregado con éxito</span>
              </div>
              <h3 className="font-bold text-gray-900 text-lg leading-tight line-clamp-2">{toastProduct.name}</h3>
              <p className="text-gray-500 font-medium mt-1">${toastProduct.price.toLocaleString('es-CL')}</p>
            </div>
          </div>
          
          <div className="space-y-3">
            <button 
              onClick={() => {
                hideToast();
                router.push('/checkout');
              }}
              className="w-full bg-primary hover:bg-primary-dark text-white font-bold py-3.5 px-4 rounded-xl shadow-lg shadow-primary/30 transition-all hover:-translate-y-0.5"
            >
              Continuar con la compra
            </button>
            
            <button 
              onClick={hideToast}
              className="w-full bg-gray-50 hover:bg-gray-100 text-gray-700 font-bold py-3.5 px-4 rounded-xl border border-gray-200 transition-colors"
            >
              Seguir comprando
            </button>
          </div>
        </div>
        
      </div>
    </div>
  );
}
