import { Order } from '../types';
import { products } from './products';

export const orders: Order[] = [
  {
    id: 'ORD-2026-9821',
    date: '2026-09-01T10:30:00Z',
    status: 'Delivered',
    total: 225,
    items: [
      {
        id: '2-40',
        productId: '2',
        size: 40,
        quantity: 1,
        price: 210
      }
    ],
    trackingNumber: 'TRK9988776655'
  },
  {
    id: 'ORD-2026-9943',
    date: '2026-09-05T14:15:00Z',
    status: 'Processing',
    total: 195,
    items: [
      {
        id: '1-42',
        productId: '1',
        size: 42,
        quantity: 1,
        price: 180
      }
    ]
  }
];
