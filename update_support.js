const fs = require('fs');
let file = 'mobile/app/profile/support.tsx';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(/import \{ useRouter \} from 'expo-router';/, "import { useRouter } from 'expo-router';\nimport * as Linking from 'expo-linking';");

content = content.replace(/onPress=\{.*?showToast\('Opening Live Chat\.\.\.'.*?\}/, "onPress={() => Linking.openURL('sms:+18001234567')}");
content = content.replace(/onPress=\{.*?showToast\('Calling Support\.\.\.'.*?\}/, "onPress={() => Linking.openURL('tel:+18001234567')}");
content = content.replace(/onPress=\{.*?showToast\('Composing Email\.\.\.'.*?\}/, "onPress={() => Linking.openURL('mailto:support@kicks.com?subject=Support Request')}");

fs.writeFileSync(file, content, 'utf8');
