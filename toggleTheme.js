const fs = require('fs');

let content = fs.readFileSync('app/profile/settings.tsx', 'utf8');

// Replace local state with UnistylesRuntime
content = content.replace(/const \[darkModeEnabled, setDarkModeEnabled\] = useState\(false\);/, '');

// Add UnistylesRuntime import
if (!content.includes('UnistylesRuntime')) {
    content = content.replace(/import { StyleSheet, useStyles } from 'react-native-unistyles';/, "import { StyleSheet, useStyles, UnistylesRuntime } from 'react-native-unistyles';");
}

// Replace value={darkModeEnabled} with value={UnistylesRuntime.themeName === 'dark'}
content = content.replace(/value={darkModeEnabled}/g, "value={UnistylesRuntime.themeName === 'dark'}");

// Replace onValueChange={setDarkModeEnabled} with Unistyles toggle
content = content.replace(/onValueChange={setDarkModeEnabled}/g, "onValueChange={(val) => UnistylesRuntime.setTheme(val ? 'dark' : 'light')}");

fs.writeFileSync('app/profile/settings.tsx', content, 'utf8');
console.log('Updated app/profile/settings.tsx for Dark Mode toggle!');
