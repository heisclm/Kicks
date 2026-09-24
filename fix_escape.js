const fs = require('fs');
let content = fs.readFileSync('supabase/generate-seed.ts', 'utf8');
content = content.replace(/'\$\{p\.gender \|\| 'Unisex'\}'/g, "'${(p.gender || 'Unisex').replace(/'/g, \"''\")}'");
fs.writeFileSync('supabase/generate-seed.ts', content, 'utf8');
