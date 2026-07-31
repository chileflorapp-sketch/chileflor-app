'use client';
import { useState, useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import '../styles/logo-animation.css';
import { useCart } from '@/context/CartContext';
import { ShoppingCart, Search, Crown, ChevronDown, Flower2, Gift, Heart, Landmark, Star, Zap } from 'lucide-react';
import SearchOverlay from './SearchOverlay';

const CATEGORIES = [
  { icon: <Zap className="w-4 h-4 text-yellow-500" />, label: 'Entrega Hoy', href: '/catalogo?badge=Entrega+Hoy', badge: 'Hoy', desc: 'Flores disponibles para hoy' },
  { icon: <Flower2 className="w-4 h-4 text-rose-500" />, label: 'Rosas', href: '/catalogo?cat=Flores', desc: 'Rosas y flores frescas' },
  { icon: <span className="text-base">💐</span>, label: 'Ramos', href: '/catalogo?cat=Ramos de Flores', desc: 'Arreglos y bouquets premium' },
  { icon: <Gift className="w-4 h-4 text-emerald-500" />, label: 'Regalos', href: '/catalogo?cat=Regalos', desc: 'Sorpresas y detalles especiales' },
  { icon: <Heart className="w-4 h-4 text-pink-500" />, label: 'Homenajes', href: '/catalogo?cat=Homenajes', desc: 'Flores para honrar momentos' },
  { icon: <Landmark className="w-4 h-4 text-amber-600" />, label: 'Cementerios', href: '/cementerios', desc: 'Mantención y suscripciones' },
];

export default function Header() {
  const pathname = usePathname();
  if (pathname?.startsWith('/agentes')) return null;

  const isHome = pathname === '/';
  const [scrolled, setScrolled] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [catOpen, setCatOpen] = useState(false);
  const catRef = useRef<HTMLDivElement>(null);
  const { cartCount, openCart } = useCart();

  useEffect(() => {
    setMounted(true);

    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);

    const handleKey = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') { e.preventDefault(); setSearchOpen(true); }
      if (e.key === 'Escape') setCatOpen(false);
    };
    window.addEventListener('keydown', handleKey);

    const handleClickOutside = (e: MouseEvent) => {
      if (catRef.current && !catRef.current.contains(e.target as Node)) setCatOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('keydown', handleKey);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const isTransparent = isHome && !scrolled;

  return (
    <>
      <SearchOverlay open={searchOpen} onClose={() => setSearchOpen(false)} />

      <div className="flex justify-center w-full">
        <header className={`fixed z-50 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
          scrolled
            ? 'top-4 w-[95%] md:w-[88%] max-w-6xl bg-white/80 backdrop-blur-2xl border border-white/30 shadow-[0_8px_32px_rgba(0,0,0,0.08)] py-2 px-6 rounded-full'
            : isHome
              ? 'top-[36px] w-full bg-gradient-to-b from-black/80 via-black/30 to-transparent py-3 px-4 md:px-8 border-none'
              : 'top-[36px] w-full bg-white/95 backdrop-blur-xl border-b border-gray-100/80 shadow-sm py-4 px-4 md:px-8'
        }`}>
          <div className={`mx-auto flex items-center justify-between transition-all duration-500 ${scrolled ? 'w-full' : 'container max-w-7xl'}`}>

            {/* Logo */}
            <a href="/" className={`transition-all duration-500 flex items-center origin-left ${scrolled ? 'scale-[0.85]' : 'scale-100'}`} id="logo-container">
              <img src="/logo.png" alt="Chileflor Logo" className="h-10 md:h-14 w-auto object-contain transition-all duration-500" />
            </a>

            {/* Nav Desktop */}
            <nav className={`hidden md:flex items-center gap-6 font-semibold text-[13px] tracking-wide uppercase ${isTransparent ? 'text-white/90' : 'text-gray-600'}`}>
              {/* Dropdown Catálogo */}
              <div ref={catRef} className="relative">
                <button
                  onClick={() => setCatOpen(!catOpen)}
                  className={`flex items-center gap-1 hover:text-primary transition-colors group ${catOpen ? 'text-primary' : ''}`}
                  aria-expanded={catOpen}
                >
                  Catálogo
                  <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-300 ${catOpen ? 'rotate-180' : ''}`} />
                </button>

                {catOpen && (
                  <div className="absolute top-full left-1/2 -translate-x-1/2 mt-3 w-[480px] bg-white rounded-3xl shadow-2xl border border-gray-100 p-4 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                    {/* Header del dropdown */}
                    <div className="flex items-center gap-2 px-3 py-2 mb-3 border-b border-gray-50">
                      <Star className="w-4 h-4 text-primary fill-primary/20" />
                      <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">Nuestras Categorías</span>
                    </div>
                    <div className="grid grid-cols-2 gap-1.5">
                      {CATEGORIES.map((cat, i) => (
                        <a
                          key={i}
                          href={cat.href}
                          onClick={() => setCatOpen(false)}
                          className="flex items-start gap-3 p-3 rounded-2xl hover:bg-rose-50 hover:border-rose-100 border border-transparent transition-all group"
                        >
                          <div className="w-9 h-9 rounded-xl bg-gray-50 group-hover:bg-white flex items-center justify-center shrink-0 shadow-sm transition-all">
                            {cat.icon}
                          </div>
                          <div className="min-w-0">
                            <div className="flex items-center gap-1.5">
                              <span className="font-bold text-gray-900 text-sm group-hover:text-primary transition-colors">{cat.label}</span>
                              {cat.badge && <span className="text-[9px] bg-primary text-white font-extrabold px-1.5 py-0.5 rounded-full">{cat.badge}</span>}
                            </div>
                            <p className="text-xs text-gray-400 mt-0.5 leading-tight">{cat.desc}</p>
                          </div>
                        </a>
                      ))}
                    </div>
                    <div className="mt-3 pt-3 border-t border-gray-50">
                      <a href="/catalogo" onClick={() => setCatOpen(false)} className="flex items-center justify-center gap-2 bg-gray-900 hover:bg-primary text-white text-xs font-bold py-2.5 rounded-2xl transition-all">
                        Ver catálogo completo →
                      </a>
                    </div>
                  </div>
                )}
              </div>

              <a href="/cementerios" className="hover:text-primary transition-colors">Cementerios</a>
              <a href="/contacto" className="hover:text-primary transition-colors">Contacto</a>
            </nav>

            {/* Acciones */}
            <div className="flex gap-2 md:gap-3 items-center">
              {/* Búsqueda */}
              <button
                onClick={() => setSearchOpen(true)}
                className={`flex items-center gap-2 px-3 py-2 rounded-full transition-all hover:scale-105 ${
                  isTransparent ? 'text-white/80 hover:bg-white/10' : 'text-gray-500 hover:bg-gray-100 hover:text-gray-900'
                }`}
                aria-label="Buscar productos"
                title="Buscar (Ctrl+K)"
              >
                <Search className="w-5 h-5" />
              </button>

              {/* VIP */}
              <a
                href="/club"
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full font-bold text-xs uppercase tracking-wider transition-all hover:scale-105 border ${
                  isTransparent
                    ? 'bg-fuchsia-500/20 text-fuchsia-300 border-fuchsia-500/30 hover:bg-fuchsia-500/30'
                    : 'bg-fuchsia-100 text-fuchsia-700 border-fuchsia-200 hover:bg-fuchsia-200'
                }`}
                title="Club VIP & Mi Cuenta"
              >
                <Crown size={14} className={isTransparent ? 'text-fuchsia-400' : 'text-fuchsia-600'} />
                <span className="hidden sm:inline">VIP</span>
              </a>

              {/* Carrito */}
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
