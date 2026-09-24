const fs = require('fs');
let file = 'mobile/src/store/useWishlistStore.ts';
let content = fs.readFileSync(file, 'utf8');

// optimistic update
content = content.replace(
  /: \[\.\.\.state\.savedProductIds, productId\]/g,
  ": [productId, ...state.savedProductIds]"
);
fs.writeFileSync(file, content, 'utf8');
