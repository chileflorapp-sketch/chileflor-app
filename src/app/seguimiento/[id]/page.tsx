'use client';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { supabase } from '@/lib/supabase/client';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { CheckCircle2, Gift, Truck, MapPin, PartyPopper, Loader2 } from 'lucide-react';

const timelineSteps = [
  { id: 'paid', label: 'Pedido Confirmado', icon: CheckCircle2, description: 'Tu pago ha sido verificado exitosamente.' },
  { id: 'preparando', label: 'Preparando tu Bouquet', icon: Gift, description: 'Nuestros floristas están armando tu arreglo con cariño.' },
  { id: 'en_reparto', label: 'En Camino', icon: Truck, description: 'Tu pedido salió de nuestra tienda.' },
  { id: 'cerca', label: 'Cerca de tu Destino', icon: MapPin, description: 'El repartidor está muy cerca de la dirección.' },
  { id: 'entregado', label: '¡Entregado!', icon: PartyPopper, description: '¡El pedido ha llegado a su destino!' },
];

export default function SeguimientoPage() {
  const params = useParams();
  const orderId = params.id as string;
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchOrder = async () => {
    try {
      const { data } = await supabase
        .from('pedidos')
        .select('*')
        .eq('codigo_orden', orderId)
        .single();
      
      if (data) setOrder(data);
    } catch (error) {
      console.error('Error fetching order:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrder();
    const interval = setInterval(fetchOrder, 30000); // Auto-refresh cada 30s
    return () => clearInterval(interval);
  }, [orderId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <Loader2 className="w-10 h-10 text-primary animate-spin" />
        </main>
        <Footer />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-white flex flex-col">
        <Header />
        <main className="flex-1 flex flex-col items-center justify-center p-4">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Pedido no encontrado</h1>
          <p className="text-gray-500">Revisa el código de seguimiento e intenta nuevamente.</p>
        </main>
        <Footer />
      </div>
    );
  }

  // Mapear estados alternativos
  const normalizeEstado = (estado: string) => {
    if (estado === 'pagado') return 'paid';
    return estado;
  };

  const currentStatus = normalizeEstado(order.estado);
  const currentStatusIndex = timelineSteps.findIndex(step => step.id === currentStatus);

  return (
    <div className="min-h-screen bg-[#FDFBF7] flex flex-col text-gray-800 font-sans">
      <Header />
      
      <main className="flex-1 max-w-2xl mx-auto w-full p-6 sm:p-8 pt-28">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="w-16 h-16 bg-primary/10 text-primary rounded-full flex items-center justify-center mx-auto mb-4">
            <Truck className="w-8 h-8" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Seguimiento de Pedido</h1>
          <p className="text-lg text-gray-500">Orden <strong className="text-primary">#{order.codigo_orden}</strong></p>
        </div>

        {/* Detalles */}
        <div className="bg-white rounded-2xl p-6 mb-8 border border-gray-100 shadow-sm">
          <div className="flex flex-col gap-4">
            <div>
              <p className="text-sm text-gray-500 font-medium">📍 Dirección de Entrega</p>
              <p className="text-gray-900 font-medium mt-1">
                {order.detalles?.direccion_completa || 'Dirección registrada en el pedido'}
              </p>
            </div>
            {order.detalles?.fecha_entrega && (
              <div>
                <p className="text-sm text-gray-500 font-medium">📅 Fecha Programada</p>
                <p className="text-gray-900 font-medium mt-1">{order.detalles.fecha_entrega} ({order.detalles.jornada_entrega || 'Jornada completa'})</p>
              </div>
            )}
            {order.detalles?.destinatario && (
              <div>
                <p className="text-sm text-gray-500 font-medium">👤 Destinatario</p>
                <p className="text-gray-900 font-medium mt-1">{order.detalles.destinatario}</p>
              </div>
            )}
          </div>
        </div>

        {/* Timeline */}
        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-gray-100 shadow-sm">
          <h2 className="font-bold text-lg text-gray-900 mb-6">Estado del Pedido</h2>
          
          <div className="relative pl-4 sm:pl-6">
            {/* Connecting line */}
            <div className="absolute left-[23px] sm:left-[27px] top-6 bottom-6 w-0.5 bg-gray-200"></div>
            
            <div className="space-y-8">
              {timelineSteps.map((step, index) => {
                const isCompleted = currentStatusIndex > index;
                const isCurrent = currentStatusIndex === index;
                const isFuture = currentStatusIndex < index;
                
                const Icon = step.icon;

                return (
                  <div key={step.id} className="relative flex items-start gap-5">
                    {/* Circle */}
                    <div className={`relative z-10 flex items-center justify-center w-12 h-12 rounded-full border-[3px] transition-all duration-500 shrink-0
                      ${isCompleted ? 'border-green-500 bg-green-50 text-green-600' : ''}
                      ${isCurrent ? 'border-primary bg-primary/5 text-primary shadow-lg shadow-primary/20' : ''}
                      ${isFuture ? 'border-gray-200 bg-gray-50 text-gray-300' : ''}
                    `}>
                      {isCurrent && (
                        <span className="absolute inset-0 rounded-full border-[3px] border-primary animate-ping opacity-30" />
                      )}
                      <Icon className="w-5 h-5" />
                    </div>
                    
                    {/* Text */}
                    <div className="flex-1 pt-2">
                      <h3 className={`font-bold text-base transition-colors
                        ${isCompleted ? 'text-green-700' : ''}
                        ${isCurrent ? 'text-primary' : ''}
                        ${isFuture ? 'text-gray-400' : ''}
                      `}>
                        {step.label}
                      </h3>
                      <p className={`text-sm mt-0.5 transition-colors
                        ${isCompleted ? 'text-green-600/70' : ''}
                        ${isCurrent ? 'text-gray-600' : ''}
                        ${isFuture ? 'text-gray-300' : ''}
                      `}>
                        {step.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          
          {/* Auto-refresh indicator */}
          <p className="text-center text-xs text-gray-400 mt-8 flex items-center justify-center gap-1">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
            </span>
            Se actualiza automáticamente cada 30 segundos
          </p>
        </div>
      </main>

      <Footer />
    </div>
  );
}
