const fs = require('fs');
let file = 'mobile/app/(tabs)/discover.tsx';
let content = fs.readFileSync(file, 'utf8');

// The block looks like this:
// cardWrapper: {
//   flex: 1,
//   paddingHorizontal: spacing.xs,
//   // Note: removed maxWidth: '48%' to allow Flex to split columns dynamically
// }

content = content.replace(/cardWrapper:\s*\{[\s\S]*?\}/g, "cardWrapper: {\n    flex: 1,\n    paddingHorizontal: spacing.xs,\n    paddingBottom: spacing.lg,\n  }");

fs.writeFileSync(file, content, 'utf8');
