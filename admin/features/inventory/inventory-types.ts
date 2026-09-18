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

export interface InventoryMovementRecord {
  id: string;
  variant_id: string;
  quantity_change: number;
  previous_quantity: number;
  new_quantity: number;
  reason: string;
  note?: string;
  created_by: string;
  created_at: string;
  // Joined fields
  product_name: string;
  sku: string;
  color_name: string;
  size: number;
  performed_by_name: string;
  performed_by_email: string;
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

export interface InventoryHistoryFilters {
  search?: string;
  reason?: string;
  startDate?: string;
  endDate?: string;
  page?: number;
  limit?: number;
}
