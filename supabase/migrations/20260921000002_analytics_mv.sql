-- Create Materialized View for Analytics
CREATE MATERIALIZED VIEW admin_analytics_summary_mv AS
SELECT
  (SELECT COALESCE(SUM(total_amount), 0) FROM orders WHERE status != 'cancelled') AS total_revenue,
  (SELECT COUNT(id) FROM orders) AS total_orders,
  (SELECT COUNT(DISTINCT user_id) FROM orders) AS active_customers,
  (
    SELECT COALESCE(json_agg(
      json_build_object(
        'month', month_label,
        'revenue', month_revenue
      )
    ), '[]'::json)
    FROM (
      SELECT 
        to_char(date_trunc('month', created_at), 'Mon') AS month_label,
        SUM(total_amount) AS month_revenue
      FROM orders
      WHERE created_at >= date_trunc('month', current_date - interval '5 months')
        AND status != 'cancelled'
      GROUP BY date_trunc('month', created_at)
      ORDER BY date_trunc('month', created_at) ASC
    ) AS monthly_stats
  ) AS revenue_by_month;

-- Create an index to make querying it fast (though it's 1 row)
CREATE UNIQUE INDEX idx_admin_analytics_summary_mv ON admin_analytics_summary_mv (total_orders);

-- Create a function to refresh the MV
CREATE OR REPLACE FUNCTION refresh_admin_analytics_summary_mv()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  REFRESH MATERIALIZED VIEW CONCURRENTLY admin_analytics_summary_mv;
  RETURN NULL;
END;
$$;

-- Since CONCURRENTLY requires a unique index, and we created one above, it will work.
-- Wait, if there are 0 orders, total_orders is 0. If it updates to 1, it changes.
-- A better way for a 1-row MV is to just add a dummy ID column.

DROP MATERIALIZED VIEW IF EXISTS admin_analytics_summary_mv CASCADE;

CREATE MATERIALIZED VIEW admin_analytics_summary_mv AS
SELECT
  1 AS id, -- Dummy ID for unique index
  (SELECT COALESCE(SUM(total_amount), 0) FROM orders WHERE status != 'cancelled') AS total_revenue,
  (SELECT COUNT(id) FROM orders) AS total_orders,
  (SELECT COUNT(DISTINCT user_id) FROM orders) AS active_customers,
  (
    SELECT COALESCE(json_agg(
      json_build_object(
        'month', month_label,
        'revenue', month_revenue
      )
    ), '[]'::json)
    FROM (
      SELECT 
        to_char(date_trunc('month', created_at), 'Mon') AS month_label,
        SUM(total_amount) AS month_revenue
      FROM orders
      WHERE created_at >= date_trunc('month', current_date - interval '5 months')
        AND status != 'cancelled'
      GROUP BY date_trunc('month', created_at)
      ORDER BY date_trunc('month', created_at) ASC
    ) AS monthly_stats
  ) AS revenue_by_month;

CREATE UNIQUE INDEX idx_admin_analytics_summary_mv_id ON admin_analytics_summary_mv (id);

CREATE OR REPLACE FUNCTION refresh_admin_analytics_summary_mv()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  REFRESH MATERIALIZED VIEW CONCURRENTLY admin_analytics_summary_mv;
  RETURN NULL;
END;
$$;

-- Trigger to refresh when orders change
DROP TRIGGER IF EXISTS trigger_refresh_admin_analytics_mv ON orders;
CREATE TRIGGER trigger_refresh_admin_analytics_mv
AFTER INSERT OR UPDATE OR DELETE ON orders
FOR EACH STATEMENT
EXECUTE FUNCTION refresh_admin_analytics_summary_mv();

-- Update the RPC to use the Materialized View
CREATE OR REPLACE FUNCTION admin_get_analytics_summary()
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_result JSON;
BEGIN
  -- Verify caller is staff
  IF NOT EXISTS (
    SELECT 1 FROM user_roles 
    WHERE user_id = auth.uid() 
    AND role IN ('admin', 'owner', 'order_manager', 'inventory_manager')
  ) THEN
    RAISE EXCEPTION 'Access denied';
  END IF;

  SELECT json_build_object(
    'total_revenue', total_revenue,
    'total_orders', total_orders,
    'active_customers', active_customers,
    'revenue_by_month', revenue_by_month
  )
  INTO v_result
  FROM admin_analytics_summary_mv
  WHERE id = 1;

  RETURN COALESCE(v_result, json_build_object(
    'total_revenue', 0,
    'total_orders', 0,
    'active_customers', 0,
    'revenue_by_month', '[]'::json
  ));
END;
$$;
