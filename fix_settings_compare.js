const fs = require('fs');
let file = 'mobile/app/profile/settings.tsx';
let content = fs.readFileSync(file, 'utf8');
content = content.replace(/value=\{'light' === 'dark'\}/g, "value={false}");
fs.writeFileSync(file, content, 'utf8');
