const fs = require('fs');
let file = 'mobile/app/_layout.tsx';
let content = fs.readFileSync(file, 'utf8');
content = content.replace(/import\s+['"]\.\.\/src\/theme\/unistyles['"];?/g, "");
fs.writeFileSync(file, content, 'utf8');
