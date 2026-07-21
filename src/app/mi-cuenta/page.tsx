'use client';
import { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';
import { useClub } from '@/hooks/useClub';

const COMUNAS_RM = [
  'Cerrillos', 'Cerro Navia', 'Conchalí', 'El Bosque', 'Estación Central', 'Huechuraba', 'Independencia', 
  'La Cisterna', 'La Florida', 'La Granja', 'La Pintana', 'La Reina', 'Las Condes', 'Lo Barnechea', 
  'Lo Espejo', 'Lo Prado', 'Macul', 'Maipú', 'Ñuñoa', 'Pedro Aguirre Cerda', 'Peñalolén', 'Providencia', 
  'Pudahuel', 'Quilicura', 'Quinta Normal', 'Recoleta', 'Renca', 'San Bernardo', 'San Joaquín', 
  'San Miguel', 'San Ramón', 'Santiago', 'Vitacura'
];

interface AgendaItem {
  id: string;
  title: string;
  event_date: string;
  emoji: string;
  reminder_days: string;
}

interface PedidoItem {
  id: string;
  codigo_orden: string;
  total: number;
  tipo_entrega: string;
  detalles: any;
  created_at: string;
  puntos_ganados?: number;
  puntos_usados?: number;
  estado?: string;
}

export default function MiCuentaPage() {
  const [activeTab, setActiveTab] = useState('datos');
  const [userName, setUserName] = useState<string>('Cargando...');
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  
  // Estados para el formulario de Mis Datos
  const [nombre, setNombre] = useState('');
  const [apellido, setApellido] = useState('');
  const [edad, setEdad] = useState('');
  const [sexo, setSexo] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [emailInput, setEmailInput] = useState('');
  const [comuna, setComuna] = useState('');
  const [calle, setCalle] = useState('');
  const [numero, setNumero] = useState('');
  const [indicaciones, setIndicaciones] = useState('');

  const [isSaved, setIsSaved] = useState(false);

  // Estados de Pedidos
  const [pedidos, setPedidos] = useState<PedidoItem[]>([]);
  const { points: clubPoints, tier } = useClub();

  // Estados de Agenda
  const [agendaItems, setAgendaItems] = useState<AgendaItem[]>([]);
  const [showAgendaModal, setShowAgendaModal] = useState(false);
  const [editingAgendaId, setEditingAgendaId] = useState<string | null>(null);
  const [newTitle, setNewTitle] = useState('');
  const [newDate, setNewDate] = useState('');
  const [newEmoji, setNewEmoji] = useState('🎂');
  const [newReminder, setNewReminder] = useState('3');
  const [isAgendaLoading, setIsAgendaLoading] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3000);
  };

  useEffect(() => {
    const fetchUserAndData = async () => {
      const supabase = createClient();
      const { data, error } = await supabase.auth.getUser();
      
      if (error || !data.user) {
        window.location.href = '/registro';
        return;
      }
      
      const user = data.user;
      setCurrentUserId(user.id);
      const metadata = user.user_metadata || {};
      
      const fullName = metadata.full_name || user.email?.split('@')[0] || 'Usuario';
      setUserName(fullName);
      
      setNombre(metadata.first_name || fullName);
      setApellido(metadata.last_name || '');
      setEdad(metadata.age || '');
      setSexo(metadata.gender || '');
      setWhatsapp(metadata.phone || '');
      setEmailInput(user.email || '');
      setComuna(metadata.comuna || '');
      setCalle(metadata.address || '');
      setNumero(metadata.address_number || '');
      setIndicaciones(metadata.address_notes || '');

      // Fetch Agenda
      const { data: agendaData } = await supabase
        .from('agenda')
        .select('*')
        .eq('user_id', user.id)
        .order('event_date', { ascending: true });
        
      if (agendaData) {
        setAgendaItems(agendaData);
      }

      // Fetch Pedidos
      const { data: pedidosData } = await supabase
        .from('pedidos')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
        
      if (pedidosData) {
        // Mock evidence for demonstration on the first order
        if (pedidosData.length > 0) {
          pedidosData[0].detalles = {
            ...pedidosData[0].detalles,
            evidencia: {
              producto: 'https://images.unsplash.com/photo-1591886960571-74d43a9d4166?auto=format&fit=crop&w=800&q=80',
              entrega: 'https://images.unsplash.com/photo-1615671524827-c1fe3973cfaf?auto=format&fit=crop&w=800&q=80'
            }
          };
        }
        setPedidos(pedidosData);
      }
    };
    
    fetchUserAndData();
  }, []);

  // Suscripción en tiempo real a los cambios de estado de los pedidos
  useEffect(() => {
    if (!currentUserId) return;
    
    const supabase = createClient();
    const channel = supabase
      .channel('pedidos-updates')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'pedidos',
          filter: `user_id=eq.${currentUserId}`
        },
        (payload) => {
          // Actualizamos el pedido en el estado local con los nuevos datos
          setPedidos(prevPedidos => 
            prevPedidos.map(p => p.id === payload.new.id ? { ...p, ...payload.new } : p)
          );
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [currentUserId]);

  const handleSaveData = async (e: React.FormEvent) => {
    e.preventDefault();
    const supabase = createClient();
    
    // Guardar en Supabase metadata
    await supabase.auth.updateUser({
      data: {
        full_name: `${nombre} ${apellido}`.trim(),
        first_name: nombre,
        last_name: apellido,
        age: edad,
        gender: sexo,
        phone: whatsapp,
        comuna,
        address: calle,
        address_number: numero,
        address_notes: indicaciones
      }
    });
    
    setUserName(`${nombre} ${apellido}`.trim());
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  const openAddAgendaModal = () => {
    setEditingAgendaId(null);
    setNewTitle('');
    setNewDate('');
    setNewReminder('3');
    setShowAgendaModal(true);
  };

  const openEditAgendaModal = (item: AgendaItem) => {
    setEditingAgendaId(item.id);
    setNewTitle(item.title);
    setNewDate(item.event_date);
    setNewReminder(item.reminder_days || '3');
    setNewEmoji(item.emoji || '🎂');
    setShowAgendaModal(true);
  };

  const handleAddAgenda = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUserId || !newTitle || !newDate) return;
    setIsAgendaLoading(true);
    
    const supabase = createClient();

    if (editingAgendaId) {
      // Editar existente
      const { data, error } = await supabase.from('agenda').update({
        title: newTitle,
        event_date: newDate,
        emoji: newEmoji,
        reminder_days: newReminder
      }).eq('id', editingAgendaId).select();
      
      if (error) {
        showToast("Error actualizando fecha: " + error.message);
      } else if (data) {
        setAgendaItems(agendaItems.map(item => item.id === editingAgendaId ? data[0] : item).sort((a, b) => new Date(a.event_date).getTime() - new Date(b.event_date).getTime()));
        setShowAgendaModal(false);
      }
    } else {
      // Crear nuevo
      const { data, error } = await supabase.from('agenda').insert([
        {
          user_id: currentUserId,
          title: newTitle,
          event_date: newDate,
          emoji: newEmoji,
          reminder_days: newReminder
        }
      ]).select();
      
      if (error) {
        showToast("Error guardando fecha: " + error.message);
      } else if (data) {
        setAgendaItems([...agendaItems, data[0]].sort((a, b) => new Date(a.event_date).getTime() - new Date(b.event_date).getTime()));
        setShowAgendaModal(false);
      }
    }
    
    setIsAgendaLoading(false);
  };

  const handleDeleteAgenda = async (id: string) => {
    if (!confirm('¿Seguro que quieres borrar esta fecha importante?')) return;
    const supabase = createClient();
    const { error } = await supabase.from('agenda').delete().eq('id', id);
    if (!error) {
      setAgendaItems(agendaItems.filter(item => item.id !== id));
    }
  };

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'long' };
    // Agregamos T12:00:00 para forzar el mediodía y evitar que el cambio de zona horaria reste un día
    return new Date(`${dateString}T12:00:00`).toLocaleDateString('es-CL', options);
  };

  const getNextOccurrence = (dateString: string) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const eventDate = new Date(`${dateString}T12:00:00`);
    
    let nextOccurrence = new Date(today.getFullYear(), eventDate.getMonth(), eventDate.getDate());
    
    // Si la fecha de este año ya pasó, la próxima ocurrencia es el próximo año
    if (nextOccurrence < today) {
      nextOccurrence.setFullYear(today.getFullYear() + 1);
    }
    return nextOccurrence;
  };

  const calculateDaysLeft = (dateString: string) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const nextOccurrence = getNextOccurrence(dateString);
    
    const diffTime = Math.abs(nextOccurrence.getTime() - today.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
    return diffDays;
  };

  const getReminderMessage = (daysLeft: number) => {
    if (daysLeft === 0) return "¡Es hoy! Sorprende con un detalle único. 🎁";
    if (daysLeft <= 7) return `¡Faltan solo ${daysLeft} días! No lo dejes para última hora. ⏰`;
    if (daysLeft <= 30) return `Faltan ${daysLeft} días. Anticípate y programa tu despacho. 🚚`;
    if (daysLeft <= 60) return `Faltan ${daysLeft} días. No te olvides que las flores están esperando ese día. 🌸`;
    return `Faltan ${daysLeft} días.`;
  };

  const downloadCalendarEvent = (item: AgendaItem) => {
    const nextOccurrence = getNextOccurrence(item.event_date);
    
    // Formato YYYYMMDD
    const formatDateForIcs = (date: Date) => {
      const d = new Date(date);
      let month = '' + (d.getMonth() + 1);
      let day = '' + d.getDate();
      const year = d.getFullYear();
      if (month.length < 2) month = '0' + month;
      if (day.length < 2) day = '0' + day;
      return [year, month, day].join('');
    };

    const startDate = formatDateForIcs(nextOccurrence);
    
    // Fin de evento (al día siguiente para ser de "todo el día")
    const endDateObj = new Date(nextOccurrence);
    endDateObj.setDate(endDateObj.getDate() + 1);
    const endDate = formatDateForIcs(endDateObj);

    const icsContent = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Chileflor//Agenda//ES
BEGIN:VEVENT
SUMMARY:${item.title}
DTSTART;VALUE=DATE:${startDate}
DTEND;VALUE=DATE:${endDate}
DESCRIPTION:Recordatorio importante guardado en tu Agenda de Chileflor. ¡Sorprende con las mejores flores!
END:VEVENT
END:VCALENDAR`;

    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `${item.title.replace(/\s+/g, '_')}.ics`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleLogout = async (e?: React.MouseEvent) => {
    if (e) e.preventDefault();
    try {
      const supabase = createClient();
      await supabase.auth.signOut();
      window.location.href = '/';
    } catch (err: any) {
      showToast("Error al cerrar sesión: " + (err.message || err));
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl animate-in fade-in duration-500 relative">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-8 right-8 z-50 bg-gray-900 text-white px-6 py-3 rounded-xl shadow-2xl font-bold animate-in slide-in-from-bottom-5">
          {toastMessage}
        </div>
      )}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Hola, {userName}</h1>
          <p className="text-gray-500 mt-1">Gestiona tus datos, pedidos, dedicatorias y agenda.</p>
        </div>
        <div className="flex flex-wrap sm:flex-nowrap items-stretch gap-4 w-full md:w-auto mt-4 md:mt-0">
          <div className="flex-1 bg-gradient-to-r from-primary to-primary-dark text-white px-6 py-4 rounded-2xl shadow-lg shadow-primary/20 flex items-center gap-4 min-w-[220px]">
            <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center text-2xl shrink-0">
              🏆
            </div>
            <div>
              <p className="text-sm opacity-90 font-medium">Nivel {tier}</p>
              <p className="text-2xl font-bold">{clubPoints.toLocaleString('es-CL')} <span className="text-sm font-normal">pts</span></p>
            </div>
          </div>
          
          <button 
            onClick={handleLogout}
            className="relative z-[9999] cursor-pointer flex-1 sm:flex-none flex items-center justify-center gap-2 bg-red-50 text-red-600 hover:bg-red-100 px-5 py-4 rounded-2xl font-bold transition-colors border border-red-100 shadow-sm"
          >
            <span className="text-lg">🚪</span> Salir
          </button>
        </div>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-4 mb-4 scrollbar-hide relative z-30">
        {['datos', 'pedidos', 'agenda', 'suscripciones'].map(tab => (
          <button 
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-6 py-3 rounded-full font-medium transition-colors capitalize whitespace-nowrap ${activeTab === tab ? 'bg-gray-900 text-white shadow-md' : 'bg-white text-gray-700 border border-gray-200 hover:border-gray-300'}`}
          >
            {tab === 'datos' ? 'Mis Datos' : tab}
          </button>
        ))}
      </div>

      <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-gray-100 min-h-[400px]">
        
        {activeTab === 'datos' && (
          <div className="max-w-2xl">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Información Personal y Logística</h2>
            
            <form onSubmit={handleSaveData} className="space-y-6">
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Nombre</label>
                  <input type="text" value={nombre} onChange={(e) => setNombre(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all bg-gray-50" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Apellido</label>
                  <input type="text" value={apellido} onChange={(e) => setApellido(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all bg-gray-50" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Correo Electrónico</label>
                  <input type="email" value={emailInput} disabled
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-100 text-gray-500 cursor-not-allowed outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">WhatsApp</label>
                  <input type="tel" value={whatsapp} onChange={(e) => setWhatsapp(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all bg-gray-50" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Edad</label>
                  <input type="number" value={edad} onChange={(e) => setEdad(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all bg-gray-50" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Sexo</label>
                  <select value={sexo} onChange={(e) => setSexo(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all bg-gray-50 appearance-none">
                    <option value="" disabled>Selecciona una opción</option>
                    <option value="Femenino">Femenino</option>
                    <option value="Masculino">Masculino</option>
                    <option value="No binario">No binario</option>
                    <option value="No especifico">Prefiero no decirlo</option>
                  </select>
                </div>
              </div>

              <h3 className="font-bold text-gray-800 border-b pb-2 pt-4">Datos de Entrega (RM)</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Comuna</label>
                  <select value={comuna} onChange={(e) => setComuna(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all bg-gray-50 appearance-none">
                    <option value="" disabled>Selecciona tu comuna</option>
                    {COMUNAS_RM.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Calle / Pasaje</label>
                  <input type="text" value={calle} onChange={(e) => setCalle(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all bg-gray-50" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">N° Casa / Depto</label>
                  <input type="text" value={numero} onChange={(e) => setNumero(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all bg-gray-50" />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Otras Indicaciones (Opcional)</label>
                  <textarea value={indicaciones} onChange={(e) => setIndicaciones(e.target.value)} rows={2}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all bg-gray-50 resize-none" />
                </div>
              </div>

              <div className="pt-4 flex items-center gap-4">
                <button 
                  type="submit"
                  className="bg-gray-900 text-white font-bold px-8 py-3 rounded-xl hover:bg-gray-800 transition-colors shadow-md"
                >
                  Guardar Cambios
                </button>
                {isSaved && (
                  <span className="text-green-600 font-medium text-sm animate-in fade-in">
                    ✓ Datos actualizados correctamente
                  </span>
                )}
              </div>
            </form>
          </div>
        )}

        {/* PESTAÑA: PEDIDOS */}
        {activeTab === 'pedidos' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <span>🛒</span> Historial de Compras
            </h2>
            
            {pedidos.length === 0 ? (
              <div className="bg-gray-50 p-8 rounded-3xl border border-dashed border-gray-200 text-center text-gray-500">
                <div className="text-4xl mb-3 opacity-50">🛍️</div>
                <h3 className="text-gray-900 font-bold mb-1">Aún no tienes pedidos</h3>
                <p className="mb-6 text-sm">Tus próximas compras de Chileflor aparecerán aquí para que puedas gestionarlas o repetirlas fácilmente.</p>
                <a href="/checkout" className="inline-block bg-gray-900 text-white px-8 py-3 rounded-xl font-bold hover:bg-gray-800 transition-colors shadow-md">Ir a Comprar</a>
              </div>
            ) : (
              <div className="space-y-4">
                {pedidos.map(pedido => (
                  <div key={pedido.id} className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 hover:border-primary/20 hover:shadow-md transition-all">
                    
                    {/* Info del pedido */}
                    <div className="flex-1">
                      <div className="flex flex-wrap items-center gap-3 mb-2">
                        <span className="bg-primary/10 text-primary text-xs font-bold px-3 py-1 rounded-lg uppercase tracking-wider">{pedido.codigo_orden}</span>
                        
                        <span className={`text-xs font-bold px-3 py-1 rounded-lg uppercase tracking-wider ${
                          pedido.estado?.toLowerCase() === 'ok' ? 'bg-green-500 text-white shadow-sm shadow-green-500/20' : 
                          pedido.estado?.toLowerCase() === 'completado' ? 'bg-green-100 text-green-700' :
                          pedido.estado?.toLowerCase() === 'en_ruta' ? 'bg-blue-100 text-blue-700' :
                          pedido.estado === 'pagado' ? 'bg-orange-100 text-orange-700' :
                          pedido.estado === 'pending_payment' ? 'bg-yellow-100 text-yellow-700' :
                          'bg-gray-100 text-gray-700'
                        }`}>
                          {pedido.estado === 'pending_payment' ? 'Pendiente Pago' : 
                           pedido.estado === 'pagado' ? 'Preparando' : 
                           pedido.estado === 'ok' ? '✓ OK' :
                           pedido.estado || 'Recibido'}
                        </span>

                        <span className="text-sm font-medium text-gray-500 flex items-center gap-1">
                          📅 {new Date(pedido.created_at).toLocaleDateString('es-CL')}
                        </span>
                      </div>
                      
                      <p className="text-gray-900 font-bold text-lg mb-1">
                        {pedido.detalles?.items?.[0]?.nombre || 'Pedido Chileflor'}
                      </p>
                      
                      <div className="text-sm text-gray-600 flex items-center gap-2 mb-3">
                        <span className="bg-gray-100 px-2 py-0.5 rounded text-gray-700 capitalize flex items-center gap-1">
                          {pedido.tipo_entrega === 'domicilio' ? '📍' : '🪦'} {pedido.tipo_entrega}
                        </span>
                        {pedido.tipo_entrega === 'cementerio' && pedido.detalles?.cementerio && (
                          <span className="text-xs italic text-gray-500 border-l border-gray-300 pl-2">
                            {pedido.detalles.cementerio.recinto}
                          </span>
                        )}
                        
                        {((pedido.puntos_ganados || 0) > 0 || (pedido.puntos_usados || 0) > 0) && (
                          <div className="flex items-center gap-2 border-l border-gray-300 pl-2 ml-1">
                            {(pedido.puntos_ganados || 0) > 0 && <span className="text-green-600 font-bold text-xs flex items-center gap-1">🏆 +{pedido.puntos_ganados} pts</span>}
                            {(pedido.puntos_usados || 0) > 0 && <span className="text-red-500 font-bold text-xs flex items-center gap-1">🏷️ -{pedido.puntos_usados} pts</span>}
                          </div>
                        )}
                      </div>

                      {/* Sección de Evidencia Fotográfica */}
                      {pedido.detalles?.evidencia && (
                        <div className="mt-4 pt-4 border-t border-gray-100 w-full">
                          <p className="text-xs text-gray-500 font-bold uppercase tracking-widest mb-3 flex items-center gap-1">
                            📸 Evidencia Fotográfica
                          </p>
                          <div className="flex gap-4">
                            {pedido.detalles.evidencia.producto && (
                              <div className="flex flex-col gap-1 w-24">
                                <img src={pedido.detalles.evidencia.producto} alt="Producto Terminado" className="w-24 h-24 object-cover rounded-xl shadow-sm border border-gray-200" />
                                <span className="text-[10px] text-center text-gray-500 font-medium">Preparado</span>
                              </div>
                            )}
                            {pedido.detalles.evidencia.entrega && (
                              <div className="flex flex-col gap-1 w-24">
                                <img src={pedido.detalles.evidencia.entrega} alt="Entregado" className="w-24 h-24 object-cover rounded-xl shadow-sm border border-gray-200" />
                                <span className="text-[10px] text-center text-gray-500 font-medium">Entregado</span>
                              </div>
                            )}
                            {pedido.detalles.evidencia.antes && (
                              <div className="flex flex-col gap-1 w-24">
                                <img src={pedido.detalles.evidencia.antes} alt="Antes" className="w-24 h-24 object-cover rounded-xl shadow-sm border border-gray-200" />
                                <span className="text-[10px] text-center text-gray-500 font-medium">Antes</span>
                              </div>
                            )}
                            {pedido.detalles.evidencia.despues && (
                              <div className="flex flex-col gap-1 w-24">
                                <img src={pedido.detalles.evidencia.despues} alt="Después" className="w-24 h-24 object-cover rounded-xl shadow-sm border border-gray-200" />
                                <span className="text-[10px] text-center text-green-600 font-bold">Después</span>
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                    

                    {/* Botones y Total */}
                    <div className="flex flex-col sm:flex-row items-center gap-4 w-full md:w-auto md:border-l md:border-gray-100 md:pl-6">
                      <div className="text-center sm:text-right w-full sm:w-auto mb-2 sm:mb-0">
                        <p className="text-xs text-gray-400 uppercase tracking-widest font-semibold mb-1">Total Pagado</p>
                        <p className="text-2xl font-black text-gray-900">${pedido.total?.toLocaleString('es-CL')}</p>
                      </div>
                      
                      <button 
                        onClick={() => {
                          const itemsCount = pedido.detalles?.items?.[0]?.cantidad || 1;
                          const itemName = pedido.detalles?.items?.[0]?.nombre || 'Ramo de Rosas Premium';
                          let message = `¡Hola Chileflor! 🌸 Quiero REPETIR mi pedido anterior (*${pedido.codigo_orden}*).\n\n`;
                          message += `*Detalle:*\n- ${itemName} (Cant: ${itemsCount})\n`;
                          message += `*Total a pagar:* $${pedido.total?.toLocaleString('es-CL')}\n\n`;
                          message += `*Entrega:* ${pedido.tipo_entrega === 'domicilio' ? '📍 Domicilio' : '🪦 Cementerio'}\n`;
                          
                          if (pedido.tipo_entrega === 'cementerio' && pedido.detalles?.cementerio) {
                            message += `*Recinto:* ${pedido.detalles.cementerio.recinto}\n`;
                            message += `*Patio/Sector:* ${pedido.detalles.cementerio.sector || 'No especificado'}\n`;
                            message += `*Nº Lápida:* ${pedido.detalles.cementerio.lapida || 'No especificado'}\n`;
                          }
                          
                          message += `\nPor favor, envíame el link de pago para confirmar. ¡Gracias!`;
                          
                          const whatsappUrl = `https://wa.me/56979992848?text=${encodeURIComponent(message)}`;
                          window.open(whatsappUrl, '_blank');
                        }}
                        className="w-full sm:w-auto bg-[#25D366] hover:bg-[#128C7E] text-white px-6 py-3 rounded-xl text-sm font-bold transition-colors flex items-center justify-center gap-2 shadow-lg shadow-[#25D366]/30 whitespace-nowrap group"
                      >
                        <svg className="w-5 h-5 group-hover:scale-110 transition-transform" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                        Repetir Compra
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* PESTAÑA: AGENDA */}
        {activeTab === 'agenda' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-900">Agenda de Vínculos</h2>
              <button 
                onClick={openAddAgendaModal}
                className="bg-primary text-white font-bold px-4 py-2 rounded-xl text-sm hover:bg-primary-dark transition-transform hover:-translate-y-0.5 shadow-md shadow-primary/20"
              >
                + Agregar Fecha
              </button>
            </div>
            <p className="text-gray-500 mb-8">Registra fechas importantes y te recordaremos con anticipación para que nunca lo olvides.</p>
            
            {agendaItems.length === 0 ? (
              <div className="text-center py-12 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                <div className="text-4xl mb-3">📅</div>
                <h3 className="text-gray-900 font-bold">Aún no tienes fechas guardadas</h3>
                <p className="text-gray-500 text-sm mt-1">Agrega cumpleaños o aniversarios para recibir recordatorios.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {agendaItems.map(item => {
                  const daysLeft = calculateDaysLeft(item.event_date);
                  
                  return (
                    <div key={item.id} className="relative border border-gray-100 rounded-2xl overflow-hidden hover:border-primary/30 transition-all group bg-white shadow-sm hover:shadow-lg flex flex-col h-full">
                      
                      <div className="p-6 pb-4 flex-grow">
                        <div className="absolute top-4 right-4 flex gap-2">
                          <button 
                            onClick={() => openEditAgendaModal(item)}
                            className="text-gray-300 hover:text-blue-500 transition-colors bg-white/80 rounded-full p-1"
                            title="Editar"
                          >
                            ✏️
                          </button>
                          <button 
                            onClick={() => handleDeleteAgenda(item.id)}
                            className="text-gray-300 hover:text-red-500 transition-colors bg-white/80 rounded-full p-1"
                            title="Eliminar"
                          >
                            🗑️
                          </button>
                        </div>
                        
                        <div className="text-4xl mb-3">{item.emoji}</div>
                        <h3 className="font-bold text-xl text-gray-900 mb-1 pr-14">{item.title}</h3>
                        <p className="text-sm font-medium text-gray-500 capitalize flex items-center gap-2">
                          📅 {formatDate(item.event_date)}
                        </p>
                        
                        {/* Mensaje Dinámico */}
                        <div className="mt-4 p-3 bg-primary/5 rounded-xl border border-primary/10">
                          <p className="text-sm text-primary-dark font-medium leading-snug">
                            {getReminderMessage(daysLeft)}
                          </p>
                        </div>
                      </div>

                      {/* Botón Guardar en Calendario */}
                      <div className="border-t border-gray-100 p-4 bg-gray-50 flex items-center justify-between">
                        <span className="text-xs text-gray-500 font-medium">🔔 Alarma a los {item.reminder_days} días</span>
                        <button 
                          onClick={() => downloadCalendarEvent(item)}
                          className="flex items-center gap-2 text-xs font-bold text-gray-700 bg-white border border-gray-200 px-3 py-1.5 rounded-lg hover:bg-gray-100 hover:text-primary transition-colors shadow-sm"
                        >
                          <span>📱</span> Guardar en Celular
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* Modal Agregar/Editar Agenda */}
        {showAgendaModal && (
          <div className="fixed inset-0 bg-black/50 z-[9999] flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl p-6 max-w-sm w-full shadow-2xl">
              <h3 className="font-bold text-lg mb-4">{editingAgendaId ? 'Editar Fecha Especial' : 'Nueva Fecha Especial'}</h3>
              <form onSubmit={handleAddAgenda} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-gray-500 mb-1">Título</label>
                  <input type="text" value={newTitle} onChange={(e) => setNewTitle(e.target.value)} required placeholder="Ej: Cumpleaños Mamá" className="w-full px-4 py-2 border rounded-xl outline-none" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 mb-1">Fecha</label>
                  <input type="date" value={newDate} onChange={(e) => setNewDate(e.target.value)} required className="w-full px-4 py-2 border rounded-xl outline-none" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 mb-1">Días de anticipación (Alarma)</label>
                  <input type="number" min="3" value={newReminder} onChange={(e) => setNewReminder(e.target.value)} required className="w-full px-4 py-2 border rounded-xl outline-none" />
                  <p className="text-[10px] text-gray-400 mt-1">Mínimo 3 días de anticipación recomendados.</p>
                </div>
                <div className="flex justify-end gap-3 mt-6">
                  <button type="button" onClick={() => setShowAgendaModal(false)} className="px-4 py-2 text-gray-500 font-medium">Cancelar</button>
                  <button type="submit" disabled={isAgendaLoading} className="bg-primary text-white px-6 py-2 rounded-xl font-bold hover:bg-primary-dark">
                    {isAgendaLoading ? 'Guardando...' : 'Guardar'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* PESTAÑA: SUSCRIPCIONES */}
        {activeTab === 'suscripciones' && (
          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">Mantenciones de Cementerio</h2>
            <p className="text-gray-500 mb-8">Historial de limpieza y recambio floral de tus suscripciones.</p>
            
            <div className="border border-gray-100 rounded-2xl overflow-hidden">
              <div className="p-4 bg-gray-50 border-b border-gray-100 flex justify-between items-center">
                <div>
                  <p className="font-bold text-gray-900">Parque El Prado, Sector C, Lápida 42</p>
                  <p className="text-sm text-gray-500">Plan Bimensual - Última visita: Hace 2 días</p>
                </div>
                <span className="bg-green-100 text-green-700 text-xs font-bold px-3 py-1 rounded-full">Activa</span>
              </div>
              <div className="p-6">
                <h3 className="text-sm font-medium text-gray-700 mb-4">Evidencia de la última visita</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="aspect-[4/3] bg-gray-200 rounded-xl mb-2 flex items-center justify-center text-gray-400 overflow-hidden">
                      <img src="https://images.unsplash.com/photo-1544027732-e4d0d08a2879?auto=format&fit=crop&w=800&q=80" className="w-full h-full object-cover" />
                    </div>
                    <p className="text-sm text-center text-gray-500">Antes</p>
                  </div>
                  <div>
                    <div className="aspect-[4/3] bg-gray-200 rounded-xl mb-2 flex items-center justify-center text-gray-400 overflow-hidden">
                      <img src="https://images.unsplash.com/photo-1522068936647-97d8b5a004dc?auto=format&fit=crop&w=800&q=80" className="w-full h-full object-cover" />
                    </div>
                    <p className="text-sm text-center font-medium text-primary">Después</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
