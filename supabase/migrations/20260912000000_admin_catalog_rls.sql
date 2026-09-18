-- Allow staff members to manage catalog data
CREATE POLICY "Staff can insert brands" ON brands FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM user_roles WHERE user_roles.user_id = auth.uid() AND user_roles.role IN ('admin', 'owner', 'inventory_manager'))
);
CREATE POLICY "Staff can update brands" ON brands FOR UPDATE USING (
    EXISTS (SELECT 1 FROM user_roles WHERE user_roles.user_id = auth.uid() AND user_roles.role IN ('admin', 'owner', 'inventory_manager'))
);

CREATE POLICY "Staff can insert categories" ON categories FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM user_roles WHERE user_roles.user_id = auth.uid() AND user_roles.role IN ('admin', 'owner', 'inventory_manager'))
);
CREATE POLICY "Staff can update categories" ON categories FOR UPDATE USING (
    EXISTS (SELECT 1 FROM user_roles WHERE user_roles.user_id = auth.uid() AND user_roles.role IN ('admin', 'owner', 'inventory_manager'))
);

CREATE POLICY "Staff can insert products" ON products FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM user_roles WHERE user_roles.user_id = auth.uid() AND user_roles.role IN ('admin', 'owner', 'inventory_manager'))
);
CREATE POLICY "Staff can update products" ON products FOR UPDATE USING (
    EXISTS (SELECT 1 FROM user_roles WHERE user_roles.user_id = auth.uid() AND user_roles.role IN ('admin', 'owner', 'inventory_manager'))
);

CREATE POLICY "Staff can insert product_variants" ON product_variants FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM user_roles WHERE user_roles.user_id = auth.uid() AND user_roles.role IN ('admin', 'owner', 'inventory_manager'))
);
CREATE POLICY "Staff can update product_variants" ON product_variants FOR UPDATE USING (
    EXISTS (SELECT 1 FROM user_roles WHERE user_roles.user_id = auth.uid() AND user_roles.role IN ('admin', 'owner', 'inventory_manager'))
);

CREATE POLICY "Staff can insert product_images" ON product_images FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM user_roles WHERE user_roles.user_id = auth.uid() AND user_roles.role IN ('admin', 'owner', 'inventory_manager'))
);
CREATE POLICY "Staff can update product_images" ON product_images FOR UPDATE USING (
    EXISTS (SELECT 1 FROM user_roles WHERE user_roles.user_id = auth.uid() AND user_roles.role IN ('admin', 'owner', 'inventory_manager'))
);
