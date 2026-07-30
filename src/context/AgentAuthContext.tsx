'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter, usePathname } from 'next/navigation';

export type AgentRole = 'ADMIN' | 'STANDARD';

export interface AgentPermissions {
  eliminar_productos: boolean;
  editar_precios: boolean;
  ajustar_puntos_vip: boolean;
  gestionar_pedidos: boolean;
}

export interface Agent {
  username: string; // Puede ser el nombre de usuario o correo (ej: nombre@chileflor.cl)
  role: AgentRole;
  name: string;
  permissions?: AgentPermissions;
}

interface AgentAuthContextType {
  agent: Agent | null;
  login: (username: string, clave: string) => boolean;
  logout: () => void;
  createAgent: (newAgent: Agent, clave: string) => boolean; // Solo ADMIN puede
  getAgents: () => Agent[];
  updateAgentPermissions: (username: string, permissions: AgentPermissions) => boolean;
}

const AgentAuthContext = createContext<AgentAuthContextType | undefined>(undefined);

const MASTER_ADMINS = [
  {
    username: 'Chileflor1987',
    clave: 'Chileflor1851lf',
    role: 'ADMIN' as AgentRole,
    name: 'Admin Principal'
  },
  {
    username: 'chilflor1234',
    clave: 'Chileflor1851',
    role: 'ADMIN' as AgentRole,
    name: 'Admin Chileflor'
  },
  {
    username: 'chileflor1234',
    clave: 'Chileflor1851',
    role: 'ADMIN' as AgentRole,
    name: 'Admin Chileflor'
  }
];

export function AgentAuthProvider({ children }: { children: ReactNode }) {
  const [agent, setAgent] = useState<Agent | null>(null);
  const [mounted, setMounted] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  // Cargar estado inicial desde localStorage
  useEffect(() => {
    setMounted(true);
    const storedAgent = localStorage.getItem('chileflor_agent_session');
    if (storedAgent) {
      setAgent(JSON.parse(storedAgent));
    }
  }, []);

  // Proteger rutas
  useEffect(() => {
    if (!mounted) return;
    
    const isAgentesRoute = pathname.startsWith('/agentes');
    const isLoginRoute = pathname === '/agentes/login';

    if (isAgentesRoute && !isLoginRoute && !agent) {
      router.push('/agentes/login');
    } else if (isLoginRoute && agent) {
      router.push('/agentes/dashboard');
    }
  }, [agent, pathname, mounted, router]);

  const login = (username: string, clave: string) => {
    const cleanUsername = (username || '').trim().toLowerCase();
    const cleanClave = (clave || '').trim();

    if (!cleanUsername || !cleanClave) return false;

    // 1. Check Master Admin
    const foundMaster = MASTER_ADMINS.find(
      a => a.username.toLowerCase() === cleanUsername && a.clave === cleanClave
    );
    if (foundMaster) {
      const sessionData: Agent = { username: foundMaster.username, role: foundMaster.role, name: foundMaster.name };
      setAgent(sessionData);
      localStorage.setItem('chileflor_agent_session', JSON.stringify(sessionData));
      return true;
    }

    // 2. Check Local Storage Created Agents
    const storedAgentsData = localStorage.getItem('chileflor_created_agents');
    if (storedAgentsData) {
      const agents = JSON.parse(storedAgentsData);
      const found = agents.find((a: any) => a.username.toLowerCase() === cleanUsername && a.clave === cleanClave);
      if (found) {
        const sessionData: Agent = { 
          username: found.username, 
          role: found.role, 
          name: found.name,
          permissions: found.permissions
        };
        setAgent(sessionData);
        localStorage.setItem('chileflor_agent_session', JSON.stringify(sessionData));
        return true;
      }
    }

    return false;
  };

  const logout = () => {
    setAgent(null);
    localStorage.removeItem('chileflor_agent_session');
    router.push('/agentes/login');
  };

  const createAgent = (newAgent: Agent, clave: string) => {
    if (agent?.role !== 'ADMIN') return false; // Solo el admin puede crear

    const storedAgentsData = localStorage.getItem('chileflor_created_agents');
    const currentAgents = storedAgentsData ? JSON.parse(storedAgentsData) : [];
    
    // Verificar si ya existe
    if (currentAgents.find((a: any) => a.username === newAgent.username) || MASTER_ADMINS.some(a => a.username.toLowerCase() === newAgent.username.toLowerCase())) {
      return false; 
    }

    const defaultPermissions: AgentPermissions = {
      eliminar_productos: false,
      editar_precios: false,
      ajustar_puntos_vip: false,
      gestionar_pedidos: false
    };

    currentAgents.push({ ...newAgent, clave, permissions: defaultPermissions });
    localStorage.setItem('chileflor_created_agents', JSON.stringify(currentAgents));
    return true;
  };

  const getAgents = () => {
    const storedAgentsData = localStorage.getItem('chileflor_created_agents');
    const created = storedAgentsData ? JSON.parse(storedAgentsData) : [];
    return [
      ...MASTER_ADMINS.map(a => ({ username: a.username, role: a.role, name: a.name, permissions: undefined })),
      ...created.map((a: any) => ({ 
        username: a.username, 
        role: a.role, 
        name: a.name,
        permissions: a.permissions || {
          eliminar_productos: false,
          editar_precios: false,
          ajustar_puntos_vip: false,
          gestionar_pedidos: false
        }
      }))
    ];
  };

  const updateAgentPermissions = (username: string, permissions: AgentPermissions) => {
    if (agent?.role !== 'ADMIN') return false;
    
    const storedAgentsData = localStorage.getItem('chileflor_created_agents');
    if (!storedAgentsData) return false;
    
    const agents = JSON.parse(storedAgentsData);
    const index = agents.findIndex((a: any) => a.username === username);
    
    if (index !== -1) {
      agents[index].permissions = permissions;
      localStorage.setItem('chileflor_created_agents', JSON.stringify(agents));
      return true;
    }
    return false;
  };

  if (!mounted) return null;

  return (
    <AgentAuthContext.Provider value={{ agent, login, logout, createAgent, getAgents, updateAgentPermissions }}>
      {children}
    </AgentAuthContext.Provider>
  );
}

export const useAgentAuth = () => {
  const context = useContext(AgentAuthContext);
  if (!context) throw new Error('useAgentAuth debe usarse dentro de un AgentAuthProvider');
  return context;
};
