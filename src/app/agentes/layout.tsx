import { AgentAuthProvider } from '@/context/AgentAuthContext';

export default function AgentesLayout({ children }: { children: React.ReactNode }) {
  return (
    <AgentAuthProvider>
      {children}
    </AgentAuthProvider>
  );
}
