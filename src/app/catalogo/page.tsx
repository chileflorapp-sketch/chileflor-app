'use client';
import { useState, useMemo, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { CATEGORIAS } from '@/data/catalog';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';
import { Heart, Search } from 'lucide-react';

function CatalogoContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [activeCategory, setActiveCategory] = useState<string>('Todos');
  const [activeSubcategory, setActiveSubcategory] = useState<string>('Todas');
  const [searchInput, setSearchInput] = useState('');
  const [appliedSearch, setAppliedSearch] = useState('');
  const [catalogoDB, setCatalogoDB] = useState<any[]>([]);
  const [loadingCatalog, setLoadingCatalog] = useState(true);
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();

  useEffect(() => {
    fetch('/api/catalogo')
      .then(res => res.json())
      .then(data => { setCatalogoDB(Array.isArray(data) ? data : []); setLoadingCatalog(false); })
      .catch(err => { console.error(err); setLoadingCatalog(false); });
  }, []);

  useEffect(() => {
    const cat = searchParams.get('cat');
    if (cat && CATEGORIAS.some(c => c.nombre === cat)) {
      setActiveCategory(cat);
      setActiveSubcategory('Todas'); // Reset subcategory when category changes from URL
    }
  }, [searchParams]);

  // Obtener subcategorías válidas según la categoría activa
  const currentSubcategories = useMemo(() => {
    if (activeCategory === 'Todos') return [];
    const category = CATEGORIAS.find(c => c.nombre === activeCategory);
    return category ? category.subcategorias.map(s => s.nombre) : [];
  }, [activeCategory]);

  const filteredProducts = useMemo(() => {
    if (!Array.isArray(catalogoDB) || catalogoDB.length === 0) return [];

    // Excluir fuera de temporada (la regla de oro del catálogo)
    let result = catalogoDB.filter(p => {
      const estado = (p.estado || '').toLowerCase().trim();
      return estado !== 'fuera_de_temporada' && estado !== 'inactivo';
    });

    // Filtro Categoría Madre
    if (activeCategory !== 'Todos') {
      result = result.filter(p => p.categoria === activeCategory);
    }
    
    // Filtro Subcategoría
    if (activeSubcategory !== 'Todas' && activeCategory !== 'Todos') {
      result = result.filter(p => p.subcategoria === activeSubcategory);
    }

    // Buscador Inteligente
    if (appliedSearch) {
      const term = appliedSearch.toLowerCase().trim();
      result = result.filter(p => {
        return (p.nombre || '').toLowerCase().includes(term) || 
               (p.categoria || '').toLowerCase().includes(term) ||
               (p.subcategoria || '').toLowerCase().includes(term);
      });
    }

    return result;
  }, [catalogoDB, activeCategory, activeSubcategory, appliedSearch]);

  const handleApplyFilters = () => {
    setAppliedSearch(searchInput);
  };

  const handleClearFilters = () => {
    setSearchInput('');
    setAppliedSearch('');
    setActiveCategory('Todos');
    setActiveSubcategory('Todas');
    router.push('/catalogo');
  };

  return (
    <div className="container mx-auto px-4 py-8 animate-in fade-in duration-500">
      <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2 font-serif">
          {activeCategory === 'Todos' ? 'Colección Principal' : activeCategory}
        </h1>
        <p className="text-gray-500 mb-6">
          {activeCategory === 'Todos' ? 'Descubre nuestra selección arquitectónica floral.' : `Explorando la línea de ${activeCategory}.`}
        </p>

        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-grow">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Ej: rosas, novia, premium..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleApplyFilters()}
              className="w-full pl-12 pr-4 py-4 rounded-full border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all bg-gray-50/50"
            />
          </div>
          <button
            onClick={handleApplyFilters}
            className="bg-[#1C1C1E] text-white font-medium px-8 py-4 rounded-full hover:bg-black transition-colors shadow-lg flex-shrink-0 flex items-center justify-center gap-2"
          >
            Filtrar Catálogo
          </button>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8 relative z-30">
        <aside className="w-full lg:w-64 flex-shrink-0 space-y-6">
          {/* Main Categories */}
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
            <h2 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
              Líneas
            </h2>
            <div className="space-y-1">
              <button
                onClick={() => { setActiveCategory('Todos'); setActiveSubcategory('Todas'); router.push('/catalogo'); }}
                className={`w-full text-left px-4 py-2.5 rounded-xl text-sm font-medium transition-colors ${activeCategory === 'Todos' ? 'bg-primary text-white shadow-sm' : 'text-gray-600 hover:bg-gray-50'}`}
              >
                Todas
              </button>
              {CATEGORIAS.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => { setActiveCategory(cat.nombre); setActiveSubcategory('Todas'); router.push(`/catalogo?cat=${encodeURIComponent(cat.nombre)}`); }}
                  className={`w-full text-left px-4 py-2.5 rounded-xl text-sm font-medium transition-colors ${activeCategory === cat.nombre ? 'bg-primary text-white shadow-sm' : 'text-gray-600 hover:bg-gray-50'}`}
                >
                  {cat.nombre}
                </button>
              ))}
            </div>
          </div>
          
          {/* Subcategories (only show if a category is selected and has subcategories) */}
          {currentSubcategories.length > 0 && (
            <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
              <h2 className="font-semibold text-gray-900 mb-4">Colecciones</h2>
              <div className="space-y-1">
                <button
                  onClick={() => setActiveSubcategory('Todas')}
                  className={`w-full text-left px-4 py-2 rounded-lg text-xs font-medium transition-colors ${activeSubcategory === 'Todas' ? 'bg-gray-900 text-white' : 'text-gray-500 hover:bg-gray-50'}`}
                >
                  Todo en {activeCategory}
                </button>
                {currentSubcategories.map((sub) => (
                  <button
                    key={sub}
                    onClick={() => setActiveSubcategory(sub)}
                    className={`w-full text-left px-4 py-2 rounded-lg text-xs font-medium transition-colors ${activeSubcategory === sub ? 'bg-gray-900 text-white' : 'text-gray-500 hover:bg-gray-50'}`}
                  >
                    {sub}
                  </button>
                ))}
              </div>
            </div>
          )}
        </aside>

        <main className="flex-1">
          {loadingCatalog ? (
            <div className="bg-white rounded-3xl p-16 text-center border border-gray-100 shadow-sm flex flex-col items-center justify-center gap-4">
              <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
              <p className="text-gray-500">Cargando catálogo...</p>
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="bg-white rounded-3xl p-16 text-center border border-gray-100 shadow-sm flex flex-col items-center justify-center">
              <span className="text-6xl mb-4 opacity-50">🌸</span>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Sin resultados</h3>
              <p className="text-gray-500 mb-6">No encontramos productos con esos filtros.</p>
              <button onClick={handleClearFilters} className="text-primary font-medium hover:underline">
                Volver al catálogo principal
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredProducts.map((item) => (
                <a href={`/catalogo/${item.id}`} key={item.id} className="group flex flex-col bg-white rounded-3xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-premium transition-all duration-500 hover:-translate-y-2">
                  <div className={`aspect-[4/5] relative overflow-hidden ${item.tags_visuales?.fondo === 'neutro' ? 'bg-gray-50' : item.tags_visuales?.fondo === 'blanco' ? 'bg-white' : 'bg-gray-100'}`}>
                    <img 
                      src={item.imagen} 
                      alt={item.nombre} 
                      className={`w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-[cubic-bezier(0.25,1,0.5,1)]`} 
                    />

                    {/* UI Badges */}
                    <div className="absolute top-3 left-3 flex flex-col gap-2 z-10">
                      <span className="bg-white/90 backdrop-blur-md text-[10px] font-extrabold px-3 py-1 rounded-full shadow-sm text-gray-800 uppercase tracking-widest">
                        {item.categoria}
                      </span>
                    </div>
                    {item.badge && (
                      <div className="absolute top-3 right-3 z-10">
                        <span className={`backdrop-blur-md text-[10px] font-extrabold px-3 py-1 rounded-full shadow-sm uppercase tracking-widest ${
                          item.badge.includes('Entrega Hoy') ? 'bg-yellow-400/90 text-yellow-900' :
                          item.badge.includes('Premium') ? 'bg-gray-900/90 text-yellow-400' :
                          'bg-green-500/90 text-white'
                        }`}>
                          {item.badge}
                        </span>
                      </div>
                    )}
                    
                    {/* Wishlist Button */}
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        toggleWishlist({
                          id: item.id,
                          name: item.nombre,
                          price: item.precio_base,
                          image: item.imagen,
                          category: item.categoria
                        });
                      }}
                      className="absolute bottom-3 right-3 z-10 w-9 h-9 rounded-full bg-white/90 backdrop-blur-md flex items-center justify-center text-gray-500 hover:text-primary transition-all shadow-sm hover:scale-105 active:scale-95"
                    >
                      <Heart size={16} className={isInWishlist(item.id) ? 'fill-primary text-primary' : ''} />
                    </button>

                    {/* Subtle gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  </div>

                  <div className="p-5 flex flex-col flex-grow justify-between bg-white relative z-20">
                    <div>
                      <h3 className="font-bold text-gray-900 text-lg group-hover:text-primary transition-colors line-clamp-1">{item.nombre}</h3>
                      <p className="text-xs text-gray-500 mt-1 uppercase tracking-widest font-medium">{item.subcategoria}</p>
                    </div>

                    <div className="mt-5 pt-5 border-t border-gray-100 flex items-center justify-between">
                      <div className="flex flex-col">
                        <span className="font-black text-xl text-gray-900 tracking-tight">${item.precio_base.toLocaleString('es-CL')}</span>
                      </div>
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          addToCart({ id: parseInt(item.id.replace('p-','')), name: item.nombre, price: item.precio_base, image: item.imagen });
                        }}
                        className="w-10 h-10 rounded-2xl bg-gray-50 text-gray-900 flex items-center justify-center hover:bg-primary hover:text-white transition-all duration-300 shadow-sm hover:shadow-primary/30 hover:scale-110 active:scale-95 group/btn relative z-10"
                      >
                        <svg className="w-5 h-5 transition-transform group-hover/btn:rotate-90" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" /></svg>
                      </button>
                    </div>
                  </div>
                </a>
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

export default function CatalogoPage() {
  return (
    <Suspense fallback={<div className="h-screen w-full flex items-center justify-center">Cargando catálogo...</div>}>
      <CatalogoContent />
    </Suspense>
  );
}


