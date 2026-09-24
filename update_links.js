const fs = require('fs');
let file = 'mobile/app/profile/addresses.tsx';
let content = fs.readFileSync(file, 'utf8');

// Replace router.push('/checkout') with router.push('/profile/add-address')
content = content.replace(/router\.push\('\/checkout'\)/g, "router.push('/profile/add-address')");
content = content.replace(/router\.push\('\/checkout'\)/g, "router.push('/profile/add-address')");

fs.writeFileSync(file, content, 'utf8');
