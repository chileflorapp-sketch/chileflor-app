import { supabase } from '@/lib/supabase';
import { notFound } from 'next/navigation';
import InteractionClient from './InteractionClient';

export const revalidate = 0; // Disable caching for this route

export default async function TarjetaPage({ params }: { params: { id: string } }) {
  const { id } = params;

  // 1. Fetch card data
  const { data: tarjeta, error } = await supabase
    .from('tarjetas')
    .select('*')
    .eq('id', id)
    .single();

  if (error || !tarjeta) {
    notFound();
  }

  // 2. Check 48h expiration
  const createdAt = new Date(tarjeta.created_at);
  const now = new Date();
  const diffHours = (now.getTime() - createdAt.getTime()) / (1000 * 60 * 60);

  if (diffHours > 48) {
    return (
      <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center p-4 text-center">
        <div className="w-20 h-20 bg-gray-800 rounded-full flex items-center justify-center mb-6 shadow-xl shadow-black/50">
          <span className="text-4xl opacity-50">💨</span>
        </div>
        <h1 className="text-3xl font-black text-white mb-3">La magia se desvaneció</h1>
        <p className="text-gray-400 max-w-sm">
          Esta sorpresa fue programada para autodestruirse después de 48 horas. ¡Esperamos que la hayas disfrutado!
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F9FAFB] flex flex-col items-center py-12 px-4 relative overflow-hidden">
      {/* Dynamic background effect */}
      <div className="absolute inset-0 bg-gradient-to-b from-primary/10 to-transparent pointer-events-none"></div>

      <div className="max-w-md w-full relative z-10 flex flex-col items-center">
        
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white text-primary rounded-full text-xs font-bold shadow-sm tracking-widest uppercase mb-4">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
            Sorpresa Digital
          </div>
          <h1 className="text-4xl font-black text-gray-900 tracking-tight leading-none mb-3">
            Alguien pensó en ti
          </h1>
        </div>

        {/* The Card */}
        <div className="w-full relative group">
          <div className="absolute inset-0 bg-primary/20 blur-3xl rounded-full scale-90 group-hover:scale-100 transition-transform duration-700 opacity-50"></div>
          <img 
            src={tarjeta.image_url} 
            alt="Tu sorpresa" 
            className="w-full h-auto rounded-2xl shadow-2xl relative z-10 border border-white/50"
          />
        </div>

        {/* Interactive Button Component */}
        <div className="w-full mt-12">
          <InteractionClient 
            id={tarjeta.id} 
            initialAgradecido={tarjeta.agradecimiento} 
          />
        </div>

      </div>
    </div>
  );
}
