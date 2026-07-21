-- 001_initial_schema.sql

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- PROFILES (Extends Supabase Auth)
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  phone TEXT,
  points INTEGER DEFAULT 0,
  role TEXT DEFAULT 'b2c' CHECK (role IN ('b2c', 'b2b', 'courier', 'admin')),
  vendor_hub TEXT CHECK (vendor_hub IN ('parque_el_prado', 'los_mellizos', NULL)),
  fcm_token TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- PRODUCTS
CREATE TABLE products (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  price_b2c NUMERIC(10,2) NOT NULL,
  price_b2b NUMERIC(10,2) NOT NULL,
  stock INTEGER DEFAULT 0,
  type TEXT CHECK (type IN ('flowers', 'breakfast', 'complement', 'maintenance', 'subscription')),
  images TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ORDERS
CREATE TABLE orders (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  vendor_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  total NUMERIC(10,2) NOT NULL,
  status TEXT DEFAULT 'preparing' CHECK (status IN ('preparing', 'in_route', 'completed', 'cancelled')),
  delivery_data JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- DEDICATIONS
CREATE TABLE dedications (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE UNIQUE,
  message TEXT,
  media_url TEXT,
  media_type TEXT CHECK (media_type IN ('image', 'video', NULL)),
  qr_hash TEXT UNIQUE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- MEMORY CRM (Agenda)
CREATE TABLE memory_crm (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  event_date DATE NOT NULL,
  event_type TEXT NOT NULL,
  description TEXT,
  notify_days INTEGER[] DEFAULT '{3,7}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- MAINTENANCE LOGS
CREATE TABLE maintenance_logs (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
  photo_before_url TEXT,
  photo_after_url TEXT NOT NULL,
  completed_at TIMESTAMPTZ DEFAULT NOW()
);

-- B2B REQUESTS
CREATE TABLE b2b_requests (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  company_name TEXT NOT NULL,
  tax_id TEXT NOT NULL,
  signature_url TEXT NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- INDEXES for optimization
CREATE INDEX idx_orders_user_id ON orders(user_id);
CREATE INDEX idx_orders_vendor_id ON orders(vendor_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_memory_crm_date ON memory_crm(event_date);
CREATE INDEX idx_dedications_qr_hash ON dedications(qr_hash);
