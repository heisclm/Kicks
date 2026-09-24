const fs = require('fs');
let file = 'mobile/src/services/CartService.ts';
let content = fs.readFileSync(file, 'utf8');

// Remove mock data checks
content = content.replace(/if \(process\.env\.EXPO_PUBLIC_USE_MOCK_DATA !== 'false'\).*;\r?\n/g, '');
content = content.replace(/if \(process\.env\.EXPO_PUBLIC_USE_MOCK_DATA !== 'false'\).*/g, '');

fs.writeFileSync(file, content, 'utf8');
