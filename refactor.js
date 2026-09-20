const fs = require('fs');
const path = require('path');

function walkDir(dir, callback) {
    fs.readdirSync(dir).forEach(f => {
        const dirPath = path.join(dir, f);
        const isDirectory = fs.statSync(dirPath).isDirectory();
        isDirectory ? walkDir(dirPath, callback) : callback(path.join(dir, f));
    });
}

function processFile(filePath) {
    if (!filePath.endsWith('.tsx') && !filePath.endsWith('.ts')) return;
    if (filePath.includes('src\\theme\\colors.ts') || filePath.includes('src/theme/colors.ts')) return;
    if (filePath.includes('src\\theme\\unistyles.ts') || filePath.includes('src/theme/unistyles.ts')) return;

    let content = fs.readFileSync(filePath, 'utf8');
    let originalContent = content;

    // 1. Replace StyleSheet import
    if (content.includes('StyleSheet') && content.includes("'react-native'") || content.includes('"react-native"')) {
        content = content.replace(/import\s+{(.*?)}\s+from\s+['"]react-native['"];?/g, (match, p1) => {
            let imports = p1.split(',').map(s => s.trim()).filter(Boolean);
            if (imports.includes('StyleSheet')) {
                imports = imports.filter(i => i !== 'StyleSheet');
                let newImport = imports.length > 0 ? `import { ${imports.join(', ')} } from 'react-native';\n` : '';
                return `${newImport}import { StyleSheet } from 'react-native-unistyles';`;
            }
            return match;
        });
    }

    // 2. Change StyleSheet.create
    // We match `StyleSheet.create({`
    content = content.replace(/StyleSheet\.create\(\s*\{/g, 'StyleSheet.create((theme) => ({');
    
    // 3. Inside the file, replace `colors.` with `theme.colors.` 
    // BUT we only want this inside the StyleSheet block!
    // Since it's hard to isolate, let's just do it globally and inject `const { theme } = useStyles();` in the component.
    // Actually, if we just do it globally, what if it's used inline?
    // Let's replace `colors.` with `theme.colors.`.
    // Wait, replacing it globally will break inline styles because `theme` is not defined there!
    
    // Better way: instead of `theme`, use `t`.
    content = content.replace(/StyleSheet\.create\(\s*\{/g, 'StyleSheet.create((t) => ({');
    
    // Find where `StyleSheet.create` starts and ends, and replace `colors.` with `t.colors.` inside.
    let index = content.indexOf('StyleSheet.create((t) => ({');
    if (index !== -1) {
        let before = content.substring(0, index);
        let after = content.substring(index);
        after = after.replace(/\bcolors\./g, 't.colors.');
        after = after.replace(/\bspacing\./g, 't.spacing.');
        after = after.replace(/\bradius\./g, 't.radius.');
        after = after.replace(/\btypography\./g, 't.typography.');
        after = after.replace(/\bshadows\./g, 't.shadows.');
        content = before + after;
    }

    if (content !== originalContent) {
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`Refactored ${filePath}`);
    }
}

walkDir('app', processFile);
walkDir('src', processFile);
