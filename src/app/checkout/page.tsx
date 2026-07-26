'use client';
import { useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import { useCart } from '@/context/CartContext';
import { ShoppingCart, MapPin, Truck, CreditCard, ShieldCheck, User, Calendar, Loader2, ArrowRight } from 'lucide-react';
import { useClub } from '@/hooks/useClub';

export default function CheckoutPage() {
  const { items, cartTotal, cartCount, clearCart, updateQuantity, removeFromCart } = useCart();
  const { points: clubPoints, tier, earningRate } = useClub();
  
  const [deliveryType, setDeliveryType] = useState('domicilio');
  const [isNightService, setIsNightService] = useState(false);
  const [usePoints, setUsePoints] = useState(false);
  const [loading, setLoading] = useState(false);
  const [comuna, setComuna] = useState('');
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('mercadopago');
  const [orderGenerated, setOrderGenerated] = useState<string | null>(null);
  
  // Entrega
  const [deliveryDate, setDeliveryDate] = useState('');
  const [deliveryTime, setDeliveryTime] = useState('Mañana (09:00 - 13:00)');
  
  // Datos Generales
  const [telefono, setTelefono] = useState('');
  const [indicaciones, setIndicaciones] = useState('');

  // Autocomplete Domicilio
  const [addressInput, setAddressInput] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const ADDRESS_SUGGESTIONS = [
    "Las Malvas 1851, La Florida",
    "Las Malvas 1832, La Florida",
    "Av. Camilo Henríquez 4673, Puente Alto",
    "Av. La Florida esquina Walker Martinez, La Florida",
    "Av. Vicuña Mackenna, La Florida",
    "Av. Diego Portales, Puente Alto",
    "Av. Providencia, Providencia",
    "Av. Apoquindo, Las Condes"
  ];
  const filteredSuggestions = ADDRESS_SUGGESTIONS.filter(s => s.toLowerCase().includes(addressInput.toLowerCase()) && addressInput.length > 2);
  
  // Cementerio
  const [cemeteryName, setCemeteryName] = useState('Parque El Prado');
  const [cemeterySector, setCemeterySector] = useState('');
  const [cemeteryLapida, setCemeteryLapida] = useState('');
  const [cemeteryObs, setCemeteryObs] = useState('');
  const [deceasedName, setDeceasedName] = useState('');
  const [deceasedDob, setDeceasedDob] = useState('');
  const [deceasedDod, setDeceasedDod] = useState('');
  const [deceasedRut, setDeceasedRut] = useState('');
  
  const subtotal = cartTotal;
  
  const COMUNAS_PRECIOS: Record<string, number> = {
    "La Florida": 0, "Puente Alto": 0,
    "Macul": 3500, "Peñalolén": 3500, "La Granja": 3500, "San Joaquín": 3500, "San Miguel": 3500, "San Ramón": 3500, "La Pintana": 3500, "El Bosque": 3500, "La Cisterna": 3500,
  };

  let deliveryFee = 0;
  if (deliveryType === 'domicilio') {
    if (comuna && COMUNAS_PRECIOS[comuna] !== undefined) {
      deliveryFee = COMUNAS_PRECIOS[comuna];
    } else if (comuna) {
      deliveryFee = 5000;
    }
  }
  const nightSurcharge = (isNightService && deliveryType === 'domicilio') ? subtotal * 0.25 : 0;
  const pointsEarned = Math.floor(subtotal * earningRate);
  const maxUsablePoints = Math.min(clubPoints, Math.floor(subtotal / 2));
  const pointsDiscount = usePoints ? maxUsablePoints : 0;
  const cashSurcharge = selectedPaymentMethod === 'efectivo' ? 2000 : 0;
  
  const total = subtotal + deliveryFee + nightSurcharge - pointsDiscount + cashSurcharge;

  const handleCheckout = async () => {
    // Validaciones
    if (!telefono) {
      alert('Por favor ingresa un teléfono de contacto.');
      return;
    }
    if (deliveryType === 'domicilio' && (!comuna || !addressInput)) {
      alert('Por favor completa la dirección y comuna de entrega.');
      return;
    }
    if (deliveryType === 'domicilio' && !deliveryDate) {
      alert('Por favor selecciona una fecha de entrega.');
      return;
    }
    if (deliveryType === 'cementerio' && (!cemeteryName)) {
      alert('Por favor selecciona un recinto (Cementerio).');
      return;
    }

    setLoading(true);
    const orderId = `ORD-${Date.now().toString().slice(-5)}`;
    
    // Preparar el Payload para guardar en Supabase
    const payload = {
      codigo_orden: orderId,
      total: total,
      tipo_entrega: deliveryType,
      puntos_ganados: pointsEarned,
      puntos_usados: pointsDiscount,
      estado: 'pending_payment',
      metodo_pago: 'whatsapp_link',
      detalles: {
        items: items.map(item => ({ nombre: item.name, cantidad: item.quantity, precio: item.price })),
        envio: deliveryFee,
        descuento_puntos: pointsDiscount,
        recargo_nocturno: nightSurcharge,
        recargo_efectivo: cashSurcharge,
        pago_preferido: selectedPaymentMethod,
        direccion_completa: deliveryType === 'domicilio' ? `${addressInput}, ${comuna}` : null,
        telefono_contacto: telefono,
        indicaciones: indicaciones,
        fecha_entrega: deliveryType === 'domicilio' ? deliveryDate : null,
        jornada_entrega: deliveryType === 'domicilio' ? deliveryTime : null,
        cementerio: deliveryType === 'cementerio' ? {
          recinto: cemeteryName,
          sector: cemeterySector,
          lapida: cemeteryLapida,
          observacion: cemeteryObs,
          difunto_nombre: deceasedName,
          difunto_nac: deceasedDob,
          difunto_def: deceasedDod,
          difunto_rut: deceasedRut
        } : null
      }
    };

    try {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      
      // 1. Guardar el pedido en Supabase / Base de datos
      try {
        if (user) {
          await supabase.from('pedidos').insert([{ ...payload, user_id: user.id }]);
        } else {
          await supabase.from('pedidos').insert([payload]);
        }
      } catch (dbErr) {
        console.warn('Warning al guardar pedido en DB:', dbErr);
      }

      // 2. [DESACTIVADO TEMPORALMENTE] Si eligió Mercado Pago, intentar la pasarela oficial online
      // Se solicitó que por ahora todas las ventas vayan a WhatsApp hasta dominar la integración.
      /*
      if (selectedPaymentMethod === 'mercadopago') {
        try {
          const mpRes = await fetch('/api/checkout', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              items: items,
              orderId: orderId,
              envio: deliveryFee + nightSurcharge + cashSurcharge - pointsDiscount
            })
          });

          const mpData = await mpRes.json();

          if (mpRes.ok && mpData.url) {
            clearCart();
            window.location.href = mpData.url; // Redirigir a la pasarela de Mercado Pago
            return;
          } else {
            console.warn('Mercado Pago Error:', mpData);
            alert(`⚠️ Mercado Pago: ${mpData.error || 'No se pudo generar el link de pago online'}.\n\nSerás redirigido a WhatsApp para coordinar el pago directamente con nuestro equipo.`);
          }
        } catch (mpErr) {
          console.error('Error de red al conectar con Mercado Pago:', mpErr);
        }
      }
      */

      // 3. Flujo por WhatsApp (para Transferencia, Efectivo o Fallback de Mercado Pago)
      const paymentNames: Record<string, string> = {
        transbank: 'Transbank / Red Compra',
        mercadopago: 'Mercado Pago',
        transferencia: 'Transferencia Bancaria',
        efectivo: 'Efectivo contra entrega'
      };

      let message = `Hola Chileflor, confirmo mi pedido #*${orderId}*.\n\n📋 *Detalle:*\n`;
      items.forEach(item => message += `- ${item.name} x ${item.quantity}\n`);
      message += `\n💰 *Total:* $${total.toLocaleString('es-CL')}\n`;
      
      let entregaStr = deliveryType === 'domicilio' 
        ? `Domicilio ${isNightService ? '(Nocturno)' : ''}` 
        : `Cementerio - ${cemeteryName}`;
      let dirStr = deliveryType === 'domicilio' 
        ? `${addressInput}, ${comuna}` 
        : `Sector: ${cemeterySector || 'N/A'}, Lápida: ${cemeteryLapida || 'N/A'}`;
        
      message += `📅 *Entrega:* ${entregaStr}\n`;
      if (deliveryType === 'domicilio' && deliveryDate) {
        message += `📆 *Fecha/Hora:* ${deliveryDate} (${deliveryTime})\n`;
      }
      message += `📍 *Dirección:* ${dirStr}\n\n`;
      
      if (selectedPaymentMethod === 'mercadopago') {
        message += `Me gustaría pagar mediante: *Mercado Pago*. Por favor, solicito me envíen el link de pago. ¡Nos gusta hacer las cosas bien!`;
      } else {
        message += `Me gustaría pagar mediante: *${paymentNames[selectedPaymentMethod]}*.`;
      }
      
      const whatsappUrl = `https://wa.me/56979992848?text=${encodeURIComponent(message)}`;
      window.open(whatsappUrl, '_blank');
      
      setOrderGenerated(orderId);
      setLoading(false);

    } catch (e) {
      console.error('Error al procesar el checkout:', e);
      setLoading(false);
      alert('Tuvimos un inconveniente. Por favor contáctanos por WhatsApp.');
    }
  };

  if (orderGenerated) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-6 text-center">
        <div className="w-20 h-20 bg-green-100 text-green-500 rounded-full flex items-center justify-center mb-6">
          <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
        </div>
        <h2 className="text-3xl font-black mb-4">¡Pedido Generado!</h2>
        <p className="text-gray-600 max-w-md mx-auto mb-8 text-lg">
          Se ha abierto WhatsApp para que nos envíes el detalle de tu pedido. 
          <br/><br/>
          <strong>¿Ya nos enviaste el mensaje?</strong>
        </p>
        <button 
          onClick={() => {
            clearCart();
            window.location.href = `/dedicatoria/${orderGenerated}`;
          }}
          className="bg-primary text-white font-bold py-4 px-10 rounded-2xl hover:bg-primary-dark transition-transform hover:-translate-y-1 shadow-lg shadow-primary/30"
        >
          Sí, ya envié el WhatsApp
        </button>
      </div>
    );
  }

  if (cartCount === 0) {
    return (
      <div className="container mx-auto px-4 py-32 max-w-6xl text-center flex flex-col items-center min-h-[70vh]">
        <ShoppingCart className="w-24 h-24 mb-6 text-gray-200 inline-block" strokeWidth={1} />
        <h1 className="text-4xl font-bold text-gray-900 mb-4 tracking-tight">Tu bolsa está vacía</h1>
        <p className="text-lg text-gray-500 mb-10 max-w-md mx-auto leading-relaxed">Elige un arreglo florarl que exprese tus sentimientos. Siempre hay un buen momento para regalar flores.</p>
        <a href="/catalogo" className="inline-flex items-center gap-2 bg-gray-900 text-white font-medium px-8 py-4 rounded-full shadow-lg hover:bg-gray-800 transition-all hover:scale-105 active:scale-95">
          Explorar Catálogo <ArrowRight className="w-5 h-5" />
        </a>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50/50">
      <div className="container mx-auto px-4 pt-12 pb-24 md:pb-12 max-w-7xl">
        <div className="flex items-center gap-3 mb-10">
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Finalizar Compra</h1>
            <p className="text-gray-500 text-sm mt-1">Checkout seguro y encriptado.</p>
          </div>
        </div>
        
        <div className="flex flex-col lg:flex-row gap-8 xl:gap-12">
          {/* Formularios - Columna Izquierda */}
          <div className="flex-1 space-y-8">
            
            {/* 1. Entrega */}
            <section className="bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-gray-100 relative overflow-hidden group hover:shadow-md transition-shadow">
              <div className="absolute top-0 left-0 w-1 h-full bg-primary/80"></div>
              <div className="flex items-center gap-3 mb-6">
                <span className="w-8 h-8 rounded-full bg-gray-100 text-gray-600 font-bold flex items-center justify-center text-sm">1</span>
                <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                  Destino y Entrega
                </h2>
              </div>
              
              <div className="flex p-1 bg-gray-100/80 rounded-xl mb-8 w-fit">
                <button 
                  onClick={() => setDeliveryType('domicilio')}
                  className={`px-6 py-2.5 text-sm font-semibold rounded-lg transition-all flex items-center gap-2 ${deliveryType === 'domicilio' ? 'bg-white text-gray-900 shadow-sm ring-1 ring-gray-200/50' : 'text-gray-500 hover:text-gray-700'}`}
                >
                  <Truck className="w-4 h-4" /> Domicilio
                </button>
                <button 
                  onClick={() => setDeliveryType('cementerio')}
                  className={`px-6 py-2.5 text-sm font-semibold rounded-lg transition-all flex items-center gap-2 ${deliveryType === 'cementerio' ? 'bg-white text-gray-900 shadow-sm ring-1 ring-gray-200/50' : 'text-gray-500 hover:text-gray-700'}`}
                >
                  <MapPin className="w-4 h-4" /> Cementerio
                </button>
              </div>

              {deliveryType === 'domicilio' ? (
                <div className="space-y-5 animate-in fade-in slide-in-from-bottom-2 duration-300">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="relative">
                      <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 block">Dirección de entrega</label>
                      <input 
                        type="text" 
                        placeholder="Ej: Las Malvas 1851" 
                        className="w-full px-5 py-4 rounded-xl border border-gray-200 bg-gray-50/50 focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all" 
                        value={addressInput}
                        onChange={(e) => {
                          setAddressInput(e.target.value);
                          setShowSuggestions(true);
                        }}
                        onFocus={() => setShowSuggestions(true)}
                        onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                      />
                      {/* Autocomplete */}
                      {showSuggestions && filteredSuggestions.length > 0 && (
                        <div className="absolute z-50 top-full left-0 right-0 mt-2 bg-white border border-gray-100 rounded-xl shadow-xl overflow-hidden">
                          {filteredSuggestions.map((suggestion, idx) => (
                            <button
                              key={idx}
                              className="w-full text-left px-5 py-3 hover:bg-gray-50 border-b border-gray-50 last:border-0 text-sm text-gray-700 transition-colors"
                              onClick={() => {
                                setAddressInput(suggestion);
                                setShowSuggestions(false);
                                if (suggestion.includes("La Florida")) setComuna("La Florida");
                                if (suggestion.includes("Puente Alto")) setComuna("Puente Alto");
                              }}
                            >
                              <MapPin className="w-3.5 h-3.5 inline mr-2 text-primary" /> {suggestion}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 block">Comuna</label>
                      <select 
                        value={comuna}
                        onChange={(e) => setComuna(e.target.value)}
                        className="w-full px-5 py-4 rounded-xl border border-gray-200 bg-gray-50/50 focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all appearance-none"
                      >
                        <option value="">Selecciona Comuna...</option>
                        <option value="La Florida">La Florida (Despacho Gratis)</option>
                        <option value="Puente Alto">Puente Alto (Despacho Gratis)</option>
                        <option value="Providencia">Providencia</option>
                        <option value="Las Condes">Las Condes</option>
                        <option value="Macul">Macul</option>
                        <option value="Ñuñoa">Ñuñoa</option>
                        <option value="Santiago Centro">Santiago Centro</option>
                        <option value="Otra">Resto de Santiago</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-2">
                    <div>
                      <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 block">Fecha requerida</label>
                      <input 
                        type="date" 
                        value={deliveryDate}
                        onChange={(e) => setDeliveryDate(e.target.value)}
                        className="w-full px-5 py-4 rounded-xl border border-gray-200 bg-gray-50/50 focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all" 
                        min={new Date().toISOString().split('T')[0]} 
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 block">Jornada</label>
                      <select 
                        value={deliveryTime}
                        onChange={(e) => setDeliveryTime(e.target.value)}
                        className="w-full px-5 py-4 rounded-xl border border-gray-200 bg-gray-50/50 focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all appearance-none"
                      >
                        <option value="Mañana (09:00 - 13:00)">Mañana (09:00 - 13:00)</option>
                        <option value="Tarde (14:00 - 18:00)">Tarde (14:00 - 18:00)</option>
                      </select>
                    </div>
                  </div>

                  <label className={`mt-4 flex items-start gap-4 p-5 rounded-2xl cursor-pointer border-2 transition-all ${isNightService ? 'border-primary bg-primary/5' : 'border-gray-100 bg-white hover:border-gray-200'}`}>
                    <input 
                      type="checkbox" 
                      className="mt-1 w-5 h-5 text-primary rounded-md border-gray-300 focus:ring-primary/20"
                      checked={isNightService}
                      onChange={(e) => setIsNightService(e.target.checked)}
                    />
                    <div>
                      <p className="font-bold text-gray-900 text-sm">Servicio Especial Nocturno</p>
                      <p className="text-sm text-gray-500 mt-1">Entregas de 20:00 a 23:59 hrs (+25% recargo). Ideal para sorpresas justo a la medianoche.</p>
                    </div>
                  </label>
                </div>
              ) : (
                <div className="space-y-5 animate-in fade-in slide-in-from-bottom-2 duration-300">
                  <div className="p-5 rounded-2xl bg-amber-50 border border-amber-100 flex items-start gap-4 text-amber-900 text-sm">
                    <ShieldCheck className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                    <p>Contamos con acceso a los parques cementerios. Ubicaremos la sepultura con el mayor de los respetos utilizando los datos proporcionados.</p>
                  </div>
                  
                  <div>
                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 block">Recinto</label>
                    <select 
                      className="w-full px-5 py-4 rounded-xl border border-gray-200 bg-gray-50/50 focus:bg-white focus:border-primary outline-none transition-all appearance-none"
                      value={cemeteryName}
                      onChange={(e) => setCemeteryName(e.target.value)}
                    >
                      <option value="Parque El Prado">Cementerio Parque El Prado</option>
                      <option value="Parque Del Recuerdo Cordillera">Cementerio Parque Del Recuerdo Cordillera</option>
                    </select>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                      <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 block">Nombre del difunto</label>
                      <input 
                        type="text" 
                        placeholder="Quien descansa..." 
                        className="w-full px-5 py-4 rounded-xl border border-gray-200 bg-gray-50/50 focus:bg-white focus:border-primary outline-none transition-all" 
                        value={deceasedName}
                        onChange={(e) => setDeceasedName(e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 block">Ubicación física (Si la sabe)</label>
                      <input 
                        type="text" 
                        placeholder="Sector / Lápida" 
                        className="w-full px-5 py-4 rounded-xl border border-gray-200 bg-gray-50/50 focus:bg-white focus:border-primary outline-none transition-all" 
                        value={cemeterySector}
                        onChange={(e) => setCemeterySector(e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              )}
            </section>

            {/* 2. Contacto */}
            <section className="bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-gray-100 relative overflow-hidden group hover:shadow-md transition-shadow">
              <div className="absolute top-0 left-0 w-1 h-full bg-gray-300 group-hover:bg-gray-400 transition-colors"></div>
              <div className="flex items-center gap-3 mb-6">
                <span className="w-8 h-8 rounded-full bg-gray-100 text-gray-600 font-bold flex items-center justify-center text-sm">2</span>
                <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                  Datos de Contacto
                </h2>
              </div>
              
              <div className="space-y-5">
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 block flex items-center gap-2"><User className="w-3.5 h-3.5"/> Teléfono del destinatario</label>
                  <input 
                    type="tel" 
                    placeholder="+56 9 XXXXXXXX" 
                    className="w-full px-5 py-4 rounded-xl border border-gray-200 bg-gray-50/50 focus:bg-white focus:border-gray-400 focus:ring-4 focus:ring-gray-100 outline-none transition-all" 
                    value={telefono}
                    onChange={(e) => setTelefono(e.target.value)}
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 block">Instrucciones Especiales</label>
                  <textarea 
                    rows={3} 
                    placeholder="Ej: Tocar timbre fuerte, dejar en portería, casa esquina de reja azul..." 
                    className="w-full px-5 py-4 rounded-xl border border-gray-200 bg-gray-50/50 focus:bg-white focus:border-gray-400 focus:ring-4 focus:ring-gray-100 outline-none transition-all resize-none"
                    value={indicaciones}
                    onChange={(e) => setIndicaciones(e.target.value)}
                  ></textarea>
                </div>
              </div>
            </section>

            {/* 3. Pago */}
            <section className="bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-gray-100 relative overflow-hidden ring-1 ring-black/5 hover:ring-black/10 transition-shadow">
              <div className="absolute top-0 left-0 w-1 h-full bg-blue-500"></div>
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <span className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 font-bold flex items-center justify-center text-sm">3</span>
                  <h2 className="text-xl font-bold text-gray-900">
                    Medio de Pago Seguro
                  </h2>
                </div>
                <ShieldCheck className="text-blue-500 w-6 h-6" />
              </div>
              
              <div className="space-y-4">
                {/* MercadoPago - Opcion Principal (Premium) */}
                <label className={`relative cursor-pointer flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-5 md:p-6 rounded-2xl border-2 transition-all overflow-hidden ${selectedPaymentMethod === 'mercadopago' ? 'border-[#009EE3] bg-[#009EE3]/5' : 'border-gray-200 hover:border-gray-300'}`}>
                  <input type="radio" name="payment" value="mercadopago" checked={selectedPaymentMethod === 'mercadopago'} onChange={() => setSelectedPaymentMethod('mercadopago')} className="hidden" />
                  
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 bg-white rounded-xl shadow-sm border border-gray-100 flex items-center justify-center flex-shrink-0">
                      <img src="https://logospng.org/download/mercado-pago/logo-mercado-pago-icono-1024.png" alt="Mercado Pago" className="w-8 h-8 object-contain" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <p className="font-bold text-gray-900 text-lg">Mercado Pago</p>
                        <span className="bg-[#009EE3]/10 text-[#009EE3] text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">Recomendado</span>
                      </div>
                      <p className="text-sm text-gray-500">Tarjetas de Crédito, Débito, Redcompra, o Saldo.</p>
                      <div className="flex gap-1.5 mt-2">
                        <img src="https://cdn-icons-png.flaticon.com/512/196/196578.png" className="w-6 h-4 object-contain opacity-70" alt="Visa" />
                        <img src="https://cdn-icons-png.flaticon.com/512/196/196561.png" className="w-6 h-4 object-contain opacity-70" alt="Mastercard" />
                      </div>
                    </div>
                  </div>
                  
                  {selectedPaymentMethod === 'mercadopago' && (
                    <div className="absolute right-4 top-1/2 -translate-y-1/2">
                      <div className="w-6 h-6 rounded-full bg-[#009EE3] flex items-center justify-center text-white">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                      </div>
                    </div>
                  )}
                </label>

                {/* Alternativas */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
                  <label className={`cursor-pointer flex items-center gap-4 p-4 rounded-xl border-2 transition-all ${selectedPaymentMethod === 'transferencia' ? 'border-gray-800 bg-gray-50' : 'border-gray-100 hover:border-gray-200'}`}>
                    <input type="radio" name="payment" value="transferencia" checked={selectedPaymentMethod === 'transferencia'} onChange={() => setSelectedPaymentMethod('transferencia')} className="hidden" />
                    <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <CreditCard className="w-5 h-5 text-gray-600" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900 text-sm">Transferencia</p>
                      <p className="text-xs text-gray-500">Manual vía WhatsApp</p>
                    </div>
                  </label>

                  <label className={`cursor-pointer flex items-center gap-4 p-4 rounded-xl border-2 transition-all ${selectedPaymentMethod === 'efectivo' ? 'border-green-600 bg-green-50' : 'border-gray-100 hover:border-gray-200'}`}>
                    <input type="radio" name="payment" value="efectivo" checked={selectedPaymentMethod === 'efectivo'} onChange={() => setSelectedPaymentMethod('efectivo')} className="hidden" />
                    <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <span className="text-xl">💵</span>
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900 text-sm">Efectivo</p>
                      <p className="text-xs text-gray-500">Contra entrega (+ $2.000)</p>
                    </div>
                  </label>
                </div>
              </div>
            </section>
          </div>

          {/* Resumen - Columna Derecha (Sticky) */}
          <div className="w-full lg:w-[400px] flex-shrink-0">
            <div className="bg-white p-6 rounded-3xl shadow-xl shadow-gray-200/50 border border-gray-100 lg:sticky lg:top-24">
              <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                Resumen de Compra
              </h2>
              
              <div className="flex flex-col gap-4 mb-6 pb-6 border-b border-gray-100 max-h-[300px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gray-200">
                {items.map((item) => (
                  <div key={item.id} className="flex gap-4">
                    <div className="w-16 h-20 bg-gray-50 rounded-lg overflow-hidden flex-shrink-0 border border-gray-100">
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex flex-col flex-grow justify-center">
                      <div className="flex justify-between items-start mb-1">
                        <h3 className="font-semibold text-gray-900 text-sm leading-tight pr-2">{item.name}</h3>
                        <p className="font-bold text-gray-900 text-sm">${(item.price * item.quantity).toLocaleString('es-CL')}</p>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center bg-gray-100 rounded-md h-7 w-20 mt-1">
                          <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="flex-1 text-gray-500 hover:text-gray-700 font-medium">-</button>
                          <span className="flex-1 text-center text-xs font-bold text-gray-900">{item.quantity}</span>
                          <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="flex-1 text-gray-500 hover:text-gray-700 font-medium">+</button>
                        </div>
                        <button onClick={() => removeFromCart(item.id)} className="text-gray-400 hover:text-red-500 text-xs font-medium underline underline-offset-2">Quitar</button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="space-y-3 text-sm text-gray-600 mb-6">
                <div className="flex justify-between">
                  <span>Productos ({cartCount})</span>
                  <span className="font-medium text-gray-900">${subtotal.toLocaleString('es-CL')}</span>
                </div>
                
                <div className="flex justify-between">
                  <span>Despacho</span>
                  <span className="font-medium text-gray-900">
                    {deliveryType === 'domicilio' && !comuna ? 'Por calcular' : 
                     deliveryFee === 0 ? <span className="text-green-600 font-bold bg-green-50 px-2 py-0.5 rounded-md">GRATIS</span> : 
                     `$${deliveryFee.toLocaleString('es-CL')}`}
                  </span>
                </div>
                
                {(isNightService && deliveryType === 'domicilio') && (
                  <div className="flex justify-between text-indigo-600">
                    <span>Servicio Nocturno</span>
                    <span className="font-medium">+${nightSurcharge.toLocaleString('es-CL')}</span>
                  </div>
                )}
                
                {cashSurcharge > 0 && (
                  <div className="flex justify-between text-gray-600">
                    <span>Recargo Efectivo</span>
                    <span className="font-medium">+${cashSurcharge.toLocaleString('es-CL')}</span>
                  </div>
                )}

                {clubPoints > 0 && (
                  <label className="flex items-center justify-between p-3 bg-primary/5 rounded-xl cursor-pointer mt-4 border border-primary/10 transition-colors hover:bg-primary/10">
                    <div className="flex items-center gap-2">
                      <input 
                        type="checkbox" 
                        className="w-4 h-4 text-primary rounded border-primary/30" 
                        checked={usePoints}
                        onChange={(e) => setUsePoints(e.target.checked)}
                      />
                      <span className="text-primary font-medium">Usar {maxUsablePoints.toLocaleString('es-CL')} pts</span>
                    </div>
                    <span className="font-bold text-primary">-${usePoints ? maxUsablePoints.toLocaleString('es-CL') : '0'}</span>
                  </label>
                )}
              </div>

              <div className="border-t border-dashed border-gray-200 pt-4 mb-6">
                <div className="flex justify-between items-end">
                  <div>
                    <p className="text-gray-500 text-sm">Total a pagar</p>
                    {pointsEarned > 0 && <p className="text-[10px] text-primary font-bold mt-1 uppercase tracking-wider">+ {pointsEarned.toLocaleString()} pts Club</p>}
                  </div>
                  <span className="text-3xl font-black text-gray-900">${total.toLocaleString('es-CL')}</span>
                </div>
              </div>

              <button 
                onClick={handleCheckout} 
                disabled={loading}
                className={`w-full font-bold py-4 rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-70 disabled:pointer-events-none text-white
                  ${selectedPaymentMethod === 'mercadopago' ? 'bg-[#009EE3] shadow-[#009EE3]/30' : 'bg-gray-900 shadow-gray-900/20'}`}
              >
                {loading ? (
                  <><Loader2 className="w-5 h-5 animate-spin" /> Procesando pago...</>
                ) : selectedPaymentMethod === 'mercadopago' ? (
                  <>Pagar con Mercado Pago <ArrowRight className="w-5 h-5" /></>
                ) : (
                  <>Confirmar Pedido <ArrowRight className="w-5 h-5" /></>
                )}
              </button>
              
              <div className="flex items-center justify-center gap-2 mt-5 text-gray-400 text-xs">
                <ShieldCheck className="w-4 h-4" />
                <span>Sitio protegido con cifrado SSL de 256-bits.</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
