'use client';
import { useState, useRef } from 'react';
import confetti from 'canvas-confetti';

interface MuroExperienceProps {
  message: string;
  mediaUrl: string | null;
  mediaType: 'none' | 'photo' | 'video';
  occasion: string;
  isPreview?: boolean;
  onClosePreview?: () => void;
}

export default function MuroExperience({
  message,
  mediaUrl,
  mediaType,
  occasion,
  isPreview = false,
  onClosePreview
}: MuroExperienceProps) {
  const [thanked, setThanked] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Determinar estilos según la ocasión
  const getThemeStyles = () => {
    switch (occasion) {
      case 'amor':
        return {
          bgClass: 'bg-gradient-to-b from-rose-50 to-white',
          accentColor: '#FF2651',
          accentClass: 'text-[#FF2651]',
          bgAccentClass: 'bg-[#FF2651]',
          hoverBgClass: 'hover:bg-[#E01E42]',
          shadowClass: 'shadow-[#FF2651]/30',
          title: 'Para mi Amor',
          fontClass: 'font-serif',
          cardBg: 'bg-white/80',
          decorClass: 'bg-rose-100 rounded-b-[100px]',
          icon: '❤️'
        };
      case 'cumpleanos':
        return {
          bgClass: 'bg-gradient-to-b from-yellow-50 via-orange-50 to-white',
          accentColor: '#F59E0B', // Ambar
          accentClass: 'text-amber-500',
          bgAccentClass: 'bg-amber-500',
          hoverBgClass: 'hover:bg-amber-600',
          shadowClass: 'shadow-amber-500/30',
          title: '¡Feliz Cumpleaños!',
          fontClass: 'font-sans font-bold',
          cardBg: 'bg-white/90 border-amber-100',
          decorClass: 'bg-gradient-to-r from-yellow-200 to-amber-200 rounded-b-[80px]',
          icon: '🎉'
        };
      case 'condolencias':
        return {
          bgClass: 'bg-gradient-to-b from-stone-50 to-white',
          accentColor: '#57534E', // Stone 600
          accentClass: 'text-stone-600',
          bgAccentClass: 'bg-stone-600',
          hoverBgClass: 'hover:bg-stone-700',
          shadowClass: 'shadow-stone-600/20',
          title: 'En Memoria',
          fontClass: 'font-serif tracking-wide',
          cardBg: 'bg-white border-stone-100',
          decorClass: 'bg-stone-100 rounded-none border-b border-stone-200',
          icon: '🕊️'
        };
      case 'agradecimiento':
      default:
        return {
          bgClass: 'bg-gradient-to-b from-emerald-50 to-white',
          accentColor: '#10B981', // Emerald 500
          accentClass: 'text-emerald-500',
          bgAccentClass: 'bg-emerald-500',
          hoverBgClass: 'hover:bg-emerald-600',
          shadowClass: 'shadow-emerald-500/30',
          title: 'Con Gratitud',
          fontClass: 'font-sans',
          cardBg: 'bg-white/80',
          decorClass: 'bg-emerald-100 rounded-b-[100px]',
          icon: '✨'
        };
    }
  };

  const theme = getThemeStyles();

  const handleThankYou = () => {
    if (thanked) return;
    
    // Solo disparar confeti si no es condolencias
    if (occasion !== 'condolencias') {
      confetti({
        particleCount: occasion === 'cumpleanos' ? 150 : 100,
        spread: occasion === 'cumpleanos' ? 90 : 70,
        origin: { y: 0.6 },
        colors: occasion === 'amor' ? ['#FF2651', '#FF5C7A', '#FFFFFF'] : undefined
      });
    }
    
    setThanked(true);
    
    if (isPreview) {
      // En modo previsualización no enviamos a WhatsApp real
      return;
    }
    
    // Redirigir a WhatsApp
    setTimeout(() => {
      const whatsappText = encodeURIComponent("¡Acabo de recibir las flores! 🌸 Están hermosas, muchísimas gracias por el detalle tan especial. ¡Me encantó!");
      window.open(`https://wa.me/?text=${whatsappText}`, '_blank');
    }, 1500);
  };

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  return (
    <div className={`min-h-screen ${theme.bgClass} flex flex-col items-center py-12 px-4 relative overflow-hidden ${isPreview ? 'fixed inset-0 z-[9999] overflow-y-auto' : ''}`}>
      
      {/* Elementos decorativos de fondo */}
      <div className={`absolute top-0 left-0 w-full h-64 -z-10 transition-all duration-700 ${theme.decorClass}`}></div>
      
      {isPreview && onClosePreview && (
        <button 
          onClick={onClosePreview}
          className="absolute top-6 right-6 bg-white/50 backdrop-blur-md hover:bg-white text-gray-800 rounded-full w-12 h-12 flex items-center justify-center text-xl shadow-lg transition-all z-50 border border-gray-200"
          aria-label="Cerrar previsualización"
        >
          ✕
        </button>
      )}

      {isPreview && (
        <div className="bg-black/80 text-white text-xs font-bold uppercase tracking-widest px-4 py-1.5 rounded-full mb-6 mt-[-10px] z-10 relative">
          Modo Previsualización
        </div>
      )}

      <div className="text-center mb-8 relative z-10">
        <h1 className={`text-xl font-medium ${theme.accentClass} tracking-widest uppercase mb-2`}>{theme.title}</h1>
        <div className={`w-16 h-1 ${theme.bgAccentClass} opacity-50 mx-auto rounded-full`}></div>
      </div>

      <div className={`w-full max-w-lg ${theme.cardBg} backdrop-blur-md rounded-3xl p-8 shadow-2xl border border-white/50 relative transition-all duration-500 z-10`}>
        
        {/* Contenido Multimedia */}
        {mediaType !== 'none' && mediaUrl && (
          <div 
            className={`w-full aspect-[4/5] bg-black rounded-2xl mb-8 overflow-hidden relative shadow-inner group ${mediaType === 'video' ? 'cursor-pointer' : ''}`} 
            onClick={mediaType === 'video' ? togglePlay : undefined}
          >
            {mediaType === 'video' ? (
              <>
                <video 
                  ref={videoRef}
                  className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ${isPlaying ? 'opacity-100' : 'opacity-80'}`}
                  src={mediaUrl}
                  playsInline
                  loop
                  onEnded={() => setIsPlaying(false)}
                />
                <div className={`absolute inset-0 flex items-center justify-center transition-all duration-300 bg-black/20 ${isPlaying ? 'opacity-0 group-hover:opacity-100' : 'opacity-100'}`}>
                   <button 
                      className="w-16 h-16 bg-white/30 backdrop-blur-md rounded-full flex items-center justify-center hover:bg-white/40 transition-transform transform hover:scale-110 shadow-[0_0_20px_rgba(255,255,255,0.3)]"
                   >
                     <span className="text-white text-2xl">
                       {isPlaying ? '⏸' : '▶'}
                     </span>
                   </button>
                </div>
              </>
            ) : (
              <img src={mediaUrl} alt="Foto adjunta" className="absolute inset-0 w-full h-full object-cover" />
            )}
            
            <div className={`absolute bottom-0 left-0 w-full bg-gradient-to-t from-black/80 to-transparent p-4 transition-opacity duration-300 ${mediaType === 'video' && isPlaying ? 'opacity-0 group-hover:opacity-100' : 'opacity-100'}`}>
              <p className="text-white/90 text-sm font-medium tracking-wide">
                {mediaType === 'video' ? 'Mensaje de Video' : 'Un recuerdo especial'}
              </p>
            </div>
          </div>
        )}

        {/* Mensaje */}
        <div className="text-center mb-10 px-2 sm:px-4">
          <p className={`${theme.fontClass} text-xl sm:text-2xl text-gray-800 leading-relaxed whitespace-pre-wrap`}>
            {message || "Espero que estas flores iluminen tu día tanto como tú iluminas el mío."}
          </p>
        </div>

        {/* Botón de agradecer */}
        <div className="flex flex-col items-center">
          <button 
            onClick={handleThankYou}
            className={`w-20 h-20 rounded-full flex items-center justify-center transition-all duration-500 ${thanked ? 'bg-green-500 scale-110 shadow-lg shadow-green-500/30' : `${theme.bgAccentClass} ${theme.hoverBgClass} hover:scale-105 shadow-xl ${theme.shadowClass}`}`}
          >
            <span className="text-white text-3xl">{thanked ? '✓' : theme.icon}</span>
          </button>
          <p className={`mt-4 font-medium transition-colors duration-300 ${thanked ? 'text-green-600' : theme.accentClass}`}>
            {thanked ? '¡Agradecimiento enviado!' : 'Haz clic para agradecer'}
          </p>
        </div>
      </div>
      
      <div className={`mt-12 opacity-50 text-sm font-medium tracking-widest ${theme.accentClass} relative z-10`}>
        CHILEFLOR
      </div>
    </div>
  );
}
