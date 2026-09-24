const fs = require('fs');
let content = fs.readFileSync('app/(dashboard)/orders/OrdersClient.tsx', 'utf8');

// Fix initial state
content = content.replace('pagination: {', 'pagination: {\n        pageIndex: 0,');

// Replace getState() with state
content = content.replace(/table\.getState\(\)/g, 'table.state');

fs.writeFileSync('app/(dashboard)/orders/OrdersClient.tsx', content, 'utf8');
