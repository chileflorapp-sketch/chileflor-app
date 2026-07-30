import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://www.chileflor.cl';

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/agentes/',
          '/admin/',
          '/api/',
          '/mi-cuenta/',
          '/checkout/',
        ],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
