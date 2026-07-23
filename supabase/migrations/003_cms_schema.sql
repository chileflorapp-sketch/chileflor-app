-- 003_cms_schema.sql

-- Tabla para almacenar la configuración de apariencia y contenido del sitio
CREATE TABLE site_config (
  id TEXT PRIMARY KEY,
  data JSONB NOT NULL DEFAULT '{}'::jsonb,
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  updated_by UUID REFERENCES profiles(id) ON DELETE SET NULL
);

-- Habilitar RLS
ALTER TABLE site_config ENABLE ROW LEVEL SECURITY;

-- Políticas
-- Todo el mundo puede leer la configuración del sitio
CREATE POLICY "Public can read site config" ON site_config
  FOR SELECT USING (true);

-- Solo admins pueden actualizar
CREATE POLICY "Admins can update site config" ON site_config
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Datos iniciales (estado actual por defecto)
INSERT INTO site_config (id, data) VALUES (
  'home_config',
  '{
    "fonts": {
      "heading": "Inter",
      "body": "Inter"
    },
    "timings": {
      "heroSliderTransition": 5000,
      "infoSliderTransition": 5000
    },
    "heroSlider": [
      {
        "id": 1,
        "title": "La Primavera Llegó a Chileflor",
        "subtitle": "Descubre nuestra nueva colección de ramos de temporada con las flores más frescas del país.",
        "image": "https://images.unsplash.com/photo-1561181286-d3fee7d55ef8?auto=format&fit=crop&q=80&w=2000",
        "buttonText": "Ver Colección",
        "buttonLink": "/catalogo?cat=Primavera"
      },
      {
        "id": 2,
        "title": "Amor que Perdura",
        "subtitle": "Rosas importadas de calidad premium para esos momentos inolvidables.",
        "image": "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&q=80&w=2000",
        "buttonText": "Ramos de Rosas",
        "buttonLink": "/catalogo?cat=Ramos de Rosas"
      },
      {
        "id": 3,
        "title": "Cuidado Eterno",
        "subtitle": "Suscríbete a nuestros planes bimensuales de mantención de cementerios.",
        "image": "https://images.unsplash.com/photo-1563241527-20042457fb1e?auto=format&fit=crop&q=80&w=2000",
        "buttonText": "Ver Planes",
        "buttonLink": "/cementerios"
      }
    ],
    "infoSlider": [
      {
        "id": 1,
        "tag": "Mantención",
        "title": "Cuidamos tu recuerdo",
        "subtitle": "La diferencia entre el olvido y la memoria eterna. Nosotros vamos por ti.",
        "media": "/slider/slider1.mp4",
        "type": "video",
        "primaryLink": "/cementerios",
        "primaryText": "Ver Planes",
        "secondaryLink": "/catalogo",
        "secondaryText": "Catálogo"
      },
      {
        "id": 2,
        "tag": "Emociones",
        "title": "Conecta emociones",
        "subtitle": "El instante exacto donde las flores se convierten en el puente entre dos corazones.",
        "media": "/slider/slider2.png",
        "type": "image",
        "primaryLink": "/catalogo",
        "primaryText": "Comprar Arreglos",
        "secondaryLink": "",
        "secondaryText": ""
      },
      {
        "id": 3,
        "tag": "Innovación",
        "title": "Únete al Club Chileflor",
        "subtitle": "Acumula puntos con cada compra, obtén descuentos exclusivos y disfruta de beneficios pensados para ti.",
        "media": "/slider/slider3.png",
        "type": "image",
        "primaryLink": "/club",
        "primaryText": "Beneficios del Club",
        "secondaryLink": "",
        "secondaryText": ""
      }
    ],
    "experienceBanner": {
      "badge": "Conócenos",
      "title": "El Arte Detrás de la Belleza",
      "description": "Descubre la historia de Chileflor, nuestras anécdotas de taller, datos fascinantes y conoce a las personas que hacen posible cada sonrisa.",
      "buttonText": "Descubrir Más ✨",
      "buttonLink": "/nosotros"
    },
    "subscriptionBanner": {
      "badge": "PLAN RECOMENDADO",
      "title": "Suscripción Bimensual",
      "description": "Despreocúpate. Nuestro equipo visitará la sepultura de tu ser querido dos veces al mes para mantenerla impecable.",
      "features": [
        "Limpieza profunda de lápida.",
        "Recambio de flores frescas de temporada.",
        "Evidencia fotográfica enviada a tu celular."
      ],
      "priceLabel": "Valor por visita",
      "price": "$25.990",
      "priceSubtext": "Cobro por visita realizada.",
      "buttonText": "Suscribirse Ahora",
      "buttonLink": "/cementerios/suscripcion",
      "image": "/slider/slider2.png"
    }
  }'::jsonb
);
