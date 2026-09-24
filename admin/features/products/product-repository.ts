import { CreateProductInput, UpdateProductInput } from '../../lib/validation/product';
/* eslint-disable @typescript-eslint/no-explicit-any */
// Disable explicit-any due to untyped generic return values from Supabase dynamic joins.
import { createClient } from '../../utils/supabase/server';
import { Product, ProductFilters, ProductStatus } from './product-types';

export class ProductRepository {
  /**
   * Retrieves a list of products based on filters from Supabase.
   */
  static async getProducts(filters?: ProductFilters): Promise<Product[]> {
    const supabase = await createClient();
    
    // Fetch products along with related brand, category, variants, and images
    const { data, error } = await supabase
      .from('products')
      .select(`
        id,
        name,
        base_price,
        is_active,
        created_at,
        brand_id,
        category_id,
        description,
        tags,
        brands ( name ),
        categories ( name ),
        product_variants ( stock_quantity ),
        product_images ( image_url )
      `)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching products:', error.message);
      return [];
    }

    // Process and map the database rows to the Product UI model
    let results: Product[] = (data || []).map((row: Record<string, unknown>) => {
      const variants = (row.product_variants as any[]) || [];
      const stock = variants.reduce((sum: number, v: any) => sum + (v.stock_quantity || 0), 0);
      
      let status: ProductStatus = 'DRAFT';
      if (!row.is_active) {
        status = 'DRAFT';
      } else if (stock === 0) {
        status = 'OUT_OF_STOCK';
      } else if (stock < 10) {
        status = 'LOW_STOCK';
      } else {
        status = 'IN_STOCK';
      }

      // Handle Supabase 1:1 join returning either array or object
      const brand = Array.isArray(row.brands as any) ? (row.brands as any)[0]?.name : (row.brands as any)?.name;
      const category = Array.isArray(row.categories as any) ? (row.categories as any)[0]?.name : (row.categories as any)?.name;
      const image = (row.product_images as any)?.[0]?.image_url || '/images/placeholder-shoe.png';

      return {
        id: row.id,
        name: row.name,
        description: (row.description as string) || '',
        brand_id: row.brand_id as string,
        category_id: row.category_id as string,
        is_active: !!row.is_active,
        brand: brand || 'Unknown Brand',
        category: category || 'Unknown Category',
        price: row.base_price,
        stock,
        status,
        image,
        createdAt: row.created_at,
        tags: (row.tags as string[]) || []
        } as Product;
    });

    // Apply client-side filters
    if (filters?.search) {
      const q = filters.search.toLowerCase();
      results = results.filter(
        (p) =>
          p.name.toLowerCase().includes(q) || 
          p.brand.toLowerCase().includes(q) ||
          p.tags?.some(tag => tag.toLowerCase().includes(q))
      );
    }

    if (filters?.brand) {
      results = results.filter((p) => p.brand === filters.brand);
    }

    if (filters?.status) {
      results = results.filter((p) => p.status === filters.status);
    }

    return results;
  }

  static async createProduct(input: CreateProductInput): Promise<Product> {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('products')
      .insert([{
        name: input.name,
        description: input.description,
        brand_id: input.brand_id,
        category_id: input.category_id,
        base_price: input.base_price,
        is_active: input.is_active,
        tags: input.tags || []
      }])
      .select()
      .single();

    if (error) throw new Error(error.message);
    
    // Insert image if provided
    if (input.image_url) {
      await supabase.from('product_images').insert([{
        product_id: data.id,
        image_url: input.image_url,
        is_primary: true,
        display_order: 0
      }]);
    }

    return data as unknown as Product; // Using bypass to match existing pattern for insert returns
  }

  static async updateProduct(input: UpdateProductInput): Promise<Product> {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('products')
      .update({
        name: input.name,
        description: input.description,
        brand_id: input.brand_id,
        category_id: input.category_id,
        base_price: input.base_price,
        is_active: input.is_active,
        tags: input.tags || []
      })
      .eq('id', input.id)
      .select()
      .single();

    if (error) throw new Error(error.message);
    return data as unknown as Product;
  }

  static async deleteProduct(id: string): Promise<void> {
    const supabase = await createClient();
    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', id);

    if (error) throw new Error(error.message);
  }
}