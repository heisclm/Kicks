const fs = require('fs');
let file = 'mobile/src/services/OrderRepository.ts';
let content = fs.readFileSync(file, 'utf8');

// Remove mock checks
content = content.replace(/if \(process\.env\.EXPO_PUBLIC_USE_MOCK_DATA !== 'false'\) \{\s*const \{ orders \} = require\('\.\.\/data'\);\s*return orders;\s*\}/, "");

fs.writeFileSync(file, content, 'utf8');
