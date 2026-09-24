const fs = require('fs');
const content = fs.readFileSync('node_modules/@tanstack/table-core/dist/index.d.ts', 'utf8');
const lines = content.split('\n');
const match = lines.findIndex(l => l.includes('TableOptions_RowModels_Core'));
if (match !== -1) {
    console.log(lines.slice(match - 2, match + 10).join('\n'));
} else {
    // Just search for RowModelFactory
    const factory = lines.findIndex(l => l.includes('RowModelFactory'));
    if (factory !== -1) {
        console.log(lines.slice(factory - 2, factory + 10).join('\n'));
    }
}
