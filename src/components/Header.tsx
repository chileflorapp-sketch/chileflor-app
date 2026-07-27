'use client';
import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import '../styles/logo-animation.css';
import { createClient } from '@/utils/supabase/client';
import { useCart } from '@/context/CartContext';
import { ShoppingCart, Search } from 'lucide-react';
import SearchOverlay from './SearchOverlay';

export default function Header() {
  const pathname = usePathname();
  if (pathname?.startsWith('/agentes')) return null;

  const isHome = pathname === '/';
  const [scrolled, setScrolled] = useState(false);
  const [userName, setUserName] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  
  const { cartCount, openCart } = useCart();

  useEffect(() => {
    setMounted(true);
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    
    const supabase = createClient();
    const checkUser = async () => {
      const { data } = await supabase.auth.getUser();
      if (data.user) setUserName(data.user.user_metadata?.full_name || data.user.email);
    };
    checkUser();

    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      setUserName(session?.user ? (session.user.user_metadata?.full_name || session.user.email) : null);
    });

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
      authListener.subscription.unsubscribe();
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
              <a href="/club" className="hover:text-primary transition-colors flex items-center gap-1.5"><span className="text-base leading-none">🎁</span> Club Chileflor</a>
              <a href="/portal-mayorista/registro" className="hover:text-primary transition-colors">Mayoristas</a>
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

              {/* User / Login */}
              {userName ? (
                <a href="/mi-cuenta" className="hidden md:flex items-center gap-2 bg-primary/10 hover:bg-primary hover:text-white transition-all px-4 py-2 rounded-full border border-primary/20 cursor-pointer group">
                  <span className="text-sm font-bold text-primary group-hover:text-white transition-colors">👋 {userName.split(' ')[0]}</span>
                </a>
              ) : (
                <a href="/mi-cuenta/login" className={`hidden md:block font-bold text-sm px-6 py-2.5 rounded-full transition-all ${isTransparent ? 'bg-white text-gray-900 hover:bg-gray-100 shadow-lg' : 'bg-gray-900 text-white hover:bg-gray-800 shadow-md'}`}>
                  Ingresar
                </a>
              )}
            </div>
          </div>
        </header>
      </div>
    </>
  );
}
