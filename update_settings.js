const fs = require('fs');
let file = 'mobile/app/profile/settings.tsx';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(/import \{ useSafeAreaInsets \} from 'react-native-safe-area-context';\r?\n/, "import { useSafeAreaInsets } from 'react-native-safe-area-context';\nimport { usePreferencesStore } from '../../src/store/usePreferencesStore';\n");

content = content.replace(/export default function SettingsScreen\(\) \{[\s\S]*?return \(/, `export default function SettingsScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { currency, language, location } = usePreferencesStore();

  return (`);

content = content.replace(/<Text style=\{styles\.settingValue\}>USD<\/Text>/, `<Text style={styles.settingValue}>{currency}</Text>`);
content = content.replace(/<Text style=\{styles\.settingValue\}>English<\/Text>/, `<Text style={styles.settingValue}>{language}</Text>`);
content = content.replace(/<Text style=\{styles\.settingValue\}>United States<\/Text>/, `<Text style={styles.settingValue}>{location}</Text>`);

fs.writeFileSync(file, content, 'utf8');
