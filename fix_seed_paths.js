const fs = require('fs');

function fixPath(file) {
  if (fs.existsSync(file)) {
    let content = fs.readFileSync(file, 'utf8');
    content = content.replace(/\.\.\/src\/data\/products/g, '../mobile/src/data/products');
    fs.writeFileSync(file, content, 'utf8');
  }
}

fixPath('supabase/generate-seed.ts');
fixPath('supabase/seed-data.ts');
