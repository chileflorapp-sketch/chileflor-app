'use client';

import { useState, useEffect } from 'react';
import { useAgentAuth } from '@/context/AgentAuthContext';
import { createClient } from '@/utils/supabase/client';

export default function CatalogoManagement() {
  const { agent } = useAgentAuth();
  const [catalogo, setCatalogo] = useState<any[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<string | null>(null);
  
  // Estados de edición local antes de guardar
  const [editEstado, setEditEstado] = useState<string>('');
  const [editBadge, setEditBadge] = useState<string>('');
  const [editNombre, setEditNombre] = useState<string>('');
  const [editPrecio, setEditPrecio] = useState<number>(0);
  const [editImagen, setEditImagen] = useState<string>('');
  const [editDescripcion, setEditDescripcion] = useState<string>('');
  const [editCategoria, setEditCategoria] = useState<string>('');
  const [editSubcategoria, setEditSubcategoria] = useState<string>('');
  const [editCrossSell, setEditCrossSell] = useState<string>('');
  const [isUploading, setIsUploading] = useState(false);
  const supabase = createClient();
  
  const [saveStatus, setSaveStatus] = useState<'idle'|'saving'|'success'|'error'>('idle');
  const [toastMessage, setToastMessage] = useState('');

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3000);
  };

  // Evaluar permisos granulares
  const isAdmin = agent?.role === 'ADMIN';
  const canEdit = isAdmin || true; // Asumimos que todos pueden entrar a editar cosas básicas
  const canDelete = isAdmin || agent?.permissions?.eliminar_productos;
  const canEditPrice = isAdmin || agent?.permissions?.editar_precios;

  useEffect(() => {
    fetch('/api/catalogo')
      .then(res => res.json())
      .then(data => setCatalogo(data))
      .catch(err => console.error(err));
  }, []);

  // Sincronizar editor cuando cambia el producto seleccionado
  useEffect(() => {
    if (selectedProduct) {
      const p = catalogo.find(p => p.id === selectedProduct);
      if (p) {
        setEditEstado(p.estado);
        setEditBadge(p.badge || '');
        setEditNombre(p.nombre || '');
        setEditPrecio(p.precio_base || 0);
        setEditImagen(p.imagen || '');
        setEditDescripcion(p.descripcion || '');
        setEditCategoria(p.categoria || '');
        setEditSubcategoria(p.subcategoria || '');
        setEditCrossSell(p.cross_sell ? p.cross_sell.join(', ') : '');
        setSaveStatus('idle');
      } else if (selectedProduct === 'new') {
        setEditEstado('activo');
        setEditBadge('');
        setEditNombre('');
        setEditPrecio(0);
        setEditImagen('');
        setEditDescripcion('');
        setEditCategoria('Flores');
        setEditSubcategoria('');
        setEditCrossSell('');
        setSaveStatus('idle');
      }
    }
  }, [selectedProduct, catalogo]);

  const handleSave = async () => {
    if (!selectedProduct || !canEdit) return;
    setSaveStatus('saving');
    
    const isNew = selectedProduct === 'new';
    const method = isNew ? 'PUT' : 'POST';
    
    try {
      const res = await fetch('/api/catalogo', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: isNew ? undefined : selectedProduct,
          estado: editEstado,
          badge: editBadge === '' ? null : editBadge,
          nombre: editNombre,
          precio_base: editPrecio,
          imagen: editImagen,
          descripcion: editDescripcion,
          categoria: editCategoria,
          subcategoria: editSubcategoria,
          cross_sell: editCrossSell ? editCrossSell.split(',').map(s => s.trim()).filter(Boolean) : null
        })
      });
      
      if (res.ok) {
        const result = await res.json();
        if (isNew) {
          setCatalogo(prev => [...prev, result.product]);
          setSelectedProduct(result.product.id);
        } else {
          setCatalogo(prev => prev.map(p => p.id === selectedProduct ? result.product : p));
        }
        setSaveStatus('success');
        setTimeout(() => setSaveStatus('idle'), 3000);
      } else {
        setSaveStatus('error');
      }
    } catch (e) {
      setSaveStatus('error');
    }
  };

  const handleDelete = async () => {
    if (!selectedProduct || selectedProduct === 'new' || !canEdit) return;
    if (!confirm('¿Estás seguro de que deseas eliminar este producto permanentemente?')) return;
    
    setSaveStatus('saving');
    try {
      const res = await fetch(`/api/catalogo?id=${selectedProduct}`, { method: 'DELETE' });
      if (res.ok) {
        setCatalogo(prev => prev.filter(p => p.id !== selectedProduct));
        setSelectedProduct(null);
        setSaveStatus('idle');
      } else {
        setSaveStatus('error');
      }
    } catch (e) {
      setSaveStatus('error');
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    setIsUploading(true);
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random()}.${fileExt}`;
    const filePath = `catalogo/${fileName}`;

    try {
      const { error: uploadError } = await supabase.storage.from('productos').upload(filePath, file);
      if (uploadError) throw uploadError;
      
      const { data } = supabase.storage.from('productos').getPublicUrl(filePath);
      setEditImagen(data.publicUrl);
    } catch (error) {
      showToast('Error al subir la imagen. Verifica que el Bucket "productos" existe y es público.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleAIAssist = () => {
    if (!editNombre) {
      showToast('Por favor, ingresa el nombre del producto primero.');
      return;
    }
    setEditDescripcion(`Este hermoso arreglo floral de ${editNombre} ha sido preparado cuidadosamente por nuestros artesanos. Seleccionamos las mejores flores frescas para garantizar una experiencia visual y aromática inolvidable, ideal para sorprender en momentos especiales.`);
  };

  return (
    <div className="animate-in fade-in duration-500 relative">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-8 right-8 z-50 bg-[#1C1C1E] border border-gray-800 text-white px-6 py-3 rounded-xl shadow-2xl font-bold animate-in slide-in-from-bottom-5">
          {toastMessage}
        </div>
      )}
      <header className="mb-8 flex flex-col md:flex-row justify-between md:items-end gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Inventario y Catálogo</h1>
          <p className="text-gray-400">Control maestro de precios y Reglas de Oro.</p>
        </div>
        <div className="flex gap-3 items-center">
          {canEdit && (
            <>
              <button 
                onClick={() => alert('Gestor de Categorías en construcción')}
                className="bg-gradient-to-r from-fuchsia-600 to-pink-500 text-white text-sm font-bold px-5 py-2.5 rounded-xl shadow-[0_4px_15px_rgba(236,72,153,0.3)] hover:scale-105 hover:shadow-[0_6px_20px_rgba(236,72,153,0.5)] transition-all active:scale-95 flex items-center gap-2"
              >
                <span>📂</span> Gestor Categorías
              </button>
              <button 
                onClick={() => setSelectedProduct('new')}
                className="bg-gradient-to-r from-cyan-500 to-blue-500 text-white text-sm font-bold px-5 py-2.5 rounded-xl shadow-[0_4px_15px_rgba(6,182,212,0.3)] hover:scale-105 hover:shadow-[0_6px_20px_rgba(6,182,212,0.5)] transition-all active:scale-95 flex items-center gap-2"
              >
                <span className="font-black text-lg leading-none">+</span> Nuevo Producto
              </button>
            </>
          )}
          {!canEdit && (
            <div className="bg-yellow-500/10 border border-yellow-500/20 text-yellow-500 text-xs px-4 py-2 rounded-xl font-bold uppercase flex items-center gap-2">
              <span>🔒</span> Modo Solo Lectura
            </div>
          )}
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Lista de Productos */}
        <div className="lg:col-span-2 bg-[#1C1C1E] border border-gray-800 rounded-3xl p-6 overflow-hidden flex flex-col h-[70vh]">
          <h2 className="font-bold text-white mb-4">Catálogo Activo</h2>
          <div className="overflow-y-auto pr-2 space-y-3 flex-1">
            {catalogo.length === 0 ? (
              <div className="text-gray-500 text-sm text-center py-10">Cargando catálogo base de datos...</div>
            ) : catalogo.map((p) => (
              <div 
                key={p.id} 
                onClick={() => setSelectedProduct(p.id)}
                className={`p-4 rounded-xl border flex items-center gap-4 cursor-pointer transition-colors ${selectedProduct === p.id ? 'bg-[#111111] border-primary' : 'bg-[#111111] border-gray-800 hover:border-gray-600'}`}
              >
                <img src={p.imagen} alt={p.nombre} className="w-12 h-12 rounded-lg object-cover" />
                <div className="flex-1">
                  <h3 className="text-white font-bold text-sm">{p.nombre}</h3>
                  <p className="text-xs text-gray-500">{p.categoria} &gt; {p.subcategoria}</p>
                </div>
                <div className="text-right">
                  <p className="text-primary font-bold text-sm">${p.precio_base.toLocaleString('es-CL')}</p>
                  <span className={`text-[10px] px-2 py-0.5 rounded uppercase font-bold tracking-wider ${p.estado === 'activo' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                    {p.estado}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Editor de Producto */}
        <div className="bg-[#111111] border border-gray-800 rounded-3xl p-6 h-[70vh] overflow-y-auto">
          {selectedProduct ? (
            <div className="animate-in fade-in duration-300">
              <h2 className="font-bold text-white mb-6">Editor de Producto</h2>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Nombre del Producto</label>
                  <input 
                    type="text"
                    disabled={!canEdit} 
                    value={editNombre}
                    onChange={e => setEditNombre(e.target.value)}
                    className="w-full bg-[#1C1C1E] border border-gray-800 rounded-xl px-4 py-3 text-white focus:border-primary outline-none disabled:opacity-50"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Categoría Madre</label>
                    <select 
                      disabled={!canEdit} 
                      value={editCategoria}
                      onChange={e => setEditCategoria(e.target.value)}
                      className="w-full bg-[#1C1C1E] border border-gray-800 rounded-xl px-4 py-3 text-white focus:border-primary outline-none disabled:opacity-50"
                    >
                      <option value="Flores">Flores</option>
                      <option value="Plantas">Plantas</option>
                      <option value="Regalos">Regalos</option>
                      <option value="Homenajes">Homenajes</option>
                      <option value="Estacionales">Estacionales</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Subcategoría</label>
                    <input 
                      type="text"
                      disabled={!canEdit} 
                      value={editSubcategoria}
                      onChange={e => setEditSubcategoria(e.target.value)}
                      placeholder="Ej: Ramos de Novia"
                      className="w-full bg-[#1C1C1E] border border-gray-800 rounded-xl px-4 py-3 text-white focus:border-primary outline-none disabled:opacity-50"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Precio Base ($)</label>
                    <div className="relative">
                      <input 
                        type="number"
                        disabled={!canEditPrice} 
                        value={editPrecio}
                        onChange={e => setEditPrecio(Number(e.target.value))}
                        className="w-full bg-[#1C1C1E] border border-gray-800 rounded-xl px-4 py-3 text-white focus:border-primary outline-none disabled:opacity-50 disabled:cursor-not-allowed"
                      />
                      {!canEditPrice && (
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-red-500" title="Permiso denegado por el Administrador">🔒</span>
                      )}
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">URL Imagen o Subir Foto</label>
                    <div className="flex gap-2">
                      <input 
                        type="text"
                        disabled={!canEdit} 
                        value={editImagen}
                        onChange={e => setEditImagen(e.target.value)}
                        placeholder="https://..."
                        className="w-full bg-[#1C1C1E] border border-gray-800 rounded-xl px-4 py-3 text-white focus:border-primary outline-none disabled:opacity-50"
                      />
                      <label className="bg-[#1C1C1E] border border-gray-800 rounded-xl px-4 py-3 text-gray-400 hover:text-white cursor-pointer transition-colors flex items-center justify-center shrink-0">
                        {isUploading ? '...' : '📁'}
                        <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} disabled={!canEdit || isUploading} />
                      </label>
                    </div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-end mb-2">
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest">Descripción</label>
                    <button onClick={handleAIAssist} disabled={!canEdit} className="text-[10px] bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 px-2 py-1 rounded font-bold flex items-center gap-1 hover:bg-indigo-500 hover:text-white transition-colors">
                      Ayuda de IA ✨
                    </button>
                  </div>
                  <textarea 
                    disabled={!canEdit} 
                    value={editDescripcion}
                    onChange={e => setEditDescripcion(e.target.value)}
                    rows={3}
                    className="w-full bg-[#1C1C1E] border border-gray-800 rounded-xl px-4 py-3 text-white focus:border-primary outline-none disabled:opacity-50 resize-none"
                  />
                </div>

                <div className="pt-6 border-t border-gray-800">
                  <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Reglas Comerciales</h3>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Etiquetas / Complementos (Cross-Sell)</label>
                  <input 
                    type="text"
                    disabled={!canEdit} 
                    value={editCrossSell}
                    onChange={e => setEditCrossSell(e.target.value)}
                    placeholder="IDs separados por coma (ej: p-005, p-002)"
                    className="w-full bg-[#1C1C1E] border border-gray-800 rounded-xl px-4 py-3 text-white focus:border-primary outline-none disabled:opacity-50"
                  />
                  <p className="text-[10px] text-gray-500 mt-1">Escribe los IDs de los productos relacionados que quieres sugerir.</p>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Estado (Regla de Mantenimiento)</label>
                  <select 
                    disabled={!canEdit} 
                    value={editEstado}
                    onChange={e => setEditEstado(e.target.value)}
                    className="w-full bg-[#1C1C1E] border border-gray-800 rounded-xl px-4 py-3 text-white focus:border-primary outline-none disabled:opacity-50"
                  >
                    <option value="activo">Activo (Visible)</option>
                    <option value="fuera_de_temporada">Fuera de Temporada (Oculto SEO)</option>
                    <option value="proximamente">Próximamente</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Héroe de Categoría (Badge)</label>
                  <select 
                    disabled={!canEdit} 
                    value={editBadge}
                    onChange={e => setEditBadge(e.target.value)}
                    className="w-full bg-[#1C1C1E] border border-gray-800 rounded-xl px-4 py-3 text-white focus:border-primary outline-none disabled:opacity-50"
                  >
                    <option value="">Ninguno</option>
                    <option value="⚡ Entrega Hoy">⚡ Entrega Hoy</option>
                    <option value="💎 Premium">💎 Premium</option>
                    <option value="🍃 Eco-Friendly">🍃 Eco-Friendly</option>
                  </select>
                </div>

                <div className="pt-6 border-t border-gray-800">
                  <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Regla de Oro Visual Actual</h3>
                  <div className="bg-[#1C1C1E] p-4 rounded-xl border border-gray-800 space-y-2 text-sm text-gray-300">
                    <p><span className="text-gray-500">Fondo:</span> {catalogo.find(p => p.id === selectedProduct)?.tags_visuales.fondo}</p>
                    <p><span className="text-gray-500">Ángulo:</span> {catalogo.find(p => p.id === selectedProduct)?.tags_visuales.angulo}</p>
                    <p><span className="text-gray-500">Luz:</span> {catalogo.find(p => p.id === selectedProduct)?.tags_visuales.luz}</p>
                  </div>
                </div>

                <button 
                  onClick={handleSave}
                  disabled={saveStatus === 'saving'}
                  className={`w-full font-bold py-4 rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
                    saveStatus === 'success' ? 'bg-green-500 text-white' : 
                    saveStatus === 'error' ? 'bg-red-500 text-white' : 
                    'bg-white text-black hover:bg-gray-200'
                  }`}
                >
                  {saveStatus === 'saving' ? 'Guardando...' : 
                   saveStatus === 'success' ? '¡Cambios Guardados! ✅' :
                   saveStatus === 'error' ? 'Error al guardar ❌' :
                   'Guardar Cambios'}
                </button>

                {selectedProduct !== 'new' && canDelete && (
                  <button 
                    onClick={handleDelete}
                    disabled={saveStatus === 'saving'}
                    className="w-full text-red-500 hover:text-red-400 font-bold py-2 text-sm transition-colors mt-2"
                  >
                    Eliminar Producto
                  </button>
                )}
                {selectedProduct !== 'new' && !canDelete && (
                  <p className="text-xs text-center text-red-500 mt-4">
                    🔒 No tienes permisos para eliminar productos.
                  </p>
                )}
              </div>
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-center text-gray-500">
              <span className="text-4xl mb-4">📦</span>
              <p>Selecciona un producto para ver sus reglas.</p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
