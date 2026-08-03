'use client';
import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { CheckCircle2, MessageCircle, Home, MapPin, Truck, Calendar, CreditCard, Gift, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { createClient } from '@/utils/supabase/client';

function CheckoutExitoContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [orderId, setOrderId] = useState<string | null>(null);
  const [orderData, setOrderData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const order = searchParams.get('order');
    if (order) {
      setOrderId(order);
      fetchOrder(order);
    } else {
      setLoading(false);
    }
  }, [searchParams]);

  const fetchOrder = async (id: string) => {
    try {
      const supabase = createClient();
      const { data, error } = await supabase
        .from('pedidos')
        .select('*')
        .eq('codigo_orden', id)
        .single();
        
      if (!error && data) {
        setOrderData(data);
      }
    } catch (e) {
      console.error('Error fetching order:', e);
    } finally {
      setLoading(false);
    }
  };

  const formatCLP = (amount: number) => {
    return new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP' }).format(amount || 0);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FDFBF7] flex items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FDFBF7] pt-24 pb-24 flex items-center justify-center font-sans">
      <div className="container mx-auto px-4 max-w-2xl">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 200, damping: 20 }}
          className="bg-white p-8 md:p-12 rounded-[2.5rem] shadow-[0_8px_30px_rgb(0,0,0,0.08)] border border-gray-100"
        >
          <div className="text-center border-b border-gray-100 pb-8 mb-8">
            <div className="w-20 h-20 bg-green-100 text-green-500 rounded-full flex items-center justify-center mx-auto mb-5 shadow-sm">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h2 className="text-3xl font-black text-gray-900 mb-2 tracking-tight">¡Pago Exitoso!</h2>
            <p className="text-gray-500 mb-4">
              Hemos recibido tu pago y estamos preparando tu pedido.
            </p>
            {orderId && (
              <div className="inline-block bg-gray-50 border border-gray-200 px-6 py-2 rounded-xl text-gray-700 font-bold text-lg">
                Orden N°: {orderId}
              </div>
            )}
          </div>

          {orderData && (
            <div className="space-y-8">
              {/* Resumen de Productos */}
              <section>
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Gift className="w-5 h-5 text-gray-400" /> Detalle de Compra
                </h3>
                <div className="bg-gray-50 rounded-2xl p-5 border border-gray-100 space-y-3">
                  {orderData.detalles?.items?.map((item: any, idx: number) => (
                    <div key={idx} className="flex justify-between items-center text-sm">
                      <div>
                        <span className="font-bold text-gray-900">{item.cantidad}x</span> 
                        <span className="text-gray-700 ml-2">{item.nombre}</span>
                      </div>
                      <span className="font-medium text-gray-900">{formatCLP(item.precio * item.cantidad)}</span>
                    </div>
                  ))}
                  
                  <div className="pt-3 border-t border-gray-200 mt-3 space-y-2 text-sm text-gray-500">
                    <div className="flex justify-between">
                      <span>Despacho</span>
                      <span>{orderData.detalles?.envio === 0 ? 'Gratis' : formatCLP(orderData.detalles?.envio)}</span>
                    </div>
                    {orderData.detalles?.recargo_nocturno > 0 && (
                      <div className="flex justify-between text-indigo-600">
                        <span>Recargo Nocturno</span>
                        <span>{formatCLP(orderData.detalles?.recargo_nocturno)}</span>
                      </div>
                    )}
                    {orderData.detalles?.descuento_puntos > 0 && (
                      <div className="flex justify-between text-fuchsia-600">
                        <span>Descuento VIP</span>
                        <span>-{formatCLP(orderData.detalles?.descuento_puntos)}</span>
                      </div>
                    )}
                  </div>
                  
                  <div className="pt-3 border-t border-gray-200 mt-3 flex justify-between items-center">
                    <span className="font-bold text-gray-900">Total Pagado</span>
                    <span className="text-xl font-black text-gray-900">{formatCLP(orderData.total)}</span>
                  </div>
                </div>
              </section>

              {/* Info de Despacho */}
              <section>
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Truck className="w-5 h-5 text-gray-400" /> Información de Despacho
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {orderData.tipo_entrega === 'domicilio' ? (
                    <>
                      <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100 flex items-start gap-3">
                        <MapPin className="w-5 h-5 text-gray-400 mt-0.5" />
                        <div>
                          <p className="text-xs text-gray-500 mb-0.5 font-medium">Dirección</p>
                          <p className="text-sm font-semibold text-gray-900">{orderData.detalles?.direccion_completa}</p>
                          <p className="text-xs text-gray-600 mt-1">Recibe: {orderData.detalles?.destinatario}</p>
                          {orderData.detalles?.telefono_contacto && <p className="text-xs text-gray-600">Tel: {orderData.detalles?.telefono_contacto}</p>}
                        </div>
                      </div>
                      <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100 flex items-start gap-3">
                        <Calendar className="w-5 h-5 text-gray-400 mt-0.5" />
                        <div>
                          <p className="text-xs text-gray-500 mb-0.5 font-medium">Fecha de Entrega</p>
                          <p className="text-sm font-semibold text-gray-900">{orderData.detalles?.fecha_entrega}</p>
                          <p className="text-xs text-gray-600 mt-1">{orderData.detalles?.jornada_entrega}</p>
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100 flex items-start gap-3 col-span-1 md:col-span-2">
                      <MapPin className="w-5 h-5 text-gray-400 mt-0.5" />
                      <div>
                        <p className="text-xs text-gray-500 mb-0.5 font-medium">Cementerio</p>
                        <p className="text-sm font-semibold text-gray-900">{orderData.detalles?.cementerio?.recinto}</p>
                        <p className="text-xs text-gray-600 mt-1">Difunto: {orderData.detalles?.cementerio?.difunto_nombre}</p>
                        {orderData.detalles?.cementerio?.sector && <p className="text-xs text-gray-600">Sector/Lápida: {orderData.detalles?.cementerio?.sector}</p>}
                      </div>
                    </div>
                  )}
                </div>
              </section>

              {/* Dedicatoria (si existe) */}
              {orderData.detalles?.dedicatoria && (
                <section className="bg-fuchsia-50/50 rounded-2xl p-5 border border-fuchsia-100">
                  <p className="text-xs font-bold text-fuchsia-600 mb-2 uppercase tracking-wide">Mensaje en la Tarjeta</p>
                  <p className="text-sm text-gray-800 italic">"{orderData.detalles?.dedicatoria}"</p>
                </section>
              )}
            </div>
          )}

          <div className="mt-10 pt-8 border-t border-gray-100 space-y-3">
            <button 
              onClick={() => router.push('/')}
              className="w-full bg-black text-white font-bold py-4 rounded-2xl hover:bg-gray-900 transition-all flex items-center justify-center gap-2 shadow-lg hover:shadow-xl hover:-translate-y-0.5"
            >
              <Home className="w-5 h-5" />
              Volver a la tienda
            </button>
            <a 
              href={`https://wa.me/56979992848?text=${encodeURIComponent(`Hola Chileflor, acabo de completar el pago de mi orden ${orderId}.`)}`}
              target="_blank"
              rel="noreferrer"
              className="w-full bg-white text-gray-700 font-bold py-4 rounded-2xl border-2 border-gray-200 hover:border-green-500 hover:text-green-600 transition-all flex items-center justify-center gap-2"
            >
              <MessageCircle className="w-5 h-5" />
              Avisar por WhatsApp
            </a>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default function CheckoutExitoPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#FDFBF7] flex items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
      </div>
    }>
      <CheckoutExitoContent />
    </Suspense>
  );
}
