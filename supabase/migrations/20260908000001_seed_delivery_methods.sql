-- Seed Delivery Methods if they do not exist
INSERT INTO delivery_methods (id, name, price, min_order_for_free, is_active)
VALUES
    ('d9c6c8c1-1e9b-4e0d-8d5f-15a0c8b2a1a1', 'Standard Delivery', 0.00, NULL, true),
    ('d9c6c8c1-1e9b-4e0d-8d5f-15a0c8b2a1a2', 'Express Delivery', 15.00, NULL, true)
ON CONFLICT (id) DO NOTHING;
