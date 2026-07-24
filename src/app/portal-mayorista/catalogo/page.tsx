'use client';

import { useState, useMemo, useEffect } from 'react';
import { Search, ShoppingCart, Trash2, Plus, Minus, Package, X, LogOut, Sparkles, TrendingUp, CheckCircle, Send, PhoneCall, ShieldCheck } from 'lucide-react';

export default function B2BCatalogPage() {
  const [activeCategory, setActiveCategory] = useState<string>('Todos');
  const [searchQuery, setSearchQuery] = useState('');
  const [categorias, setCategorias] = useState<any[]>([]);
  const [catalogo, setCatalogo] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const [cart, setCart] = useState<Record<string, number>>({});
  const [isClient, setIsClient] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<any | null>(null);

  // Modal de datos del pedido B2B para CRM Agente
  const [checkoutModalOpen, setCheckoutModalOpen] = useState(false);
  const [b2bFormData, setB2bFormData] = useState({
    empresa: '',
    contacto: '',
    telefono: '',
    rut: '',
    direccion: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderConfirmed, setOrderConfirmed] = useState(false);
  const [confirmedOrderId, setConfirmedOrderId] = useState('');

  useEffect(() => {
    setIsClient(true);
    Promise.all([
      fetch('/api/categorias-b2b').then(res => res.json()),
      fetch('/api/catalogo-b2b').then(res => res.json())
    ])
    .then(([cats, prods]) => {
      setCategorias(cats || []);
      setCatalogo(prods || []);
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
      result = result.filter(p => p.nombre.toLowerCase().includes(q) || (p.categoria && p.categoria.toLowerCase().includes(q)));
    }
    return result;
  }, [activeCategory, searchQuery, catalogo]);

  const cartTotal = useMemo(() => {
    return Object.entries(cart).reduce((total, [id, qty]) => {
      const product = catalogo.find(p => p.id === id);
      return total + (product ? (product.precio_mayorista || 0) * qty : 0);
    }, 0);
  }, [cart, catalogo]);
  
  const cartItemCount = Object.values(cart).reduce((a, b) => a + b, 0);

  // Calcular margen promedio estimado para el comprador
  const totalSuggestedRetail = useMemo(() => {
    return Object.entries(cart).reduce((total, [id, qty]) => {
      const product = catalogo.find(p => p.id === id);
      const retailPrice = product?.precio_sugerido_retail || (product?.precio_mayorista * 2);
      return total + (retailPrice * qty);
    }, 0);
  }, [cart, catalogo]);

  const estimatedProfitMargin = useMemo(() => {
    if (cartTotal === 0) return 0;
    return Math.round(((totalSuggestedRetail - cartTotal) / cartTotal) * 100);
  }, [cartTotal, totalSuggestedRetail]);

  const handleOpenCheckoutModal = () => {
    if (cartItemCount === 0) return;
    setCheckoutModalOpen(true);
  };

  // Enviar pedido: Registro en CRM Agente + WhatsApp Executive Direct
  const handleFinalizeOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const orderItems = Object.entries(cart).map(([id, qty]) => {
      const p = catalogo.find(p => p.id === id);
      return {
        id,
        nombre: p?.nombre || 'Producto B2B',
        cantidad: qty,
        unidad: p?.unidad_venta || 'Unidad',
        precioUnitario: p?.precio_mayorista || 0,
        subtotal: (p?.precio_mayorista || 0) * qty
      };
    });

    const orderData = {
      cliente: b2bFormData.contacto || b2bFormData.empresa || 'Florería Mayorista',
      empresa: b2bFormData.empresa,
      telefono: b2bFormData.telefono,
      rut: b2bFormData.rut,
      direccion: b2bFormData.direccion,
      total: cartTotal,
      detalles: orderItems
    };

    // 1. Sincronizar con el CRM de Agentes (POST a /api/agentes/b2b-pedidos)
    try {
      const res = await fetch('/api/agentes/b2b-pedidos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData)
      });
      const data = await res.json();
      if (data.order?.id) {
        setConfirmedOrderId(data.order.id);
      }
    } catch (e) {
      console.error('Error registrando en CRM:', e);
    }

    // 2. Formatear mensaje para WhatsApp al ejecutivo de ventas
    const itemsText = orderItems.map(item => 
      `• ${item.cantidad} x [${item.unidad}] ${item.nombre} ($${item.subtotal.toLocaleString('es-CL')})`
    ).join('\n');

    const mensajeWhatsApp = `🏢 *NUEVO PEDIDO MAYORISTA B2B*\n\n` +
      `*Empresa / Florería:* ${b2bFormData.empresa || 'No especificada'}\n` +
      `*Contacto:* ${b2bFormData.contacto}\n` +
      `*Teléfono:* ${b2bFormData.telefono}\n` +
      `*RUT:* ${b2bFormData.rut || 'Pendiente'}\n` +
      `*Dirección:* ${b2bFormData.direccion || 'Pendiente'}\n\n` +
      `📦 *DETALLE DEL PEDIDO:*\n${itemsText}\n\n` +
      `💰 *TOTAL ESTIMADO B2B:* $${cartTotal.toLocaleString('es-CL')}\n\n` +
      `Quedo atento a la confirmación de stock, factura y link de pago. ¡Gracias!`;

    const whatsappUrl = `https://wa.me/56979992848?text=${encodeURIComponent(mensajeWhatsApp)}`;
    
    setIsSubmitting(false);
    setOrderConfirmed(true);

    // Abrir WhatsApp en nueva pestaña
    window.open(whatsappUrl, '_blank');
  };

  return (
    <div className="min-h-screen bg-[#0A0A0C] pt-28 pb-44 font-sans text-white selection:bg-yellow-500/30">
      <div className="container mx-auto px-4 lg:px-8 max-w-7xl">
        
        {/* Header B2B VIP */}
        <div className="mb-10 flex flex-col lg:flex-row lg:justify-between lg:items-end gap-6 border-b border-white/10 pb-8">
          <div>
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-yellow-500/10 border border-yellow-500/30 rounded-full text-xs font-black tracking-widest uppercase mb-4 text-yellow-400 shadow-[0_0_20px_rgba(234,179,8,0.2)]">
              <Sparkles className="w-4 h-4" />
              Red Mayorista Chileflor B2B
            </div>
            <h1 className="text-4xl md:text-6xl font-black mb-3 tracking-tight">
              Central de <span className="bg-gradient-to-r from-yellow-400 via-amber-300 to-yellow-500 bg-clip-text text-transparent">Abastecimiento</span>
            </h1>
            <p className="text-gray-400 text-base md:text-lg max-w-2xl">
              Precios directo de distribuidor, stock asegurado y atención ejecutiva vinculada en tiempo real a tu ejecutivo asignado.
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            <a 
              href="https://wa.me/56979992848?text=Hola%20Chileflor,%20soy%20mayorista%20y%20necesito%20atenci%C3%B3n%20ejecutiva"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2 px-5 py-3 bg-yellow-500 text-black hover:bg-yellow-400 font-extrabold rounded-2xl text-sm transition-all shadow-[0_0_20px_rgba(234,179,8,0.3)] hover:scale-105 active:scale-95"
            >
              <PhoneCall className="w-4 h-4" />
              Ejecutivo Asignado
            </a>
          </div>
        </div>

        {/* Hero Banner Promocional Mayorista */}
        <div className="relative w-full rounded-[2.5rem] bg-gradient-to-r from-amber-900/40 via-yellow-900/20 to-transparent border border-yellow-500/20 p-8 md:p-10 mb-10 overflow-hidden shadow-2xl">
          <div className="absolute -top-12 -right-12 w-64 h-64 bg-yellow-500/10 rounded-full blur-3xl pointer-events-none" />
          
          <div className="relative z-10 max-w-2xl">
            <div className="flex items-center gap-2 text-yellow-400 text-xs font-bold uppercase tracking-widest mb-2">
              <ShieldCheck className="w-4 h-4" /> Beneficio Exclusivo Florerías
            </div>
            <h2 className="text-2xl md:text-3xl font-black mb-2 text-white">Consigue hasta 60% de Margen de Ganancia</h2>
            <p className="text-gray-300 text-sm md:text-base mb-4">
              Cada insumo y paquete de flores de corte incluye precio de reventa sugerido para maximizar tu rentabilidad en cada evento.
            </p>
            <div className="flex flex-wrap gap-4 text-xs font-bold text-gray-300">
              <span className="bg-black/40 border border-white/10 px-3 py-1.5 rounded-xl">📦 Pedido Mínimo Flexible</span>
              <span className="bg-black/40 border border-white/10 px-3 py-1.5 rounded-xl">📄 Facturación Electrónica 100%</span>
              <span className="bg-black/40 border border-white/10 px-3 py-1.5 rounded-xl">⚡ Despacho Prioritario</span>
            </div>
          </div>
        </div>

        {/* Filtros de Categoría Pills & Buscador */}
        <div className="mb-10 space-y-4">
          <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
            {/* Search Bar */}
            <div className="relative w-full md:w-96">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
              <input
                type="text"
                placeholder="Buscar por flores, insumos, rollos..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#141418] border border-white/10 text-white rounded-2xl pl-12 pr-4 py-3.5 focus:outline-none focus:border-yellow-500 transition-all placeholder-gray-500 text-sm"
              />
              {searchQuery && (
                <button onClick={() => setSearchQuery('')} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white text-xs">
                  ✕
                </button>
              )}
            </div>

            {/* Total items badge */}
            <div className="text-xs text-gray-400 font-medium">
              Mostrando <strong className="text-yellow-400">{filteredProducts.length}</strong> productos mayoristas
            </div>
          </div>

          {/* Category Filter Pills */}
          <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2 pt-1">
            <button
              onClick={() => setActiveCategory('Todos')}
              className={`px-5 py-2.5 rounded-2xl font-bold text-xs md:text-sm whitespace-nowrap transition-all ${
                activeCategory === 'Todos'
                  ? 'bg-yellow-500 text-black shadow-[0_0_20px_rgba(234,179,8,0.3)]'
                  : 'bg-[#141418] text-gray-400 border border-white/10 hover:text-white'
              }`}
            >
              Todos ({catalogo.length})
            </button>
            {categorias.map((cat: any) => {
              const count = catalogo.filter(p => p.categoria === (cat.nombre || cat)).length;
              return (
                <button
                  key={cat.id || cat.nombre || cat}
                  onClick={() => setActiveCategory(cat.nombre || cat)}
                  className={`px-5 py-2.5 rounded-2xl font-bold text-xs md:text-sm whitespace-nowrap transition-all ${
                    activeCategory === (cat.nombre || cat)
                      ? 'bg-yellow-500 text-black shadow-[0_0_20px_rgba(234,179,8,0.3)]'
                      : 'bg-[#141418] text-gray-400 border border-white/10 hover:text-white'
                  }`}
                >
                  {cat.nombre || cat} {count > 0 ? `(${count})` : ''}
                </button>
              );
            })}
          </div>
        </div>

        {/* Grid de Productos Mayoristas */}
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20 text-gray-500">
            <div className="w-12 h-12 border-4 border-gray-800 border-t-yellow-500 rounded-full animate-spin mb-4" />
            <p className="font-bold text-sm">Cargando catálogo exclusivo B2B...</p>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="bg-[#141418] border border-white/10 rounded-3xl p-16 text-center flex flex-col items-center">
            <Package className="w-16 h-16 text-gray-600 mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">No se encontraron insumos mayoristas</h3>
            <p className="text-gray-400 text-sm max-w-md">Prueba buscando con otros términos o seleccionando otra categoría.</p>
            <button onClick={() => { setActiveCategory('Todos'); setSearchQuery(''); }} className="mt-6 px-6 py-2.5 bg-yellow-500 text-black rounded-full font-bold text-xs hover:bg-yellow-400 transition-colors">
              Restablecer Filtros
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map(product => {
              const qty = cart[product.id] || 0;
              const isSelected = qty > 0;
              
              // Margen comercial estimado
              const wholesalePrice = product.precio_mayorista || 0;
              const retailPrice = product.precio_sugerido_retail || (wholesalePrice * 2);
              const marginPercent = wholesalePrice > 0 ? Math.round(((retailPrice - wholesalePrice) / wholesalePrice) * 100) : 0;
              
              return (
                <div 
                  key={product.id} 
                  className={`flex flex-col h-full bg-[#141418] rounded-3xl overflow-hidden transition-all duration-300 border ${
                    isSelected 
                      ? 'border-yellow-500/50 shadow-[0_0_30px_rgba(234,179,8,0.25)] scale-[1.02]' 
                      : 'border-white/10 hover:border-white/20 hover:shadow-xl'
                  }`}
                >
                  {/* Image Container */}
                  <div 
                    className="aspect-[4/3] relative overflow-hidden bg-black/60 p-4 cursor-pointer group"
                    onClick={() => setSelectedProduct(product)}
                  >
                    <img 
                      src={product.imagen} 
                      alt={product.nombre} 
                      className="w-full h-full object-cover rounded-xl group-hover:scale-105 transition-transform duration-500" 
                    />
                    
                    {/* Badges */}
                    <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
                      {product.badge && (
                        <span className="bg-yellow-500 text-black text-[9px] font-extrabold px-2.5 py-1 rounded-full uppercase tracking-widest shadow-md">
                          {product.badge}
                        </span>
                      )}
                      {marginPercent > 0 && (
                        <span className="bg-emerald-500 text-white text-[9px] font-extrabold px-2.5 py-1 rounded-full uppercase tracking-widest shadow-md flex items-center gap-1">
                          <TrendingUp className="w-3 h-3" /> Margen: +{marginPercent}%
                        </span>
                      )}
                    </div>
                    
                    {/* Unit tag */}
                    <div className="absolute bottom-3 left-3 bg-black/80 backdrop-blur-md border border-white/15 text-[10px] font-bold px-3 py-1 rounded-full text-gray-300 flex items-center gap-1.5">
                      <Package className="w-3 h-3 text-yellow-400" />
                      {product.unidad_venta || 'Unidad'}
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-5 flex flex-col flex-grow justify-between">
                    <div>
                      <p className="text-[10px] text-yellow-400 font-extrabold uppercase tracking-widest mb-1">
                        {product.categoria}
                      </p>
                      <h3 
                        className="font-bold text-base text-white mb-3 line-clamp-2 leading-snug cursor-pointer hover:text-yellow-400 transition-colors"
                        onClick={() => setSelectedProduct(product)}
                      >
                        {product.nombre}
                      </h3>
                    </div>

                    <div className="mt-auto pt-4 border-t border-white/5">
                      <div className="flex items-end justify-between mb-4">
                        <div>
                          <p className="text-[9px] text-gray-500 uppercase tracking-widest font-bold mb-0.5">Precio Mayorista</p>
                          <p className="text-xl font-black text-white">${(product.precio_mayorista || 0).toLocaleString('es-CL')}</p>
                        </div>
                        {product.precio_sugerido_retail && (
                          <div className="text-right">
                            <p className="text-[9px] text-gray-500 uppercase tracking-widest font-bold mb-0.5">Ref. Reventa</p>
                            <p className="text-xs text-gray-400 line-through">${product.precio_sugerido_retail.toLocaleString('es-CL')}</p>
                          </div>
                        )}
                      </div>

                      {/* Volume Add Controls */}
                      {qty === 0 ? (
                        <button 
                          onClick={() => handleUpdateQuantity(product.id, 1)}
                          className="w-full bg-white/10 hover:bg-yellow-500 hover:text-black border border-white/15 text-white font-extrabold py-3 rounded-2xl transition-all duration-300 flex items-center justify-center gap-2 text-xs uppercase tracking-wider"
                        >
                          <Plus className="w-4 h-4" />
                          Añadir al Pedido
                        </button>
                      ) : (
                        <div className="flex items-center justify-between bg-yellow-500/10 border border-yellow-500/30 rounded-2xl p-1 shadow-inner">
                          <button 
                            onClick={() => handleUpdateQuantity(product.id, -1)}
                            className="w-10 h-9 rounded-xl bg-[#141418] text-gray-300 hover:text-white hover:bg-white/10 transition-colors flex items-center justify-center"
                          >
                            {qty === 1 ? <Trash2 className="w-4 h-4 text-red-400" /> : <Minus className="w-4 h-4" />}
                          </button>
                          <div className="flex flex-col items-center justify-center flex-1">
                            <span className="font-mono text-base font-black text-yellow-400 leading-none">
                              {qty}
                            </span>
                            <span className="text-[8px] uppercase tracking-wider text-yellow-400/80 mt-0.5 font-bold">Cant.</span>
                          </div>
                          <button 
                            onClick={() => handleUpdateQuantity(product.id, 1)}
                            className="w-10 h-9 rounded-xl bg-yellow-500 text-black hover:bg-yellow-400 transition-colors flex items-center justify-center"
                          >
                            <Plus className="w-4 h-4 font-bold" />
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
      </div>

      {/* Floating Checkout Bar & CRM Sync Trigger */}
      {isClient && cartItemCount > 0 && (
        <div className="fixed bottom-0 left-0 right-0 z-50 p-4 md:p-6 pointer-events-none">
          <div className="container mx-auto max-w-4xl">
            <div className="bg-[#141418]/95 backdrop-blur-xl border border-yellow-500/40 p-4 md:p-5 rounded-3xl shadow-[0_-10px_40px_rgba(0,0,0,0.8)] flex flex-col md:flex-row md:items-center justify-between gap-4 pointer-events-auto">
              
              <div className="flex items-center justify-between md:justify-start gap-4">
                <div className="w-12 h-12 bg-yellow-500/20 rounded-2xl flex items-center justify-center shrink-0 border border-yellow-500/30">
                  <ShoppingCart className="w-6 h-6 text-yellow-400" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <p className="text-xs text-gray-400 uppercase tracking-widest font-bold">Total Pedido Mayorista</p>
                    {estimatedProfitMargin > 0 && (
                      <span className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[9px] font-extrabold px-2 py-0.5 rounded-md">
                        Rentabilidad ~{estimatedProfitMargin}%
                      </span>
                    )}
                  </div>
                  <p className="text-2xl md:text-3xl font-black text-white">${cartTotal.toLocaleString('es-CL')}</p>
                </div>
              </div>
              
              <button 
                onClick={handleOpenCheckoutModal}
                className="bg-gradient-to-r from-yellow-500 to-amber-500 hover:from-yellow-400 hover:to-amber-400 text-black font-black px-8 py-4 rounded-2xl transition-all shadow-[0_0_25px_rgba(234,179,8,0.4)] hover:scale-105 active:scale-95 flex items-center justify-center gap-2 text-sm md:text-base"
              >
                <Send className="w-5 h-5" />
                <span>Enviar Pedido a Ejecutivo ({cartItemCount})</span>
              </button>

            </div>
          </div>
        </div>
      )}

      {/* Modal de Finalización e Integración con CRM Agente */}
      {checkoutModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div 
            className="absolute inset-0 bg-black/80 backdrop-blur-md"
            onClick={() => { if (!isSubmitting) setCheckoutModalOpen(false); }}
          />
          
          <div className="relative w-full max-w-lg bg-[#141418] border border-yellow-500/30 rounded-[2.5rem] p-6 md:p-8 shadow-2xl text-white z-10">
            <button 
              onClick={() => setCheckoutModalOpen(false)}
              className="absolute top-5 right-5 text-gray-400 hover:text-white"
            >
              <X className="w-6 h-6" />
            </button>

            {orderConfirmed ? (
              <div className="text-center py-6 animate-in zoom-in-95 duration-300">
                <CheckCircle className="w-16 h-16 text-yellow-400 mx-auto mb-4" />
                <h3 className="text-2xl font-black mb-2">¡Pedido Registrado en CRM!</h3>
                <p className="text-gray-400 text-sm mb-6">
                  Se ha enviado el desglose a tu Ejecutivo por WhatsApp y se registró el pedido #{confirmedOrderId || 'B2B'} en el sistema central de Chileflor.
                </p>
                <button
                  onClick={() => {
                    setCheckoutModalOpen(false);
                    setOrderConfirmed(false);
                    setCart({});
                  }}
                  className="w-full bg-yellow-500 text-black font-extrabold py-3.5 rounded-2xl hover:bg-yellow-400 transition-colors"
                >
                  Cerrar y Volver al Catálogo
                </button>
              </div>
            ) : (
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-yellow-500/10 border border-yellow-500/30 rounded-full text-xs font-bold text-yellow-400 mb-4 uppercase tracking-widest">
                  Confirmación de Pedido Mayorista
                </div>
                <h3 className="text-2xl font-black mb-2">Datos de Facturación & Despacho</h3>
                <p className="text-gray-400 text-xs mb-6">Ingresa los datos para enviar tu requerimiento directo a tu ejecutivo de ventas asignado.</p>

                <form onSubmit={handleFinalizeOrder} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Nombre de la Florería o Empresa</label>
                    <input 
                      type="text" 
                      required
                      placeholder="Ej: Florería Rosas del Sur"
                      value={b2bFormData.empresa}
                      onChange={e => setB2bFormData({ ...b2bFormData, empresa: e.target.value })}
                      className="w-full bg-[#0A0A0C] border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:border-yellow-500 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Nombre de Contacto *</label>
                    <input 
                      type="text" 
                      required
                      placeholder="Ej: Juan Pérez"
                      value={b2bFormData.contacto}
                      onChange={e => setB2bFormData({ ...b2bFormData, contacto: e.target.value })}
                      className="w-full bg-[#0A0A0C] border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:border-yellow-500 outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-gray-400 uppercase mb-1">WhatsApp *</label>
                      <input 
                        type="tel" 
                        required
                        placeholder="+56 9 ..."
                        value={b2bFormData.telefono}
                        onChange={e => setB2bFormData({ ...b2bFormData, telefono: e.target.value })}
                        className="w-full bg-[#0A0A0C] border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:border-yellow-500 outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-400 uppercase mb-1">RUT Empresa (Opcional)</label>
                      <input 
                        type="text" 
                        placeholder="76.123.456-7"
                        value={b2bFormData.rut}
                        onChange={e => setB2bFormData({ ...b2bFormData, rut: e.target.value })}
                        className="w-full bg-[#0A0A0C] border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:border-yellow-500 outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Dirección de Entrega</label>
                    <input 
                      type="text" 
                      placeholder="Región, Comuna, Calle"
                      value={b2bFormData.direccion}
                      onChange={e => setB2bFormData({ ...b2bFormData, direccion: e.target.value })}
                      className="w-full bg-[#0A0A0C] border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:border-yellow-500 outline-none"
                    />
                  </div>

                  <div className="pt-4 border-t border-white/10 flex justify-between items-center text-xs text-gray-400 mb-2">
                    <span>Total Pedido: <strong className="text-white text-base">${cartTotal.toLocaleString('es-CL')}</strong></span>
                    <span>Items: <strong className="text-white">{cartItemCount}</strong></span>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-gradient-to-r from-yellow-500 to-amber-500 hover:from-yellow-400 hover:to-amber-400 text-black font-black py-4 rounded-2xl transition-all shadow-[0_0_20px_rgba(234,179,8,0.4)] disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {isSubmitting ? 'Registrando en CRM...' : 'Enviar Pedido & Conectar con Ejecutivo →'}
                  </button>
                </form>
              </div>
            )}

          </div>
        </div>
      )}

      {/* Product Detail Modal */}
      {selectedProduct && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div 
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            onClick={() => setSelectedProduct(null)}
          />
          <div className="relative w-full max-w-2xl bg-[#141418] border border-white/15 rounded-[2.5rem] overflow-hidden shadow-2xl flex flex-col md:flex-row z-10 text-white">
            
            <button 
              onClick={() => setSelectedProduct(null)}
              className="absolute top-4 right-4 z-10 w-9 h-9 bg-black/60 hover:bg-black text-white rounded-full flex items-center justify-center backdrop-blur-md transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="w-full md:w-1/2 bg-black/60 p-6 flex items-center justify-center min-h-[250px]">
              <img 
                src={selectedProduct.imagen} 
                alt={selectedProduct.nombre} 
                className="max-w-full max-h-[350px] object-contain rounded-xl drop-shadow-2xl" 
              />
            </div>
            
            <div className="w-full md:w-1/2 p-8 flex flex-col justify-between">
              <div>
                <p className="text-[10px] text-yellow-400 uppercase tracking-widest font-extrabold mb-2">{selectedProduct.categoria}</p>
                <h2 className="text-2xl font-black text-white mb-3 leading-tight">{selectedProduct.nombre}</h2>
                
                <div className="bg-white/5 border border-white/10 rounded-2xl p-4 mb-6">
                  <p className="text-xs text-gray-300 leading-relaxed mb-3">
                    {selectedProduct.descripcion || 'Insumo floral premium seleccionado para distribuidores y floristas.'}
                  </p>
                  <div className="flex items-center gap-2 text-xs text-gray-400">
                    <Package className="w-4 h-4 text-yellow-400" />
                    <span>Unidad de Venta: <strong className="text-white">{selectedProduct.unidad_venta || 'Unidad'}</strong></span>
                  </div>
                </div>
              </div>

              <div>
                <div className="flex items-end justify-between mb-6">
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-widest font-bold mb-1">Precio Mayorista</p>
                    <p className="text-3xl font-black text-white">${(selectedProduct.precio_mayorista || 0).toLocaleString('es-CL')}</p>
                  </div>
                  {selectedProduct.precio_sugerido_retail && (
                    <div className="text-right">
                      <p className="text-[9px] text-gray-500 uppercase tracking-widest font-bold mb-1">PVP Ref.</p>
                      <p className="text-sm text-gray-400 line-through">${selectedProduct.precio_sugerido_retail.toLocaleString('es-CL')}</p>
                    </div>
                  )}
                </div>

                {(() => {
                  const qty = cart[selectedProduct.id] || 0;
                  return qty === 0 ? (
                    <button 
                      onClick={() => handleUpdateQuantity(selectedProduct.id, 1)}
                      className="w-full bg-yellow-500 hover:bg-yellow-400 text-black font-black py-4 rounded-2xl transition-all duration-300 flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(234,179,8,0.3)] text-sm"
                    >
                      <Plus className="w-5 h-5" />
                      Añadir al Pedido Mayorista
                    </button>
                  ) : (
                    <div className="flex items-center justify-between bg-yellow-500/10 border border-yellow-500/30 rounded-2xl p-1.5 shadow-inner">
                      <button 
                        onClick={() => handleUpdateQuantity(selectedProduct.id, -1)}
                        className="w-12 h-10 rounded-xl bg-[#141418] text-gray-300 hover:text-white hover:bg-white/10 transition-colors flex items-center justify-center"
                      >
                        {qty === 1 ? <Trash2 className="w-4 h-4 text-red-400" /> : <Minus className="w-4 h-4" />}
                      </button>
                      <div className="flex flex-col items-center justify-center flex-1">
                        <span className="font-mono text-xl font-black text-yellow-400 leading-none">
                          {qty}
                        </span>
                        <span className="text-[9px] uppercase tracking-wider text-yellow-400/80 mt-1 font-bold">Unidades</span>
                      </div>
                      <button 
                        onClick={() => handleUpdateQuantity(selectedProduct.id, 1)}
                        className="w-12 h-10 rounded-xl bg-yellow-500 text-black hover:bg-yellow-400 transition-colors flex items-center justify-center"
                      >
                        <Plus className="w-5 h-5 font-bold" />
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
