const fs = require('fs');
let file = 'mobile/app/(tabs)/wishlist.tsx';
let content = fs.readFileSync(file, 'utf8');

// Replace the filter logic with map -> filter to preserve order
content = content.replace(
  /const savedProducts = allProducts\.filter\(p => savedProductIds\.includes\(p\.id\)\);/g,
  `// Derive full products from the saved IDs, preserving the exact chronological order of savedProductIds
  const savedProducts = savedProductIds
    .map(id => allProducts.find(p => p.id === id))
    .filter(Boolean) as typeof allProducts;`
);

fs.writeFileSync(file, content, 'utf8');
