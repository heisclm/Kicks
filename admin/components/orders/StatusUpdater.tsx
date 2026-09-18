'use client';

import { useTransition } from 'react';
import { updateOrderStatusAction } from '../../features/orders/order-actions';
import { OrderStatus } from '../../features/orders/order-types';
import { Select } from '../ui/select';

interface Props {
  orderId: string;
  currentStatus: OrderStatus;
}

export function StatusUpdater({ orderId, currentStatus }: Props) {
  const [isPending, startTransition] = useTransition();

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newStatus = e.target.value;
    startTransition(async () => {
      const formData = new FormData();
      formData.append('id', orderId);
      formData.append('status', newStatus);

      const result = await updateOrderStatusAction(formData);
      if (!result.success) {
        alert(result.error || 'Failed to update order status');
      }
    });
  };

  return (
    <Select defaultValue={currentStatus} onChange={handleStatusChange} disabled={isPending} className="w-[160px]">
      <option value="pending">Pending</option>
      <option value="processing">Processing</option>
      <option value="shipped">Shipped</option>
      <option value="delivered">Delivered</option>
      <option value="cancelled">Cancelled</option>
    </Select>
  );
}
