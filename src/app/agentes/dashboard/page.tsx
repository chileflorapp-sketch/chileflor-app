'use client';

import { useState, useEffect } from 'react';
import { useAgentAuth } from '@/context/AgentAuthContext';
import { createClient } from '@/utils/supabase/client';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, PieChart, Pie, Cell, Legend
} from 'recharts';

// Los datos ahora se cargan desde /api/agentes/metricas

const COLORS = ['#00C6FF', '#8A2BE2', '#FF007F', '#39FF14'];

export default function DashboardOverview() {
  const { agent } = useAgentAuth();
  const supabase = createClient();
  const [totalProducts, setTotalProducts] = useState(0);
  const [metrics, setMetrics] = useState<any>({
    ventasDelMes: 0,
    entregasExitosas: 0,
    areaData: [],
    barData: [],
    pieData: []
  });

  useEffect(() => {
    fetch('/api/agentes/metricas')
      .then(res => res.json())
      .then(data => {
        if (!data.error) {
          setMetrics(data);
          setTotalProducts(data.totalProducts);
        }
      })
      .catch(err => console.error(err));
  }, []);

  return (
    <div className="animate-in fade-in duration-500 relative pb-10 space-y-8">
      
      {/* Premium Hero Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-purple-950/80 via-[#120D1D] to-[#0E0E12] border border-white/10 p-6 md:p-8 shadow-2xl">
        <div className="absolute top-0 right-0 -mt-12 -mr-12 w-64 h-64 bg-fuchsia-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-fuchsia-500/10 border border-fuchsia-500/20 text-fuchsia-300 text-xs font-bold uppercase tracking-widest mb-3">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-fuchsia-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-fuchsia-500" />
              </span>
              Centro de Mando Operativo
            </div>
            <h1 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight mb-2">
              Bienvenido, <span className="bg-gradient-to-r from-fuchsia-400 via-pink-400 to-rose-300 text-transparent bg-clip-text">{agent?.name}</span>
            </h1>
            <p className="text-gray-400 text-sm max-w-xl">
              Monitoreo en tiempo real de ventas, logística de despacho y gestión de clientes VIP Chileflor.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <a
              href="/agentes/dashboard/pedidos"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-fuchsia-600 to-rose-600 hover:from-fuchsia-500 hover:to-rose-500 text-white font-bold px-5 py-3 rounded-2xl transition-all shadow-lg shadow-fuchsia-600/25 hover:shadow-fuchsia-600/40 text-sm"
            >
              <span>📋</span> Ver Pedidos Activos
            </a>
            <a
              href="/agentes/dashboard/clientes"
              className="inline-flex items-center gap-2 bg-white/5 hover:bg-white/10 text-white font-bold px-5 py-3 rounded-2xl border border-white/10 transition-all text-sm backdrop-blur-md"
            >
              <span>💎</span> Clientes VIP
            </a>
          </div>
        </div>
      </div>

      {/* Grid de Módulos CRM (Acceso Rápido Estilo CategoryGrid) */}
      <div>
        <h2 className="text-xs font-extrabold text-gray-400 uppercase tracking-widest mb-4 px-1 flex items-center gap-2">
          <span>⚡</span> Accesos Rápidos
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <a
            href="/agentes/dashboard/pedidos"
            className="group relative p-5 rounded-2xl bg-[#111116]/80 hover:bg-[#181820] border border-white/5 hover:border-fuchsia-500/40 transition-all duration-300 shadow-lg hover:shadow-fuchsia-500/10 flex flex-col justify-between"
          >
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-fuchsia-500/20 to-purple-500/10 text-fuchsia-400 flex items-center justify-center text-xl font-bold mb-4 group-hover:scale-110 transition-transform">
              📦
            </div>
            <div>
              <h3 className="font-bold text-white text-base group-hover:text-fuchsia-300 transition-colors">Bandeja Pedidos</h3>
              <p className="text-xs text-gray-500 mt-1">Kanban & Estado de Entregas</p>
            </div>
            <div className="absolute top-4 right-4 text-gray-600 group-hover:text-fuchsia-400 transition-colors">➔</div>
          </a>

          <a
            href="/agentes/dashboard/clientes"
            className="group relative p-5 rounded-2xl bg-[#111116]/80 hover:bg-[#181820] border border-white/5 hover:border-amber-500/40 transition-all duration-300 shadow-lg hover:shadow-amber-500/10 flex flex-col justify-between"
          >
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500/20 to-yellow-500/10 text-amber-400 flex items-center justify-center text-xl font-bold mb-4 group-hover:scale-110 transition-transform">
              👑
            </div>
            <div>
              <h3 className="font-bold text-white text-base group-hover:text-amber-300 transition-colors">Club VIP & Tumbas</h3>
              <p className="text-xs text-gray-500 mt-1">Fidelización y Mantención</p>
            </div>
            <div className="absolute top-4 right-4 text-gray-600 group-hover:text-amber-400 transition-colors">➔</div>
          </a>

          <a
            href="/agentes/dashboard/catalogo"
            className="group relative p-5 rounded-2xl bg-[#111116]/80 hover:bg-[#181820] border border-white/5 hover:border-cyan-500/40 transition-all duration-300 shadow-lg hover:shadow-cyan-500/10 flex flex-col justify-between"
          >
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500/20 to-blue-500/10 text-cyan-400 flex items-center justify-center text-xl font-bold mb-4 group-hover:scale-110 transition-transform">
              🌸
            </div>
            <div>
              <h3 className="font-bold text-white text-base group-hover:text-cyan-300 transition-colors">Catálogo General</h3>
              <p className="text-xs text-gray-500 mt-1">Gestión de Stock y Precios</p>
            </div>
            <div className="absolute top-4 right-4 text-gray-600 group-hover:text-cyan-400 transition-colors">➔</div>
          </a>

          <a
            href="/agentes/dashboard/catalogo-b2b"
            className="group relative p-5 rounded-2xl bg-[#111116]/80 hover:bg-[#181820] border border-white/5 hover:border-emerald-500/40 transition-all duration-300 shadow-lg hover:shadow-emerald-500/10 flex flex-col justify-between"
          >
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500/20 to-teal-500/10 text-emerald-400 flex items-center justify-center text-xl font-bold mb-4 group-hover:scale-110 transition-transform">
              🏢
            </div>
            <div>
              <h3 className="font-bold text-white text-base group-hover:text-emerald-300 transition-colors">Catálogo Mayorista</h3>
              <p className="text-xs text-gray-500 mt-1">Precios B2B Especiales</p>
            </div>
            <div className="absolute top-4 right-4 text-gray-600 group-hover:text-emerald-400 transition-colors">➔</div>
          </a>
        </div>
      </div>

      {/* Grid Superior: Tarjetas Principales */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* KPI 1: Ingresos */}
        <div className="relative overflow-hidden bg-gradient-to-br from-fuchsia-600 via-pink-600 to-rose-600 rounded-3xl p-6 shadow-[0_15px_35px_rgba(236,72,153,0.3)] text-white flex flex-col justify-between group">
          <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-2xl group-hover:scale-125 transition-transform" />
          <div>
            <div className="flex justify-between items-center mb-4">
              <p className="text-xs font-bold text-pink-100 uppercase tracking-widest">Ventas del Mes</p>
              <span className="bg-white/20 backdrop-blur-md px-2.5 py-1 rounded-full text-xs font-bold">Chileflor Live</span>
            </div>
            <div className="flex items-baseline gap-2 mb-2">
              <span className="text-5xl font-black tracking-tight">
                ${metrics.ventasDelMes >= 1000000 ? (metrics.ventasDelMes / 1000000).toFixed(1) : metrics.ventasDelMes.toLocaleString('es-CL')}
              </span>
              <span className="text-2xl font-medium text-pink-200">
                {metrics.ventasDelMes >= 1000000 ? 'M' : ''}
              </span>
            </div>
          </div>
          <p className="text-xs text-pink-100 font-medium flex items-center gap-1.5 mt-4">
            <span className="w-2 h-2 rounded-full bg-emerald-300 animate-pulse" />
            +15% incremento proyección mensual
          </p>
        </div>

        {/* KPI 2: Entregas */}
        <div className="relative overflow-hidden bg-gradient-to-br from-cyan-600 via-blue-600 to-indigo-600 rounded-3xl p-6 shadow-[0_15px_35px_rgba(6,182,212,0.3)] text-white flex flex-col justify-between group">
          <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-2xl group-hover:scale-125 transition-transform" />
          <div>
            <div className="flex justify-between items-center mb-4">
              <p className="text-xs font-bold text-cyan-100 uppercase tracking-widest">Entregas Exitosas</p>
              <span className="bg-white/20 backdrop-blur-md px-2.5 py-1 rounded-full text-xs font-bold">Despacho OK</span>
            </div>
            <div className="flex items-baseline gap-2 mb-2">
              <span className="text-5xl font-black tracking-tight">{metrics.entregasExitosas}</span>
              <span className="text-xl font-medium text-cyan-200">órdenes</span>
            </div>
          </div>
          <p className="text-xs text-cyan-100 font-medium flex items-center gap-1.5 mt-4">
            <span className="w-2 h-2 rounded-full bg-cyan-200" />
            Tiempo promedio de despacho: 2h 40m
          </p>
        </div>

        {/* Mini Stats (Right side on desktop) */}
        <div className="flex flex-col gap-4 justify-between">
          <div className="bg-[#111116] border border-white/5 rounded-2xl p-4 flex items-center justify-between shadow-lg hover:border-purple-500/30 transition-colors">
            <div className="flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-xl bg-purple-500/15 text-purple-400 flex items-center justify-center text-xl font-bold">
                👥
              </div>
              <div>
                <p className="text-[10px] text-gray-400 font-extrabold uppercase tracking-widest">Nuevos Clientes</p>
                <p className="text-white font-black text-xl">24 este mes</p>
              </div>
            </div>
            <span className="bg-emerald-500/15 text-emerald-400 text-xs font-extrabold px-2.5 py-1 rounded-full border border-emerald-500/20">+20%</span>
          </div>

          <div className="bg-[#111116] border border-white/5 rounded-2xl p-4 flex items-center justify-between shadow-lg hover:border-blue-500/30 transition-colors">
            <div className="flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-xl bg-blue-500/15 text-blue-400 flex items-center justify-center text-xl font-bold">
                📥
              </div>
              <div>
                <p className="text-[10px] text-gray-400 font-extrabold uppercase tracking-widest">Bandeja Entrada</p>
                <p className="text-white font-black text-xl">8 consultas</p>
              </div>
            </div>
            <span className="bg-fuchsia-500/15 text-fuchsia-400 text-xs font-extrabold px-2.5 py-1 rounded-full border border-fuchsia-500/20">Al día</span>
          </div>
        </div>

      </div>

      {/* Grid Medio: Gráfico Principal */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Area Chart */}
        <div className="lg:col-span-2 bg-[#111116]/90 border border-white/5 rounded-3xl p-6 shadow-xl backdrop-blur-md">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mb-6">
            <div>
              <h2 className="text-xs font-extrabold text-white tracking-widest uppercase">Evolución de Pedidos (Mensual)</h2>
              <p className="text-xs text-gray-500">Comparativa mensual de pedidos completados vs pendientes</p>
            </div>
            <div className="flex items-center gap-4 text-xs font-medium">
              <span className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded-full bg-cyan-400"></div> Completados</span>
              <span className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded-full bg-fuchsia-500"></div> Pendientes</span>
            </div>
          </div>
          <div className="h-[250px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={metrics.areaData} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorCompletados" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.6}/>
                    <stop offset="95%" stopColor="#06b6d4" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorPendientes" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#d946ef" stopOpacity={0.6}/>
                    <stop offset="95%" stopColor="#d946ef" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#22222b" vertical={false} />
                <XAxis dataKey="name" stroke="#6b7280" tick={{fill: '#9ca3af', fontSize: 12}} axisLine={false} tickLine={false} />
                <YAxis stroke="#6b7280" tick={{fill: '#9ca3af', fontSize: 12}} axisLine={false} tickLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#181820', borderColor: '#374151', borderRadius: '16px', color: '#fff', boxShadow: '0 10px 25px rgba(0,0,0,0.5)' }}
                  itemStyle={{ color: '#fff' }}
                />
                <Area type="monotone" dataKey="completados" stroke="#06b6d4" strokeWidth={3} fillOpacity={1} fill="url(#colorCompletados)" />
                <Area type="monotone" dataKey="pendientes" stroke="#d946ef" strokeWidth={3} fillOpacity={1} fill="url(#colorPendientes)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Side Panel: Operaciones y resumen */}
        <div className="bg-[#111116]/90 border border-white/5 rounded-3xl p-6 shadow-xl backdrop-blur-md flex flex-col justify-between">
          <div>
            <h2 className="text-xs font-extrabold text-white tracking-widest uppercase mb-4">Acciones de Sistema</h2>
            <div className="space-y-3">
              <a href="/agentes/dashboard/catalogo" className="flex items-center justify-between p-3.5 bg-white/[0.03] border border-white/5 rounded-2xl hover:border-cyan-500/40 hover:bg-white/[0.06] transition-all group">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-cyan-500/15 text-cyan-400 flex items-center justify-center font-extrabold text-base">
                    +
                  </div>
                  <span className="text-sm font-bold text-gray-300 group-hover:text-white">Añadir Producto</span>
                </div>
                <span className="text-gray-600 group-hover:text-cyan-400 transition-colors">➔</span>
              </a>
              
              <a href="/agentes/dashboard/pedidos" className="flex items-center justify-between p-3.5 bg-white/[0.03] border border-white/5 rounded-2xl hover:border-fuchsia-500/40 hover:bg-white/[0.06] transition-all group">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-fuchsia-500/15 text-fuchsia-400 flex items-center justify-center text-sm font-bold">
                    🖨️
                  </div>
                  <span className="text-sm font-bold text-gray-300 group-hover:text-white">Imprimir Órdenes</span>
                </div>
                <span className="text-gray-600 group-hover:text-fuchsia-400 transition-colors">➔</span>
              </a>
            </div>
          </div>

          <div className="pt-6 border-t border-white/5 mt-6">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-xs text-gray-500 font-bold uppercase tracking-wider">Productos Activos</p>
                <p className="text-3xl font-black text-white">{totalProducts}</p>
              </div>
              <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-bold">
                Catálogo OK
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Grid Inferior: Donut y Barras */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Donut Chart */}
        <div className="bg-[#111116]/90 border border-white/5 rounded-3xl p-6 shadow-xl backdrop-blur-md flex flex-col justify-between">
          <h2 className="text-xs font-extrabold text-white tracking-widest uppercase mb-4">Distribución por Categoría</h2>
          <div className="h-[220px] w-full flex items-center justify-center relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={metrics.pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={65}
                  outerRadius={90}
                  paddingAngle={5}
                  dataKey="value"
                  stroke="none"
                >
                  {metrics.pieData.map((entry: any, index: number) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: '#181820', borderColor: '#374151', borderRadius: '16px', color: '#fff' }}
                  itemStyle={{ color: '#fff' }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Total</span>
              <span className="text-2xl font-black text-white">100%</span>
            </div>
          </div>
          
          <div className="mt-4 grid grid-cols-2 gap-3">
             {metrics.pieData.map((entry: any, index: number) => (
               <div key={index} className="flex items-center gap-2 p-2 rounded-xl bg-white/[0.02]">
                 <div className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: COLORS[index % COLORS.length] }}></div>
                 <span className="text-xs font-medium text-gray-400 truncate">{entry.name} <span className="text-white font-bold ml-1">{entry.value}</span></span>
               </div>
             ))}
          </div>
        </div>

        {/* Bar Chart */}
        <div className="bg-[#111116]/90 border border-white/5 rounded-3xl p-6 shadow-xl backdrop-blur-md flex flex-col justify-between">
          <h2 className="text-xs font-extrabold text-white tracking-widest uppercase mb-4">Volumen Semanal</h2>
          <div className="h-[220px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={metrics.barData} margin={{ top: 10, right: 0, left: -30, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#22222b" vertical={false} />
                <XAxis dataKey="name" stroke="#6b7280" tick={{fill: '#9ca3af', fontSize: 12}} axisLine={false} tickLine={false} />
                <YAxis stroke="#6b7280" tick={{fill: '#9ca3af', fontSize: 12}} axisLine={false} tickLine={false} />
                <Tooltip 
                  cursor={{fill: '#ffffff08'}}
                  contentStyle={{ backgroundColor: '#181820', borderColor: '#374151', borderRadius: '16px', color: '#fff' }}
                />
                <Bar dataKey="tickets" radius={[6, 6, 0, 0]}>
                  {
                    metrics.barData.map((entry: any, index: number) => (
                      <Cell key={`cell-${index}`} fill={index % 2 === 0 ? '#00C6FF' : '#d946ef'} />
                    ))
                  }
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

    </div>
  );
}
