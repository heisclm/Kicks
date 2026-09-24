const fs = require('fs');
let content = `import { supabase } from '../api/supabase';

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
    return data || [];
  }

  async getCategories(): Promise<Category[]> {
    const { data, error } = await supabase.from('categories').select('*');
    if (error) console.error('Error fetching categories:', error);
    return data || [];
  }
}

export const taxonomyService = new TaxonomyService();
`;
fs.writeFileSync('mobile/src/services/TaxonomyService.ts', content, 'utf8');
