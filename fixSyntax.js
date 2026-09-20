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
    
    let content = fs.readFileSync(filePath, 'utf8');
    let originalContent = content;

    // Use a stack-based bracket matcher to safely replace the closing bracket
    let idx = content.indexOf('StyleSheet.create((t) => ({');
    while (idx !== -1) {
        // Find the matching closing bracket for the {
        let startObj = idx + 'StyleSheet.create((t) => ('.length;
        let openBraces = 0;
        let foundClosing = -1;
        
        for (let i = startObj; i < content.length; i++) {
            if (content[i] === '{') openBraces++;
            if (content[i] === '}') {
                openBraces--;
                if (openBraces === 0) {
                    // We found the closing brace of the object!
                    // It should be followed by `);`
                    if (content.substring(i, i + 3) === '});') {
                        content = content.substring(0, i) + '}));' + content.substring(i + 3);
                    } else if (content.substring(i, i + 2) === '})') {
                        content = content.substring(0, i) + '}))' + content.substring(i + 2);
                    }
                    break;
                }
            }
        }
        
        idx = content.indexOf('StyleSheet.create((t) => ({', idx + 1);
    }

    if (content !== originalContent) {
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`Fixed syntax in ${filePath}`);
    }
}

walkDir('app', processFile);
walkDir('src', processFile);
