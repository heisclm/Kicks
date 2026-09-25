export interface Product {
  id: string;
  name: string;
  subtitle: string;
  price: number;
  image: any;
  thumbnails?: any[];
  sizes: number[];
  availableSizes: number[];
  availableColors?: string[];
  description: string;
  brand: string;
  color: string;
  gender?: string;
  category: string;
  isFavorite?: boolean;
  isNew?: boolean;
  isTrending?: boolean;
  isOnSale?: boolean;
  discount?: number;
  rating: number;
  reviewCount: number;
  stockStatus: 'In Stock' | 'Low Stock' | 'Out of Stock';
}

export interface Brand {
  id: string;
  name: string;
  logo?: any;
  logo_url?: string | null;
}

export interface Category {
  id: string;
  name: string;
}

export interface CartItem {
  id: string; // Unique ID for the cart item itself (often just productId-size)
  productId: string;
  size: number;
  quantity: number;
  price: number;
}

export type OrderStatus = 'Pending' | 'Confirmed' | 'Processing' | 'Shipped' | 'Out for Delivery' | 'Delivered' | 'Cancelled';

export interface Order {
  id: string;
  date: string;
  status: OrderStatus;
  items: CartItem[];
  total: number;
  trackingNumber?: string;
}

export type NotificationType = 'Release' | 'Order' | 'Restock' | 'Promo';

export interface Notification {
  id: string;
  title: string;
  message: string;
  date: string;
  type: NotificationType;
  isRead: boolean;
}
