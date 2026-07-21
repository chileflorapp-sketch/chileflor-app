-- supabase/seed.sql

-- This file seeds dummy data to test the frontend components without a real backend.

INSERT INTO products (name, description, price_b2c, price_b2b, stock, type) VALUES
('Ramo de Rosas Premium', 'Hermoso arreglo compuesto por rosas rojas ecuatorianas.', 35990, 25990, 50, 'flowers'),
('Desayuno Sorpresa Amor', 'Bandeja de desayuno con taza, café, tostadas, y jugo natural.', 42990, 35990, 20, 'breakfast'),
('Mantención Bimensual Cementerio', 'Servicio de limpieza y recambio floral para lápidas en Parque El Prado o Los Mellizos.', 25990, 20990, 100, 'subscription'),
('Chocolates Ferrero Rocher 8 un', 'Complemento dulce.', 8990, 6990, 200, 'complement');
