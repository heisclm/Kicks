const fs = require('fs');
const path = require('path');

function walk(dir, callback) {
    fs.readdirSync(dir).forEach(f => {
        let dirPath = path.join(dir, f);
        let isDirectory = fs.statSync(dirPath).isDirectory();
        isDirectory ? walk(dirPath, callback) : callback(path.join(dir, f));
    });
}

const targetDirs = ['mobile/app', 'mobile/src'];
let filesModified = 0;

targetDirs.forEach(dir => {
    if (!fs.existsSync(dir)) return;
    walk(dir, (filePath) => {
        if (!filePath.endsWith('.tsx') && !filePath.endsWith('.ts')) return;
        
        let content = fs.readFileSync(filePath, 'utf8');
        if (!content.includes('react-native-unistyles') && !content.includes('useStyles')) return;
        
        let initial = content;

        // 1. Remove unistyles import
        content = content.replace(/import\s*\{\s*StyleSheet(?:,\s*useStyles(?:,\s*UnistylesRuntime)?)?\s*\}\s*from\s*['"]react-native-unistyles['"];?/g, "import { StyleSheet } from 'react-native';");
        content = content.replace(/import\s*\{\s*useStyles(?:,\s*StyleSheet)?(?:,\s*UnistylesRuntime)?\s*\}\s*from\s*['"]react-native-unistyles['"];?/g, "import { StyleSheet } from 'react-native';");
        content = content.replace(/import\s*\{\s*StyleSheet,\s*useStyles,\s*UnistylesRuntime\s*\}\s*from\s*['"]react-native-unistyles['"];?/g, "import { StyleSheet } from 'react-native';");
        content = content.replace(/import\s*\{\s*(useStyles|UnistylesRuntime)(,\s*(useStyles|UnistylesRuntime))?\s*\}\s*from\s*['"]react-native-unistyles['"];?/g, "");

        // 2. Replace useStyles hook
        content = content.replace(/const\s*\{\s*styles(?:,\s*theme)?\s*\}\s*=\s*useStyles\(stylesheet\);?/g, "const styles = stylesheet;\n    const theme = { colors, spacing, radius, typography };");
        content = content.replace(/const\s*\{\s*styles\s*\}\s*=\s*useStyles\(\);?/g, "const styles = stylesheet;");
        content = content.replace(/const\s*\{\s*theme(?:,\s*styles)?\s*\}\s*=\s*useStyles\(stylesheet\);?/g, "const styles = stylesheet;\n    const theme = { colors, spacing, radius, typography };");
        content = content.replace(/const\s*\{\s*theme\s*\}\s*=\s*useStyles\(\);?/g, "const theme = { colors, spacing, radius, typography };");

        // 3. Replace StyleSheet.create
        // Safely capture the inner body of StyleSheet.create((theme) => ({ ... }));
        content = content.replace(/const\s+(?:stylesheet|styles)\s*=\s*StyleSheet\.create\(\s*\(?\s*theme\s*\)?\s*=>\s*\(\s*\{([\s\S]*?)\}\s*\)\s*\);/g, "const styles = StyleSheet.create({$1});");
        
        // Also fix the case where it's already a regular StyleSheet.create but named stylesheet
        content = content.replace(/const\s+stylesheet\s*=\s*StyleSheet\.create\(\{/g, "const styles = StyleSheet.create({");
        
        // Clean up redundant alias
        content = content.replace(/const styles = stylesheet;/g, "");
        
        // 4. Replace theme. properties
        content = content.replace(/theme\.colors\./g, "colors.");
        content = content.replace(/theme\.spacing\./g, "spacing.");
        content = content.replace(/theme\.radius\./g, "radius.");
        content = content.replace(/theme\.typography\./g, "typography.");
        
        // 5. Remove UnistylesRuntime usages
        content = content.replace(/UnistylesRuntime\.setTheme\([^)]*\);?/g, "");
        content = content.replace(/UnistylesRuntime\.themeName/g, "'light'");

        if (content !== initial) {
            fs.writeFileSync(filePath, content, 'utf8');
            filesModified++;
        }
    });
});
console.log(`Modified ${filesModified} files.`);
