'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase/client';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Crown, Package, Calendar, Star, LogOut, Plus, Trash2 } from 'lucide-react';

export default function MiCuentaDashboard() {
  const router = useRouter();
  
  const [activeTab, setActiveTab] = useState('resumen');
  const [profile, setProfile] = useState<any>(null);
  const [pedidos, setPedidos] = useState<any[]>([]);
  const [agenda, setAgenda] = useState<any[]>([]);
  const [historialPuntos, setHistorialPuntos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Estados para nuevo evento
  const [newEventTitle, setNewEventTitle] = useState('');
  const [newEventDate, setNewEventDate] = useState('');

  useEffect(() => {
    async function checkAuth() {
      // 1. Verificar sesión de Supabase (Google/Apple Auth)
      const { data: { session } } = await supabase.auth.getSession();
      let email = session?.user?.email;

      // 2. Fallback a localStorage (Login rápido legacy)
      if (!email) {
        email = localStorage.getItem('vip_customer_email') || undefined;
      }

      if (!email) {
        router.push('/club');
        return;
      }
      
      // Guardar en localStorage para consistencia si viene de OAuth
      localStorage.setItem('vip_customer_email', email);
      
      fetchData(email);
    }
    
    checkAuth();
  }, [router]);

  async function fetchData(email: string) {
    setLoading(true);
    try {
      // 1. Fetch Profile
      const { data: profileData } = await supabase
        .from('clientes_vip')
        .select('*')
        .eq('email', email)
        .maybeSingle();
      
      if (!profileData) {
        localStorage.removeItem('vip_customer_email');
        router.push('/club');
        return;
      }
      setProfile(profileData);

      // 2. Fetch Pedidos (buscando el email dentro del JSONB detalles)
      // Supabase supports querying JSONB: filter where detalles->comprador->>email == email
      const { data: pedidosData } = await supabase
        .from('pedidos')
        .select('*')
        .filter('detalles->comprador->>email', 'ilike', email)
        .order('created_at', { ascending: false });
      
      if (pedidosData) setPedidos(pedidosData);

      // 3. Fetch Agenda
      const { data: agendaData } = await supabase
        .from('vip_agenda')
        .select('*')
        .eq('email_cliente', email)
        .order('fecha_evento', { ascending: true });
      
      if (agendaData) setAgenda(agendaData);

      // 4. Fetch Historial Puntos
      const { data: puntosData } = await supabase
        .from('vip_historial_puntos')
        .select('*')
        .eq('email_cliente', email)
        .order('created_at', { ascending: false });
      
      if (puntosData) setHistorialPuntos(puntosData);

    } catch (error) {
      console.error('Error fetching dashboard data', error);
    } finally {
      setLoading(false);
    }
  }

  const handleLogout = async () => {
    await supabase.auth.signOut();
    localStorage.removeItem('vip_customer_email');
    router.push('/club');
  };

  const handleAddEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEventTitle || !newEventDate || !profile) return;

    try {
      const { data, error } = await supabase.from('vip_agenda').insert([{
        email_cliente: profile.email,
        titulo_evento: newEventTitle,
        fecha_evento: newEventDate
      }]).select().single();

      if (error) throw error;

      setAgenda([...agenda, data].sort((a, b) => new Date(a.fecha_evento).getTime() - new Date(b.fecha_evento).getTime()));
      setNewEventTitle('');
      setNewEventDate('');
    } catch (err) {
      alert('Error agregando fecha');
    }
  };

  const handleDeleteEvent = async (id: string) => {
    try {
      await supabase.from('vip_agenda').delete().eq('id', id);
      setAgenda(agenda.filter(a => a.id !== id));
    } catch (err) {
      alert('Error eliminando fecha');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0A0A0C] text-white flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-fuchsia-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0A0A0C] text-white flex flex-col font-sans">
      <Header />
      
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 py-12 md:py-20 flex flex-col md:flex-row gap-8">
        
        {/* Sidebar Navigation */}
        <aside className="w-full md:w-64 shrink-0 space-y-2">
          <div className="bg-[#111116] border border-white/5 rounded-2xl p-6 mb-6 text-center shadow-lg">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-fuchsia-600 to-purple-600 mx-auto mb-3 flex items-center justify-center text-xl font-bold text-white shadow-xl shadow-fuchsia-900/50">
              {profile?.full_name?.charAt(0) || 'V'}
            </div>
            <h2 className="font-bold text-lg">{profile?.full_name}</h2>
            <p className="text-gray-400 text-xs truncate">{profile?.email}</p>
            <div className="mt-3 inline-block px-3 py-1 bg-fuchsia-500/20 text-fuchsia-400 text-xs font-black rounded-full uppercase tracking-wider border border-fuchsia-500/20">
              {profile?.tier} MEMBER
            </div>
          </div>

          <nav className="space-y-1">
            {[
              { id: 'resumen', icon: Crown, label: 'Mi Resumen' },
              { id: 'pedidos', icon: Package, label: 'Mis Pedidos' },
              { id: 'agenda', icon: Calendar, label: 'Fechas Importantes' },
              { id: 'puntos', icon: Star, label: 'Mis Puntos VIP' },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium text-sm ${
                  activeTab === tab.id 
                    ? 'bg-fuchsia-600 text-white shadow-lg shadow-fuchsia-900/30' 
                    : 'text-gray-400 hover:bg-white/5 hover:text-white'
                }`}
              >
                <tab.icon size={18} />
                {tab.label}
              </button>
            ))}
            
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium text-sm text-red-400 hover:bg-red-500/10 mt-8"
            >
              <LogOut size={18} />
              Cerrar Sesión
            </button>
          </nav>
        </aside>

        {/* Main Content Area */}
        <section className="flex-1 bg-[#111116] border border-white/5 rounded-3xl p-6 md:p-10 shadow-2xl min-h-[600px]">
          
          {/* TAB: RESUMEN */}
          {activeTab === 'resumen' && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <h2 className="text-2xl font-bold mb-8">¡Hola de nuevo, {profile?.full_name.split(' ')[0]}! 👋</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                <div className="bg-gradient-to-br from-[#1A1A24] to-[#121218] p-6 rounded-2xl border border-white/5">
                  <div className="flex items-center gap-3 mb-2 text-fuchsia-400">
                    <Star size={20} />
                    <h3 className="font-bold text-sm">Puntos Disponibles</h3>
                  </div>
                  <p className="text-4xl font-black text-white">{profile?.puntos_actuales}</p>
                </div>

                <div className="bg-gradient-to-br from-[#1A1A24] to-[#121218] p-6 rounded-2xl border border-white/5">
                  <div className="flex items-center gap-3 mb-2 text-blue-400">
                    <Package size={20} />
                    <h3 className="font-bold text-sm">Pedidos Totales</h3>
                  </div>
                  <p className="text-4xl font-black text-white">{pedidos.length}</p>
                </div>

                <div className="bg-gradient-to-br from-[#1A1A24] to-[#121218] p-6 rounded-2xl border border-white/5">
                  <div className="flex items-center gap-3 mb-2 text-green-400">
                    <Calendar size={20} />
                    <h3 className="font-bold text-sm">Próximos Eventos</h3>
                  </div>
                  <p className="text-4xl font-black text-white">{agenda.length}</p>
                </div>
              </div>

              <div className="bg-gradient-to-r from-fuchsia-900/40 to-purple-900/20 p-8 rounded-2xl border border-fuchsia-500/20 text-center">
                <Crown className="mx-auto text-fuchsia-400 mb-4" size={40} />
                <h3 className="text-xl font-bold mb-2">¡Sigue comprando y suma más puntos!</h3>
                <p className="text-gray-300 text-sm mb-6 max-w-md mx-auto">Tus puntos te permiten canjear descuentos exclusivos en tus futuros pedidos. ¡No dejes pasar tu próxima fecha importante!</p>
                <button onClick={() => router.push('/catalogo')} className="bg-white text-black font-bold px-8 py-3 rounded-xl hover:bg-gray-200 transition-colors shadow-xl">
                  Ir al Catálogo
                </button>
              </div>
            </div>
          )}

          {/* TAB: PEDIDOS */}
          {activeTab === 'pedidos' && (
            <div className="animate-in fade-in duration-500">
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-3"><Package className="text-fuchsia-500"/> Historial de Pedidos</h2>
              
              {pedidos.length === 0 ? (
                <div className="text-center py-20 text-gray-500">
                  <Package className="mx-auto mb-4 opacity-50" size={48} />
                  <p>Aún no tienes pedidos registrados.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {pedidos.map(p => (
                    <div key={p.id} className="bg-[#1A1A24] border border-white/5 p-5 rounded-2xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4 hover:border-white/10 transition-colors">
                      <div>
                        <div className="flex items-center gap-3 mb-1">
                          <span className="font-mono text-sm text-fuchsia-400 font-bold">{p.codigo_orden}</span>
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-gray-800 text-gray-300 uppercase tracking-widest">{new Date(p.created_at).toLocaleDateString()}</span>
                        </div>
                        <p className="text-white font-medium">{p.detalles?.items?.length || 0} producto(s)</p>
                        <p className="text-gray-400 text-sm">Destinatario: {p.detalles?.destinatario?.nombre || 'Tú'}</p>
                      </div>
                      <div className="text-right flex flex-row md:flex-col justify-between w-full md:w-auto items-center md:items-end">
                        <p className="font-bold text-lg">${p.total?.toLocaleString('es-CL')}</p>
                        <span className={`text-xs font-bold px-3 py-1 rounded-full mt-2
                          ${p.estado === 'pendiente' ? 'bg-yellow-500/20 text-yellow-400' : 
                            p.estado === 'pagado' ? 'bg-blue-500/20 text-blue-400' : 
                            p.estado === 'entregado' ? 'bg-green-500/20 text-green-400' : 'bg-gray-800 text-gray-400'}`}
                        >
                          {p.estado?.toUpperCase()}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB: AGENDA */}
          {activeTab === 'agenda' && (
            <div className="animate-in fade-in duration-500">
              <h2 className="text-2xl font-bold mb-2 flex items-center gap-3"><Calendar className="text-fuchsia-500"/> Fechas Importantes</h2>
              <p className="text-gray-400 text-sm mb-8">Guarda cumpleaños, aniversarios y fechas especiales. Te recordaremos para que sorprendas a tiempo.</p>
              
              <form onSubmit={handleAddEvent} className="bg-[#1A1A24] border border-white/5 p-6 rounded-2xl mb-8 flex flex-col sm:flex-row gap-4 items-end shadow-lg">
                <div className="w-full sm:flex-1">
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">¿Qué celebramos?</label>
                  <input type="text" required value={newEventTitle} onChange={e => setNewEventTitle(e.target.value)} placeholder="Ej. Cumpleaños de Mamá" className="w-full bg-[#111116] border border-gray-800 rounded-xl px-4 py-3 text-white focus:border-fuchsia-500 outline-none" />
                </div>
                <div className="w-full sm:w-48">
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Fecha</label>
                  <input type="date" required value={newEventDate} onChange={e => setNewEventDate(e.target.value)} className="w-full bg-[#111116] border border-gray-800 rounded-xl px-4 py-3 text-white focus:border-fuchsia-500 outline-none [color-scheme:dark]" />
                </div>
                <button type="submit" className="w-full sm:w-auto bg-fuchsia-600 hover:bg-fuchsia-500 text-white px-6 py-3 rounded-xl font-bold transition-colors flex items-center justify-center gap-2 h-[48px]">
                  <Plus size={18} /> Agregar
                </button>
              </form>

              {agenda.length === 0 ? (
                <div className="text-center py-10 text-gray-500">
                  <Calendar className="mx-auto mb-4 opacity-50" size={48} />
                  <p>Aún no tienes fechas guardadas.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {agenda.map(item => {
                    const eventDate = new Date(item.fecha_evento);
                    // Asegurar zona horaria correcta sumando el offset
                    eventDate.setMinutes(eventDate.getMinutes() + eventDate.getTimezoneOffset());
                    
                    return (
                      <div key={item.id} className="bg-[#1A1A24] border border-white/5 p-5 rounded-2xl flex justify-between items-center group hover:border-white/10 transition-colors">
                        <div>
                          <p className="font-bold text-white mb-1">{item.titulo_evento}</p>
                          <p className="text-fuchsia-400 text-sm font-medium">{eventDate.toLocaleDateString('es-CL', { day: 'numeric', month: 'long' })}</p>
                        </div>
                        <button onClick={() => handleDeleteEvent(item.id)} className="text-gray-600 hover:text-red-400 p-2 rounded-lg hover:bg-red-500/10 transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100">
                          <Trash2 size={18} />
                        </button>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          )}

          {/* TAB: PUNTOS */}
          {activeTab === 'puntos' && (
            <div className="animate-in fade-in duration-500">
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-3"><Star className="text-fuchsia-500"/> Historial de Puntos</h2>
              
              <div className="bg-gradient-to-r from-[#1A1A24] to-[#121218] border border-white/5 p-8 rounded-2xl mb-8 flex flex-col md:flex-row justify-between items-center shadow-lg gap-6">
                <div>
                  <p className="text-gray-400 text-sm mb-1 uppercase tracking-widest font-bold">Balance Actual</p>
                  <p className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-400 to-purple-400">{profile?.puntos_actuales} pts</p>
                </div>
                <div className="bg-[#111116] p-4 rounded-xl border border-gray-800 text-sm text-gray-300 max-w-sm">
                  Tus puntos pueden ser canjeados en el Checkout. Automáticamente se aplicará el descuento disponible al ingresar tu mismo correo electrónico.
                </div>
              </div>

              <div className="space-y-3">
                {historialPuntos.map(hp => (
                  <div key={hp.id} className="bg-[#1A1A24] border border-white/5 p-4 rounded-xl flex justify-between items-center">
                    <div>
                      <p className="font-medium text-white">{hp.descripcion}</p>
                      <p className="text-xs text-gray-500">{new Date(hp.created_at).toLocaleString()}</p>
                    </div>
                    <div className={`font-black ${hp.tipo_transaccion === 'EARN' ? 'text-green-400' : 'text-red-400'}`}>
                      {hp.tipo_transaccion === 'EARN' ? '+' : '-'}{hp.cantidad}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </section>
      </main>

      <Footer />
    </div>
  );
}
