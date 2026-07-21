'use client';
import { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';
import { useCart } from '@/context/CartContext';
import { ShoppingCart } from 'lucide-react';
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
  const [telefono, setTelefono] = useState('');
  const [indicaciones, setIndicaciones] = useState('');


  // Autocomplete Estado
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
  
  // Estados para Cementerio
  const [cemeteryName, setCemeteryName] = useState('Parque El Prado');
  const [cemeterySector, setCemeterySector] = useState('');
  const [cemeteryLapida, setCemeteryLapida] = useState('');
  const [cemeteryObs, setCemeteryObs] = useState('');
  
  // Estados de la persona que descansa (Sutil)
  const [deceasedName, setDeceasedName] = useState('');
  const [deceasedDob, setDeceasedDob] = useState('');
  const [deceasedDod, setDeceasedDod] = useState('');
  const [deceasedRut, setDeceasedRut] = useState('');
  
  const subtotal = cartTotal;
  
  const COMUNAS_PRECIOS: Record<string, number> = {
    "La Florida": 0, "Puente Alto": 0, // Zona 0 (Gratis)
    "Macul": 3500, "Peñalolén": 3500, "La Granja": 3500, "San Joaquín": 3500, "San Miguel": 3500, "San Ramón": 3500, "La Pintana": 3500, "El Bosque": 3500, "La Cisterna": 3500, // Cercanos
  };

  let deliveryFee = 0;
  if (deliveryType === 'domicilio') {
    if (comuna && COMUNAS_PRECIOS[comuna] !== undefined) {
      deliveryFee = COMUNAS_PRECIOS[comuna];
    } else if (comuna) {
      deliveryFee = 5000; // Lejanos (> 5km)
    } else {
      deliveryFee = 0; // No seleccionada
    }
  }
  const nightSurcharge = (isNightService && deliveryType === 'domicilio') ? subtotal * 0.25 : 0;
  
  const pointsEarned = Math.floor(subtotal * earningRate);
  const maxUsablePoints = Math.min(clubPoints, Math.floor(subtotal / 2));
  const pointsDiscount = usePoints ? maxUsablePoints : 0;
  
  const cashSurcharge = selectedPaymentMethod === 'efectivo' ? 2000 : 0;
  
  const total = subtotal + deliveryFee + nightSurcharge - pointsDiscount + cashSurcharge;

  const handleWhatsAppCheckout = async () => {
    setLoading(true);
    
    // Armar el mensaje de WhatsApp con los detalles del pedido
    const orderId = `ORD-${Date.now().toString().slice(-5)}`;
    const paymentNames: Record<string, string> = {
      transbank: 'Transbank / Red Compra',
      mercadopago: 'Mercado Pago',
      transferencia: 'Transferencia Bancaria',
      efectivo: 'Efectivo contra entrega'
    };

    let message = `Hola Chileflor, quiero confirmar mi pedido #*${orderId}*.\n\n`;
    message += `📋 *Detalle:*\n`;
    items.forEach(item => {
      message += `- ${item.name} x ${item.quantity}\n`;
    });
    message += `\n💰 *Total:* $${total.toLocaleString('es-CL')}\n`;
    
    let entregaStr = '';
    let dirStr = '';
    if (deliveryType === 'domicilio') {
      entregaStr = `Domicilio ${isNightService ? '(Nocturno)' : ''}`.trim();
      dirStr = `${addressInput}, ${comuna}`;
    } else {
      entregaStr = `Cementerio - ${cemeteryName === 'Parque El Prado' ? 'Parque El Prado' : 'Parque Del Recuerdo'}`;
      dirStr = `Sector: ${cemeterySector || 'N/A'}, Lápida: ${cemeteryLapida || 'N/A'}`;
    }
    
    message += `📅 *Entrega:* ${entregaStr}\n`;
    message += `📍 *Dirección:* ${dirStr}\n\n`;
    message += `Me gustaría pagar mediante: *${paymentNames[selectedPaymentMethod]}*.`;
    
    // Solo interno
    message += `\n\n-------------------------\n*Solo para Agente Chileflor:*\nAutorizar y procesar aquí:\n${window.location.origin}/admin/pedidos-pendientes`;
    
    // Número de WhatsApp configurado en el footer: +56 9 7999 2848
    const whatsappUrl = `https://wa.me/56979992848?text=${encodeURIComponent(message)}`;
    
    // PREVENCIÓN DE BLOQUEO DE POPUPS EN MÓVILES:
    // Abrimos la ventana sincrónicamente ANTES del await de Supabase.
    const newWindow = window.open('', '_blank');
    
    try {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
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
      
      if (user) {
        await supabase.from('pedidos').insert([{ ...payload, user_id: user.id }]);
      } else {
        await supabase.from('pedidos').insert([payload]);
      }
    } catch (e) {
      console.error('Error guardando pedido en Supabase:', e);
    }
    
    // Redirigimos la ventana que ya fue abierta al enlace de WhatsApp
    if (newWindow) {
      newWindow.location.href = whatsappUrl;
    } else {
      window.location.href = whatsappUrl; // Fallback extremo
    }
    
    // Redirigir a la pantalla de dedicatoria en la pestaña principal tras una pausa
    setTimeout(() => {
      clearCart();
      window.location.href = `/dedicatoria/${orderId}`;
    }, 1500);
  };

  if (cartCount === 0) {
    return (
      <div className="container mx-auto px-4 py-24 max-w-6xl text-center flex flex-col items-center">
        <ShoppingCart className="w-24 h-24 mb-6 text-gray-300 inline-block" strokeWidth={1.5} />
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Tu carrito está vacío</h1>
        <p className="text-gray-500 mb-8 max-w-md mx-auto">Parece que aún no has agregado ninguna flor o arreglo a tu pedido. Explora nuestro catálogo y encuentra algo especial.</p>
        <a href="/catalogo" className="inline-block bg-primary text-white font-bold px-8 py-4 rounded-xl shadow-lg shadow-primary/30 hover:-translate-y-1 transition-all">
          Ir al Catálogo
        </a>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 pt-8 pb-24 md:pb-8 max-w-6xl">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Finalizar Compra</h1>
      
      <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
        <div className="flex-1 space-y-8">
          
          {/* Calendar Picker (Rule logic applied) */}
          <section className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <span>📅</span> Fecha y Hora de Entrega
            </h2>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <input type="date" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary outline-none" min={new Date().toISOString().split('T')[0]} />
              <select className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary outline-none">
                {deliveryType === 'domicilio' ? (
                  <>
                    <option>Mañana (09:00 - 13:00)</option>
                    <option>Tarde (14:00 - 18:00)</option>
                  </>
                ) : (
                  <option>Horario Parque (10:00 - 17:30)</option>
                )}
              </select>
            </div>
            
            {deliveryType === 'domicilio' && (
              <label className="flex items-start gap-3 p-4 bg-gray-50 rounded-xl cursor-pointer hover:bg-gray-100 transition-colors">
                <input 
                  type="checkbox" 
                  className="mt-1 w-4 h-4 text-primary rounded border-gray-300"
                  checked={isNightService}
                  onChange={(e) => setIsNightService(e.target.checked)}
                />
                <div>
                  <p className="font-semibold text-gray-900">Servicio Exclusivo Nocturno</p>
                  <p className="text-sm text-gray-500">Entrega de 20:00 a 23:59 hrs (+25% recargo). Elimina restricción de corte a las 20:00.</p>
                </div>
              </label>
            )}
          </section>

          {/* Delivery Details */}
          <section className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                <span>📍</span> Destino
              </h2>
              <div className="flex bg-gray-100 p-1 rounded-lg">
                <button 
                  onClick={() => setDeliveryType('domicilio')}
                  className={`px-4 py-1.5 text-sm font-medium rounded-md transition-all ${deliveryType === 'domicilio' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500'}`}
                >
                  Domicilio
                </button>
                <button 
                  onClick={() => setDeliveryType('cementerio')}
                  className={`px-4 py-1.5 text-sm font-medium rounded-md transition-all ${deliveryType === 'cementerio' ? 'bg-white text-primary shadow-sm' : 'text-gray-500'}`}
                >
                  Cementerio
                </button>
              </div>
            </div>

            {deliveryType === 'domicilio' ? (
              <div className="space-y-4">
                
                {/* Dirección y Verificación */}
                <div>
                  <div className="flex gap-2 mb-2 relative">
                    <div className="flex-1 relative">
                      <input 
                        type="text" 
                        placeholder="Dirección completa (Ej: Las Malvas 1851)" 
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary outline-none" 
                        value={addressInput}
                        onChange={(e) => {
                          setAddressInput(e.target.value);
                          setShowSuggestions(true);
                        }}
                        onFocus={() => setShowSuggestions(true)}
                        onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                      />
                      
                      {/* Autocomplete Dropdown */}
                      {showSuggestions && filteredSuggestions.length > 0 && (
                        <div className="absolute z-50 top-full left-0 right-0 mt-1 bg-white border border-gray-100 rounded-xl shadow-lg overflow-hidden animate-in fade-in duration-200">
                          {filteredSuggestions.map((suggestion, idx) => (
                            <button
                              key={idx}
                              className="w-full text-left px-4 py-3 hover:bg-gray-50 border-b border-gray-50 last:border-0 text-sm text-gray-700 transition-colors"
                              onClick={() => {
                                setAddressInput(suggestion);
                                setShowSuggestions(false);
                                
                                // Opcional: Autoseleccionar la comuna basada en la sugerencia
                                if (suggestion.includes("La Florida")) setComuna("La Florida");
                                if (suggestion.includes("Puente Alto")) setComuna("Puente Alto");
                                if (suggestion.includes("Providencia")) setComuna("Providencia");
                                if (suggestion.includes("Las Condes")) setComuna("Las Condes");
                              }}
                            >
                              <span className="text-primary mr-2">📍</span>
                              {suggestion}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                    
                    <button 
                      className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-xl font-medium transition-colors text-sm flex items-center gap-1 whitespace-nowrap"
                      onClick={(e) => {
                        const btn = e.currentTarget;
                        btn.innerHTML = 'Verificando...';
                        setTimeout(() => {
                          btn.innerHTML = '✅ Verificada';
                          btn.className = 'bg-green-100 text-green-700 px-4 py-2 rounded-xl font-medium text-sm flex items-center gap-1 whitespace-nowrap pointer-events-none';
                        }, 1200);
                      }}
                    >
                      📍 Verificar
                    </button>
                  </div>
                  <p className="text-xs text-gray-500 italic">* Requerimos verificar la dirección por seguridad del repartidor.</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <select 
                    value={comuna}
                    onChange={(e) => setComuna(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white focus:border-primary outline-none"
                  >
                    <option value="">Selecciona Comuna...</option>
                    <option value="Cerrillos">Cerrillos</option>
                    <option value="Cerro Navia">Cerro Navia</option>
                    <option value="Conchalí">Conchalí</option>
                    <option value="El Bosque">El Bosque</option>
                    <option value="Estación Central">Estación Central</option>
                    <option value="Huechuraba">Huechuraba</option>
                    <option value="Independencia">Independencia</option>
                    <option value="La Cisterna">La Cisterna</option>
                    <option value="La Florida">La Florida (GRATIS)</option>
                    <option value="La Granja">La Granja</option>
                    <option value="La Pintana">La Pintana</option>
                    <option value="La Reina">La Reina</option>
                    <option value="Las Condes">Las Condes</option>
                    <option value="Lo Barnechea">Lo Barnechea</option>
                    <option value="Lo Espejo">Lo Espejo</option>
                    <option value="Lo Prado">Lo Prado</option>
                    <option value="Macul">Macul</option>
                    <option value="Maipú">Maipú</option>
                    <option value="Ñuñoa">Ñuñoa</option>
                    <option value="Pedro Aguirre Cerda">Pedro Aguirre Cerda</option>
                    <option value="Peñalolén">Peñalolén</option>
                    <option value="Providencia">Providencia</option>
                    <option value="Pudahuel">Pudahuel</option>
                    <option value="Puente Alto">Puente Alto (GRATIS)</option>
                    <option value="Quilicura">Quilicura</option>
                    <option value="Quinta Normal">Quinta Normal</option>
                    <option value="Recoleta">Recoleta</option>
                    <option value="Renca">Renca</option>
                    <option value="San Bernardo">San Bernardo</option>
                    <option value="San Joaquín">San Joaquín</option>
                    <option value="San Miguel">San Miguel</option>
                    <option value="San Ramón">San Ramón</option>
                    <option value="Santiago Centro">Santiago Centro</option>
                    <option value="Vitacura">Vitacura</option>
                  </select>
                  <input type="text" placeholder="Nº Depto/Casa" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary outline-none" />
                </div>
                
                {/* Teléfono de Contacto */}
                <input 
                  type="tel" 
                  placeholder="Teléfono del destinatario (+56 9...)" 
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary outline-none" 
                  value={telefono}
                  onChange={(e) => setTelefono(e.target.value)}
                />
                
                {/* Indicaciones Adicionales */}
                <textarea 
                  rows={2} 
                  placeholder="Indicaciones para el repartidor (Ej: Dejar en conserjería, casa reja blanca)" 
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary outline-none resize-none"
                  value={indicaciones}
                  onChange={(e) => setIndicaciones(e.target.value)}
                ></textarea>

              </div>
            ) : (
              <div className="space-y-4 bg-primary/5 p-4 rounded-xl border border-primary/10">
                <div className="flex items-center gap-2 text-primary mb-2">
                  <span className="font-semibold">Geolocalización Funeraria</span>
                </div>
                <select 
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white focus:border-primary outline-none"
                  value={cemeteryName}
                  onChange={(e) => setCemeteryName(e.target.value)}
                >
                  <option value="Parque El Prado">Cementerio Parque El Prado</option>
                  <option value="Parque Del Recuerdo Cordillera">Cementerio Parque Del Recuerdo Cordillera</option>
                </select>
                <div className="grid grid-cols-2 gap-4">
                  <input 
                    type="text" 
                    placeholder="Patio / Sector" 
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white" 
                    value={cemeterySector}
                    onChange={(e) => setCemeterySector(e.target.value)}
                  />
                  <input 
                    type="text" 
                    placeholder="Nº Lápida" 
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white" 
                    value={cemeteryLapida}
                    onChange={(e) => setCemeteryLapida(e.target.value)}
                  />
                </div>
                
                <div className="space-y-4 border-t border-primary/20 pt-4 mt-2">
                  <p className="text-sm text-gray-600 font-medium italic">Ayúdenos a ubicar la sepultura exacta de su ser querido:</p>
                  
                  <input 
                    type="text" 
                    placeholder="Nombre completo de quien descansa" 
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white focus:border-primary outline-none" 
                    value={deceasedName}
                    onChange={(e) => setDeceasedName(e.target.value)}
                  />
                  
                  <div className="grid grid-cols-2 gap-4">
                    <input 
                      type="text" 
                      placeholder="Año de nacimiento (Opcional)" 
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white focus:border-primary outline-none text-sm" 
                      value={deceasedDob}
                      onChange={(e) => setDeceasedDob(e.target.value)}
                    />
                    <input 
                      type="text" 
                      placeholder="Año de descanso (Opcional)" 
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white focus:border-primary outline-none text-sm" 
                      value={deceasedDod}
                      onChange={(e) => setDeceasedDod(e.target.value)}
                    />
                  </div>
                  
                  <input 
                    type="text" 
                    placeholder="RUT (Opcional - Ayuda al registro del parque)" 
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white focus:border-primary outline-none text-sm" 
                    value={deceasedRut}
                    onChange={(e) => setDeceasedRut(e.target.value)}
                  />
                </div>

                <textarea 
                  rows={2} 
                  placeholder="Observaciones adicionales (Ej: Cerca de la pileta central, lápida de mármol blanco)" 
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary outline-none resize-none"
                  value={cemeteryObs}
                  onChange={(e) => setCemeteryObs(e.target.value)}
                ></textarea>
                
                <div className="h-64 bg-gray-200 rounded-xl w-full flex items-center justify-center relative overflow-hidden shadow-inner mt-4">
                  {cemeteryName === 'Parque El Prado' ? (
                    <iframe src="https://maps.google.com/maps?q=Av.%20Camilo%20Henr%C3%ADquez%20N%C2%B0%204673%2C%20Puente%20Alto%2C%20Chile&t=&z=15&ie=UTF8&iwloc=&output=embed" width="100%" height="100%" style={{border:0}} allowFullScreen={false} loading="lazy" referrerPolicy="no-referrer-when-downgrade"></iframe>
                  ) : (
                    <iframe src="https://maps.google.com/maps?q=Camino%20Sta%20Rosa%20del%20Peral%206500%2C%20Puente%20Alto%2C%20Chile&t=&z=15&ie=UTF8&iwloc=&output=embed" width="100%" height="100%" style={{border:0}} allowFullScreen={false} loading="lazy" referrerPolicy="no-referrer-when-downgrade"></iframe>
                  )}
                </div>
              </div>
            )}
          </section>

          {/* Payment Methods Info */}
          <section className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
            <h2 className="text-xl font-bold text-gray-900 mb-2 flex items-center gap-2">
              <span>💳</span> Tu pedido está casi listo.
            </h2>
            <p className="text-gray-500 text-sm mb-6">Elige cómo pagar de forma segura a través de nuestra atención personalizada.</p>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
              <label className={`cursor-pointer flex items-center gap-4 p-4 rounded-2xl border-2 transition-all ${selectedPaymentMethod === 'transbank' ? 'border-[#FF2651] bg-[#FF2651]/5' : 'border-gray-100 hover:border-gray-200'}`}>
                <input type="radio" name="payment" value="transbank" checked={selectedPaymentMethod === 'transbank'} onChange={() => setSelectedPaymentMethod('transbank')} className="hidden" />
                <div className="w-12 h-12 bg-gray-50 rounded-xl flex items-center justify-center flex-shrink-0">
                  <span className="text-2xl">💳</span>
                </div>
                <div>
                  <p className="font-semibold text-gray-900">Transbank</p>
                  <p className="text-xs text-gray-500">RedCompra / Crédito</p>
                </div>
              </label>

              <label className={`cursor-pointer flex items-center gap-4 p-4 rounded-2xl border-2 transition-all ${selectedPaymentMethod === 'mercadopago' ? 'border-[#FF2651] bg-[#FF2651]/5' : 'border-gray-100 hover:border-gray-200'}`}>
                <input type="radio" name="payment" value="mercadopago" checked={selectedPaymentMethod === 'mercadopago'} onChange={() => setSelectedPaymentMethod('mercadopago')} className="hidden" />
                <div className="w-12 h-12 bg-[#009EE3]/10 rounded-xl flex items-center justify-center flex-shrink-0">
                  <span className="text-2xl">📱</span>
                </div>
                <div>
                  <p className="font-semibold text-gray-900">Mercado Pago</p>
                  <p className="text-xs text-gray-500">Saldo o Tarjetas</p>
                </div>
              </label>

              <label className={`cursor-pointer flex items-center gap-4 p-4 rounded-2xl border-2 transition-all ${selectedPaymentMethod === 'transferencia' ? 'border-[#FF2651] bg-[#FF2651]/5' : 'border-gray-100 hover:border-gray-200'}`}>
                <input type="radio" name="payment" value="transferencia" checked={selectedPaymentMethod === 'transferencia'} onChange={() => setSelectedPaymentMethod('transferencia')} className="hidden" />
                <div className="w-12 h-12 bg-gray-50 rounded-xl flex items-center justify-center flex-shrink-0">
                  <span className="text-2xl">🏦</span>
                </div>
                <div>
                  <p className="font-semibold text-gray-900">Transferencia</p>
                  <p className="text-xs text-gray-500">Banca por Internet</p>
                </div>
              </label>

              <label className={`cursor-pointer flex items-center gap-4 p-4 rounded-2xl border-2 transition-all ${selectedPaymentMethod === 'efectivo' ? 'border-[#FF2651] bg-[#FF2651]/5' : 'border-gray-100 hover:border-gray-200'}`}>
                <input type="radio" name="payment" value="efectivo" checked={selectedPaymentMethod === 'efectivo'} onChange={() => setSelectedPaymentMethod('efectivo')} className="hidden" />
                <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center flex-shrink-0">
                  <span className="text-2xl">💵</span>
                </div>
                <div>
                  <p className="font-semibold text-gray-900">Efectivo</p>
                  <p className="text-xs text-gray-500">Pago contra entrega (+$2.000)</p>
                </div>
              </label>
            </div>

            <div className="bg-blue-50/50 border border-blue-100 rounded-xl p-5 text-sm text-gray-700 space-y-3">
              <div className="flex items-center gap-2">
                <span className="text-xl">🔒</span>
                <p className="font-semibold text-blue-900">Transacción Protegida</p>
              </div>
              <p className="flex items-center gap-2">
                <span className="text-blue-500">✓</span> Más de 5,000 pedidos entregados con éxito
              </p>
              <p className="flex items-center gap-2">
                <span className="text-blue-500">✓</span> Atención personalizada 1 a 1 por nuestro equipo
              </p>
            </div>
          </section>
        </div>

        {/* Order Summary */}
        <div className="w-full lg:w-96 flex-shrink-0">
          <div className="bg-white p-6 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 lg:sticky lg:top-24">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Resumen del Pedido</h2>
            
            <div className="flex flex-col gap-4 mb-6 pb-6 border-b border-dashed border-gray-200">
              {items.length === 0 ? (
                <p className="text-sm text-gray-500 text-center py-4">Tu carrito está vacío.</p>
              ) : (
                items.map((item) => (
                  <div key={item.id} className="flex gap-4">
                    <div className="w-20 h-24 bg-gray-100 rounded-xl overflow-hidden flex-shrink-0">
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex flex-col flex-grow justify-between py-1">
                      <div className="flex justify-between items-start">
                        <div className="w-full">
                          <h3 className="font-bold text-gray-900 leading-tight pr-4">{item.name}</h3>
                          <div className="flex items-center justify-between mt-3">
                            <div className="flex items-center bg-gray-50 rounded-lg border border-gray-200 h-8">
                              <button 
                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                className="w-8 h-full flex items-center justify-center text-gray-500 hover:bg-gray-100 rounded-l-lg transition-colors font-medium"
                              >
                                -
                              </button>
                              <span className="w-8 text-center text-sm font-semibold text-gray-900">
                                {item.quantity}
                              </span>
                              <button 
                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                className="w-8 h-full flex items-center justify-center text-gray-500 hover:bg-gray-100 rounded-r-lg transition-colors font-medium"
                              >
                                +
                              </button>
                            </div>
                            <button 
                              onClick={() => removeFromCart(item.id)}
                              className="text-gray-400 hover:text-red-500 transition-colors text-xs font-medium uppercase tracking-wider"
                            >
                              Eliminar
                            </button>
                          </div>
                        </div>
                      </div>
                      <p className="font-bold text-primary mt-3 text-right">${(item.price * item.quantity).toLocaleString('es-CL')}</p>
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="space-y-3 text-sm text-gray-600 mb-6">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-medium text-gray-900">${subtotal.toLocaleString('es-CL')}</span>
              </div>
              <div className="flex justify-between">
                <span>Envío {comuna && `(${comuna})`}</span>
                <span className="font-medium text-gray-900">
                  {deliveryType === 'domicilio' && !comuna ? 'Selecciona comuna' : 
                   deliveryFee === 0 ? <span className="text-green-600 font-bold uppercase">¡Gratis!</span> : 
                   `$${deliveryFee.toLocaleString('es-CL')}`}
                </span>
              </div>
              
              {(isNightService && deliveryType === 'domicilio') && (
                <div className="flex justify-between text-primary">
                  <span>Recargo Nocturno (25%)</span>
                  <span className="font-medium">+${nightSurcharge.toLocaleString('es-CL')}</span>
                </div>
              )}
              
              {cashSurcharge > 0 && (
                <div className="flex justify-between text-gray-600">
                  <span>Recargo por Efectivo</span>
                  <span className="font-medium">+${cashSurcharge.toLocaleString('es-CL')}</span>
                </div>
              )}

              {clubPoints > 0 && (
                <label className="flex items-center justify-between p-3 bg-gray-50 rounded-lg cursor-pointer mt-4 border border-gray-200">
                  <div className="flex items-center gap-2">
                    <input 
                      type="checkbox" 
                      className="w-4 h-4 text-primary rounded border-gray-300" 
                      checked={usePoints}
                      onChange={(e) => setUsePoints(e.target.checked)}
                    />
                    <span>Usar {maxUsablePoints.toLocaleString('es-CL')} pts Club Chileflor</span>
                  </div>
                  <span className="font-medium text-green-600">-${usePoints ? maxUsablePoints.toLocaleString('es-CL') : '0'}</span>
                </label>
              )}
            </div>

            <div className="border-t border-gray-100 pt-4 mb-6">
              <div className="flex justify-between items-end">
                <span className="font-bold text-gray-900">Total</span>
                <span className="text-3xl font-bold text-primary">${total.toLocaleString('es-CL')}</span>
              </div>
            </div>

            <button 
              onClick={handleWhatsAppCheckout} 
              disabled={loading}
              className="w-full bg-[#FF2651] text-white font-medium py-4 rounded-full hover:bg-[#E01E42] transition-colors flex items-center justify-center gap-2 disabled:opacity-50 shadow-lg shadow-[#FF2651]/30 mt-2 text-lg"
            >
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
              {loading ? 'Preparando...' : 'Solicitar link de pago por WhatsApp'}
            </button>
            <p className="text-center text-sm font-medium text-primary mt-4 flex items-center justify-center gap-1 bg-primary/10 py-2 rounded-lg">
              🏆 Nivel {tier}: Ganas {pointsEarned.toLocaleString('es-CL')} puntos
            </p>
            <p className="text-center text-xs text-gray-400 mt-3 flex items-center justify-center gap-1">
              <span>👤</span> Trato personalizado y seguro
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
