const fs = require('fs');
let file = 'mobile/src/services/ProductService.ts';
let content = fs.readFileSync(file, 'utf8');

// Replace the dynamic switch with just SupabaseProductRepository
const newExport = `import { SupabaseProductRepository } from './SupabaseProductRepository';\n\nexport const ProductService: IProductRepository = new SupabaseProductRepository();`;

content = content.replace(/import \{ SupabaseProductRepository \} from '.\/SupabaseProductRepository';[\s\S]*$/, newExport);

fs.writeFileSync(file, content, 'utf8');
