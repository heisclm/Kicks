export type ProductStatus = 'IN_STOCK' | 'LOW_STOCK' | 'OUT_OF_STOCK' | 'DRAFT';

export interface Product {
  brand_id: string;
  category_id: string;
  description: string;
  is_active: boolean;
  id: string;
  name: string;
  brand: string;
  category: string;
  price: number;
  compareAtPrice?: number;
  stock: number;
  status: ProductStatus;
  image: string;
  createdAt: string;
}

export interface ProductFilters {
  search?: string;
  brand?: string;
  status?: ProductStatus;
}
