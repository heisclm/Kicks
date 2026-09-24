const fs = require('fs');

const productsFile = 'mobile/src/data/products.ts';
let content = fs.readFileSync(productsFile, 'utf8');

// Backup original
fs.writeFileSync('mobile/src/data/products.ts.bak', content, 'utf8');

// Replace require(...) with string
content = content.replace(/require\([^)]+\)/g, "'/mock-image.png'");

fs.writeFileSync(productsFile, content, 'utf8');
