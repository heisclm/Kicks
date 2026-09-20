-- =======================================================================================
-- SETTINGS SCHEMA
-- =======================================================================================
CREATE TABLE store_settings (
    key TEXT PRIMARY KEY,
    value TEXT NOT NULL,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Insert defaults
INSERT INTO store_settings (key, value) VALUES 
('store_name', 'KICKS Official'),
('contact_email', 'support@kicks.com'),
('store_address', '123 Sneaker Avenue, NY 10012'),
('default_currency', 'USD'),
('timezone', 'EST');

ALTER TABLE store_settings ENABLE ROW LEVEL SECURITY;

-- Anyone can read settings
CREATE POLICY "Public can read settings" ON store_settings FOR SELECT USING (true);

-- Only owners and admins can update settings
CREATE POLICY "Admins can update settings" ON store_settings FOR UPDATE USING (
    EXISTS (SELECT 1 FROM user_roles WHERE user_roles.user_id = auth.uid() AND user_roles.role IN ('admin', 'owner'))
);
