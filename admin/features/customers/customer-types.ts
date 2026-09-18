export interface CustomerSummary {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  total_orders: number;
  total_spent: number;
  created_at: string;
}

export interface CustomerFilters {
  search?: string;
}
