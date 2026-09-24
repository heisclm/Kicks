const fs = require('fs');
let file = 'mobile/app/index.tsx';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(/router\.replace\("\/\(tabs\)" as any\);/g, "router.replace('/(auth)/login');");

fs.writeFileSync(file, content, 'utf8');
