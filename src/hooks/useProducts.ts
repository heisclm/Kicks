import { useQuery } from '@tanstack/react-query';
import { ProductService } from '../services/ProductService';
import { Product } from '../types';

export function useProducts() {
  return useQuery<Product[], Error>({
    queryKey: ['products'],
    queryFn: () => ProductService.getProducts(),
  });
}

export function useTrendingProducts() {
  return useQuery<Product[], Error>({
    queryKey: ['products', 'trending'],
    queryFn: () => ProductService.getTrendingProducts(),
  });
}

export function useProduct(id: string) {
  return useQuery<Product, Error>({
    queryKey: ['products', id],
    queryFn: () => ProductService.getProductById(id),
    enabled: !!id,
  });
}
