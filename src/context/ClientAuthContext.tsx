'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase/client';
import { Session, User } from '@supabase/supabase-js';

interface ClientAuthContextType {
  user: User | any | null;
  session: Session | any | null;
  loading: boolean;
  loginWithEmail: (email: string) => void;
  signOut: () => Promise<void>;
}

const ClientAuthContext = createContext<ClientAuthContextType>({
  user: null,
  session: null,
  loading: true,
  loginWithEmail: () => {},
  signOut: async () => {},
});

export function ClientAuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | any | null>(null);
  const [session, setSession] = useState<Session | any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isSubscribed = true;

    // 1. Check local instant client session
    const storedClient = typeof window !== 'undefined' ? localStorage.getItem('chileflor_client_user') : null;
    if (storedClient) {
      try {
        const parsed = JSON.parse(storedClient);
        if (parsed && parsed.email) {
          setUser(parsed);
          setLoading(false);
        }
      } catch (e) {
        localStorage.removeItem('chileflor_client_user');
      }
    }

    // 2. Check Supabase session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (isSubscribed && session?.user) {
        setSession(session);
        setUser(session.user);
      }
    }).catch(err => {
      console.error('Supabase session fetch error:', err);
    }).finally(() => {
      if (isSubscribed) {
        setLoading(false);
      }
    });

    // 3. Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!isSubscribed) return;
      if (session?.user) {
        setSession(session);
        setUser(session.user);
      } else {
        const localUser = localStorage.getItem('chileflor_client_user');
        if (localUser) {
          try {
            setUser(JSON.parse(localUser));
          } catch (e) {
            setUser(null);
            setSession(null);
          }
        } else {
          setUser(null);
          setSession(null);
        }
      }
      setLoading(false);
    });

    return () => {
      isSubscribed = false;
      subscription.unsubscribe();
    };
  }, []);

  const loginWithEmail = (email: string) => {
    const cleanEmail = email.trim().toLowerCase();
    const namePart = cleanEmail.split('@')[0] || cleanEmail;
    const formattedName = namePart.charAt(0).toUpperCase() + namePart.slice(1);
    
    const clientUser = {
      id: `client-${Date.now()}`,
      email: cleanEmail,
      user_metadata: {
        full_name: formattedName
      }
    };
    
    setUser(clientUser);
    localStorage.setItem('chileflor_client_user', JSON.stringify(clientUser));
  };

  const signOut = async () => {
    localStorage.removeItem('chileflor_client_user');
    localStorage.removeItem('vip_customer_email');
    setUser(null);
    setSession(null);
    await supabase.auth.signOut();
  };

  return (
    <ClientAuthContext.Provider value={{ user, session, loading, loginWithEmail, signOut }}>
      {children}
    </ClientAuthContext.Provider>
  );
}

export function useClientAuth() {
  const context = useContext(ClientAuthContext);
  if (context === undefined) {
    throw new Error('useClientAuth must be used within a ClientAuthProvider');
  }
  return context;
}
