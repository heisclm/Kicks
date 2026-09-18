-- =======================================================================================
-- ADMIN PROMOTIONS AND REVIEWS RLS
-- =======================================================================================

-- PROMOTIONS: Allow staff to insert, update, and delete
CREATE POLICY "Staff can insert promotions" ON promotions FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM user_roles WHERE user_roles.user_id = auth.uid() AND user_roles.role IN ('admin', 'owner', 'order_manager'))
);

CREATE POLICY "Staff can update promotions" ON promotions FOR UPDATE USING (
    EXISTS (SELECT 1 FROM user_roles WHERE user_roles.user_id = auth.uid() AND user_roles.role IN ('admin', 'owner', 'order_manager'))
);

CREATE POLICY "Staff can delete promotions" ON promotions FOR DELETE USING (
    EXISTS (SELECT 1 FROM user_roles WHERE user_roles.user_id = auth.uid() AND user_roles.role IN ('admin', 'owner', 'order_manager'))
);

-- REVIEWS: Allow staff to delete reviews (moderation)
CREATE POLICY "Staff can delete reviews" ON reviews FOR DELETE USING (
    EXISTS (SELECT 1 FROM user_roles WHERE user_roles.user_id = auth.uid() AND user_roles.role IN ('admin', 'owner', 'support'))
);
