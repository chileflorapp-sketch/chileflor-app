'use client';
import { useState } from 'react';

export default function PanelLogistica() {
  const [hub, setHub] = useState('Parque El Prado');
  const [toastMessage, setToastMessage] = useState('');
  
  // Simulated state for orders
  const [orders, setOrders] = useState([
    { id: 42, type: 'Entrega a Cementerio', location: 'Sector B, Lápida 102', status: 'PREPARANDO', evidenceUploaded: false },
    { id: 39, type: 'Mantención (Suscripción)', location: 'Sector Álamo, Lápida 15', status: 'EN RUTA', evidenceUploaded: false }
  ]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3000);
  };

  const updateOrderStatus = (id: number, newStatus: string) => {
    setOrders(orders.map(o => o.id === id ? { ...o, status: newStatus } : o));
    showToast(`Estado actualizado: ${newStatus}`);
  };

  const simulateEvidenceUpload = (id: number) => {
    showToast('📸 Subiendo evidencia...');
    setTimeout(() => {
      setOrders(orders.map(o => o.id === id ? { ...o, evidenceUploaded: true } : o));
      showToast('✅ Evidencia subida con éxito');
    }, 1500);
  };

  const completeOrder = (id: number) => {
    setOrders(orders.map(o => o.id === id ? { ...o, status: 'COMPLETADO' } : o));
    showToast('🎉 Orden completada');
  };

  const handleNavigate = (location: string) => {
    window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(hub + ' ' + location)}`, '_blank');
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl relative">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-8 right-8 z-50 bg-gray-900 text-white px-6 py-3 rounded-xl shadow-2xl font-bold animate-in slide-in-from-bottom-5">
          {toastMessage}
        </div>
      )}

      <div className="flex justify-between items-end mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Panel Logístico</h1>
          <p className="text-gray-500">Gestión de despachos y mantenciones.</p>
        </div>
        <select 
          className="bg-white border border-gray-200 rounded-xl px-4 py-2 font-medium text-gray-700 outline-none focus:border-primary"
          value={hub}
          onChange={(e) => setHub(e.target.value)}
        >
          <option>Parque El Prado</option>
          <option>Los Mellizos</option>
        </select>
      </div>

      <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
        <h2 className="text-xl font-bold text-gray-900 mb-6">Órdenes Asignadas</h2>
        
        <div className="space-y-4">
          {orders.map(order => (
            <div key={order.id} className={`border rounded-2xl p-4 flex flex-col md:flex-row gap-4 justify-between items-start md:items-center transition-all ${order.status === 'COMPLETADO' ? 'border-green-100 bg-green-50/30 opacity-70' : 'border-gray-100 hover:shadow-md'}`}>
              <div className="flex gap-4 items-center">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg ${
                  order.status === 'COMPLETADO' ? 'bg-green-100 text-green-600' :
                  order.id === 42 ? 'bg-orange-100 text-orange-600' : 'bg-blue-100 text-blue-600'
                }`}>
                  #{order.id}
                </div>
                <div>
                  <p className="font-bold text-gray-900">{order.type}</p>
                  <p className="text-sm text-gray-500">{hub}, {order.location}</p>
                  <p className={`text-xs font-bold mt-1 ${
                    order.status === 'COMPLETADO' ? 'text-green-600' :
                    order.status === 'EN RUTA' ? 'text-blue-600' : 'text-orange-600'
                  }`}>
                    ESTADO: {order.status}
                  </p>
                </div>
              </div>
              
              <div className="flex flex-col md:flex-row gap-2 w-full md:w-auto">
                {order.status !== 'COMPLETADO' && (
                  <>
                    <button onClick={() => handleNavigate(order.location)} className="w-full md:w-auto bg-blue-50 text-blue-600 font-medium px-4 py-2 rounded-xl text-sm hover:bg-blue-100 transition-colors">
                      📍 Navegar
                    </button>
                    
                    {order.status === 'PREPARANDO' && (
                      <button onClick={() => updateOrderStatus(order.id, 'EN RUTA')} className="w-full md:w-auto bg-primary text-white font-medium px-4 py-2 rounded-xl text-sm hover:bg-primary-dark transition-colors">
                        Marcar En Ruta
                      </button>
                    )}

                    {order.status === 'EN RUTA' && (
                      <>
                        {!order.evidenceUploaded ? (
                          <button onClick={() => simulateEvidenceUpload(order.id)} className="w-full md:w-auto bg-gray-900 text-white font-medium px-4 py-2 rounded-xl text-sm hover:bg-gray-800 transition-colors flex items-center justify-center gap-2">
                            <span>📸</span> Capturar Evidencia
                          </button>
                        ) : (
                          <button onClick={() => completeOrder(order.id)} className="w-full md:w-auto bg-green-500 text-white font-bold px-4 py-2 rounded-xl text-sm hover:bg-green-600 transition-colors">
                            Completar Orden
                          </button>
                        )}
                      </>
                    )}
                  </>
                )}
                {order.status === 'COMPLETADO' && (
                  <span className="px-4 py-2 text-green-600 font-bold text-sm bg-green-100 rounded-xl">✓ Realizado</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
