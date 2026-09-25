import { CreateBrandInput, UpdateBrandInput } from '../../lib/validation/brand';
import { createClient } from '../../utils/supabase/server';

export interface Brand {
  id: string;
  name: string;
  slug?: string;
  description?: string;
  logo_url?: string;
  is_active: boolean;
  created_at: string;
}



export class BrandRepository {
  static async getBrands(): Promise<Brand[]> {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('brands')
      .select('*')
      .order('name', { ascending: true });

    if (error) {
      console.error('BrandRepository.getBrands error:', error);
      throw new Error('Failed to fetch brands');
    }

    return data || [];
  }

  static async createBrand(input: CreateBrandInput): Promise<Brand> {
    const supabase = await createClient();
    const slug = input.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    
    const { data, error } = await supabase
      .from('brands')
      .insert([{
        name: input.name,
        slug: slug,
        description: input.description,
        logo_url: input.logo_url
      }])
      .select()
      .single();

    if (error) {
      console.error('BrandRepository.createBrand error:', error);
      throw new Error(error.message);
    }

    return data;
  }

  static async updateBrand(input: UpdateBrandInput): Promise<Brand> {
    const supabase = await createClient();
    const slug = input.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    
    const { data, error } = await supabase
      .from('brands')
      .update({
        name: input.name,
        slug: slug,
        description: input.description,
        logo_url: input.logo_url
      })
      .eq('id', input.id)
      .select()
      .single();

    if (error) throw new Error(error.message);
    return data;
  }

  static async deleteBrand(id: string): Promise<void> {
    const supabase = await createClient();
    const { error } = await supabase
      .from('brands')
      .delete()
      .eq('id', id);

    if (error) throw new Error(error.message);
  }
}