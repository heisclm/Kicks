import { notFound } from 'next/navigation';
import { OrderRepository } from '../../../../features/orders/order-repository';
import { Card } from '../../../../components/ui/card';
import { Badge } from '../../../../components/ui/badge';
import { StatusUpdater } from '../../../../components/orders/StatusUpdater';
import { ArrowLeft, Package, User, MapPin, CreditCard } from 'lucide-react';
import Link from 'next/link';

export default async function OrderDetailsPage({ params }: { params: { id: string } }) {
  const order = await OrderRepository.getOrderById(params.id);

  if (!order) {
    notFound();
  }

  const customerName = order.customer ? `${order.customer.first_name} ${order.customer.last_name}` : 'Unknown';

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      <div className="flex items-center gap-2 mb-2">
        <Link href="/orders" className="text-muted-foreground hover:text-foreground transition-colors flex items-center gap-2 text-sm font-medium">
          <ArrowLeft size={16} />
          Back to Orders
        </Link>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-3">
            Order #{order.id.split('-')[0].toUpperCase()}
            <Badge variant="outline" className="text-xs font-normal uppercase tracking-wider">{order.status}</Badge>
          </h1>
          <p className="text-sm text-muted-foreground mt-1">Placed on {new Date(order.created_at).toLocaleString()}</p>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm font-medium text-muted-foreground">Update Status:</span>
          <StatusUpdater orderId={order.id} currentStatus={order.status} />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <Card className="p-6">
            <h2 className="text-lg font-semibold flex items-center gap-2 mb-4 border-b pb-2">
              <Package size={18} className="text-muted-foreground" />
              Order Items
            </h2>
            <div className="space-y-4">
              {order.items?.map((item) => (
                <div key={item.id} className="flex justify-between items-start border-b border-border pb-4 last:border-0 last:pb-0">
                  <div>
                    <div className="font-medium">{item.snapshot_name}</div>
                    <div className="text-sm text-muted-foreground mt-1">
                      SKU: <span className="font-mono">{item.snapshot_sku}</span> | 
                      Color: {item.snapshot_color} | 
                      Size: {item.snapshot_size}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-medium">${item.unit_price_at_purchase.toFixed(2)}</div>
                    <div className="text-sm text-muted-foreground">Qty: {item.quantity}</div>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <Card className="p-6">
            <h2 className="text-lg font-semibold flex items-center gap-2 mb-4 border-b pb-2">
              <CreditCard size={18} className="text-muted-foreground" />
              Payment Summary
            </h2>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Subtotal</span>
                <span>${order.subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Delivery Fee</span>
                <span>${order.delivery_fee.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Discount</span>
                <span className="text-destructive">-${order.discount_total.toFixed(2)}</span>
              </div>
              <div className="flex justify-between pt-2 border-t font-semibold text-base">
                <span>Total</span>
                <span>${order.total_amount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between pt-2">
                <span className="text-muted-foreground">Payment Status</span>
                <Badge variant={order.payment_status === 'paid' ? 'success' : 'warning'}>{order.payment_status}</Badge>
              </div>
            </div>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="p-6">
            <h2 className="text-lg font-semibold flex items-center gap-2 mb-4 border-b pb-2">
              <User size={18} className="text-muted-foreground" />
              Customer
            </h2>
            <div className="space-y-1">
              <div className="font-medium">{customerName}</div>
              <div className="text-sm text-muted-foreground">{order.customer?.email}</div>
            </div>
          </Card>

          <Card className="p-6">
            <h2 className="text-lg font-semibold flex items-center gap-2 mb-4 border-b pb-2">
              <MapPin size={18} className="text-muted-foreground" />
              Shipping
            </h2>
            <div className="text-sm space-y-1 text-muted-foreground">
              {/* Fallback rendering of JSONB shipping snapshot */}
              <pre className="whitespace-pre-wrap font-sans">
                {order.shipping_snapshot ? JSON.stringify(order.shipping_snapshot, null, 2) : 'No shipping details available'}
              </pre>
            </div>
            {order.tracking_number && (
              <div className="mt-4 pt-4 border-t border-border">
                <div className="text-sm font-medium mb-1">Tracking Number</div>
                <div className="text-sm text-muted-foreground font-mono">{order.tracking_number}</div>
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}
