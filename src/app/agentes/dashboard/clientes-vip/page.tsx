'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase/client';
import { useAgentAuth } from '@/context/AgentAuthContext';
import { Crown, Search, Calendar, Package, Star, User, Phone, Mail, Clock, RefreshCw } from 'lucide-react';

export default function VIPCRM() {
  const { agent } = useAgentAuth();
  
  const [clientes, setClientes] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  
  // Vista 360 del Cliente Seleccionado
  const [selectedClient, setSelectedClient] = useState<any>(null);
  const [clientPedidos, setClientPedidos] = useState<any[]>([]);
  const [clientAgenda, setClientAgenda] = useState<any[]>([]);

  useEffect(() => {
    fetchClientes();
  }, []);

  async function fetchClientes() {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('clientes_vip')
        .select('*')
        .order('created_at', { ascending: false });
        
      if (error) throw error;
      setClientes(data || []);
    } catch (err) {
      console.error('Error fetching VIP clients', err);
    } finally {
      setLoading(false);
    }
  }

  const loadClient360 = async (cliente: any) => {
    setSelectedClient(cliente);
    
    // Fetch Pedidos
    const { data: pedidos } = await supabase
      .from('pedidos')
      .select('*')
      .filter('detalles->comprador->>email', 'ilike', cliente.email)
      .order('created_at', { ascending: false })
      .limit(5);
    setClientPedidos(pedidos || []);

    // Fetch Agenda
    const { data: agenda } = await supabase
      .from('vip_agenda')
      .select('*')
      .eq('email_cliente', cliente.email)
      .order('fecha_evento', { ascending: true });
    setClientAgenda(agenda || []);
  };

  const filteredClientes = clientes.filter(c => 
    c.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    c.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="animate-in fade-in duration-500 relative flex flex-col h-full max-h-[85vh]">
      
      {/* Header */}
      <div className="flex justify-between items-center mb-6 shrink-0">
        <div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight flex items-center gap-3">
            <Crown className="text-fuchsia-400" size={32} /> CRM: Clientes VIP
          </h1>
          <p className="text-gray-400 mt-1">Gestión y vista 360° de los miembros del Club Chileflor.</p>
        </div>
        
        <div className="flex gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
            <input 
              type="text" 
              placeholder="Buscar cliente..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-[#181820] border border-white/10 rounded-2xl py-2.5 pl-10 pr-4 text-sm text-white focus:outline-none focus:border-fuchsia-500/50 w-64 transition-all"
            />
          </div>
          <button onClick={fetchClientes} className="bg-white/5 hover:bg-white/10 text-white font-bold p-2.5 rounded-2xl border border-white/10 transition-all flex items-center justify-center">
            <RefreshCw size={18} className={loading ? "animate-spin" : ""} />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1 min-h-0">
        
        {/* LISTA DE CLIENTES */}
        <div className="lg:col-span-1 bg-[#111116]/90 border border-white/5 rounded-3xl overflow-hidden flex flex-col shadow-xl">
          <div className="p-4 border-b border-white/5 bg-[#181820]">
            <h2 className="font-bold text-white text-sm uppercase tracking-widest flex items-center gap-2">
              <User size={16} className="text-fuchsia-400" /> Miembros Registrados ({clientes.length})
            </h2>
          </div>
          
          <div className="flex-1 overflow-y-auto p-3 space-y-2">
            {loading ? (
              <div className="flex justify-center py-10">
                <div className="w-8 h-8 border-2 border-fuchsia-500 border-t-transparent rounded-full animate-spin"></div>
              </div>
            ) : filteredClientes.map(cliente => (
              <button 
                key={cliente.email}
                onClick={() => loadClient360(cliente)}
                className={`w-full text-left p-4 rounded-xl border transition-all flex items-center justify-between group ${
                  selectedClient?.email === cliente.email 
                    ? 'bg-fuchsia-900/20 border-fuchsia-500/30 shadow-lg' 
                    : 'bg-[#181820] border-transparent hover:border-white/10'
                }`}
              >
                <div>
                  <h3 className="font-bold text-white text-sm">{cliente.full_name}</h3>
                  <p className="text-xs text-gray-500 truncate max-w-[150px]">{cliente.email}</p>
                </div>
                <div className="text-right">
                  <span className={`text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md ${
                    cliente.tier === 'GOLD' ? 'bg-yellow-500/20 text-yellow-500' :
                    cliente.tier === 'SILVER' ? 'bg-gray-300/20 text-gray-300' :
                    'bg-orange-500/20 text-orange-400'
                  }`}>
                    {cliente.tier}
                  </span>
                  <p className="text-xs text-fuchsia-400 font-bold mt-1">{cliente.puntos_actuales} pts</p>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* VISTA 360 CRM */}
        <div className="lg:col-span-2 bg-[#111116]/90 border border-white/5 rounded-3xl overflow-hidden flex flex-col shadow-xl relative">
          {!selectedClient ? (
            <div className="flex-1 flex flex-col items-center justify-center text-gray-500 p-10 text-center">
              <Crown className="w-20 h-20 mb-6 opacity-20 text-fuchsia-400" />
              <h2 className="text-xl font-bold text-white mb-2">Vista 360° del Cliente</h2>
              <p className="max-w-md">Selecciona un cliente de la lista para ver su perfil completo, historial de compras, puntos acumulados y fechas importantes.</p>
            </div>
          ) : (
            <div className="flex-1 overflow-y-auto">
              
              {/* Profile Header */}
              <div className="bg-gradient-to-r from-fuchsia-900/40 via-[#181820] to-[#181820] p-8 border-b border-white/5">
                <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                  <div className="flex items-center gap-5">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-fuchsia-500 to-purple-600 flex items-center justify-center text-2xl font-black text-white shadow-xl shadow-fuchsia-900/50">
                      {selectedClient.full_name.charAt(0)}
                    </div>
                    <div>
                      <h2 className="text-2xl font-black text-white leading-none mb-1">{selectedClient.full_name}</h2>
                      <div className="flex items-center gap-4 mt-2 text-sm text-gray-400">
                        <span className="flex items-center gap-1"><Mail size={14} /> {selectedClient.email}</span>
                        {selectedClient.phone && <span className="flex items-center gap-1"><Phone size={14} /> {selectedClient.phone}</span>}
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-black/40 backdrop-blur-md border border-white/10 px-5 py-3 rounded-2xl text-center">
                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-1">Balance de Puntos</p>
                    <p className="text-2xl font-black text-fuchsia-400 flex items-center gap-2 justify-center">
                      <Star size={20} className="fill-fuchsia-400" /> {selectedClient.puntos_actuales}
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
                
                {/* Fechas Importantes */}
                <div>
                  <h3 className="text-sm font-bold text-white uppercase tracking-widest mb-4 flex items-center gap-2">
                    <Calendar size={18} className="text-fuchsia-400" /> Fechas en Agenda
                  </h3>
                  
                  {clientAgenda.length === 0 ? (
                    <div className="bg-[#181820] rounded-2xl p-6 text-center border border-white/5">
                      <p className="text-gray-500 text-sm">El cliente no ha registrado fechas importantes aún.</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {clientAgenda.map(item => {
                        const eventDate = new Date(item.fecha_evento);
                        eventDate.setMinutes(eventDate.getMinutes() + eventDate.getTimezoneOffset());
                        
                        // Calcular si es pronto (en los próximos 14 días)
                        const today = new Date();
                        const nextOccurrence = new Date(today.getFullYear(), eventDate.getMonth(), eventDate.getDate());
                        if (nextOccurrence < today) nextOccurrence.setFullYear(today.getFullYear() + 1);
                        const daysLeft = Math.ceil((nextOccurrence.getTime() - today.getTime()) / (1000 * 3600 * 24));
                        const isSoon = daysLeft <= 14;

                        return (
                          <div key={item.id} className={`bg-[#181820] border rounded-2xl p-4 flex justify-between items-center ${isSoon ? 'border-fuchsia-500/50 shadow-[0_0_15px_rgba(217,70,239,0.1)]' : 'border-white/5'}`}>
                            <div>
                              <p className="font-bold text-white text-sm">{item.titulo_evento}</p>
                              <p className="text-gray-400 text-xs mt-0.5">{eventDate.toLocaleDateString('es-CL', { day: 'numeric', month: 'long' })}</p>
                            </div>
                            <div className="text-right">
                              <span className={`text-[10px] font-bold px-2 py-1 rounded-full ${isSoon ? 'bg-fuchsia-500/20 text-fuchsia-400' : 'bg-white/5 text-gray-400'}`}>
                                {isSoon ? `Faltan ${daysLeft} días` : 'Próximamente'}
                              </span>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  )}
                </div>

                {/* Últimos Pedidos */}
                <div>
                  <h3 className="text-sm font-bold text-white uppercase tracking-widest mb-4 flex items-center gap-2">
                    <Package size={18} className="text-fuchsia-400" /> Últimos Pedidos
                  </h3>
                  
                  {clientPedidos.length === 0 ? (
                    <div className="bg-[#181820] rounded-2xl p-6 text-center border border-white/5">
                      <p className="text-gray-500 text-sm">El cliente no tiene compras registradas en el sistema.</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {clientPedidos.map(p => (
                        <div key={p.id} className="bg-[#181820] border border-white/5 rounded-2xl p-4 flex flex-col gap-2">
                          <div className="flex justify-between items-center">
                            <span className="font-mono text-xs font-bold text-gray-300">{p.codigo_orden}</span>
                            <span className="text-[10px] font-bold uppercase tracking-wider text-gray-500">
                              {new Date(p.created_at).toLocaleDateString()}
                            </span>
                          </div>
                          <div className="flex justify-between items-end mt-1">
                            <div>
                              <p className="text-white font-bold text-sm">${p.total?.toLocaleString('es-CL')}</p>
                              <p className="text-xs text-gray-500 mt-0.5">{p.detalles?.items?.length || 0} ítems</p>
                            </div>
                            <span className={`text-[10px] font-black px-2 py-1 rounded uppercase ${
                              p.estado === 'entregado' ? 'bg-green-500/20 text-green-400' :
                              p.estado === 'pagado' ? 'bg-blue-500/20 text-blue-400' :
                              'bg-yellow-500/20 text-yellow-400'
                            }`}>
                              {p.estado}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

              </div>

              {/* Acciones Recomendadas / Next Best Action (Simulado para UI) */}
              <div className="px-8 pb-8">
                <div className="bg-gradient-to-r from-blue-900/20 to-indigo-900/20 border border-blue-500/20 rounded-2xl p-6">
                  <h3 className="text-sm font-bold text-blue-400 uppercase tracking-widest mb-2 flex items-center gap-2">
                    <Clock size={16} /> Próxima Acción Sugerida (IA)
                  </h3>
                  <p className="text-white text-sm font-medium">
                    {clientAgenda.length > 0 
                      ? `El cliente tiene una fecha importante acercándose. Ideal para enviar un código de descuento de 15% personalizado 7 días antes.`
                      : `Invita al cliente a completar su "Agenda de Fechas" ofreciéndole +500 puntos VIP extra.`}
                  </p>
                </div>
              </div>

            </div>
          )}
        </div>

      </div>
    </div>
  );
}
