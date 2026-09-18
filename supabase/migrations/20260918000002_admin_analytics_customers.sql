-- =======================================================================================
-- CUSTOMERS ADMIN RPC
-- =======================================================================================
CREATE OR REPLACE FUNCTION admin_get_customers()
RETURNS TABLE (
  id UUID,
  first_name TEXT,
  last_name TEXT,
  email TEXT,
  total_orders BIGINT,
  total_spent NUMERIC,
  created_at TIMESTAMPTZ
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Verify caller is staff
  IF NOT EXISTS (
    SELECT 1 FROM user_roles 
    WHERE user_id = auth.uid() 
    AND role IN ('admin', 'owner', 'order_manager', 'support')
  ) THEN
    RAISE EXCEPTION 'Access denied';
  END IF;

  RETURN QUERY
  SELECT 
    p.id,
    p.first_name,
    p.last_name,
    au.email::text,
    COUNT(o.id) AS total_orders,
    COALESCE(SUM(o.total_amount), 0) AS total_spent,
    p.created_at
  FROM profiles p
  JOIN auth.users au ON au.id = p.id
  LEFT JOIN orders o ON o.user_id = p.id
  WHERE EXISTS (
    SELECT 1 FROM user_roles ur WHERE ur.user_id = p.id AND ur.role = 'customer'
  )
  GROUP BY p.id, p.first_name, p.last_name, au.email, p.created_at
  ORDER BY p.created_at DESC;
END;
$$;


-- =======================================================================================
-- ANALYTICS SUMMARY ADMIN RPC
-- =======================================================================================
CREATE OR REPLACE FUNCTION admin_get_analytics_summary()
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_total_revenue NUMERIC;
  v_total_orders BIGINT;
  v_active_customers BIGINT;
  v_revenue_by_month JSON;
BEGIN
  -- Verify caller is staff
  IF NOT EXISTS (
    SELECT 1 FROM user_roles 
    WHERE user_id = auth.uid() 
    AND role IN ('admin', 'owner', 'order_manager', 'inventory_manager')
  ) THEN
    RAISE EXCEPTION 'Access denied';
  END IF;

  -- 1. Total Revenue (Only completed/delivered/paid orders could be counted, but let's count all non-cancelled)
  SELECT COALESCE(SUM(total_amount), 0)
  INTO v_total_revenue
  FROM orders
  WHERE status != 'cancelled';

  -- 2. Total Orders
  SELECT COUNT(id)
  INTO v_total_orders
  FROM orders;

  -- 3. Active Customers (Customers who have placed at least 1 order)
  SELECT COUNT(DISTINCT user_id)
  INTO v_active_customers
  FROM orders;

  -- 4. Revenue by Month (Last 6 months)
  SELECT json_agg(
    json_build_object(
      'month', month_label,
      'revenue', month_revenue
    )
  )
  INTO v_revenue_by_month
  FROM (
    SELECT 
      to_char(date_trunc('month', created_at), 'Mon') AS month_label,
      SUM(total_amount) AS month_revenue
    FROM orders
    WHERE created_at >= date_trunc('month', current_date - interval '5 months')
      AND status != 'cancelled'
    GROUP BY date_trunc('month', created_at)
    ORDER BY date_trunc('month', created_at) ASC
  ) AS monthly_stats;

  -- Build final JSON
  RETURN json_build_object(
    'total_revenue', v_total_revenue,
    'total_orders', v_total_orders,
    'active_customers', v_active_customers,
    'revenue_by_month', COALESCE(v_revenue_by_month, '[]'::json)
  );
END;
$$;
