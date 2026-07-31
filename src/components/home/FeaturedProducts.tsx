'use client';
import { useState } from 'react';
import Image from 'next/image';
import { ShoppingBag, Star, ArrowRight, Heart } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';

// ─── Product Card ───────────────────────────────────────────────────────────
function ProductCard({ item }: { item: any }) {
  const { addToCart } = useCart();
  const { toggleWishlist } = useWishlist();
  const [wishActive, setWishActive] = useState(false);
  const [added, setAdded] = useState(false);

  const handleWish = (e: React.MouseEvent) => {
    e.preventDefault(); e.stopPropagation();
    setWishActive(!wishActive);
    toggleWishlist?.(item);
  };

  const handleAdd = (e: React.MouseEvent) => {
    e.preventDefault(); e.stopPropagation();
    addToCart({ id: parseInt(item.id.replace('p-', '')), name: item.nombre, price: item.precio_base, image: item.imagen });
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  return (
    <a href={`/catalogo/${item.id}`} className="group flex flex-col bg-white rounded-3xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-xl transition-all duration-300 relative">
      <div className="aspect-[4/5] relative overflow-hidden bg-gray-50">
        <Image src={item.imagen} alt={item.nombre} fill sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw" quality={85} className="object-cover group-hover:scale-105 transition-transform duration-500 ease-out" />

        {item.badge && (
          <div className="absolute top-2.5 left-2.5 z-10">
            <span className={`text-[9px] md:text-[10px] font-extrabold uppercase tracking-widest px-2.5 py-1 rounded-full shadow-md ${
              item.badge.includes('Entrega Hoy') ? 'bg-yellow-400 text-yellow-950' :
              item.badge.includes('Premium') ? 'bg-gray-900 text-yellow-400' : 'bg-primary text-white'
            }`}>
              {item.badge}
            </span>
          </div>
        )}

        <button onClick={handleWish} className="absolute top-2.5 right-2.5 z-10 w-8 h-8 md:w-9 md:h-9 bg-white/90 backdrop-blur-md rounded-full flex items-center justify-center shadow-md hover:scale-110 active:scale-90 transition-transform" aria-label="Guardar en favoritos">
          <Heart className={`w-4 h-4 transition-colors ${wishActive ? 'fill-primary text-primary' : 'text-gray-400'}`} />
        </button>

        <button onClick={handleAdd} className={`absolute bottom-2.5 right-2.5 z-10 p-3 rounded-2xl font-bold shadow-lg transition-all active:scale-90 flex items-center justify-center gap-1.5 ${added ? 'bg-green-500 text-white scale-105' : 'bg-primary text-white hover:bg-primary-dark shadow-primary/30'}`} title="Agregar al carrito">
          <ShoppingBag className="w-4 h-4" />
          <span className="hidden md:inline text-xs font-bold">{added ? '¡Agregado!' : 'Agregar'}</span>
        </button>
      </div>

      <div className="p-4 flex flex-col flex-grow justify-between">
        <div>
          <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-1">{item.subcategoria || item.categoria}</p>
          <h3 className="font-bold text-gray-900 line-clamp-2 text-sm md:text-base group-hover:text-primary transition-colors leading-snug">{item.nombre}</h3>
        </div>
        <div className="mt-3 flex items-center justify-between pt-2 border-t border-gray-50">
          <span className="font-black text-lg md:text-xl text-gray-900 tracking-tight">${item.precio_base.toLocaleString('es-CL')}</span>
          <div className="flex items-center gap-1 text-xs text-gray-400 bg-gray-50 px-2 py-0.5 rounded-md">
            <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
            <span className="font-bold text-gray-700">4.9</span>
          </div>
        </div>
      </div>
    </a>
  );
}

// ─── Tabs de filtro ──────────────────────────────────────────────────────────
const TABS = [
  { id: 'todos', label: 'Todos' },
  { id: 'hoy', label: '⚡ Entrega Hoy' },
  { id: 'rosas', label: '🌹 Rosas' },
  { id: 'ramos', label: '💐 Ramos' },
  { id: 'regalos', label: '🎁 Regalos' },
];

// ─── Sección de productos destacados ─────────────────────────────────────────
export default function FeaturedProducts({ products }: { products: any[] }) {
  const [activeTab, setActiveTab] = useState('todos');

  const filtered = products.filter(p => {
    if (activeTab === 'todos') return true;
    if (activeTab === 'rosas') return p.categoria === 'Flores' || p.nombre?.toLowerCase().includes('rosa');
    if (activeTab === 'ramos') return p.categoria === 'Ramos de Flores' || p.nombre?.toLowerCase().includes('ramo');
    if (activeTab === 'hoy') return p.badge?.includes('Entrega Hoy');
    if (activeTab === 'regalos') return p.categoria === 'Regalos';
    return true;
  }).slice(0, 8);

  return (
    <section className="container mx-auto px-4 py-16 md:py-20 reveal">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
        <div>
          <p className="text-primary text-xs md:text-sm font-bold uppercase tracking-[0.3em] mb-2">Descubre y Compra</p>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Arreglos Destacados</h2>
          <p className="text-gray-500 mt-1 text-sm md:text-base">Selecciona tu categoría favorita para explorar.</p>
        </div>

        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
          {TABS.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded-full font-bold text-xs md:text-sm whitespace-nowrap transition-all ${
                activeTab === tab.id
                  ? 'bg-primary text-white shadow-md shadow-primary/30'
                  : 'bg-white text-gray-600 border border-gray-200 hover:border-gray-300'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-16 text-gray-400 bg-white rounded-3xl border border-gray-100">
          <div className="text-4xl mb-3">🌿</div>
          <p className="font-semibold text-gray-600">No encontramos productos en esta categoría por ahora.</p>
          <a href="/catalogo" className="mt-4 inline-block text-primary font-bold text-sm hover:underline">Ver catálogo completo</a>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-6">
          {filtered.map(item => (
            <ProductCard key={item.id} item={item} />
          ))}
        </div>
      )}

      <div className="mt-10 text-center">
        <a href="/catalogo" className="inline-flex items-center gap-2 bg-gray-900 text-white hover:bg-primary font-bold px-8 py-4 rounded-full shadow-lg transition-all hover:scale-105 active:scale-95 text-sm md:text-base">
          Explorar Todo el Catálogo <ArrowRight className="w-4 h-4" />
        </a>
      </div>
    </section>
  );
}
