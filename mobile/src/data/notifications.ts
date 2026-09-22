import { Notification } from '../types';

export const notifications: Notification[] = [
  {
    id: 'n1',
    title: 'Order Delivered',
    message: 'Your Nike Air Zoom has been delivered to your address.',
    date: '2026-09-03T16:00:00Z',
    type: 'Order',
    isRead: false
  },
  {
    id: 'n2',
    title: 'New Release: Puma RS-X',
    message: 'The highly anticipated Puma RS-X drops tomorrow. Be the first to grab a pair!',
    date: '2026-09-05T09:00:00Z',
    type: 'Release',
    isRead: true
  },
  {
    id: 'n3',
    title: 'Flash Sale: 20% Off',
    message: 'Use code KICKS20 at checkout for 20% off all Lifestyle sneakers.',
    date: '2026-09-06T12:00:00Z',
    type: 'Promo',
    isRead: true
  }
];
