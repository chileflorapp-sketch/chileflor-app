'use client';
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase/client';
import { useParams } from 'next/navigation';

export default function RepartidorEstadoPage() {
  const params = useParams();
  const orderId = params.id as string;

  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [status, setStatus] = useState<string | null>(null);
  
  // Para reportar problemas
  const [showProblemForm, setShowProblemForm] = useState(false);
  const [problemReason, setProblemReason] = useState('Nadie atiende en el domicilio');
  const [problemNotes, setProblemNotes] = useState('');

  useEffect(() => {
    async function fetchOrder() {
      try {
        const { data, error } = await supabase
          .from('pedidos')
          .select('*')
          .eq('codigo_orden', orderId)
          .single();

        if (data) {
          setOrder(data);
          setStatus(data.estado === 'pagado' ? null : data.estado);
        } else {
          // Fallback visual
          setOrder({
            codigo_orden: orderId,
            tipo_entrega: 'domicilio',
            detalles: {
              cementerio: null
            }
          });
        }
      } catch (err) {
        console.error('Error', err);
      } finally {
        setLoading(false);
      }
    }
    fetchOrder();
  }, [orderId]);

  const handleUpdateStatus = async (newStatus: string) => {
    setUpdating(true);
    try {
      let updatePayload: any = { estado: newStatus };
      if (newStatus === 'problema') {
        updatePayload.observaciones_entrega = `${problemReason} - ${problemNotes}`;
      }
      
      await supabase.from('pedidos').update(updatePayload).eq('codigo_orden', orderId);
      setStatus(newStatus);
      setShowProblemForm(false);
    } catch (e) {
      console.error(e);
      setStatus(newStatus);
    } finally {
      setUpdating(false);
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center">Cargando ruta...</div>;

  return (
    <div className="min-h-screen bg-gray-50/50 py-8 px-4">
      <div className="max-w-md mx-auto bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
        
        {/* Header Repartidor */}
        <div className="bg-primary text-white p-6 flex justify-between items-center">
          <div>
            <h1 className="text-xl font-bold">Gestión de Ruta</h1>
            <p className="text-white/80 text-sm">Entrega: {orderId}</p>
          </div>
          <span className="text-3xl">🛵</span>
        </div>

        <div className="p-6">
          {/* Status Display */}
          {status === 'entregado' && (
            <div className="bg-green-50 border border-green-100 rounded-2xl p-6 text-center mb-6">
              <span className="text-4xl mb-2 block text-green-500">✓</span>
              <h3 className="font-bold text-green-800">¡Entrega Exitosa!</h3>
              <p className="text-sm text-green-600 mt-1">Has finalizado este despacho correctamente.</p>
            </div>
          )}

          {status === 'problema' && (
            <div className="bg-red-50 border border-red-100 rounded-2xl p-6 text-center mb-6">
              <span className="text-4xl mb-2 block text-red-500">⚠️</span>
              <h3 className="font-bold text-red-800">Reporte Enviado</h3>
              <p className="text-sm text-red-600 mt-1">El equipo central revisará el problema con esta entrega.</p>
            </div>
          )}

          {/* Action Buttons (Only if not finalized) */}
          {!status && !showProblemForm && (
            <div className="space-y-4 animate-in fade-in">
              <h3 className="font-bold text-gray-900 text-center mb-4">¿Cuál es el estado actual?</h3>
              
              <button 
                onClick={() => handleUpdateStatus('entregado')}
                disabled={updating}
                className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-5 rounded-2xl transition-all shadow-lg shadow-green-500/30 flex flex-col items-center justify-center gap-1"
              >
                <span className="text-2xl">📦</span>
                <span>Entrega Exitosa</span>
              </button>

              <button 
                onClick={() => setShowProblemForm(true)}
                disabled={updating}
                className="w-full bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold py-4 rounded-2xl transition-all flex flex-col items-center justify-center gap-1"
              >
                <span className="text-xl">⚠️</span>
                <span>Problema con la Entrega</span>
              </button>
            </div>
          )}

          {/* Problem Form */}
          {!status && showProblemForm && (
            <div className="animate-in slide-in-from-bottom-4 duration-300">
              <button onClick={() => setShowProblemForm(false)} className="text-sm text-gray-500 mb-4 hover:text-gray-900 flex items-center gap-1">
                <span>←</span> Volver
              </button>
              
              <h3 className="font-bold text-gray-900 mb-4">Reportar Problema (Ticket)</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Motivo principal</label>
                  <select 
                    value={problemReason}
                    onChange={(e) => setProblemReason(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary outline-none"
                  >
                    <option value="Nadie atiende en el domicilio">Nadie atiende en el domicilio</option>
                    <option value="Dirección incorrecta o no existe">Dirección incorrecta o no existe</option>
                    <option value="Rechazan el pedido">Rechazan el pedido</option>
                    <option value="Lugar inaccesible (Portón cerrado, etc)">Lugar inaccesible (Portón cerrado, etc)</option>
                    <option value="Otro">Otro</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Observaciones</label>
                  <textarea 
                    value={problemNotes}
                    onChange={(e) => setProblemNotes(e.target.value)}
                    rows={3}
                    placeholder="Ej: Toqué el timbre 3 veces y llamé al cliente pero no responde..."
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary outline-none resize-none"
                  ></textarea>
                </div>

                <button 
                  onClick={() => handleUpdateStatus('problema')}
                  disabled={updating || !problemNotes.trim()}
                  className="w-full bg-red-500 hover:bg-red-600 text-white font-bold py-4 rounded-xl transition-all shadow-lg shadow-red-500/30 disabled:opacity-50"
                >
                  {updating ? 'Enviando...' : 'Enviar Reporte al Central'}
                </button>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
