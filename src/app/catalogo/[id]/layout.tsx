import { Metadata } from 'next';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

async function getProduct(id: string) {
  if (!supabaseUrl || !supabaseAnonKey) return null;
  const supabase = createClient(supabaseUrl, supabaseAnonKey);
  const { data } = await supabase
    .from('productos')
    .select('id, nombre, descripcion, precio_base, imagen, categoria, seo_title, seo_description')
    .eq('id', id)
    .maybeSingle();
  return data;
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const product = await getProduct(id);

  if (!product) {
    return {
      title: 'Producto no encontrado | Chileflor',
      description: 'El producto que buscas no está disponible.',
    };
  }

  const title = product.seo_title || `${product.nombre} | Chileflor - Flores a Domicilio`;
  const description = product.seo_description || product.descripcion || `Compra ${product.nombre} en Chileflor. Envío a domicilio en Santiago. Las mejores flores frescas.`;
  const imageUrl = product.imagen || 'https://www.chileflor.cl/og-image.jpg';

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: [{ url: imageUrl, width: 1200, height: 630, alt: product.nombre }],
      type: 'website',
      siteName: 'Chileflor',
      url: `https://www.chileflor.cl/catalogo/${id}`,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [imageUrl],
    },
  };
}

export default async function ProductLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const product = await getProduct(id);

  const jsonLd = product ? {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.nombre,
    description: product.descripcion || product.nombre,
    image: product.imagen,
    category: product.categoria,
    offers: {
      '@type': 'Offer',
      priceCurrency: 'CLP',
      price: product.precio_base,
      availability: 'https://schema.org/InStock',
      seller: {
        '@type': 'Organization',
        name: 'Chileflor',
      },
    },
  } : null;

  return (
    <>
      {jsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      )}
      {children}
    </>
  );
}
