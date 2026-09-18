DROP POLICY IF EXISTS "Staff can insert brands" ON brands;
DROP POLICY IF EXISTS "Staff can update brands" ON brands;
DROP POLICY IF EXISTS "Staff can delete brands" ON brands;
DROP POLICY IF EXISTS "Staff can insert categories" ON categories;
DROP POLICY IF EXISTS "Staff can update categories" ON categories;
DROP POLICY IF EXISTS "Staff can delete categories" ON categories;
DROP POLICY IF EXISTS "Staff can insert products" ON products;
DROP POLICY IF EXISTS "Staff can update products" ON products;
DROP POLICY IF EXISTS "Staff can delete products" ON products;
DROP POLICY IF EXISTS "Staff can insert product_variants" ON product_variants;
DROP POLICY IF EXISTS "Staff can update product_variants" ON product_variants;
DROP POLICY IF EXISTS "Staff can delete product_variants" ON product_variants;
DROP POLICY IF EXISTS "Staff can insert product_images" ON product_images;
DROP POLICY IF EXISTS "Staff can update product_images" ON product_images;
DROP POLICY IF EXISTS "Staff can delete product_images" ON product_images;
-- 20260913000000_admin_catalog_write_policies.sql
-- Allow inventory managers, admins, and owners to modify catalog data

-- BRANDS
CREATE POLICY "Staff can insert brands" ON brands FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM user_roles WHERE user_id = auth.uid() AND role IN ('admin', 'owner', 'inventory_manager'))
);
CREATE POLICY "Staff can update brands" ON brands FOR UPDATE USING (
    EXISTS (SELECT 1 FROM user_roles WHERE user_id = auth.uid() AND role IN ('admin', 'owner', 'inventory_manager'))
);
CREATE POLICY "Staff can delete brands" ON brands FOR DELETE USING (
    EXISTS (SELECT 1 FROM user_roles WHERE user_id = auth.uid() AND role IN ('admin', 'owner', 'inventory_manager'))
);

-- CATEGORIES
CREATE POLICY "Staff can insert categories" ON categories FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM user_roles WHERE user_id = auth.uid() AND role IN ('admin', 'owner', 'inventory_manager'))
);
CREATE POLICY "Staff can update categories" ON categories FOR UPDATE USING (
    EXISTS (SELECT 1 FROM user_roles WHERE user_id = auth.uid() AND role IN ('admin', 'owner', 'inventory_manager'))
);
CREATE POLICY "Staff can delete categories" ON categories FOR DELETE USING (
    EXISTS (SELECT 1 FROM user_roles WHERE user_id = auth.uid() AND role IN ('admin', 'owner', 'inventory_manager'))
);

-- PRODUCTS
CREATE POLICY "Staff can insert products" ON products FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM user_roles WHERE user_id = auth.uid() AND role IN ('admin', 'owner', 'inventory_manager'))
);
CREATE POLICY "Staff can update products" ON products FOR UPDATE USING (
    EXISTS (SELECT 1 FROM user_roles WHERE user_id = auth.uid() AND role IN ('admin', 'owner', 'inventory_manager'))
);
CREATE POLICY "Staff can delete products" ON products FOR DELETE USING (
    EXISTS (SELECT 1 FROM user_roles WHERE user_id = auth.uid() AND role IN ('admin', 'owner', 'inventory_manager'))
);

-- PRODUCT VARIANTS
CREATE POLICY "Staff can insert product_variants" ON product_variants FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM user_roles WHERE user_id = auth.uid() AND role IN ('admin', 'owner', 'inventory_manager'))
);
CREATE POLICY "Staff can update product_variants" ON product_variants FOR UPDATE USING (
    EXISTS (SELECT 1 FROM user_roles WHERE user_id = auth.uid() AND role IN ('admin', 'owner', 'inventory_manager'))
);
CREATE POLICY "Staff can delete product_variants" ON product_variants FOR DELETE USING (
    EXISTS (SELECT 1 FROM user_roles WHERE user_id = auth.uid() AND role IN ('admin', 'owner', 'inventory_manager'))
);

-- PRODUCT IMAGES
CREATE POLICY "Staff can insert product_images" ON product_images FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM user_roles WHERE user_id = auth.uid() AND role IN ('admin', 'owner', 'inventory_manager'))
);
CREATE POLICY "Staff can update product_images" ON product_images FOR UPDATE USING (
    EXISTS (SELECT 1 FROM user_roles WHERE user_id = auth.uid() AND role IN ('admin', 'owner', 'inventory_manager'))
);
CREATE POLICY "Staff can delete product_images" ON product_images FOR DELETE USING (
    EXISTS (SELECT 1 FROM user_roles WHERE user_id = auth.uid() AND role IN ('admin', 'owner', 'inventory_manager'))
);
