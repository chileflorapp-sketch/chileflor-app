'use client';

import { useState } from 'react';
import { useAgentAuth, Agent, AgentPermissions } from '@/context/AgentAuthContext';

export default function AgentesManagement() {
  const { agent, createAgent, getAgents, updateAgentPermissions } = useAgentAuth();
  
  const [newUsername, setNewUsername] = useState('');
  const [newName, setNewName] = useState('');
  const [newClave, setNewClave] = useState('');
  const [message, setMessage] = useState('');
  
  // Local state to force re-render when permissions change
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  if (agent?.role !== 'ADMIN') {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] text-center">
        <span className="text-6xl mb-4">⛔</span>
        <h2 className="text-2xl font-bold text-white mb-2">Acceso Denegado</h2>
        <p className="text-gray-400">Solo el Agente Principal (ADMIN) puede gestionar el personal.</p>
        <p className="text-gray-500 text-sm mt-2">Por favor, escala la solicitud a administración.</p>
      </div>
    );
  }

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUsername.endsWith('@chileflor.cl')) {
      setMessage('El usuario debe ser un correo institucional (@chileflor.cl)');
      return;
    }

    const newAgent: Agent = {
      username: newUsername,
      role: 'STANDARD',
      name: newName
    };

    const success = createAgent(newAgent, newClave);
    if (success) {
      setMessage('Agente creado exitosamente.');
      setNewUsername('');
      setNewName('');
      setNewClave('');
      setRefreshTrigger(prev => prev + 1);
    } else {
      setMessage('Error: El agente ya existe.');
    }
  };

  const handleTogglePermission = (targetUsername: string, currentPerms: AgentPermissions, permKey: keyof AgentPermissions) => {
    const newPerms = { ...currentPerms, [permKey]: !currentPerms[permKey] };
    const success = updateAgentPermissions(targetUsername, newPerms);
    if (success) {
      setRefreshTrigger(prev => prev + 1);
    }
  };

  const agentsList = getAgents();

  return (
    <div className="animate-in fade-in duration-500">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Gestión de Agentes y Permisos</h1>
        <p className="text-gray-400">Administra los accesos y los límites de seguridad del personal.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Formulario de Creación */}
        <div className="bg-[#1C1C1E] border border-gray-800 rounded-3xl p-8 lg:col-span-1 h-fit">
          <h2 className="text-xl font-bold text-white mb-6">Crear Nuevo Agente</h2>
          
          {message && (
            <div className={`p-4 rounded-xl mb-6 text-sm font-medium ${message.includes('Error') || message.includes('debe ser') ? 'bg-red-500/10 text-red-500 border border-red-500/20' : 'bg-green-500/10 text-green-500 border border-green-500/20'}`}>
              {message}
            </div>
          )}

          <form onSubmit={handleCreate} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Nombre Completo</label>
              <input required value={newName} onChange={e => setNewName(e.target.value)} type="text" className="w-full bg-[#111111] border border-gray-800 rounded-xl px-4 py-3 text-white focus:border-primary outline-none" placeholder="Ej: Pedro Ventas" />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Correo Institucional</label>
              <input required value={newUsername} onChange={e => setNewUsername(e.target.value)} type="email" className="w-full bg-[#111111] border border-gray-800 rounded-xl px-4 py-3 text-white focus:border-primary outline-none" placeholder="pedro@chileflor.cl" />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Clave de Acceso</label>
              <input required value={newClave} onChange={e => setNewClave(e.target.value)} type="password" className="w-full bg-[#111111] border border-gray-800 rounded-xl px-4 py-3 text-white focus:border-primary outline-none" placeholder="••••••••" />
            </div>
            <button type="submit" className="w-full bg-white text-black font-bold py-4 rounded-xl hover:bg-gray-200 transition-colors mt-4">
              Registrar Agente
            </button>
            <p className="text-[10px] text-gray-500 mt-2 text-center">Los nuevos agentes nacen con todos los permisos bloqueados por seguridad.</p>
          </form>
        </div>

        {/* Lista de Agentes y Matriz de Permisos */}
        <div className="bg-[#111111] border border-gray-800 rounded-3xl p-8 lg:col-span-2">
          <h2 className="text-xl font-bold text-white mb-6">Personal Activo y Matriz de Permisos</h2>
          <div className="space-y-6">
            {agentsList.map((a: Agent, idx: number) => (
              <div key={idx} className="bg-[#1C1C1E] border border-gray-800 p-6 rounded-2xl">
                <div className="flex items-center justify-between mb-4 pb-4 border-b border-gray-800">
                  <div>
                    <p className="font-bold text-white text-lg mb-1">{a.name}</p>
                    <p className="text-sm text-gray-400">{a.username}</p>
                  </div>
                  <span className={`px-3 py-1 rounded text-xs font-bold uppercase tracking-wider ${a.role === 'ADMIN' ? 'bg-primary/20 text-primary border border-primary/30' : 'bg-blue-500/20 text-blue-400 border border-blue-500/30'}`}>
                    {a.role}
                  </span>
                </div>

                {a.role === 'ADMIN' ? (
                  <p className="text-sm text-gray-500 italic">El Administrador Principal tiene todos los permisos implícitos y no puede ser restringido.</p>
                ) : (
                  <div className="space-y-4">
                    <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">Interruptores de Seguridad</p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {a.permissions && Object.entries(a.permissions).map(([key, value]) => {
                        const labels: Record<string, string> = {
                          eliminar_productos: 'Eliminar Productos del Catálogo',
                          editar_precios: 'Modificar Precios Base',
                          ajustar_puntos_vip: 'Regalar/Restar Puntos VIP',
                          gestionar_pedidos: 'Aprobar/Mover Pedidos'
                        };
                        const isCritical = key === 'eliminar_productos' || key === 'editar_precios';
                        
                        return (
                          <div key={key} className="flex items-center justify-between p-3 bg-[#111111] border border-gray-800 rounded-xl">
                            <div>
                              <p className={`text-sm font-bold ${value ? 'text-white' : 'text-gray-500'}`}>{labels[key] || key}</p>
                              {isCritical && <p className="text-[10px] text-red-500 font-bold mt-0.5">Riesgo Alto</p>}
                            </div>
                            <button 
                              onClick={() => handleTogglePermission(a.username, a.permissions!, key as keyof AgentPermissions)}
                              className={`w-12 h-6 rounded-full transition-colors relative flex items-center ${value ? 'bg-green-500' : 'bg-gray-700'}`}
                            >
                              <div className={`w-4 h-4 bg-white rounded-full absolute shadow-sm transition-transform ${value ? 'translate-x-7' : 'translate-x-1'}`}></div>
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
