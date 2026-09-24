const fs = require('fs');
let file = 'mobile/src/services/WishlistService.ts';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(
  /\.eq\('user_id', userId\);/g,
  ".eq('user_id', userId)\n      .order('created_at', { ascending: false });"
);

fs.writeFileSync(file, content, 'utf8');
