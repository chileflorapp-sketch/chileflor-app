'use client';
import { useState, useEffect } from 'react';
import { Truck, MapPin, Camera, CheckCircle, Clock, Package, Navigation, RefreshCw, AlertCircle, ChevronRight } from 'lucide-react';

type OrderStatus = 'PREPARANDO' | 'EN RUTA' | 'COMPLETADO' | 'PENDIENTE';

interface Order {
  id: number;
  type: string;
  location: string;
  hub: string;
  status: OrderStatus;
  evidenceUploaded: boolean;
  cliente?: string;
  hora?: string;
}

const STATUS_CONFIG: Record<OrderStatus, { label: string; color: string; bg: string; icon: any }> = {
  PENDIENTE:   { label: 'Pendiente',   color: 'text-gray-500',   bg: 'bg-gray-500/10 border-gray-500/20',   icon: Clock },
  PREPARANDO:  { label: 'Preparando',  color: 'text-orange-400', bg: 'bg-orange-500/10 border-orange-500/20', icon: Package },
  'EN RUTA':   { label: 'En Ruta',     color: 'text-blue-400',   bg: 'bg-blue-500/10 border-blue-500/20',   icon: Truck },
  COMPLETADO:  { label: 'Completado',  color: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/20', icon: CheckCircle },
};

const INITIAL_ORDERS: Order[] = [
  { id: 42, type: 'Entrega a Cementerio', location: 'Sector B, Lápida 102', hub: 'Parque El Prado', status: 'PREPARANDO', evidenceUploaded: false, cliente: 'María Soto', hora: '10:30' },
  { id: 39, type: 'Mantención (Suscripción)', location: 'Sector Álamo, Lápida 15', hub: 'Parque El Prado', status: 'EN RUTA', evidenceUploaded: false, cliente: 'Carlos Rojas', hora: '11:00' },
  { id: 51, type: 'Entrega a Domicilio', location: 'Av. Vicuña Mackenna 123, La Florida', hub: 'Los Mellizos', status: 'PENDIENTE', evidenceUploaded: false, cliente: 'Ana Pérez', hora: '13:00' },
  { id: 38, type: 'Mantención (Suscripción)', location: 'Sector Norte, Lápida 42', hub: 'Parque El Prado', status: 'COMPLETADO', evidenceUploaded: true, cliente: 'Luis Méndez', hora: '09:00' },
];

export default function LogisticaDashboard() {
  const [orders, setOrders] = useState<Order[]>(INITIAL_ORDERS);
  const [selectedHub, setSelectedHub] = useState<string>('Todos');
  const [toast, setToast] = useState('');
  const [activeFilter, setActiveFilter] = useState<OrderStatus | 'Todos'>('Todos');

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(''), 3000);
  };

  const updateStatus = (id: number, newStatus: OrderStatus) => {
    setOrders(prev => prev.map(o => o.id === id ? { ...o, status: newStatus } : o));
    showToast(`✅ Orden #${id} actualizada a ${newStatus}`);
  };

  const uploadEvidence = (id: number) => {
    showToast('📸 Subiendo evidencia fotográfica...');
    setTimeout(() => {
      setOrders(prev => prev.map(o => o.id === id ? { ...o, evidenceUploaded: true } : o));
      showToast('✅ Evidencia subida con éxito');
    }, 1500);
  };

  const navigate = (order: Order) => {
    window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(order.hub + ' ' + order.location)}`, '_blank');
  };

  // Stats
  const filtered = orders.filter(o => {
    const hubMatch = selectedHub === 'Todos' || o.hub === selectedHub;
    const statusMatch = activeFilter === 'Todos' || o.status === activeFilter;
    return hubMatch && statusMatch;
  });

  const stats = {
    total: orders.length,
    pendiente: orders.filter(o => o.status === 'PENDIENTE').length,
    enRuta: orders.filter(o => o.status === 'EN RUTA').length,
    completado: orders.filter(o => o.status === 'COMPLETADO').length,
  };

  const HUBS = ['Todos', 'Parque El Prado', 'Los Mellizos'];
  const STATUS_FILTERS: Array<OrderStatus | 'Todos'> = ['Todos', 'PENDIENTE', 'PREPARANDO', 'EN RUTA', 'COMPLETADO'];

  return (
    <div className="relative">
      {/* Toast */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 bg-gray-900 border border-white/10 text-white px-5 py-3 rounded-2xl shadow-2xl font-bold text-sm flex items-center gap-2 animate-in slide-in-from-bottom-4">
          {toast}
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <div className="w-9 h-9 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
              <Truck className="w-5 h-5 text-blue-400" />
            </div>
            <h1 className="text-2xl font-black text-white">Panel Logístico</h1>
          </div>
          <p className="text-gray-500 text-sm ml-12">Gestión de despachos, cementerios y mantenciones en tiempo real.</p>
        </div>

        {/* Selector de Hub */}
        <div className="flex items-center gap-3">
          <span className="text-xs text-gray-500 font-bold uppercase tracking-widest">Hub:</span>
          <div className="flex bg-white/[0.04] border border-white/8 rounded-xl overflow-hidden">
            {HUBS.map(hub => (
              <button
                key={hub}
                onClick={() => setSelectedHub(hub)}
                className={`px-4 py-2 text-xs font-bold transition-all ${selectedHub === hub ? 'bg-blue-500/20 text-blue-400 border-r border-blue-500/20' : 'text-gray-500 hover:text-gray-300'}`}
              >
                {hub}
              </button>
            ))}
          </div>
          <button onClick={() => showToast('🔄 Actualizando...')} className="p-2 rounded-xl bg-white/[0.04] border border-white/8 text-gray-500 hover:text-white transition-colors">
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Total Hoy', value: stats.total, color: 'text-white', bg: 'from-white/5 to-white/[0.02]', border: 'border-white/8', icon: Package },
          { label: 'Pendientes', value: stats.pendiente, color: 'text-gray-400', bg: 'from-gray-500/10 to-gray-500/5', border: 'border-gray-500/20', icon: Clock },
          { label: 'En Ruta', value: stats.enRuta, color: 'text-blue-400', bg: 'from-blue-500/15 to-blue-500/5', border: 'border-blue-500/20', icon: Truck },
          { label: 'Completados', value: stats.completado, color: 'text-emerald-400', bg: 'from-emerald-500/15 to-emerald-500/5', border: 'border-emerald-500/20', icon: CheckCircle },
        ].map((stat, i) => (
          <div key={i} className={`bg-gradient-to-br ${stat.bg} border ${stat.border} rounded-2xl p-4`}>
            <div className="flex items-center justify-between mb-2">
              <stat.icon className={`w-4 h-4 ${stat.color}`} />
              <span className={`text-3xl font-black ${stat.color}`}>{stat.value}</span>
            </div>
            <p className="text-xs text-gray-500 font-bold uppercase tracking-wider">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Filtros de estado */}
      <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2 mb-6">
        {STATUS_FILTERS.map(filter => (
          <button
            key={filter}
            onClick={() => setActiveFilter(filter)}
            className={`shrink-0 px-4 py-1.5 rounded-full text-xs font-bold transition-all border ${
              activeFilter === filter
                ? 'bg-fuchsia-500/20 text-fuchsia-400 border-fuchsia-500/30'
                : 'text-gray-500 border-white/8 hover:text-gray-300 hover:border-white/15'
            }`}
          >
            {filter === 'Todos' ? '🗂 Todos' : filter}
          </button>
        ))}
      </div>

      {/* Lista de Órdenes */}
      <div className="space-y-3">
        {filtered.length === 0 && (
          <div className="text-center py-16 text-gray-600">
            <AlertCircle className="w-8 h-8 mx-auto mb-3 opacity-50" />
            <p className="font-bold">No hay órdenes para este filtro</p>
          </div>
        )}

        {filtered.map(order => {
          const cfg = STATUS_CONFIG[order.status];
          const StatusIcon = cfg.icon;
          return (
            <div
              key={order.id}
              className={`bg-gradient-to-br from-white/[0.04] to-white/[0.01] border rounded-2xl p-4 md:p-5 transition-all hover:border-white/15 ${
                order.status === 'COMPLETADO' ? 'opacity-60 border-white/5' : 'border-white/8'
              }`}
            >
              <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
                {/* ID + Info */}
                <div className="flex items-start gap-4 flex-1 min-w-0">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black text-sm border ${cfg.bg} ${cfg.color} shrink-0`}>
                    #{order.id}
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <p className="font-bold text-white text-sm">{order.type}</p>
                      <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-extrabold border uppercase ${cfg.bg} ${cfg.color}`}>
                        <StatusIcon className="w-3 h-3" />
                        {cfg.label}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-gray-500 mb-0.5">
                      <MapPin className="w-3 h-3 shrink-0" />
                      <span>{order.hub} — {order.location}</span>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-gray-600">
                      <span>👤 {order.cliente}</span>
                      <span className="text-gray-700">|</span>
                      <span>🕐 {order.hora}</span>
                    </div>
                  </div>
                </div>

                {/* Acciones */}
                {order.status !== 'COMPLETADO' && (
                  <div className="flex flex-wrap gap-2 w-full md:w-auto shrink-0">
                    {/* Navegar */}
                    <button
                      onClick={() => navigate(order)}
                      className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400 hover:bg-blue-500/20 text-xs font-bold transition-all"
                    >
                      <Navigation className="w-3.5 h-3.5" />
                      Navegar
                    </button>

                    {/* Marcar En Ruta */}
                    {order.status === 'PREPARANDO' && (
                      <button
                        onClick={() => updateStatus(order.id, 'EN RUTA')}
                        className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-fuchsia-500/10 border border-fuchsia-500/20 text-fuchsia-400 hover:bg-fuchsia-500/20 text-xs font-bold transition-all"
                      >
                        <Truck className="w-3.5 h-3.5" />
                        Iniciar Ruta
                      </button>
                    )}

                    {/* Pendiente → Preparando */}
                    {order.status === 'PENDIENTE' && (
                      <button
                        onClick={() => updateStatus(order.id, 'PREPARANDO')}
                        className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-orange-500/10 border border-orange-500/20 text-orange-400 hover:bg-orange-500/20 text-xs font-bold transition-all"
                      >
                        <Package className="w-3.5 h-3.5" />
                        Preparar
                      </button>
                    )}

                    {/* En Ruta → Evidencia → Completar */}
                    {order.status === 'EN RUTA' && (
                      !order.evidenceUploaded ? (
                        <button
                          onClick={() => uploadEvidence(order.id)}
                          className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-gray-600/20 border border-gray-500/20 text-gray-300 hover:bg-gray-600/30 text-xs font-bold transition-all"
                        >
                          <Camera className="w-3.5 h-3.5" />
                          Subir Evidencia
                        </button>
                      ) : (
                        <button
                          onClick={() => updateStatus(order.id, 'COMPLETADO')}
                          className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/30 text-xs font-black transition-all"
                        >
                          <CheckCircle className="w-3.5 h-3.5" />
                          Completar
                        </button>
                      )
                    )}
                  </div>
                )}

                {order.status === 'COMPLETADO' && (
                  <span className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-black shrink-0">
                    <CheckCircle className="w-3.5 h-3.5" />
                    Realizado
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Leyenda de flujo */}
      <div className="mt-8 bg-white/[0.02] border border-white/6 rounded-2xl p-4">
        <p className="text-xs text-gray-600 font-bold uppercase tracking-widest mb-3">Flujo de Trabajo</p>
        <div className="flex flex-wrap items-center gap-2 text-xs text-gray-500">
          {(['PENDIENTE', 'PREPARANDO', 'EN RUTA', 'COMPLETADO'] as OrderStatus[]).map((s, i, arr) => (
            <span key={s} className="flex items-center gap-2">
              <span className={`px-2 py-0.5 rounded-full border font-bold ${STATUS_CONFIG[s].bg} ${STATUS_CONFIG[s].color}`}>{STATUS_CONFIG[s].label}</span>
              {i < arr.length - 1 && <ChevronRight className="w-3 h-3 text-gray-700" />}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
