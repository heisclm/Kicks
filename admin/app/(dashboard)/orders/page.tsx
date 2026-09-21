import { Download, Search, Filter, ArrowUpDown, Eye } from 'lucide-react';
import { OrderRepository } from '../../../features/orders/order-repository';
import { OrderStatus } from '../../../features/orders/order-types';
import { Card } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { Badge } from '../../../components/ui/badge';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '../../../components/ui/table';
import Link from 'next/link';

function getOrderStatusBadge(status: OrderStatus) {
  switch (status) {
    case 'delivered':
      return <Badge variant="success">Delivered</Badge>;
    case 'shipped':
      return <Badge className="bg-brand-secondary text-white dark:bg-brand-secondary/80">Shipped</Badge>;
    case 'processing':
      return <Badge className="bg-blue-50 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400">Processing</Badge>;
    case 'pending':
      return <Badge variant="warning">Pending</Badge>;
    case 'cancelled':
      return <Badge variant="destructive">Cancelled</Badge>;
    default:
      return <Badge variant="outline">{status}</Badge>;
  }
}

function formatDate(dateString: string) {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit'
  }).format(date);
}

export default async function OrdersPage() {
  const orders = await OrderRepository.getOrders();

  return (
    <div className="space-y-6 pb-12 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-semibold tracking-tight text-foreground">Orders</h1>
          <p className="text-sm text-muted-foreground mt-1">Manage and track customer orders.</p>
        </div>
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Button variant="outline" className="flex-1 sm:flex-none h-9 gap-1.5">
            <Download size={14} />
            Export CSV
          </Button>
        </div>
      </div>

      <Card className="overflow-hidden">
        <div className="p-3 border-b border-border flex flex-col sm:flex-row sm:items-center gap-3 justify-between bg-card">
          <div className="relative w-full sm:max-w-xs">
            <div className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none">
              <Search className="h-3.5 w-3.5 text-muted-foreground" />
            </div>
            <input
              type="text"
              className="block w-full pl-8 pr-3 py-1.5 border border-border rounded-md text-xs bg-muted/50 placeholder-muted-foreground focus:outline-none focus:bg-card focus:border-brand-primary focus:ring-1 focus:ring-brand-primary transition-colors"
              placeholder="Search by order ID, email, or name..."
            />
          </div>
          <div className="flex items-center gap-1.5 w-full sm:w-auto">
            <Button variant="outline" size="sm" className="h-8 gap-1.5 text-foreground flex-1 sm:flex-none">
              <Filter size={12} />
              Filter
            </Button>
            <Button variant="outline" size="sm" className="h-8 gap-1.5 text-foreground flex-1 sm:flex-none">
              Status
            </Button>
            <Button variant="outline" size="sm" className="h-8 gap-1.5 text-foreground flex-1 sm:flex-none">
              Date
            </Button>
          </div>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[120px]">Order ID</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>
                <div className="flex items-center gap-1.5 cursor-pointer hover:text-foreground transition-colors">
                  Date
                  <ArrowUpDown size={12} />
                </div>
              </TableHead>
              <TableHead className="text-right">Total</TableHead>
              <TableHead className="text-center">Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-10 text-muted-foreground">
                  No orders found.
                </TableCell>
              </TableRow>
            ) : orders.map((order, index) => {
              const customerName = order.customer ? `${order.customer.first_name} ${order.customer.last_name}` : 'Unknown';
              const customerInitials = customerName.split(' ').map(n => n[0]).join('').substring(0, 2);
              const itemCount = order.items?.length || 0;

              return (
                <TableRow 
                  key={order.id} 
                  className="group animate-fade-in-up hover:bg-muted/30 transition-colors"
                  style={{ animationDelay: `${index * 50}ms`, opacity: 0 }}
                >
                  <TableCell className="font-semibold text-foreground text-sm tracking-tight">
                    {order.id.split('-')[0].toUpperCase()}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-full bg-brand-primary/10 text-brand-primary flex items-center justify-center text-[11px] font-bold shrink-0">
                        {customerInitials}
                      </div>
                      <div>
                        <div className="font-medium text-sm text-foreground">{customerName}</div>
                        <div className="text-[11px] text-muted-foreground mt-0.5">{order.customer?.email || 'N/A'}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground tabular-nums">
                    {formatDate(order.created_at)}
                  </TableCell>
                  <TableCell className="text-right font-medium text-sm tabular-nums text-foreground">
                    ${order.total_amount.toFixed(2)}
                    <div className="text-[10px] text-muted-foreground mt-0.5 font-normal tracking-wide uppercase">
                      {itemCount} {itemCount === 1 ? 'item' : 'items'}
                    </div>
                  </TableCell>
                  <TableCell className="text-center">
                    {getOrderStatusBadge(order.status)}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Link href={`/orders/${order.id}`}>
                        <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground hover:text-foreground">
                          <Eye size={14} />
                        </Button>
                      </Link>
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>

        <div className="p-3 border-t border-border bg-card flex items-center justify-between text-xs text-muted-foreground">
          <div>
            Showing <span className="font-medium text-foreground tabular-nums">{orders.length > 0 ? 1 : 0}</span> to <span className="font-medium text-foreground tabular-nums">{orders.length}</span> of <span className="font-medium text-foreground tabular-nums">{orders.length}</span> orders
          </div>
          <div className="flex gap-1.5">
            <Button variant="outline" size="sm" disabled className="h-7 text-[11px]">Previous</Button>
            <Button variant="outline" size="sm" disabled className="h-7 text-[11px]">Next</Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
