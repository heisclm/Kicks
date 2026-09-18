-- Staff can view all orders
CREATE POLICY "Staff can view all orders" ON orders FOR SELECT USING (
    EXISTS (SELECT 1 FROM user_roles WHERE user_roles.user_id = auth.uid() AND user_roles.role IN ('admin', 'owner', 'order_manager', 'support'))
);

-- Staff can update all orders (specifically the status)
CREATE POLICY "Staff can update all orders" ON orders FOR UPDATE USING (
    EXISTS (SELECT 1 FROM user_roles WHERE user_roles.user_id = auth.uid() AND user_roles.role IN ('admin', 'owner', 'order_manager', 'support'))
);

-- Staff can view all order items
CREATE POLICY "Staff can view all order items" ON order_items FOR SELECT USING (
    EXISTS (SELECT 1 FROM user_roles WHERE user_roles.user_id = auth.uid() AND user_roles.role IN ('admin', 'owner', 'order_manager', 'support'))
);
