import { OrderRepository } from '../../../features/orders/order-repository';
import { OrdersClient } from './OrdersClient';

export default async function OrdersPage() {
  const orders = await OrderRepository.getOrders();

  return <OrdersClient data={orders} />;
}
