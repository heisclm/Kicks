import { Product } from '../types';
import { products as mockProducts } from '../data/products';
import { apiClient } from '../api/client';

export interface IProductRepository {
  getProducts(): Promise<Product[]>;
  getProductById(id: string): Promise<Product>;
  getTrendingProducts(): Promise<Product[]>;
}

// Development Mock Repository
export class MockProductRepository implements IProductRepository {
  private async delay(ms: number = 800) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  async getProducts(): Promise<Product[]> {
    await this.delay();
    return [...mockProducts];
  }

  async getProductById(id: string): Promise<Product> {
    await this.delay(500);
    const product = mockProducts.find(p => p.id === id);
    if (!product) {
      throw { message: 'Product not found', status: 404 };
    }
    return product;
  }

  async getTrendingProducts(): Promise<Product[]> {
    await this.delay(600);
    return mockProducts.filter(p => p.isTrending);
  }
}

import { SupabaseProductRepository } from './SupabaseProductRepository';

export const ProductService: IProductRepository = new SupabaseProductRepository();