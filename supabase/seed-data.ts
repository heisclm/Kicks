import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import { products } from '../src/data/products';

dotenv.config();

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase credentials in .env');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function seed() {
  console.log('Seeding Supabase Database from mock data...');

  // 1. Extract unique brands and categories
  const brandsSet = new Set<string>();
  const categoriesSet = new Set<string>();

  products.forEach(p => {
    brandsSet.add(p.brand);
    categoriesSet.add(p.category);
  });

  const brandsMap = new Map<string, string>();
  const categoriesMap = new Map<string, string>();

  // Insert Brands
  for (const brand of Array.from(brandsSet)) {
    const { data, error } = await supabase
      .from('brands')
      .upsert({ name: brand, slug: brand.toLowerCase().replace(/\s+/g, '-') }, { onConflict: 'slug' })
      .select('id')
      .single();
      
    if (error) throw error;
    brandsMap.set(brand, data.id);
  }
  console.log('Brands seeded.');

  // Insert Categories
  for (const cat of Array.from(categoriesSet)) {
    const { data, error } = await supabase
      .from('categories')
      .upsert({ name: cat, slug: cat.toLowerCase().replace(/\s+/g, '-') }, { onConflict: 'slug' })
      .select('id')
      .single();
      
    if (error) throw error;
    categoriesMap.set(cat, data.id);
  }
  console.log('Categories seeded.');

  // Insert Products and Variants
  for (const product of products) {
    // Upsert product
    const { data: pData, error: pError } = await supabase
      .from('products')
      .insert({
        name: product.name,
        subtitle: product.subtitle,
        description: product.description,
        brand_id: brandsMap.get(product.brand)!,
        category_id: categoriesMap.get(product.category)!,
        gender: product.gender || 'Unisex',
        base_price: product.price,
        is_active: true,
      })
      .select('id')
      .single();

    if (pError) throw pError;

    // Insert main image (using local require path as a placeholder URL for now)
    await supabase.from('product_images').insert({
      product_id: pData.id,
      image_url: String(product.image), // Will store '123' if it's a require() ID. We'll fix UI later or map it.
      is_primary: true,
      display_order: 0,
    });

    // Insert Variants
    for (const size of product.sizes) {
      const stock = product.availableSizes.includes(size) ? 100 : 0;
      await supabase.from('product_variants').insert({
        product_id: pData.id,
        color_name: product.color || 'Default',
        color_hex: product.color || '#000000',
        size: size,
        sku: `${product.id}-${size}`,
        stock_quantity: stock,
        price_adjustment: 0,
      });
    }
  }
  
  console.log('Products, Images, and Variants seeded successfully!');
}

seed().catch(err => console.error(err));
