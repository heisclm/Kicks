const fs = require('fs');
const path = require('path');

function walk(dir, callback) {
    if (!fs.existsSync(dir)) return;
    fs.readdirSync(dir).forEach(f => {
        let dirPath = path.join(dir, f);
        let isDirectory = fs.statSync(dirPath).isDirectory();
        isDirectory ? walk(dirPath, callback) : callback(path.join(dir, f));
    });
}

const targetDirs = ['mobile/app', 'mobile/src'];

targetDirs.forEach(dir => {
    walk(dir, (filePath) => {
        if (!filePath.endsWith('.tsx') && !filePath.endsWith('.ts')) return;
        
        let content = fs.readFileSync(filePath, 'utf8');
        let initial = content;

        // 1. Remove the local theme variable injection
        content = content.replace(/^[ \t]*const theme = \{ colors, spacing, radius, typography \};\r?\n/gm, '');
        content = content.replace(/const theme = \{ colors, spacing, radius, typography \};/g, '');

        // 2. Replace theme.shadows. with shadows.
        content = content.replace(/theme\.shadows\./g, 'shadows.');

        // 3. Ensure 'shadows' is imported
        // Look for import { colors, spacing, radius, typography } from ...
        // and replace it with import { colors, spacing, radius, typography, shadows } from ...
        // We might also have imports without spacing or radius, so let's just match any import from the theme path
        // that doesn't already contain shadows, and inject it if the file actually uses 'shadows.'
        
        if (content.includes('shadows.') || content.includes('shadows}')) {
            content = content.replace(/import\s*\{\s*([^}]*)\s*\}\s*from\s*['"]((?:\.\.\/)+src\/theme|(?:\.\.\/)+theme)['"];?/g, (match, imports, path) => {
                if (!imports.includes('shadows')) {
                    // split, trim, add shadows, join
                    let items = imports.split(',').map(i => i.trim()).filter(i => i);
                    items.push('shadows');
                    return `import { ${items.join(', ')} } from '${path}';`;
                }
                return match;
            });
        }

        if (content !== initial) {
            fs.writeFileSync(filePath, content, 'utf8');
        }
    });
});
