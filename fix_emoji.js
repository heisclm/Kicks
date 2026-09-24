const fs = require('fs');
let file = 'mobile/app/(auth)/register.tsx';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(/"Verify Your Email \?\?"/g, '"Verify Your Email"');
content = content.replace(/"Verify Your Email ??"/g, '"Verify Your Email"');

fs.writeFileSync(file, content, 'utf8');
