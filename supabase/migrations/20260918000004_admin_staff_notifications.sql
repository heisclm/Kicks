-- =======================================================================================
-- NOTIFICATIONS SCHEMA
-- =======================================================================================
CREATE TABLE notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    is_read BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read their own notifications" ON notifications FOR SELECT USING (user_id = auth.uid() OR user_id IS NULL);
CREATE POLICY "Users can update their own notifications" ON notifications FOR UPDATE USING (user_id = auth.uid());

CREATE POLICY "Staff can insert notifications" ON notifications FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM user_roles WHERE user_roles.user_id = auth.uid() AND user_roles.role IN ('admin', 'owner', 'support'))
);

CREATE POLICY "Staff can delete notifications" ON notifications FOR DELETE USING (
    EXISTS (SELECT 1 FROM user_roles WHERE user_roles.user_id = auth.uid() AND user_roles.role IN ('admin', 'owner', 'support'))
);

-- =======================================================================================
-- STAFF & ROLES SECURE RPC
-- =======================================================================================

CREATE OR REPLACE FUNCTION admin_get_staff()
RETURNS TABLE (
  id UUID,
  first_name TEXT,
  last_name TEXT,
  email TEXT,
  role app_role
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Only owners and admins can list staff
  IF NOT EXISTS (
    SELECT 1 FROM user_roles 
    WHERE user_id = auth.uid() 
    AND role IN ('admin', 'owner')
  ) THEN
    RAISE EXCEPTION 'Access denied';
  END IF;

  RETURN QUERY
  SELECT 
    p.id,
    p.first_name,
    p.last_name,
    au.email::text,
    ur.role
  FROM profiles p
  JOIN auth.users au ON au.id = p.id
  JOIN user_roles ur ON ur.user_id = p.id
  WHERE ur.role != 'customer'
  ORDER BY p.created_at ASC;
END;
$$;

CREATE OR REPLACE FUNCTION admin_assign_role(p_user_id UUID, p_role app_role)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Only owners and admins can assign roles
  IF NOT EXISTS (
    SELECT 1 FROM user_roles 
    WHERE user_id = auth.uid() 
    AND role IN ('admin', 'owner')
  ) THEN
    RAISE EXCEPTION 'Access denied';
  END IF;

  UPDATE user_roles SET role = p_role WHERE user_id = p_user_id;
  IF NOT FOUND THEN
    INSERT INTO user_roles (user_id, role) VALUES (p_user_id, p_role);
  END IF;

  RETURN TRUE;
END;
$$;
