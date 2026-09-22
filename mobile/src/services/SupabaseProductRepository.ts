import { IProductRepository } from './ProductService';
import { Product } from '../types';
import { supabase } from '../api/supabase';

export class SupabaseProductRepository implements IProductRepository {
  async getProducts(): Promise<Product[]> {
    const { data, error } = await supabase
      .from('products')
      .select(`
        id,
        name,
        subtitle,
        description,
        gender,
        base_price,
        is_active,
        brand:brands (name),
        category:categories (name),
        images:product_images (image_url, is_primary),
        variants:product_variants (size, color_name, color_hex, stock_quantity)
      `)
      .eq('is_active', true);

    if (error) {
      console.error('Error fetching products:', error);
      throw error;
    }

    return this.mapToAppProduct(data);
  }

  async getProductById(id: string): Promise<Product> {
    const { data, error } = await supabase
      .from('products')
      .select(`
        id,
        name,
        subtitle,
        description,
        gender,
        base_price,
        is_active,
        brand:brands (name),
        category:categories (name),
        images:product_images (image_url, is_primary),
        variants:product_variants (size, color_name, color_hex, stock_quantity)
      `)
      .eq('id', id)
      .eq('is_active', true)
      .single();

    if (error) {
      console.error('Error fetching product by id:', error);
      throw error;
    }

    return this.mapToAppProduct([data])[0];
  }

  async getTrendingProducts(): Promise<Product[]> {
    // For now, returning top 5 products as 'trending'
    const { data, error } = await supabase
      .from('products')
      .select(`
        id,
        name,
        subtitle,
        description,
        gender,
        base_price,
        is_active,
        brand:brands (name),
        category:categories (name),
        images:product_images (image_url, is_primary),
        variants:product_variants (size, color_name, color_hex, stock_quantity)
      `)
      .eq('is_active', true)
      .limit(5);

    if (error) {
      console.error('Error fetching trending products:', error);
      throw error;
    }

    return this.mapToAppProduct(data);
  }

  // Maps Supabase relational schema back to the App's flat Product type for UI compatibility
  private mapToAppProduct(data: any[]): Product[] {
    return data.map((item) => {
      // Find primary image
      const primaryImage = item.images?.find((img: any) => img.is_primary) || item.images?.[0];
      
      // Extract unique sizes and total stock
      const sizes = Array.from(new Set(item.variants?.map((v: any) => v.size) || [])) as number[];
      const availableSizes = item.variants?.filter((v: any) => v.stock_quantity > 0).map((v: any) => v.size) || [];
      
      // Calculate stock status
      const totalStock = item.variants?.reduce((sum: number, v: any) => sum + v.stock_quantity, 0) || 0;
      let stockStatus: 'In Stock' | 'Low Stock' | 'Out of Stock' = 'Out of Stock';
      if (totalStock > 10) stockStatus = 'In Stock';
      else if (totalStock > 0) stockStatus = 'Low Stock';

      return {
        id: item.id,
        name: item.name,
        subtitle: item.subtitle || '',
        price: Number(item.base_price),
        image: primaryImage ? { uri: primaryImage.image_url } : null,
        thumbnails: item.images?.map((img: any) => ({ uri: img.image_url })) || [],
        sizes,
        availableSizes,
        description: item.description || '',
        brand: item.brand?.name || 'Unknown',
        color: item.variants?.[0]?.color_name || 'Multi',
        gender: item.gender,
        category: item.category?.name || 'Unknown',
        rating: 4.5, // Mocked until reviews are built
        reviewCount: 0,
        stockStatus,
      };
    });
  }
}
