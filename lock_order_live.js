const fs = require('fs');
let file = 'mobile/src/services/OrderService.ts';
let content = fs.readFileSync(file, 'utf8');

// Remove mock checks
content = content.replace(/if \(process\.env\.EXPO_PUBLIC_USE_MOCK_DATA !== 'false'\) \{\s*return `mock-order-\$\{Date\.now\(\)\}`;?\s*\}/, "");

fs.writeFileSync(file, content, 'utf8');
