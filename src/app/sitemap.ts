import { MetadataRoute } from 'next';
import { CATALOGO, CATEGORIAS } from '@/data/catalog';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://www.chileflor.cl';

  // 1. Páginas estáticas principales
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/catalogo`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/nosotros`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${baseUrl}/contacto`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
  ];

  // 2. URLs de Categorías y Subcategorías
  const categoryUrls: MetadataRoute.Sitemap = [];
  CATEGORIAS.forEach(cat => {
    categoryUrls.push({
      url: `${baseUrl}/catalogo?categoria=${encodeURIComponent(cat.nombre)}`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    });
    cat.subcategorias.forEach(sub => {
      categoryUrls.push({
        url: `${baseUrl}/catalogo?categoria=${encodeURIComponent(cat.nombre)}&subcategoria=${encodeURIComponent(sub.nombre)}`,
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: 0.7,
      });
    });
  });

  // 3. URLs de Productos Activos
  const productUrls: MetadataRoute.Sitemap = CATALOGO
    .filter(p => p.estado === 'activo')
    .map(p => ({
      url: `${baseUrl}/catalogo/${p.id}`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    }));

  // 4. URLs de Etiquetas de Campañas Especiales
  const tagsList = ['Día de la Madre', 'Día del Padre', 'San Valentín', '14 de Febrero', 'Cumpleaños', 'Amor'];
  const tagUrls: MetadataRoute.Sitemap = tagsList.map(tag => ({
    url: `${baseUrl}/catalogo?tag=${encodeURIComponent(tag)}`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: 0.6,
  }));

  return [...staticPages, ...categoryUrls, ...productUrls, ...tagUrls];
}
