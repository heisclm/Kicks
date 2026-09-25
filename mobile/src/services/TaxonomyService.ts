import { supabase } from '../api/supabase';

export interface Brand {
  id: string;
  name: string;
  slug: string;
  logo_url: string | null;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
}

class TaxonomyService {
  async getBrands(): Promise<Brand[]> {
    const { data, error } = await supabase.from('brands').select('*');
    if (error) console.error('Error fetching brands:', error);
    
    const brands = data || [];
    
    // Add "All" option at the beginning
    return [
      { id: 'all', name: 'All', slug: 'all', logo_url: null },
      ...brands
    ];
  }

  async getCategories(): Promise<Category[]> {
    const { data, error } = await supabase.from('categories').select('*');
    if (error) console.error('Error fetching categories:', error);
    return data || [];
  }
}

export const taxonomyService = new TaxonomyService();
