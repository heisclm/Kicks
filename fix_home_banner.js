const fs = require('fs');
let file = 'mobile/app/(tabs)/index.tsx';
let content = fs.readFileSync(file, 'utf8');

// Fix products[0].name.replace
content = content.replace(/\{products\[0\]\.name\.replace\('Nike ', ''\)\}/g, "{products[0]?.name?.replace('Nike ', '') || 'Sneaker'}");

fs.writeFileSync(file, content, 'utf8');
