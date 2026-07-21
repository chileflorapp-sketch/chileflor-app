'use client';

import { useState, useMemo, useEffect } from 'react';
import { Tilt } from 'react-tilt';

export default function B2BCatalogPage() {
  const [activeCategory, setActiveCategory] = useState<string>('Todos');
  const [categorias, setCategorias] = useState<any[]>([]);
  const [catalogo, setCatalogo] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const [cart, setCart] = useState<Record<string, number>>({});

  useEffect(() => {
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
    if (activeCategory === 'Todos') return catalogo;
    return catalogo.filter(p => p.categoria === activeCategory);
  }, [activeCategory, catalogo]);

  const cartTotal = useMemo(() => {
    return Object.entries(cart).reduce((total, [id, qty]) => {
      const product = catalogo.find(p => p.id === id);
      return total + (product ? product.precio_mayorista * qty : 0);
    }, 0);
  }, [cart, catalogo]);

  const handleWhatsAppCheckout = () => {
    const items = Object.entries(cart).map(([id, qty]) => {
      const p = catalogo.find(p => p.id === id);
      return p ? `${qty} ${p.unidad_venta} de ${p.nombre}` : '';
    }).join('\n');

    const mensaje = `¡Hola Chileflor! Soy [Nombre Florería]. Quiero realizar el siguiente pedido mayorista:\n\n${items}\n\nDatos de Entrega: [Dirección]\nRecibe: [Nombre]\nTipo de documento: Factura a [RUT Empresa]\n\nQuedo a la espera de la confirmación de stock y link de pago.`;
    
    const url = `https://wa.me/56979992848?text=${encodeURIComponent(mensaje)}`;
    window.open(url, '_blank');
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] pt-40 pb-12 font-serif text-white">
      <div className="container mx-auto px-4">
        
        {/* Header B2B */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 border-b border-gray-800 pb-8">
          <div>
            <div className="inline-block px-3 py-1 bg-yellow-500/10 border border-yellow-500/20 rounded-full text-[10px] font-bold tracking-widest uppercase mb-4 text-yellow-500">
              Acceso Verificado
            </div>
            <h1 className="text-3xl font-bold mb-2">Central Mayorista</h1>
            <p className="text-gray-400 text-sm">Abastecimiento exclusivo para la red de floristas Chileflor.</p>
          </div>
          
          <div className="mt-6 md:mt-0 bg-[#151515] border border-gray-800 p-4 rounded-2xl flex items-center gap-6 shadow-2xl">
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-widest mb-1">Total Pedido</p>
              <p className="text-2xl font-bold text-yellow-500">${cartTotal.toLocaleString('es-CL')}</p>
            </div>
            <button 
              onClick={handleWhatsAppCheckout}
              disabled={Object.keys(cart).length === 0}
              className="relative group bg-yellow-500 text-black font-bold px-6 py-3 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:-translate-y-1"
            >
              {Object.keys(cart).length > 0 && (
                <div className="absolute inset-0 bg-yellow-500 rounded-xl blur-md opacity-0 group-hover:opacity-70 transition-opacity duration-300"></div>
              )}
              <span className="relative">Enviar a Ejecutivo</span>
            </button>
          </div>
        </div>

        {/* Hero B2B */}
        <div className="relative w-full h-56 md:h-72 mb-12 rounded-[40px] overflow-hidden flex items-center px-8 md:px-16 shadow-2xl">
          {/* Background Image */}
          <div className="absolute inset-0 z-0">
            <img 
              src="/banner_b2b_supplies.png" 
              alt="Insumos B2B" 
              className="w-full h-full object-cover object-center"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/60 to-transparent"></div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
          </div>
          
          {/* Content */}
          <div className="z-10 max-w-xl relative">
            <h2 className="text-3xl md:text-5xl font-black text-white mb-4 drop-shadow-lg tracking-tight">Insumos Florales Premium</h2>
            <p className="text-gray-200 text-sm md:text-xl font-medium drop-shadow-md">Catálogo exclusivo de cintas, espuma y cristalería con precios por volumen.</p>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Sidebar Nav */}
          <aside className="lg:w-64 flex-shrink-0">
            <div className="bg-[#151515] border border-gray-800 rounded-3xl p-6 sticky top-24 shadow-2xl">
              <h2 className="text-sm font-bold uppercase tracking-widest text-gray-500 mb-4">Catálogos</h2>
              <div className="space-y-1">
                <button
                  onClick={() => setActiveCategory('Todos')}
                  className={`w-full text-left px-4 py-3 rounded-xl text-sm font-medium transition-colors ${activeCategory === 'Todos' ? 'bg-yellow-500/10 text-yellow-500' : 'text-gray-300 hover:bg-gray-800'}`}
                >
                  Todo el Inventario
                </button>
                {categorias.map(cat => (
                  <button
                    key={cat.id}
                    onClick={() => setActiveCategory(cat.nombre)}
                    className={`w-full text-left px-4 py-3 rounded-xl text-sm font-medium transition-colors ${activeCategory === cat.nombre ? 'bg-yellow-500/10 text-yellow-500' : 'text-gray-300 hover:bg-gray-800'}`}
                  >
                    {cat.nombre}
                  </button>
                ))}
              </div>
            </div>
          </aside>

          {/* Grid de Productos B2B con Vanilla-Tilt */}
          <main className="flex-1">
            {isLoading ? (
              <div className="text-center py-20 text-gray-500 animate-pulse">
                Cargando inventario mayorista...
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="text-center py-20 text-gray-500">
                No hay productos disponibles en esta categoría.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredProducts.map(product => {
                  const qty = cart[product.id] || 0;
                  
                  return (
                    <Tilt 
                      key={product.id} 
                    options={{ max: 10, scale: 1.02, speed: 400, glare: true, 'max-glare': 0.05 }}
                    className="flex flex-col h-full"
                  >
                    <div className="bg-[#151515] h-full border border-gray-800 rounded-3xl overflow-hidden flex flex-col group hover:border-gray-600 transition-colors shadow-[0_20px_40px_-15px_rgba(0,0,0,0.8)]">
                      
                      <div className="aspect-square relative overflow-hidden bg-black">
                        <img src={product.imagen} alt={product.nombre} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-80" />
                        
                        {product.badge && (
                          <div className="absolute top-3 left-3">
                            <span className="bg-yellow-500 text-black text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-widest shadow-md">
                              {product.badge}
                            </span>
                          </div>
                        )}
                        
                        <div className="absolute bottom-3 left-3 bg-black/80 backdrop-blur border border-gray-700 text-xs px-3 py-1 rounded-full text-gray-300 shadow-md">
                          📦 {product.unidad_venta}
                        </div>
                      </div>

                      <div className="p-6 flex flex-col flex-grow justify-between relative z-10 bg-[#151515]">
                        <div>
                          <h3 className="font-bold text-lg text-white mb-1">{product.nombre}</h3>
                          <p className="text-xs text-gray-500 uppercase tracking-widest">{product.categoria}</p>
                        </div>

                        <div className="mt-6 pt-6 border-t border-gray-800">
                          <div className="flex justify-between items-end mb-4">
                            <div>
                              <p className="text-[10px] text-gray-500 uppercase tracking-widest mb-1">Precio Mayorista</p>
                              <p className="text-xl font-bold text-yellow-500">${product.precio_mayorista.toLocaleString('es-CL')}</p>
                            </div>
                            {product.precio_sugerido_retail && (
                              <div className="text-right">
                                <p className="text-[10px] text-gray-600 uppercase tracking-widest mb-1">PVP Sugerido</p>
                                <p className="text-sm text-gray-400 line-through">${product.precio_sugerido_retail.toLocaleString('es-CL')}</p>
                              </div>
                            )}
                          </div>

                          {/* Controles de Volumen */}
                          <div className="flex items-center justify-between bg-[#0A0A0A] border border-gray-800 rounded-xl p-2 shadow-inner">
                            <button 
                              onClick={() => handleUpdateQuantity(product.id, -1)}
                              className="w-10 h-10 rounded-lg bg-[#151515] text-gray-400 hover:text-white hover:bg-gray-700 transition-colors flex items-center justify-center font-bold shadow-sm"
                            >
                              -
                            </button>
                            <span className="font-mono text-lg font-bold w-12 text-center drop-shadow-md">
                              {qty}
                            </span>
                            <button 
                              onClick={() => handleUpdateQuantity(product.id, 1)}
                              className="w-10 h-10 rounded-lg bg-yellow-500/10 text-yellow-500 hover:bg-yellow-500 hover:text-black transition-colors flex items-center justify-center font-bold shadow-sm"
                            >
                              +
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Tilt>
                );
              })}
            </div>
            )}
          </main>

        </div>
      </div>
    </div>
  );
}
