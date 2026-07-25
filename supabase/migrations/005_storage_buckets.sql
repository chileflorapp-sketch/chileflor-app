-- 005_storage_buckets.sql

-- Insert buckets if they don't exist
INSERT INTO storage.buckets (id, name, public) 
VALUES ('productos', 'productos', true) 
ON CONFLICT (id) DO NOTHING;

INSERT INTO storage.buckets (id, name, public) 
VALUES ('tarjetas', 'tarjetas', true) 
ON CONFLICT (id) DO NOTHING;

-- Allow public read access to the buckets
CREATE POLICY "Public Read Access" ON storage.objects 
FOR SELECT USING (bucket_id IN ('productos', 'tarjetas'));

-- Allow insert access for uploads (CRM frontend uploads to 'productos')
CREATE POLICY "Public Upload Access" ON storage.objects 
FOR INSERT WITH CHECK (bucket_id IN ('productos', 'tarjetas'));

-- Allow update/delete if needed
CREATE POLICY "Public Update Access" ON storage.objects 
FOR UPDATE USING (bucket_id IN ('productos', 'tarjetas'));

CREATE POLICY "Public Delete Access" ON storage.objects 
FOR DELETE USING (bucket_id IN ('productos', 'tarjetas'));
