const fs = require('fs');
let file = 'mobile/app/(tabs)/discover.tsx';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(/data=\{categories\}/, "data={[{ id: 'all', name: 'All' }, ...categories]}");

fs.writeFileSync(file, content, 'utf8');
