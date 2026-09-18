import { InventoryStatus } from '../../features/inventory/inventory-types';
import { Badge } from '../ui/badge';

export function InventoryStatusBadge({ status }: { status: InventoryStatus }) {
  switch (status) {
    case 'IN_STOCK':
      return <Badge variant="success">In Stock</Badge>;
    case 'LOW_STOCK':
      return <Badge variant="warning">Low Stock</Badge>;
    case 'OUT_OF_STOCK':
      return <Badge variant="destructive">Out of Stock</Badge>;
    default:
      return <Badge variant="outline">{status}</Badge>;
  }
}
