'use client';
import { useState, useRef, useEffect } from 'react';
import { toJpeg } from 'html-to-image';

const GALLERY_IMAGES = [
  '/imagenes/02917bc90c25810edc8f13fd243ab2d8.jpg',
  '/imagenes/03ba3f922190415e696d26ad05d489d5.jpg',
  '/imagenes/07e5d98f7486cfc4fa0b216784c5d4cd.jpg',
  '/imagenes/09df8fa7537b4e945114c0abd4f95853.jpg',
  '/imagenes/0b1024329b0a5d7d4d9c059f22131055.jpg',
  '/imagenes/12739bce25e346ba6365cdb0cd4b93fc.jpg',
  '/imagenes/146f7d44ce8333d9cb73cdb689e117dc.jpg',
  '/imagenes/236830817_1784651057830181.jpg',
  '/imagenes/25af8fc119b81dda5ae4c219308d27f5.jpg',
  '/imagenes/26fde7f9948d3a336451dd1c6e986b10.jpg',
  '/imagenes/27d48bb20e5f7d8fa893bb84e899365e.jpg',
  '/imagenes/2a32010274805e14eb2857d9d9b96289.jpg',
  '/imagenes/2e08bee2c0e1a6923f1e58775ed9b17b.jpg',
  '/imagenes/327ddeb70aa28907bce7356387711325.jpg',
  '/imagenes/348ac78c79a0f806ded8c0e21034cc6d.jpg',
  '/imagenes/41761660b9070137c94c525dc0965660.jpg',
  '/imagenes/428025119_1784651233046249.jpg',
  '/imagenes/46a27662e25fc62f5651e32d68c80cb5.jpg',
  '/imagenes/4fabff262ca1133f1dfff21412d12a29.jpg',
  '/imagenes/50339ba4ec6e5a44474a457f58521d28.jpg',
  '/imagenes/50b2a444fe8c1aeaaaf2f19270cf0b6e.jpg',
  '/imagenes/520e4074e7713ad0aed31129f8a382e1.jpg',
  '/imagenes/52e67228eb04cf1ee2aa76a4c571d0d1.jpg',
  '/imagenes/5424efc448cf1674edb43347049d60b8.jpg',
  '/imagenes/5e8d53e867dd262926377a542536af3b.jpg',
  '/imagenes/61b40c5b7d2aeea3938abe8f99adfb0c.jpg',
  '/imagenes/65693fbc80de16aea730a8f8a49699e7.jpg',
  '/imagenes/683fd763595fb9b931e8ec45ccb1a3a6.jpg',
  '/imagenes/6d693a509eb6822580ea26dc310b4779.jpg',
  '/imagenes/6eb235f67af6c10a375df679b02a084d.jpg',
  '/imagenes/776b6ef733bc0db718fe9025dbcc242a.jpg',
  '/imagenes/84277f752eb58fc14dadf4cb2e5b681d.jpg',
  '/imagenes/8599fef40abaafd0402db0fbe8655d3e.jpg',
  '/imagenes/92c1d4a54ba5103c7da26be2c4949544.jpg',
  '/imagenes/a7f10d1266195bb44cec688407096633.jpg',
  '/imagenes/a822130420c9a8c3cbeb9d0bdbd85745.jpg',
  '/imagenes/a8439e78497d60484a35de3123df7e20.jpg',
  '/imagenes/aa0c812e97208e1074e9a01e135ebe6c.jpg',
  '/imagenes/be1acbda19c55ac5ce6394b6861af707.jpg',
  '/imagenes/c2709bd1595201a571b43611c7cea7f2.jpg',
  '/imagenes/c34a3a11baf00d189e98102a3c3cbfa3.jpg',
  '/imagenes/c3f0b844d246626b9def5377e69f8e00.jpg',
  '/imagenes/c490f72345975d375970ef1bb878a1c6.jpg',
  '/imagenes/cae80c20b5b2814cdcfd15a47cdafd63.jpg',
  '/imagenes/ce13461d498da623b6b1b2639f548dfa.jpg',
  '/imagenes/d3d832907aaf8553c72c61243e7d5a8b.jpg',
  '/imagenes/dfe9a2869bfac1e48e22fed046f6264d.jpg',
  '/imagenes/e3b2f470e1252c933ddd9efc9807fd70.jpg',
  '/imagenes/e7e256a2dbecd0f5227f356cb24b9668.jpg',
  '/imagenes/f12c5a33a13428e6e5ceab3fc15fb8e9.jpg',
  '/imagenes/f7b3331cc1207a275d89478bf78f8408.jpg',
  '/imagenes/fd7c3a62b5cd7b65d2bdc6fade8aece6.jpg'
];

const UPSELL_ITEMS = [
  { id: 'chocolates', name: 'Ferrero Rocher', price: 8990, icon: '🍫', color: 'bg-amber-100 text-amber-800 border-amber-200' },
  { id: 'peluche', name: 'Oso Premium', price: 12990, icon: '🧸', color: 'bg-orange-100 text-orange-800 border-orange-200' },
  { id: 'cinta', name: 'Cinta Personalizada', price: 3990, icon: '🎀', color: 'bg-pink-100 text-pink-800 border-pink-200' },
];

const AI_PROMPTS = [
  { id: 'amor', label: 'Amor ❤️', text: 'Tú eres la flor más hermosa de mi jardín. Cada día a tu lado es un regalo maravilloso. Te amo infinitamente.' },
  { id: 'cumple', label: 'Cumpleaños 🎂', text: '¡Feliz vuelta al sol! Que este nuevo año de vida esté tan lleno de color y alegría como este arreglo floral.' },
  { id: 'gracias', label: 'Gracias 🙏', text: 'No hay suficientes flores en el mundo para agradecerte por todo lo que has hecho. ¡Mil gracias por tu apoyo!' },
  { id: 'corto', label: 'Corto ⚡', text: 'Pensando en ti hoy y siempre. Con cariño.' },
];

interface Props {
  orderId: string;
}

export default function DedicatoriaClient({ orderId }: Props) {
  const [message, setMessage] = useState('');
  const [step, setStep] = useState<'editor' | 'saving' | 'success' | 'error'>('editor');
  const [cardImage, setCardImage] = useState<string | null>(null);
  const [tarjetaId, setTarjetaId] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState('');
  
  const [selectedCard, setSelectedCard] = useState(0);
  const [selectedUpsells, setSelectedUpsells] = useState<string[]>([]);
  const [aiGenerating, setAiGenerating] = useState(false);
  const [activeBlobUrl, setActiveBlobUrl] = useState('');

  // Fetch the active image as a blob to prevent Safari cross-origin black screen bug
  useEffect(() => {
    fetch(GALLERY_IMAGES[selectedCard])
      .then(res => res.blob())
      .then(blob => {
        const url = URL.createObjectURL(blob);
        setActiveBlobUrl(url);
      })
      .catch(err => console.error('Error preloading image blob:', err));
  }, [selectedCard]);

  // Auto-ajustar la altura del textarea
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px';
    }
  }, [message]);

  const handleSave = async () => {
    if (!message.trim()) {
      setErrorMessage('Por favor escribe un mensaje para la dedicatoria.');
      return;
    }

    setStep('saving');
    setErrorMessage('');

    const cardEl = document.getElementById('tarjeta-preview');
    if (!cardEl) {
      setStep('error');
      setErrorMessage('No se pudo encontrar el preview de la tarjeta.');
      return;
    }

    try {
      // 1. Capturar la tarjeta como imagen
      const dataUrl = await toJpeg(cardEl, { 
        quality: 0.95,
        pixelRatio: 2,
        style: {
          transform: 'scale(1)',
          transformOrigin: 'top left',
        }
      });
      setCardImage(dataUrl);

      // 2. Subir al servidor
      const res = await fetch('/api/tarjeta/upload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          image: dataUrl, 
          message: message,
          orderId: orderId 
        })
      });
      
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || 'Error del servidor');
      }

      const data = await res.json();
      setTarjetaId(data.id);
      setStep('success');
      window.scrollTo(0, 0);

    } catch (err: any) {
      console.error('Error creando tarjeta:', err);
      setStep('error');
      setErrorMessage(err.message || 'Error al crear la tarjeta. Intenta de nuevo.');
    }
  };
  
  const toggleUpsell = (id: string) => {
    if (selectedUpsells.includes(id)) {
      setSelectedUpsells(selectedUpsells.filter(item => item !== id));
    } else {
      setSelectedUpsells([...selectedUpsells, id]);
    }
  };

  const applyAIPrompt = (text: string) => {
    setAiGenerating(true);
    setMessage('');
    setTimeout(() => {
      let currentText = '';
      const textArray = text.split('');
      const interval = setInterval(() => {
        if (textArray.length > 0) {
          currentText += textArray.shift();
          setMessage(currentText);
        } else {
          clearInterval(interval);
          setAiGenerating(false);
        }
      }, 20);
    }, 300);
  };

  // ==================== PANTALLA DE ÉXITO ====================
  if (step === 'success' && tarjetaId) {
    const linkMagico = `${window.location.origin}/t/${tarjetaId}`;
    const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(linkMagico)}&bgcolor=ffffff&color=000000&margin=1`;

    const shareToWhatsApp = () => {
      const text = `✨ ¡Alguien muy especial te preparó una sorpresa increíble!\n\nÁbrela aquí antes de que desaparezca:\n${linkMagico}`;
      
      if (navigator.share) {
        navigator.share({
          title: 'Sorpresa de Chileflor',
          text: text,
          url: linkMagico
        }).catch(console.error);
      } else {
        window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`, '_blank');
      }
    };

    const copyLink = async () => {
      try {
        await navigator.clipboard.writeText(linkMagico);
        alert('¡Link copiado al portapapeles!');
      } catch {
        // Fallback for older browsers
        prompt('Copia este link:', linkMagico);
      }
    };

    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-3xl p-8 border border-gray-100 shadow-2xl flex flex-col items-center text-center">
          <div className="w-16 h-16 bg-green-50 text-green-500 rounded-full flex items-center justify-center mb-6">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
          </div>
          <h2 className="text-3xl font-black mb-2 tracking-tight text-gray-900">¡Tarjeta Creada!</h2>
          <p className="text-gray-500 mb-6">Pedido #{orderId}</p>
          
          {cardImage && (
            <div className="mb-6 w-48 rounded-xl overflow-hidden shadow-2xl ring-4 ring-gray-100 transform -rotate-2">
              <img src={cardImage} alt="Tarjeta final" className="w-full h-auto object-cover" />
            </div>
          )}

          {/* QR Code real */}
          <div className="mb-6 p-4 bg-gray-50 rounded-2xl border border-gray-100">
            <img src={qrUrl} alt="QR Code" className="w-36 h-36 mx-auto mb-3" />
            <p className="text-xs text-gray-400 font-medium">Escanea o comparte el link</p>
          </div>

          {/* Info de expiración */}
          <div className="mb-6 bg-amber-50 border border-amber-200 rounded-xl p-3 w-full">
            <p className="text-xs text-amber-700 font-medium">⏳ Esta tarjeta se autodestruye en 72 horas si no recibe agradecimiento, o 72 horas después de recibirlo.</p>
          </div>
          
          <button 
            onClick={shareToWhatsApp}
            className="w-full bg-[#25D366] text-white font-bold py-4 rounded-xl hover:bg-[#128C7E] transition-all flex items-center justify-center gap-2 active:scale-95 shadow-lg shadow-[#25D366]/20"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
            Compartir por WhatsApp
          </button>

          <button 
            onClick={copyLink}
            className="w-full mt-3 bg-gray-900 text-white font-bold py-4 rounded-xl hover:bg-gray-800 transition-all flex items-center justify-center gap-2 active:scale-95"
          >
            📋 Copiar Link
          </button>
          
          <button 
            onClick={() => { setStep('editor'); setTarjetaId(null); setCardImage(null); }} 
            className="w-full mt-3 bg-transparent text-gray-500 font-bold py-4 rounded-xl hover:bg-gray-50 transition-all active:scale-95"
          >
            Crear otra tarjeta
          </button>
        </div>
      </div>
    );
  }

  // ==================== PANTALLA DE ERROR ====================
  if (step === 'error') {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-3xl p-8 border border-red-100 shadow-2xl flex flex-col items-center text-center">
          <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mb-6">
            <span className="text-3xl">⚠️</span>
          </div>
          <h2 className="text-2xl font-black mb-2 tracking-tight text-gray-900">Algo salió mal</h2>
          <p className="text-gray-500 mb-6">{errorMessage || 'No se pudo crear la tarjeta.'}</p>
          
          <button 
            onClick={() => setStep('editor')} 
            className="w-full bg-gray-900 text-white font-bold py-4 rounded-xl hover:bg-gray-800 transition-all active:scale-95"
          >
            Volver a intentar
          </button>
        </div>
      </div>
    );
  }

  // ==================== PANTALLA DE GUARDANDO ====================
  if (step === 'saving') {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center p-4">
        <div className="max-w-md w-full flex flex-col items-center text-center">
          <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mb-6 animate-pulse">
            <span className="text-4xl">✨</span>
          </div>
          <h2 className="text-2xl font-black mb-2 tracking-tight text-gray-900">Creando tu experiencia...</h2>
          <p className="text-gray-500">Estamos generando la tarjeta y el link mágico.</p>
          <div className="mt-8 w-48 h-1 bg-gray-200 rounded-full overflow-hidden">
            <div className="h-full bg-primary rounded-full animate-[loading_2s_ease-in-out_infinite]" style={{ width: '60%' }}></div>
          </div>
        </div>
        <style dangerouslySetInnerHTML={{__html: `
          @keyframes loading {
            0% { width: 0%; }
            50% { width: 80%; }
            100% { width: 100%; }
          }
        `}} />
      </div>
    );
  }

  // ==================== EDITOR PRINCIPAL ====================
  const activeCardBg = GALLERY_IMAGES[selectedCard];

  return (
    <div className="bg-[#F9FAFB] flex flex-col min-h-screen">
      <div className="flex flex-col md:flex-row relative">
        
        {/* ----------------- COLUMN 1: EDITOR (Left) ----------------- */}
        <div className="w-full md:w-1/2 lg:w-7/12 p-4 md:p-8 lg:p-12 pb-12">
          <div className="max-w-2xl mx-auto">
          
          <div className="mb-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-black text-white rounded-full text-xs font-bold mb-4 shadow-sm uppercase tracking-widest">
              Creator Studio
            </div>
            <h1 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tight leading-none mb-3">
              Diseña tu <span className="text-primary">Experiencia</span>
            </h1>
            <p className="text-gray-500 text-lg">Personaliza cada detalle para sorprender a esa persona especial.</p>
          </div>

          {/* Error inline */}
          {errorMessage && (
            <div className="mb-6 bg-red-50 border border-red-200 rounded-xl p-4 text-red-700 text-sm font-medium flex items-center gap-2">
              <span>⚠️</span> {errorMessage}
            </div>
          )}

          <div className="space-y-12">
            
            {/* Seccion 1: Diseño de Tarjeta */}
            <section>
              <div className="flex items-center gap-2 mb-4">
                <span className="w-6 h-6 rounded-full bg-gray-200 text-gray-700 flex items-center justify-center text-xs font-bold">1</span>
                <h2 className="text-xl font-bold text-gray-900">Elige tu Diseño Visual</h2>
              </div>
              
              <div className="flex gap-4 overflow-x-auto pb-4 snap-x custom-scrollbar-x">
                {GALLERY_IMAGES.map((imgUrl, index) => (
                  <div 
                    key={index}
                    onClick={() => setSelectedCard(index)}
                    className={`shrink-0 snap-start w-32 h-40 rounded-2xl cursor-pointer transition-all duration-300 relative group overflow-hidden ${selectedCard === index ? 'ring-4 ring-primary ring-offset-2 scale-100 shadow-xl' : 'hover:scale-105 opacity-80 hover:opacity-100 shadow-md'}`}
                  >
                    <img src={imgUrl} alt="Diseño de tarjeta" className="w-full h-full object-cover" />
                    {selectedCard === index && (
                      <div className="absolute top-2 right-2 bg-primary text-white rounded-full p-0.5 shadow-sm z-10">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>
                      </div>
                    )}
                    <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/50 to-transparent pointer-events-none"></div>
                  </div>
                ))}
              </div>
            </section>

            {/* Seccion 2: Mensaje e IA */}
            <section>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-gray-200 text-gray-700 flex items-center justify-center text-xs font-bold">2</span>
                  <h2 className="text-xl font-bold text-gray-900">El Mensaje</h2>
                </div>
              </div>

              {/* IA Chips */}
              <div className="flex flex-wrap gap-2 mb-4">
                {AI_PROMPTS.map(prompt => (
                  <button 
                    key={prompt.id}
                    onClick={() => applyAIPrompt(prompt.text)}
                    disabled={aiGenerating}
                    className="px-4 py-2 bg-white border border-gray-200 rounded-full text-sm font-bold text-gray-600 hover:border-primary hover:text-primary transition-all active:scale-95 shadow-sm disabled:opacity-50"
                  >
                    {prompt.label}
                  </button>
                ))}
              </div>

              <div className="relative group">
                <textarea 
                  ref={textareaRef}
                  className="w-full min-h-[150px] p-6 bg-white border border-gray-200 rounded-3xl shadow-sm focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all resize-none font-serif text-xl leading-relaxed text-gray-800 placeholder:text-gray-300"
                  placeholder="Escribe algo hermoso aquí..."
                  value={message}
                  onChange={(e) => { setMessage(e.target.value); setErrorMessage(''); }}
                ></textarea>
                <div className="absolute bottom-4 right-4 text-xs font-bold text-gray-300">
                  {message.length} caracteres
                </div>
              </div>
            </section>

        </div>
      </div>
    </div>

      {/* ----------------- COLUMN 2: LIVE PREVIEW (Right) ----------------- */}
      <div className="w-full md:w-1/2 lg:w-5/12 bg-gray-100 md:bg-gray-200/50 relative border-l border-gray-200 p-4 md:p-8 flex flex-col justify-between h-auto md:h-screen sticky top-0">
        
        {/* Floating View Toggle */}
        <div className="flex justify-between items-center mb-6 z-10 relative">
          <div className="bg-white px-4 py-2 rounded-full font-bold text-sm text-gray-500 shadow-sm border border-gray-100 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
            Live Preview
          </div>
        </div>

        {/* MOCKUP CARD */}
        <div className="flex-grow flex items-center justify-center relative w-full h-[50vh] md:h-auto">
          {/* Decorative floating items based on upsells */}
          {selectedUpsells.map((id, index) => {
            const item = UPSELL_ITEMS.find(u => u.id === id);
            return (
              <div key={id} className={`absolute text-4xl animate-bounce drop-shadow-xl z-20 transition-all duration-500`} style={{
                top: `${20 + (index * 15)}%`,
                [index % 2 === 0 ? 'left' : 'right']: '10%',
                animationDelay: `${index * 0.2}s`
              }}>
                {item?.icon}
              </div>
            )
          })}

          {/* The Physical Card */}
          <div id="tarjeta-preview" className="w-[280px] sm:w-[320px] aspect-[3/4] rounded-2xl flex flex-col justify-between p-6 relative overflow-hidden transition-all duration-700 shadow-2xl group border border-white/20 bg-white">
            {/* Background Image */}
            <div 
              className="absolute inset-0 z-0 bg-cover bg-center" 
              style={{ backgroundImage: `url('${activeBlobUrl}')` }}
            ></div>
            
            {/* Overlay for text readability */}
            <div className="absolute inset-0 bg-black/40 z-0 pointer-events-none group-hover:bg-black/50 transition-colors"></div>
            
            {/* Top Logo */}
            <div className="text-center font-black tracking-[0.2em] uppercase text-xs text-white opacity-80 z-10">
              Chileflor
            </div>

            {/* Live Text Area */}
            <div className="flex-grow flex flex-col justify-center items-center py-4 z-10">
              {message ? (
                <p className={`font-serif text-center leading-relaxed text-sm overflow-hidden text-ellipsis line-clamp-6 text-white drop-shadow-md ${aiGenerating ? 'animate-pulse' : ''}`}>
                  {message}
                </p>
              ) : (
                <p className="font-serif text-center text-sm opacity-70 italic text-white/80">
                  Tu dedicatoria aparecerá aquí...
                </p>
              )}
            </div>

            {/* QR Placeholder (will be replaced by real QR in success screen) */}
            <div className="flex flex-col items-center gap-2 mt-auto z-10">
              <div className="w-16 h-16 bg-white/90 rounded-xl flex items-center justify-center shadow-xl ring-2 ring-white/50">
                <span className="text-2xl">📱</span>
              </div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-white opacity-90">Escanea para magia</span>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <div className="mt-6 md:mt-0 relative z-20">
          <button 
            onClick={handleSave}
            disabled={aiGenerating}
            className="w-full bg-primary text-white font-black text-xl py-5 rounded-2xl shadow-xl shadow-primary/30 hover:bg-primary-dark transition-all active:scale-[0.98] flex items-center justify-center gap-2 group disabled:opacity-70 disabled:cursor-wait"
          >
            <span>Generar Experiencia</span>
            <svg className="w-6 h-6 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
          </button>
        </div>

      </div>
      </div>
      
      {/* ----------------- FULL WIDTH BOTTOM SECTION ----------------- */}
      <section className="w-full bg-white border-t border-gray-200 p-8 md:p-12 lg:p-16">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center justify-center mb-8">
            <div className="flex items-center gap-3">
              <span className="w-8 h-8 rounded-full bg-gray-900 text-white flex items-center justify-center text-sm font-bold shadow-md">3</span>
              <h2 className="text-3xl font-black text-gray-900">Complementos <span className="text-lg font-medium text-gray-400 ml-2">Opcional</span></h2>
            </div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {UPSELL_ITEMS.map((item) => (
              <label key={item.id} className={`flex flex-col p-6 rounded-3xl cursor-pointer transition-all border-2 ${selectedUpsells.includes(item.id) ? 'bg-primary/5 border-primary shadow-lg scale-105' : 'bg-gray-50 border-transparent hover:bg-white hover:shadow-md'}`}>
                <div className="flex justify-between items-start mb-4">
                  <div className={`w-16 h-16 rounded-full flex items-center justify-center text-3xl shadow-sm ${item.color}`}>
                    {item.icon}
                  </div>
                  <input 
                    type="checkbox" 
                    className="w-6 h-6 text-primary rounded-md focus:ring-0 border-gray-300 cursor-pointer"
                    checked={selectedUpsells.includes(item.id)}
                    onChange={() => toggleUpsell(item.id)}
                  />
                </div>
                <span className="font-bold text-gray-900 text-xl leading-tight mt-2">{item.name}</span>
                <span className="font-black text-primary text-lg mt-2">+${item.price.toLocaleString('es-CL')}</span>
              </label>
            ))}
          </div>
        </div>
      </section>

      <style dangerouslySetInnerHTML={{__html: `
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #E5E7EB; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #D1D5DB; }
        
        .custom-scrollbar-x::-webkit-scrollbar { height: 8px; }
        .custom-scrollbar-x::-webkit-scrollbar-track { background: #F3F4F6; border-radius: 10px; }
        .custom-scrollbar-x::-webkit-scrollbar-thumb { background: #CBD5E1; border-radius: 10px; }
        .custom-scrollbar-x::-webkit-scrollbar-thumb:hover { background: #94A3B8; }
        
        .no-scrollbar::-webkit-scrollbar { display: none; }
      `}} />
    </div>
  );
}
