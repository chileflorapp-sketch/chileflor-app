'use client';

import { useAgentAuth } from '@/context/AgentAuthContext';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Package, Truck, Users, ShieldAlert, LogOut, ExternalLink, Mail, Navigation } from 'lucide-react';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { agent, logout } = useAgentAuth();
  const pathname = usePathname();

  if (!agent) return null;

  const menu = [
    { name: 'Dashboard', path: '/agentes/dashboard', icon: <LayoutDashboard size={18} /> },
    { name: 'Catálogo', path: '/agentes/dashboard/catalogo', icon: <Package size={18} /> },
    { name: 'Catálogo B2B', path: '/agentes/dashboard/catalogo-b2b', icon: <Package size={18} /> },
    { name: 'Pedidos y B2B', path: '/agentes/dashboard/pedidos', icon: <Truck size={18} /> },
    { name: 'Logística', path: '/agentes/dashboard/logistica', icon: <Navigation size={18} /> },
    { name: 'Tarjetas Digitales', path: '/agentes/dashboard/tarjetas', icon: <Mail size={18} /> },
    { name: 'Clientes VIP', path: '/agentes/dashboard/clientes', icon: <Users size={18} /> },
  ];

  menu.push({ name: 'Apariencia Web', path: '/agentes/dashboard/apariencia', icon: <LayoutDashboard size={18} /> });
  if (agent.role === 'ADMIN') {
    menu.push({ name: 'Agentes', path: '/agentes/dashboard/agentes', icon: <ShieldAlert size={18} /> });
  }

  return (
    <div className="min-h-screen bg-[#070709] text-gray-200 flex flex-col md:flex-row font-sans relative overflow-x-hidden">
      
      {/* Background ambient glowing mesh blobs */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-purple-900/15 rounded-full blur-[120px] animate-blob" />
        <div className="absolute top-1/3 -right-40 w-96 h-96 bg-fuchsia-900/15 rounded-full blur-[120px] animate-blob animation-delay-2000" />
        <div className="absolute -bottom-40 left-1/3 w-96 h-96 bg-rose-900/15 rounded-full blur-[120px] animate-blob animation-delay-4000" />
      </div>

      {/* Sidebar Premium CRM */}
      <aside className="print:hidden w-full md:w-[270px] bg-[#0E0E12]/90 backdrop-blur-2xl border-r border-white/5 flex flex-col h-auto md:h-screen md:sticky md:top-0 z-30 shadow-[4px_0_30px_rgba(0,0,0,0.8)]">
        
        {/* Logo & Profile */}
        <div className="p-6 relative border-b border-white/5">
          <div className="flex items-center justify-between mb-6">
            <a href="/agentes/dashboard" className="flex items-center gap-2 group">
              <img src="/logo.png" alt="Chileflor CRM" className="h-8 opacity-95 group-hover:scale-105 transition-transform" />
              <span className="bg-gradient-to-r from-fuchsia-500 to-rose-400 text-transparent bg-clip-text font-black text-xs uppercase tracking-widest px-2 py-0.5 rounded-full bg-fuchsia-950/40 border border-fuchsia-500/20">
                CRM
              </span>
            </a>
          </div>
           
           <div className="flex items-center gap-3.5 p-3 rounded-2xl bg-white/[0.03] border border-white/5 backdrop-blur-sm">
             <div className="relative">
               <div className="w-11 h-11 rounded-full bg-gradient-to-tr from-fuchsia-600 via-purple-600 to-rose-500 flex items-center justify-center text-white font-extrabold text-base shadow-lg shadow-purple-500/25">
                 {agent.name.charAt(0)}
               </div>
               <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-400 border-2 border-[#0E0E12] rounded-full shadow-[0_0_8px_#34d399]" />
             </div>
             <div className="flex flex-col min-w-0">
               <span className="text-sm font-bold text-white truncate">{agent.name}</span>
               <div className="flex items-center gap-1.5 mt-0.5">
                 <span className="inline-block w-1.5 h-1.5 rounded-full bg-fuchsia-400 animate-ping" />
                 <span className="text-[10px] text-fuchsia-400 font-extrabold uppercase tracking-widest truncate">{agent.role}</span>
               </div>
             </div>
           </div>
        </div>

        {/* Navigation Menu */}
        <div className="px-4 py-5 flex-1 overflow-y-auto custom-scrollbar">
          <p className="px-3 text-[10px] font-extrabold text-gray-500 uppercase tracking-widest mb-3">Menú Operativo</p>
          <nav className="space-y-1">
            {menu.map((item) => {
              const active = pathname === item.path;
              return (
                <a 
                  key={item.path} 
                  href={item.path}
                  className={`flex items-center gap-3.5 px-3.5 py-3 rounded-xl text-sm font-semibold transition-all duration-300 group relative ${
                    active 
                      ? 'bg-gradient-to-r from-fuchsia-950/60 via-purple-950/40 to-transparent text-white border-l-2 border-fuchsia-500 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]' 
                      : 'text-gray-400 hover:text-white hover:bg-white/[0.04] border-l-2 border-transparent'
                  }`}
                >
                  <span className={`p-1.5 rounded-lg transition-colors ${
                    active 
                      ? 'bg-fuchsia-500/20 text-fuchsia-400 shadow-[0_0_12px_rgba(217,70,239,0.3)]' 
                      : 'text-gray-400 group-hover:text-fuchsia-400 group-hover:bg-white/5'
                  }`}>
                    {item.icon}
                  </span>
                  <span className="truncate">{item.name}</span>
                  {active && (
                    <span className="ml-auto w-1.5 h-1.5 rounded-full bg-fuchsia-400 shadow-[0_0_8px_#e879f9]" />
                  )}
                </a>
              );
            })}
          </nav>
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-white/5 flex flex-col gap-2 bg-[#0A0A0D]">
          <a 
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full flex items-center justify-between px-3.5 py-2.5 text-gray-400 hover:text-white bg-white/[0.02] hover:bg-white/[0.06] border border-white/5 hover:border-white/10 rounded-xl text-xs font-semibold transition-all group"
          >
            <span className="flex items-center gap-2">
              <ExternalLink size={15} className="group-hover:scale-110 transition-transform" />
              Tienda Chileflor
            </span>
            <span className="text-[10px] text-fuchsia-400/80 font-mono">Live ➔</span>
          </a>
          <button 
            onClick={logout}
            className="w-full flex items-center justify-center gap-2 px-3.5 py-2.5 text-rose-400/80 hover:text-rose-300 hover:bg-rose-500/10 border border-rose-500/10 hover:border-rose-500/20 rounded-xl text-xs font-semibold transition-all"
          >
            <LogOut size={15} />
            Cerrar Sesión
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 min-w-0 h-full md:h-screen overflow-y-auto bg-transparent print:bg-white print:overflow-visible relative z-10">
        
        {/* Top Operational Status Bar */}
        <div className="print:hidden sticky top-0 z-20 bg-[#0A0A0D]/80 backdrop-blur-xl border-b border-white/5 px-6 py-2.5 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 overflow-hidden">
            <span className="flex h-2 w-2 relative shrink-0">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
            </span>
            <div className="text-xs text-gray-300 font-medium truncate flex items-center gap-2">
              <span className="text-white font-bold">Sistema Agentes Activo</span>
              <span className="text-gray-600">|</span>
              <span className="text-fuchsia-400 font-mono text-[11px]">⚡ Entregas Hoy en curso</span>
            </div>
          </div>
          <div className="flex items-center gap-3 text-xs text-gray-400 shrink-0">
            <span className="hidden sm:inline bg-white/5 px-2.5 py-1 rounded-full border border-white/5 text-[11px] font-mono text-gray-300">
              📅 {new Date().toLocaleDateString('es-CL', { weekday: 'short', month: 'short', day: 'numeric' })}
            </span>
          </div>
        </div>

        <div className="p-4 sm:p-6 md:p-8 max-w-7xl mx-auto print:p-0 print:max-w-none">
          {children}
        </div>
      </main>

    </div>
  );
}
