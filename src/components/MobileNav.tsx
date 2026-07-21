'use client';
import { useCart } from '@/context/CartContext';
import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { Home, Store, Gift, ShoppingCart, User } from 'lucide-react';

export default function MobileNav() {
  const { cartCount } = useCart();
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (pathname.startsWith('/agentes')) return null;

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 flex justify-around items-center h-16 z-50 px-2 pb-safe shadow-[0_-4px_10px_rgba(0,0,0,0.02)]">
      <a href="/" className="flex flex-col items-center gap-1 text-primary">
         <Home size={20} className="mb-0.5" />
         <span className="text-[10px] font-medium">Inicio</span>
      </a>
      <a href="/catalogo" className="flex flex-col items-center gap-1 text-gray-400">
         <Store size={20} className="mb-0.5" />
         <span className="text-[10px] font-medium">Catálogo</span>
      </a>
      <a href="/club" className="flex flex-col items-center -mt-6">
         <div className="w-12 h-12 bg-primary text-white rounded-full flex items-center justify-center shadow-lg shadow-primary/30">
           <Gift size={24} />
         </div>
         <span className="text-[10px] font-medium text-primary mt-1">Club Chileflor</span>
      </a>
      <a href="/checkout" className="flex flex-col items-center gap-1 text-gray-400 relative">
         <ShoppingCart size={20} className="mb-0.5" />
         <span className="text-[10px] font-medium">Carrito</span>
         {mounted && cartCount > 0 && (
           <span className="absolute -top-2 right-0 bg-primary text-white text-[10px] rounded-full w-4 h-4 flex items-center justify-center font-bold shadow-sm">
             {cartCount}
           </span>
         )}
      </a>
      <a href="/mi-cuenta" className="flex flex-col items-center gap-1 text-gray-400">
         <User size={20} className="mb-0.5" />
         <span className="text-[10px] font-medium">Cuenta</span>
      </a>
    </nav>
  );
}
