import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { ArrowUpRight, ArrowDownRight, Activity } from 'lucide-react';
import { MOCK_TOP_PRODUCTS, MOCK_REVENUE_DATA } from '../../features/dashboard/dashboard-data';
import { RevenueChart } from '../../components/charts/RevenueChart';
import { MonthlyTargetChart } from '../../components/charts/MonthlyTargetChart';

export default function DashboardPage() {
  return (
    <div className="space-y-6 pb-12">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold tracking-tight text-foreground">Dashboard</h1>
          <p className="text-sm text-muted-foreground mt-1">Operations & Analytics Overview</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-brand-primary text-white border-transparent animate-fade-in-up" style={{ animationDelay: '0ms', opacity: 0 }}>
          <CardContent className="p-5">
            <div className="flex justify-between items-start">
              <div className="space-y-1">
                <p className="text-xs font-medium text-white/70 uppercase tracking-wider">Total Revenue</p>
                <p className="text-2xl font-bold tabular-nums tracking-tight">$8,136.25</p>
              </div>
              <div className="p-1.5 bg-white/10 rounded-md">
                <ArrowUpRight className="text-white" size={16} />
              </div>
            </div>
            <div className="mt-4 flex items-center text-xs text-white/90 font-medium">
              <span>+12.5%</span>
              <span className="text-white/60 ml-1.5 font-normal">from last month</span>
            </div>
          </CardContent>
        </Card>

        <Card className="animate-fade-in-up" style={{ animationDelay: '100ms', opacity: 0 }}>
          <CardContent className="p-5">
            <div className="flex justify-between items-start">
              <div className="space-y-1">
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Total Orders</p>
                <p className="text-2xl font-bold tabular-nums tracking-tight text-foreground">1,245</p>
              </div>
              <div className="p-1.5 bg-muted rounded-md border border-border">
                <ArrowUpRight className="text-foreground/70" size={16} />
              </div>
            </div>
            <div className="mt-4 flex items-center text-xs text-emerald-600 dark:text-emerald-400 font-medium">
              <span>+8.2%</span>
              <span className="text-muted-foreground ml-1.5 font-normal">from last month</span>
            </div>
          </CardContent>
        </Card>

        <Card className="animate-fade-in-up" style={{ animationDelay: '200ms', opacity: 0 }}>
          <CardContent className="p-5">
            <div className="flex justify-between items-start">
              <div className="space-y-1">
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Products Sold</p>
                <p className="text-2xl font-bold tabular-nums tracking-tight text-foreground">3,892</p>
              </div>
              <div className="p-1.5 bg-muted rounded-md border border-border">
                <ArrowDownRight className="text-foreground/70" size={16} />
              </div>
            </div>
            <div className="mt-4 flex items-center text-xs text-rose-500 dark:text-rose-400 font-medium">
              <span>-2.4%</span>
              <span className="text-muted-foreground ml-1.5 font-normal">from last month</span>
            </div>
          </CardContent>
        </Card>

        <Card className="animate-fade-in-up" style={{ animationDelay: '300ms', opacity: 0 }}>
          <CardContent className="p-5">
            <div className="flex justify-between items-start">
              <div className="space-y-1">
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Active Customers</p>
                <p className="text-2xl font-bold tabular-nums tracking-tight text-foreground">8,549</p>
              </div>
              <div className="p-1.5 bg-muted rounded-md border border-border">
                <ArrowUpRight className="text-foreground/70" size={16} />
              </div>
            </div>
            <div className="mt-4 flex items-center text-xs text-emerald-600 dark:text-emerald-400 font-medium">
              <span>+18.2%</span>
              <span className="text-muted-foreground ml-1.5 font-normal">from last month</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card className="lg:col-span-2 animate-fade-in-up" style={{ animationDelay: '400ms', opacity: 0 }}>
          <CardHeader className="flex flex-row items-center justify-between pb-2 border-b border-border/50">
            <CardTitle className="text-sm">Sales Statistic</CardTitle>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 bg-muted text-muted-foreground text-[10px] uppercase tracking-wider font-semibold rounded-sm">Weekly</span>
            </div>
          </CardHeader>
          <CardContent>
            <div className="mt-6">
              <RevenueChart data={MOCK_REVENUE_DATA} />
            </div>
          </CardContent>
        </Card>

        <div className="space-y-4">
          <Card className="animate-fade-in-up" style={{ animationDelay: '500ms', opacity: 0 }}>
            <CardHeader className="flex flex-row items-center justify-between pb-4 border-b-0">
              <CardTitle className="text-sm font-semibold text-foreground">Monthly Target</CardTitle>
              <div className="p-1.5 bg-muted rounded-full">
                <ArrowUpRight className="text-foreground/70" size={14} />
              </div>
            </CardHeader>
            <CardContent>
              <MonthlyTargetChart value={76.65} />
              
              <div className="text-center mt-2">
                <p className="text-[11px] text-muted-foreground">You&apos;ve achieved a daily income of <span className="font-semibold text-emerald-600 dark:text-emerald-400 tabular-nums">$1,982</span>.</p>
                <p className="text-[11px] text-muted-foreground mt-0.5">It&apos;s higher than last month.</p>
              </div>

              {/* 3-Column Footer Stats */}
              <div className="grid grid-cols-3 gap-2 pt-5 mt-5 border-t border-border/40">
                <div className="text-center">
                  <p className="text-[10px] text-muted-foreground mb-1 tracking-wide">Target</p>
                  <div className="flex items-center justify-center gap-1 font-semibold text-foreground text-sm tabular-nums">
                    <ArrowUpRight size={12} className="text-emerald-500" /> $20k
                  </div>
                </div>
                <div className="text-center border-l border-r border-border/40">
                  <p className="text-[10px] text-muted-foreground mb-1 tracking-wide">Revenue</p>
                  <div className="flex items-center justify-center gap-1 font-semibold text-foreground text-sm tabular-nums">
                    <ArrowDownRight size={12} className="text-rose-500" /> $16k
                  </div>
                </div>
                <div className="text-center">
                  <p className="text-[10px] text-muted-foreground mb-1 tracking-wide">Today</p>
                  <div className="flex items-center justify-center gap-1 font-semibold text-foreground text-sm tabular-nums">
                    <ArrowUpRight size={12} className="text-emerald-500" /> $1.2k
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="pt-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-semibold tracking-tight text-foreground">Top Products</h2>
          <select className="text-xs bg-transparent border-none text-muted-foreground hover:text-foreground font-medium outline-none cursor-pointer">
            <option className="bg-background text-foreground">This Month</option>
            <option className="bg-background text-foreground">Last Month</option>
          </select>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {MOCK_TOP_PRODUCTS.map((product) => (
            <Card key={product.id} className="group cursor-pointer overflow-hidden transition-colors hover:border-brand-primary/30 hover:shadow-elevated">
              <div className="p-4 bg-muted/30 flex justify-center items-center h-40 relative border-b border-border/50">
                {product.discount > 0 && (
                  <div className="absolute top-2 right-2 bg-rose-50 text-rose-700 dark:bg-rose-500/10 dark:text-rose-400 text-[10px] font-bold px-1.5 py-0.5 rounded-sm">
                    -{product.discount}%
                  </div>
                )}
                <Image 
                  src={product.image} 
                  alt={product.name} 
                  width={160} 
                  height={120} 
                  className="object-contain drop-shadow-xl group-hover:scale-105 transition-transform duration-300 ease-out"
                />
              </div>
              <CardContent className="p-4">
                <p className="text-[10px] font-semibold text-muted-foreground mb-1 tracking-wider uppercase">{product.brand}</p>
                <h3 className="text-sm font-medium text-foreground mb-2 truncate">{product.name}</h3>
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-sm tabular-nums text-foreground">${product.price.toFixed(2)}</span>
                  {product.comparePrice > 0 && (
                    <span className="text-xs tabular-nums text-muted-foreground line-through">${product.comparePrice.toFixed(2)}</span>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
          
          {MOCK_TOP_PRODUCTS.length < 4 && (
            <div className="rounded-xl border border-dashed border-border flex flex-col items-center justify-center p-6 text-muted-foreground h-[240px] bg-muted/10">
              <Activity className="h-6 w-6 mb-2 opacity-40" />
              <span className="text-xs font-medium">No more data</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
