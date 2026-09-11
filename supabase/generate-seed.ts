import * as fs from 'fs';
import { products } from '../src/data/products';

let sql = `-- Seed Data Generated from Mock Products\n\n`;

const brands = new Set<string>();
const categories = new Set<string>();

products.forEach(p => {
  brands.add(p.brand);
  categories.add(p.category);
});

// Write Brands
sql += `-- Brands\n`;
const brandMap = new Map();
let bId = 1;
for (const b of brands) {
  const id = `00000000-0000-0000-0000-0000000001${bId.toString().padStart(2, '0')}`;
  brandMap.set(b, id);
  sql += `INSERT INTO brands (id, name, slug) VALUES ('${id}', '${b.replace(/'/g, "''")}', '${b.toLowerCase().replace(/\s+/g, '-')}');\n`;
  bId++;
}

sql += `\n-- Categories\n`;
const catMap = new Map();
let cId = 1;
for (const c of categories) {
  const id = `00000000-0000-0000-0000-0000000002${cId.toString().padStart(2, '0')}`;
  catMap.set(c, id);
  sql += `INSERT INTO categories (id, name, slug) VALUES ('${id}', '${c.replace(/'/g, "''")}', '${c.toLowerCase().replace(/\s+/g, '-')}');\n`;
  cId++;
}

sql += `\n-- Products, Images, and Variants\n`;
let pIdCounter = 1;
let vIdCounter = 1;

for (const p of products) {
  const pId = `00000000-0000-0000-0000-0000000003${pIdCounter.toString().padStart(2, '0')}`;
  const bId = brandMap.get(p.brand);
  const cId = catMap.get(p.category);
  
  sql += `INSERT INTO products (id, name, subtitle, description, brand_id, category_id, gender, base_price, is_active) VALUES ('${pId}', '${p.name.replace(/'/g, "''")}', '${p.subtitle ? p.subtitle.replace(/'/g, "''") : ''}', '${p.description ? p.description.replace(/'/g, "''") : ''}', '${bId}', '${cId}', '${p.gender || 'Unisex'}', ${p.price}, true);\n`;
  
  sql += `INSERT INTO product_images (product_id, image_url, is_primary, display_order) VALUES ('${pId}', '${p.image}', true, 0);\n`;
  
  for (const size of p.sizes) {
    const vId = `00000000-0000-0000-0000-0000000004${vIdCounter.toString().padStart(2, '0')}`;
    const stock = p.availableSizes.includes(size) ? 100 : 0;
    sql += `INSERT INTO product_variants (id, product_id, color_name, color_hex, size, sku, stock_quantity, price_adjustment) VALUES ('${vId}', '${pId}', '${p.color || 'Default'}', '${p.color || '#000000'}', ${size}, '${p.id}-${size}', ${stock}, 0);\n`;
    vIdCounter++;
  }
  pIdCounter++;
}

fs.writeFileSync('supabase/seed.sql', sql, 'utf8');
console.log('Successfully generated supabase/seed.sql!');
