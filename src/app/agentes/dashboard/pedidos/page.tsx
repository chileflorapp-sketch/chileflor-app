'use client';

import { useState, useEffect } from 'react';
import { useAgentAuth } from '@/context/AgentAuthContext';
import { supabase } from '@/lib/supabase/client';
import CameraCapture from '@/components/CameraCapture';

export default function PedidosManagement() {
  const { agent } = useAgentAuth();
  
  const isAdmin = agent?.role === 'ADMIN';
  const canManageOrders = isAdmin || agent?.permissions?.gestionar_pedidos;

  const [activeTab, setActiveTab] = useState<'B2C' | 'B2B'>('B2C');
  const [orders, setOrders] = useState<any[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [stagedStatus, setStagedStatus] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [activeCameraType, setActiveCameraType] = useState<'producto' | 'entrega' | 'antes' | 'despues' | null>(null);

  const [isEditingClient, setIsEditingClient] = useState(false);
  const [editClientData, setEditClientData] = useState({
    cliente: '', telefono: '', direccion: '', rut: '', giro: '', tipo_documento: 'orden_compra'
  });

  const [tarjetaDigital, setTarjetaDigital] = useState<any>(null);
  const [printMode, setPrintMode] = useState<'orden' | 'tarjeta'>('orden');
  const [isEditingTarjeta, setIsEditingTarjeta] = useState(false);
  const [tarjetaMessage, setTarjetaMessage] = useState('');

  useEffect(() => {
    fetchOrders();

    const channel = supabase
      .channel('public:pedidos')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'pedidos' }, payload => {
         fetchOrders(); 
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  async function fetchOrders() {
    try {
      const { data, error } = await supabase
        .from('pedidos')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      if (data) {
        const mappedOrders = data.map(order => {
          let itemsDetalle = 'Varios items';
          if (order.detalles?.items) {
            itemsDetalle = order.detalles.items.map((i: any) => `${i.cantidad}x ${i.nombre}`).join(', ');
          }

          let direccion = 'No especificada';
          if (order.tipo_entrega === 'cementerio') {
            direccion = order.detalles?.cementerio ? `${order.detalles.cementerio.recinto} - Sector: ${order.detalles.cementerio.sector || 'S/N'}, Lápida: ${order.detalles.cementerio.lapida || 'S/N'}` : 'Cementerio';
          } else {
            direccion = order.detalles?.direccion_completa || order.detalles?.direccion || 'Domicilio (Sin dirección)';
          }

          return {
            id: order.codigo_orden,
            telefono: order.detalles?.telefono_contacto || 'No informado',
            total: order.total,
            estado: order.estado === 'pending_payment' ? 'PENDIENTE_PAGO' : 
                    (order.estado === 'pagado' || order.estado === 'paid') ? 'PREPARANDO' : 
                    order.estado.toUpperCase(),
            tipo: 'B2C', // Todo: Diferenciar B2B si es posible
            metodo_pago: order.metodo_pago || order.detalles?.pago_preferido || 'No especificado',
            direccion: direccion,
            fecha: new Date(order.created_at).toLocaleString('es-CL'),
            detalle: itemsDetalle,
            esCementerio: order.tipo_entrega === 'cementerio',
            evidencia: order.detalles?.evidencia || { producto: null, entrega: null, antes: null, despues: null },
            facturacion: order.detalles?.facturacion || { tipo_documento: 'orden_compra', rut: '', giro: '', cliente: null },
            cliente: order.detalles?.facturacion?.cliente || (order.user_id ? 'Cliente Registrado' : 'Cliente Invitado'),
            dbData: order // Guardamos la referencia cruda para updates
          };
        });
        setOrders(mappedOrders);
      }
    } catch (err) {
      console.error("Error fetching orders:", err);
    } finally {
      setLoading(false);
    }
  }

  const filteredOrders = orders.filter(o => o.tipo === activeTab);

  const handleOpenOrder = async (order: any) => {
    setSelectedOrder(order);
    setStagedStatus(order.estado);
    setEditClientData({
      cliente: order.cliente,
      telefono: order.telefono,
      direccion: order.direccion,
      rut: order.facturacion?.rut || '',
      giro: order.facturacion?.giro || '',
      tipo_documento: order.facturacion?.tipo_documento || 'orden_compra'
    });
    setIsEditingClient(false);
    
    // Fetch tarjeta
    setTarjetaDigital(null);
    setIsEditingTarjeta(false);
    try {
      const { data: tarjetas } = await supabase
        .from('tarjetas')
        .select('*')
        .eq('order_id', order.id);
        
      if (tarjetas && tarjetas.length > 0) {
        setTarjetaDigital(tarjetas[0]);
        setTarjetaMessage(tarjetas[0].message || '');
      }
    } catch (e) {
      console.error("Error fetching tarjeta:", e);
    }
  };

  const handleSaveClientData = async () => {
    if (!selectedOrder) return;
    try {
      const newFacturacion = {
        tipo_documento: editClientData.tipo_documento,
        rut: editClientData.rut,
        giro: editClientData.giro,
        cliente: editClientData.cliente
      };
      
      const newDetalles = {
        ...(selectedOrder.dbData?.detalles || {}),
        telefono_contacto: editClientData.telefono,
        direccion_completa: editClientData.direccion,
        facturacion: newFacturacion
      };

      await supabase
        .from('pedidos')
        .update({ detalles: newDetalles })
        .eq('codigo_orden', selectedOrder.id);

      const updatedOrder = {
        ...selectedOrder,
        cliente: editClientData.cliente,
        telefono: editClientData.telefono,
        direccion: editClientData.direccion,
        facturacion: newFacturacion,
        dbData: {
           ...selectedOrder.dbData,
           detalles: newDetalles
        }
      };
      
      setOrders(prev => prev.map(o => o.id === selectedOrder.id ? updatedOrder : o));
      setSelectedOrder(updatedOrder);
      setIsEditingClient(false);
      
      setToastMessage('Datos actualizados con éxito');
      setTimeout(() => setToastMessage(''), 3000);
    } catch(e) {
      console.error(e);
      setToastMessage('Error al actualizar datos');
      setTimeout(() => setToastMessage(''), 3000);
    }
  };

  const handleSaveTarjeta = async () => {
    if (!tarjetaDigital) return;
    try {
      await supabase
        .from('tarjetas')
        .update({ message: tarjetaMessage })
        .eq('id', tarjetaDigital.id);
        
      setTarjetaDigital({ ...tarjetaDigital, message: tarjetaMessage });
      setIsEditingTarjeta(false);
      setToastMessage('Mensaje de tarjeta actualizado');
    } catch (e) {
      console.error(e);
      setToastMessage('Error al actualizar tarjeta');
    }
    setTimeout(() => setToastMessage(''), 3000);
  };

  const handleUpdateStatus = async () => {
    if (!selectedOrder || !stagedStatus) return;
    
    const newStatus = stagedStatus;
    
    // Update locally immediately
    setOrders(prev => prev.map(o => o.id === selectedOrder.id ? { ...o, estado: newStatus } : o));
    setSelectedOrder({ ...selectedOrder, estado: newStatus });
    setStagedStatus(null);
    
    try {
      const realStatus = newStatus === 'PENDIENTE_PAGO' ? 'pending_payment' : 
                         newStatus === 'PREPARANDO' ? 'pagado' : // asumiendo flujo
                         newStatus.toLowerCase();
                         
      await supabase
        .from('pedidos')
        .update({ estado: realStatus })
        .eq('codigo_orden', selectedOrder.id);
        
      setToastMessage(`Estado de ${selectedOrder.id} actualizado a ${newStatus}`);
    } catch (e) {
      console.error(e);
      setToastMessage(`Error al actualizar estado`);
    }
    
    setTimeout(() => setToastMessage(''), 3000);
  };

  const handlePrint = (mode: 'orden' | 'tarjeta') => {
    setPrintMode(mode);
    setTimeout(() => {
      window.print();
    }, 100);
  };

  const handleWhatsApp = () => {
    if (!selectedOrder) return;
    const msg = `Hola ${selectedOrder.cliente}! Te escribimos de Chileflor. Queremos informarte que tu pedido ${selectedOrder.id} está actualmente en estado: ${selectedOrder.estado}.`;
    window.open(`https://wa.me/${selectedOrder.telefono}?text=${encodeURIComponent(msg)}`, '_blank');
  };

  const handleUploadEvidence = async (type: 'producto' | 'entrega' | 'antes' | 'despues') => {
    if (!selectedOrder || !canManageOrders) return;
    setActiveCameraType(type);
  };

  const handleCameraCapture = async (base64Image: string) => {
    if (!selectedOrder || !canManageOrders || !activeCameraType) return;
    
    const type = activeCameraType;
    setActiveCameraType(null);
    
    const newEvidence = { ...selectedOrder.evidencia, [type]: base64Image };
    const updatedOrder = {
      ...selectedOrder,
      evidencia: newEvidence
    };
    
    // Update locally
    setOrders(prev => prev.map(o => o.id === selectedOrder.id ? updatedOrder : o));
    setSelectedOrder(updatedOrder);
    
    // Update Supabase
    try {
      const newDetalles = {
        ...(selectedOrder.dbData?.detalles || {}),
        evidencia: newEvidence
      };
      
      await supabase
        .from('pedidos')
        .update({ detalles: newDetalles })
        .eq('codigo_orden', selectedOrder.id);
        
      setToastMessage(`📸 Evidencia (${type}) subida y guardada con éxito`);
    } catch (e) {
      console.error(e);
      setToastMessage(`Error al guardar evidencia`);
    }
    
    setTimeout(() => setToastMessage(''), 3000);
  };
  const isSII = selectedOrder?.facturacion?.tipo_documento === 'boleta' || selectedOrder?.facturacion?.tipo_documento === 'factura';
  const isFactura = selectedOrder?.facturacion?.tipo_documento === 'factura';
  const isGuia = selectedOrder?.facturacion?.tipo_documento === 'guia_despacho';
  const colorDominante = isSII ? '#D80000' : (isGuia ? '#4B5563' : '#2B4B8B');
  const titleDoc = isFactura ? 'FACTURA ELECTRÓNICA' :
                   selectedOrder?.facturacion?.tipo_documento === 'boleta' ? 'BOLETA ELECTRÓNICA' :
                   isGuia ? 'GUÍA DE DESPACHO' : 'ORDEN DE COMPRA';

  return (
    <div className="animate-in fade-in duration-500 relative">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-8 right-8 z-50 bg-green-500 text-white px-6 py-3 rounded-xl shadow-2xl font-bold animate-in slide-in-from-bottom-5 print:hidden">
          ✅ {toastMessage}
        </div>
      )}

      <header className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-fuchsia-500/10 border border-fuchsia-500/20 text-fuchsia-300 text-xs font-bold uppercase tracking-widest mb-3">
            📦 Gestión Kanban
          </div>
          <h1 className="text-3xl font-black text-white tracking-tight mb-2">Bandeja Operativa de Pedidos</h1>
          <p className="text-gray-400 text-sm">Control en tiempo real de ordenes, fotos de despacho y comprobantes SII.</p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={() => { setLoading(true); fetchOrders(); }}
            className="w-11 h-11 flex items-center justify-center rounded-2xl border border-white/10 text-gray-300 hover:text-white hover:border-fuchsia-500/50 hover:bg-white/5 transition-all bg-[#111116]"
            title="Actualizar Pedidos"
          >
            🔄
          </button>
          <div className="flex bg-[#111116] border border-white/5 rounded-2xl p-1.5 backdrop-blur-md">
            <button 
              onClick={() => setActiveTab('B2C')}
              className={`px-5 py-2 rounded-xl text-xs font-extrabold transition-all ${
                activeTab === 'B2C' 
                  ? 'bg-gradient-to-r from-fuchsia-600 to-rose-600 text-white shadow-lg shadow-fuchsia-600/20' 
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              Ventas Web (B2C)
            </button>
            <button 
              onClick={() => setActiveTab('B2B')}
              className={`px-5 py-2 rounded-xl text-xs font-extrabold transition-all ${
                activeTab === 'B2B' 
                  ? 'bg-gradient-to-r from-amber-500 to-yellow-500 text-black shadow-lg shadow-amber-500/20' 
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              Mayoristas (B2B)
            </button>
          </div>
        </div>
      </header>

      <div className="bg-[#111116]/90 border border-white/5 rounded-3xl overflow-hidden shadow-2xl backdrop-blur-md print:shadow-none">
        <div className="p-6 border-b border-white/5 flex justify-between items-center bg-white/[0.02]">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
            <h2 className="font-extrabold text-white text-base">Órdenes Activas en Sistema ({filteredOrders.length})</h2>
          </div>
          <span className="text-xs text-gray-500 font-mono">Actualización automática vía realtime</span>
        </div>
        <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6 bg-[#0B0B0F]/60 overflow-x-auto min-h-[60vh]">
          {loading ? (
             <div className="col-span-3 p-12 text-center text-gray-500 font-medium">Cargando pedidos...</div>
          ) : filteredOrders.length === 0 ? (
             <div className="col-span-3 p-12 text-center text-gray-500 font-medium">No hay pedidos activos en esta categoría.</div>
          ) : (
            <>
              {/* Kanban Column: Pendiente */}
              <div className="bg-[#111116]/80 rounded-2xl p-4 border border-white/5 flex flex-col gap-3 min-w-[280px]">
                <h3 className="text-amber-400 font-extrabold uppercase tracking-widest text-[11px] border-b border-amber-500/20 pb-3 flex justify-between items-center">
                  <span className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-amber-400" />
                    Pendiente / Pago
                  </span>
                  <span className="bg-amber-500/20 border border-amber-500/30 text-amber-300 px-2.5 py-0.5 rounded-full text-xs font-mono">
                    {filteredOrders.filter(o => o.estado === 'PENDIENTE_PAGO').length}
                  </span>
                </h3>
                {filteredOrders.filter(o => o.estado === 'PENDIENTE_PAGO').map(order => (
                  <div key={order.id} onClick={() => handleOpenOrder(order)} className="bg-white/[0.03] p-4 rounded-xl border border-white/5 hover:border-amber-500/50 hover:bg-white/[0.06] cursor-pointer transition-all shadow-md group">
                    <div className="flex justify-between items-start mb-2">
                      <span className="font-mono text-xs text-gray-400 group-hover:text-amber-400 transition-colors">{order.id}</span>
                      <span className="text-fuchsia-400 font-extrabold text-sm">${order.total.toLocaleString('es-CL')}</span>
                    </div>
                    <h4 className="font-bold text-white text-sm group-hover:text-amber-200 transition-colors">{order.cliente}</h4>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="text-[11px] px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-gray-400 uppercase tracking-wider">{order.metodo_pago}</span>
                    </div>
                    <p className="text-[11px] text-gray-400 mt-2 line-clamp-1">📍 {order.direccion}</p>
                    <p className="text-[10px] text-gray-500 mt-2 font-mono">🕒 {order.fecha}</p>
                  </div>
                ))}
              </div>

              {/* Kanban Column: Preparando */}
              <div className="bg-[#111116]/80 rounded-2xl p-4 border border-white/5 flex flex-col gap-3 min-w-[280px]">
                <h3 className="text-orange-400 font-extrabold uppercase tracking-widest text-[11px] border-b border-orange-500/20 pb-3 flex justify-between items-center">
                  <span className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-orange-400" />
                    Preparando Ramo
                  </span>
                  <span className="bg-orange-500/20 border border-orange-500/30 text-orange-300 px-2.5 py-0.5 rounded-full text-xs font-mono">
                    {filteredOrders.filter(o => o.estado === 'PREPARANDO').length}
                  </span>
                </h3>
                {filteredOrders.filter(o => o.estado === 'PREPARANDO').map(order => (
                  <div key={order.id} onClick={() => handleOpenOrder(order)} className="bg-white/[0.03] p-4 rounded-xl border border-white/5 hover:border-orange-500/50 hover:bg-white/[0.06] cursor-pointer transition-all shadow-md group">
                    <div className="flex justify-between items-start mb-2">
                      <span className="font-mono text-xs text-gray-400 group-hover:text-orange-400 transition-colors">{order.id}</span>
                      <span className="text-fuchsia-400 font-extrabold text-sm">${order.total.toLocaleString('es-CL')}</span>
                    </div>
                    <h4 className="font-bold text-white text-sm group-hover:text-orange-200 transition-colors">{order.cliente}</h4>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="text-[11px] px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-gray-400 uppercase tracking-wider">{order.metodo_pago}</span>
                    </div>
                    <p className="text-[11px] text-gray-400 mt-2 line-clamp-1">📍 {order.direccion}</p>
                    <p className="text-[10px] text-gray-500 mt-2 font-mono">🕒 {order.fecha}</p>
                  </div>
                ))}
              </div>

              {/* Kanban Column: En Ruta / Entregado */}
              <div className="bg-[#111116]/80 rounded-2xl p-4 border border-white/5 flex flex-col gap-3 min-w-[280px]">
                <h3 className="text-emerald-400 font-extrabold uppercase tracking-widest text-[11px] border-b border-emerald-500/20 pb-3 flex justify-between items-center">
                  <span className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    En Ruta / Entregado
                  </span>
                  <span className="bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 px-2.5 py-0.5 rounded-full text-xs font-mono">
                    {filteredOrders.filter(o => o.estado === 'EN_RUTA' || o.estado === 'COMPLETADO' || o.estado === 'OK').length}
                  </span>
                </h3>
                {filteredOrders.filter(o => o.estado === 'EN_RUTA' || o.estado === 'COMPLETADO' || o.estado === 'OK').map(order => (
                  <div key={order.id} onClick={() => handleOpenOrder(order)} className="bg-white/[0.03] p-4 rounded-xl border border-white/5 hover:border-emerald-500/50 hover:bg-white/[0.06] cursor-pointer transition-all shadow-md group">
                    <div className="flex justify-between items-start mb-2">
                      <span className="font-mono text-xs text-gray-400 group-hover:text-emerald-400 transition-colors">{order.id}</span>
                      <span className={`text-[9px] px-2 py-0.5 rounded-full font-black uppercase tracking-wider ${order.estado === 'EN_RUTA' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30' : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'}`}>{order.estado}</span>
                    </div>
                    <h4 className="font-bold text-white text-sm group-hover:text-emerald-200 transition-colors">{order.cliente}</h4>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="text-[11px] px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-gray-400 uppercase tracking-wider">{order.metodo_pago}</span>
                    </div>
                    <p className="text-[11px] text-gray-400 mt-2 line-clamp-1">📍 {order.direccion}</p>
                    <p className="text-[10px] text-gray-500 mt-2 font-mono">🕒 {order.fecha}</p>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Modal de Detalle de Pedido */}
      {selectedOrder && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 print:absolute print:inset-0 print:p-0 print:bg-white print:z-auto">
          
          <style dangerouslySetInnerHTML={{__html: `
            @media print {
              @page { size: A4 portrait; margin: 2cm; }
              body { background-color: white !important; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
              /* Ocultar elementos principales del layout de la app si interfieren */
              body > nav, body > header { display: none !important; }
            }
          `}} />

          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm print:hidden" onClick={() => setSelectedOrder(null)}></div>
          <div className="bg-[#1C1C1E] border border-gray-800 rounded-3xl w-full max-w-2xl relative z-10 shadow-2xl overflow-y-auto overflow-x-hidden max-h-[90vh] no-scrollbar print:overflow-visible print:max-h-none print:bg-white print:text-black print:border-none print:shadow-none print:w-full print:max-w-none print:mx-0 print:rounded-none">
            
            {/* VISTA DE IMPRESIÓN */}
            <div className={`hidden print:block w-full bg-white ${printMode === 'orden' ? 'p-8 font-sans' : 'p-0 m-0 w-full h-full'}`}>
              
              {printMode === 'orden' ? (
                <>
                  {/* HEADER SII FORMAT */}
                  <div className="flex justify-between items-start mb-4">
                    {/* Left: Logo & Company Info */}
                    <div className="flex gap-4 items-start w-[60%]">
                      <img src="/logo.png" alt="Chileflor" className="w-40 object-contain print:invert opacity-90 mt-2" />
                      <div className={`text-[${colorDominante}]`}>
                        <h1 className="text-xl font-black mb-2 leading-tight" style={{ color: colorDominante }}>CHILEFLOR SpA.</h1>
                        <div className="text-xs font-bold leading-tight" style={{ color: isSII ? '#2B4B8B' : colorDominante }}>
                          <p>Giro: VENTA DE FLORES E INSUMOS, PRODUCCIÓN Y</p>
                          <p>DISTRIBUCIÓN DE MATERIAS PRIMAS FLORALES</p>
                          <p className="mt-1">DIRECCIÓN: AV. LAS FLORES 123 - SANTIAGO</p>
                          <p className="mt-1">eMail: chileflor.app@gmail.com   Teléfono: +569 1234 5678</p>
                        </div>
                      </div>
                    </div>

                    {/* Right: The Red Box */}
                    <div className="w-[35%] flex flex-col items-center">
                      <div className={`border-[3px] p-4 text-center w-full mb-1`} style={{ borderColor: colorDominante, color: colorDominante }}>
                        <p className="font-bold text-lg">R.U.T.: 78.467.857-1</p>
                        <p className="font-bold text-xl my-2 leading-tight">{titleDoc}</p>
                        <p className="font-bold text-lg">Nº {selectedOrder.id.replace('ORD-', '')}</p>
                      </div>
                      <p className="text-xs font-bold text-center" style={{ color: colorDominante }}>
                        S.I.I. - SANTIAGO CENTRO
                      </p>
                    </div>
                  </div>

              {/* Date */}
              <div className="text-right text-xs mb-4 font-bold pr-4" style={{ color: isSII ? '#2B4B8B' : 'black' }}>
                Fecha Emision: {selectedOrder.fecha.split(',')[0]}
              </div>

              {/* SEÑOR(ES) BOX */}
              <div className="border-[2px] border-black p-3 text-xs mb-4 grid grid-cols-1 gap-1" style={{ color: isSII ? '#2B4B8B' : 'black' }}>
                <div className="flex">
                   <span className="w-24 font-bold">SEÑOR(ES):</span>
                   <span>{selectedOrder.cliente}</span>
                </div>
                {isFactura && (
                <div className="flex">
                   <span className="w-24 font-bold">R.U.T.:</span>
                   <span>{selectedOrder.facturacion?.rut || 'Sin RUT'}</span>
                </div>
                )}
                {isFactura && (
                <div className="flex">
                   <span className="w-24 font-bold">GIRO:</span>
                   <span>{selectedOrder.facturacion?.giro || 'Sin Giro'}</span>
                </div>
                )}
                <div className="flex">
                   <span className="w-24 font-bold">DIRECCION:</span>
                   <span>{selectedOrder.direccion}</span>
                </div>
                <div className="flex">
                   <span className="w-24 font-bold">CONTACTO:</span>
                   <span>{selectedOrder.telefono}</span>
                </div>
              </div>

              {/* TABLE */}
              <table className="w-full border-collapse border-2 border-black text-xs mb-8" style={{ color: isSII ? '#2B4B8B' : 'black' }}>
                <thead>
                  <tr className="border-b-2 border-black">
                    <th className="border-r border-black py-2 px-2 text-center w-24">Codigo</th>
                    <th className="border-r border-black py-2 px-2 text-left">Descripcion</th>
                    <th className="border-r border-black py-2 px-2 text-center w-16">Cantidad</th>
                    <th className="border-r border-black py-2 px-2 text-right w-24">Precio</th>
                    <th className="py-2 px-2 text-right w-24">Valor</th>
                  </tr>
                </thead>
                <tbody className="align-top">
                  {selectedOrder.dbData?.detalles?.items ? (
                    selectedOrder.dbData.detalles.items.map((item: any, idx: number) => (
                      <tr key={idx}>
                        <td className="border-r border-black px-2 py-1 text-center">{item.id || `ITEM-${idx+1}`}</td>
                        <td className="border-r border-black px-2 py-1">{item.nombre}</td>
                        <td className="border-r border-black px-2 py-1 text-center">{item.cantidad}</td>
                        <td className="border-r border-black px-2 py-1 text-right">{item.precio ? item.precio.toLocaleString('es-CL') : '-'}</td>
                        <td className="px-2 py-1 text-right">{item.precio ? (item.precio * item.cantidad).toLocaleString('es-CL') : '-'}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td className="border-r border-black px-2 py-1 text-center">001</td>
                      <td className="border-r border-black px-2 py-1 whitespace-pre-wrap">{selectedOrder.detalle}</td>
                      <td className="border-r border-black px-2 py-1 text-center">1</td>
                      <td className="border-r border-black px-2 py-1 text-right">-</td>
                      <td className="px-2 py-1 text-right">-</td>
                    </tr>
                  )}
                  {/* Empty spacer row */}
                  <tr>
                    <td className="border-r border-black h-12"></td>
                    <td className="border-r border-black"></td>
                    <td className="border-r border-black"></td>
                    <td className="border-r border-black"></td>
                    <td></td>
                  </tr>
                </tbody>
              </table>

              {/* FOOTER */}
              <div className="flex justify-between items-end">
                {/* TIMBRE Y COMENTARIOS */}
                <div className="w-[55%] flex flex-col items-center">
                  <div className="w-full border-2 border-black p-2 mb-4 h-20 text-xs text-black">
                    <span className="font-bold">Comentarios o instrucciones:</span><br/>
                    {selectedOrder.dbData?.detalles?.instrucciones || selectedOrder.detalle}
                  </div>
                  
                  {isSII && (
                    <div className="text-center w-64 text-black">
                      {/* PDF417 Mock */}
                      <img src={`https://bwipjs-api.metafloor.com/?bcid=pdf417&text=SII-${selectedOrder.id}&scale=2&columns=3&rows=7`} className="w-full h-24 object-contain mb-1" alt="Timbre SII" crossOrigin="anonymous" />
                      <p className="text-[10px] font-bold leading-tight">Timbre Electrónico SII</p>
                      <p className="text-[9px] leading-tight">Res.99 de 2014 Verifique documento: www.sii.cl</p>
                    </div>
                  )}
                </div>

                {/* TOTALS */}
                <div className="w-[40%] border-2 border-black">
                  <table className="w-full text-xs font-bold" style={{ color: isSII ? '#2B4B8B' : 'black' }}>
                    <tbody>
                      <tr className="border-b border-gray-300">
                        <td className="py-2 px-4 text-right">MONTO NETO</td>
                        <td className="py-2 px-4 text-right w-32">$ {Math.round(selectedOrder.total / 1.19).toLocaleString('es-CL')}</td>
                      </tr>
                      <tr className="border-b border-gray-300">
                        <td className="py-2 px-4 text-right">I.V.A. 19%</td>
                        <td className="py-2 px-4 text-right">$ {(selectedOrder.total - Math.round(selectedOrder.total / 1.19)).toLocaleString('es-CL')}</td>
                      </tr>
                      <tr>
                        <td className="py-2 px-4 text-right">TOTAL</td>
                        <td className="py-2 px-4 text-right">$ {selectedOrder.total.toLocaleString('es-CL')}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
                </>
              ) : (
                /* FORMATO DE IMPRESIÓN TARJETA */
                selectedOrder.dbData?.detalles?.dedicatoria && (
                  <div className="w-[10cm] h-[15cm] mx-auto relative overflow-hidden" style={{ pageBreakInside: 'avoid' }}>
                    <div className="absolute inset-0 bg-white z-0"></div>
                    <div className="relative z-10 flex flex-col justify-center items-center h-full p-8 text-center text-black">
                      <p className="whitespace-pre-wrap font-serif" style={{ fontSize: '20px', lineHeight: '1.5' }}>
                        {selectedOrder.dbData.detalles.dedicatoria}
                      </p>
                    </div>
                  </div>
                )
              )}
            </div>

            {/* VISTA DIGITAL (Oculta en Impresión) */}
            <div className="print:hidden">
              <div className="p-6 border-b border-gray-800 bg-[#111111] flex justify-between items-center">
                <div>
                  <h2 className="text-2xl font-bold text-white">Detalle del Pedido</h2>
                  <p className="text-gray-400 font-mono text-sm">{selectedOrder.id}</p>
                </div>
                <button onClick={() => { setSelectedOrder(null); setStagedStatus(null); }} className="w-8 h-8 flex items-center justify-center bg-gray-800 rounded-full text-white hover:bg-red-500 transition-colors">X</button>
              </div>

              <div className="p-8 space-y-6">
                
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <p className="text-xs text-gray-500 uppercase tracking-widest font-bold">Cliente</p>
                      <button onClick={() => setIsEditingClient(!isEditingClient)} className="text-xs text-primary hover:text-white transition-colors">
                        {isEditingClient ? 'Cancelar' : '✏️ Editar'}
                      </button>
                    </div>
                    
                    {isEditingClient ? (
                      <div className="space-y-2 mt-2">
                        <select value={editClientData.tipo_documento} onChange={(e) => setEditClientData({...editClientData, tipo_documento: e.target.value})} className="w-full bg-[#111] border border-gray-700 rounded-lg px-3 py-2 text-sm text-white focus:border-primary outline-none">
                          <option value="orden_compra">Orden de Compra</option>
                          <option value="boleta">Boleta Electrónica</option>
                          <option value="factura">Factura Electrónica</option>
                          <option value="guia_despacho">Guía de Despacho</option>
                        </select>
                        <input type="text" placeholder="Nombre / Razón Social" value={editClientData.cliente} onChange={(e) => setEditClientData({...editClientData, cliente: e.target.value})} className="w-full bg-[#111] border border-gray-700 rounded-lg px-3 py-2 text-sm text-white focus:border-primary outline-none" />
                        
                        {(editClientData.tipo_documento === 'factura' || editClientData.tipo_documento === 'guia_despacho') && (
                          <>
                            <input type="text" placeholder="RUT (ej: 12.345.678-9)" value={editClientData.rut} onChange={(e) => setEditClientData({...editClientData, rut: e.target.value})} className="w-full bg-[#111] border border-gray-700 rounded-lg px-3 py-2 text-sm text-white focus:border-primary outline-none" />
                            <input type="text" placeholder="Giro" value={editClientData.giro} onChange={(e) => setEditClientData({...editClientData, giro: e.target.value})} className="w-full bg-[#111] border border-gray-700 rounded-lg px-3 py-2 text-sm text-white focus:border-primary outline-none" />
                          </>
                        )}
                        
                        <input type="text" placeholder="Teléfono" value={editClientData.telefono} onChange={(e) => setEditClientData({...editClientData, telefono: e.target.value})} className="w-full bg-[#111] border border-gray-700 rounded-lg px-3 py-2 text-sm text-white focus:border-primary outline-none" />
                        <input type="text" placeholder="Dirección" value={editClientData.direccion} onChange={(e) => setEditClientData({...editClientData, direccion: e.target.value})} className="w-full bg-[#111] border border-gray-700 rounded-lg px-3 py-2 text-sm text-white focus:border-primary outline-none" />
                        
                        <button onClick={handleSaveClientData} className="w-full bg-primary hover:bg-fuchsia-600 text-white font-bold py-2 rounded-lg text-sm mt-2 transition-colors">Guardar Datos</button>
                      </div>
                    ) : (
                      <>
                        <p className="text-lg text-white font-bold">{selectedOrder.cliente}</p>
                        {selectedOrder.facturacion?.rut && <p className="text-sm text-gray-400">RUT: {selectedOrder.facturacion.rut}</p>}
                        {selectedOrder.facturacion?.giro && <p className="text-sm text-gray-400">Giro: {selectedOrder.facturacion.giro}</p>}
                        <p className="text-sm text-gray-400">📞 {selectedOrder.telefono}</p>
                        <div className="mt-2 inline-block px-2 py-1 bg-gray-800 rounded text-[10px] font-bold text-gray-300 uppercase tracking-widest border border-gray-700">
                          📄 {selectedOrder.facturacion?.tipo_documento?.replace('_', ' ') || 'ORDEN DE COMPRA'}
                        </div>
                      </>
                    )}
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-500 uppercase tracking-widest mb-1 font-bold">Orden / Fecha</p>
                    <p className="text-white font-bold">{selectedOrder.id}</p>
                    <p className="text-sm text-gray-400 mb-2">{selectedOrder.fecha}</p>
                    <span className="inline-block px-3 py-1 rounded bg-white/10 text-white text-[11px] font-bold uppercase tracking-widest border border-white/20">
                      💳 PAGO: {selectedOrder.metodo_pago}
                    </span>
                  </div>
                </div>

                <div className="p-4 bg-[#111111] rounded-xl border border-gray-800">
                  <p className="text-xs text-gray-500 uppercase tracking-widest mb-1 font-bold">Dirección de Entrega</p>
                  <p className="text-white font-medium">{selectedOrder.direccion}</p>
                </div>

                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-widest mb-1 font-bold">Detalle de la Compra</p>
                  <div className="p-4 border border-gray-800 rounded-xl bg-[#151515]">
                    <p className="text-white whitespace-pre-wrap">{selectedOrder.detalle}</p>
                    <div className="mt-6 pt-4 border-t border-gray-800 flex justify-between items-center">
                      <span className="font-bold text-gray-400 uppercase">Total</span>
                      <span className="text-2xl font-bold text-primary">${selectedOrder.total.toLocaleString('es-CL')}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Módulo de Evidencia Fotográfica */}
              <div className="print:hidden border border-gray-800 rounded-2xl p-4 bg-[#111111]">
                <p className="text-xs text-gray-500 uppercase tracking-widest mb-4 font-bold flex items-center gap-2">
                  <span>📸</span> Evidencia Fotográfica
                </p>
                <div className="grid grid-cols-2 gap-4">
                  
                  {/* Flujo Normal */}
                  {!selectedOrder.esCementerio && (
                    <>
                      <div className="border border-dashed border-gray-700 rounded-xl p-4 flex flex-col items-center justify-center text-center gap-3">
                        {selectedOrder.evidencia?.producto ? (
                          <div className="relative w-full aspect-square rounded-lg overflow-hidden border border-gray-600">
                            <img src={selectedOrder.evidencia.producto} className="w-full h-full object-cover" alt="Producto Terminado" />
                            <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                              <span className="text-white text-xs font-bold">✓ Producto</span>
                            </div>
                          </div>
                        ) : (
                          <>
                            <span className="text-2xl">💐</span>
                            <p className="text-xs text-gray-400 font-medium">Producto Terminado</p>
                            <button disabled={!canManageOrders} onClick={() => handleUploadEvidence('producto')} className="text-xs bg-gray-800 text-white px-3 py-1.5 rounded-lg font-bold hover:bg-gray-700 disabled:opacity-50">Adjuntar Foto</button>
                          </>
                        )}
                      </div>

                      <div className="border border-dashed border-gray-700 rounded-xl p-4 flex flex-col items-center justify-center text-center gap-3">
                        {selectedOrder.evidencia?.entrega ? (
                          <div className="relative w-full aspect-square rounded-lg overflow-hidden border border-gray-600">
                            <img src={selectedOrder.evidencia.entrega} className="w-full h-full object-cover" alt="Foto Entrega" />
                            <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                              <span className="text-white text-xs font-bold">✓ Entrega</span>
                            </div>
                          </div>
                        ) : (
                          <>
                            <span className="text-2xl">🚚</span>
                            <p className="text-xs text-gray-400 font-medium">Foto de Entrega</p>
                            <button disabled={!canManageOrders} onClick={() => handleUploadEvidence('entrega')} className="text-xs bg-gray-800 text-white px-3 py-1.5 rounded-lg font-bold hover:bg-gray-700 disabled:opacity-50">Adjuntar Foto</button>
                          </>
                        )}
                      </div>
                    </>
                  )}

                  {/* Flujo Cementerio */}
                  {selectedOrder.esCementerio && (
                    <>
                      <div className="border border-dashed border-gray-700 rounded-xl p-4 flex flex-col items-center justify-center text-center gap-3">
                        {selectedOrder.evidencia?.antes ? (
                          <div className="relative w-full aspect-square rounded-lg overflow-hidden border border-gray-600">
                            <img src={selectedOrder.evidencia.antes} className="w-full h-full object-cover" alt="Antes" />
                            <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                              <span className="text-white text-xs font-bold">✓ Antes</span>
                            </div>
                          </div>
                        ) : (
                          <>
                            <span className="text-2xl">🍂</span>
                            <p className="text-xs text-gray-400 font-medium">Lápida (Antes)</p>
                            <button disabled={!canManageOrders} onClick={() => handleUploadEvidence('antes')} className="text-xs bg-gray-800 text-white px-3 py-1.5 rounded-lg font-bold hover:bg-gray-700 disabled:opacity-50">Adjuntar Foto</button>
                          </>
                        )}
                      </div>

                      <div className="border border-dashed border-gray-700 rounded-xl p-4 flex flex-col items-center justify-center text-center gap-3">
                        {selectedOrder.evidencia?.despues ? (
                          <div className="relative w-full aspect-square rounded-lg overflow-hidden border border-gray-600">
                            <img src={selectedOrder.evidencia.despues} className="w-full h-full object-cover" alt="Después" />
                            <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                              <span className="text-white text-xs font-bold">✓ Después</span>
                            </div>
                          </div>
                        ) : (
                          <>
                            <span className="text-2xl">🌸</span>
                            <p className="text-xs text-gray-400 font-medium">Lápida (Después)</p>
                            <button disabled={!canManageOrders} onClick={() => handleUploadEvidence('despues')} className="text-xs bg-gray-800 text-white px-3 py-1.5 rounded-lg font-bold hover:bg-gray-700 disabled:opacity-50">Adjuntar Foto</button>
                          </>
                        )}
                      </div>
                    </>
                  )}

                </div>
              </div>

              {/* Módulo de Dedicatoria */}
              {selectedOrder.dbData?.detalles?.dedicatoria && (
                <div className="print:hidden border border-gray-800 rounded-2xl p-4 bg-[#111111] mx-8 mb-6 mt-6 relative overflow-hidden">
                  <div className="absolute right-0 top-0 p-4 opacity-5">
                    <span className="text-8xl">💌</span>
                  </div>
                  <div className="relative z-10">
                    <div className="flex justify-between items-center mb-3">
                      <p className="text-xs text-gray-500 uppercase tracking-widest font-bold flex items-center gap-2">
                        <span>💌</span> Mensaje de Dedicatoria
                      </p>
                      <button 
                        onClick={() => navigator.clipboard.writeText(selectedOrder.dbData.detalles.dedicatoria)}
                        className="text-xs font-bold bg-white/5 hover:bg-white/10 text-white px-3 py-1.5 rounded-lg transition-colors border border-white/10"
                      >
                        Copiar Texto
                      </button>
                    </div>
                    <p className="text-white whitespace-pre-wrap font-serif text-lg leading-relaxed bg-gray-900/50 p-4 rounded-xl border border-gray-800">
                      "{selectedOrder.dbData.detalles.dedicatoria}"
                    </p>
                    <p className="text-xs text-gray-500 mt-3 font-medium flex items-center gap-1">
                      💡 Copia este mensaje para pegarlo en Canva y generar la tarjeta final para el cliente.
                    </p>
                  </div>
                </div>
              )}

              {/* Botonera de Acción - Oculta en impresión */}
              <div className="print:hidden pt-4 px-8 pb-8">
                <p className="text-xs text-gray-500 uppercase tracking-widest mb-3 font-bold">Actualizar Estado</p>
                <div className="flex flex-wrap items-center gap-2 mb-6">
                  {['PENDIENTE_PAGO', 'PREPARANDO', 'EN_RUTA', 'COMPLETADO'].map(status => {
                    const isSelected = (stagedStatus || selectedOrder.estado) === status;
                    return (
                      <button 
                        key={status}
                        disabled={!canManageOrders}
                        onClick={() => setStagedStatus(status)}
                        className={`px-4 py-2 rounded-lg text-xs font-bold transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
                          isSelected 
                            ? 'bg-primary/20 text-white border border-primary' 
                            : 'bg-[#111111] text-gray-400 border border-gray-800 hover:border-gray-500'
                        }`}
                      >
                        {status}
                      </button>
                    );
                  })}
                  
                  <button
                    disabled={!canManageOrders || !stagedStatus || stagedStatus === selectedOrder.estado}
                    onClick={handleUpdateStatus}
                    className="ml-2 px-6 py-2 rounded-lg text-xs font-black transition-all bg-green-500 hover:bg-green-400 text-white shadow-lg shadow-green-500/30 disabled:opacity-30 disabled:cursor-not-allowed disabled:shadow-none"
                  >
                    ✓ OK
                  </button>

                  {!canManageOrders && (
                    <span className="text-xs text-red-500 flex items-center ml-2">🔒 Permiso denegado</span>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <button onClick={handleWhatsApp} className="bg-green-600 hover:bg-green-500 text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 transition-colors">
                    💬 Notificar WhatsApp
                  </button>
                  <button onClick={() => handlePrint('orden')} className="bg-white text-black hover:bg-gray-200 font-bold py-3 rounded-xl flex items-center justify-center gap-2 transition-colors">
                    🖨️ Imprimir Orden
                  </button>
                  {tarjetaDigital && (
                    <button onClick={() => handlePrint('tarjeta')} className="col-span-2 bg-purple-600 hover:bg-purple-500 text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 transition-colors">
                      🌸 Imprimir Tarjeta Física
                    </button>
                  )}
                </div>
              </div>
              
            </div>
            {/* FIN VISTA DIGITAL */}

          </div>
        </div>
      )}

      {/* Camera Capture Modal */}
      {activeCameraType && (
        <CameraCapture 
          onCapture={handleCameraCapture} 
          onCancel={() => setActiveCameraType(null)} 
        />
      )}

    </div>
  );
}
