import { createClient } from '../../utils/supabase/server';
import { AnalyticsSummary } from './analytics-types';

export class AnalyticsRepository {
  static async getSummary(): Promise<AnalyticsSummary> {
    const supabase = await createClient();

    const { data, error } = await supabase.rpc('admin_get_analytics_summary');

    if (error) {
      console.error('Error fetching analytics summary:', error.message);
      // Fallback zero data
      return {
        total_revenue: 0,
        total_orders: 0,
        active_customers: 0,
        revenue_by_month: []
      };
    }

    return data as AnalyticsSummary;
  }
}
