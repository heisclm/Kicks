const fs = require('fs');
const path = 'node_modules/@tanstack/react-table/dist/useLegacyTable.d.ts';
if (fs.existsSync(path)) {
    console.log(fs.readFileSync(path, 'utf8').substring(0, 500));
}
