'use client';

import { useState, useEffect } from 'react';
import { useAgentAuth } from '@/context/AgentAuthContext';
import { createClient } from '@/utils/supabase/client';

export default function CatalogoB2BManagement() {
  const { agent } = useAgentAuth();
  
  // Estados para B2B Productos
  const [catalogo, setCatalogo] = useState<any[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<string | null>(null);
  
  // Estados de Edición de Producto B2B
  const [editNombre, setEditNombre] = useState('');
  const [editCategoria, setEditCategoria] = useState('');
  const [editSubcategoria, setEditSubcategoria] = useState('');
  const [editPrecioMayorista, setEditPrecioMayorista] = useState(0);
  const [editPrecioRetail, setEditPrecioRetail] = useState(0);
  const [editUnidadVenta, setEditUnidadVenta] = useState('');
  const [editImagen, setEditImagen] = useState('');
  const [editStock, setEditStock] = useState(0);
  const [editBadge, setEditBadge] = useState('');
  
  // Estados para Categorías
  const [categorias, setCategorias] = useState<any[]>([]);
  const [newCatName, setNewCatName] = useState('');
  const [activeTab, setActiveTab] = useState<'productos'|'categorias'>('productos');
  
  const [isUploading, setIsUploading] = useState(false);
  const supabase = createClient();
  
  const [saveStatus, setSaveStatus] = useState<'idle'|'saving'|'success'|'error'>('idle');
  const [toastMessage, setToastMessage] = useState('');

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3000);
  };

  const isAdmin = agent?.role === 'ADMIN';
  const canEdit = isAdmin || true; // Asumimos que los agentes pueden editar el catálogo B2B
  const canDelete = isAdmin; 
  const canEditPrice = isAdmin || true;

  // Cargar datos
  const loadData = () => {
    fetch('/api/catalogo-b2b')
      .then(res => res.json())
      .then(data => setCatalogo(data))
      .catch(err => console.error(err));
      
    fetch('/api/categorias-b2b')
      .then(res => res.json())
      .then(data => setCategorias(data))
      .catch(err => console.error(err));
  };

  useEffect(() => {
    loadData();
  }, []);

  // Sincronizar editor cuando cambia producto
  useEffect(() => {
    if (selectedProduct) {
      const p = catalogo.find(p => p.id === selectedProduct);
      if (p) {
        setEditNombre(p.nombre || '');
        setEditCategoria(p.categoria || '');
        setEditSubcategoria(p.subcategoria || '');
        setEditPrecioMayorista(p.precio_mayorista || 0);
        setEditPrecioRetail(p.precio_sugerido_retail || 0);
        setEditUnidadVenta(p.unidad_venta || '');
        setEditImagen(p.imagen || '');
        setEditStock(p.stock || 0);
        setEditBadge(p.badge || '');
        setSaveStatus('idle');
      } else if (selectedProduct === 'new') {
        setEditNombre('');
        setEditCategoria(categorias[0]?.nombre || '');
        setEditSubcategoria('');
        setEditPrecioMayorista(0);
        setEditPrecioRetail(0);
        setEditUnidadVenta('Unidad');
        setEditImagen('');
        setEditStock(0);
        setEditBadge('');
        setSaveStatus('idle');
      }
    }
  }, [selectedProduct, catalogo, categorias]);

  const handleSaveProduct = async () => {
    if (!selectedProduct || !canEdit) return;
    setSaveStatus('saving');
    
    const isNew = selectedProduct === 'new';
    const method = isNew ? 'PUT' : 'POST';
    
    try {
      const res = await fetch('/api/catalogo-b2b', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: isNew ? undefined : selectedProduct,
          nombre: editNombre,
          categoria: editCategoria,
          subcategoria: editSubcategoria,
          precio_mayorista: editPrecioMayorista,
          precio_sugerido_retail: editPrecioRetail || null,
          unidad_venta: editUnidadVenta,
          imagen: editImagen,
          stock: editStock,
          badge: editBadge || null
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

  const handleDeleteProduct = async () => {
    if (!selectedProduct || selectedProduct === 'new' || !canDelete) return;
    if (!confirm('¿Estás seguro de que deseas eliminar este producto B2B?')) return;
    
    setSaveStatus('saving');
    try {
      const res = await fetch(`/api/catalogo-b2b?id=${selectedProduct}`, { method: 'DELETE' });
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

  const handleAddCategory = async () => {
    if (!newCatName.trim()) return;
    try {
      const res = await fetch('/api/categorias-b2b', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nombre: newCatName.trim() })
      });
      if (res.ok) {
        const result = await res.json();
        setCategorias([...categorias, result.categoria]);
        setNewCatName('');
        showToast('Categoría creada correctamente.');
      }
    } catch (e) {
      showToast('Error al crear categoría.');
    }
  };

  const handleDeleteCategory = async (id: string) => {
    if (!confirm('¿Borrar esta categoría?')) return;
    try {
      const res = await fetch(`/api/categorias-b2b?id=${id}`, { method: 'DELETE' });
      if (res.ok) {
        setCategorias(categorias.filter(c => c.id !== id));
        showToast('Categoría eliminada.');
      }
    } catch (e) {
      showToast('Error al eliminar.');
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    setIsUploading(true);
    const fileExt = file.name.split('.').pop();
    const fileName = `b2b-${Math.random()}.${fileExt}`;
    const filePath = `catalogo/${fileName}`;

    try {
      const { error: uploadError } = await supabase.storage.from('productos').upload(filePath, file);
      if (uploadError) throw uploadError;
      
      const { data } = supabase.storage.from('productos').getPublicUrl(filePath);
      setEditImagen(data.publicUrl);
    } catch (error) {
      showToast('Error al subir la imagen. Verifica que el Bucket "productos" existe.');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="animate-in fade-in duration-500 relative">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-8 right-8 z-50 bg-[#1C1C1E] border border-gray-800 text-white px-6 py-3 rounded-xl shadow-2xl font-bold animate-in slide-in-from-bottom-5">
          {toastMessage}
        </div>
      )}
      
      <header className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Catálogo Mayorista (B2B)</h1>
          <p className="text-gray-400">Administra los productos, precios e inventario para la red de floristas.</p>
        </div>
        <div className="flex gap-4 items-center bg-[#1C1C1E] p-2 rounded-xl border border-gray-800">
          <button 
            onClick={() => setActiveTab('productos')}
            className={`px-4 py-2 rounded-lg text-sm font-bold transition-colors ${activeTab === 'productos' ? 'bg-yellow-500 text-black' : 'text-gray-400 hover:text-white'}`}
          >
            Productos B2B
          </button>
          <button 
            onClick={() => setActiveTab('categorias')}
            className={`px-4 py-2 rounded-lg text-sm font-bold transition-colors ${activeTab === 'categorias' ? 'bg-yellow-500 text-black' : 'text-gray-400 hover:text-white'}`}
          >
            Gestor de Categorías
          </button>
        </div>
      </header>

      {activeTab === 'categorias' ? (
        <div className="bg-[#1C1C1E] border border-gray-800 rounded-3xl p-6 max-w-2xl">
          <h2 className="font-bold text-white mb-6">Administrar Categorías Mayoristas</h2>
          
          <div className="flex gap-4 mb-8">
            <input 
              type="text" 
              value={newCatName}
              onChange={e => setNewCatName(e.target.value)}
              placeholder="Nueva Categoría (Ej: Follajes)"
              className="flex-1 bg-[#111111] border border-gray-800 rounded-xl px-4 py-3 text-white focus:border-yellow-500 outline-none"
            />
            <button 
              onClick={handleAddCategory}
              disabled={!newCatName.trim()}
              className="bg-yellow-500 text-black font-bold px-6 py-3 rounded-xl hover:bg-yellow-400 disabled:opacity-50"
            >
              Agregar
            </button>
          </div>

          <div className="space-y-3">
            {categorias.length === 0 ? (
              <p className="text-gray-500">No hay categorías. Crea una.</p>
            ) : categorias.map(c => (
              <div key={c.id} className="flex justify-between items-center bg-[#111111] border border-gray-800 rounded-xl p-4">
                <span className="font-bold text-white">{c.nombre}</span>
                <button 
                  onClick={() => handleDeleteCategory(c.id)}
                  className="text-red-500 hover:text-red-400 text-sm font-bold"
                >
                  Eliminar
                </button>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Lista de Productos B2B */}
          <div className="lg:col-span-2 bg-[#1C1C1E] border border-gray-800 rounded-3xl p-6 overflow-hidden flex flex-col h-[70vh]">
            <div className="flex justify-between items-center mb-4">
              <h2 className="font-bold text-white">Catálogo B2B Activo</h2>
              {canEdit && (
                <button 
                  onClick={() => setSelectedProduct('new')}
                  className="bg-yellow-500 text-black text-sm font-bold px-4 py-2 rounded-xl hover:bg-yellow-400 transition-colors"
                >
                  + Nuevo Producto
                </button>
              )}
            </div>
            
            <div className="overflow-y-auto pr-2 space-y-3 flex-1">
              {catalogo.length === 0 ? (
                <div className="text-gray-500 text-sm text-center py-10">Cargando catálogo B2B...</div>
              ) : catalogo.map((p) => (
                <div 
                  key={p.id} 
                  onClick={() => setSelectedProduct(p.id)}
                  className={`p-4 rounded-xl border flex items-center gap-4 cursor-pointer transition-colors ${selectedProduct === p.id ? 'bg-[#111111] border-yellow-500' : 'bg-[#111111] border-gray-800 hover:border-gray-600'}`}
                >
                  <img src={p.imagen} alt={p.nombre} className="w-16 h-16 rounded-lg object-cover bg-black" />
                  <div className="flex-1">
                    <h3 className="text-white font-bold text-sm">{p.nombre}</h3>
                    <p className="text-xs text-gray-500">{p.categoria}{p.subcategoria ? ` > ${p.subcategoria}` : ''} | 📦 {p.unidad_venta}</p>
                    {p.badge && <span className="inline-block mt-1 bg-yellow-500/20 text-yellow-500 text-[10px] px-2 py-0.5 rounded-full">{p.badge}</span>}
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] text-gray-500 uppercase tracking-widest">Mayorista</p>
                    <p className="text-yellow-500 font-bold text-lg">${p.precio_mayorista.toLocaleString('es-CL')}</p>
                    <p className="text-xs text-gray-500 mt-1">Stock: {p.stock}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Editor de Producto B2B */}
          <div className="bg-[#111111] border border-gray-800 rounded-3xl p-6 h-[70vh] overflow-y-auto">
            {selectedProduct ? (
              <div className="animate-in fade-in duration-300">
                <h2 className="font-bold text-white mb-6">Editor de Producto B2B</h2>
                
                <div className="space-y-5">
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Nombre del Producto</label>
                    <input 
                      type="text"
                      disabled={!canEdit} 
                      value={editNombre}
                      onChange={e => setEditNombre(e.target.value)}
                      className="w-full bg-[#1C1C1E] border border-gray-800 rounded-xl px-4 py-3 text-white focus:border-yellow-500 outline-none disabled:opacity-50"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Categoría B2B</label>
                      <select 
                        disabled={!canEdit} 
                        value={editCategoria}
                        onChange={e => setEditCategoria(e.target.value)}
                        className="w-full bg-[#1C1C1E] border border-gray-800 rounded-xl px-4 py-3 text-white focus:border-yellow-500 outline-none disabled:opacity-50"
                      >
                        <option value="">Seleccione...</option>
                        {categorias.map(c => (
                          <option key={c.id} value={c.nombre}>{c.nombre}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Subcategoría</label>
                      <input 
                        type="text"
                        disabled={!canEdit} 
                        value={editSubcategoria}
                        onChange={e => setEditSubcategoria(e.target.value)}
                        placeholder="Ej: Rosas Importadas"
                        className="w-full bg-[#1C1C1E] border border-gray-800 rounded-xl px-4 py-3 text-white focus:border-yellow-500 outline-none disabled:opacity-50"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Unidad de Venta</label>
                      <input 
                        type="text"
                        disabled={!canEdit} 
                        value={editUnidadVenta}
                        onChange={e => setEditUnidadVenta(e.target.value)}
                        placeholder="Ej: Caja de 48"
                        className="w-full bg-[#1C1C1E] border border-gray-800 rounded-xl px-4 py-3 text-white focus:border-yellow-500 outline-none disabled:opacity-50"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Precio Mayorista ($)</label>
                      <input 
                        type="number"
                        disabled={!canEditPrice} 
                        value={editPrecioMayorista}
                        onChange={e => setEditPrecioMayorista(Number(e.target.value))}
                        className="w-full bg-[#1C1C1E] border border-gray-800 rounded-xl px-4 py-3 text-white focus:border-yellow-500 outline-none disabled:opacity-50"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">PVP Sugerido ($)</label>
                      <input 
                        type="number"
                        disabled={!canEditPrice} 
                        value={editPrecioRetail}
                        onChange={e => setEditPrecioRetail(Number(e.target.value))}
                        className="w-full bg-[#1C1C1E] border border-gray-800 rounded-xl px-4 py-3 text-white focus:border-yellow-500 outline-none disabled:opacity-50"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Stock (Inventario)</label>
                      <input 
                        type="number"
                        disabled={!canEdit} 
                        value={editStock}
                        onChange={e => setEditStock(Number(e.target.value))}
                        className="w-full bg-[#1C1C1E] border border-gray-800 rounded-xl px-4 py-3 text-white focus:border-yellow-500 outline-none disabled:opacity-50"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Badge Promocional</label>
                      <input 
                        type="text"
                        disabled={!canEdit} 
                        value={editBadge}
                        onChange={e => setEditBadge(e.target.value)}
                        placeholder="Ej: 🔥 Más Vendido"
                        className="w-full bg-[#1C1C1E] border border-gray-800 rounded-xl px-4 py-3 text-white focus:border-yellow-500 outline-none disabled:opacity-50"
                      />
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
                        className="w-full bg-[#1C1C1E] border border-gray-800 rounded-xl px-4 py-3 text-white focus:border-yellow-500 outline-none disabled:opacity-50"
                      />
                      <label className="bg-[#1C1C1E] border border-gray-800 rounded-xl px-4 py-3 text-gray-400 hover:text-white cursor-pointer transition-colors flex items-center justify-center shrink-0">
                        {isUploading ? '...' : '📁'}
                        <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} disabled={!canEdit || isUploading} />
                      </label>
                    </div>
                  </div>

                  <button 
                    onClick={handleSaveProduct}
                    disabled={saveStatus === 'saving'}
                    className={`w-full font-bold py-4 rounded-xl transition-colors mt-6 disabled:opacity-50 ${
                      saveStatus === 'success' ? 'bg-green-500 text-white' : 
                      saveStatus === 'error' ? 'bg-red-500 text-white' : 
                      'bg-yellow-500 text-black hover:bg-yellow-400'
                    }`}
                  >
                    {saveStatus === 'saving' ? 'Guardando...' : 
                     saveStatus === 'success' ? '¡Cambios Guardados! ✅' :
                     saveStatus === 'error' ? 'Error al guardar ❌' :
                     'Guardar Producto B2B'}
                  </button>

                  {selectedProduct !== 'new' && canDelete && (
                    <button 
                      onClick={handleDeleteProduct}
                      disabled={saveStatus === 'saving'}
                      className="w-full text-red-500 hover:text-red-400 font-bold py-2 text-sm transition-colors mt-2"
                    >
                      Eliminar Producto
                    </button>
                  )}
                </div>
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center text-gray-500">
                <span className="text-4xl mb-4">📦</span>
                <p>Selecciona un producto mayorista para editar.</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
