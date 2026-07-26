'use client';

import { useState, useEffect } from 'react';
import { useAgentAuth } from '@/context/AgentAuthContext';
import { supabase } from '@/lib/supabase/client';
import { Mail, Search, Edit3, Printer, X, Save, RefreshCw } from 'lucide-react';

export default function TarjetasManagement() {
  const { agent } = useAgentAuth();
  
  const isAdmin = agent?.role === 'ADMIN';
  const canManageOrders = isAdmin || agent?.permissions?.gestionar_pedidos;

  const [tarjetas, setTarjetas] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Modal state
  const [selectedTarjeta, setSelectedTarjeta] = useState<any>(null);
  const [isEditingMessage, setIsEditingMessage] = useState(false);
  const [editMessageText, setEditMessageText] = useState('');
  const [toastMessage, setToastMessage] = useState('');

  useEffect(() => {
    fetchTarjetas();
  }, []);

  async function fetchTarjetas() {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('tarjetas')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      if (data) setTarjetas(data);
    } catch (err) {
      console.error("Error fetching tarjetas:", err);
    } finally {
      setLoading(false);
    }
  }

  const handleOpenTarjeta = (tarjeta: any) => {
    setSelectedTarjeta(tarjeta);
    setEditMessageText(tarjeta.message || '');
    setIsEditingMessage(false);
  };

  const handleSaveMessage = async () => {
    if (!selectedTarjeta) return;
    try {
      await supabase
        .from('tarjetas')
        .update({ message: editMessageText })
        .eq('id', selectedTarjeta.id);
        
      const updatedTarjeta = { ...selectedTarjeta, message: editMessageText };
      setTarjetas(prev => prev.map(t => t.id === selectedTarjeta.id ? updatedTarjeta : t));
      setSelectedTarjeta(updatedTarjeta);
      setIsEditingMessage(false);
      
      setToastMessage('Mensaje actualizado con éxito');
      setTimeout(() => setToastMessage(''), 3000);
    } catch (e) {
      console.error(e);
      setToastMessage('Error al actualizar mensaje');
      setTimeout(() => setToastMessage(''), 3000);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const filteredTarjetas = tarjetas.filter(t => 
    t.order_id?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    t.message?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="animate-in fade-in duration-500 relative pb-10 space-y-8">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-8 right-8 z-50 bg-green-500 text-white px-6 py-3 rounded-xl shadow-2xl font-bold animate-in slide-in-from-bottom-5 print:hidden">
          ✅ {toastMessage}
        </div>
      )}

      {/* Header */}
      <div className="print:hidden bg-gradient-to-r from-purple-950/80 via-[#120D1D] to-[#0E0E12] border border-white/10 p-6 md:p-8 rounded-3xl shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 -mt-12 -mr-12 w-64 h-64 bg-fuchsia-600/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-fuchsia-500/10 border border-fuchsia-500/20 text-fuchsia-300 text-xs font-bold uppercase tracking-widest mb-3">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-fuchsia-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-fuchsia-500" />
              </span>
              Gestión de Dedicatorias
            </div>
            <h1 className="text-3xl font-extrabold text-white tracking-tight mb-2 flex items-center gap-3">
              <Mail className="text-fuchsia-400" size={32} /> Central de Tarjetas Digitales
            </h1>
            <p className="text-gray-400 text-sm max-w-xl">
              Visualiza, edita e imprime de forma masiva o individual todas las dedicatorias creadas por los clientes para sus pedidos.
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
              <input 
                type="text" 
                placeholder="Buscar por Pedido o Texto..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-[#181820] border border-white/10 rounded-2xl py-2.5 pl-10 pr-4 text-sm text-white focus:outline-none focus:border-fuchsia-500/50 w-full sm:w-64 transition-all"
              />
            </div>
            <button 
              onClick={fetchTarjetas}
              className="bg-white/5 hover:bg-white/10 text-white font-bold p-3 rounded-2xl border border-white/10 transition-all flex items-center justify-center backdrop-blur-md"
              title="Refrescar"
            >
              <RefreshCw size={18} className={loading ? "animate-spin" : ""} />
            </button>
          </div>
        </div>
      </div>

      {/* Grid de Tarjetas */}
      <div className="print:hidden">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 bg-[#111116]/90 border border-white/5 rounded-3xl">
            <div className="w-10 h-10 border-4 border-fuchsia-500 border-t-transparent rounded-full animate-spin mb-4"></div>
            <p className="text-gray-400 font-medium">Cargando tarjetas...</p>
          </div>
        ) : filteredTarjetas.length === 0 ? (
          <div className="text-center py-20 bg-[#111116]/90 border border-white/5 rounded-3xl">
            <Mail className="mx-auto text-gray-700 mb-4" size={48} />
            <h3 className="text-white font-bold text-lg mb-1">No hay tarjetas disponibles</h3>
            <p className="text-gray-500 text-sm">Prueba ajustando el término de búsqueda.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {filteredTarjetas.map((tarjeta) => (
              <div 
                key={tarjeta.id}
                onClick={() => handleOpenTarjeta(tarjeta)}
                className="bg-[#111116]/90 border border-white/5 hover:border-fuchsia-500/40 rounded-2xl overflow-hidden cursor-pointer group transition-all shadow-lg hover:shadow-fuchsia-500/10 flex flex-col h-full"
              >
                {/* Image Header */}
                <div className="relative aspect-[3/4] w-full bg-gray-900 overflow-hidden border-b border-white/5">
                  <img 
                    src={tarjeta.image_url} 
                    alt="Tarjeta" 
                    className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-all duration-500 group-hover:scale-105" 
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent"></div>
                  
                  {/* Overlay text preview */}
                  <div className="absolute inset-0 p-4 flex flex-col justify-end">
                    <p className="text-white/90 text-xs font-serif italic line-clamp-4 text-shadow-sm drop-shadow-md">
                      "{tarjeta.message}"
                    </p>
                  </div>
                </div>
                
                {/* Meta data */}
                <div className="p-4 bg-[#181820] flex justify-between items-center mt-auto">
                  <div>
                    <p className="text-[10px] text-gray-500 font-extrabold uppercase tracking-widest mb-0.5">Orden</p>
                    <p className="text-white font-mono text-sm font-bold group-hover:text-fuchsia-400 transition-colors">
                      {tarjeta.order_id || 'Sin Asignar'}
                    </p>
                  </div>
                  <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-gray-400 group-hover:bg-fuchsia-500/20 group-hover:text-fuchsia-300 transition-all">
                    <Edit3 size={14} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* MODAL & VISTA DE IMPRESIÓN */}
      {selectedTarjeta && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 print:absolute print:inset-0 print:p-0 print:bg-white print:z-auto">
          
          <style dangerouslySetInnerHTML={{__html: `
            @media print {
              @page { size: A4 portrait; margin: 0; }
              body { background-color: white !important; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
              body > nav, body > header { display: none !important; }
            }
          `}} />

          {/* Background Overlay (oculto en impresión) */}
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm print:hidden" onClick={() => setSelectedTarjeta(null)}></div>
          
          {/* Modal Container */}
          <div className="bg-[#1C1C1E] border border-gray-800 rounded-3xl w-full max-w-4xl relative z-10 shadow-2xl overflow-y-auto overflow-x-hidden max-h-[90vh] no-scrollbar print:overflow-visible print:max-h-none print:bg-white print:text-black print:border-none print:shadow-none print:w-full print:max-w-none print:mx-0 print:rounded-none">
            
            {/* 🖨️ VISTA EXCLUSIVA DE IMPRESIÓN (La Tarjeta a 10x15cm) */}
            <div className="hidden print:flex w-full h-screen items-center justify-center bg-white">
              <div className="relative overflow-hidden" style={{ width: '10cm', height: '15cm', pageBreakInside: 'avoid' }}>
                <img src={selectedTarjeta.image_url} className="absolute inset-0 w-full h-full object-cover z-0" alt="Fondo Tarjeta" />
                <div className="absolute inset-0 bg-black/40 z-0"></div>
                <div className="relative z-10 flex flex-col justify-center items-center h-full p-8 text-center text-white">
                  <p className="whitespace-pre-wrap font-serif" style={{ fontSize: '20px', lineHeight: '1.5', textShadow: '2px 2px 4px rgba(0,0,0,0.8)' }}>
                    {selectedTarjeta.message}
                  </p>
                </div>
              </div>
            </div>

            {/* 💻 VISTA DIGITAL (Oculta en Impresión) */}
            <div className="print:hidden">
              <div className="p-6 border-b border-gray-800 bg-[#111111] flex justify-between items-center sticky top-0 z-20">
                <div>
                  <h2 className="text-xl font-bold text-white flex items-center gap-2">
                    <Mail className="text-primary" size={20} /> Detalle de Dedicatoria
                  </h2>
                  <p className="text-gray-400 font-mono text-sm mt-1">Pedido: {selectedTarjeta.order_id || 'Sin Asignar'}</p>
                </div>
                <button onClick={() => setSelectedTarjeta(null)} className="w-8 h-8 flex items-center justify-center bg-gray-800 hover:bg-red-500/20 text-gray-400 hover:text-red-400 rounded-full transition-all">
                  <X size={18} />
                </button>
              </div>

              <div className="p-6 md:p-8 flex flex-col md:flex-row gap-8 bg-[#0B0B0F]">
                
                {/* Previsualización de la Tarjeta */}
                <div className="w-full md:w-1/2 flex flex-col items-center">
                  <p className="text-xs font-extrabold text-gray-500 uppercase tracking-widest mb-4 w-full text-center">Previsualización (Formato 10x15cm)</p>
                  
                  <div className="relative w-full max-w-[320px] aspect-[2/3] rounded-2xl overflow-hidden shadow-2xl border-4 border-[#1C1C1E]">
                    <img src={selectedTarjeta.image_url} className="absolute inset-0 w-full h-full object-cover z-0" alt="Tarjeta Preview" />
                    <div className="absolute inset-0 bg-black/40 z-0"></div>
                    <div className="relative z-10 flex flex-col justify-center items-center h-full p-6 text-center text-white">
                      <p className="whitespace-pre-wrap font-serif text-lg leading-relaxed drop-shadow-md">
                        {isEditingMessage ? editMessageText : selectedTarjeta.message}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Edición y Acciones */}
                <div className="w-full md:w-1/2 flex flex-col">
                  
                  <div className="bg-[#111111] border border-gray-800 p-6 rounded-2xl flex-1 flex flex-col">
                    <div className="flex justify-between items-center mb-4">
                      <p className="text-xs font-extrabold text-gray-500 uppercase tracking-widest flex items-center gap-2">
                        <Edit3 size={14} /> Contenido del Mensaje
                      </p>
                      <button 
                        onClick={() => setIsEditingMessage(!isEditingMessage)} 
                        className={`text-xs font-bold px-3 py-1.5 rounded-lg transition-colors ${isEditingMessage ? 'bg-red-500/10 text-red-400 hover:bg-red-500/20' : 'bg-white/5 text-gray-300 hover:bg-white/10'}`}
                      >
                        {isEditingMessage ? 'Cancelar Edición' : 'Editar Mensaje'}
                      </button>
                    </div>
                    
                    {isEditingMessage ? (
                      <div className="flex-1 flex flex-col h-full min-h-[250px]">
                        <textarea 
                          value={editMessageText}
                          onChange={(e) => setEditMessageText(e.target.value)}
                          className="flex-1 w-full bg-[#1A1A1D] border border-gray-700 rounded-xl p-4 text-white text-base leading-relaxed focus:border-primary focus:ring-1 focus:ring-primary outline-none resize-none shadow-inner"
                          placeholder="Escribe el mensaje de la dedicatoria aquí..."
                        />
                        <button 
                          onClick={handleSaveMessage}
                          disabled={!canManageOrders}
                          className="mt-4 w-full bg-gradient-to-r from-primary to-fuchsia-600 hover:from-fuchsia-500 hover:to-primary text-white font-black py-3.5 rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-fuchsia-600/20 disabled:opacity-50"
                        >
                          <Save size={18} /> Guardar Cambios
                        </button>
                      </div>
                    ) : (
                      <div className="flex-1 bg-[#1A1A1D] border border-gray-800 rounded-xl p-6 overflow-y-auto">
                        <p className="text-gray-300 whitespace-pre-wrap font-serif italic text-lg leading-relaxed">
                          "{selectedTarjeta.message}"
                        </p>
                      </div>
                    )}
                  </div>
                  
                  {/* Botonera inferior */}
                  <div className="mt-4">
                    <button 
                      onClick={handlePrint}
                      className="w-full bg-white text-black hover:bg-gray-200 font-black py-4 rounded-2xl flex items-center justify-center gap-2 transition-all shadow-xl"
                    >
                      <Printer size={20} /> Enviar a Imprimir (Formato Tarjeta)
                    </button>
                    <p className="text-center text-[10px] text-gray-500 mt-3 font-medium">
                      💡 Asegúrate de configurar la impresora sin márgenes y con fondos activados.
                    </p>
                  </div>

                </div>
              </div>
            </div>
            {/* FIN VISTA DIGITAL */}

          </div>
        </div>
      )}

    </div>
  );
}
