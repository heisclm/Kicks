import { Card, CardContent, CardHeader, CardTitle } from "../../../components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../../components/ui/table";
import { Input } from "../../../components/ui/input";
import { Button } from "../../../components/ui/button";
import { Search, Download, Plus, MoreHorizontal, Mail, MapPin } from "lucide-react";

// Mock customer data
const MOCK_CUSTOMERS = [
  { id: 'cus-1', name: 'Alexander Wright', email: 'alex.wright@example.com', location: 'New York, US', orders: 12, spent: 2450.00, tier: 'VIP', joined: 'Oct 2024' },
  { id: 'cus-2', name: 'Sophia Chen', email: 'schen.design@example.com', location: 'Toronto, CA', orders: 4, spent: 580.00, tier: 'Regular', joined: 'Jan 2025' },
  { id: 'cus-3', name: 'Marcus Johnson', email: 'mjohnson88@example.com', location: 'London, UK', orders: 1, spent: 150.00, tier: 'New', joined: 'Mar 2026' },
  { id: 'cus-4', name: 'Elena Rodriguez', email: 'elena.rod@example.com', location: 'Miami, US', orders: 8, spent: 1240.50, tier: 'Regular', joined: 'Nov 2025' },
  { id: 'cus-5', name: 'David Kim', email: 'dkim.sneakers@example.com', location: 'Seoul, KR', orders: 24, spent: 4890.00, tier: 'VIP', joined: 'Jun 2024' },
  { id: 'cus-6', name: 'Chloe Dubois', email: 'chloe.d@example.com', location: 'Paris, FR', orders: 2, spent: 320.00, tier: 'New', joined: 'Feb 2026' },
  { id: 'cus-7', name: 'James Wilson', email: 'jwilson.media@example.com', location: 'Sydney, AU', orders: 15, spent: 3100.00, tier: 'VIP', joined: 'Aug 2024' },
  { id: 'cus-8', name: 'Aisha Patel', email: 'apatel99@example.com', location: 'Chicago, US', orders: 5, spent: 780.00, tier: 'Regular', joined: 'Dec 2025' },
];

export default function CustomersPage() {
  return (
    <div className="space-y-6">
      {/* Header section with staggered animation */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 animate-fade-in-up" style={{ animationDelay: '0ms', opacity: 0 }}>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Customers</h1>
          <p className="text-sm text-muted-foreground mt-1">Manage your customer relationships and VIP tiers.</p>
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          <Button variant="outline" className="flex-1 sm:flex-none h-10 gap-2">
            <Download size={16} />
            Export CSV
          </Button>
          <Button className="flex-1 sm:flex-none h-10 gap-2 bg-brand-primary text-white hover:bg-brand-primary-hover border-transparent">
            <Plus size={16} />
            Add Customer
          </Button>
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 animate-fade-in-up" style={{ animationDelay: '100ms', opacity: 0 }}>
        <Card className="p-5">
          <div className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-1">Total Customers</div>
          <div className="text-3xl font-bold tabular-nums">12,482</div>
          <div className="text-xs text-emerald-500 mt-2 font-medium">+14% this month</div>
        </Card>
        <Card className="p-5">
          <div className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-1">Active (30d)</div>
          <div className="text-3xl font-bold tabular-nums">3,124</div>
          <div className="text-xs text-emerald-500 mt-2 font-medium">+5% this month</div>
        </Card>
        <Card className="p-5">
          <div className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-1">VIP Members</div>
          <div className="text-3xl font-bold tabular-nums text-brand-primary dark:text-brand-primary">892</div>
          <div className="text-xs text-muted-foreground mt-2 font-medium">Top 7% of customer base</div>
        </Card>
      </div>

      <Card className="animate-fade-in-up overflow-hidden" style={{ animationDelay: '200ms', opacity: 0 }}>
        <div className="p-4 border-b border-border/50 flex flex-col sm:flex-row justify-between gap-4">
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search customers..." className="pl-9 h-10 bg-muted/40 border-transparent focus:bg-card" />
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="h-10 text-foreground">All Tiers</Button>
            <Button variant="outline" size="sm" className="h-10 text-foreground">Recent</Button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[300px]">Customer</TableHead>
                <TableHead>Location</TableHead>
                <TableHead className="text-right">Orders</TableHead>
                <TableHead className="text-right">Total Spent</TableHead>
                <TableHead className="text-center">Tier</TableHead>
                <TableHead className="text-right"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {MOCK_CUSTOMERS.map((customer, index) => (
                <TableRow 
                  key={customer.id}
                  className="group cursor-pointer hover:bg-muted/30 transition-colors animate-fade-in-up"
                  style={{ animationDelay: `${300 + (index * 50)}ms`, opacity: 0 }}
                >
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-brand-primary/10 text-brand-primary flex items-center justify-center font-bold shrink-0">
                        {customer.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div>
                        <div className="font-medium text-sm text-foreground">{customer.name}</div>
                        <div className="text-xs text-muted-foreground mt-0.5 flex items-center gap-1">
                          <Mail size={10} />
                          {customer.email}
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                      <MapPin size={14} className="text-foreground/40" />
                      {customer.location}
                    </div>
                  </TableCell>
                  <TableCell className="text-right tabular-nums font-medium text-foreground">
                    {customer.orders}
                  </TableCell>
                  <TableCell className="text-right tabular-nums font-medium text-foreground">
                    ${customer.spent.toFixed(2)}
                  </TableCell>
                  <TableCell className="text-center">
                    <span className={`inline-flex items-center px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider ${
                      customer.tier === 'VIP' ? 'bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-400' :
                      customer.tier === 'New' ? 'bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-400' :
                      'bg-muted text-muted-foreground'
                    }`}>
                      {customer.tier}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="icon" className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity">
                      <MoreHorizontal size={16} />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </Card>
    </div>
  );
}
