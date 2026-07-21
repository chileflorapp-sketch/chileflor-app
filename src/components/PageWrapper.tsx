'use client';
import { usePathname } from 'next/navigation';

export default function PageWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  // La página de inicio (/) y el portal mayorista (/portal-mayorista/catalogo) tienen sus propios Hero components
  // que ocupan la pantalla completa, por lo que no necesitan el padding general.
  const isHome = pathname === '/';
  const isB2B = pathname === '/portal-mayorista/catalogo';
  
  // Si no es el home ni el portal B2B, agregamos un padding-top para que el Header (Logo flotante + Banner)
  // no tape el contenido de la página. El header mide aprox 116px (36px de banner + 80px de header).
  const needsPadding = !isHome && !isB2B;

  return (
    <div className={needsPadding ? 'pt-[116px]' : ''}>
      {children}
    </div>
  );
}
