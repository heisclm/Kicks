const fs = require('fs');
let file = 'mobile/app/(tabs)/profile.tsx';
let content = fs.readFileSync(file, 'utf8');

// Replace cardRed with error
content = content.replace(/colors\.cardRed/g, "colors.error");

fs.writeFileSync(file, content, 'utf8');
