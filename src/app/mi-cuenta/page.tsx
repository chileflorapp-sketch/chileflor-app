'use client';

import { useEffect, useState } from 'react';
import { useClientAuth } from '@/context/ClientAuthContext';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase/client';
import { User, Package, MapPin, Ticket, LogOut, Loader2, Heart } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

export default function MiCuenta() {
  const { user, loading, signOut } = useClientAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('pedidos');
  const [orders, setOrders] = useState<any[]>([]);
  const [fetchingOrders, setFetchingOrders] = useState(false);

  useEffect(() => {
    // Verificamos si venimos de un Magic Link (con parámetro code)
    const code = new URLSearchParams(window.location.search).get('code');

    const verify = async () => {
      if (code) {
        // Intercambiar código PKCE por sesión
        const { error } = await supabase.auth.exchangeCodeForSession(code);
        if (!error) {
          window.history.replaceState({}, document.title, window.location.pathname);
          return; // La sesión se creó, el onAuthStateChange del contexto tomará el control
        }
      }

      // Evitar race condition: verificamos directamente con Supabase antes de echarlo a login.
      if (!loading && !user) {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) {
          router.push('/mi-cuenta/login');
        }
      }
    };

    verify();
  }, [user, loading, router]);

  useEffect(() => {
    if (user && activeTab === 'pedidos') {
      fetchOrders();
    }
  }, [user, activeTab]);

  const fetchOrders = async () => {
    if (!user) return;
    setFetchingOrders(true);
    try {
      const { data, error } = await supabase
        .from('pedidos')
        .select('*')
        .eq('cliente_email', user.email)
        .order('created_at', { ascending: false });
        
      if (!error && data) {
        setOrders(data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setFetchingOrders(false);
    }
  };

  const handleSignOut = async () => {
    await signOut();
    router.push('/');
  };

  if (loading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'PENDIENTE': return 'bg-yellow-100 text-yellow-800';
      case 'EN_PROCESO': return 'bg-blue-100 text-blue-800';
      case 'EN_CAMINO': return 'bg-purple-100 text-purple-800';
      case 'ENTREGADO': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen pb-20">
      <div className="bg-gradient-to-r from-primary to-rose-600 pb-24 pt-10">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-4 text-white">
            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center text-2xl font-bold backdrop-blur-md">
              {user.user_metadata?.full_name?.charAt(0) || user.email?.charAt(0).toUpperCase()}
            </div>
            <div>
              <h1 className="text-2xl font-bold">{user.user_metadata?.full_name || 'Mi Cuenta'}</h1>
              <p className="text-white/80">{user.email}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 -mt-16">
        <div className="bg-white rounded-3xl shadow-lg border border-gray-100 overflow-hidden flex flex-col md:flex-row">
          
          {/* Sidebar */}
          <div className="w-full md:w-64 bg-gray-50 border-r border-gray-100 p-4">
            <nav className="flex md:flex-col gap-2 overflow-x-auto no-scrollbar">
              <button 
                onClick={() => setActiveTab('pedidos')}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm transition-all whitespace-nowrap ${activeTab === 'pedidos' ? 'bg-primary text-white shadow-md' : 'text-gray-600 hover:bg-gray-100'}`}
              >
                <Package className="w-5 h-5" /> Mis Pedidos
              </button>
              <button 
                onClick={() => setActiveTab('favoritos')}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm transition-all whitespace-nowrap ${activeTab === 'favoritos' ? 'bg-primary text-white shadow-md' : 'text-gray-600 hover:bg-gray-100'}`}
              >
                <Heart className="w-5 h-5" /> Mis Favoritos
              </button>
              <button 
                onClick={() => setActiveTab('cupones')}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm transition-all whitespace-nowrap ${activeTab === 'cupones' ? 'bg-primary text-white shadow-md' : 'text-gray-600 hover:bg-gray-100'}`}
              >
                <Ticket className="w-5 h-5" /> Mis Cupones
              </button>
              
              <div className="md:mt-auto pt-4 md:border-t border-gray-200">
                <button 
                  onClick={handleSignOut}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm text-red-500 hover:bg-red-50 transition-all whitespace-nowrap w-full"
                >
                  <LogOut className="w-5 h-5" /> Cerrar Sesión
                </button>
              </div>
            </nav>
          </div>

          {/* Content */}
          <div className="flex-1 p-6 md:p-10 min-h-[500px]">
            
            {activeTab === 'pedidos' && (
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Historial de Pedidos</h2>
                
                {fetchingOrders ? (
                  <div className="flex justify-center py-10">
                    <Loader2 className="w-8 h-8 animate-spin text-primary" />
                  </div>
                ) : orders.length === 0 ? (
                  <div className="text-center py-16 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                    <Package className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-bold text-gray-900 mb-1">Aún no tienes pedidos</h3>
                    <p className="text-gray-500 mb-6">¡Explora nuestro catálogo y encuentra el arreglo perfecto!</p>
                    <Link href="/catalogo" className="bg-primary text-white font-bold px-6 py-3 rounded-xl hover:bg-primary-dark transition-colors inline-block">
                      Ver Catálogo
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {orders.map((order) => (
                      <div key={order.id} className="border border-gray-100 rounded-2xl p-5 hover:shadow-md transition-shadow bg-white">
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4 pb-4 border-b border-gray-50">
                          <div>
                            <p className="text-xs text-gray-400 font-bold uppercase">Orden {order.id.split('-')[0]}</p>
                            <p className="font-bold text-gray-900">{new Date(order.created_at).toLocaleDateString('es-CL', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                          </div>
                          <span className={`px-3 py-1 rounded-full text-xs font-bold ${getStatusColor(order.estado)}`}>
                            {order.estado}
                          </span>
                        </div>
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                          <div>
                            <p className="text-sm text-gray-500 mb-1">Destinatario: <strong className="text-gray-900">{order.destinatario_nombre}</strong></p>
                            <p className="text-sm text-gray-500">Total: <strong className="text-primary text-lg font-black">${order.total?.toLocaleString('es-CL')}</strong></p>
                          </div>
                          <Link href={`/seguimiento?orden=${order.id}`} className="bg-gray-100 text-gray-700 hover:bg-gray-200 font-bold px-4 py-2 rounded-xl text-sm transition-colors">
                            Ver Detalles
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'favoritos' && (
              <div className="text-center py-16">
                <Heart className="w-12 h-12 text-rose-200 mx-auto mb-4" />
                <h3 className="text-lg font-bold text-gray-900 mb-1">Tus productos favoritos</h3>
                <p className="text-gray-500">Aquí aparecerán los productos que marques con el corazón.</p>
              </div>
            )}

            {activeTab === 'cupones' && (
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Mis Cupones</h2>
                <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-2xl p-6 relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-4 opacity-10">
                    <Ticket className="w-24 h-24 text-yellow-600" />
                  </div>
                  <div className="relative z-10">
                    <span className="bg-yellow-400 text-yellow-900 text-xs font-black px-2 py-1 rounded uppercase tracking-widest mb-3 inline-block">Cupón de Bienvenida</span>
                    <h3 className="text-2xl font-black text-gray-900 mb-2">10% OFF en tu primera compra</h3>
                    <p className="text-gray-600 mb-4">Válido para todo el catálogo sin monto mínimo.</p>
                    <div className="bg-white border-2 border-dashed border-yellow-400 rounded-xl px-4 py-3 inline-block">
                      <span className="font-mono font-bold text-xl tracking-widest text-gray-900 select-all">CHILEFLOR10</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
}
