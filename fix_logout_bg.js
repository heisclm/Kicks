const fs = require('fs');
let file = 'mobile/app/(tabs)/profile.tsx';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(/backgroundColor:\s*"rgba\(224, 74, 58, 0\.08\)"/g, "backgroundColor: colors.errorLight");

fs.writeFileSync(file, content, 'utf8');
