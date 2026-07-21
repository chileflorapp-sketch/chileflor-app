'use client';

import { useState, useEffect } from 'react';
import { useAgentAuth } from '@/context/AgentAuthContext';
import { createClient } from '@/utils/supabase/client';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, PieChart, Pie, Cell, Legend
} from 'recharts';

// Datos Simulados para Gráficos
const areaData = [
  { name: 'Jan', completados: 30, pendientes: 20 },
  { name: 'Feb', completados: 45, pendientes: 35 },
  { name: 'Mar', completados: 35, pendientes: 40 },
  { name: 'Apr', completados: 60, pendientes: 30 },
  { name: 'May', completados: 75, pendientes: 45 },
  { name: 'Jun', completados: 55, pendientes: 35 },
  { name: 'Jul', completados: 90, pendientes: 50 },
];

const barData = [
  { name: 'Mon', tickets: 40 },
  { name: 'Tue', tickets: 15 },
  { name: 'Wed', tickets: 60 },
  { name: 'Thu', tickets: 35 },
  { name: 'Fri', tickets: 80 },
  { name: 'Sat', tickets: 45 },
  { name: 'Sun', tickets: 10 },
];

const pieData = [
  { name: 'Flores', value: 45 },
  { name: 'Suscripciones', value: 25 },
  { name: 'Regalos', value: 15 },
  { name: 'Insumos B2B', value: 15 },
];

const COLORS = ['#00C6FF', '#8A2BE2', '#FF007F', '#39FF14'];

export default function DashboardOverview() {
  const { agent } = useAgentAuth();
  const supabase = createClient();
  const [totalProducts, setTotalProducts] = useState(0);

  useEffect(() => {
    supabase.from('productos').select('*', { count: 'exact', head: true })
      .then(({ count }) => {
        if (count !== null) setTotalProducts(count);
      });
  }, []);

  return (
    <div className="animate-in fade-in duration-500 relative pb-10">
      
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Centro de Mando</h1>
        <p className="text-gray-500">Bienvenido de vuelta, {agent?.name}. Aquí está tu resumen de hoy.</p>
      </header>

      {/* Grid Superior: Tarjetas Principales */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        
        {/* KPI 1: Ingresos */}
        <div className="bg-gradient-to-r from-fuchsia-600 to-pink-500 rounded-3xl p-6 shadow-[0_10px_30px_rgba(236,72,153,0.2)] text-white flex flex-col justify-between">
          <p className="text-sm font-medium text-pink-100 uppercase tracking-widest mb-4">Ventas del Mes</p>
          <div className="flex items-baseline gap-2 mb-2">
            <span className="text-5xl font-black tracking-tight">$4.5</span>
            <span className="text-xl font-medium text-pink-200">M</span>
          </div>
          <p className="text-xs text-pink-200 font-medium">+15% respecto al mes anterior</p>
        </div>

        {/* KPI 2: Entregas */}
        <div className="bg-gradient-to-r from-cyan-500 to-blue-500 rounded-3xl p-6 shadow-[0_10px_30px_rgba(6,182,212,0.2)] text-white flex flex-col justify-between">
          <p className="text-sm font-medium text-cyan-100 uppercase tracking-widest mb-4">Entregas Exitosas</p>
          <div className="flex items-baseline gap-2 mb-2">
            <span className="text-5xl font-black tracking-tight">128</span>
            <span className="text-xl font-medium text-cyan-200">pedidos</span>
          </div>
          <p className="text-xs text-cyan-200 font-medium">Tiempo prom. resolución: 2h 40m</p>
        </div>

        {/* Mini Stats (Right side on desktop) */}
        <div className="flex flex-col gap-4 justify-center">
          <div className="bg-[#141416] border border-gray-800 rounded-2xl p-4 flex items-center justify-between shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-purple-500/10 text-purple-500 flex items-center justify-center">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
              </div>
              <div>
                <p className="text-xs text-gray-500 font-bold uppercase tracking-wider">Nuevos Clientes</p>
                <p className="text-white font-bold text-lg">24</p>
              </div>
            </div>
            <span className="bg-green-500/20 text-green-400 text-xs font-bold px-2 py-1 rounded">-20%</span>
          </div>

          <div className="bg-[#141416] border border-gray-800 rounded-2xl p-4 flex items-center justify-between shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-blue-500/10 text-blue-500 flex items-center justify-center">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" /></svg>
              </div>
              <div>
                <p className="text-xs text-gray-500 font-bold uppercase tracking-wider">Bandeja Entrada</p>
                <p className="text-white font-bold text-lg">8</p>
              </div>
            </div>
            <span className="bg-red-500/20 text-red-400 text-xs font-bold px-2 py-1 rounded">+33%</span>
          </div>
        </div>

      </div>

      {/* Grid Medio: Gráfico Principal */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        
        {/* Area Chart */}
        <div className="lg:col-span-2 bg-[#141416] border border-gray-800 rounded-3xl p-6 shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-sm font-bold text-white tracking-widest uppercase">Evolución de Pedidos (Mensual)</h2>
            <div className="flex items-center gap-4 text-xs font-medium">
              <span className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-cyan-400"></div> Completados</span>
              <span className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-purple-500"></div> Pendientes</span>
            </div>
          </div>
          <div className="h-[250px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={areaData} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorCompletados" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.5}/>
                    <stop offset="95%" stopColor="#06b6d4" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorPendientes" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#a855f7" stopOpacity={0.5}/>
                    <stop offset="95%" stopColor="#a855f7" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#2a2a2e" vertical={false} />
                <XAxis dataKey="name" stroke="#6b7280" tick={{fill: '#6b7280', fontSize: 12}} axisLine={false} tickLine={false} />
                <YAxis stroke="#6b7280" tick={{fill: '#6b7280', fontSize: 12}} axisLine={false} tickLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1C1C1E', borderColor: '#374151', borderRadius: '12px', color: '#fff' }}
                  itemStyle={{ color: '#fff' }}
                />
                <Area type="monotone" dataKey="completados" stroke="#06b6d4" strokeWidth={3} fillOpacity={1} fill="url(#colorCompletados)" />
                <Area type="monotone" dataKey="pendientes" stroke="#a855f7" strokeWidth={3} fillOpacity={1} fill="url(#colorPendientes)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Side Panel: Acciones Rápidas (Reemplazo de los accesos antiguos) */}
        <div className="bg-[#141416] border border-gray-800 rounded-3xl p-6 shadow-sm flex flex-col">
          <h2 className="text-sm font-bold text-white tracking-widest uppercase mb-6">Operaciones Frecuentes</h2>
          <div className="space-y-3 flex-1">
            <a href="/agentes/dashboard/catalogo" className="flex items-center justify-between p-4 bg-[#1a1a1c] border border-gray-800 rounded-2xl hover:border-cyan-500/50 transition-colors group">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-cyan-500/10 text-cyan-400 flex items-center justify-center font-bold">+</div>
                <span className="text-sm font-bold text-gray-300 group-hover:text-white">Añadir Producto</span>
              </div>
              <span className="text-gray-600 group-hover:text-cyan-400">➔</span>
            </a>
            
            <a href="/agentes/dashboard/pedidos" className="flex items-center justify-between p-4 bg-[#1a1a1c] border border-gray-800 rounded-2xl hover:border-purple-500/50 transition-colors group">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-purple-500/10 text-purple-400 flex items-center justify-center font-bold">📋</div>
                <span className="text-sm font-bold text-gray-300 group-hover:text-white">Imprimir Órdenes</span>
              </div>
              <span className="text-gray-600 group-hover:text-purple-400">➔</span>
            </a>

            <div className="mt-auto pt-4">
              <p className="text-xs text-gray-500 mb-1 font-medium">Productos Activos en Sistema</p>
              <p className="text-2xl font-black text-white">{totalProducts}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Grid Inferior: Donut y Barras */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Donut Chart */}
        <div className="bg-[#141416] border border-gray-800 rounded-3xl p-6 shadow-sm flex flex-col">
          <h2 className="text-sm font-bold text-white tracking-widest uppercase mb-6">Distribución por Categoría</h2>
          <div className="h-[220px] w-full flex items-center justify-center relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={65}
                  outerRadius={90}
                  paddingAngle={5}
                  dataKey="value"
                  stroke="none"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1C1C1E', borderColor: '#374151', borderRadius: '12px', color: '#fff' }}
                  itemStyle={{ color: '#fff' }}
                />
              </PieChart>
            </ResponsiveContainer>
            {/* Texto en el centro del donut */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-xs text-gray-500 font-bold">Total Ventas</span>
              <span className="text-2xl font-black text-white">100%</span>
            </div>
          </div>
          
          <div className="mt-4 grid grid-cols-2 gap-3">
             {pieData.map((entry, index) => (
               <div key={index} className="flex items-center gap-2">
                 <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }}></div>
                 <span className="text-xs font-medium text-gray-400">{entry.name} <span className="text-white font-bold ml-1">{entry.value}%</span></span>
               </div>
             ))}
          </div>
        </div>

        {/* Bar Chart */}
        <div className="bg-[#141416] border border-gray-800 rounded-3xl p-6 shadow-sm">
          <h2 className="text-sm font-bold text-white tracking-widest uppercase mb-6">Volumen Semanal</h2>
          <div className="h-[220px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData} margin={{ top: 10, right: 0, left: -30, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#2a2a2e" vertical={false} />
                <XAxis dataKey="name" stroke="#6b7280" tick={{fill: '#6b7280', fontSize: 12}} axisLine={false} tickLine={false} />
                <YAxis stroke="#6b7280" tick={{fill: '#6b7280', fontSize: 12}} axisLine={false} tickLine={false} />
                <Tooltip 
                  cursor={{fill: '#1a1a1c'}}
                  contentStyle={{ backgroundColor: '#1C1C1E', borderColor: '#374151', borderRadius: '12px', color: '#fff' }}
                />
                <Bar dataKey="tickets" radius={[4, 4, 0, 0]}>
                  {
                    barData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={index % 2 === 0 ? '#00C6FF' : '#8A2BE2'} />
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
