'use client';

import { useState, useEffect } from 'react';
import { useAgentAuth } from '@/context/AgentAuthContext';
import { supabase } from '@/lib/supabase';

export default function CatalogoManagement() {
  const { agent } = useAgentAuth();
  const [catalogo, setCatalogo] = useState<any[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<string | null>(null);
  const [searchTermProducts, setSearchTermProducts] = useState('');
  
  const [categories, setCategories] = useState<any[]>([]);
  const [configData, setConfigData] = useState<any>(null);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [showBulkPriceModal, setShowBulkPriceModal] = useState(false);
  const [bulkPriceStatus, setBulkPriceStatus] = useState<'idle'|'saving'|'success'|'error'>('idle');
  const [bulkRound, setBulkRound] = useState(true); // redondeo a X990 activado por defecto
  const [newCatName, setNewCatName] = useState('');
  const [newSubcatName, setNewSubcatName] = useState('');
  const [selectedCatForSub, setSelectedCatForSub] = useState('');
  
  // Estados de edición local antes de guardar
  const [editEstado, setEditEstado] = useState<string>('');
  const [editBadge, setEditBadge] = useState<string>('');
  const [editNombre, setEditNombre] = useState<string>('');
  const [editPrecio, setEditPrecio] = useState<number>(0);
  const [editImagen, setEditImagen] = useState<string>('');
  const [editGaleria, setEditGaleria] = useState<string[]>([]);
  const [editDescripcion, setEditDescripcion] = useState<string>('');
  const [editCategorias, setEditCategorias] = useState<string[]>([]);
  const [editSubcategorias, setEditSubcategorias] = useState<string[]>([]);
  const [editCrossSell, setEditCrossSell] = useState<string>('');
  const [editColores, setEditColores] = useState<string[]>([]);
  const [newColorInput, setNewColorInput] = useState<string>('');
  const [isUploading, setIsUploading] = useState(false);
  const [editMetaTitle, setEditMetaTitle] = useState('');
  const [editMetaDescription, setEditMetaDescription] = useState('');
  const [editMetaKeywords, setEditMetaKeywords] = useState('');
  const [editSlug, setEditSlug] = useState('');
  
  // Regla de Oro Visual local states
  const [editFondo, setEditFondo] = useState('neutro');
  const [editAngulo, setEditAngulo] = useState('frontal');
  const [editLuz, setEditLuz] = useState('estudio');
  
  const COLORS = ['Rojas', 'Blancas', 'Rosadas', 'Amarillas', 'Naranjas', 'Moradas'];
  
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
      
    fetch('/api/config')
      .then(res => res.json())
      .then(data => {
        setConfigData(data);
        if (data.categorias) setCategories(data.categorias);
      })
      .catch(err => console.error(err));
  }, []);

  const saveCategories = async (newCats: any[]) => {
    if (!configData) return;
    const newConfig = { ...configData, categorias: newCats };
    try {
      const res = await fetch('/api/config', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newConfig)
      });
      if (res.ok) {
        setCategories(newCats);
        setConfigData(newConfig);
        showToast('Categorías actualizadas correctamente.');
      }
    } catch (e) {
      showToast('Error al guardar categorías.');
    }
  };

  const handleAddCategory = () => {
    if (!newCatName) return;
    const newCats = [...categories, { id: newCatName.toLowerCase().replace(/\s+/g, '-'), name: newCatName, subcategorias: [] }];
    saveCategories(newCats);
    setNewCatName('');
  };

  const handleAddSubcategory = () => {
    if (!selectedCatForSub || !newSubcatName) return;
    const newCats = categories.map(c => {
      if (c.id === selectedCatForSub) {
        return { ...c, subcategorias: [...(c.subcategorias || []), newSubcatName] };
      }
      return c;
    });
    saveCategories(newCats);
    setNewSubcatName('');
  };

  // ── Helper: refrescar catálogo tras un ajuste masivo ────────────────────
  const refreshCatalogAfterBulk = async () => {
    const res = await fetch('/api/catalogo');
    const data = await res.json();
    setCatalogo(data);
    if (selectedProduct && selectedProduct !== 'new') {
      const p = data.find((x: any) => x.id === selectedProduct);
      if (p) setEditPrecio(p.precio_base);
    }
  };

  // ── Ajuste por porcentaje ────────────────────────────────────────────────
  const handleBulkPriceUpdate = async (percentage: number) => {
    if (!canEditPrice) { showToast('No tienes permisos para editar precios.'); return; }
    const dir = percentage > 0 ? `SUBIR un +${percentage}%` : `BAJAR un ${percentage}%`;
    const roundText = bulkRound ? ' (con redondeo a X.990)' : '';
    if (!confirm(`¿Confirmas ${dir} en TODOS los productos?${roundText}`)) return;
    setBulkPriceStatus('saving');
    try {
      const res = await fetch('/api/catalogo/bulk-price', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ percentage, round: bulkRound }),
      });
      if (res.ok) {
        showToast(`✅ Precios ${dir} actualizados${roundText}`);
        await refreshCatalogAfterBulk();
        setBulkPriceStatus('success');
        setTimeout(() => setShowBulkPriceModal(false), 1000);
      } else { showToast('Error al actualizar precios.'); setBulkPriceStatus('error'); }
    } catch { showToast('Error de red.'); setBulkPriceStatus('error'); }
    finally { setTimeout(() => setBulkPriceStatus('idle'), 3000); }
  };

  // ── Redondear precios actuales a formato X.990 ───────────────────────────
  const handleRoundPrices = async () => {
    if (!canEditPrice) { showToast('Sin permisos.'); return; }
    if (!confirm('¿Redondear TODOS los precios al formato X.990 (ej: 9990, 18990)? Los precios originales quedarán guardados.')) return;
    setBulkPriceStatus('saving');
    try {
      const res = await fetch('/api/catalogo/bulk-price', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'round' }),
      });
      if (res.ok) {
        showToast('🔢 Precios redondeados a formato X.990 exitosamente');
        await refreshCatalogAfterBulk();
        setBulkPriceStatus('success');
        setTimeout(() => setShowBulkPriceModal(false), 1000);
      } else { showToast('Error al redondear.'); setBulkPriceStatus('error'); }
    } catch { showToast('Error de red.'); setBulkPriceStatus('error'); }
    finally { setTimeout(() => setBulkPriceStatus('idle'), 3000); }
  };

  // ── Restaurar precios originales ─────────────────────────────────────────
  const handleResetPrices = async () => {
    if (!canEditPrice) { showToast('Sin permisos.'); return; }
    if (!confirm('¿Restaurar los precios ORIGINALES de todos los productos? Esto revertirá todos los ajustes masivos aplicados.')) return;
    setBulkPriceStatus('saving');
    try {
      const res = await fetch('/api/catalogo/bulk-price', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'reset' }),
      });
      const data = await res.json();
      if (res.ok) {
        showToast(`↩️ ${data.updatedCount} precios restaurados al valor original`);
        await refreshCatalogAfterBulk();
        setBulkPriceStatus('success');
        setTimeout(() => setShowBulkPriceModal(false), 1000);
      } else { showToast('Error al restaurar.'); setBulkPriceStatus('error'); }
    } catch { showToast('Error de red.'); setBulkPriceStatus('error'); }
    finally { setTimeout(() => setBulkPriceStatus('idle'), 3000); }
  };

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
        setEditGaleria(p.tags_visuales?.galeria || (p.imagen ? [p.imagen] : []));
        setEditDescripcion(p.descripcion || '');
        const catArray = Array.isArray(p.categoria) ? p.categoria : (p.categoria ? p.categoria.split(',').map((s: string) => s.trim()).filter(Boolean) : []);
        const subArray = Array.isArray(p.subcategoria) ? p.subcategoria : (p.subcategoria ? p.subcategoria.split(',').map((s: string) => s.trim()).filter(Boolean) : []);
        setEditCategorias(catArray);
        setEditSubcategorias(subArray);
        setEditCrossSell(p.cross_sell ? p.cross_sell.join(', ') : '');
        setEditColores(p.tags_visuales?.colores || []);
        setEditMetaTitle(p.meta_title || '');
        setEditMetaDescription(p.meta_description || '');
        setEditMetaKeywords(p.meta_keywords || '');
        setEditSlug(p.slug || (p.nombre ? p.nombre.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '') : ''));
        
        setEditFondo(p.tags_visuales?.fondo || 'neutro');
        setEditAngulo(p.tags_visuales?.angulo || 'frontal');
        setEditLuz(p.tags_visuales?.luz || 'estudio');
        
        setNewColorInput('');
        setSaveStatus('idle');
      } else if (selectedProduct === 'new') {
        setEditEstado('activo');
        setEditBadge('');
        setEditNombre('');
        setEditPrecio(0);
        setEditImagen('');
        setEditGaleria([]);
        setEditDescripcion('');
        setEditCategorias(['Flores']);
        setEditSubcategorias([]);
        setEditCrossSell('');
        setEditColores([]);
        setEditFondo('neutro');
        setEditAngulo('frontal');
        setEditLuz('estudio');
        setNewColorInput('');
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
          imagen: editGaleria.length > 0 ? editGaleria[0] : '', // sync primary image
          galeria: editGaleria.length > 0 ? editGaleria : undefined,
          descripcion: editDescripcion,
          categoria: editCategorias.join(', '),
          subcategoria: editSubcategorias.join(', '),
          meta_title: editMetaTitle || undefined,
          meta_description: editMetaDescription || undefined,
          meta_keywords: editMetaKeywords || undefined,
          slug: editSlug || undefined,
          cross_sell: editCrossSell ? editCrossSell.split(',').map(s => s.trim()).filter(Boolean) : null,
          colores: editColores.length > 0 ? editColores : undefined,
          fondo: editFondo,
          angulo: editAngulo,
          luz: editLuz
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
        const errorData = await res.json().catch(() => ({}));
        showToast(`Error al guardar: ${errorData.error || res.statusText || 'Desconocido'}`);
        setTimeout(() => setSaveStatus('idle'), 3000);
      }
    } catch (e: any) {
      setSaveStatus('error');
      showToast(`Excepción al guardar: ${e.message}`);
      setTimeout(() => setSaveStatus('idle'), 3000);
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

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('bucket', 'productos');
      formData.append('folder', 'catalogo');

      const res = await fetch('/api/upload', { method: 'POST', body: formData });
      const result = await res.json();
      if (!res.ok) throw new Error(result.error || `Error ${res.status}`);

      setEditGaleria(prev => {
        const next = [...prev, result.url];
        if (next.length === 1) setEditImagen(result.url);
        return next;
      });
    } catch (error: any) {
      showToast(`Error al subir la imagen: ${error.message}`);
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

  const filteredCatalogo = catalogo.filter(p => 
    p.nombre?.toLowerCase().includes(searchTermProducts.toLowerCase()) || 
    p.categoria?.toLowerCase().includes(searchTermProducts.toLowerCase()) ||
    p.subcategoria?.toLowerCase().includes(searchTermProducts.toLowerCase())
  );

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
                onClick={() => setShowBulkPriceModal(true)}
                className="bg-gradient-to-r from-orange-500 to-red-500 text-white text-sm font-bold px-5 py-2.5 rounded-xl shadow-[0_4px_15px_rgba(249,115,22,0.3)] hover:scale-105 hover:shadow-[0_6px_20px_rgba(249,115,22,0.5)] transition-all active:scale-95 flex items-center gap-2"
              >
                <span>📈</span> Ajuste Precios
              </button>
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
        
        {/* Lista de Productos */}
        <div className="lg:col-span-2 bg-[#1C1C1E] border border-gray-800 rounded-3xl p-6 overflow-hidden flex flex-col h-[70vh]">
          <div className="flex justify-between items-center mb-4 gap-4">
            <h2 className="font-bold text-white shrink-0">Catálogo Activo</h2>
            <div className="relative flex-1 max-w-sm">
              <input 
                type="text" 
                placeholder="Buscar por nombre, categoría..." 
                value={searchTermProducts}
                onChange={e => setSearchTermProducts(e.target.value)}
                className="w-full bg-[#111111] border border-gray-800 rounded-xl px-4 py-2 text-sm text-white focus:border-primary outline-none"
              />
            </div>
          </div>
          <div className="overflow-y-auto pr-2 space-y-3 flex-1">
            {catalogo.length === 0 ? (
              <div className="text-gray-500 text-sm text-center py-10">Cargando catálogo base de datos...</div>
            ) : filteredCatalogo.length === 0 ? (
              <div className="text-gray-500 text-sm text-center py-10">No se encontraron productos para "{searchTermProducts}".</div>
            ) : filteredCatalogo.map((p) => (
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

                {/* Categorías Madres y Subcategorías Multi-Selección */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">
                      Categorías Madres (Selección Múltiple)
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {categories.map((c, idx) => {
                        const catName = c.name || c.nombre;
                        const isSelected = editCategorias.includes(catName);
                        return (
                          <button
                            key={idx}
                            type="button"
                            disabled={!canEdit}
                            onClick={() => {
                              if (isSelected) {
                                setEditCategorias(editCategorias.filter((x: string) => x !== catName));
                              } else {
                                setEditCategorias([...editCategorias, catName]);
                              }
                            }}
                            className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all border ${
                              isSelected 
                                ? 'bg-fuchsia-600 border-fuchsia-500 text-white shadow-md' 
                                : 'bg-[#1C1C1E] border-gray-800 text-gray-400 hover:border-gray-600'
                            }`}
                          >
                            {catName} {isSelected && '✓'}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">
                      Subcategorías / Colecciones (Selección Múltiple)
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {Array.from(new Set(
                        categories
                          .filter(c => editCategorias.length === 0 || editCategorias.includes(c.name || c.nombre))
                          .flatMap(c => (c.subcategorias || []).map((s: any) => typeof s === 'string' ? s : s.nombre))
                      )).map((sub: any, idx: number) => {
                        const isSelected = editSubcategorias.includes(sub);
                        return (
                          <button
                            key={idx}
                            type="button"
                            disabled={!canEdit}
                            onClick={() => {
                              if (isSelected) {
                                setEditSubcategorias(editSubcategorias.filter((x: string) => x !== sub));
                              } else {
                                setEditSubcategorias([...editSubcategorias, sub]);
                              }
                            }}
                            className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all border ${
                              isSelected 
                                ? 'bg-purple-600 border-purple-500 text-white shadow-md' 
                                : 'bg-[#1C1C1E] border-gray-800 text-gray-400 hover:border-gray-600'
                            }`}
                          >
                            {sub} {isSelected && '✓'}
                          </button>
                        );
                      })}
                    </div>
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
                  <div className="col-span-2">
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Imágenes del Producto (Máx 4)</label>
                    <div className="flex gap-2 flex-wrap">
                      {editGaleria.map((img, i) => (
                        <div key={i} className="relative w-24 h-24 rounded-xl overflow-hidden border border-gray-800">
                          <img src={img} alt={`Img ${i+1}`} className="w-full h-full object-cover" />
                          <button onClick={() => { if(canEdit) setEditGaleria(prev => prev.filter((_, idx) => idx !== i)) }} className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold opacity-80 hover:opacity-100">✕</button>
                          {i === 0 && <span className="absolute bottom-0 left-0 right-0 bg-primary/80 text-white text-[9px] font-bold text-center py-0.5">PRINCIPAL</span>}
                        </div>
                      ))}
                      {editGaleria.length < 4 && (
                        <label className="w-24 h-24 bg-[#1C1C1E] border border-gray-800 rounded-xl flex flex-col items-center justify-center text-gray-400 hover:text-white cursor-pointer transition-colors border-dashed hover:border-gray-500">
                          {isUploading ? <span className="text-xs">Subiendo...</span> : <>
                            <span className="text-2xl mb-1">+</span>
                            <span className="text-[9px] uppercase font-bold">Subir Foto</span>
                          </>}
                          <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} disabled={!canEdit || isUploading} />
                        </label>
                      )}
                    </div>
                    {editGaleria.length === 0 && <p className="text-[10px] text-red-400 mt-1">Debes subir al menos 1 imagen principal.</p>}
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
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Opciones de Color (Opcional)</label>
                  <div className="flex flex-wrap gap-2 mb-3">
                    {COLORS.map(c => {
                      const isSelected = editColores.includes(c);
                      return (
                        <button
                          key={c}
                          onClick={() => {
                            if (!canEdit) return;
                            if (isSelected) setEditColores(editColores.filter(x => x !== c));
                            else setEditColores([...editColores, c]);
                          }}
                          disabled={!canEdit}
                          className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all border disabled:opacity-50 ${isSelected ? 'bg-primary border-primary text-white' : 'bg-transparent border-gray-700 text-gray-400 hover:border-gray-500'}`}
                        >
                          {c}
                        </button>
                      )
                    })}
                    {editColores.filter(c => !COLORS.includes(c)).map(c => (
                      <button
                        key={c}
                        onClick={() => {
                          if (canEdit) setEditColores(editColores.filter(x => x !== c));
                        }}
                        disabled={!canEdit}
                        className="px-3 py-1.5 rounded-full text-xs font-bold transition-all border bg-primary border-primary text-white flex items-center gap-1 disabled:opacity-50"
                      >
                        {c} <span className="text-[10px]">✕</span>
                      </button>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <input 
                      type="text"
                      disabled={!canEdit}
                      value={newColorInput}
                      onChange={e => setNewColorInput(e.target.value)}
                      onKeyDown={e => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          if (newColorInput.trim() && !editColores.includes(newColorInput.trim())) {
                            setEditColores([...editColores, newColorInput.trim()]);
                            setNewColorInput('');
                          }
                        }
                      }}
                      placeholder="Añadir otro color (Ej: Azul Marino)"
                      className="flex-1 bg-[#1C1C1E] border border-gray-800 rounded-xl px-4 py-2 text-white focus:border-primary outline-none text-sm disabled:opacity-50"
                    />
                    <button 
                      disabled={!canEdit}
                      onClick={(e) => {
                        e.preventDefault();
                        if (newColorInput.trim() && !editColores.includes(newColorInput.trim())) {
                          setEditColores([...editColores, newColorInput.trim()]);
                          setNewColorInput('');
                        }
                      }}
                      className="bg-gray-800 hover:bg-gray-700 text-white px-4 py-2 rounded-xl text-sm font-bold transition-colors disabled:opacity-50"
                    >
                      Añadir
                    </button>
                  </div>
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
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Fondo</label>
                      <select 
                        disabled={!canEdit} 
                        value={editFondo}
                        onChange={e => setEditFondo(e.target.value)}
                        className="w-full bg-[#1C1C1E] border border-gray-800 rounded-xl px-4 py-3 text-white focus:border-primary outline-none disabled:opacity-50"
                      >
                        <option value="neutro">Neutro (Gris/Blanco)</option>
                        <option value="oscuro">Oscuro (Elegante)</option>
                        <option value="natural">Natural (Exterior/Jardín)</option>
                        <option value="textura">Con Textura (Madera/Mármol)</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Ángulo</label>
                      <select 
                        disabled={!canEdit} 
                        value={editAngulo}
                        onChange={e => setEditAngulo(e.target.value)}
                        className="w-full bg-[#1C1C1E] border border-gray-800 rounded-xl px-4 py-3 text-white focus:border-primary outline-none disabled:opacity-50"
                      >
                        <option value="frontal">Frontal</option>
                        <option value="cenital">Cenital (Desde arriba)</option>
                        <option value="picado">Picado (Inclinado)</option>
                        <option value="detalle">Detalle (Macro)</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Luz</label>
                      <select 
                        disabled={!canEdit} 
                        value={editLuz}
                        onChange={e => setEditLuz(e.target.value)}
                        className="w-full bg-[#1C1C1E] border border-gray-800 rounded-xl px-4 py-3 text-white focus:border-primary outline-none disabled:opacity-50"
                      >
                        <option value="estudio">Estudio (Uniforme)</option>
                        <option value="natural">Luz Natural</option>
                        <option value="dramatica">Dramática (Contrastada)</option>
                        <option value="calida">Cálida (Atardecer)</option>
                      </select>
                    </div>
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
      {/* Category Manager Modal */}
      {showCategoryModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-[#1C1C1E] border border-gray-800 rounded-3xl p-6 w-full max-w-2xl shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-white">Gestor de Categorías</h2>
              <button onClick={() => setShowCategoryModal(false)} className="text-gray-500 hover:text-white transition-colors">✕</button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-3">Categorías Madres</h3>
                <div className="bg-[#111111] rounded-xl border border-gray-800 p-4 h-64 overflow-y-auto mb-3">
                  {categories.map((c, i) => (
                    <div key={i} className="flex items-center justify-between py-2 border-b border-gray-800 last:border-0">
                      <span className="text-white font-medium text-sm">{c.name}</span>
                      <button onClick={() => {
                        const newCats = categories.filter(cat => cat.id !== c.id);
                        saveCategories(newCats);
                      }} className="text-red-500 hover:text-red-400 text-xs font-bold">Borrar</button>
                    </div>
                  ))}
                </div>
                <div className="flex gap-2">
                  <input 
                    type="text" 
                    value={newCatName}
                    onChange={e => setNewCatName(e.target.value)}
                    placeholder="Nueva Categoría..."
                    className="flex-1 bg-[#111111] border border-gray-800 rounded-xl px-3 py-2 text-white text-sm focus:border-primary outline-none"
                  />
                  <button onClick={handleAddCategory} className="bg-primary hover:bg-primary-dark text-white px-3 py-2 rounded-xl text-sm font-bold transition-colors">+</button>
                </div>
              </div>
              
              <div>
                <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-3">Subcategorías</h3>
                <select 
                  value={selectedCatForSub}
                  onChange={e => setSelectedCatForSub(e.target.value)}
                  className="w-full bg-[#111111] border border-gray-800 rounded-xl px-3 py-2 text-white text-sm focus:border-primary outline-none mb-3"
                >
                  <option value="">Selecciona Categoría...</option>
                  {categories.map((c, i) => <option key={i} value={c.id}>{c.name}</option>)}
                </select>
                
                <div className="bg-[#111111] rounded-xl border border-gray-800 p-4 h-48 overflow-y-auto mb-3">
                  {selectedCatForSub ? (
                    categories.find(c => c.id === selectedCatForSub)?.subcategorias?.map((sub: string, i: number) => (
                      <div key={i} className="flex items-center justify-between py-2 border-b border-gray-800 last:border-0">
                        <span className="text-gray-300 text-sm">{sub}</span>
                        <button onClick={() => {
                          const newCats = categories.map(c => {
                            if (c.id === selectedCatForSub) {
                              return { ...c, subcategorias: c.subcategorias.filter((s: string) => s !== sub) };
                            }
                            return c;
                          });
                          saveCategories(newCats);
                        }} className="text-red-500 hover:text-red-400 text-[10px] font-bold">X</button>
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
                    disabled={!selectedCatForSub}
                    className="flex-1 bg-[#111111] border border-gray-800 rounded-xl px-3 py-2 text-white text-sm focus:border-primary outline-none disabled:opacity-50"
                  />
                  <button onClick={handleAddSubcategory} disabled={!selectedCatForSub} className="bg-primary hover:bg-primary-dark text-white px-3 py-2 rounded-xl text-sm font-bold transition-colors disabled:opacity-50">+</button>
                </div>
              </div>
            </div>
            
          </div>
        </div>
      )}

      {/* ── Bulk Price Modal ────────────────────────────────────────────── */}
      {showBulkPriceModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-[#1C1C1E] border border-gray-800 rounded-3xl p-6 w-full max-w-lg shadow-2xl animate-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto">

            {/* Header */}
            <div className="flex justify-between items-center mb-2">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-fuchsia-500/10 border border-fuchsia-500/20 flex items-center justify-center text-lg">💰</div>
                <h2 className="text-xl font-bold text-white">Ajuste Masivo de Precios</h2>
              </div>
              <button onClick={() => setShowBulkPriceModal(false)} className="text-gray-500 hover:text-white transition-colors w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/10">✕</button>
            </div>
            <p className="text-xs text-gray-500 mb-6 pl-12">Afecta a <strong className="text-gray-300">TODOS</strong> los productos del catálogo de forma interna (sin que el cliente lo vea en tiempo real hasta que se suba).</p>

            {/* Toggle de redondeo */}
            <div className="flex items-center justify-between bg-white/[0.04] border border-white/8 rounded-2xl px-4 py-3 mb-6">
              <div>
                <p className="text-sm font-bold text-white">🔢 Redondeo automático a X.990</p>
                <p className="text-xs text-gray-500 mt-0.5">Ej: 10.230 → 9.990 · 18.400 → 17.990 · 25.100 → 24.990</p>
              </div>
              <button
                onClick={() => setBulkRound(!bulkRound)}
                className={`relative w-12 h-6 rounded-full transition-all ${bulkRound ? 'bg-fuchsia-500' : 'bg-gray-700'}`}
              >
                <span className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-all ${bulkRound ? 'left-6' : 'left-0.5'}`} />
              </button>
            </div>

            <div className="space-y-5">

              {/* ↑ Subir precios */}
              <div>
                <h3 className="text-[10px] font-extrabold text-green-400 uppercase tracking-widest mb-2.5 flex items-center gap-1.5">📈 Subir Precios <span className="text-gray-600 font-normal normal-case tracking-normal">(inflación / escasez)</span></h3>
                <div className="flex flex-wrap gap-2">
                  {[5, 10, 15, 20, 30, 50].map(pct => (
                    <button
                      key={`up-${pct}`}
                      onClick={() => handleBulkPriceUpdate(pct)}
                      disabled={bulkPriceStatus === 'saving'}
                      className="bg-green-500/10 border border-green-500/30 hover:bg-green-500 text-green-400 hover:text-white px-4 py-2 rounded-xl text-sm font-bold transition-all disabled:opacity-40"
                    >
                      +{pct}%
                    </button>
                  ))}
                </div>
              </div>

              {/* ↓ Bajar precios */}
              <div>
                <h3 className="text-[10px] font-extrabold text-red-400 uppercase tracking-widest mb-2.5 flex items-center gap-1.5">📉 Bajar Precios <span className="text-gray-600 font-normal normal-case tracking-normal">(oferta / liquidación)</span></h3>
                <div className="flex flex-wrap gap-2">
                  {[-5, -10, -15, -20, -25, -30].map(pct => (
                    <button
                      key={`down-${pct}`}
                      onClick={() => handleBulkPriceUpdate(pct)}
                      disabled={bulkPriceStatus === 'saving'}
                      className="bg-red-500/10 border border-red-500/30 hover:bg-red-500 text-red-400 hover:text-white px-4 py-2 rounded-xl text-sm font-bold transition-all disabled:opacity-40"
                    >
                      {pct}%
                    </button>
                  ))}
                </div>
              </div>

              {/* Separador */}
              <div className="border-t border-white/6 pt-4 space-y-2.5">

                {/* 🔢 Redondear precios actuales */}
                <button
                  onClick={handleRoundPrices}
                  disabled={bulkPriceStatus === 'saving'}
                  className="w-full flex items-center justify-between px-4 py-3 rounded-2xl bg-blue-500/10 border border-blue-500/20 hover:bg-blue-500/20 text-blue-400 font-bold text-sm transition-all disabled:opacity-40"
                >
                  <span className="flex items-center gap-2.5">
                    <span className="text-lg">🔢</span>
                    <span>
                      <span className="block">Redondear precios actuales a X.990</span>
                      <span className="text-xs text-blue-500/60 font-normal">Sin cambiar el porcentaje · solo ajusta el formato</span>
                    </span>
                  </span>
                  <span className="text-blue-500/60 text-xs">→</span>
                </button>

                {/* ↩ Restaurar precios originales */}
                <button
                  onClick={handleResetPrices}
                  disabled={bulkPriceStatus === 'saving'}
                  className="w-full flex items-center justify-between px-4 py-3 rounded-2xl bg-amber-500/10 border border-amber-500/20 hover:bg-amber-500/20 text-amber-400 font-bold text-sm transition-all disabled:opacity-40"
                >
                  <span className="flex items-center gap-2.5">
                    <span className="text-lg">↩️</span>
                    <span>
                      <span className="block">Restaurar precios normales (originales)</span>
                      <span className="text-xs text-amber-500/60 font-normal">Revierte todos los ajustes masivos aplicados</span>
                    </span>
                  </span>
                  <span className="text-amber-500/60 text-xs">→</span>
                </button>
              </div>
            </div>

            {/* Loading / Success / Error */}
            {bulkPriceStatus === 'saving' && (
              <div className="mt-5 flex items-center justify-center gap-2 text-fuchsia-400 font-bold text-sm animate-pulse">
                <span className="w-4 h-4 border-2 border-fuchsia-500 border-t-transparent rounded-full animate-spin" />
                Actualizando toda la base de datos...
              </div>
            )}
            {bulkPriceStatus === 'success' && (
              <p className="mt-5 text-center text-emerald-400 font-bold text-sm">✅ ¡Precios actualizados con éxito!</p>
            )}
            {bulkPriceStatus === 'error' && (
              <p className="mt-5 text-center text-red-400 font-bold text-sm">❌ Ocurrió un error. Intenta nuevamente.</p>
            )}
          </div>
        </div>
      )}

    </div>
  );
}
