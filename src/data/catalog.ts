export interface ProductVariation {
  tipo: string;
  precio: number;
}

export interface VisualTags {
  fondo: 'neutro' | 'blanco' | 'escenario';
  angulo: 'cenital' | 'lateral' | 'frontal';
  luz: 'natural' | 'estudio';
}

export interface Product {
  id: string; // SKU
  nombre: string;
  categoria: string;
  subcategoria: string;
  precio_base: number;
  imagen: string;
  variaciones?: ProductVariation[];
  tags_visuales: VisualTags;
  badge?: '⚡ Entrega Hoy' | '💎 Premium' | '🍃 Eco-Friendly' | null;
  cross_sell?: string[];
  estado: 'activo' | 'fuera_de_temporada' | 'proximamente';
  ventas: number; // Para ordenar por populares
}

export interface Category {
  id: number;
  nombre: string;
  slug: string;
  subcategorias: { id: number; nombre: string }[];
}

export const CATEGORIAS: Category[] = [
  {
    id: 1,
    nombre: "Flores",
    slug: "flores",
    subcategorias: [
      { id: 11, nombre: "Ramos de Rosas" },
      { id: 12, nombre: "Flores Silvestres" },
      { id: 13, nombre: "Ramos de Novia" }
    ]
  },
  {
    id: 2,
    nombre: "Regalos",
    slug: "regalos",
    subcategorias: [
      { id: 21, nombre: "Chocolates" },
      { id: 22, nombre: "Peluches" },
      { id: 23, nombre: "Kits de Spa" }
    ]
  },
  {
    id: 3,
    nombre: "Homenajes",
    slug: "homenajes",
    subcategorias: [
      { id: 31, nombre: "Coronas Fúnebres" },
      { id: 32, nombre: "Arreglos Florales" }
    ]
  },
  {
    id: 4,
    nombre: "Estacionales",
    slug: "estacionales",
    subcategorias: [
      { id: 41, nombre: "San Valentín" },
      { id: 42, nombre: "Navidad" },
      { id: 43, nombre: "Día de la Madre" }
    ]
  }
];

export const CATALOGO: Product[] = [
  {
    id: "p-001",
    nombre: "Ramo Primaveral",
    categoria: "Flores",
    subcategoria: "Flores Silvestres",
    precio_base: 24990,
    imagen: "https://images.unsplash.com/photo-1528699633788-424224dc89b5?auto=format&fit=crop&w=800&q=80",
    variaciones: [
      { tipo: "Standard", precio: 24990 },
      { tipo: "Premium", precio: 34990 }
    ],
    tags_visuales: { fondo: "neutro", angulo: "lateral", luz: "natural" },
    badge: "🍃 Eco-Friendly",
    estado: "activo",
    ventas: 156
  },
  {
    id: "p-002",
    nombre: "Rosas Rojas Premium",
    categoria: "Flores",
    subcategoria: "Ramos de Rosas",
    precio_base: 35990,
    imagen: "https://images.unsplash.com/photo-1582794543139-8ac9cb0f7b11?auto=format&fit=crop&w=800&q=80",
    tags_visuales: { fondo: "escenario", angulo: "frontal", luz: "estudio" },
    badge: "⚡ Entrega Hoy",
    estado: "activo",
    ventas: 342,
    cross_sell: ["p-005"] // Bombones
  },
  {
    id: "p-003",
    nombre: "Girasoles Silvestres",
    categoria: "Flores",
    subcategoria: "Flores Silvestres",
    precio_base: 22990,
    imagen: "https://images.unsplash.com/photo-1509048191080-d2984bad6ae5?auto=format&fit=crop&w=800&q=80",
    tags_visuales: { fondo: "neutro", angulo: "lateral", luz: "natural" },
    estado: "activo",
    ventas: 89
  },
  {
    id: "p-004",
    nombre: "Peonías de Novia",
    categoria: "Flores",
    subcategoria: "Ramos de Novia",
    precio_base: 45990,
    imagen: "https://images.unsplash.com/photo-1533616688419-b7a585564566?auto=format&fit=crop&w=800&q=80",
    tags_visuales: { fondo: "blanco", angulo: "frontal", luz: "natural" },
    badge: "💎 Premium",
    estado: "activo",
    ventas: 45
  },
  {
    id: "p-005",
    nombre: "Caja de Bombones Artesanales",
    categoria: "Regalos",
    subcategoria: "Chocolates",
    precio_base: 12990,
    imagen: "https://images.unsplash.com/photo-1548907040-4baa42d10919?auto=format&fit=crop&w=800&q=80",
    tags_visuales: { fondo: "neutro", angulo: "cenital", luz: "estudio" }, // Regla: Cenital para cajas
    estado: "activo",
    ventas: 512
  },
  {
    id: "p-006",
    nombre: "Corona Homenaje Paz",
    categoria: "Homenajes",
    subcategoria: "Coronas Fúnebres",
    precio_base: 85990,
    imagen: "https://images.unsplash.com/photo-1562690868-60bbe7293e94?auto=format&fit=crop&w=800&q=80",
    tags_visuales: { fondo: "blanco", angulo: "frontal", luz: "natural" }, // Regla: Fondo blanco
    badge: "⚡ Entrega Hoy",
    estado: "activo",
    ventas: 34
  },
  {
    id: "p-007",
    nombre: "Edición San Valentín",
    categoria: "Estacionales",
    subcategoria: "San Valentín",
    precio_base: 49990,
    imagen: "https://images.unsplash.com/photo-1586521995568-39abaa0c2311?auto=format&fit=crop&w=800&q=80",
    tags_visuales: { fondo: "escenario", angulo: "lateral", luz: "estudio" },
    estado: "fuera_de_temporada", // Regla: Ocultar pero no borrar
    ventas: 0
  }
];
