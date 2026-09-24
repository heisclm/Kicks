const fs = require('fs');
let file = 'mobile/app/(tabs)/profile.tsx';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(/router\.replace\("\/"\);/g, "router.replace('/(auth)/login');");

fs.writeFileSync(file, content, 'utf8');
