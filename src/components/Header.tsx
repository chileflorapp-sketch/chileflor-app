'use client';
import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import '../styles/logo-animation.css';
import { useCart } from '@/context/CartContext';
import { ShoppingCart, Search, Crown } from 'lucide-react';
import SearchOverlay from './SearchOverlay';

export default function Header() {
  const pathname = usePathname();
  if (pathname?.startsWith('/agentes')) return null;

  const isHome = pathname === '/';
  const [scrolled, setScrolled] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  
  const { cartCount, openCart } = useCart();

  useEffect(() => {
    setMounted(true);
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    
    // Keyboard shortcut: Ctrl+K or Cmd+K opens search
    const handleKey = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setSearchOpen(true);
      }
    };
    window.addEventListener('keydown', handleKey);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('keydown', handleKey);
    };
  }, []);

  const isTransparent = isHome && !scrolled;

  return (
    <>
      <SearchOverlay open={searchOpen} onClose={() => setSearchOpen(false)} />

      <div className="flex justify-center w-full">
        <header className={`fixed z-50 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
          scrolled 
            ? 'top-4 w-[95%] md:w-[85%] max-w-6xl bg-white/70 backdrop-blur-2xl border border-white/20 shadow-float py-2 px-6 rounded-full' 
            : (isHome ? 'top-[36px] w-full bg-gradient-to-b from-black/85 via-black/40 to-transparent py-3 px-4 md:px-8 border-none' : 'top-[36px] w-full bg-white/90 backdrop-blur-xl border-b border-gray-100 py-4 px-4 md:px-8')
        }`}>
          <div className={`mx-auto flex items-center justify-between transition-all duration-500 ${scrolled ? 'w-full' : 'container max-w-7xl'}`}>
            
            {/* Logo */}
            <a href="/" className={`transition-all duration-500 flex items-center origin-left ${scrolled ? 'scale-[0.85]' : 'scale-100'}`} id="logo-container">
              <img src="/logo.png" alt="Chileflor Logo" className="h-10 md:h-14 w-auto object-contain transition-all duration-500" />
            </a>

            <nav className={`hidden md:flex gap-8 font-semibold text-[13px] tracking-wide uppercase ${isTransparent ? 'text-white/90' : 'text-gray-600'}`}>
              <a href="/catalogo" className="hover:text-primary transition-colors">Catálogo</a>
              <a href="/cementerios" className="hover:text-primary transition-colors">Cementerios</a>
              <a href="/contacto" className="hover:text-primary transition-colors">Contacto</a>
            </nav>

            <div className="flex gap-2 md:gap-4 items-center">
              {/* Search Button */}
              <button
                onClick={() => setSearchOpen(true)}
                className={`flex items-center gap-2 px-3 py-2 rounded-full transition-all hover:scale-105 ${
                  isTransparent 
                    ? 'text-white/80 hover:bg-white/10' 
                    : 'text-gray-500 hover:bg-gray-100 hover:text-gray-900'
                }`}
                aria-label="Buscar productos"
                title="Buscar productos"
              >
                <Search className="w-5 h-5" />
              </button>

              <a 
                href="/club"
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full font-bold text-xs uppercase tracking-wider transition-all hover:scale-105 border ${
                  isTransparent
                    ? 'bg-fuchsia-500/20 text-fuchsia-300 border-fuchsia-500/30 hover:bg-fuchsia-500/30'
                    : 'bg-fuchsia-100 text-fuchsia-700 border-fuchsia-200 hover:bg-fuchsia-200'
                }`}
                title="Club VIP & Mi Cuenta"
              >
                <Crown size={14} className={isTransparent ? "text-fuchsia-400" : "text-fuchsia-600"} />
                <span className="hidden sm:inline">VIP</span>
              </a>

              {/* Cart Button → opens drawer */}
              <button
                onClick={openCart}
                className={`relative cursor-pointer hover:scale-110 active:scale-95 transition-transform flex items-center p-2 rounded-full ${
                  isTransparent ? 'text-white hover:bg-white/10' : 'text-gray-800 hover:bg-gray-100'
                }`}
                aria-label="Abrir carrito"
              >
                <ShoppingCart className="w-5 h-5 md:w-6 md:h-6" strokeWidth={2.5} />
                {mounted && cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-primary text-white text-[10px] rounded-full w-[18px] h-[18px] flex items-center justify-center font-extrabold shadow-sm animate-bounce">
                    {cartCount}
                  </span>
                )}
              </button>

            </div>
          </div>
        </header>
      </div>
    </>
  );
}
