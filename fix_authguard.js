const fs = require('fs');
let file = 'mobile/src/components/AuthGuard.tsx';
let content = fs.readFileSync(file, 'utf8');
content = content.replace(/segments\[0\] === '\(auth\)'/g, "(segments[0] as string) === '(auth)'");
content = content.replace(/segments\[0\] === 'index'/g, "(segments[0] as string) === 'index'");
content = content.replace(/segments\.length === 0/g, "(segments.length as number) === 0");
fs.writeFileSync(file, content, 'utf8');
