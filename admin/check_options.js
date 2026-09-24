const fs = require('fs');
const content = fs.readFileSync('node_modules/@tanstack/table-core/dist/index.d.ts', 'utf8');

const regex = /\w+RowModel\??:/g;
const matches = [...content.matchAll(regex)];
console.log(matches.map(m => m[0]));
