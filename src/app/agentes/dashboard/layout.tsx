'use client';

import { useAgentAuth } from '@/context/AgentAuthContext';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Package, Truck, Users, ShieldAlert, LogOut } from 'lucide-react';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { agent, logout } = useAgentAuth();
  const pathname = usePathname();

  if (!agent) return null;

  const menu = [
    { name: 'Dashboard', path: '/agentes/dashboard', icon: <LayoutDashboard size={18} /> },
    { name: 'Catálogo', path: '/agentes/dashboard/catalogo', icon: <Package size={18} /> },
    { name: 'Catálogo B2B', path: '/agentes/dashboard/catalogo-b2b', icon: <Package size={18} /> },
    { name: 'Pedidos y B2B', path: '/agentes/dashboard/pedidos', icon: <Truck size={18} /> },
    { name: 'Clientes VIP', path: '/agentes/dashboard/clientes', icon: <Users size={18} /> },
  ];

  if (agent.role === 'ADMIN') {
    menu.push({ name: 'Agentes', path: '/agentes/dashboard/agentes', icon: <ShieldAlert size={18} /> });
  }

  return (
    <div className="min-h-screen bg-[#0A0A0A] flex flex-col md:flex-row font-sans text-gray-300">
      
      {/* Sidebar Premium CRM */}
      <aside className="print:hidden w-full md:w-[260px] bg-[#111111] md:bg-[#141416] border-r border-[#1C1C1E] flex flex-col h-auto md:h-screen md:sticky md:top-0 z-30 shadow-[4px_0_24px_rgba(0,0,0,0.5)]">
        
        {/* Logo & Profile */}
        <div className="p-6">
           <img src="/logo.png" alt="Chileflor" className="h-7 mb-8 opacity-90" />
           
           <div className="flex items-center gap-4 mb-2">
             <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-fuchsia-600 to-purple-600 flex items-center justify-center text-white font-bold shadow-lg shadow-purple-500/20">
               {agent.name.charAt(0)}
             </div>
             <div className="flex flex-col">
               <span className="text-sm font-bold text-white truncate max-w-[140px]">{agent.name}</span>
               <span className="text-[10px] text-fuchsia-400 font-bold uppercase tracking-wider">{agent.role}</span>
             </div>
           </div>
        </div>

        {/* Navigation Menu */}
        <div className="px-6 py-4">
          <p className="text-[10px] font-bold text-gray-600 uppercase tracking-widest mb-4">Menú Principal</p>
          <nav className="space-y-1.5">
            {menu.map((item) => {
              const active = pathname === item.path;
              return (
                <a 
                  key={item.path} 
                  href={item.path}
                  className={`flex items-center gap-4 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300 group ${
                    active 
                      ? 'bg-gradient-to-r from-[#2A1B38] to-[#1C1226] text-white border-l-4 border-fuchsia-500 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]' 
                      : 'text-gray-400 hover:text-white hover:bg-[#1C1C1E]/50 border-l-4 border-transparent'
                  }`}
                >
                  <span className={`${active ? 'text-fuchsia-400' : 'text-gray-500 group-hover:text-gray-300'} transition-colors`}>
                    {item.icon}
                  </span>
                  {item.name}
                </a>
              );
            })}
          </nav>
        </div>

        <div className="mt-auto p-6">
          <button 
            onClick={logout}
            className="w-full flex items-center gap-3 px-4 py-3 text-gray-500 hover:text-white rounded-xl text-sm font-medium transition-colors hover:bg-white/5"
          >
            <LogOut size={18} />
            Cerrar Sesión
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 h-full md:h-screen overflow-y-auto bg-[#0A0A0A] print:bg-white print:overflow-visible">
        <div className="p-6 md:p-10 max-w-7xl mx-auto print:p-0 print:max-w-none">
          {children}
        </div>
      </main>

    </div>
  );
}
