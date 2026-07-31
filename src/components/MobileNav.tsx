'use client';
import { useCart } from '@/context/CartContext';
import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { Home, Store, Search, ShoppingCart, Crown, Package } from 'lucide-react';
import SearchOverlay from './SearchOverlay';

const NAV_ITEMS = [
  { icon: Home, label: 'Inicio', href: '/', match: (p: string) => p === '/' },
  { icon: Store, label: 'Catálogo', href: '/catalogo', match: (p: string) => p?.startsWith('/catalogo') },
  { icon: null, label: 'Buscar', href: null, isSearch: true },
  { icon: Crown, label: 'VIP', href: '/club', match: (p: string) => p?.startsWith('/club') || p?.startsWith('/mi-cuenta'), color: 'text-fuchsia-500' },
  { icon: ShoppingCart, label: 'Carrito', href: null, isCart: true },
];

export default function MobileNav() {
  const { cartCount, openCart } = useCart();
  const [mounted, setMounted] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => { setMounted(true); }, []);

  if (pathname?.startsWith('/agentes')) return null;

  const isActive = (matchFn?: ((p: string) => boolean)) => matchFn?.(pathname || '') ?? false;

  return (
    <>
      <SearchOverlay open={searchOpen} onClose={() => setSearchOpen(false)} />

      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-xl border-t border-gray-100 flex justify-around items-center h-16 z-50 px-1 pb-safe shadow-[0_-4px_30px_rgba(0,0,0,0.06)]">
        
        {/* Inicio */}
        <a href="/" className={`flex flex-col items-center gap-0.5 transition-all px-3 py-1 rounded-2xl ${pathname === '/' ? 'text-primary bg-primary/8' : 'text-gray-400'}`}>
          <Home size={20} className={pathname === '/' ? 'fill-primary/20' : ''} />
          <span className="text-[10px] font-bold">Inicio</span>
        </a>

        {/* Catálogo */}
        <a href="/catalogo" className={`flex flex-col items-center gap-0.5 transition-all px-3 py-1 rounded-2xl ${pathname?.startsWith('/catalogo') ? 'text-primary bg-primary/8' : 'text-gray-400'}`}>
          <Store size={20} />
          <span className="text-[10px] font-bold">Catálogo</span>
        </a>

        {/* Buscar — Botón central destacado */}
        <button
          onClick={() => setSearchOpen(true)}
          className="flex flex-col items-center -mt-6"
          aria-label="Buscar"
        >
          <div className="w-14 h-14 rounded-full bg-primary flex items-center justify-center shadow-xl shadow-primary/40 hover:scale-110 active:scale-95 transition-transform ring-4 ring-white">
            <Search size={22} className="text-white" />
          </div>
          <span className="text-[10px] font-bold text-primary mt-1">Buscar</span>
        </button>

        {/* Club VIP */}
        <a href="/club" className={`flex flex-col items-center gap-0.5 transition-all px-3 py-1 rounded-2xl ${(pathname?.startsWith('/club') || pathname?.startsWith('/mi-cuenta')) ? 'text-fuchsia-600 bg-fuchsia-50' : 'text-gray-400'}`}>
          <Crown size={20} className={(pathname?.startsWith('/club') || pathname?.startsWith('/mi-cuenta')) ? 'fill-fuchsia-500/20' : ''} />
          <span className="text-[10px] font-bold">VIP</span>
        </a>

        {/* Carrito */}
        <button
          onClick={openCart}
          className={`flex flex-col items-center gap-0.5 relative transition-all px-3 py-1 rounded-2xl ${pathname?.startsWith('/checkout') ? 'text-primary bg-primary/8' : 'text-gray-400'}`}
          aria-label="Carrito"
        >
          <ShoppingCart size={20} />
          <span className="text-[10px] font-bold">Carrito</span>
          {mounted && cartCount > 0 && (
            <span className="absolute top-0 right-1 bg-primary text-white text-[9px] rounded-full w-4 h-4 flex items-center justify-center font-black shadow-sm">
              {cartCount}
            </span>
          )}
        </button>
      </nav>
    </>
  );
}
