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
    if (filePath.includes('src\\theme') || filePath.includes('src/theme')) return;

    let content = fs.readFileSync(filePath, 'utf8');
    let originalContent = content;

    content = content.replace(/(?<!\bt\.|theme\.)\bcolors\./g, 'theme.colors.');
    content = content.replace(/(?<!\bt\.|theme\.)\bspacing\./g, 'theme.spacing.');
    content = content.replace(/(?<!\bt\.|theme\.)\bradius\./g, 'theme.radius.');
    content = content.replace(/(?<!\bt\.|theme\.)\btypography\./g, 'theme.typography.');
    content = content.replace(/(?<!\bt\.|theme\.)\bshadows\./g, 'theme.shadows.');

    if (content !== originalContent) {
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`Refactored ${filePath}`);
    }
}

walkDir('app', processFile);
walkDir('src', processFile);
