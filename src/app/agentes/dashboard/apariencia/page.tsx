'use client';

import { useState, useEffect } from 'react';
import { Save, Loader2, LayoutTemplate, Type, Image as ImageIcon, CreditCard, Wand2, X, Sparkles, UploadCloud, Users } from 'lucide-react';
import { createClient } from '@/utils/supabase/client';

export default function AparienciaPage() {
  const supabase = createClient();
  const [config, setConfig] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('fonts');

  // Image Upload State
  const [uploadingPath, setUploadingPath] = useState<string | null>(null);

  // AI Assistant States
  const [aiModalOpen, setAiModalOpen] = useState(false);
  const [aiFieldPath, setAiFieldPath] = useState<any[]>([]);
  const [aiContext, setAiContext] = useState('');
  const [aiPrompt, setAiPrompt] = useState('');
  const [aiOptions, setAiOptions] = useState<string[]>([]);
  const [aiLoading, setAiLoading] = useState(false);

  useEffect(() => {
    fetch('/api/config')
      .then(res => res.json())
      .then(data => {
        if (Object.keys(data).length > 0) {
          setConfig(data);
        }
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch('/api/config', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(config),
      });
      if (res.ok) {
        alert('Configuración guardada exitosamente.');
      } else {
        alert('Error al guardar configuración.');
      }
    } catch (err) {
      alert('Error de conexión.');
    }
    setSaving(false);
  };

  const handleGenerateAI = async () => {
    if (!aiPrompt) return;
    setAiLoading(true);
    setAiOptions([]);
    try {
      const res = await fetch('/api/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: aiPrompt, context: aiContext })
      });
      const data = await res.json();
      if (data.error) {
        alert(data.error);
      } else if (data.options) {
        setAiOptions(data.options);
      }
    } catch (err) {
      alert('Error conectando con la IA.');
    }
    setAiLoading(false);
  };

  const applyAIOption = (text: string) => {
    updateConfig(aiFieldPath, text);
    setAiModalOpen(false);
    setAiPrompt('');
    setAiOptions([]);
  };

  if (loading) {
    return <div className="flex h-64 items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-fuchsia-500" /></div>;
  }

  if (!config) {
    return <div className="text-white">Error: No se encontró la configuración. Por favor corre las migraciones de BD.</div>;
  }

  const updateConfig = (path: any[], value: any) => {
    setConfig((prev: any) => {
      const newConfig = { ...prev };
      let current = newConfig;
      for (let i = 0; i < path.length - 1; i++) {
        current[path[i]] = Array.isArray(current[path[i]]) ? [...current[path[i]]] : { ...current[path[i]] };
        current = current[path[i]];
      }
      current[path[path.length - 1]] = value;
      return newConfig;
    });
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, path: any[]) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    const pathKey = path.join('.');
    setUploadingPath(pathKey);
    
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
      const filePath = `apariencia/${fileName}`; // Usaremos la carpeta apariencia dentro del bucket productos
      
      const { error: uploadError } = await supabase.storage.from('productos').upload(filePath, file);
      
      if (uploadError) {
        throw uploadError;
      }
      
      const { data: { publicUrl } } = supabase.storage.from('productos').getPublicUrl(filePath);
      
      updateConfig(path, publicUrl);
    } catch (err: any) {
      alert(`Error subiendo imagen: ${err.message}`);
    } finally {
      setUploadingPath(null);
    }
  };

  const fontsList = ['Inter', 'Playfair Display', 'Cormorant Garamond', 'Cinzel', 'Great Vibes', 'Montserrat', 'Lora', 'Dancing Script'];

  const renderInput = (label: string, path: any[], isTextArea = false, useAI = false, isImage = false) => {
    const value = path.reduce((acc, curr) => acc?.[curr], config) || '';
    const pathKey = path.join('.');
    const isUploading = uploadingPath === pathKey;

    return (
      <div className="relative">
        <label className="flex items-center justify-between text-sm font-medium text-gray-400 mb-2">
          {label}
          <div className="flex gap-2">
            {isImage && (
              <label className={`text-blue-400 hover:text-blue-300 flex items-center gap-1.5 text-xs bg-blue-500/10 hover:bg-blue-500/20 px-2.5 py-1 rounded-md transition-colors border border-blue-500/20 cursor-pointer ${isUploading ? 'opacity-50 pointer-events-none' : ''}`}>
                {isUploading ? <Loader2 size={12} className="animate-spin" /> : <UploadCloud size={12} />}
                {isUploading ? 'Subiendo...' : 'Subir'}
                <input 
                  type="file" 
                  className="hidden" 
                  accept="image/*,video/mp4" 
                  onChange={(e) => handleImageUpload(e, path)} 
                />
              </label>
            )}
            {useAI && (
              <button 
                onClick={() => {
                  setAiFieldPath(path);
                  setAiContext(label);
                  setAiModalOpen(true);
                }}
                className="text-fuchsia-400 hover:text-fuchsia-300 flex items-center gap-1.5 text-xs bg-fuchsia-500/10 hover:bg-fuchsia-500/20 px-2.5 py-1 rounded-md transition-colors border border-fuchsia-500/20"
              >
                <Wand2 size={12} /> IA
              </button>
            )}
          </div>
        </label>
        {isTextArea ? (
          <textarea value={value} onChange={(e) => updateConfig(path, e.target.value)} rows={3} className="w-full bg-[#141416] border border-gray-700 rounded-xl px-4 py-3 text-white outline-none focus:border-fuchsia-500 transition-colors" />
        ) : (
          <input type="text" value={value} onChange={(e) => updateConfig(path, e.target.value)} className="w-full bg-[#141416] border border-gray-700 rounded-xl px-4 py-3 text-white outline-none focus:border-fuchsia-500 transition-colors" />
        )}
      </div>
    );
  };

  return (
    <div className="text-gray-300 relative">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Apariencia Web</h1>
          <p className="text-gray-500">Modifica títulos, imágenes, tipografías y tiempos del sitio público.</p>
        </div>
        <button 
          onClick={handleSave} 
          disabled={saving}
          className="flex items-center gap-2 bg-gradient-to-r from-fuchsia-600 to-purple-600 hover:from-fuchsia-500 hover:to-purple-500 text-white px-6 py-3 rounded-xl font-bold shadow-lg transition-all disabled:opacity-50"
        >
          {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
          {saving ? 'Guardando...' : 'Guardar Cambios'}
        </button>
      </div>

      <div className="flex gap-4 mb-8 border-b border-gray-800 pb-4 overflow-x-auto">
        <button onClick={() => setActiveTab('fonts')} className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors whitespace-nowrap ${activeTab === 'fonts' ? 'bg-fuchsia-500/20 text-fuchsia-400' : 'text-gray-500 hover:text-gray-300'}`}><Type size={18} /> Fuentes y Tiempos</button>
        <button onClick={() => setActiveTab('hero')} className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors whitespace-nowrap ${activeTab === 'hero' ? 'bg-fuchsia-500/20 text-fuchsia-400' : 'text-gray-500 hover:text-gray-300'}`}><LayoutTemplate size={18} /> Hero Slider</button>
        <button onClick={() => setActiveTab('info')} className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors whitespace-nowrap ${activeTab === 'info' ? 'bg-fuchsia-500/20 text-fuchsia-400' : 'text-gray-500 hover:text-gray-300'}`}><ImageIcon size={18} /> Info Slider</button>
        <button onClick={() => setActiveTab('banners')} className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors whitespace-nowrap ${activeTab === 'banners' ? 'bg-fuchsia-500/20 text-fuchsia-400' : 'text-gray-500 hover:text-gray-300'}`}><CreditCard size={18} /> Banners</button>
        <button onClick={() => setActiveTab('nosotros')} className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors whitespace-nowrap ${activeTab === 'nosotros' ? 'bg-fuchsia-500/20 text-fuchsia-400' : 'text-gray-500 hover:text-gray-300'}`}><Users size={18} /> Nosotros</button>
      </div>

      <div className="bg-[#141416] border border-[#1C1C1E] rounded-2xl p-6 md:p-8">
        
        {/* TAB: FONTS & TIMINGS */}
        {activeTab === 'fonts' && (
          <div className="space-y-8">
            <div>
              <h3 className="text-xl font-bold text-white mb-6">Tipografías Globales</h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Fuente de Títulos (Headings)</label>
                  <select 
                    value={config.fonts?.heading || 'Inter'} 
                    onChange={(e) => updateConfig(['fonts', 'heading'], e.target.value)}
                    className="w-full bg-[#1A1A1D] border border-gray-800 rounded-xl px-4 py-3 text-white focus:border-fuchsia-500 outline-none"
                  >
                    {fontsList.map(f => <option key={f} value={f}>{f}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Fuente de Cuerpo (Body)</label>
                  <select 
                    value={config.fonts?.body || 'Inter'} 
                    onChange={(e) => updateConfig(['fonts', 'body'], e.target.value)}
                    className="w-full bg-[#1A1A1D] border border-gray-800 rounded-xl px-4 py-3 text-white focus:border-fuchsia-500 outline-none"
                  >
                    {fontsList.map(f => <option key={f} value={f}>{f}</option>)}
                  </select>
                </div>
              </div>
            </div>

            <hr className="border-gray-800" />

            <div>
              <h3 className="text-xl font-bold text-white mb-6">Tiempos de Animación (milisegundos)</h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Hero Slider (Inicio)</label>
                  <input 
                    type="number" 
                    value={config.timings?.heroSliderTransition || 5000} 
                    onChange={(e) => updateConfig(['timings', 'heroSliderTransition'], parseInt(e.target.value))}
                    className="w-full bg-[#1A1A1D] border border-gray-800 rounded-xl px-4 py-3 text-white focus:border-fuchsia-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Info Slider (Experiencia)</label>
                  <input 
                    type="number" 
                    value={config.timings?.infoSliderTransition || 5000} 
                    onChange={(e) => updateConfig(['timings', 'infoSliderTransition'], parseInt(e.target.value))}
                    className="w-full bg-[#1A1A1D] border border-gray-800 rounded-xl px-4 py-3 text-white focus:border-fuchsia-500 outline-none"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB: HERO SLIDER */}
        {activeTab === 'hero' && (
          <div className="space-y-12">
            {config.heroSlider?.map((slide: any, index: number) => (
              <div key={index} className="p-6 bg-[#1A1A1D] border border-gray-800 rounded-2xl">
                <h3 className="text-lg font-bold text-fuchsia-400 mb-4">Diapositiva {index + 1}</h3>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="col-span-2">{renderInput('Título Principal', ['heroSlider', index, 'title'], false, true)}</div>
                  <div className="col-span-2">{renderInput('Subtítulo / Descripción', ['heroSlider', index, 'subtitle'], true, true)}</div>
                  <div className="col-span-2">
                    {renderInput('URL de Imagen (Fondo)', ['heroSlider', index, 'image'], false, false, true)}
                    {slide.image && <img src={slide.image} alt="Preview" className="h-24 w-auto object-cover mt-2 rounded-lg border border-gray-800" />}
                  </div>
                  <div>{renderInput('Texto del Botón', ['heroSlider', index, 'buttonText'], false, true)}</div>
                  <div>{renderInput('Enlace del Botón', ['heroSlider', index, 'buttonLink'], false, false)}</div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* TAB: INFO SLIDER */}
        {activeTab === 'info' && (
          <div className="space-y-12">
            {config.infoSlider?.map((slide: any, index: number) => (
              <div key={index} className="p-6 bg-[#1A1A1D] border border-gray-800 rounded-2xl">
                <h3 className="text-lg font-bold text-fuchsia-400 mb-4">Slide de Información {index + 1}</h3>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>{renderInput('Etiqueta (Badge)', ['infoSlider', index, 'tag'], false, true)}</div>
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">Tipo de Medio</label>
                    <select value={slide.type} onChange={(e) => updateConfig(['infoSlider', index, 'type'], e.target.value)} className="w-full bg-[#141416] border border-gray-700 rounded-xl px-4 py-3 text-white outline-none focus:border-fuchsia-500">
                      <option value="image">Imagen (PNG/JPG)</option>
                      <option value="video">Video (MP4)</option>
                    </select>
                  </div>
                  <div className="col-span-2">{renderInput('Título Principal', ['infoSlider', index, 'title'], false, true)}</div>
                  <div className="col-span-2">{renderInput('Subtítulo / Descripción', ['infoSlider', index, 'subtitle'], true, true)}</div>
                  <div className="col-span-2">{renderInput('URL del Medio (Fondo)', ['infoSlider', index, 'media'], false, false, true)}</div>
                  <div>{renderInput('Botón Primario (Texto)', ['infoSlider', index, 'primaryText'], false, true)}</div>
                  <div>{renderInput('Botón Primario (Link)', ['infoSlider', index, 'primaryLink'], false, false)}</div>
                  <div>{renderInput('Botón Secundario (Texto)', ['infoSlider', index, 'secondaryText'], false, true)}</div>
                  <div>{renderInput('Botón Secundario (Link)', ['infoSlider', index, 'secondaryLink'], false, false)}</div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* TAB: BANNERS */}
        {activeTab === 'banners' && (
          <div className="space-y-12">
            
            <div className="p-6 bg-[#1A1A1D] border border-gray-800 rounded-2xl">
              <h3 className="text-lg font-bold text-fuchsia-400 mb-4">Banner Oscuro (Conócenos / Experiencia)</h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div>{renderInput('Etiqueta', ['experienceBanner', 'badge'], false, true)}</div>
                <div className="col-span-2">{renderInput('Título Principal', ['experienceBanner', 'title'], false, true)}</div>
                <div className="col-span-2">{renderInput('Descripción', ['experienceBanner', 'description'], true, true)}</div>
                <div>{renderInput('Texto del Botón', ['experienceBanner', 'buttonText'], false, true)}</div>
                <div>{renderInput('Enlace del Botón', ['experienceBanner', 'buttonLink'], false, false)}</div>
              </div>
            </div>

            <div className="p-6 bg-[#1A1A1D] border border-gray-800 rounded-2xl">
              <h3 className="text-lg font-bold text-fuchsia-400 mb-4">Banner Suscripción</h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div>{renderInput('Etiqueta Superior', ['subscriptionBanner', 'badge'], false, true)}</div>
                <div className="col-span-2">{renderInput('Título Principal', ['subscriptionBanner', 'title'], false, true)}</div>
                <div className="col-span-2">{renderInput('Descripción', ['subscriptionBanner', 'description'], true, true)}</div>
                <div className="col-span-2">
                  {renderInput('URL de Imagen', ['subscriptionBanner', 'image'], false, false, true)}
                  {config.subscriptionBanner?.image && <img src={config.subscriptionBanner.image} alt="Preview" className="h-24 w-auto object-cover mt-2 rounded-lg border border-gray-800" />}
                </div>
                <div>{renderInput('Label de Precio', ['subscriptionBanner', 'priceLabel'], false, true)}</div>
                <div>{renderInput('Precio Mostrado', ['subscriptionBanner', 'price'], false, false)}</div>
                <div className="col-span-2">{renderInput('Subtexto Precio', ['subscriptionBanner', 'priceSubtext'], false, true)}</div>
                <div>{renderInput('Texto Botón Suscripción', ['subscriptionBanner', 'buttonText'], false, true)}</div>
                <div>{renderInput('URL Botón Suscripción', ['subscriptionBanner', 'buttonLink'], false, false)}</div>
              </div>
            </div>

          </div>
        )}

        {/* TAB: NOSOTROS */}
        {activeTab === 'nosotros' && (
          <div className="space-y-10">

            {/* Hero Nosotros */}
            <div className="p-6 bg-[#1A1A1D] border border-gray-800 rounded-2xl">
              <h3 className="text-lg font-bold text-fuchsia-400 mb-4">🌸 Sección Principal (Hero)</h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div>{renderInput('Badge / Etiqueta Superior', ['nosotros', 'hero', 'badge'], false, true)}</div>
                <div className="col-span-2">{renderInput('Título Principal', ['nosotros', 'hero', 'title'], false, true)}</div>
                <div className="col-span-2">{renderInput('Cita / Quote (sobre la imagen)', ['nosotros', 'hero', 'quote'], true, true)}</div>
                <div className="col-span-2">
                  {renderInput('URL Imagen Hero', ['nosotros', 'hero', 'heroImage'], false, false, true)}
                  {config?.nosotros?.hero?.heroImage && <img src={config.nosotros.hero.heroImage} alt="Preview" className="h-24 w-auto object-cover mt-2 rounded-lg border border-gray-800" />}
                </div>
              </div>
            </div>

            {/* Fundadores */}
            <div className="p-6 bg-[#1A1A1D] border border-gray-800 rounded-2xl">
              <h3 className="text-lg font-bold text-fuchsia-400 mb-4">🏛️ Nuestros Fundadores</h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="col-span-2">{renderInput('Título Sección', ['nosotros', 'fundadores', 'title'], false, true)}</div>
                <div className="col-span-2">{renderInput('Párrafo 1', ['nosotros', 'fundadores', 'text1'], true, true)}</div>
                <div className="col-span-2">{renderInput('Párrafo 2', ['nosotros', 'fundadores', 'text2'], true, true)}</div>
                <div>
                  {renderInput('Nombre Fundador 1', ['nosotros', 'fundadores', 'founder1Name'], false, true)}
                  {renderInput('Cargo Fundador 1', ['nosotros', 'fundadores', 'founder1Role'], false, true)}
                  {renderInput('Imagen Fundador 1', ['nosotros', 'fundadores', 'founder1Image'], false, false, true)}
                  {config?.nosotros?.fundadores?.founder1Image && <img src={config.nosotros.fundadores.founder1Image} alt="F1" className="h-20 w-auto object-cover mt-2 rounded-lg border border-gray-800" />}
                </div>
                <div>
                  {renderInput('Nombre Fundador 2', ['nosotros', 'fundadores', 'founder2Name'], false, true)}
                  {renderInput('Cargo Fundador 2', ['nosotros', 'fundadores', 'founder2Role'], false, true)}
                  {renderInput('Imagen Fundador 2', ['nosotros', 'fundadores', 'founder2Image'], false, false, true)}
                  {config?.nosotros?.fundadores?.founder2Image && <img src={config.nosotros.fundadores.founder2Image} alt="F2" className="h-20 w-auto object-cover mt-2 rounded-lg border border-gray-800" />}
                </div>
              </div>
            </div>

            {/* Taller */}
            <div className="p-6 bg-[#1A1A1D] border border-gray-800 rounded-2xl">
              <h3 className="text-lg font-bold text-fuchsia-400 mb-4">🌷 Historias de Taller</h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div>{renderInput('Badge', ['nosotros', 'taller', 'badge'], false, true)}</div>
                <div>{renderInput('Título', ['nosotros', 'taller', 'title'], false, true)}</div>
                <div className="col-span-2">{renderInput('Párrafo 1', ['nosotros', 'taller', 'text1'], true, true)}</div>
                <div className="col-span-2">{renderInput('Párrafo 2', ['nosotros', 'taller', 'text2'], true, true)}</div>
                <div className="col-span-2">
                  {renderInput('Imagen del Taller', ['nosotros', 'taller', 'tallerImage'], false, false, true)}
                  {config?.nosotros?.taller?.tallerImage && <img src={config.nosotros.taller.tallerImage} alt="Taller" className="h-24 w-auto object-cover mt-2 rounded-lg border border-gray-800" />}
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className="p-6 bg-[#1A1A1D] border border-gray-800 rounded-2xl">
              <h3 className="text-lg font-bold text-fuchsia-400 mb-4">📊 Datos Curiosos</h3>
              <div className="grid md:grid-cols-2 gap-6">
                {(config?.nosotros?.stats || []).map((_: any, i: number) => (
                  <div key={i} className="p-4 bg-[#141416] rounded-xl border border-gray-700">
                    <p className="text-xs font-bold text-gray-500 mb-3 uppercase tracking-wider">Dato #{i + 1}</p>
                    {renderInput('Número / Valor', ['nosotros', 'stats', i, 'num'], false, false)}
                    {renderInput('Descripción', ['nosotros', 'stats', i, 'text'], false, true)}
                  </div>
                ))}
              </div>
            </div>

            {/* Equipo */}
            <div className="p-6 bg-[#1A1A1D] border border-gray-800 rounded-2xl">
              <h3 className="text-lg font-bold text-fuchsia-400 mb-4">👥 Nuestro Equipo</h3>
              <div className="space-y-6">
                {(config?.nosotros?.equipo || []).map((_: any, i: number) => (
                  <div key={i} className="p-4 bg-[#141416] rounded-xl border border-gray-700">
                    <p className="text-xs font-bold text-fuchsia-400/70 mb-3 uppercase tracking-wider">Miembro #{i + 1}</p>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>{renderInput('Nombre', ['nosotros', 'equipo', i, 'name'], false, true)}</div>
                      <div>{renderInput('Cargo / Rol', ['nosotros', 'equipo', i, 'role'], false, true)}</div>
                      <div className="col-span-2">{renderInput('Descripción', ['nosotros', 'equipo', i, 'desc'], true, true)}</div>
                      <div className="col-span-2">
                        {renderInput('Foto (URL)', ['nosotros', 'equipo', i, 'img'], false, false, true)}
                        {config?.nosotros?.equipo?.[i]?.img && <img src={config.nosotros.equipo[i].img} alt="Preview" className="h-16 w-16 object-cover mt-2 rounded-full border-2 border-gray-800" />}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Valores */}
            <div className="p-6 bg-[#1A1A1D] border border-gray-800 rounded-2xl">
              <h3 className="text-lg font-bold text-fuchsia-400 mb-4">💎 Nuestro Compromiso</h3>
              <div className="space-y-4">
                {(config?.nosotros?.valores || []).map((_: any, i: number) => (
                  <div key={i} className="p-4 bg-[#141416] rounded-xl border border-gray-700">
                    <p className="text-xs font-bold text-gray-500 mb-3 uppercase tracking-wider">Valor #{i + 1}</p>
                    <div className="grid md:grid-cols-3 gap-4">
                      <div>{renderInput('Emoji / Ícono', ['nosotros', 'valores', i, 'icon'], false, false)}</div>
                      <div>{renderInput('Título', ['nosotros', 'valores', i, 'title'], false, true)}</div>
                      <div>{renderInput('Descripción', ['nosotros', 'valores', i, 'desc'], true, true)}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}

        {/* Bottom Save Button for Convenience */}
        <div className="mt-12 flex justify-end border-t border-gray-800 pt-8">
          <button 
            onClick={handleSave} 
            disabled={saving}
            className="flex items-center gap-2 bg-white text-black hover:bg-gray-200 px-8 py-3 rounded-xl font-bold shadow-lg transition-all disabled:opacity-50 hover:-translate-y-1"
          >
            {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
            {saving ? 'Guardando...' : 'Guardar Cambios de ' + (activeTab === 'fonts' ? 'Fuentes' : activeTab === 'hero' ? 'Hero' : activeTab === 'info' ? 'Info' : activeTab === 'nosotros' ? 'Nosotros' : 'Banners')}
          </button>
        </div>
      </div>

      {/* AI Modal Overlay */}
      {aiModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-[#141416] border border-[#2A2A2C] w-full max-w-lg rounded-3xl shadow-[0_0_50px_rgba(0,0,0,0.5)] overflow-hidden flex flex-col">
            <div className="p-6 border-b border-[#2A2A2C] flex items-center justify-between bg-gradient-to-r from-fuchsia-900/20 to-transparent">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-fuchsia-500/20 flex items-center justify-center text-fuchsia-400">
                  <Sparkles size={20} />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">Asistente Creativo IA</h3>
                  <p className="text-xs text-fuchsia-400/80">Generando texto para: {aiContext}</p>
                </div>
              </div>
              <button onClick={() => setAiModalOpen(false)} className="text-gray-500 hover:text-white transition-colors">
                <X size={24} />
              </button>
            </div>
            
            <div className="p-6 space-y-6 overflow-y-auto max-h-[60vh]">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">¿De qué trata este texto?</label>
                <textarea 
                  value={aiPrompt}
                  onChange={(e) => setAiPrompt(e.target.value)}
                  placeholder="Ej: Ramo de rosas para el día de la madre, muy emotivo..."
                  className="w-full bg-[#1A1A1D] border border-gray-700 rounded-xl px-4 py-3 text-white outline-none focus:border-fuchsia-500 transition-colors"
                  rows={3}
                />
              </div>
              
              <button 
                onClick={handleGenerateAI}
                disabled={!aiPrompt || aiLoading}
                className="w-full flex justify-center items-center gap-2 bg-white text-black hover:bg-gray-200 font-bold py-3 rounded-xl transition-all disabled:opacity-50"
              >
                {aiLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Wand2 className="w-5 h-5" />}
                {aiLoading ? 'Generando magia...' : 'Generar Opciones'}
              </button>

              {aiOptions.length > 0 && (
                <div className="mt-6 space-y-3">
                  <p className="text-sm font-bold text-white">Selecciona una opción:</p>
                  {aiOptions.map((opt, i) => (
                    <div key={i} className="group relative bg-[#1A1A1D] border border-gray-800 hover:border-fuchsia-500/50 p-4 rounded-xl transition-all">
                      <p className="text-sm text-gray-300 pr-24">{opt}</p>
                      <button 
                        onClick={() => applyAIOption(opt)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 bg-fuchsia-500 text-white text-xs font-bold px-3 py-1.5 rounded-lg transition-all hover:bg-fuchsia-600"
                      >
                        Aplicar
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
