'use client';
import { useCart } from '@/context/CartContext';
import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { Home, Store, Gift, ShoppingCart, User, Search } from 'lucide-react';
import SearchOverlay from './SearchOverlay';

export default function MobileNav() {
  const { cartCount, openCart } = useCart();
  const [mounted, setMounted] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => { setMounted(true); }, []);

  if (pathname.startsWith('/agentes')) return null;

  const isActive = (path: string) => {
    if (path === '/') return pathname === '/';
    return pathname.startsWith(path);
  };

  const linkClass = (path: string) =>
    `flex flex-col items-center gap-0.5 transition-colors ${isActive(path) ? 'text-primary' : 'text-gray-400'}`;

  return (
    <>
      <SearchOverlay open={searchOpen} onClose={() => setSearchOpen(false)} />
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-xl border-t border-gray-100 flex justify-around items-center h-16 z-50 px-2 pb-safe shadow-[0_-4px_20px_rgba(0,0,0,0.05)]">
        <a href="/" className={linkClass('/')}>
          <Home size={20} className={isActive('/') ? 'fill-primary/20' : ''} />
          <span className="text-[10px] font-semibold">Inicio</span>
        </a>

        <a href="/catalogo" className={linkClass('/catalogo')}>
          <Store size={20} />
          <span className="text-[10px] font-semibold">Catálogo</span>
        </a>

        {/* Centro: Club Chileflor */}
        <a href="/club" className="flex flex-col items-center -mt-5">
          <div className={`w-13 h-13 p-3.5 rounded-full flex items-center justify-center shadow-lg transition-all ${isActive('/club') ? 'bg-primary-dark shadow-primary/40' : 'bg-primary shadow-primary/30'}`}>
            <Gift size={22} className="text-white" />
          </div>
          <span className="text-[10px] font-semibold text-primary mt-1">Club</span>
        </a>

        {/* Búsqueda */}
        <button onClick={() => setSearchOpen(true)} className="flex flex-col items-center gap-0.5 text-gray-400 hover:text-primary transition-colors">
          <Search size={20} />
          <span className="text-[10px] font-semibold">Buscar</span>
        </button>

        {/* Cuenta */}
        <a href="/mi-cuenta" className={linkClass('/mi-cuenta')}>
          <User size={20} className={isActive('/mi-cuenta') ? 'fill-primary/20' : ''} />
          <span className="text-[10px] font-semibold">Cuenta</span>
        </a>

        {/* Carrito → abre drawer */}
        <button onClick={openCart} className={`flex flex-col items-center gap-0.5 relative transition-colors ${isActive('/checkout') ? 'text-primary' : 'text-gray-400'}`}>
          <ShoppingCart size={20} />
          <span className="text-[10px] font-semibold">Carrito</span>
          {mounted && cartCount > 0 && (
            <span className="absolute -top-0.5 right-0 bg-primary text-white text-[9px] rounded-full w-4 h-4 flex items-center justify-center font-bold shadow-sm">
              {cartCount}
            </span>
          )}
        </button>
      </nav>
    </>
  );
}
