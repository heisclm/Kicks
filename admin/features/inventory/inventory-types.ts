export type InventoryStatus = 'IN_STOCK' | 'LOW_STOCK' | 'OUT_OF_STOCK';

export interface InventoryItem {
  variant_id: string;
  product_id: string;
  product_name: string;
  brand_name: string;
  color_name: string;
  size: number;
  sku: string;
  stock_quantity: number;
  status: InventoryStatus;
  updated_at: string;
}

export interface InventoryMovement {
  id: string;
  variant_id: string;
  quantity_change: number;
  previous_quantity: number;
  new_quantity: number;
  reason: string;
  note?: string;
  created_by: string;
  created_at: string;
}

export interface StockAdjustmentInput {
  variant_id: string;
  quantity_change: number;
  reason: string;
  note?: string;
}

export interface InventoryFilters {
  search?: string;
  status?: InventoryStatus;
  brand_name?: string;
}
