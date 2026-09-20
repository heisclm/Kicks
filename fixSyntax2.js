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

    let searchStr = 'StyleSheet.create((theme) => ({';
    let idx = content.indexOf(searchStr);
    
    // Fallback if I used `t`
    if (idx === -1) {
        searchStr = 'StyleSheet.create((t) => ({';
        idx = content.indexOf(searchStr);
    }
    
    while (idx !== -1) {
        // Find the matching closing bracket for the {
        let startObj = idx + searchStr.length - 1; // points to the '{'
        let openBraces = 0;
        
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
        
        idx = content.indexOf(searchStr, idx + 1);
    }

    if (content !== originalContent) {
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`Fixed syntax in ${filePath}`);
    }
}

walkDir('app', processFile);
walkDir('src', processFile);
