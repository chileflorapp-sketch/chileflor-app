import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Configuración para permitir la carga de JavaScript (HMR) en el celular
  // cuando se accede a través de la red local
  // @ts-ignore - Propiedad requerida por la versión de Next.js
  allowedDevOrigins: ['192.168.100.12'],
};

export default nextConfig;
