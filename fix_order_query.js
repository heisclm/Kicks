const fs = require('fs');
let file = 'mobile/src/services/OrderRepository.ts';
let content = fs.readFileSync(file, 'utf8');

// Replace the invalid products(images) with the correct relationship
content = content.replace(/products \(\s*images\s*\)/, `products (
              product_images (image_url)
            )`);

// Also fix the mapping logic
content = content.replace(/image: item\.product_variants\?\.products\?\.images\?\.\[0\] \|\| null,/, `image: item.product_variants?.products?.product_images?.[0]?.image_url ? { uri: item.product_variants.products.product_images[0].image_url } : null,`);

fs.writeFileSync(file, content, 'utf8');
