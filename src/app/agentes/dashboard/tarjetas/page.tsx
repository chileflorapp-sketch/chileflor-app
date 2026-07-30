'use client';

import { useState, useEffect } from 'react';
import { useAgentAuth } from '@/context/AgentAuthContext';
import { supabase } from '@/lib/supabase/client';
import { Mail, Search, Copy, User, X, RefreshCw, CheckCircle2 } from 'lucide-react';

export default function TarjetasManagement() {
  const { agent } = useAgentAuth();
  
  const [pedidos, setPedidos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Modal state
  const [selectedPedido, setSelectedPedido] = useState<any>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  useEffect(() => {
    fetchPedidos();
  }, []);

  async function fetchPedidos() {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('pedidos')
        .select('*')
        .not('detalles->dedicatoria', 'is', null)
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      // Filtrar aquellos donde dedicatoria sea string no vacío
      const filtered = (data || []).filter(p => {
        const ded = p.detalles?.dedicatoria;
        return typeof ded === 'string' && ded.trim() !== '';
      });
      
      setPedidos(filtered);
    } catch (err) {
      console.error("Error fetching pedidos:", err);
    } finally {
      setLoading(false);
    }
  }

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const filteredPedidos = pedidos.filter(p => 
    p.codigo_orden?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    p.detalles?.dedicatoria?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="animate-in fade-in duration-500 relative pb-10 space-y-8">
      
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-950/80 via-[#120D1D] to-[#0E0E12] border border-white/10 p-6 md:p-8 rounded-3xl shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 -mt-12 -mr-12 w-64 h-64 bg-fuchsia-600/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-fuchsia-500/10 border border-fuchsia-500/20 text-fuchsia-300 text-xs font-bold uppercase tracking-widest mb-3">
              Gestión de Dedicatorias
            </div>
            <h1 className="text-3xl font-extrabold text-white tracking-tight mb-2 flex items-center gap-3">
              <Mail className="text-fuchsia-400" size={32} /> Dedicatorias de Clientes
            </h1>
            <p className="text-gray-400 text-sm max-w-xl">
              Copia los mensajes de las dedicatorias fácilmente para generar las tarjetas de forma manual.
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
              <input 
                type="text" 
                placeholder="Buscar por Orden o Texto..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-[#181820] border border-white/10 rounded-2xl py-2.5 pl-10 pr-4 text-sm text-white focus:outline-none focus:border-fuchsia-500/50 w-full sm:w-64 transition-all"
              />
            </div>
            <button 
              onClick={fetchPedidos}
              className="bg-white/5 hover:bg-white/10 text-white font-bold p-3 rounded-2xl border border-white/10 transition-all flex items-center justify-center backdrop-blur-md"
              title="Refrescar"
            >
              <RefreshCw size={18} className={loading ? "animate-spin" : ""} />
            </button>
          </div>
        </div>
      </div>

      {/* Grid de Dedicatorias */}
      <div>
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 bg-[#111116]/90 border border-white/5 rounded-3xl">
            <div className="w-10 h-10 border-4 border-fuchsia-500 border-t-transparent rounded-full animate-spin mb-4"></div>
            <p className="text-gray-400 font-medium">Cargando dedicatorias...</p>
          </div>
        ) : filteredPedidos.length === 0 ? (
          <div className="text-center py-20 bg-[#111116]/90 border border-white/5 rounded-3xl">
            <Mail className="mx-auto text-gray-700 mb-4" size={48} />
            <h3 className="text-white font-bold text-lg mb-1">No hay dedicatorias</h3>
            <p className="text-gray-500 text-sm">Prueba ajustando el término de búsqueda o espera a nuevos pedidos.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPedidos.map((pedido) => (
              <div 
                key={pedido.id}
                className="bg-[#111116]/90 border border-white/5 hover:border-white/10 rounded-2xl overflow-hidden transition-all shadow-lg flex flex-col h-full"
              >
                {/* Header Card */}
                <div className="p-4 bg-[#181820] border-b border-white/5 flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-fuchsia-500/10 flex items-center justify-center text-fuchsia-400">
                      <Mail size={18} />
                    </div>
                    <div>
                      <p className="text-[10px] text-gray-500 font-extrabold uppercase tracking-widest mb-0.5">Orden</p>
                      <p className="text-white font-mono text-sm font-bold">
                        {pedido.codigo_orden}
                      </p>
                    </div>
                  </div>
                  
                  <button 
                    onClick={() => setSelectedPedido(pedido)}
                    className="text-xs bg-white/5 hover:bg-white/10 text-gray-300 font-bold px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5"
                  >
                    <User size={14} /> Cliente
                  </button>
                </div>
                
                {/* Content */}
                <div className="p-5 flex-1 flex flex-col">
                  <div className="flex-1 bg-[#0A0A0C] border border-white/5 rounded-xl p-4 mb-4">
                    <p className="text-gray-300 whitespace-pre-wrap font-serif italic text-sm md:text-base leading-relaxed">
                      "{pedido.detalles?.dedicatoria}"
                    </p>
                  </div>
                  
                  <button
                    onClick={() => handleCopy(pedido.detalles?.dedicatoria, pedido.id)}
                    className={`w-full py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-all ${
                      copiedId === pedido.id 
                        ? 'bg-green-500/20 text-green-400 border border-green-500/50' 
                        : 'bg-primary hover:bg-primary-dark text-white border border-transparent shadow-lg'
                    }`}
                  >
                    {copiedId === pedido.id ? (
                      <>
                        <CheckCircle2 size={18} /> ¡Copiado!
                      </>
                    ) : (
                      <>
                        <Copy size={18} /> Copiar Texto
                      </>
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* MODAL CLIENTE */}
      {selectedPedido && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          
          {/* Background Overlay */}
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setSelectedPedido(null)}></div>
          
          {/* Modal Container */}
          <div className="bg-[#1C1C1E] border border-gray-800 rounded-3xl w-full max-w-md relative z-10 shadow-2xl overflow-hidden">
            
            <div className="p-5 border-b border-gray-800 bg-[#111111] flex justify-between items-center">
              <div>
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                  <User className="text-fuchsia-400" size={18} /> Datos del Cliente
                </h2>
                <p className="text-gray-400 font-mono text-xs mt-1">Orden: {selectedPedido.codigo_orden}</p>
              </div>
              <button onClick={() => setSelectedPedido(null)} className="w-8 h-8 flex items-center justify-center bg-gray-800 hover:bg-red-500/20 text-gray-400 hover:text-red-400 rounded-full transition-all">
                <X size={16} />
              </button>
            </div>

            <div className="p-6 space-y-6">
              
              {/* Comprador */}
              <div>
                <h3 className="text-xs font-black text-gray-500 uppercase tracking-widest mb-3 flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div> Comprador
                </h3>
                <div className="bg-[#111116] border border-gray-800 rounded-xl p-4 space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-500 text-sm">Nombre:</span>
                    <span className="text-white font-medium text-sm text-right max-w-[200px] truncate">{selectedPedido.detalles?.comprador?.nombre || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500 text-sm">Email:</span>
                    <span className="text-white font-medium text-sm text-right max-w-[200px] truncate">{selectedPedido.detalles?.comprador?.email || 'N/A'}</span>
                  </div>
                </div>
              </div>

              {/* Destinatario */}
              <div>
                <h3 className="text-xs font-black text-gray-500 uppercase tracking-widest mb-3 flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div> Destinatario (Entrega)
                </h3>
                <div className="bg-[#111116] border border-gray-800 rounded-xl p-4 space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-500 text-sm">Nombre:</span>
                    <span className="text-white font-medium text-sm text-right max-w-[200px] truncate">{selectedPedido.detalles?.destinatario?.nombre || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500 text-sm">Teléfono:</span>
                    <span className="text-white font-medium text-sm text-right max-w-[200px] truncate">{selectedPedido.detalles?.destinatario?.telefono || 'N/A'}</span>
                  </div>
                  <div className="pt-2 mt-2 border-t border-gray-800">
                    <span className="text-gray-500 text-sm block mb-1">Dirección / Ubicación:</span>
                    <p className="text-white font-medium text-sm">
                      {selectedPedido.detalles?.metodo_entrega === 'domicilio' 
                        ? `${selectedPedido.detalles?.direccion}, ${selectedPedido.detalles?.comuna}`
                        : `Cementerio: ${selectedPedido.detalles?.cementerio} - ${selectedPedido.detalles?.sector || 'N/A'}`}
                    </p>
                  </div>
                </div>
              </div>

            </div>
            
            <div className="p-5 border-t border-gray-800 bg-[#111111]">
              <button 
                onClick={() => setSelectedPedido(null)}
                className="w-full bg-white/5 hover:bg-white/10 text-white font-bold py-3 rounded-xl transition-all"
              >
                Cerrar
              </button>
            </div>
            
          </div>
        </div>
      )}

    </div>
  );
}
