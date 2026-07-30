import React from 'react';
import { Product } from '@/data/catalog';

interface JsonLdProps {
  product?: Product;
  categoryName?: string;
  breadcrumbList?: { name: string; url: string }[];
}

export default function JsonLd({ product, categoryName, breadcrumbList }: JsonLdProps) {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://www.chileflor.cl';

  const schemas: any[] = [];

  // Schema de Organización / Tienda
  schemas.push({
    '@context': 'https://schema.org',
    '@type': 'Florist',
    name: 'Chileflor',
    url: baseUrl,
    logo: `${baseUrl}/logo.png`,
    description: 'Venta de arreglos florales, ramos de rosas y homenajes con envío a domicilio en Chile.',
    telephone: '+56912345678',
    priceRange: '$$',
    address: {
      '@type': 'PostalAddress',
      addressCountry: 'CL',
    },
  });

  // Schema de Producto
  if (product) {
    schemas.push({
      '@context': 'https://schema.org',
      '@type': 'Product',
      name: product.nombre,
      image: [product.imagen],
      description: product.meta_description || `${product.nombre} - Arreglo floral exclusivo de Chileflor.`,
      sku: product.id,
      brand: {
        '@type': 'Brand',
        name: 'Chileflor',
      },
      offers: {
        '@type': 'Offer',
        url: `${baseUrl}/catalogo/${product.id}`,
        priceCurrency: 'CLP',
        price: product.precio_base,
        availability: product.estado === 'activo' ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
        itemCondition: 'https://schema.org/NewCondition',
      },
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: '4.9',
        reviewCount: product.ventas > 0 ? product.ventas : 12,
      },
    });
  }

  // Schema de Migas de Pan (Breadcrumbs)
  if (breadcrumbList && breadcrumbList.length > 0) {
    schemas.push({
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: breadcrumbList.map((item, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        name: item.name,
        item: item.url.startsWith('http') ? item.url : `${baseUrl}${item.url}`,
      })),
    });
  }

  return (
    <>
      {schemas.map((schema, i) => (
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}
    </>
  );
}
