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
        
        // Change })); at the end of the file or block to });
        content = content.replace(/\}\)\);/g, "});");

        if (content !== initial) {
            fs.writeFileSync(filePath, content, 'utf8');
        }
    });
});
