const fs = require('fs');
const content = fs.readFileSync('node_modules/@tanstack/table-core/dist/index.d.ts', 'utf8');

const regex = /(type|interface)\s+TableOptions[^{<]*[<{]/g;
const matches = [...content.matchAll(regex)];
console.log(matches.map(m => content.substring(m.index, m.index + 200)));
