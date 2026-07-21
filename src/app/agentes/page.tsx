'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function AgentesRootRedirect() {
  const router = useRouter();

  useEffect(() => {
    // El AgentAuthContext en el layout ya se encarga de redirigir 
    // a /login o a /dashboard dependiendo del estado.
    // Solo forzamos una redirección al dashboard si llegara a renderizarse esto.
    router.replace('/agentes/dashboard');
  }, [router]);

  return (
    <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center">
      <div className="animate-pulse w-12 h-12 rounded-full border-4 border-primary border-t-transparent animate-spin"></div>
    </div>
  );
}
