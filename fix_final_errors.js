const fs = require('fs');
const path = require('path');

// 1. Fix _layout.tsx
let layoutFile = 'mobile/app/_layout.tsx';
let layoutContent = fs.readFileSync(layoutFile, 'utf8');
if (!layoutContent.includes('import { colors')) {
    layoutContent = layoutContent.replace(/import \{ StyleSheet \} from 'react-native';/, "import { StyleSheet } from 'react-native';\nimport { colors } from '../src/theme';");
}
fs.writeFileSync(layoutFile, layoutContent, 'utf8');

// 2. Fix Head import in tabs
const tabsDir = 'mobile/app/(tabs)';
fs.readdirSync(tabsDir).forEach(f => {
    let filePath = path.join(tabsDir, f);
    if (!filePath.endsWith('.tsx')) return;
    
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Replace `import { something, Head } from 'expo-router'`
    // Actually, just find `Head` in expo-router imports and move it.
    if (content.includes('from \'expo-router\'') || content.includes('from "expo-router"')) {
        content = content.replace(/import\s*\{([^}]*)Head([^}]*)\}\s*from\s*['"]expo-router['"];?/g, (match, before, after) => {
            let combined = before + after;
            combined = combined.replace(/,\s*,/g, ',').replace(/^\s*,\s*/, '').replace(/\s*,\s*$/, '');
            let res = `import Head from 'expo-router/head';\n`;
            if (combined.trim().length > 0) {
                res += `import { ${combined} } from 'expo-router';`;
            }
            return res;
        });
    }

    if (content.includes('<Head>')) {
        if (!content.includes('expo-router/head')) {
             // In case Head was used but not imported (like profile.tsx might have missing import)
             content = `import Head from 'expo-router/head';\n` + content;
        }
    }
    
    // 3. Fix cart.tsx FlashList
    if (f === 'cart.tsx') {
        if (!content.includes('@shopify/flash-list')) {
            content = `import { FlashList } from '@shopify/flash-list';\n` + content;
        }
    }
    
    // 4. Fix wishlist.tsx key
    if (f === 'wishlist.tsx') {
        content = content.replace(/key=\{numColumns\}/g, "key={String(numColumns)}");
    }

    fs.writeFileSync(filePath, content, 'utf8');
});
