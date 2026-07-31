'use client';
import { useState, useEffect } from 'react';
import { Loader2 } from 'lucide-react';

// Layout components
import HeroSlider from '@/components/HeroSlider';
import InfoSlider from '@/components/InfoSlider';
import ExperienceBanner from '@/components/ExperienceBanner';
import SubscriptionBanner from '@/components/SubscriptionBanner';

// Home section components
import TrustTicker from '@/components/home/TrustTicker';
import CategoryGrid from '@/components/home/CategoryGrid';
import WhyChileflor from '@/components/home/WhyChileflor';
import StatsBar from '@/components/home/StatsBar';
import Testimonials from '@/components/home/Testimonials';
import NewsletterBanner from '@/components/home/NewsletterBanner';
import RaspeBanner from '@/components/home/RaspeBanner';
import UrgencyBar from '@/components/home/UrgencyBar';
import QuickAppActions from '@/components/home/QuickAppActions';
import FeaturedProducts from '@/components/home/FeaturedProducts';

export default function HomePage() {
  const [catalogoDB, setCatalogoDB] = useState<any[]>([]);
  const [siteConfig, setSiteConfig] = useState<any>(null);

  useEffect(() => {
    fetch('/api/catalogo')
      .then(res => res.json())
      .then(data => setCatalogoDB(Array.isArray(data) ? data : []))
      .catch(err => console.error(err));

    fetch(`/api/config?t=${Date.now()}`, { cache: 'no-store' })
      .then(res => res.json())
      .then(data => setSiteConfig(data))
      .catch(err => console.error(err));
  }, []);

  if (!siteConfig) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-rose-50 to-pink-50">
        <div className="text-center">
          <div className="text-5xl mb-4 animate-float">🌹</div>
          <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto" />
          <p className="text-gray-400 mt-4 text-sm font-medium">Preparando tu experiencia floral...</p>
        </div>
      </div>
    );
  }

  // Inyectar fuentes configurables desde el CRM
  const fontStyle = `
    :root {
      --font-heading: "${siteConfig.fonts?.heading || 'Plus Jakarta Sans'}", sans-serif;
      --font-body: "${siteConfig.fonts?.body || 'Plus Jakarta Sans'}", sans-serif;
    }
    h1, h2, h3, h4, h5, h6 { font-family: var(--font-heading) !important; }
  `;

  const products = catalogoDB.filter(p => p?.estado !== 'fuera_de_temporada');

  return (
    <div className="flex flex-col min-h-screen bg-gray-50/50">
      <style dangerouslySetInnerHTML={{ __html: fontStyle }} />

      {/* 1. Hero principal */}
      <HeroSlider config={siteConfig.heroSlider} timings={siteConfig.timings} />

      {/* 2. Slider informativo (CRM) */}
      <InfoSlider config={siteConfig.infoSlider} />

      {/* 3. Barra de urgencia con countdown */}
      <UrgencyBar config={siteConfig.urgencyBar} />

      {/* 4. Accesos rápidos por categoría (estilo app) */}
      <QuickAppActions shortcuts={siteConfig.quickShortcuts} />

      {/* 5. Ticker de confianza */}
      <TrustTicker items={siteConfig.trustTicker} />

      {/* 6. Grid de categorías visuales */}
      <CategoryGrid config={siteConfig.colecciones} />

      {/* 7. Banner Conócenos */}
      <ExperienceBanner config={siteConfig.experienceBanner} />

      {/* 8. Productos destacados con filtros */}
      <FeaturedProducts products={products} />

      {/* 9. Por qué Chileflor */}
      <WhyChileflor />

      {/* 10. Estadísticas */}
      <StatsBar />

      {/* 11. Banner Raspe y Gana */}
      <RaspeBanner />

      {/* 12. Suscripción cementerios */}
      <section className="container mx-auto px-4 py-8 reveal">
        <SubscriptionBanner config={siteConfig.subscriptionBanner} />
      </section>

      {/* 13. Testimonios */}
      <Testimonials />

      {/* 14. Newsletter */}
      <NewsletterBanner />

      {/* Espacio inferior para MobileNav en móvil */}
      <div className="pb-16 md:pb-8" />
    </div>
  );
}
