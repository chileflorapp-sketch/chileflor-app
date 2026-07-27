import type { Metadata, Viewport } from 'next';
import './globals.css';

import Header from '@/components/Header';
import Footer from '@/components/Footer';
import WhatsAppButton from '@/components/WhatsAppButton';
import TopBanner from '@/components/TopBanner';
import { CartProvider } from '@/context/CartContext';
import { WishlistProvider } from '@/context/WishlistContext';
import { ClientAuthProvider } from '@/context/ClientAuthContext';
import FloatingCartToast from '@/components/FloatingCartToast';
import MobileNav from '@/components/MobileNav';
import PageWrapper from '@/components/PageWrapper';
import { Plus_Jakarta_Sans } from 'next/font/google';
import PremiumPreloader from '@/components/PremiumPreloader';
import ScrollReveal from '@/components/ScrollReveal';
import CartDrawer from '@/components/CartDrawer';

const plusJakartaSans = Plus_Jakarta_Sans({ 
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-plus-jakarta',
});

export const viewport: Viewport = {
  themeColor: '#FF2651',
};

export const metadata: Metadata = {
  title: 'Chileflor - Venta de Flores y Arreglos',
  description: 'Plataforma integral de venta de flores, arreglos florales, mantención de cementerios y dedicatorias emocionales.',
  manifest: '/manifest.json',
  icons: {
    icon: [
      { url: '/icon.png', type: 'image/png' },
      { url: '/favicon.ico' },
    ],
    apple: '/apple-touch-icon.png',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" className={`${plusJakartaSans.variable}`}>
      <body className="font-sans antialiased bg-[#F8F9FA] pb-16 md:pb-0 flex flex-col min-h-screen">
        <div className="pollen-container" aria-hidden="true"></div>
        <PremiumPreloader />
        <ScrollReveal />
        <ClientAuthProvider>
          <WishlistProvider>
            <CartProvider>
            <CartDrawer />
            <FloatingCartToast />
            <TopBanner />
            <Header />

          <main className="flex-grow">
            <PageWrapper>
              {children}
            </PageWrapper>
          </main>
          
          <WhatsAppButton />

          <Footer />

          <MobileNav />
            </CartProvider>
          </WishlistProvider>
        </ClientAuthProvider>
      </body>
    </html>
  );
}
