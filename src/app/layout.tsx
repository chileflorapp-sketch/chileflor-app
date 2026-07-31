import type { Metadata, Viewport } from 'next';
import './globals.css';
import { Plus_Jakarta_Sans } from 'next/font/google';

// Providers
import { CartProvider } from '@/context/CartContext';
import { WishlistProvider } from '@/context/WishlistContext';
import { ClientAuthProvider } from '@/context/ClientAuthContext';

// Layout Components
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import MobileNav from '@/components/MobileNav';
import TopBanner from '@/components/TopBanner';
import WhatsAppButton from '@/components/WhatsAppButton';
import CartDrawer from '@/components/CartDrawer';
import FloatingCartToast from '@/components/FloatingCartToast';
import PageWrapper from '@/components/PageWrapper';
import PremiumPreloader from '@/components/PremiumPreloader';
import ScrollReveal from '@/components/ScrollReveal';
import GoogleAnalytics from '@/components/GoogleAnalytics';
import JsonLd from '@/components/JsonLd';

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-plus-jakarta',
  display: 'swap',
});

export const viewport: Viewport = {
  themeColor: '#FF2651',
};

export const metadata: Metadata = {
  title: 'Chileflor — Flores y Arreglos con Entrega el Mismo Día',
  description: 'Compra flores frescas, ramos y arreglos florales con entrega el mismo día en Santiago. Mantención de cementerios y dedicatorias personalizadas.',
  manifest: '/manifest.json',
  icons: {
    icon: [
      { url: '/icon.png', type: 'image/png' },
      { url: '/favicon.ico' },
    ],
    apple: '/apple-touch-icon.png',
  },
  openGraph: {
    title: 'Chileflor — Flores con Entrega el Mismo Día',
    description: 'La floristería online N°1 de Chile. Rosas, ramos y arreglos frescos entregados hoy.',
    locale: 'es_CL',
    type: 'website',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className={plusJakartaSans.variable}>
      <body className="font-sans antialiased bg-[#F8F9FA] flex flex-col min-h-screen pb-16 md:pb-0">
        {/* Analytics & SEO */}
        <GoogleAnalytics />
        <JsonLd />

        {/* Efectos decorativos */}
        <div className="pollen-container" aria-hidden="true" />
        <PremiumPreloader />
        <ScrollReveal />

        {/* Providers anidados correctamente */}
        <ClientAuthProvider>
          <WishlistProvider>
            <CartProvider>

              {/* Overlays y drawer */}
              <CartDrawer />
              <FloatingCartToast />

              {/* Layout global */}
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
