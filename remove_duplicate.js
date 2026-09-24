const fs = require('fs');
const path = require('path');

function walk(dir, callback) {
    fs.readdirSync(dir).forEach(f => {
        let dirPath = path.join(dir, f);
        let isDirectory = fs.statSync(dirPath).isDirectory();
        isDirectory ? walk(dirPath, callback) : callback(path.join(dir, f));
    });
}

walk('mobile/app', (filePath) => {
    if (!filePath.endsWith('.tsx') && !filePath.endsWith('.ts')) return;
    
    let content = fs.readFileSync(filePath, 'utf8');
    let initial = content;

    // Check if the file has multiple imports of StyleSheet
    const matches = content.match(/StyleSheet/g);
    if (matches && matches.length >= 3) {
        // Just remove the exact line `import { StyleSheet } from 'react-native';`
        content = content.replace(/import\s*\{\s*StyleSheet\s*\}\s*from\s*['"]react-native['"];?(?:\r?\n)?/g, (match, offset, str) => {
            let before = str.substring(0, offset);
            if (before.includes('StyleSheet')) {
                return '';
            }
            return match;
        });
    }

    if (content !== initial) {
        fs.writeFileSync(filePath, content, 'utf8');
    }
});
