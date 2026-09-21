import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { ArrowUpRight, Users, ShoppingBag, DollarSign } from 'lucide-react';
import { RevenueChart } from '../../components/charts/RevenueChart';
import { MonthlyTargetChart } from '../../components/charts/MonthlyTargetChart';
import { AnalyticsRepository } from '../../features/analytics/analytics-repository';
export const metadata = { title: 'Overview - Kicks Admin' };


export default async function DashboardPage() {
  const analytics = await AnalyticsRepository.getSummary();

  const chartData = analytics.revenue_by_month.map(m => ({
    name: m.month,
    revenue: m.revenue,
    target: 0 // Mock target
  }));

  // Current and previous month revenue for tracking
  const currentMonthRevenue = chartData.length > 0 ? chartData[chartData.length - 1].revenue : 0;
  const previousMonthRevenue = chartData.length > 1 ? chartData[chartData.length - 2].revenue : 0;

  let trend = 0;
  if (previousMonthRevenue > 0) {
    trend = ((currentMonthRevenue - previousMonthRevenue) / previousMonthRevenue) * 100;
  } else if (currentMonthRevenue > 0 && previousMonthRevenue === 0) {
    trend = 100;
  }
  
  return (
    <div className="space-y-6 pb-12 max-w-7xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold tracking-tight text-foreground">Dashboard</h1>
          <p className="text-sm text-muted-foreground mt-1">Operations & Analytics Overview</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card className="bg-brand-primary text-white border-transparent animate-fade-in-up" style={{ animationDelay: '0ms', opacity: 0 }}>
          <CardContent className="p-5">
            <div className="flex justify-between items-start">
              <div className="space-y-1">
                <p className="text-xs font-medium text-white/70 uppercase tracking-wider">Total Revenue</p>
                <p className="text-2xl font-bold tabular-nums tracking-tight">${analytics.total_revenue.toLocaleString('en-US', { minimumFractionDigits: 2 })}</p>
              </div>
              <div className="p-1.5 bg-white/10 rounded-md">
                <DollarSign className="text-white" size={16} />
              </div>
            </div>
            <div className="mt-4 flex items-center text-xs text-white/90 font-medium">
              Lifetime sales (excluding cancelled)
            </div>
          </CardContent>
        </Card>

        <Card className="animate-fade-in-up" style={{ animationDelay: '50ms', opacity: 0 }}>
          <CardContent className="p-5">
            <div className="flex justify-between items-start">
              <div className="space-y-1">
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Active Customers</p>
                <p className="text-2xl font-bold tabular-nums tracking-tight">{analytics.active_customers.toLocaleString()}</p>
              </div>
              <div className="p-1.5 bg-brand-primary/10 rounded-md">
                <Users className="text-brand-primary" size={16} />
              </div>
            </div>
            <div className="mt-4 flex items-center text-xs text-emerald-600 dark:text-emerald-400 font-medium">
              With at least 1 order
            </div>
          </CardContent>
        </Card>

        <Card className="animate-fade-in-up" style={{ animationDelay: '100ms', opacity: 0 }}>
          <CardContent className="p-5">
            <div className="flex justify-between items-start">
              <div className="space-y-1">
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Total Orders</p>
                <p className="text-2xl font-bold tabular-nums tracking-tight">{analytics.total_orders.toLocaleString()}</p>
              </div>
              <div className="p-1.5 bg-brand-primary/10 rounded-md">
                <ShoppingBag className="text-brand-primary" size={16} />
              </div>
            </div>
            <div className="mt-4 flex items-center text-xs text-muted-foreground font-medium">
              Processed through the system
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 animate-fade-in-up" style={{ animationDelay: '200ms', opacity: 0 }}>
          <CardHeader className="flex flex-row items-center justify-between pb-2 border-b border-border/50">
            <div className="space-y-1">
              <CardTitle className="text-base font-semibold">Revenue Overview</CardTitle>
              <p className="text-xs text-muted-foreground">Monthly performance for the last 6 months</p>
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="h-[300px]">
              <RevenueChart data={chartData.length > 0 ? chartData : [{ name: 'No data', revenue: 0, target: 0 }]} />
            </div>
          </CardContent>
        </Card>

        <Card className="animate-fade-in-up" style={{ animationDelay: '250ms', opacity: 0 }}>
          <CardHeader className="pb-2 border-b border-border/50">
            <CardTitle className="text-base font-semibold">Monthly Target</CardTitle>
            <p className="text-xs text-muted-foreground">Current month tracking</p>
          </CardHeader>
          <CardContent className="pt-6 flex flex-col items-center justify-center h-[300px]">
            <MonthlyTargetChart value={(currentMonthRevenue / 10000) * 100} trend={trend} />
            <div className="mt-6 text-center">
              <p className="text-2xl font-bold tracking-tight">${currentMonthRevenue.toLocaleString()}</p>
              <p className="text-sm text-muted-foreground mt-1">of $10,000 target</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
