const fs = require('fs');
let file = 'mobile/app/(tabs)/discover.tsx';
let content = fs.readFileSync(file, 'utf8');

// Fix the undefined is not a function error in the filter
const oldCode = "const filteredProducts = activeCategory === 'all' ? products : products.filter(p => p.category?.toLowerCase() === categories.find(c => c.id === activeCategory)?.name.toLowerCase() || p.categoryId === activeCategory);";

const newCode = `const activeCategoryName = categories.find(c => c.id === activeCategory)?.name?.toLowerCase();
  const filteredProducts = activeCategory === 'all' ? products : products.filter(p => {
    if (activeCategoryName && p.category?.toLowerCase() === activeCategoryName) return true;
    if (p.categoryId === activeCategory) return true;
    return false;
  });`;

content = content.replace(oldCode, newCode);

fs.writeFileSync(file, content, 'utf8');
