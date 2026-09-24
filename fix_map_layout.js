const fs = require('fs');
let file = 'mobile/app/profile/add-address.tsx';
let content = fs.readFileSync(file, 'utf8');

// Change style={StyleSheet.absoluteFillObject} to style={{ width: '100%', height: '100%' }}
content = content.replace(/style=\{StyleSheet\.absoluteFillObject\}/g, "style={{ width: '100%', height: '100%' }}");

// Remove provider={Platform.OS === 'android' ? undefined : undefined} 
content = content.replace(/provider=\{Platform\.OS === 'android' \? undefined : undefined\}/g, "");

fs.writeFileSync(file, content, 'utf8');
