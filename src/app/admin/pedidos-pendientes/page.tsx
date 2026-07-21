'use client';
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase/client';

export default function PedidosPendientesPage() {
  const [pedidos, setPedidos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // States for actions
  const [paymentMethods, setPaymentMethods] = useState<Record<string, string>>({});
  const [notes, setNotes] = useState<Record<string, string>>({});
  const [processing, setProcessing] = useState<string | null>(null);

  useEffect(() => {
    fetchPedidos();
  }, []);

  async function fetchPedidos() {
    try {
      const { data, error } = await supabase
        .from('pedidos')
        .select('*')
        .eq('estado', 'pending_payment')
        .order('created_at', { ascending: false });

      if (data) {
        setPedidos(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  const handleMarkAsPaid = async (orderId: string) => {
    setProcessing(orderId);
    try {
      const finalMethod = paymentMethods[orderId] || 'No especificado';
      const orderNotes = notes[orderId] || '';

      const order = pedidos.find(p => p.codigo_orden === orderId);
      const newDetalles = {
        ...(order?.detalles || {}),
        metodo_pago_final: finalMethod,
        notas_pago: orderNotes
      };

      await supabase
        .from('pedidos')
        .update({ 
          estado: 'pagado',
          detalles: newDetalles
        })
        .eq('codigo_orden', orderId);

      // Remove from list
      setPedidos(prev => prev.filter(p => p.codigo_orden !== orderId));
    } catch (e) {
      console.error(e);
      alert('Error al actualizar');
    } finally {
      setProcessing(null);
    }
  };

  const handleSendWA = (order: any) => {
    let message = `¡Hola! Confirmamos que hemos recibido tu pago para el pedido *${order.codigo_orden}* ✅\n\n`;
    message += `Tu pedido ya está en preparación y nos contactaremos contigo el día de la entrega. ¡Gracias por preferir Chileflor! 🌸`;
    
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  if (loading) {
    return <div className="p-8 text-center mt-12 text-gray-500 font-medium">Cargando pedidos pendientes...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-5xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Gestión de Contingencia</h1>
          <p className="text-gray-500">Pedidos pendientes de confirmación de pago manual.</p>
        </div>
        
        {pedidos.length === 0 ? (
          <div className="bg-white p-12 rounded-2xl shadow-sm border border-gray-100 text-center flex flex-col items-center justify-center gap-4">
            <span className="text-5xl opacity-50">🎉</span>
            <div>
              <h3 className="text-lg font-bold text-gray-900">¡Todo al día!</h3>
              <p className="text-gray-500">No hay pedidos pendientes de pago manual en este momento.</p>
            </div>
          </div>
        ) : (
          <div className="grid gap-6">
            {pedidos.map(order => (
              <div key={order.codigo_orden} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col md:flex-row gap-6">
                <div className="flex-1 space-y-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                        {order.codigo_orden}
                      </h2>
                      <p className="text-sm text-gray-500">{new Date(order.created_at).toLocaleString('es-CL')}</p>
                    </div>
                    <span className="bg-orange-100 text-orange-800 text-xs font-bold px-3 py-1 rounded-full border border-orange-200">
                      Pendiente
                    </span>
                  </div>
                  
                  <div className="bg-gray-50/80 p-4 rounded-xl text-sm border border-gray-100 space-y-3">
                    <div className="flex justify-between items-center pb-2 border-b border-gray-200">
                      <span className="text-gray-500">Total a recaudar:</span>
                      <span className="font-bold text-lg text-gray-900">${order.total?.toLocaleString('es-CL')}</span>
                    </div>
                    <div className="grid grid-cols-2 gap-2 pt-1">
                      <div>
                        <span className="block text-xs text-gray-400 uppercase tracking-wider">Preferencia de Cliente</span>
                        <span className="font-medium text-gray-800 capitalize">{order.detalles?.pago_preferido || 'No informada'}</span>
                      </div>
                      <div>
                        <span className="block text-xs text-gray-400 uppercase tracking-wider">Tipo Entrega</span>
                        <span className="font-medium text-gray-800 capitalize">{order.tipo_entrega}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex-1 space-y-4 md:border-l border-gray-100 md:pl-6 flex flex-col justify-between">
                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">Medio de Pago Final Confirmado</label>
                      <select 
                        className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none bg-white transition-all"
                        value={paymentMethods[order.codigo_orden] || ''}
                        onChange={e => setPaymentMethods(prev => ({ ...prev, [order.codigo_orden]: e.target.value }))}
                      >
                        <option value="">Seleccionar...</option>
                        <option value="Transferencia">Transferencia Bancaria</option>
                        <option value="MercadoPago">Link MercadoPago</option>
                        <option value="Transbank">Link Transbank (RedCompra)</option>
                        <option value="Efectivo">Efectivo contra entrega</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">Notas Internas / ID de Transacción</label>
                      <input 
                        type="text" 
                        placeholder="Ej: Trx #45920392, Pagó $30.000, etc."
                        className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                        value={notes[order.codigo_orden] || ''}
                        onChange={e => setNotes(prev => ({ ...prev, [order.codigo_orden]: e.target.value }))}
                      />
                    </div>
                  </div>

                  <div className="flex gap-3 pt-2">
                    <button 
                      onClick={() => handleMarkAsPaid(order.codigo_orden)}
                      disabled={processing === order.codigo_orden}
                      className="flex-1 bg-gray-900 hover:bg-black text-white text-sm font-bold py-3 px-4 rounded-xl transition-all shadow-md shadow-gray-900/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      {processing === order.codigo_orden ? (
                        'Procesando...'
                      ) : (
                        <>
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                          Marcar Pagado
                        </>
                      )}
                    </button>
                    <button 
                      onClick={() => handleSendWA(order)}
                      title="Abrir WhatsApp para confirmar al cliente"
                      className="bg-[#25D366] hover:bg-[#128C7E] text-white py-3 px-4 rounded-xl transition-all shadow-md shadow-[#25D366]/20 flex items-center justify-center flex-shrink-0"
                    >
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}


