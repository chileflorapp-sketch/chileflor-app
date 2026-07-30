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
  
  // Estados para Configuración B2B (Gestor en Modal)
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  
  const [categorias, setCategorias] = useState<any[]>([]);
  const [newCatName, setNewCatName] = useState('');
  
  const [subcategorias, setSubcategorias] = useState<any[]>([]);
  const [newSubcatName, setNewSubcatName] = useState('');
  const [selectedCatForSubcat, setSelectedCatForSubcat] = useState('');
  
  const [etiquetas, setEtiquetas] = useState<any[]>([]);
  const [newTagName, setNewTagName] = useState('');
  const [selectedCatForTag, setSelectedCatForTag] = useState('');

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
    fetch('/api/catalogo-b2b').then(res => res.json()).then(data => setCatalogo(data)).catch(console.error);
    fetch('/api/categorias-b2b').then(res => res.json()).then(data => setCategorias(data)).catch(console.error);
    fetch('/api/subcategorias-b2b').then(res => res.json()).then(data => setSubcategorias(data)).catch(console.error);
    fetch('/api/etiquetas-b2b').then(res => res.json()).then(data => setEtiquetas(data)).catch(console.error);
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
        const err = await res.json();
        showToast(`Error: ${err.error || 'al guardar'}`);
        setSaveStatus('error');
        setTimeout(() => setSaveStatus('idle'), 4000);
      }
    } catch (e: any) {
      showToast(`Excepción: ${e.message}`);
      setSaveStatus('error');
      setTimeout(() => setSaveStatus('idle'), 4000);
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
      } else {
        const err = await res.json();
        showToast(`Error: ${err.error || 'al crear categoría'}`);
      }
    } catch (e: any) {
      showToast(`Error de conexión: ${e.message}`);
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

  const handleAddSubcategory = async () => {
    if (!newSubcatName.trim() || !selectedCatForSubcat) {
      showToast('Debe ingresar un nombre y seleccionar una categoría madre.');
      return;
    }
    try {
      const res = await fetch('/api/subcategorias-b2b', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nombre: newSubcatName.trim(), categoria: selectedCatForSubcat })
      });
      if (res.ok) {
        const result = await res.json();
        setSubcategorias([...subcategorias, result.subcategoria]);
        setNewSubcatName('');
        showToast('Subcategoría creada.');
      } else {
        const err = await res.json();
        showToast(err.error || 'Error al crear subcategoría.');
      }
    } catch (e: any) {
      showToast('Error al crear subcategoría.');
    }
  };

  const handleDeleteSubcategory = async (id: string) => {
    if (!confirm('¿Borrar esta subcategoría?')) return;
    try {
      const res = await fetch(`/api/subcategorias-b2b?id=${id}`, { method: 'DELETE' });
      if (res.ok) {
        setSubcategorias(subcategorias.filter(c => c.id !== id));
        showToast('Subcategoría eliminada.');
      }
    } catch (e) {
      showToast('Error al eliminar.');
    }
  };

  const handleAddTag = async () => {
    if (!newTagName.trim() || !selectedCatForTag) {
      showToast('Debe ingresar un nombre y seleccionar una categoría madre.');
      return;
    }
    try {
      const res = await fetch('/api/etiquetas-b2b', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nombre: newTagName.trim(), categoria: selectedCatForTag })
      });
      if (res.ok) {
        const result = await res.json();
        setEtiquetas([...etiquetas, result.etiqueta]);
        setNewTagName('');
        showToast('Etiqueta creada.');
      } else {
        const err = await res.json();
        showToast(err.error || 'Error al crear etiqueta.');
      }
    } catch (e) {
      showToast('Error al crear etiqueta.');
    }
  };

  const handleDeleteTag = async (id: string) => {
    if (!confirm('¿Borrar esta etiqueta?')) return;
    try {
      const res = await fetch(`/api/etiquetas-b2b?id=${id}`, { method: 'DELETE' });
      if (res.ok) {
        setEtiquetas(etiquetas.filter(c => c.id !== id));
        showToast('Etiqueta eliminada.');
      }
    } catch (e) {
      showToast('Error al eliminar.');
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    setIsUploading(true);

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('bucket', 'productos');
      formData.append('folder', 'catalogo');

      const res = await fetch('/api/upload', { method: 'POST', body: formData });
      const result = await res.json();
      if (!res.ok) throw new Error(result.error || `Error ${res.status}`);

      setEditImagen(result.url);
    } catch (error: any) {
      showToast(`Error al subir la imagen: ${error.message}`);
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
      
      <header className="mb-8 flex flex-col md:flex-row justify-between md:items-end gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Catálogo Mayorista (B2B)</h1>
          <p className="text-gray-400">Administra los productos, precios e inventario para la red de floristas.</p>
        </div>
        <div className="flex gap-3 items-center">
          {canEdit && (
            <>
              <button 
                onClick={() => setShowCategoryModal(true)}
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
        
        {/* Lista de Productos B2B */}
        <div className="lg:col-span-2 bg-[#1C1C1E] border border-gray-800 rounded-3xl p-6 overflow-hidden flex flex-col h-[70vh]">
          <h2 className="font-bold text-white mb-4">Catálogo B2B Activo</h2>
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
                  <p className="text-xs text-gray-500">{p.categoria} &gt; {p.subcategoria} | 📦 {p.unidad_venta}</p>
                </div>
                <div className="text-right">
                  <p className="text-primary font-bold text-sm">${p.precio_mayorista.toLocaleString('es-CL')}</p>
                  <span className={`text-[10px] px-2 py-0.5 rounded uppercase font-bold tracking-wider ${p.stock > 0 ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                    STOCK: {p.stock}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Editor de Producto B2B */}
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
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Categoría B2B</label>
                    <select 
                      disabled={!canEdit} 
                      value={editCategoria}
                      onChange={e => setEditCategoria(e.target.value)}
                      className="w-full bg-[#1C1C1E] border border-gray-800 rounded-xl px-4 py-3 text-white focus:border-primary outline-none disabled:opacity-50"
                    >
                      <option value="">Seleccione...</option>
                      {categorias.map(c => (
                        <option key={c.id} value={c.nombre}>{c.nombre}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Subcategoría</label>
                    <select 
                      disabled={!canEdit || !editCategoria} 
                      value={editSubcategoria}
                      onChange={e => setEditSubcategoria(e.target.value)}
                      className="w-full bg-[#1C1C1E] border border-gray-800 rounded-xl px-4 py-3 text-white focus:border-primary outline-none disabled:opacity-50"
                    >
                      <option value="">Sin Subcategoría</option>
                      {subcategorias
                        .filter(c => !editCategoria || c.categoria === editCategoria)
                        .map(c => (
                        <option key={c.id} value={c.nombre}>{c.nombre}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Unidad de Venta</label>
                  <input 
                    type="text"
                    disabled={!canEdit} 
                    value={editUnidadVenta}
                    onChange={e => setEditUnidadVenta(e.target.value)}
                    placeholder="Ej: Caja de 48"
                    className="w-full bg-[#1C1C1E] border border-gray-800 rounded-xl px-4 py-3 text-white focus:border-primary outline-none disabled:opacity-50"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Precio Mayorista ($)</label>
                    <div className="relative">
                      <input 
                        type="number"
                        disabled={!canEditPrice} 
                        value={editPrecioMayorista}
                        onChange={e => setEditPrecioMayorista(Number(e.target.value))}
                        className="w-full bg-[#1C1C1E] border border-gray-800 rounded-xl px-4 py-3 text-white focus:border-primary outline-none disabled:opacity-50 disabled:cursor-not-allowed"
                      />
                      {!canEditPrice && (
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-red-500" title="Permiso denegado">🔒</span>
                      )}
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">PVP Sugerido ($)</label>
                    <div className="relative">
                      <input 
                        type="number"
                        disabled={!canEditPrice} 
                        value={editPrecioRetail}
                        onChange={e => setEditPrecioRetail(Number(e.target.value))}
                        className="w-full bg-[#1C1C1E] border border-gray-800 rounded-xl px-4 py-3 text-white focus:border-primary outline-none disabled:opacity-50 disabled:cursor-not-allowed"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Stock</label>
                    <input 
                      type="number"
                      disabled={!canEdit} 
                      value={editStock}
                      onChange={e => setEditStock(Number(e.target.value))}
                      className="w-full bg-[#1C1C1E] border border-gray-800 rounded-xl px-4 py-3 text-white focus:border-primary outline-none disabled:opacity-50"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Héroe de Categoría (Badge)</label>
                    <select 
                      disabled={!canEdit || !editCategoria} 
                      value={editBadge}
                      onChange={e => setEditBadge(e.target.value)}
                      className="w-full bg-[#1C1C1E] border border-gray-800 rounded-xl px-4 py-3 text-white focus:border-primary outline-none disabled:opacity-50"
                    >
                      <option value="">Ninguno</option>
                      {etiquetas
                        .filter(c => !editCategoria || c.categoria === editCategoria)
                        .map(c => (
                        <option key={c.id} value={c.nombre}>{c.nombre}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Imagen Principal (Opcional)</label>
                  <div className="flex gap-2">
                    {editImagen && (
                      <div className="relative w-16 h-16 shrink-0 rounded-xl overflow-hidden border border-gray-800">
                        <img src={editImagen} alt="Preview" className="w-full h-full object-cover" />
                      </div>
                    )}
                    <label className="flex-1 bg-[#1C1C1E] border border-gray-800 rounded-xl flex items-center justify-center text-gray-400 hover:text-white cursor-pointer transition-colors border-dashed hover:border-gray-500 p-4">
                      {isUploading ? <span className="text-xs">Subiendo...</span> : <span className="text-xs font-bold">Subir Nueva Foto</span>}
                      <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} disabled={!canEdit || isUploading} />
                    </label>
                  </div>
                </div>

                <button 
                  onClick={handleSaveProduct}
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
                    onClick={handleDeleteProduct}
                    disabled={saveStatus === 'saving'}
                    className="w-full text-red-500 hover:text-red-400 font-bold py-2 text-sm transition-colors mt-2"
                  >
                    Eliminar Producto B2B
                  </button>
                )}
                {selectedProduct !== 'new' && !canDelete && (
                  <p className="text-xs text-center text-red-500 mt-4">
                    🔒 No tienes permisos para eliminar.
                  </p>
                )}
              </div>
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-center text-gray-500">
              <span className="text-4xl mb-4">📦</span>
              <p>Selecciona un producto para ver sus reglas B2B.</p>
            </div>
          )}
        </div>

      </div>

      {/* Category Manager Modal */}
      {showCategoryModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-[#1C1C1E] border border-gray-800 rounded-3xl p-6 w-full max-w-4xl shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-white">Gestor de Categorías B2B</h2>
              <button onClick={() => setShowCategoryModal(false)} className="text-gray-500 hover:text-white transition-colors text-xl">✕</button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Columna Categorías */}
              <div>
                <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-3">Categorías Madres</h3>
                <div className="bg-[#111111] rounded-xl border border-gray-800 p-4 h-64 overflow-y-auto mb-3">
                  {categorias.map(c => (
                    <div key={c.id} className="flex items-center justify-between py-2 border-b border-gray-800 last:border-0">
                      <span className="text-white font-medium text-sm">{c.nombre}</span>
                      <button onClick={() => handleDeleteCategory(c.id)} className="text-red-500 hover:text-red-400 text-xs font-bold">Borrar</button>
                    </div>
                  ))}
                </div>
                <div className="flex gap-2">
                  <input 
                    type="text" 
                    value={newCatName}
                    onChange={e => setNewCatName(e.target.value)}
                    placeholder="Nueva Categoría..."
                    className="flex-1 bg-[#111111] border border-gray-800 rounded-xl px-3 py-2 text-white text-sm focus:border-primary outline-none min-w-0"
                  />
                  <button onClick={handleAddCategory} disabled={!newCatName.trim()} className="bg-primary hover:bg-primary-dark text-white px-3 py-2 rounded-xl text-sm font-bold transition-colors disabled:opacity-50">+</button>
                </div>
              </div>
              
              {/* Columna Subcategorías */}
              <div>
                <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-3">Subcategorías</h3>
                <select 
                  value={selectedCatForSubcat}
                  onChange={e => setSelectedCatForSubcat(e.target.value)}
                  className="w-full bg-[#111111] border border-gray-800 rounded-xl px-3 py-2 text-white text-sm focus:border-primary outline-none mb-3"
                >
                  <option value="">Selecciona Categoría Madre...</option>
                  {categorias.map(c => <option key={c.id} value={c.nombre}>{c.nombre}</option>)}
                </select>
                
                <div className="bg-[#111111] rounded-xl border border-gray-800 p-4 h-52 overflow-y-auto mb-3">
                  {selectedCatForSubcat ? (
                    subcategorias
                      .filter(s => s.categoria === selectedCatForSubcat)
                      .map(sub => (
                      <div key={sub.id} className="flex items-center justify-between py-2 border-b border-gray-800 last:border-0">
                        <span className="text-gray-300 text-sm">{sub.nombre}</span>
                        <button onClick={() => handleDeleteSubcategory(sub.id)} className="text-red-500 hover:text-red-400 text-xs font-bold">✕</button>
                      </div>
                    ))
                  ) : <p className="text-gray-600 text-xs text-center mt-10">Selecciona una categoría primero</p>}
                </div>
                
                <div className="flex gap-2">
                  <input 
                    type="text" 
                    value={newSubcatName}
                    onChange={e => setNewSubcatName(e.target.value)}
                    placeholder="Nueva Subcategoría..."
                    disabled={!selectedCatForSubcat}
                    className="flex-1 bg-[#111111] border border-gray-800 rounded-xl px-3 py-2 text-white text-sm focus:border-primary outline-none disabled:opacity-50 min-w-0"
                  />
                  <button onClick={handleAddSubcategory} disabled={!selectedCatForSubcat || !newSubcatName.trim()} className="bg-primary hover:bg-primary-dark text-white px-3 py-2 rounded-xl text-sm font-bold transition-colors disabled:opacity-50">+</button>
                </div>
              </div>

              {/* Columna Etiquetas */}
              <div>
                <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-3">Etiquetas (Badges)</h3>
                <select 
                  value={selectedCatForTag}
                  onChange={e => setSelectedCatForTag(e.target.value)}
                  className="w-full bg-[#111111] border border-gray-800 rounded-xl px-3 py-2 text-white text-sm focus:border-primary outline-none mb-3"
                >
                  <option value="">Selecciona Categoría Madre...</option>
                  {categorias.map(c => <option key={c.id} value={c.nombre}>{c.nombre}</option>)}
                </select>
                
                <div className="bg-[#111111] rounded-xl border border-gray-800 p-4 h-52 overflow-y-auto mb-3">
                  {selectedCatForTag ? (
                    etiquetas
                      .filter(t => t.categoria === selectedCatForTag)
                      .map(tag => (
                      <div key={tag.id} className="flex items-center justify-between py-2 border-b border-gray-800 last:border-0">
                        <span className="text-gray-300 text-sm">{tag.nombre}</span>
                        <button onClick={() => handleDeleteTag(tag.id)} className="text-red-500 hover:text-red-400 text-xs font-bold">✕</button>
                      </div>
                    ))
                  ) : <p className="text-gray-600 text-xs text-center mt-10">Selecciona una categoría primero</p>}
                </div>
                
                <div className="flex gap-2">
                  <input 
                    type="text" 
                    value={newTagName}
                    onChange={e => setNewTagName(e.target.value)}
                    placeholder="Nueva Etiqueta..."
                    disabled={!selectedCatForTag}
                    className="flex-1 bg-[#111111] border border-gray-800 rounded-xl px-3 py-2 text-white text-sm focus:border-primary outline-none disabled:opacity-50 min-w-0"
                  />
                  <button onClick={handleAddTag} disabled={!selectedCatForTag || !newTagName.trim()} className="bg-primary hover:bg-primary-dark text-white px-3 py-2 rounded-xl text-sm font-bold transition-colors disabled:opacity-50">+</button>
                </div>
              </div>

            </div>
          </div>
        </div>
      )}

    </div>
  );
}
