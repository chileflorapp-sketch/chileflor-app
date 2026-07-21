'use client';

import { useState, useEffect } from 'react';
import { useAgentAuth } from '@/context/AgentAuthContext';

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
      const resVip = await fetch('/api/clientes-vip');
      const dataVip = await resVip.json();
      setClients(dataVip);

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
    if (!selectedClient) return;
    
    const amount = Math.abs(parseInt(puntosToAdjust) || 0);
    if (amount === 0) {
      showToast('Ingresa un monto válido');
      return;
    }
    
    const finalPoints = selectedClient.puntos + (type === 'add' ? amount : -amount);

    try {
      const res = await fetch('/api/clientes-vip', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: selectedClient.id, puntos: finalPoints })
      });
      if (res.ok) {
        showToast(`Puntos actualizados para ${selectedClient.nombre}`);
        setSelectedClient(null);
        setPuntosToAdjust('');
        loadData();
      }
    } catch (e) {
      showToast('Error al ajustar puntos');
    }
  };

  const handleAddVip = async () => {
    if (!newVipData.nombre || !newVipData.correo) return;
    try {
      const res = await fetch('/api/clientes-vip', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newVipData)
      });
      if (res.ok) {
        showToast('Cliente VIP agregado correctamente');
        setShowAddVip(false);
        setNewVipData({ nombre: '', correo: '' });
        loadData();
      }
    } catch (e) {
      showToast('Error al agregar cliente');
    }
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
          <h1 className="text-3xl font-bold text-white mb-2">Club Chileflor & Servicios</h1>
          <p className="text-gray-400">Gestión de fidelidad y suscripciones de mantenimiento.</p>
        </div>
        <div className="flex gap-4 items-center bg-[#1C1C1E] p-2 rounded-xl border border-gray-800">
          <button 
            onClick={() => setActiveTab('vip')}
            className={`px-4 py-2 rounded-lg text-sm font-bold transition-colors ${activeTab === 'vip' ? 'bg-primary text-white' : 'text-gray-400 hover:text-white'}`}
          >
            Club VIP
          </button>
          <button 
            onClick={() => setActiveTab('tumbas')}
            className={`px-4 py-2 rounded-lg text-sm font-bold transition-colors ${activeTab === 'tumbas' ? 'bg-primary text-white' : 'text-gray-400 hover:text-white'}`}
          >
            Cuidado de Tumbas
          </button>
        </div>
      </header>

      {/* VISTA VIP */}
      {activeTab === 'vip' && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-gradient-to-br from-yellow-500/20 to-yellow-600/5 border border-yellow-500/20 p-6 rounded-3xl">
              <p className="text-xs text-yellow-500/80 uppercase tracking-widest mb-2 font-bold">Nivel: Flor VIP</p>
              <div className="text-3xl font-bold text-yellow-500 mb-1">{clients.filter(c => c.nivel === 'Flor VIP').length}</div>
              <p className="text-sm text-yellow-500/60">Miembros activos</p>
            </div>
            <div className="bg-gradient-to-br from-green-500/20 to-green-600/5 border border-green-500/20 p-6 rounded-3xl">
              <p className="text-xs text-green-500/80 uppercase tracking-widest mb-2 font-bold">Nivel: Brote</p>
              <div className="text-3xl font-bold text-green-500 mb-1">{clients.filter(c => c.nivel === 'Brote').length}</div>
              <p className="text-sm text-green-500/60">Miembros activos</p>
            </div>
            <div className="bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/20 p-6 rounded-3xl">
              <p className="text-xs text-primary/80 uppercase tracking-widest mb-2 font-bold">Nivel: Semilla</p>
              <div className="text-3xl font-bold text-primary mb-1">{clients.filter(c => c.nivel === 'Semilla').length}</div>
              <p className="text-sm text-primary/60">Miembros activos</p>
            </div>
          </div>

          <div className="bg-[#1C1C1E] border border-gray-800 rounded-3xl overflow-hidden shadow-2xl">
            <div className="p-6 border-b border-gray-800 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-[#111111]">
              <h2 className="font-bold text-white">Directorio de Miembros VIP</h2>
              <div className="flex gap-4 w-full md:w-auto">
                <div className="relative flex-1 md:w-64">
                   <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">🔍</span>
                   <input type="text" placeholder="Buscar..." className="w-full bg-[#1C1C1E] border border-gray-800 rounded-lg pl-10 pr-4 py-2 text-sm text-white focus:border-primary outline-none transition-colors" />
                </div>
                <button onClick={() => setShowAddVip(true)} className="bg-primary text-white font-bold px-4 py-2 rounded-lg text-sm hover:bg-primary-dark transition-colors">
                  + Nuevo VIP
                </button>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-gray-400 min-w-[600px]">
                <thead className="bg-[#111111] text-xs uppercase text-gray-500">
                  <tr>
                    <th className="px-6 py-4 font-bold tracking-widest">Cliente</th>
                    <th className="px-6 py-4 font-bold tracking-widest">Nivel Actual</th>
                    <th className="px-6 py-4 font-bold tracking-widest">Puntos</th>
                    <th className="px-6 py-4 font-bold tracking-widest">Historial Compras</th>
                    <th className="px-6 py-4 text-right font-bold tracking-widest">Acción</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-800">
                  {clients.map(cli => (
                    <tr key={cli.id} className="hover:bg-[#151515] transition-colors">
                      <td className="px-6 py-4">
                        <div className="font-bold text-white">{cli.nombre}</div>
                        <div className="text-xs mt-1">{cli.correo}</div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider ${
                          cli.nivel === 'Flor VIP' ? 'bg-yellow-500/20 text-yellow-500' :
                          cli.nivel === 'Brote' ? 'bg-green-500/20 text-green-500' :
                          'bg-primary/20 text-primary'
                        }`}>
                          {cli.nivel}
                        </span>
                      </td>
                      <td className="px-6 py-4 font-mono font-bold text-white">
                        {cli.puntos.toLocaleString('es-CL')} pts
                      </td>
                      <td className="px-6 py-4">
                        {cli.compras || 0} pedidos
                      </td>
                      <td className="px-6 py-4 text-right">
                        {canAdjustPoints ? (
                          <button 
                            onClick={() => setSelectedClient(cli)}
                            className="text-primary hover:text-white bg-primary/10 hover:bg-primary border border-primary/20 px-3 py-1.5 rounded-lg transition-colors font-bold text-xs"
                          >
                            Ajustar Puntos
                          </button>
                        ) : (
                          <span className="text-gray-600 text-xs font-bold" title="Permiso denegado">🔒 Bloqueado</span>
                        )}
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

      {/* Modal Ajustar Puntos VIP */}
      {selectedClient && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setSelectedClient(null)}></div>
          <div className="bg-[#1C1C1E] border border-gray-800 rounded-3xl w-full max-w-md relative z-10 p-8 shadow-2xl">
            <h2 className="text-xl font-bold text-white mb-2">Ajustar Puntos</h2>
            <p className="text-gray-400 text-sm mb-6">Cliente: <strong className="text-white">{selectedClient.nombre}</strong></p>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Cantidad de Puntos</label>
                <input type="number" placeholder="Ej: 500" value={puntosToAdjust} onChange={e => setPuntosToAdjust(e.target.value)} className="w-full bg-[#111111] border border-gray-800 rounded-xl px-4 py-3 text-white font-mono text-lg focus:border-primary outline-none" />
              </div>
              <div className="pt-4 grid grid-cols-2 gap-4">
                <button onClick={() => handleAdjustPoints('subtract')} className="w-full bg-red-500/10 text-red-500 border border-red-500/20 font-bold py-3 rounded-xl hover:bg-red-500 hover:text-white transition-colors">- Restar</button>
                <button onClick={() => handleAdjustPoints('add')} className="w-full bg-primary text-white font-bold py-3 rounded-xl hover:bg-primary-dark transition-colors">+ Sumar</button>
              </div>
            </div>
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
