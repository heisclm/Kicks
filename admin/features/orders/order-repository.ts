import { Order } from './order-types';

export const MOCK_ORDERS: Order[] = [
  {
    id: 'ord_1',
    orderNumber: 'ORD-7392',
    createdAt: '2023-10-24T09:24:00Z',
    customer: {
      id: 'cust_1',
      name: 'Michael Chen',
      email: 'm.chen@example.com'
    },
    items: [
      {
        id: 'item_1',
        productId: 'prod_1',
        productName: 'Air Jordan 1 Retro High',
        size: 'US 10',
        quantity: 1,
        price: 180.00,
        image: 'https://images.unsplash.com/photo-1597045566677-8cf032ed6634?w=500&q=80'
      }
    ],
    totalAmount: 180.00,
    status: 'DELIVERED',
    paymentMethod: 'Apple Pay',
    shippingAddress: '123 Sneaker St, NY 10001'
  },
  {
    id: 'ord_2',
    orderNumber: 'ORD-7393',
    createdAt: '2023-10-24T14:12:00Z',
    customer: {
      id: 'cust_2',
      name: 'Sarah Jenkins',
      email: 'sarah.j@example.com'
    },
    items: [
      {
        id: 'item_2',
        productId: 'prod_2',
        productName: 'Nike Dunk Low Panda',
        size: 'US 7',
        quantity: 2,
        price: 110.00,
        image: 'https://images.unsplash.com/photo-1597045566677-8cf032ed6634?w=500&q=80'
      }
    ],
    totalAmount: 220.00,
    status: 'SHIPPED',
    paymentMethod: 'Credit Card',
    shippingAddress: '456 High St, CA 90210'
  },
  {
    id: 'ord_3',
    orderNumber: 'ORD-7394',
    createdAt: '2023-10-25T08:45:00Z',
    customer: {
      id: 'cust_3',
      name: 'David Rodriguez',
      email: 'd.rod@example.com'
    },
    items: [
      {
        id: 'item_3',
        productId: 'prod_3',
        productName: 'Yeezy Boost 350 V2',
        size: 'US 9.5',
        quantity: 1,
        price: 230.00,
        image: 'https://images.unsplash.com/photo-1597045566677-8cf032ed6634?w=500&q=80'
      }
    ],
    totalAmount: 230.00,
    status: 'PROCESSING',
    paymentMethod: 'PayPal',
    shippingAddress: '789 Boost Ave, TX 75001'
  },
  {
    id: 'ord_4',
    orderNumber: 'ORD-7395',
    createdAt: '2023-10-25T11:30:00Z',
    customer: {
      id: 'cust_4',
      name: 'Emma Watson',
      email: 'emma.w@example.com'
    },
    items: [
      {
        id: 'item_4',
        productId: 'prod_1',
        productName: 'Air Jordan 1 Retro High',
        size: 'US 6',
        quantity: 1,
        price: 180.00,
        image: 'https://images.unsplash.com/photo-1597045566677-8cf032ed6634?w=500&q=80'
      }
    ],
    totalAmount: 180.00,
    status: 'PENDING',
    paymentMethod: 'Credit Card',
    shippingAddress: '321 Retro Blvd, FL 33101'
  },
  {
    id: 'ord_5',
    orderNumber: 'ORD-7396',
    createdAt: '2023-10-25T16:20:00Z',
    customer: {
      id: 'cust_5',
      name: 'Marcus Johnson',
      email: 'mjohnson@example.com'
    },
    items: [
      {
        id: 'item_5',
        productId: 'prod_4',
        productName: 'New Balance 550',
        size: 'US 11',
        quantity: 1,
        price: 120.00,
        image: 'https://images.unsplash.com/photo-1597045566677-8cf032ed6634?w=500&q=80'
      },
      {
        id: 'item_6',
        productId: 'prod_5',
        productName: 'Nike Air Force 1',
        size: 'US 11',
        quantity: 1,
        price: 110.00,
        image: 'https://images.unsplash.com/photo-1597045566677-8cf032ed6634?w=500&q=80'
      }
    ],
    totalAmount: 230.00,
    status: 'CANCELLED',
    paymentMethod: 'Credit Card',
    shippingAddress: '555 Balance Way, MA 02108'
  }
];

export class OrderRepository {
  static async getOrders(): Promise<Order[]> {
    // Simulate network delay for realistic loading state
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(MOCK_ORDERS);
      }, 600);
    });
  }

  static async getOrderById(id: string): Promise<Order | undefined> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(MOCK_ORDERS.find(o => o.id === id));
      }, 300);
    });
  }
}
