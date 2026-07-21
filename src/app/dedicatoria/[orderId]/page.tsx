'use client';
import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import MuroExperience from '@/components/MuroExperience';

const CARD_STYLES = [
  { id: 1, name: 'Minimalista Blanco & Oro', bg: 'bg-gradient-to-br from-white to-orange-50', text: 'text-gray-800' },
  { id: 2, name: 'Mármol Negro Premium', bg: 'bg-gradient-to-br from-gray-900 to-black', text: 'text-yellow-500' },
  { id: 3, name: 'Acuarela Floral Romántica', bg: 'bg-gradient-to-br from-pink-100 to-rose-200', text: 'text-rose-900' },
  { id: 4, name: 'Kraft Ecológico Vintage', bg: 'bg-[#C19A6B]', text: 'text-stone-900' },
  { id: 5, name: 'Terciopelo Rojo Oscuro', bg: 'bg-gradient-to-br from-red-900 to-black', text: 'text-rose-100' },
  { id: 6, name: 'Azul Noche Estrellada', bg: 'bg-gradient-to-br from-slate-900 to-indigo-950', text: 'text-sky-100' },
];

const UPSELL_ITEMS = [
  { id: 'chocolates', name: 'Caja de Chocolates Artesanales', price: 8990, icon: '🍫' },
  { id: 'peluche', name: 'Peluche Premium Oso', price: 12990, icon: '🧸' },
  { id: 'cinta', name: 'Cinta de Seda Personalizada', price: 3990, icon: '🎀' },
];

export default function CreaDedicatoria({ params }: { params: { orderId: string } }) {
  const router = useRouter();
  const [message, setMessage] = useState('');
  const [mediaType, setMediaType] = useState<'none' | 'photo' | 'video'>('none');
  const [isRecording, setIsRecording] = useState(false);
  const [qrGenerated, setQrGenerated] = useState(false);
  const [showMuroPreview, setShowMuroPreview] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  
  // New States
  const [selectedCard, setSelectedCard] = useState(0);
  const [selectedUpsells, setSelectedUpsells] = useState<string[]>([]);
  const [aiGenerating, setAiGenerating] = useState(false);
  const [occasion, setOccasion] = useState('amor');

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const url = URL.createObjectURL(file);
      setSelectedFile(url);
      setMediaType(file.type.startsWith('video/') ? 'video' : 'photo');
    }
  };

  const handleSave = () => {
    setQrGenerated(true);
  };
  
  const toggleUpsell = (id: string) => {
    if (selectedUpsells.includes(id)) {
      setSelectedUpsells(selectedUpsells.filter(item => item !== id));
    } else {
      setSelectedUpsells([...selectedUpsells, id]);
    }
  };

  const generateAIMessage = () => {
    setAiGenerating(true);
    setMessage('');
    
    // Simular latencia de API de IA
    setTimeout(() => {
      const messages: Record<string, string> = {
        'amor': 'Tú eres la flor más hermosa de mi jardín. Cada día a tu lado es un regalo maravilloso. Te amo infinitamente.',
        'cumpleanos': '¡Feliz vuelta al sol! Que este nuevo año de vida esté tan lleno de color y alegría como este arreglo floral.',
        'condolencias': 'En estos momentos difíciles, espero que estas flores lleven un poco de paz a tu corazón. Te acompaño en tu dolor.',
        'agradecimiento': 'No hay suficientes flores en el mundo para agradecerte por todo lo que has hecho. ¡Mil gracias por tu apoyo incondicional!',
      };
      
      setMessage(messages[occasion] || messages['amor']);
      setAiGenerating(false);
    }, 1200);
  };

  if (showMuroPreview) {
    return (
      <MuroExperience 
        message={message} 
        mediaUrl={selectedFile} 
        mediaType={mediaType} 
        occasion={occasion} 
        isPreview={true} 
        onClosePreview={() => setShowMuroPreview(false)} 
      />
    );
  }

  if (qrGenerated) {
    const card = CARD_STYLES[selectedCard];
    return (
      <div className="container mx-auto px-4 py-16 max-w-md text-center">
        <div className="bg-white rounded-3xl p-8 shadow-stitch border border-gray-100 flex flex-col items-center relative">
          <button 
            onClick={() => setQrGenerated(false)}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-full w-8 h-8 flex items-center justify-center transition-colors"
          >
            ✕
          </button>
          <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-3xl mb-4 shadow-sm mt-2">
            ✓
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">¡Experiencia Creada!</h2>
          <p className="text-gray-500 mb-6">
            Hemos configurado tu dedicatoria virtual y los regalos adicionales para el pedido #{params.orderId}.
          </p>
          
          {/* Tarjeta Generada Visualmente */}
          <div className={`w-full h-64 rounded-2xl mb-8 flex flex-col items-center justify-center p-6 shadow-lg border border-black/5 relative overflow-hidden ${card.bg}`}>
            <span className={`text-sm font-serif italic mb-4 opacity-80 ${card.text}`}>Escanea para ver mi mensaje</span>
            <div className="w-32 h-32 bg-white rounded-xl p-2 shadow-md">
               <div className="w-full h-full bg-[url('https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=http://localhost:3000/muro/mock-hash-123')] bg-contain bg-no-repeat bg-center"></div>
            </div>
            <div className="absolute bottom-3 right-4 opacity-30 text-xs font-bold uppercase tracking-wider">Chileflor</div>
          </div>
          
          <div className="flex flex-col gap-3 w-full">
            <button 
              onClick={() => {
                const link = `${window.location.origin}/muro/${params.orderId}`;
                const text = `¡Hola! Acabo de armar mi dedicatoria para el pedido ${params.orderId}. Por favor agreguen la Tarjeta "${card.name}" y los siguientes extras: ${selectedUpsells.length > 0 ? selectedUpsells.join(', ') : 'Ninguno'}.\n\nAquí tienes el enlace para generar el QR e integrarlo en mi tarjeta:\n${link}`;
                window.open(`https://wa.me/56979992848?text=${encodeURIComponent(text)}`, '_blank');
                setTimeout(() => {
                  router.push('/');
                }, 500);
              }}
              className="w-full bg-[#25D366] text-white font-medium py-4 rounded-xl hover:bg-[#128C7E] transition-colors flex items-center justify-center gap-2 shadow-lg shadow-[#25D366]/30"
            >
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
              Enviar enlace al WhatsApp de Chileflor
            </button>
            <button 
              onClick={() => setShowMuroPreview(true)} 
              className="w-full flex items-center justify-center gap-2 border-2 border-primary text-primary font-medium py-3 rounded-xl hover:bg-primary/5 transition-colors"
            >
              <span>👀</span> Simular Vista del Receptor (Muro)
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">Crea una experiencia inolvidable</h1>
      <p className="text-gray-500 mb-8">Personaliza tu arreglo floral con un mensaje inteligente, elige tu tarjeta premium y suma regalos extra.</p>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* Left Column: Form */}
        <div className="md:col-span-2 space-y-6">
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-primary to-orange-400"></div>
            
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-4">
              <label className="block text-lg font-bold text-gray-900">1. Tu Mensaje</label>
              
              {/* Asistente IA */}
              <div className="flex bg-gradient-to-r from-purple-50 to-pink-50 p-1.5 rounded-lg border border-purple-100">
                <select 
                  value={occasion} 
                  onChange={(e) => setOccasion(e.target.value)}
                  className="bg-transparent border-none text-xs text-gray-700 outline-none cursor-pointer px-2"
                >
                  <option value="amor">Amor</option>
                  <option value="cumpleanos">Cumpleaños</option>
                  <option value="condolencias">Condolencias</option>
                  <option value="agradecimiento">Agradecimiento</option>
                </select>
                <button 
                  onClick={generateAIMessage}
                  disabled={aiGenerating}
                  className="bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs font-bold px-3 py-1.5 rounded flex items-center gap-1 hover:opacity-90 transition-opacity disabled:opacity-50"
                >
                  {aiGenerating ? 'Pensando...' : '✨ Inspirar'}
                </button>
              </div>
            </div>
            
            <textarea 
              rows={4} 
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all resize-none font-serif text-lg bg-gray-50/50"
              placeholder="Escribe aquí tu dedicatoria, o usa el asistente de IA..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            ></textarea>

            <div className="mt-6 mb-2">
              <label className="block text-lg font-bold text-gray-900 mb-4">2. Video o Foto Secreta (Opcional)</label>
              
              <input 
                type="file" 
                accept="image/*,video/*" 
                capture="environment"
                className="hidden" 
                ref={fileInputRef} 
                onChange={handleFileSelect} 
              />
              
              {mediaType === 'none' ? (
                <div className="grid grid-cols-2 gap-4">
                  <button onClick={() => fileInputRef.current?.click()} className="flex flex-col items-center justify-center py-6 rounded-2xl border-2 border-dashed border-gray-200 hover:border-primary hover:bg-primary/5 transition-colors text-gray-500 hover:text-primary">
                    <span className="text-2xl mb-1">📸</span><span className="font-medium text-sm">Subir Foto</span>
                  </button>
                  <button onClick={() => fileInputRef.current?.click()} className="flex flex-col items-center justify-center py-6 rounded-2xl border-2 border-dashed border-gray-200 hover:border-primary hover:bg-primary/5 transition-colors text-gray-500 hover:text-primary">
                    <span className="text-2xl mb-1">🎥</span><span className="font-medium text-sm">Grabar Video</span>
                  </button>
                </div>
              ) : (
                <div className="relative rounded-2xl overflow-hidden bg-gray-900 border border-gray-200 aspect-video">
                  {mediaType === 'video' && (
                    <video src={selectedFile || ''} autoPlay controls className="w-full h-full object-contain"></video>
                  )}
                  {mediaType === 'photo' && (
                    <img src={selectedFile || ''} alt="Preview" className="w-full h-full object-contain" />
                  )}
                  <button onClick={() => { setMediaType('none'); setSelectedFile(null); }} className="absolute top-4 right-4 bg-black/50 text-white z-10 rounded-full w-8 h-8 flex items-center justify-center backdrop-blur-sm">✕</button>
                </div>
              )}
            </div>
          </div>
          
          {/* Upsell Section */}
          <div className="bg-primary/5 rounded-3xl p-6 border border-primary/20">
            <h3 className="text-lg font-bold text-gray-900 mb-1">3. Aumenta la experiencia (Opcional)</h3>
            <p className="text-xs text-gray-600 mb-4">Combínalo con regalos adicionales que entregarán nuestros repartidores.</p>
            <div className="space-y-3">
              {UPSELL_ITEMS.map((item) => (
                <label key={item.id} className={`flex items-center justify-between p-3 rounded-xl cursor-pointer transition-all border ${selectedUpsells.includes(item.id) ? 'bg-white border-primary shadow-sm' : 'bg-white/50 border-gray-200 hover:bg-white'}`}>
                  <div className="flex items-center gap-3">
                    <input 
                      type="checkbox" 
                      className="w-5 h-5 text-primary rounded-md border-gray-300"
                      checked={selectedUpsells.includes(item.id)}
                      onChange={() => toggleUpsell(item.id)}
                    />
                    <span className="text-xl">{item.icon}</span>
                    <span className="font-medium text-gray-900 text-sm">{item.name}</span>
                  </div>
                  <span className="font-bold text-primary">+${item.price.toLocaleString('es-CL')}</span>
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Cards */}
        <div className="md:col-span-1">
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 sticky top-24">
            <h3 className="text-lg font-bold text-gray-900 mb-4">4. Diseño de Tarjeta Física</h3>
            <p className="text-xs text-gray-500 mb-4">El QR se imprimirá en alta resolución en este estilo de tarjeta.</p>
            
            <div className="space-y-3 max-h-[300px] md:max-h-[500px] overflow-y-auto pr-2 pb-4 snap-y custom-scrollbar">
              {CARD_STYLES.map((card, index) => (
                <div 
                  key={card.id}
                  onClick={() => setSelectedCard(index)}
                  className={`relative snap-center cursor-pointer transition-all duration-300 border-2 rounded-xl overflow-hidden h-32 flex flex-col justify-end p-3 ${selectedCard === index ? 'border-primary ring-4 ring-primary/20 scale-[1.02]' : 'border-transparent hover:border-gray-200'} ${card.bg}`}
                >
                  <div className={`text-xs font-bold w-3/4 leading-tight ${card.text}`}>{card.name}</div>
                  
                  {/* Fake QR preview */}
                  <div className="absolute top-3 right-3 w-10 h-10 bg-white/80 rounded-md p-1 shadow-sm backdrop-blur-sm">
                    <div className="w-full h-full border border-dashed border-gray-400"></div>
                  </div>
                  
                  {selectedCard === index && (
                    <div className="absolute top-3 left-3 bg-primary text-white rounded-full p-0.5">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>
                    </div>
                  )}
                </div>
              ))}
            </div>

            <button 
              onClick={handleSave}
              className="w-full mt-6 bg-gray-900 text-white font-medium py-4 rounded-xl hover:bg-black transition-colors shadow-lg"
            >
              Guardar y Finalizar
            </button>
          </div>
        </div>

      </div>
      
      <style dangerouslySetInnerHTML={{__html: `
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #E5E7EB; border-radius: 4px; }
      `}} />
    </div>
  );
}
