const fs = require('fs');
const path = require('path');

function walk(dir, callback) {
    fs.readdirSync(dir).forEach(f => {
        let dirPath = path.join(dir, f);
        let isDirectory = fs.statSync(dirPath).isDirectory();
        isDirectory ? walk(dirPath, callback) : callback(path.join(dir, f));
    });
}

const appDir = path.resolve('mobile/app');
const srcDir = path.resolve('mobile/src');
const srcThemeDir = path.resolve('mobile/src/theme');

walk('mobile/app', (filePath) => {
    if (!filePath.endsWith('.tsx') && !filePath.endsWith('.ts')) return;
    
    let content = fs.readFileSync(filePath, 'utf8');
    let initial = content;

    // Calculate the correct relative path to src/theme
    let relativePathToTheme = path.relative(path.dirname(filePath), srcThemeDir).replace(/\\/g, '/');
    if (!relativePathToTheme.startsWith('.')) {
        relativePathToTheme = './' + relativePathToTheme;
    }

    // Replace ANY import of src/theme with the correct one
    content = content.replace(/import\s*\{\s*colors,\s*spacing,\s*radius,\s*typography\s*\}\s*from\s*['"](.*?)['"];?/g, `import { colors, spacing, radius, typography } from '${relativePathToTheme}';`);

    // Remove standalone duplicate imports of StyleSheet added to login.tsx
    content = content.replace(/import\s*\{\s*StyleSheet\s*\}\s*from\s*['"]react-native['"];?\n/g, (match, offset, str) => {
        // Only remove if there's already a StyleSheet import somewhere else
        let before = str.substring(0, offset);
        if (before.includes('StyleSheet') && before.includes('react-native')) {
            return '';
        }
        return match;
    });

    if (content !== initial) {
        fs.writeFileSync(filePath, content, 'utf8');
    }
});

// also fix components in src/components if they have wrong paths
walk('mobile/src/components', (filePath) => {
    if (!filePath.endsWith('.tsx') && !filePath.endsWith('.ts')) return;
    
    let content = fs.readFileSync(filePath, 'utf8');
    let initial = content;

    let relativePathToTheme = path.relative(path.dirname(filePath), srcThemeDir).replace(/\\/g, '/');
    if (!relativePathToTheme.startsWith('.')) {
        relativePathToTheme = './' + relativePathToTheme;
    }

    content = content.replace(/import\s*\{\s*colors,\s*spacing,\s*radius,\s*typography\s*\}\s*from\s*['"](.*?)['"];?/g, `import { colors, spacing, radius, typography } from '${relativePathToTheme}';`);

    if (content !== initial) {
        fs.writeFileSync(filePath, content, 'utf8');
    }
});
