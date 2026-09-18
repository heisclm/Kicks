import { CreateCategoryInput, UpdateCategoryInput } from '../../lib/validation/category';
import { createClient } from '../../utils/supabase/server';

export interface Category {
  id: string;
  name: string;
  description?: string;
  parent_id?: string;
  is_active: boolean;
  created_at: string;
}



export class CategoryRepository {
  static async getCategories(): Promise<Category[]> {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .order('name', { ascending: true });

    if (error) {
      console.error('CategoryRepository.getCategories error:', error);
      throw new Error('Failed to fetch categories');
    }

    return data || [];
  }

  static async createCategory(input: CreateCategoryInput): Promise<Category> {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('categories')
      .insert([{
        name: input.name,
        description: input.description,
        parent_id: input.parent_id
      }])
      .select()
      .single();

    if (error) {
      console.error('CategoryRepository.createCategory error:', error);
      throw new Error(error.message);
    }

    return data;
  }

  static async updateCategory(input: UpdateCategoryInput): Promise<Category> {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('categories')
      .update({
        name: input.name,
        description: input.description,
        parent_id: input.parent_id
      })
      .eq('id', input.id)
      .select()
      .single();

    if (error) throw new Error(error.message);
    return data;
  }

  static async deleteCategory(id: string): Promise<void> {
    const supabase = await createClient();
    const { error } = await supabase
      .from('categories')
      .delete()
      .eq('id', id);

    if (error) throw new Error(error.message);
  }
}