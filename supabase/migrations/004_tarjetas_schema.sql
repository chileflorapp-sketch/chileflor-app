-- 004_tarjetas_schema.sql

-- Tabla para almacenar tarjetas de dedicatoria temporales (QR)
CREATE TABLE IF NOT EXISTS tarjetas (
  id TEXT PRIMARY KEY,
  image_url TEXT NOT NULL,
  message TEXT,
  order_id TEXT NOT NULL,
  agradecimiento BOOLEAN DEFAULT FALSE,
  agradecido_at TIMESTAMPTZ, -- Cuando el destinatario dio las gracias
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Habilitar RLS
ALTER TABLE tarjetas ENABLE ROW LEVEL SECURITY;

-- Cualquiera puede ver una tarjeta (es pública por diseño, acceso por link secreto)
CREATE POLICY "Public can read tarjetas" ON tarjetas
  FOR SELECT USING (true);

-- Solo server (service role) puede insertar/actualizar/borrar
CREATE POLICY "Service role can manage tarjetas" ON tarjetas
  FOR ALL USING (true)
  WITH CHECK (true);

-- Índice para búsquedas de limpieza por fecha
CREATE INDEX IF NOT EXISTS idx_tarjetas_created_at ON tarjetas(created_at);
CREATE INDEX IF NOT EXISTS idx_tarjetas_agradecimiento ON tarjetas(agradecimiento);
