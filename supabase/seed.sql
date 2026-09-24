-- Seed Data Generated from Mock Products

-- Brands
INSERT INTO brands (id, name, slug) VALUES ('00000000-0000-0000-0000-000000000101', 'Nike', 'nike');

-- Categories
INSERT INTO categories (id, name, slug) VALUES ('00000000-0000-0000-0000-000000000201', 'Running', 'running');
INSERT INTO categories (id, name, slug) VALUES ('00000000-0000-0000-0000-000000000202', 'Training', 'training');

-- Products, Images, and Variants
INSERT INTO products (id, name, subtitle, description, brand_id, category_id, gender, base_price, is_active) VALUES ('00000000-0000-0000-0000-000000000301', 'Nike Unveil Joyride', 'Men''s running shoe', 'When users select an item, they are taken to a sleek cart interface where they can review their chosen products, view detailed descriptions, and check size, color... Learn more', '00000000-0000-0000-0000-000000000101', '00000000-0000-0000-0000-000000000201', 'Men''s', 180, true);
INSERT INTO product_images (product_id, image_url, is_primary, display_order) VALUES ('00000000-0000-0000-0000-000000000301', 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&q=80', true, 0);
INSERT INTO product_variants (id, product_id, color_name, color_hex, size, sku, stock_quantity, price_adjustment) VALUES ('00000000-0000-0000-0000-000000000401', '00000000-0000-0000-0000-000000000301', '#E04A3A', '#E04A3A', 38, '1-38', 0, 0);
INSERT INTO product_variants (id, product_id, color_name, color_hex, size, sku, stock_quantity, price_adjustment) VALUES ('00000000-0000-0000-0000-000000000402', '00000000-0000-0000-0000-000000000301', '#E04A3A', '#E04A3A', 39, '1-39', 100, 0);
INSERT INTO product_variants (id, product_id, color_name, color_hex, size, sku, stock_quantity, price_adjustment) VALUES ('00000000-0000-0000-0000-000000000403', '00000000-0000-0000-0000-000000000301', '#E04A3A', '#E04A3A', 40, '1-40', 100, 0);
INSERT INTO product_variants (id, product_id, color_name, color_hex, size, sku, stock_quantity, price_adjustment) VALUES ('00000000-0000-0000-0000-000000000404', '00000000-0000-0000-0000-000000000301', '#E04A3A', '#E04A3A', 41, '1-41', 0, 0);
INSERT INTO product_variants (id, product_id, color_name, color_hex, size, sku, stock_quantity, price_adjustment) VALUES ('00000000-0000-0000-0000-000000000405', '00000000-0000-0000-0000-000000000301', '#E04A3A', '#E04A3A', 42, '1-42', 100, 0);
INSERT INTO product_variants (id, product_id, color_name, color_hex, size, sku, stock_quantity, price_adjustment) VALUES ('00000000-0000-0000-0000-000000000406', '00000000-0000-0000-0000-000000000301', '#E04A3A', '#E04A3A', 43, '1-43', 100, 0);
INSERT INTO product_variants (id, product_id, color_name, color_hex, size, sku, stock_quantity, price_adjustment) VALUES ('00000000-0000-0000-0000-000000000407', '00000000-0000-0000-0000-000000000301', '#E04A3A', '#E04A3A', 44, '1-44', 0, 0);
INSERT INTO product_variants (id, product_id, color_name, color_hex, size, sku, stock_quantity, price_adjustment) VALUES ('00000000-0000-0000-0000-000000000408', '00000000-0000-0000-0000-000000000301', '#E04A3A', '#E04A3A', 45, '1-45', 0, 0);
INSERT INTO products (id, name, subtitle, description, brand_id, category_id, gender, base_price, is_active) VALUES ('00000000-0000-0000-0000-000000000302', 'Nike Air Zoom', 'Women''s running shoe', 'Built for speed and comfort, the Nike Air Zoom delivers responsive cushioning for your daily run.', '00000000-0000-0000-0000-000000000101', '00000000-0000-0000-0000-000000000201', 'Women''s', 210, true);
INSERT INTO product_images (product_id, image_url, is_primary, display_order) VALUES ('00000000-0000-0000-0000-000000000302', 'https://images.unsplash.com/photo-1515955656352-a1fa3ffcd111?w=800&q=80', true, 0);
INSERT INTO product_variants (id, product_id, color_name, color_hex, size, sku, stock_quantity, price_adjustment) VALUES ('00000000-0000-0000-0000-000000000409', '00000000-0000-0000-0000-000000000302', '#7AC06D', '#7AC06D', 38, '2-38', 100, 0);
INSERT INTO product_variants (id, product_id, color_name, color_hex, size, sku, stock_quantity, price_adjustment) VALUES ('00000000-0000-0000-0000-000000000410', '00000000-0000-0000-0000-000000000302', '#7AC06D', '#7AC06D', 39, '2-39', 100, 0);
INSERT INTO product_variants (id, product_id, color_name, color_hex, size, sku, stock_quantity, price_adjustment) VALUES ('00000000-0000-0000-0000-000000000411', '00000000-0000-0000-0000-000000000302', '#7AC06D', '#7AC06D', 40, '2-40', 100, 0);
INSERT INTO product_variants (id, product_id, color_name, color_hex, size, sku, stock_quantity, price_adjustment) VALUES ('00000000-0000-0000-0000-000000000412', '00000000-0000-0000-0000-000000000302', '#7AC06D', '#7AC06D', 41, '2-41', 100, 0);
INSERT INTO product_variants (id, product_id, color_name, color_hex, size, sku, stock_quantity, price_adjustment) VALUES ('00000000-0000-0000-0000-000000000413', '00000000-0000-0000-0000-000000000302', '#7AC06D', '#7AC06D', 42, '2-42', 100, 0);
INSERT INTO products (id, name, subtitle, description, brand_id, category_id, gender, base_price, is_active) VALUES ('00000000-0000-0000-0000-000000000303', 'Nike Air Max', 'Unisex training shoe', 'The iconic Air Max continues to deliver legendary cushioning and support for intense training sessions.', '00000000-0000-0000-0000-000000000101', '00000000-0000-0000-0000-000000000202', 'Unisex', 299, true);
INSERT INTO product_images (product_id, image_url, is_primary, display_order) VALUES ('00000000-0000-0000-0000-000000000303', 'https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?w=800&q=80', true, 0);
INSERT INTO product_variants (id, product_id, color_name, color_hex, size, sku, stock_quantity, price_adjustment) VALUES ('00000000-0000-0000-0000-000000000414', '00000000-0000-0000-0000-000000000303', '#E36940', '#E36940', 40, '3-40', 0, 0);
INSERT INTO product_variants (id, product_id, color_name, color_hex, size, sku, stock_quantity, price_adjustment) VALUES ('00000000-0000-0000-0000-000000000415', '00000000-0000-0000-0000-000000000303', '#E36940', '#E36940', 41, '3-41', 0, 0);
INSERT INTO product_variants (id, product_id, color_name, color_hex, size, sku, stock_quantity, price_adjustment) VALUES ('00000000-0000-0000-0000-000000000416', '00000000-0000-0000-0000-000000000303', '#E36940', '#E36940', 42, '3-42', 100, 0);
INSERT INTO product_variants (id, product_id, color_name, color_hex, size, sku, stock_quantity, price_adjustment) VALUES ('00000000-0000-0000-0000-000000000417', '00000000-0000-0000-0000-000000000303', '#E36940', '#E36940', 43, '3-43', 0, 0);
INSERT INTO product_variants (id, product_id, color_name, color_hex, size, sku, stock_quantity, price_adjustment) VALUES ('00000000-0000-0000-0000-000000000418', '00000000-0000-0000-0000-000000000303', '#E36940', '#E36940', 44, '3-44', 0, 0);
