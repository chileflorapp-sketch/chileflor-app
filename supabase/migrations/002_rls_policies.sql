-- 002_rls_policies.sql

-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE dedications ENABLE ROW LEVEL SECURITY;
ALTER TABLE memory_crm ENABLE ROW LEVEL SECURITY;
ALTER TABLE maintenance_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE b2b_requests ENABLE ROW LEVEL SECURITY;

-- PROFILES
CREATE POLICY "Users can read own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

-- PRODUCTS
CREATE POLICY "Products are viewable by everyone" ON products
  FOR SELECT USING (true);

-- ORDERS
CREATE POLICY "Users can view own orders" ON orders
  FOR SELECT USING (auth.uid() = user_id OR auth.uid() = vendor_id);

CREATE POLICY "Users can create own orders" ON orders
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Vendors can update assigned orders" ON orders
  FOR UPDATE USING (auth.uid() = vendor_id);

-- DEDICATIONS
CREATE POLICY "Dedications are viewable by everyone" ON dedications
  FOR SELECT USING (true);

CREATE POLICY "Users can create dedications for own orders" ON dedications
  FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM orders WHERE orders.id = dedications.order_id AND orders.user_id = auth.uid())
  );

-- MEMORY CRM
CREATE POLICY "Users can manage own memory CRM" ON memory_crm
  FOR ALL USING (auth.uid() = user_id);

-- MAINTENANCE LOGS
CREATE POLICY "Users can view own maintenance logs" ON maintenance_logs
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM orders WHERE orders.id = maintenance_logs.order_id AND orders.user_id = auth.uid())
  );

CREATE POLICY "Vendors can insert maintenance logs" ON maintenance_logs
  FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM orders WHERE orders.id = maintenance_logs.order_id AND orders.vendor_id = auth.uid())
  );
