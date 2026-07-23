'use client';

import { useState, useMemo, useEffect } from 'react';
import { Search, ShoppingCart, Trash2, Plus, Minus, Package, X, LogOut } from 'lucide-react';

export default function B2BCatalogPage() {
  const [activeCategory, setActiveCategory] = useState<string>('Todos');
  const [searchQuery, setSearchQuery] = useState('');
  const [categorias, setCategorias] = useState<any[]>([]);
  const [catalogo, setCatalogo] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const [cart, setCart] = useState<Record<string, number>>({});
  const [isClient, setIsClient] = useState(false);
  
  // Estado para el modal de detalle de producto
  const [selectedProduct, setSelectedProduct] = useState<any | null>(null);

  useEffect(() => {
    setIsClient(true);
    Promise.all([
      fetch('/api/categorias-b2b').then(res => res.json()),
      fetch('/api/catalogo-b2b').then(res => res.json())
    ])
    .then(([cats, prods]) => {
      setCategorias(cats);
      setCatalogo(prods);
      setIsLoading(false);
    })
    .catch(err => {
      console.error(err);
      setIsLoading(false);
    });
  }, []);

  const handleUpdateQuantity = (id: string, delta: number) => {
    setCart(prev => {
      const current = prev[id] || 0;
      const next = Math.max(0, current + delta);
      const updated = { ...prev };
      if (next === 0) {
        delete updated[id];
      } else {
        updated[id] = next;
      }
      return updated;
    });
  };

  const filteredProducts = useMemo(() => {
    let result = catalogo;
    if (activeCategory !== 'Todos') {
      result = result.filter(p => p.categoria === activeCategory);
    }
    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase();
      result = result.filter(p => p.nombre.toLowerCase().includes(q) || p.categoria.toLowerCase().includes(q));
    }
    return result;
  }, [activeCategory, searchQuery, catalogo]);

  const cartTotal = useMemo(() => {
    return Object.entries(cart).reduce((total, [id, qty]) => {
      const product = catalogo.find(p => p.id === id);
      return total + (product ? product.precio_mayorista * qty : 0);
    }, 0);
  }, [cart, catalogo]);
  
  const cartItemCount = Object.values(cart).reduce((a, b) => a + b, 0);

  const handleWhatsAppCheckout = () => {
    const items = Object.entries(cart).map(([id, qty]) => {
      const p = catalogo.find(p => p.id === id);
      return p ? `${qty} x [${p.unidad_venta}] ${p.nombre} ($${(p.precio_mayorista * qty).toLocaleString('es-CL')})` : '';
    }).join('\n');

    const mensaje = `¡Hola Chileflor! Soy [Nombre Florería]. Quiero realizar el siguiente pedido mayorista:\n\n${items}\n\n*Total estimado: $${cartTotal.toLocaleString('es-CL')}*\n\nDatos de Entrega: [Dirección]\nRecibe: [Nombre]\nTipo de documento: Factura a [RUT Empresa]\n\nQuedo a la espera de la confirmación de stock y link de pago.`;
    
    const url = `https://wa.me/56979992848?text=${encodeURIComponent(mensaje)}`;
    window.open(url, '_blank');
  };

  return (
    <div className="min-h-screen bg-[#0A0A0B] pt-32 pb-40 font-sans text-white selection:bg-yellow-500/30">
      <div className="container mx-auto px-4 lg:px-8 max-w-7xl">
        
        {/* Header B2B */}
        <div className="mb-10 flex flex-col md:flex-row md:justify-between md:items-start gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-yellow-500/10 border border-yellow-500/20 rounded-full text-xs font-bold tracking-widest uppercase mb-4 text-yellow-500">
              <span className="w-2 h-2 rounded-full bg-yellow-500 animate-pulse"></span>
              Acceso Verificado
            </div>
            <h1 className="text-4xl md:text-5xl font-black mb-3 tracking-tight">Central Mayorista</h1>
            <p className="text-gray-400 text-lg max-w-2xl">Abastecimiento exclusivo para la red de floristas Chileflor. Precios por volumen y catálogo especializado.</p>
          </div>
          
          <button 
            onClick={() => window.location.href = '/'}
            className="flex items-center justify-center gap-2 px-5 py-2.5 bg-[#121214] hover:bg-white/10 border border-white/10 rounded-xl text-sm font-bold text-gray-300 hover:text-white transition-all w-full md:w-auto shadow-sm"
          >
            <LogOut className="w-4 h-4" />
            Cerrar Sesión
          </button>
        </div>

        {/* Hero B2B */}
        <div className="relative w-full h-48 md:h-64 mb-10 rounded-[32px] overflow-hidden flex items-center px-8 md:px-12 shadow-[0_0_50px_-12px_rgba(234,179,8,0.15)] border border-white/5">
          {/* Background Image */}
          <div className="absolute inset-0 z-0">
            <img 
              src="/banner_b2b_supplies.png" 
              alt="Insumos B2B" 
              className="w-full h-full object-cover object-center"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[#0A0A0B] via-[#0A0A0B]/80 to-transparent"></div>
          </div>
          
          {/* Content */}
          <div className="z-10 max-w-xl relative">
            <h2 className="text-3xl md:text-4xl font-black text-white mb-2 tracking-tight">Insumos Premium</h2>
            <p className="text-gray-300 md:text-lg font-medium">Cintas, espuma y cristalería de la más alta calidad.</p>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Sidebar Nav */}
          <aside className="lg:w-64 flex-shrink-0">
            <div className="bg-[#121214] border border-white/5 rounded-3xl p-5 sticky top-28 shadow-xl">
              <h2 className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-4 px-2">Categorías</h2>
              <div className="space-y-1">
                <button
                  onClick={() => setActiveCategory('Todos')}
                  className={`w-full text-left px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300 ${activeCategory === 'Todos' ? 'bg-yellow-500/10 text-yellow-500 shadow-[inset_4px_0_0_0_rgba(234,179,8,1)]' : 'text-gray-400 hover:bg-white/5 hover:text-white'}`}
                >
                  Todo el Inventario
                </button>
                {categorias.map(cat => (
                  <button
                    key={cat.id}
                    onClick={() => setActiveCategory(cat.nombre)}
                    className={`w-full text-left px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300 ${activeCategory === cat.nombre ? 'bg-yellow-500/10 text-yellow-500 shadow-[inset_4px_0_0_0_rgba(234,179,8,1)]' : 'text-gray-400 hover:bg-white/5 hover:text-white'}`}
                  >
                    {cat.nombre}
                  </button>
                ))}
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1 min-w-0">
            
            {/* Search Bar */}
            <div className="mb-8 relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-500" />
              </div>
              <input
                type="text"
                placeholder="Buscar insumos por nombre o categoría..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#121214] border border-white/10 text-white rounded-2xl pl-12 pr-4 py-4 focus:outline-none focus:ring-2 focus:ring-yellow-500/50 focus:border-yellow-500/50 transition-all placeholder-gray-600 shadow-inner"
              />
            </div>

            {/* Grid */}
            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-20 text-gray-500">
                <div className="w-10 h-10 border-4 border-gray-800 border-t-yellow-500 rounded-full animate-spin mb-4"></div>
                <p>Cargando inventario mayorista...</p>
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="bg-[#121214] border border-white/5 rounded-3xl p-12 text-center flex flex-col items-center">
                <Package className="w-16 h-16 text-gray-700 mb-4" />
                <h3 className="text-xl font-bold text-gray-300 mb-2">No se encontraron productos</h3>
                <p className="text-gray-500">Prueba buscando con otros términos o seleccionando otra categoría.</p>
                {searchQuery && (
                  <button onClick={() => setSearchQuery('')} className="mt-6 px-6 py-2 bg-white/5 hover:bg-white/10 text-white rounded-full font-medium transition-colors">
                    Limpiar Búsqueda
                  </button>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                {filteredProducts.map(product => {
                  const qty = cart[product.id] || 0;
                  const isSelected = qty > 0;
                  
                  return (
                    <div 
                      key={product.id} 
                      className={`flex flex-col h-full bg-[#121214]/80 backdrop-blur-md rounded-3xl overflow-hidden transition-all duration-300 border ${isSelected ? 'border-yellow-500/40 shadow-[0_0_30px_-10px_rgba(234,179,8,0.2)]' : 'border-white/5 hover:border-white/20'}`}
                    >
                      <div 
                        className="aspect-[4/3] relative overflow-hidden bg-black/50 p-4 cursor-pointer group"
                        onClick={() => setSelectedProduct(product)}
                      >
                        <img src={product.imagen} alt={product.nombre} className="w-full h-full object-contain filter drop-shadow-2xl group-hover:scale-105 transition-transform duration-500" />
                        
                        {product.badge && (
                          <div className="absolute top-3 left-3">
                            <span className="bg-yellow-500 text-black text-[9px] font-black px-2.5 py-1 rounded-sm uppercase tracking-widest shadow-md">
                              {product.badge}
                            </span>
                          </div>
                        )}
                        
                        <div className="absolute bottom-3 left-3 bg-black/80 backdrop-blur-md border border-white/10 text-[10px] font-bold px-3 py-1.5 rounded-full text-gray-300 flex items-center gap-1.5">
                          <Package className="w-3 h-3" />
                          {product.unidad_venta}
                        </div>
                      </div>

                      <div className="p-5 flex flex-col flex-grow justify-between">
                        <div>
                          <p className="text-[10px] text-yellow-500/80 uppercase tracking-widest font-bold mb-1">{product.categoria}</p>
                          <h3 
                            className="font-bold text-base text-gray-100 mb-3 line-clamp-2 leading-snug cursor-pointer hover:text-yellow-500 transition-colors"
                            onClick={() => setSelectedProduct(product)}
                          >
                            {product.nombre}
                          </h3>
                        </div>

                        <div className="mt-auto">
                          <div className="flex items-end justify-between mb-4">
                            <div>
                              <p className="text-[10px] text-gray-500 uppercase tracking-widest mb-0.5">Precio Mayor</p>
                              <p className="text-xl font-black text-white">${product.precio_mayorista.toLocaleString('es-CL')}</p>
                            </div>
                            {product.precio_sugerido_retail && (
                              <div className="text-right">
                                <p className="text-[9px] text-gray-600 uppercase tracking-widest mb-0.5">PVP Ref.</p>
                                <p className="text-sm text-gray-500 line-through">${product.precio_sugerido_retail.toLocaleString('es-CL')}</p>
                              </div>
                            )}
                          </div>

                          {/* Volume Controls */}
                          {qty === 0 ? (
                            <button 
                              onClick={() => handleUpdateQuantity(product.id, 1)}
                              className="w-full bg-white/5 hover:bg-yellow-500 hover:text-black border border-white/10 text-white font-bold py-3.5 rounded-xl transition-all duration-300 flex items-center justify-center gap-2"
                            >
                              <Plus className="w-4 h-4" />
                              Añadir al Pedido
                            </button>
                          ) : (
                            <div className="flex items-center justify-between bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-1 shadow-inner">
                              <button 
                                onClick={() => handleUpdateQuantity(product.id, -1)}
                                className="w-12 h-10 rounded-lg bg-[#121214] text-gray-300 hover:text-white hover:bg-white/10 transition-colors flex items-center justify-center shadow-sm"
                              >
                                {qty === 1 ? <Trash2 className="w-4 h-4 text-red-400" /> : <Minus className="w-4 h-4" />}
                              </button>
                              <div className="flex flex-col items-center justify-center w-16">
                                <span className="font-mono text-lg font-black text-yellow-500 leading-none">
                                  {qty}
                                </span>
                                <span className="text-[8px] uppercase tracking-wider text-yellow-500/70 mt-1">Unidades</span>
                              </div>
                              <button 
                                onClick={() => handleUpdateQuantity(product.id, 1)}
                                className="w-12 h-10 rounded-lg bg-yellow-500 text-black hover:bg-yellow-400 transition-colors flex items-center justify-center shadow-sm"
                              >
                                <Plus className="w-5 h-5 font-bold" />
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </main>
        </div>
      </div>

      {/* Floating Checkout Bar */}
      {isClient && cartItemCount > 0 && (
        <div className="fixed bottom-0 left-0 right-0 z-50 p-4 md:p-6 pointer-events-none">
          <div className="container mx-auto max-w-4xl">
            <div className="bg-[#121214]/95 backdrop-blur-xl border border-yellow-500/30 p-4 md:p-5 rounded-3xl shadow-[0_-10px_40px_rgba(0,0,0,0.5)] flex items-center justify-between pointer-events-auto transform transition-all translate-y-0 opacity-100">
              
              <div className="flex items-center gap-4">
                <div className="hidden md:flex w-12 h-12 bg-yellow-500/20 rounded-full items-center justify-center relative">
                  <ShoppingCart className="w-6 h-6 text-yellow-500" />
                  <span className="absolute -top-1 -right-1 bg-yellow-500 text-black text-xs font-black w-5 h-5 flex items-center justify-center rounded-full">
                    {cartItemCount}
                  </span>
                </div>
                <div>
                  <p className="text-xs text-gray-400 uppercase tracking-widest font-bold mb-1">Total Pedido B2B</p>
                  <p className="text-2xl md:text-3xl font-black text-white">${cartTotal.toLocaleString('es-CL')}</p>
                </div>
              </div>
              
              <button 
                onClick={handleWhatsAppCheckout}
                className="bg-yellow-500 hover:bg-yellow-400 text-black font-black px-6 md:px-10 py-3 md:py-4 rounded-2xl transition-all shadow-[0_0_20px_rgba(234,179,8,0.4)] hover:shadow-[0_0_30px_rgba(234,179,8,0.6)] hover:-translate-y-1 flex items-center gap-2"
              >
                <span>Enviar Pedido</span>
                <span className="hidden md:inline">a Ejecutivo</span>
                <span className="md:hidden">({cartItemCount})</span>
              </button>

            </div>
          </div>
        </div>
      )}

      {/* Product Detail Modal */}
      {selectedProduct && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div 
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            onClick={() => setSelectedProduct(null)}
          ></div>
          <div className="relative w-full max-w-2xl bg-[#121214] border border-white/10 rounded-[32px] overflow-hidden shadow-2xl flex flex-col md:flex-row transform transition-all">
            
            <button 
              onClick={() => setSelectedProduct(null)}
              className="absolute top-4 right-4 z-10 w-10 h-10 bg-black/50 hover:bg-black text-white rounded-full flex items-center justify-center backdrop-blur-md transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="w-full md:w-1/2 bg-black/50 p-6 flex items-center justify-center min-h-[300px]">
              <img 
                src={selectedProduct.imagen} 
                alt={selectedProduct.nombre} 
                className="max-w-full max-h-[400px] object-contain drop-shadow-2xl" 
              />
            </div>
            
            <div className="w-full md:w-1/2 p-8 flex flex-col">
              <p className="text-[10px] text-yellow-500 uppercase tracking-widest font-bold mb-2">{selectedProduct.categoria}</p>
              <h2 className="text-2xl font-black text-white mb-4 leading-tight">{selectedProduct.nombre}</h2>
              
              <div className="bg-white/5 border border-white/10 rounded-xl p-4 mb-6">
                <p className="text-sm text-gray-300">
                  {selectedProduct.descripcion || 'Insumo floral premium para uso profesional.'}
                </p>
                <div className="mt-3 flex items-center gap-2">
                  <Package className="w-4 h-4 text-gray-400" />
                  <span className="text-xs text-gray-400">Unidad de Venta: <strong className="text-white">{selectedProduct.unidad_venta}</strong></span>
                </div>
              </div>

              <div className="mt-auto">
                <div className="flex items-end justify-between mb-6">
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-widest mb-1">Precio Mayorista</p>
                    <p className="text-3xl font-black text-white">${selectedProduct.precio_mayorista.toLocaleString('es-CL')}</p>
                  </div>
                </div>

                {/* Modal Volume Controls */}
                {(() => {
                  const qty = cart[selectedProduct.id] || 0;
                  return qty === 0 ? (
                    <button 
                      onClick={() => handleUpdateQuantity(selectedProduct.id, 1)}
                      className="w-full bg-yellow-500 hover:bg-yellow-400 text-black font-black py-4 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(234,179,8,0.3)]"
                    >
                      <Plus className="w-5 h-5" />
                      Añadir al Pedido
                    </button>
                  ) : (
                    <div className="flex items-center justify-between bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-1.5 shadow-inner">
                      <button 
                        onClick={() => handleUpdateQuantity(selectedProduct.id, -1)}
                        className="w-14 h-12 rounded-lg bg-[#121214] text-gray-300 hover:text-white hover:bg-white/10 transition-colors flex items-center justify-center shadow-sm"
                      >
                        {qty === 1 ? <Trash2 className="w-5 h-5 text-red-400" /> : <Minus className="w-5 h-5" />}
                      </button>
                      <div className="flex flex-col items-center justify-center flex-1">
                        <span className="font-mono text-2xl font-black text-yellow-500 leading-none">
                          {qty}
                        </span>
                        <span className="text-[10px] uppercase tracking-wider text-yellow-500/70 mt-1">Unidades</span>
                      </div>
                      <button 
                        onClick={() => handleUpdateQuantity(selectedProduct.id, 1)}
                        className="w-14 h-12 rounded-lg bg-yellow-500 text-black hover:bg-yellow-400 transition-colors flex items-center justify-center shadow-sm"
                      >
                        <Plus className="w-6 h-6 font-bold" />
                      </button>
                    </div>
                  );
                })()}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
