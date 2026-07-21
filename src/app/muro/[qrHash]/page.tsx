'use client';
import MuroExperience from '@/components/MuroExperience';

export default function MuroDedicatoria({ params }: { params: { qrHash: string } }) {
  // En un flujo real, aquí haríamos un fetch a Supabase usando el qrHash 
  // para obtener el mensaje, el mediaUrl, mediaType y la ocasión.
  // Por ahora, usamos datos de demostración para mantener la vista funcional.
  
  const mockData = {
    message: "Para la persona más especial en mi vida. Espero que estas flores iluminen tu día tanto como tú iluminas el mío. Feliz aniversario.",
    mediaUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
    mediaType: "video" as const,
    occasion: "amor"
  };

  return (
    <MuroExperience 
      message={mockData.message}
      mediaUrl={mockData.mediaUrl}
      mediaType={mockData.mediaType}
      occasion={mockData.occasion}
      isPreview={false}
    />
  );
}
