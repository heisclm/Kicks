export interface Review {
  id: string;
  user_id: string;
  product_id: string;
  order_item_id: string;
  rating: number;
  comment: string | null;
  created_at: string;
  updated_at: string;
  customer?: {
    first_name: string;
    last_name: string;
  };
  product?: {
    name: string;
  };
}
