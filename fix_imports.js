const fs = require('fs');
const path = require('path');

function walk(dir, callback) {
    fs.readdirSync(dir).forEach(f => {
        let dirPath = path.join(dir, f);
        let isDirectory = fs.statSync(dirPath).isDirectory();
        isDirectory ? walk(dirPath, callback) : callback(path.join(dir, f));
    });
}

const targetDirs = ['mobile/app', 'mobile/src'];

targetDirs.forEach(dir => {
    if (!fs.existsSync(dir)) return;
    walk(dir, (filePath) => {
        if (!filePath.endsWith('.tsx') && !filePath.endsWith('.ts')) return;
        
        let content = fs.readFileSync(filePath, 'utf8');
        let initial = content;

        // Ensure theme import has all four
        content = content.replace(/import\s*\{\s*([^}]*)\s*\}\s*from\s*['"](\.\.\/)*src\/theme['"];?/g, (match, p1, p2) => {
            return `import { colors, spacing, radius, typography } from '${p2}src/theme';`;
        });
        
        // Sometimes it's from '../theme'
        content = content.replace(/import\s*\{\s*([^}]*)\s*\}\s*from\s*['"](\.\.\/)+theme['"];?/g, (match, p1, p2) => {
            return `import { colors, spacing, radius, typography } from '${p2}theme';`;
        });

        if (content !== initial) {
            fs.writeFileSync(filePath, content, 'utf8');
        }
    });
});
