'use client';
import { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';
import { useCart } from '@/context/CartContext';
import { ShoppingCart, MapPin, Truck, CreditCard, ShieldCheck, User, Loader2, ArrowRight, Mail, Gift, Check, ChevronRight, Crown, Handshake } from 'lucide-react';

export default function CheckoutPage() {
  const { items, cartTotal, cartCount, clearCart, updateQuantity, removeFromCart } = useCart();
  
  const [deliveryType, setDeliveryType] = useState('domicilio');
  const [isNightService, setIsNightService] = useState(false);
  const [loading, setLoading] = useState(false);
  const [comuna, setComuna] = useState('');
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('mercadopago');
  const [orderGenerated, setOrderGenerated] = useState<string | null>(null);
  
  // VIP Points
  const [vipEmail, setVipEmail] = useState<string | null>(null);
  const [vipPuntos, setVipPuntos] = useState(0);
  const [usarPuntos, setUsarPuntos] = useState(false);
  const [puntosAplicados, setPuntosAplicados] = useState(0);
  
  // Datos del Comprador
  const [nombreComprador, setNombreComprador] = useState('');
  const [emailComprador, setEmailComprador] = useState('');
  const [recibirNoticias, setRecibirNoticias] = useState(true);

  // Entrega
  const [deliveryDate, setDeliveryDate] = useState('');
  const [deliveryTime, setDeliveryTime] = useState('Mañana (09:00 - 13:00)');
  const [nombreDestinatario, setNombreDestinatario] = useState('');
  const [telefono, setTelefono] = useState('');
  const [indicaciones, setIndicaciones] = useState('');
  
  // Dedicatoria
  const [dedicatoriaMessage, setDedicatoriaMessage] = useState('');

  const AI_PROMPTS = [
    { label: 'Amor ❤️', text: 'Tú eres la flor más hermosa de mi jardín. Te amo infinitamente.' },
    { label: 'Amistad 🤝', text: 'Gracias por estar siempre ahí. ¡Eres increíble!' },
    { label: 'Condolencias 🕊️', text: 'Nuestras más sinceras condolencias. Te acompañamos en este momento difícil.' },
    { label: 'Agradecimiento 🙏', text: 'No hay suficientes flores para agradecerte. ¡Mil gracias por tu apoyo!' },
  ];

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
  
  // Detectar sesión VIP
  useEffect(() => {
    async function checkVIP() {
      try {
        const supabase = createClient();
        const { data: { session } } = await supabase.auth.getSession();
        let email = session?.user?.email;
        if (!email) {
          email = typeof window !== 'undefined' ? localStorage.getItem('vip_customer_email') || undefined : undefined;
        }
        if (email) {
          setVipEmail(email);
          setEmailComprador(email);
          const { data } = await supabase.from('clientes_vip').select('puntos_actuales, full_name').eq('email', email).maybeSingle();
          if (data) {
            setVipPuntos(data.puntos_actuales || 0);
            if (data.full_name) setNombreComprador(data.full_name);
          }
        }
      } catch (e) {
        console.warn('VIP check failed', e);
      }
    }
    checkVIP();
  }, []);
  
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
  const cashSurcharge = selectedPaymentMethod === 'efectivo' ? 2000 : 0;
  
  // Calcular descuento por puntos (1 punto = $10)
  const maxDescuentoPuntos = Math.min(vipPuntos * 10, subtotal); // No puede superar el subtotal
  const descuentoPuntos = usarPuntos ? Math.min(puntosAplicados * 10, maxDescuentoPuntos) : 0;
  
  const total = subtotal + deliveryFee + nightSurcharge + cashSurcharge - descuentoPuntos;

  const handleCheckout = async () => {
    // Validaciones
    if (!nombreComprador || !emailComprador) {
      alert('Por favor ingresa tus datos (Nombre y Email).');
      return;
    }
    if (deliveryType === 'domicilio' && (!comuna || !addressInput || !telefono || !nombreDestinatario)) {
      alert('Por favor completa los datos de entrega (Dirección, Comuna, Nombre y Teléfono del destinatario).');
      return;
    }
    if (deliveryType === 'domicilio' && !deliveryDate) {
      alert('Por favor selecciona una fecha de entrega.');
      return;
    }
    if (deliveryType === 'cementerio' && (!cemeteryName || !deceasedName)) {
      alert('Por favor completa el recinto y nombre del difunto.');
      return;
    }

    setLoading(true);
    const orderId = `ORD-${Date.now().toString().slice(-5)}`;
    
    // Preparar el Payload para guardar en Supabase
    const payload = {
      codigo_orden: orderId,
      total: total,
      tipo_entrega: deliveryType,
      puntos_ganados: Math.floor(total / 1000),
      puntos_usados: usarPuntos ? puntosAplicados : 0,
      estado: 'pending_payment',
      metodo_pago: 'whatsapp_link',
      detalles: {
        items: items.map(item => ({ nombre: item.name, cantidad: item.quantity, precio: item.price })),
        envio: deliveryFee,
        descuento_puntos: descuentoPuntos,
        recargo_nocturno: nightSurcharge,
        recargo_efectivo: cashSurcharge,
        pago_preferido: selectedPaymentMethod,
        comprador: {
          nombre: nombreComprador,
          email: emailComprador,
          suscrito_noticias: recibirNoticias
        },
        direccion_completa: deliveryType === 'domicilio' ? `${addressInput}, ${comuna}` : null,
        destinatario: deliveryType === 'domicilio' ? nombreDestinatario : null,
        telefono_contacto: telefono,
        indicaciones: indicaciones,
        fecha_entrega: deliveryType === 'domicilio' ? deliveryDate : null,
        jornada_entrega: deliveryType === 'domicilio' ? deliveryTime : null,
        dedicatoria: dedicatoriaMessage || null,
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
      
      try {
        if (user) {
          await supabase.from('pedidos').insert([{ ...payload, user_id: user.id }]);
        } else {
          await supabase.from('pedidos').insert([payload]);
        }
      } catch (dbErr) {
        console.warn('Warning al guardar pedido en DB:', dbErr);
      }

      const paymentNames: Record<string, string> = {
        transbank: 'Transbank / Red Compra',
        mercadopago: 'Mercado Pago (Crédito, Débito)',
        flow: 'Pago Online (Flow)',
        transferencia: 'Transferencia Bancaria',
        efectivo: 'Efectivo contra entrega'
      };

      let message = `Hola Chileflor, confirmo mi pedido #*${orderId}*.\n👤 *Comprador:* ${nombreComprador} (${emailComprador})\n\n📋 *Detalle:*\n`;
      items.forEach(item => message += `- ${item.name} x ${item.quantity}\n`);
      message += `\n💰 *Total:* $${total.toLocaleString('es-CL')}\n`;
      
      let entregaStr = deliveryType === 'domicilio' 
        ? `Domicilio ${isNightService ? '(Nocturno)' : ''}` 
        : `Cementerio - ${cemeteryName}`;
      let dirStr = deliveryType === 'domicilio' 
        ? `${addressInput}, ${comuna}\n👤 Recibe: ${nombreDestinatario}` 
        : `Sector: ${cemeterySector || 'N/A'}, Lápida: ${cemeteryLapida || 'N/A'}`;
        
      message += `📅 *Entrega:* ${entregaStr}\n`;
      if (deliveryType === 'domicilio' && deliveryDate) {
        message += `📆 *Fecha/Hora:* ${deliveryDate} (${deliveryTime})\n`;
      }
      message += `📍 *Dirección:* ${dirStr}\n\n`;
      
      if (dedicatoriaMessage) {
        message += `💌 *Dedicatoria:* "${dedicatoriaMessage}"\n\n`;
      }
      
      if (selectedPaymentMethod === 'mercadopago') {
        try {
          const res = await fetch('/api/mercadopago/create', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              orderId,
              total,
              email: emailComprador
            })
          });
          const data = await res.json();
          if (data.url) {
            window.location.href = data.url;
            return;
          } else {
            console.error("Error desde MP API", data);
            alert(`Mercado Pago devolvió un error: ${data.error || 'Error desconocido'}`);
          }
        } catch (error) {
          console.error("Error llamando a API MP", error);
        }
      }

      if (selectedPaymentMethod === 'flow') {
        // Integración con Flow
        try {
          const res = await fetch('/api/flow/create', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              orderId,
              total,
              email: emailComprador
            })
          });
          const data = await res.json();
          if (data.url) {
            window.location.href = data.url;
            return; // Termina la función aquí para que redirija
          } else {
            console.error("Error desde Flow API", data);
            alert(`Flow rechazó el pago: ${data.error || 'Error desconocido'}. Revisa tu cuenta de Flow.`);
          }
        } catch (error) {
          console.error("Error llamando a API Flow", error);
        }
      }

      message += `Me gustaría pagar mediante: *${paymentNames[selectedPaymentMethod] || 'otro medio'}*.`;
      
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
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-6 text-center bg-white">
        <div className="w-24 h-24 bg-black text-white rounded-full flex items-center justify-center mb-8 shadow-2xl shadow-black/20">
          <Check className="w-12 h-12" />
        </div>
        <h2 className="text-4xl font-black mb-4 tracking-tight">¡Pedido Generado!</h2>
        <p className="text-gray-500 max-w-md mx-auto mb-10 text-lg">
          Se ha abierto WhatsApp para que nos envíes el detalle de tu pedido. 
          <br/><br/>
          <strong>¿Ya nos enviaste el mensaje?</strong>
        </p>
        <button 
          onClick={() => {
            clearCart();
            window.location.href = `/catalogo`;
          }}
          className="bg-black text-white font-bold py-4 px-12 rounded-full hover:bg-gray-900 transition-transform hover:scale-105 active:scale-95 shadow-xl shadow-black/20"
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
        <h1 className="text-4xl font-black text-gray-900 mb-4 tracking-tight">Tu bolsa está vacía</h1>
        <p className="text-lg text-gray-500 mb-10 max-w-md mx-auto">Agrega hermosos arreglos florales para continuar con tu compra.</p>
        <a href="/catalogo" className="inline-flex items-center gap-2 bg-black text-white font-bold px-8 py-4 rounded-full shadow-lg shadow-black/20 hover:bg-gray-900 transition-all hover:scale-105 active:scale-95">
          Explorar Catálogo <ArrowRight className="w-5 h-5" />
        </a>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50/30 selection:bg-black selection:text-white font-sans">
      <div className="container mx-auto px-4 pt-8 pb-24 md:pb-12 max-w-6xl">
        
        {/* Header Elegante */}
        <div className="mb-10 text-center md:text-left border-b border-gray-100 pb-6">
          <h1 className="text-3xl md:text-4xl font-black text-black tracking-tight">Checkout</h1>
          <p className="text-gray-500 mt-2 flex items-center justify-center md:justify-start gap-2 text-sm">
            <ShieldCheck className="w-4 h-4 text-green-600" /> Pago 100% seguro y encriptado
          </p>
        </div>
        
        <div className="flex flex-col lg:flex-row gap-10 xl:gap-16">
          
          {/* Formularios - Columna Izquierda (Flujo Principal) */}
          <div className="flex-1 space-y-8">
            
            {/* 1. Tus Datos (Comprador) */}
            <section className="bg-white p-6 md:p-8 rounded-3xl shadow-[0_2px_20px_rgba(0,0,0,0.04)] border border-gray-100">
              <h2 className="text-xl font-bold text-black mb-6 flex items-center gap-3">
                <span className="w-8 h-8 rounded-full bg-black text-white flex items-center justify-center text-sm">1</span>
                Tus Datos
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-gray-700">Nombre completo</label>
                  <input 
                    type="text" 
                    placeholder="Ej: Juan Pérez" 
                    className="w-full px-4 py-3.5 rounded-xl border-2 border-gray-100 bg-gray-50 focus:bg-white focus:border-black outline-none transition-all placeholder:text-gray-400"
                    value={nombreComprador}
                    onChange={(e) => setNombreComprador(e.target.value)}
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-gray-700">Correo electrónico</label>
                  <input 
                    type="email" 
                    placeholder="tucorreo@ejemplo.com" 
                    className="w-full px-4 py-3.5 rounded-xl border-2 border-gray-100 bg-gray-50 focus:bg-white focus:border-black outline-none transition-all placeholder:text-gray-400"
                    value={emailComprador}
                    onChange={(e) => setEmailComprador(e.target.value)}
                  />
                </div>
              </div>
              <label className="mt-5 flex items-center gap-3 cursor-pointer group w-fit">
                <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${recibirNoticias ? 'bg-black border-black text-white' : 'border-gray-300 bg-white group-hover:border-black'}`}>
                  {recibirNoticias && <Check className="w-3.5 h-3.5" />}
                </div>
                <input type="checkbox" className="hidden" checked={recibirNoticias} onChange={(e) => setRecibirNoticias(e.target.checked)} />
                <span className="text-sm text-gray-600 font-medium select-none">Mantenme informado de noticias y ofertas exclusivas</span>
              </label>
            </section>

            {/* 2. Método de Entrega */}
            <section className="bg-white p-6 md:p-8 rounded-3xl shadow-[0_2px_20px_rgba(0,0,0,0.04)] border border-gray-100">
              <h2 className="text-xl font-bold text-black mb-6 flex items-center gap-3">
                <span className="w-8 h-8 rounded-full bg-black text-white flex items-center justify-center text-sm">2</span>
                Entrega
              </h2>
              
              {/* TABS ESTILO APP */}
              <div className="flex p-1 bg-gray-100 rounded-xl mb-8 w-full md:w-fit">
                <button 
                  onClick={() => setDeliveryType('domicilio')}
                  className={`flex-1 md:flex-none px-6 py-3 text-sm font-bold rounded-lg transition-all flex items-center justify-center gap-2 ${deliveryType === 'domicilio' ? 'bg-white text-black shadow-sm' : 'text-gray-500 hover:text-black'}`}
                >
                  <Truck className="w-4 h-4" /> Domicilio
                </button>
                <button 
                  onClick={() => setDeliveryType('cementerio')}
                  className={`flex-1 md:flex-none px-6 py-3 text-sm font-bold rounded-lg transition-all flex items-center justify-center gap-2 ${deliveryType === 'cementerio' ? 'bg-white text-black shadow-sm' : 'text-gray-500 hover:text-black'}`}
                >
                  <MapPin className="w-4 h-4" /> Cementerio
                </button>
              </div>

              {deliveryType === 'domicilio' ? (
                <div className="space-y-6 animate-in fade-in duration-300">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="relative space-y-1.5">
                      <label className="text-sm font-semibold text-gray-700">Dirección de entrega</label>
                      <input 
                        type="text" 
                        placeholder="Ej: Las Malvas 1851" 
                        className="w-full px-4 py-3.5 rounded-xl border-2 border-gray-100 bg-gray-50 focus:bg-white focus:border-black outline-none transition-all placeholder:text-gray-400" 
                        value={addressInput}
                        onChange={(e) => {
                          setAddressInput(e.target.value);
                          setShowSuggestions(true);
                        }}
                        onFocus={() => setShowSuggestions(true)}
                        onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                      />
                      {/* Autocomplete Elegante */}
                      {showSuggestions && filteredSuggestions.length > 0 && (
                        <div className="absolute z-50 top-[calc(100%+4px)] left-0 right-0 bg-white border border-gray-100 rounded-xl shadow-2xl overflow-hidden">
                          {filteredSuggestions.map((suggestion, idx) => (
                            <button
                              key={idx}
                              className="w-full text-left px-5 py-3.5 hover:bg-gray-50 border-b border-gray-50 last:border-0 text-sm font-medium text-gray-700 transition-colors flex items-center gap-3"
                              onClick={() => {
                                setAddressInput(suggestion);
                                setShowSuggestions(false);
                                if (suggestion.includes("La Florida")) setComuna("La Florida");
                                if (suggestion.includes("Puente Alto")) setComuna("Puente Alto");
                              }}
                            >
                              <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0">
                                <MapPin className="w-4 h-4 text-gray-500" />
                              </div>
                              {suggestion}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-sm font-semibold text-gray-700">Comuna</label>
                      <div className="relative">
                        <select 
                          value={comuna}
                          onChange={(e) => setComuna(e.target.value)}
                          className="w-full px-4 py-3.5 rounded-xl border-2 border-gray-100 bg-gray-50 focus:bg-white focus:border-black outline-none transition-all appearance-none font-medium"
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
                        <ChevronRight className="w-5 h-5 text-gray-400 absolute right-4 top-1/2 -translate-y-1/2 rotate-90 pointer-events-none" />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-2">
                    <div className="space-y-1.5">
                      <label className="text-sm font-semibold text-gray-700">Nombre de quien recibe</label>
                      <input 
                        type="text" 
                        placeholder="Ej: María José" 
                        className="w-full px-4 py-3.5 rounded-xl border-2 border-gray-100 bg-gray-50 focus:bg-white focus:border-black outline-none transition-all placeholder:text-gray-400"
                        value={nombreDestinatario}
                        onChange={(e) => setNombreDestinatario(e.target.value)}
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-sm font-semibold text-gray-700">Teléfono de quien recibe</label>
                      <input 
                        type="tel" 
                        placeholder="+56 9 XXXXXXXX" 
                        className="w-full px-4 py-3.5 rounded-xl border-2 border-gray-100 bg-gray-50 focus:bg-white focus:border-black outline-none transition-all placeholder:text-gray-400" 
                        value={telefono}
                        onChange={(e) => setTelefono(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-2">
                    <div className="space-y-1.5">
                      <label className="text-sm font-semibold text-gray-700">Fecha requerida</label>
                      <input 
                        type="date" 
                        value={deliveryDate}
                        onChange={(e) => setDeliveryDate(e.target.value)}
                        className="w-full px-4 py-3.5 rounded-xl border-2 border-gray-100 bg-gray-50 focus:bg-white focus:border-black outline-none transition-all" 
                        min={new Date().toISOString().split('T')[0]} 
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-sm font-semibold text-gray-700">Horario</label>
                      <div className="relative">
                        <select 
                          value={deliveryTime}
                          onChange={(e) => setDeliveryTime(e.target.value)}
                          className="w-full px-4 py-3.5 rounded-xl border-2 border-gray-100 bg-gray-50 focus:bg-white focus:border-black outline-none transition-all appearance-none font-medium"
                        >
                          <option value="Mañana (09:00 - 13:00)">Mañana (09:00 - 13:00)</option>
                          <option value="Tarde (14:00 - 18:00)">Tarde (14:00 - 18:00)</option>
                        </select>
                        <ChevronRight className="w-5 h-5 text-gray-400 absolute right-4 top-1/2 -translate-y-1/2 rotate-90 pointer-events-none" />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-1.5 pt-2">
                    <label className="text-sm font-semibold text-gray-700">Instrucciones Especiales (Opcional)</label>
                    <textarea 
                      rows={2} 
                      placeholder="Tocar timbre fuerte, dejar en portería, casa reja azul..." 
                      className="w-full px-4 py-3.5 rounded-xl border-2 border-gray-100 bg-gray-50 focus:bg-white focus:border-black outline-none transition-all resize-none placeholder:text-gray-400"
                      value={indicaciones}
                      onChange={(e) => setIndicaciones(e.target.value)}
                    ></textarea>
                  </div>

                  <label className={`mt-2 flex items-center gap-4 p-5 rounded-2xl cursor-pointer border-2 transition-all group ${isNightService ? 'border-black bg-gray-900 text-white' : 'border-gray-100 bg-white hover:border-gray-200'}`}>
                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-colors ${isNightService ? 'border-white' : 'border-gray-300'}`}>
                      {isNightService && <div className="w-3 h-3 bg-white rounded-full"></div>}
                    </div>
                    <div>
                      <p className={`font-bold ${isNightService ? 'text-white' : 'text-black'}`}>Servicio Especial Nocturno (+25%)</p>
                      <p className={`text-sm mt-0.5 ${isNightService ? 'text-gray-300' : 'text-gray-500'}`}>Entregas de 20:00 a 23:59 hrs. Ideal para sorpresas a medianoche.</p>
                    </div>
                  </label>
                </div>
              ) : (
                <div className="space-y-6 animate-in fade-in duration-300">
                  <div className="p-5 rounded-2xl bg-gray-50 border border-gray-200 flex items-start gap-4 text-gray-700 text-sm">
                    <ShieldCheck className="w-5 h-5 text-black flex-shrink-0 mt-0.5" />
                    <p>Contamos con acceso a los parques cementerios. Ubicaremos la sepultura con el mayor de los respetos utilizando los datos proporcionados.</p>
                  </div>
                  
                  <div className="space-y-1.5">
                    <label className="text-sm font-semibold text-gray-700">Recinto</label>
                    <div className="relative">
                      <select 
                        className="w-full px-4 py-3.5 rounded-xl border-2 border-gray-100 bg-gray-50 focus:bg-white focus:border-black outline-none transition-all appearance-none font-medium"
                        value={cemeteryName}
                        onChange={(e) => setCemeteryName(e.target.value)}
                      >
                        <option value="Parque El Prado">Cementerio Parque El Prado</option>
                        <option value="Parque Del Recuerdo Cordillera">Cementerio Parque Del Recuerdo Cordillera</option>
                      </select>
                      <ChevronRight className="w-5 h-5 text-gray-400 absolute right-4 top-1/2 -translate-y-1/2 rotate-90 pointer-events-none" />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="space-y-1.5">
                      <label className="text-sm font-semibold text-gray-700">Nombre del difunto</label>
                      <input 
                        type="text" 
                        placeholder="Quien descansa..." 
                        className="w-full px-4 py-3.5 rounded-xl border-2 border-gray-100 bg-gray-50 focus:bg-white focus:border-black outline-none transition-all placeholder:text-gray-400" 
                        value={deceasedName}
                        onChange={(e) => setDeceasedName(e.target.value)}
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-sm font-semibold text-gray-700">Ubicación física (Si la sabe)</label>
                      <input 
                        type="text" 
                        placeholder="Sector / Lápida" 
                        className="w-full px-4 py-3.5 rounded-xl border-2 border-gray-100 bg-gray-50 focus:bg-white focus:border-black outline-none transition-all placeholder:text-gray-400" 
                        value={cemeterySector}
                        onChange={(e) => setCemeterySector(e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              )}
            </section>

            {/* 3. Dedicatoria */}
            <section className="bg-white p-6 md:p-8 rounded-3xl shadow-[0_2px_20px_rgba(0,0,0,0.04)] border border-gray-100 relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:opacity-[0.05] transition-opacity pointer-events-none">
                <Gift className="w-32 h-32" />
              </div>
              <h2 className="text-xl font-bold text-black mb-2 flex items-center gap-3">
                <span className="w-8 h-8 rounded-full bg-black text-white flex items-center justify-center text-sm">3</span>
                Mensaje de Dedicatoria <span className="text-sm text-gray-400 font-normal ml-1 bg-gray-100 px-2 py-0.5 rounded-md">Opcional</span>
              </h2>
              <p className="text-sm text-gray-500 mb-6 ml-11">Imprimiremos tu mensaje en una hermosa tarjeta física gratuita.</p>
              
              <div className="space-y-4 ml-11 relative z-10">
                <div className="flex flex-wrap gap-2 mb-2">
                  {AI_PROMPTS.map((prompt, idx) => (
                    <button 
                      key={idx}
                      onClick={() => setDedicatoriaMessage(prompt.text)}
                      className="text-xs font-bold px-4 py-2 rounded-full border-2 border-gray-100 bg-white text-gray-600 hover:bg-black hover:text-white hover:border-black transition-all"
                    >
                      {prompt.label}
                    </button>
                  ))}
                </div>
                <textarea 
                  rows={3} 
                  placeholder="Escribe las palabras que acompañarán tus flores..." 
                  className="w-full px-4 py-4 rounded-xl border-2 border-gray-100 bg-gray-50 focus:bg-white focus:border-black outline-none transition-all resize-none placeholder:text-gray-400 text-gray-900"
                  value={dedicatoriaMessage}
                  onChange={(e) => setDedicatoriaMessage(e.target.value)}
                ></textarea>
              </div>
            </section>

            {/* 4. Pago */}
            <section className="bg-white p-6 md:p-8 rounded-3xl shadow-[0_2px_20px_rgba(0,0,0,0.04)] border border-gray-100">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-black flex items-center gap-3">
                  <span className="w-8 h-8 rounded-full bg-black text-white flex items-center justify-center text-sm">4</span>
                  Pago Seguro
                </h2>
                <ShieldCheck className="text-black w-6 h-6" />
              </div>
              
              <div className="space-y-4 ml-11">
                {/* Mercado Pago - Opcion Principal */}
                <label className={`relative cursor-pointer flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-5 rounded-2xl border-2 transition-all ${selectedPaymentMethod === 'mercadopago' ? 'border-[#009EE3] bg-[#009EE3]/[0.03]' : 'border-gray-100 hover:border-gray-300'}`}>
                  <input type="radio" name="payment" value="mercadopago" checked={selectedPaymentMethod === 'mercadopago'} onChange={() => setSelectedPaymentMethod('mercadopago')} className="hidden" />
                  
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-[#009EE3] rounded-full shadow-md flex items-center justify-center flex-shrink-0">
                      <Handshake className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <p className="font-bold text-black">Mercado Pago</p>
                        <span className="bg-[#009EE3] text-white text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-widest">Recomendado</span>
                      </div>
                      <p className="text-xs text-gray-500 font-medium">Tarjetas de Crédito, Débito, y Dinero en cuenta.</p>
                    </div>
                  </div>
                  
                  {selectedPaymentMethod === 'mercadopago' && (
                    <div className="absolute right-5 top-1/2 -translate-y-1/2">
                      <div className="w-6 h-6 rounded-full bg-[#009EE3] flex items-center justify-center text-white">
                        <Check className="w-3.5 h-3.5" />
                      </div>
                    </div>
                  )}
                </label>

                {/* Flow - Opcion Alternativa */}
                <label className={`relative cursor-pointer flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-5 rounded-2xl border-2 transition-all ${selectedPaymentMethod === 'flow' ? 'border-orange-500 bg-orange-50' : 'border-gray-100 hover:border-gray-300'}`}>
                  <input type="radio" name="payment" value="flow" checked={selectedPaymentMethod === 'flow'} onChange={() => setSelectedPaymentMethod('flow')} className="hidden" />
                  
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-white rounded-xl shadow-sm border border-gray-100 flex items-center justify-center flex-shrink-0">
                      <CreditCard className="w-6 h-6 text-orange-500" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <p className="font-bold text-black">Pago Online (Flow)</p>
                      </div>
                      <p className="text-xs text-gray-500 font-medium">Webpay Plus, MACH, Servipag y más.</p>
                    </div>
                  </div>
                  
                  {selectedPaymentMethod === 'flow' && (
                    <div className="absolute right-5 top-1/2 -translate-y-1/2">
                      <div className="w-6 h-6 rounded-full bg-orange-500 flex items-center justify-center text-white">
                        <Check className="w-3.5 h-3.5" />
                      </div>
                    </div>
                  )}
                </label>

                {/* Alternativas */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <label className={`cursor-pointer flex items-center gap-4 p-4 rounded-2xl border-2 transition-all ${selectedPaymentMethod === 'transferencia' ? 'border-black bg-gray-50' : 'border-gray-100 hover:border-gray-300'}`}>
                    <input type="radio" name="payment" value="transferencia" checked={selectedPaymentMethod === 'transferencia'} onChange={() => setSelectedPaymentMethod('transferencia')} className="hidden" />
                    <div className="w-10 h-10 bg-white rounded-xl shadow-sm border border-gray-100 flex items-center justify-center flex-shrink-0">
                      <CreditCard className="w-5 h-5 text-black" />
                    </div>
                    <div>
                      <p className="font-bold text-black text-sm">Transferencia</p>
                      <p className="text-xs text-gray-500 font-medium">Manual vía WhatsApp</p>
                    </div>
                  </label>

                  <label className={`cursor-pointer flex items-center gap-4 p-4 rounded-2xl border-2 transition-all ${selectedPaymentMethod === 'efectivo' ? 'border-black bg-gray-50' : 'border-gray-100 hover:border-gray-300'}`}>
                    <input type="radio" name="payment" value="efectivo" checked={selectedPaymentMethod === 'efectivo'} onChange={() => setSelectedPaymentMethod('efectivo')} className="hidden" />
                    <div className="w-10 h-10 bg-white rounded-xl shadow-sm border border-gray-100 flex items-center justify-center flex-shrink-0">
                      <span className="text-lg">💵</span>
                    </div>
                    <div>
                      <p className="font-bold text-black text-sm">Efectivo</p>
                      <p className="text-xs text-gray-500 font-medium">Contra entrega (+ $2.000)</p>
                    </div>
                  </label>
                </div>
              </div>
            </section>
          </div>

          {/* Resumen - Columna Derecha (Sticky) */}
          <div className="w-full lg:w-[400px] flex-shrink-0">
            <div className="bg-white p-6 md:p-8 rounded-3xl shadow-[0_4px_30px_rgba(0,0,0,0.06)] border border-gray-100 lg:sticky lg:top-8">
              <h2 className="text-xl font-black text-black mb-6">
                Tu Resumen
              </h2>
              
              <div className="flex flex-col gap-5 mb-6 pb-6 border-b border-gray-100 max-h-[30vh] lg:max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                {items.map((item) => (
                  <div key={item.id} className="flex gap-4">
                    <div className="w-16 h-16 bg-gray-50 rounded-xl overflow-hidden flex-shrink-0 border border-gray-100">
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex flex-col flex-grow justify-center">
                      <div className="flex justify-between items-start mb-1">
                        <h3 className="font-bold text-black text-sm leading-tight pr-2">{item.name}</h3>
                        <p className="font-black text-black text-sm">${(item.price * item.quantity).toLocaleString('es-CL')}</p>
                      </div>
                      <div className="flex items-center justify-between mt-1">
                        <div className="text-xs font-bold text-gray-500 bg-gray-100 px-2 py-0.5 rounded-md">
                          Cant: {item.quantity}
                        </div>
                        <button onClick={() => removeFromCart(item.id)} className="text-gray-400 hover:text-red-500 text-xs font-bold transition-colors">Remover</button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="space-y-4 text-sm text-gray-600 mb-6 font-medium">
                <div className="flex justify-between">
                  <span>Subtotal ({cartCount} prod.)</span>
                  <span className="font-bold text-black">${subtotal.toLocaleString('es-CL')}</span>
                </div>
                
                <div className="flex justify-between">
                  <span>Despacho</span>
                  <span className="font-bold text-black">
                    {deliveryType === 'domicilio' && !comuna ? 'Por calcular' : 
                     deliveryFee === 0 ? <span className="text-green-600 bg-green-50 px-2 py-0.5 rounded-md">GRATIS</span> : 
                     `$${deliveryFee.toLocaleString('es-CL')}`}
                  </span>
                </div>
                
                {(isNightService && deliveryType === 'domicilio') && (
                  <div className="flex justify-between text-indigo-600">
                    <span>Servicio Nocturno</span>
                    <span className="font-bold">+${nightSurcharge.toLocaleString('es-CL')}</span>
                  </div>
                )}
                
                {cashSurcharge > 0 && (
                  <div className="flex justify-between text-gray-600">
                    <span>Recargo Efectivo</span>
                    <span className="font-bold">+${cashSurcharge.toLocaleString('es-CL')}</span>
                  </div>
                )}
              </div>

              {/* Sección VIP Puntos */}
              {vipEmail && vipPuntos > 0 && (
                <div className="bg-gradient-to-r from-fuchsia-50 to-purple-50 rounded-2xl p-5 mb-6 border border-fuchsia-100">
                  <div className="flex items-center gap-2 mb-3">
                    <Crown className="w-5 h-5 text-fuchsia-500" />
                    <span className="text-sm font-bold text-fuchsia-700">Club VIP Chileflor</span>
                  </div>
                  <p className="text-sm text-gray-700 mb-3">
                    Tienes <strong className="text-fuchsia-600">{vipPuntos.toLocaleString('es-CL')} puntos</strong> disponibles
                    <span className="text-gray-500"> (hasta ${maxDescuentoPuntos.toLocaleString('es-CL')} de descuento)</span>
                  </p>
                  
                  <label className="flex items-center gap-3 cursor-pointer group">
                    <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${usarPuntos ? 'bg-fuchsia-600 border-fuchsia-600 text-white' : 'border-gray-300 bg-white group-hover:border-fuchsia-400'}`}>
                      {usarPuntos && <Check className="w-3.5 h-3.5" />}
                    </div>
                    <input type="checkbox" className="hidden" checked={usarPuntos} onChange={(e) => {
                      setUsarPuntos(e.target.checked);
                      if (e.target.checked) setPuntosAplicados(vipPuntos);
                    }} />
                    <span className="text-sm text-gray-700 font-medium">Usar mis puntos en esta compra</span>
                  </label>

                  {usarPuntos && (
                    <div className="mt-3 flex items-center gap-3">
                      <input
                        type="range"
                        min={0}
                        max={vipPuntos}
                        value={puntosAplicados}
                        onChange={(e) => setPuntosAplicados(Number(e.target.value))}
                        className="flex-1 accent-fuchsia-600"
                      />
                      <span className="text-sm font-bold text-fuchsia-700 min-w-[80px] text-right">
                        -${descuentoPuntos.toLocaleString('es-CL')}
                      </span>
                    </div>
                  )}
                </div>
              )}

              <div className="border-t-2 border-gray-100 pt-6 mb-8">
                {descuentoPuntos > 0 && (
                  <div className="flex justify-between items-center mb-3 text-sm">
                    <span className="text-fuchsia-600 font-medium flex items-center gap-1"><Crown className="w-3.5 h-3.5" /> Descuento VIP</span>
                    <span className="font-bold text-fuchsia-600">-${descuentoPuntos.toLocaleString('es-CL')}</span>
                  </div>
                )}
                <div className="flex justify-between items-center">
                  <p className="text-black font-bold">Total a pagar</p>
                  <span className="text-3xl font-black text-black tracking-tight">${total.toLocaleString('es-CL')}</span>
                </div>
                {vipEmail && total > 0 && (
                  <p className="text-xs text-fuchsia-500 mt-2 font-medium">+{Math.floor(total / 1000)} puntos VIP con esta compra ✨</p>
                )}
              </div>

              <button 
                onClick={handleCheckout} 
                disabled={loading}
                className="w-full bg-black text-white font-bold py-5 rounded-2xl transition-all flex items-center justify-center gap-2 shadow-[0_8px_20px_rgba(0,0,0,0.15)] hover:shadow-[0_12px_25px_rgba(0,0,0,0.2)] hover:-translate-y-1 active:translate-y-0 disabled:opacity-70 disabled:pointer-events-none text-lg"
              >
                {loading ? (
                  <><Loader2 className="w-5 h-5 animate-spin" /> Procesando...</>
                ) : (
                  <>Finalizar Compra <ArrowRight className="w-5 h-5" /></>
                )}
              </button>
              
              <div className="flex items-center justify-center gap-2 mt-6 text-gray-400 text-xs font-medium">
                <ShieldCheck className="w-4 h-4" />
                <span>Transacción segura de 256-bits.</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
