const fs = require('fs');
let file = 'mobile/app/(tabs)/profile.tsx';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(/typography\.families\.bold/g, "typography.families.extrabold");

fs.writeFileSync(file, content, 'utf8');
