export interface MonthlyRevenue {
  month: string;
  revenue: number;
}

export interface AnalyticsSummary {
  total_revenue: number;
  total_orders: number;
  active_customers: number;
  revenue_by_month: MonthlyRevenue[];
}
