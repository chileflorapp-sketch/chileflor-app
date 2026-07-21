export interface B2BCategory {
  id: number;
  nombre: string;
}

export const B2B_CATEGORIAS: B2BCategory[] = [
  { id: 1, nombre: "Flores de Corte" },
  { id: 2, nombre: "Insumos Técnicos" },
  { id: 3, nombre: "Packaging" },
  { id: 4, nombre: "Básicos" },
  { id: 5, nombre: "Packs de Supervivencia" },
  { id: 6, nombre: "Outlet de Segunda" },
];

export interface B2BProduct {
  id: string;
  nombre: string;
  categoria: string;
  precio_mayorista: number;
  precio_sugerido_retail?: number; // Mostrar margen de ganancia
  unidad_venta: string; // ej: "Paquete de 25 tallos", "Rollo 50m"
  imagen: string;
  stock: number;
  badge?: string;
}

export const CATALOGO_B2B: B2BProduct[] = [
  {
    id: "b2b-001",
    nombre: "Rosas Rojas Freedom (Premium)",
    categoria: "Flores de Corte",
    precio_mayorista: 8500,
    precio_sugerido_retail: 25000,
    unidad_venta: "Paquete de 25 tallos",
    imagen: "https://images.unsplash.com/photo-1548839140-29a749e1bc4e?auto=format&fit=crop&w=800&q=80",
    stock: 50,
    badge: "🔥 Más Vendido"
  },
  {
    id: "b2b-002",
    nombre: "Lilium Blanco Oriental",
    categoria: "Flores de Corte",
    precio_mayorista: 6000,
    unidad_venta: "Paquete de 10 varas",
    imagen: "https://images.unsplash.com/photo-1508610048659-a06b669e3321?auto=format&fit=crop&w=800&q=80",
    stock: 20
  },
  {
    id: "b2b-003",
    nombre: "Espuma Floral Oasis (Caja)",
    categoria: "Insumos Técnicos",
    precio_mayorista: 12000,
    unidad_venta: "Caja de 48 ladrillos",
    imagen: "https://images.unsplash.com/photo-1585289945084-5a98bf681c5a?auto=format&fit=crop&w=800&q=80", // Placeholder
    stock: 15
  },
  {
    id: "b2b-004",
    nombre: "Alimento Floral Floralife",
    categoria: "Insumos Técnicos",
    precio_mayorista: 15000,
    unidad_venta: "Balde 5 KG",
    imagen: "https://images.unsplash.com/photo-1628155930542-3c7a64e2c833?auto=format&fit=crop&w=800&q=80", // Placeholder
    stock: 8,
    badge: "⭐ Indispensable"
  },
  {
    id: "b2b-005",
    nombre: "Papel Coreano Impermeable (Negro Mate)",
    categoria: "Packaging",
    precio_mayorista: 4500,
    unidad_venta: "Rollo 20 hojas",
    imagen: "https://images.unsplash.com/photo-1620311244033-d92634e32d56?auto=format&fit=crop&w=800&q=80", // Placeholder texturas
    stock: 100,
    badge: "✨ En Tendencia"
  },
  {
    id: "b2b-006",
    nombre: "Florero Vidrio Cilíndrico Ref. 102",
    categoria: "Básicos",
    precio_mayorista: 1800,
    precio_sugerido_retail: 4990,
    unidad_venta: "Unidad (Min. 12)",
    imagen: "https://images.unsplash.com/photo-1584589167171-541ce45f1eea?auto=format&fit=crop&w=800&q=80",
    stock: 200
  },
  {
    id: "b2b-007",
    nombre: "Pack Matrimonio Básico",
    categoria: "Packs de Supervivencia",
    precio_mayorista: 85000,
    unidad_venta: "Kit Completo (Flores Blancas + Espumas + Cintas)",
    imagen: "https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&w=800&q=80",
    stock: 5,
    badge: "💎 Ahorro 15%"
  },
  {
    id: "b2b-008",
    nombre: "Pétalos de Rosa Deshojados (Mix)",
    categoria: "Outlet de Segunda",
    precio_mayorista: 3000,
    unidad_venta: "Bolsa 1 KG",
    imagen: "https://images.unsplash.com/photo-1518895949257-7621c3c786d7?auto=format&fit=crop&w=800&q=80",
    stock: 12,
    badge: "🚨 Liquidación Eventos"
  }
];
