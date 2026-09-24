const fs = require('fs');

const files = [
    'mobile/app/(tabs)/discover.tsx',
    'mobile/app/(tabs)/wishlist.tsx',
    'mobile/app/(tabs)/index.tsx'
];

files.forEach(file => {
    if (!fs.existsSync(file)) return;
    let content = fs.readFileSync(file, 'utf8');
    
    // Replace paddingHorizontal: spacing.xs with paddingHorizontal: spacing.xs, paddingBottom: spacing.md (or lg)
    content = content.replace(/cardWrapper:\s*\{\s*flex:\s*1,\s*paddingHorizontal:\s*spacing\.xs,?\s*\}/g, "cardWrapper: {\n    flex: 1,\n    paddingHorizontal: spacing.xs,\n    paddingBottom: spacing.lg,\n  }");
    // Also remove marginBottom from row if it exists so we don't double dip, or just leave it. 
    // Let's remove marginBottom from row to be consistent.
    content = content.replace(/row:\s*\{\s*justifyContent:\s*'space-between',\s*paddingHorizontal:\s*spacing\.sm,\s*marginBottom:\s*spacing\.md,?\s*\}/g, "row: {\n    justifyContent: 'space-between',\n    paddingHorizontal: spacing.sm,\n  }");
    
    fs.writeFileSync(file, content, 'utf8');
});
