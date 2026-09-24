const fs = require('fs');
let file = 'mobile/app/(tabs)/discover.tsx';
let content = fs.readFileSync(file, 'utf8');

// The activeCategory state filters
// Add const filteredProducts
content = content.replace(/const renderItem = useCallback/, `const filteredProducts = activeCategory === 'all' ? products : products.filter(p => p.category?.toLowerCase() === categories.find(c => c.id === activeCategory)?.name.toLowerCase() || p.categoryId === activeCategory);\n\n  const renderItem = useCallback`);

// Replace data={products} with data={filteredProducts}
content = content.replace(/data=\{products\}/, "data={filteredProducts}");

fs.writeFileSync(file, content, 'utf8');
