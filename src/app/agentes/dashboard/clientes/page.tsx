'use client';

import { useState, useEffect } from 'react';
import { useAgentAuth } from '@/context/AgentAuthContext';
import { Search } from 'lucide-react';

export default function ClientesManagement() {
  const { agent } = useAgentAuth();
  
  const isAdmin = agent?.role === 'ADMIN';
  const canAdjustPoints = isAdmin || agent?.permissions?.ajustar_puntos_vip;

  const [activeTab, setActiveTab] = useState<'vip' | 'tumbas'>('vip');
  const [toastMessage, setToastMessage] = useState('');

  // --- Estados VIP ---
  const [clients, setClients] = useState<any[]>([]);
  const [selectedClient, setSelectedClient] = useState<any>(null);
  const [puntosToAdjust, setPuntosToAdjust] = useState<string>('');
  const [motivo, setMotivo] = useState('');
  
  const [showAddVip, setShowAddVip] = useState(false);
  const [newVipData, setNewVipData] = useState({ nombre: '', correo: '' });

  // --- Estados Tumbas ---
  const [tumbas, setTumbas] = useState<any[]>([]);
  const [showAddTumba, setShowAddTumba] = useState(false);
  const [newTumbaData, setNewTumbaData] = useState({
    nombre_cliente: '',
    telefono_contacto: '',
    correo: '',
    cementerio: '',
    ubicacion: '',
    nombre_difunto: '',
    frecuencia: 'Mensual',
    proximo_mantenimiento: ''
  });

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3000);
  };

  const loadData = async () => {
    try {
      const resVip = await fetch('/api/agentes/clientes');
      const dataVip = await resVip.json();
      
      const mappedClients = dataVip.map((c: any) => {
        const puntos = Math.floor(c.totalGastado / 1000);
        let nivel = 'Semilla';
        if (puntos >= 1000) nivel = 'Brote';
        if (puntos >= 5000) nivel = 'Flor VIP';
        
        return {
          ...c,
          puntos,
          nivel,
          compras: c.frecuencia,
        };
      });
      setClients(mappedClients);

      const resTumbas = await fetch('/api/suscripciones-tumbas');
      const dataTumbas = await resTumbas.json();
      setTumbas(dataTumbas);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // --- Funciones VIP ---
  const handleAdjustPoints = async (type: 'add' | 'subtract') => {
    showToast('El ajuste manual de puntos está deshabilitado. Los puntos se calculan por compras ($1.000 = 1 pt).');
  };

  const handleAddVip = async () => {
    showToast('Los clientes se agregan automáticamente al realizar compras.');
    setShowAddVip(false);
  };

  // --- Funciones Tumbas ---
  const handleAddTumba = async () => {
    if (!newTumbaData.nombre_cliente || !newTumbaData.telefono_contacto || !newTumbaData.cementerio) {
      showToast('Por favor completa los campos principales');
      return;
    }
    try {
      const res = await fetch('/api/suscripciones-tumbas', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...newTumbaData, estado: 'Activa' })
      });
      if (res.ok) {
        showToast('Suscripción agregada correctamente');
        setShowAddTumba(false);
        setNewTumbaData({
          nombre_cliente: '', telefono_contacto: '', correo: '', cementerio: '',
          ubicacion: '', nombre_difunto: '', frecuencia: 'Mensual', proximo_mantenimiento: ''
        });
        loadData();
      }
    } catch (e) {
      showToast('Error al agregar suscripción');
    }
  };

  const handleMarcarMantenimiento = async (id: string, fechaActual: string) => {
    if (!confirm('¿Marcar mantenimiento como realizado? Esto actualizará la próxima fecha de visita.')) return;
    try {
      // Calculamos próxima fecha (simplificado: suma 14 días si es quincenal, o 30 días si es mensual)
      const nextDate = new Date();
      nextDate.setDate(nextDate.getDate() + 30); // por defecto
      
      await fetch('/api/suscripciones-tumbas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, proximo_mantenimiento: nextDate.toISOString().split('T')[0] })
      });
      showToast('Mantenimiento registrado con éxito');
      loadData();
    } catch (e) {
      showToast('Error al registrar mantenimiento');
    }
  };

  return (
    <div className="animate-in fade-in duration-500 relative">
      {toastMessage && (
        <div className="fixed bottom-8 right-8 z-50 bg-green-500 text-white px-6 py-3 rounded-xl shadow-2xl font-bold animate-in slide-in-from-bottom-5">
          ✅ {toastMessage}
        </div>
      )}

      <header className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs font-bold uppercase tracking-widest mb-3">
            👑 Fidelización y Mantención
          </div>
          <h1 className="text-3xl font-black text-white tracking-tight mb-2">Club Chileflor VIP & Servicios</h1>
          <p className="text-gray-400 text-sm">Gestión de puntos de clientes destacados y suscripciones de cuidado de tumbas.</p>
        </div>
        <div className="flex gap-2 p-1.5 rounded-2xl bg-[#111116] border border-white/5 backdrop-blur-md">
          <button 
            onClick={() => setActiveTab('vip')}
            className={`px-5 py-2.5 rounded-xl text-xs font-extrabold transition-all ${
              activeTab === 'vip' 
                ? 'bg-gradient-to-r from-amber-500 to-yellow-500 text-black shadow-lg shadow-amber-500/25' 
                : 'text-gray-400 hover:text-white hover:bg-white/5'
            }`}
          >
            💎 Club VIP
          </button>
          <button 
            onClick={() => setActiveTab('tumbas')}
            className={`px-5 py-2.5 rounded-xl text-xs font-extrabold transition-all ${
              activeTab === 'tumbas' 
                ? 'bg-gradient-to-r from-fuchsia-600 to-rose-600 text-white shadow-lg shadow-fuchsia-600/25' 
                : 'text-gray-400 hover:text-white hover:bg-white/5'
            }`}
          >
            🌸 Cuidado de Tumbas
          </button>
        </div>
      </header>

      {/* VISTA VIP */}
      {activeTab === 'vip' && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-gradient-to-br from-amber-500/15 via-amber-600/5 to-transparent border border-amber-500/20 p-6 rounded-3xl backdrop-blur-md relative overflow-hidden group">
              <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-amber-500/10 rounded-full blur-xl group-hover:scale-125 transition-transform" />
              <p className="text-xs text-amber-400 uppercase tracking-widest mb-2 font-extrabold flex items-center gap-1.5">
                <span>👑</span> Nivel: Flor VIP
              </p>
              <div className="text-4xl font-black text-amber-400 mb-1">{clients.filter(c => c.nivel === 'Flor VIP').length}</div>
              <p className="text-xs text-amber-400/60 font-medium">Miembros de máximo nivel (5.000+ pts)</p>
            </div>

            <div className="bg-gradient-to-br from-emerald-500/15 via-emerald-600/5 to-transparent border border-emerald-500/20 p-6 rounded-3xl backdrop-blur-md relative overflow-hidden group">
              <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-emerald-500/10 rounded-full blur-xl group-hover:scale-125 transition-transform" />
              <p className="text-xs text-emerald-400 uppercase tracking-widest mb-2 font-extrabold flex items-center gap-1.5">
                <span>🌿</span> Nivel: Brote
              </p>
              <div className="text-4xl font-black text-emerald-400 mb-1">{clients.filter(c => c.nivel === 'Brote').length}</div>
              <p className="text-xs text-emerald-400/60 font-medium">Miembros frecuentes (1.000 - 4.999 pts)</p>
            </div>

            <div className="bg-gradient-to-br from-fuchsia-500/15 via-fuchsia-600/5 to-transparent border border-fuchsia-500/20 p-6 rounded-3xl backdrop-blur-md relative overflow-hidden group">
              <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-fuchsia-500/10 rounded-full blur-xl group-hover:scale-125 transition-transform" />
              <p className="text-xs text-fuchsia-400 uppercase tracking-widest mb-2 font-extrabold flex items-center gap-1.5">
                <span>🌱</span> Nivel: Semilla
              </p>
              <div className="text-4xl font-black text-fuchsia-400 mb-1">{clients.filter(c => c.nivel === 'Semilla').length}</div>
              <p className="text-xs text-fuchsia-400/60 font-medium">Nuevos clientes registrados</p>
            </div>
          </div>

          <div className="bg-[#111116]/90 border border-white/5 rounded-3xl overflow-hidden shadow-2xl backdrop-blur-md">
            <div className="p-6 border-b border-white/5 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white/[0.02]">
              <div>
                <h2 className="font-extrabold text-white text-lg">Directorio de Miembros VIP</h2>
                <p className="text-xs text-gray-500">Calculado automáticamente ($1.000 = 1 punto VIP)</p>
              </div>
              <div className="flex gap-3 w-full md:w-auto">
                 <div className="relative flex-1 md:w-64">
                   <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500 w-4 h-4" />
                   <input type="text" placeholder="Buscar por cliente o teléfono..." className="w-full bg-[#181820] border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder:text-gray-500 focus:border-fuchsia-500 outline-none transition-all" />
                </div>
                <button onClick={() => setShowAddVip(true)} className="bg-gradient-to-r from-fuchsia-600 to-rose-600 hover:from-fuchsia-500 hover:to-rose-500 text-white font-extrabold px-4 py-2.5 rounded-xl text-xs transition-all shadow-lg shadow-fuchsia-600/20 whitespace-nowrap">
                  + Nuevo VIP
                </button>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-gray-400 min-w-[600px]">
                <thead className="bg-[#0D0D11] text-[10px] uppercase text-gray-500 border-b border-white/5">
                  <tr>
                    <th className="px-6 py-4 font-extrabold tracking-widest">Cliente</th>
                    <th className="px-6 py-4 font-extrabold tracking-widest">Nivel Actual</th>
                    <th className="px-6 py-4 font-extrabold tracking-widest">Puntos Acumulados</th>
                    <th className="px-6 py-4 font-extrabold tracking-widest">LTV (Total Gastado)</th>
                    <th className="px-6 py-4 text-right font-extrabold tracking-widest">Acción</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {clients.map(cli => (
                    <tr key={cli.id} className="hover:bg-white/[0.03] transition-colors">
                      <td className="px-6 py-4">
                        <div className="font-bold text-white text-sm">{cli.nombre || 'Cliente Anónimo'}</div>
                        <div className="text-[11px] mt-0.5 text-gray-500 flex items-center gap-1">
                          <span>📞</span> {cli.telefono || cli.id}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border ${
                          cli.nivel === 'Flor VIP' ? 'bg-amber-500/15 text-amber-400 border-amber-500/30' :
                          cli.nivel === 'Brote' ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30' :
                          'bg-fuchsia-500/15 text-fuchsia-400 border-fuchsia-500/30'
                        }`}>
                          {cli.nivel === 'Flor VIP' ? '👑 Flor VIP' : cli.nivel === 'Brote' ? '🌿 Brote' : '🌱 Semilla'}
                        </span>
                      </td>
                      <td className="px-6 py-4 font-mono font-bold text-white text-sm">
                        {cli.puntos.toLocaleString('es-CL')} pts
                        <div className="text-[10px] text-gray-500 font-sans mt-0.5">{cli.compras || 0} compras realizadas</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-emerald-400 font-extrabold text-sm">${(cli.totalGastado || 0).toLocaleString('es-CL')}</div>
                        <div className="text-[10px] text-gray-500 mt-0.5">Última compra hace {cli.diasDesdeUltimoPedido} días</div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button 
                          onClick={() => setSelectedClient(cli)}
                          className="text-fuchsia-400 hover:text-white bg-fuchsia-500/10 hover:bg-fuchsia-600 border border-fuchsia-500/20 px-3.5 py-1.5 rounded-xl transition-all font-bold text-xs shadow-sm"
                        >
                          Ver Historial
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {/* VISTA TUMBAS */}
      {activeTab === 'tumbas' && (
        <div className="bg-[#1C1C1E] border border-gray-800 rounded-3xl overflow-hidden shadow-2xl">
          <div className="p-6 border-b border-gray-800 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-[#111111]">
            <h2 className="font-bold text-white">Suscripciones: Cuidado de Tumbas</h2>
            <button onClick={() => setShowAddTumba(true)} className="bg-primary text-white font-bold px-4 py-2 rounded-lg text-sm hover:bg-primary-dark transition-colors">
              + Nueva Suscripción
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-gray-400 min-w-[900px]">
              <thead className="bg-[#111111] text-xs uppercase text-gray-500">
                <tr>
                  <th className="px-6 py-4 font-bold tracking-widest">Cliente / Contacto</th>
                  <th className="px-6 py-4 font-bold tracking-widest">Difunto</th>
                  <th className="px-6 py-4 font-bold tracking-widest">Cementerio / Ubic.</th>
                  <th className="px-6 py-4 font-bold tracking-widest">Frecuencia</th>
                  <th className="px-6 py-4 font-bold tracking-widest">Próx. Visita</th>
                  <th className="px-6 py-4 text-right font-bold tracking-widest">Acción</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800">
                {tumbas.map(t => (
                  <tr key={t.id} className="hover:bg-[#151515] transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-bold text-white">{t.nombre_cliente}</div>
                      <div className="text-xs mt-1">📞 {t.telefono_contacto}</div>
                    </td>
                    <td className="px-6 py-4 text-white font-bold">
                      {t.nombre_difunto}
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-white">{t.cementerio}</div>
                      <div className="text-xs mt-1">{t.ubicacion}</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="bg-blue-500/20 text-blue-500 px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider">
                        {t.frecuencia}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-mono font-bold text-yellow-500">
                      {t.proximo_mantenimiento || 'Sin programar'}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button 
                        onClick={() => handleMarcarMantenimiento(t.id, t.proximo_mantenimiento)}
                        className="text-green-500 hover:text-white bg-green-500/10 hover:bg-green-500 border border-green-500/20 px-3 py-1.5 rounded-lg transition-colors font-bold text-xs"
                      >
                        ✅ Listo
                      </button>
                    </td>
                  </tr>
                ))}
                {tumbas.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-6 py-8 text-center text-gray-500">No hay suscripciones registradas.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal Historial de Compras */}
      {selectedClient && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setSelectedClient(null)}></div>
          <div className="bg-[#1C1C1E] border border-gray-800 rounded-3xl w-full max-w-2xl relative z-10 p-8 shadow-2xl max-h-[90vh] overflow-y-auto no-scrollbar">
            <h2 className="text-xl font-bold text-white mb-2">Historial de Compras</h2>
            <p className="text-gray-400 text-sm mb-6">Cliente: <strong className="text-white">{selectedClient.nombre || selectedClient.id}</strong></p>
            <div className="space-y-4">
              {selectedClient.pedidos?.map((pedido: any) => (
                <div key={pedido.id} className="bg-[#111111] border border-gray-800 rounded-xl p-4 flex justify-between items-center">
                  <div>
                    <p className="font-bold text-white text-sm">Pedido #{pedido.id.split('-').pop()}</p>
                    <p className="text-xs text-gray-500 mt-1">{new Date(pedido.created_at).toLocaleDateString('es-CL')} • {pedido.detalles?.items?.length || 1} items</p>
                  </div>
                  <div className="text-right">
                    <p className="text-green-500 font-bold">${pedido.total.toLocaleString('es-CL')}</p>
                  </div>
                </div>
              ))}
            </div>
            <button onClick={() => setSelectedClient(null)} className="mt-6 w-full bg-gray-800 text-white font-bold py-3 rounded-xl hover:bg-gray-700 transition-colors">Cerrar Historial</button>
          </div>
        </div>
      )}

      {/* Modal Nuevo VIP */}
      {showAddVip && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setShowAddVip(false)}></div>
          <div className="bg-[#1C1C1E] border border-gray-800 rounded-3xl w-full max-w-md relative z-10 p-8 shadow-2xl">
            <h2 className="text-xl font-bold text-white mb-6">Nuevo Cliente VIP</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Nombre Completo</label>
                <input type="text" value={newVipData.nombre} onChange={e => setNewVipData({...newVipData, nombre: e.target.value})} className="w-full bg-[#111111] border border-gray-800 rounded-xl px-4 py-3 text-white focus:border-primary outline-none" />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Correo Electrónico</label>
                <input type="email" value={newVipData.correo} onChange={e => setNewVipData({...newVipData, correo: e.target.value})} className="w-full bg-[#111111] border border-gray-800 rounded-xl px-4 py-3 text-white focus:border-primary outline-none" />
              </div>
              <div className="pt-4 grid grid-cols-2 gap-4">
                <button onClick={() => setShowAddVip(false)} className="w-full bg-gray-800 text-white font-bold py-3 rounded-xl hover:bg-gray-700 transition-colors">Cancelar</button>
                <button onClick={handleAddVip} className="w-full bg-primary text-white font-bold py-3 rounded-xl hover:bg-primary-dark transition-colors">Agregar</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal Nueva Tumba */}
      {showAddTumba && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setShowAddTumba(false)}></div>
          <div className="bg-[#1C1C1E] border border-gray-800 rounded-3xl w-full max-w-2xl relative z-10 p-8 shadow-2xl max-h-[90vh] overflow-y-auto no-scrollbar">
            <h2 className="text-xl font-bold text-white mb-6">Nueva Suscripción: Cuidado de Tumba</h2>
            <div className="space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Nombre Cliente (Contratante)</label>
                  <input type="text" value={newTumbaData.nombre_cliente} onChange={e => setNewTumbaData({...newTumbaData, nombre_cliente: e.target.value})} className="w-full bg-[#111111] border border-gray-800 rounded-xl px-4 py-3 text-white focus:border-primary outline-none" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Teléfono de Contacto</label>
                  <input type="text" value={newTumbaData.telefono_contacto} onChange={e => setNewTumbaData({...newTumbaData, telefono_contacto: e.target.value})} placeholder="+56 9..." className="w-full bg-[#111111] border border-gray-800 rounded-xl px-4 py-3 text-white focus:border-primary outline-none" />
                </div>
              </div>
              
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Nombre del Difunto</label>
                <input type="text" value={newTumbaData.nombre_difunto} onChange={e => setNewTumbaData({...newTumbaData, nombre_difunto: e.target.value})} className="w-full bg-[#111111] border border-gray-800 rounded-xl px-4 py-3 text-white focus:border-primary outline-none" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Cementerio / Parque</label>
                  <select 
                    value={newTumbaData.cementerio} 
                    onChange={e => setNewTumbaData({...newTumbaData, cementerio: e.target.value})} 
                    className="w-full bg-[#111111] border border-gray-800 rounded-xl px-4 py-3 text-white focus:border-primary outline-none"
                  >
                    <option value="">Seleccione un parque...</option>
                    <option value="Parque El Prado">Parque El Prado</option>
                    <option value="Parque Los Mellizos">Parque Los Mellizos</option>
                    <option value="Parque del Recuerdo (Américo Vespucio)">Parque del Recuerdo (Américo Vespucio)</option>
                    <option value="Parque del Recuerdo (Cordillera)">Parque del Recuerdo (Cordillera)</option>
                    <option value="Parque del Recuerdo (Padre Hurtado)">Parque del Recuerdo (Padre Hurtado)</option>
                    <option value="Cementerio Metropolitano">Cementerio Metropolitano</option>
                    <option value="Cementerio General">Cementerio General</option>
                    <option value="Cementerio Católico">Cementerio Católico</option>
                    <option value="Parque Canaán">Parque Canaán</option>
                    <option value="Otro">Otro...</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Ubicación Exacta / Sector</label>
                  <input type="text" value={newTumbaData.ubicacion} onChange={e => setNewTumbaData({...newTumbaData, ubicacion: e.target.value})} className="w-full bg-[#111111] border border-gray-800 rounded-xl px-4 py-3 text-white focus:border-primary outline-none" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Frecuencia</label>
                  <select value={newTumbaData.frecuencia} onChange={e => setNewTumbaData({...newTumbaData, frecuencia: e.target.value})} className="w-full bg-[#111111] border border-gray-800 rounded-xl px-4 py-3 text-white focus:border-primary outline-none">
                    <option value="Semanal">Semanal</option>
                    <option value="Quincenal">Quincenal</option>
                    <option value="Mensual">Mensual</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Primer Mantenimiento (Fecha)</label>
                  <input type="date" value={newTumbaData.proximo_mantenimiento} onChange={e => setNewTumbaData({...newTumbaData, proximo_mantenimiento: e.target.value})} className="w-full bg-[#111111] border border-gray-800 rounded-xl px-4 py-3 text-white focus:border-primary outline-none" />
                </div>
              </div>

              <div className="pt-4 grid grid-cols-2 gap-4">
                <button onClick={() => setShowAddTumba(false)} className="w-full bg-gray-800 text-white font-bold py-3 rounded-xl hover:bg-gray-700 transition-colors">Cancelar</button>
                <button onClick={handleAddTumba} className="w-full bg-primary text-white font-bold py-3 rounded-xl hover:bg-primary-dark transition-colors">Guardar Suscripción</button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
