const fs = require('fs');

let login = 'mobile/app/(auth)/login.tsx';
let loginContent = fs.readFileSync(login, 'utf8');
loginContent = loginContent.replace(/if\s*\(process\.env\.EXPO_PUBLIC_USE_MOCK_DATA[\s\S]*?return;\n\s*\}/, '');
fs.writeFileSync(login, loginContent, 'utf8');

let register = 'mobile/app/(auth)/register.tsx';
let registerContent = fs.readFileSync(register, 'utf8');
registerContent = registerContent.replace(/if\s*\(process\.env\.EXPO_PUBLIC_USE_MOCK_DATA[\s\S]*?return;\n\s*\}/, '');
fs.writeFileSync(register, registerContent, 'utf8');
