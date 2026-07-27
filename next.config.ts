import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Configuración para permitir la carga de JavaScript (HMR) en el celular
  // cuando se accede a través de la red local
  // @ts-ignore - Propiedad requerida por la versión de Next.js
  allowedDevOrigins: ['192.168.100.12'],
  images: {
    qualities: [75, 80, 85, 90, 100],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'kjfoclkriceymoiypbsv.supabase.co',
      }
    ],
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  experimental: {
    optimizePackageImports: ['lucide-react'],
  },
};

export default nextConfig;
