-- 20260918000000_inventory_movements.sql

-- 1. Create inventory_movements table
CREATE TABLE IF NOT EXISTS inventory_movements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    variant_id UUID NOT NULL REFERENCES product_variants(id) ON DELETE CASCADE,
    quantity_change INT NOT NULL,
    previous_quantity INT NOT NULL CHECK (previous_quantity >= 0),
    new_quantity INT NOT NULL CHECK (new_quantity >= 0),
    reason TEXT NOT NULL,
    note TEXT,
    created_by UUID NOT NULL REFERENCES profiles(id),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 2. Enable RLS
ALTER TABLE inventory_movements ENABLE ROW LEVEL SECURITY;

-- 3. Add RLS Policies for inventory_movements
DROP POLICY IF EXISTS "Staff can insert inventory movements" ON inventory_movements;
CREATE POLICY "Staff can insert inventory movements" ON inventory_movements FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM user_roles WHERE user_roles.user_id = auth.uid() AND user_roles.role IN ('admin', 'owner', 'inventory_manager'))
);

DROP POLICY IF EXISTS "Staff can view inventory movements" ON inventory_movements;
CREATE POLICY "Staff can view inventory movements" ON inventory_movements FOR SELECT USING (
    EXISTS (SELECT 1 FROM user_roles WHERE user_roles.user_id = auth.uid() AND user_roles.role IN ('admin', 'owner', 'inventory_manager', 'support', 'order_manager'))
);

-- 4. Create an RPC function for atomic stock adjustment
CREATE OR REPLACE FUNCTION adjust_inventory_stock(
    p_variant_id UUID,
    p_change INT,
    p_reason TEXT,
    p_note TEXT
) RETURNS JSONB
LANGUAGE plpgsql
SECURITY INVOKER
AS $$
DECLARE
    v_previous_stock INT;
    v_new_stock INT;
    v_user_id UUID;
BEGIN
    -- Get current user
    v_user_id := auth.uid();
    
    IF v_user_id IS NULL THEN
        RAISE EXCEPTION 'Not authenticated';
    END IF;

    -- Lock the row for update to prevent concurrent modifications
    SELECT stock_quantity INTO v_previous_stock
    FROM product_variants
    WHERE id = p_variant_id
    FOR UPDATE;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'Variant not found';
    END IF;

    v_new_stock := v_previous_stock + p_change;

    IF v_new_stock < 0 THEN
        RAISE EXCEPTION 'Insufficient stock. Adjustment would result in negative inventory.';
    END IF;

    -- Update variant
    UPDATE product_variants
    SET stock_quantity = v_new_stock,
        updated_at = now()
    WHERE id = p_variant_id;

    -- Record movement
    INSERT INTO inventory_movements (
        variant_id,
        quantity_change,
        previous_quantity,
        new_quantity,
        reason,
        note,
        created_by
    ) VALUES (
        p_variant_id,
        p_change,
        v_previous_stock,
        v_new_stock,
        p_reason,
        p_note,
        v_user_id
    );

    RETURN jsonb_build_object(
        'success', true,
        'previous_stock', v_previous_stock,
        'new_stock', v_new_stock
    );
END;
$$;
