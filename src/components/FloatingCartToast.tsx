'use client';
import { useCart } from '@/context/CartContext';
import { X, ShoppingBag } from 'lucide-react';
import Image from 'next/image';
import { useEffect } from 'react';

export default function FloatingCartToast() {
  const { toastProduct, hideToast, openCart } = useCart();

  useEffect(() => {
    if (toastProduct) {
      const timer = setTimeout(() => {
        hideToast();
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [toastProduct, hideToast]);

  if (!toastProduct) return null;

  return (
    <div className="fixed top-24 right-4 md:right-8 z-[100] pointer-events-none w-full max-w-sm px-4">
      <div className="bg-white rounded-2xl shadow-premium border border-gray-100 p-4 pointer-events-auto flex gap-4 animate-in slide-in-from-top-5 fade-in duration-300 relative overflow-hidden">
        {/* Border accent */}
        <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-primary"></div>
        
        {/* Image */}
        <div className="w-14 h-18 rounded-lg overflow-hidden flex-shrink-0 bg-gray-50 relative border border-gray-100">
          <Image src={toastProduct.image} alt={toastProduct.name} fill sizes="56px" className="object-cover" />
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 mb-0.5">
            <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
            <span className="text-[10px] font-bold text-green-600 uppercase tracking-widest">¡Agregado al carrito!</span>
          </div>
          <h4 className="font-semibold text-gray-900 text-xs line-clamp-1 pr-4">{toastProduct.name}</h4>
          <p className="text-gray-500 font-bold text-xs mt-0.5">${toastProduct.price.toLocaleString('es-CL')}</p>
          
          <button 
            onClick={() => {
              hideToast();
              openCart();
            }}
            className="text-primary text-[11px] font-bold mt-2 hover:underline flex items-center gap-1"
          >
            <ShoppingBag size={12} /> Ver Carrito →
          </button>
        </div>

        {/* Close */}
        <button 
          onClick={hideToast}
          className="absolute top-2 right-2 text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-50 transition-all"
        >
          <X size={14} />
        </button>
      </div>
    </div>
  );
}
