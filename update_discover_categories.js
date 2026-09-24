const fs = require('fs');
let file = 'mobile/app/(tabs)/discover.tsx';
let content = fs.readFileSync(file, 'utf8');

// Replace import { categories } from '../../src/data';
content = content.replace(/import \{ categories \} from '\.\.\/\.\.\/src\/data';\r?\n/, "");

// Add hook import
content = content.replace(/import \{ useProducts \} from '\.\.\/\.\.\/src\/hooks\/useProducts';\r?\n/, "import { useProducts } from '../../src/hooks/useProducts';\nimport { useCategories } from '../../src/hooks/useTaxonomy';\n");

// Add hook call
// We also need to handle the activeCategory state which relies on categories[0].id.
// So we update the state to be initialized later or default to 'all'.
content = content.replace(/const \[activeCategory, setActiveCategory\] = useState\(categories\[0\]\.id\);/, "const { data: categories = [] } = useCategories();\n  const [activeCategory, setActiveCategory] = useState<string>('all');");

// We need to modify how activeCategory is used if it's 'all'.
// Wait, categories map needs to prepend an 'All' category for the UI.
content = content.replace(/<ScrollView horizontal showsHorizontalScrollIndicator=\{false\} style=\{styles\.categoriesContainer\} contentContainerStyle=\{\{ paddingHorizontal: spacing\.xxl \}\}>\s*\{categories\.map\(\(category\) => \(/, `<ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoriesContainer} contentContainerStyle={{ paddingHorizontal: spacing.xxl }}>
          <Pressable
            key="all"
            style={[styles.categoryPill, activeCategory === 'all' && styles.categoryPillActive]}
            onPress={() => setActiveCategory('all')}
          >
            <Text style={[styles.categoryText, activeCategory === 'all' && styles.categoryTextActive]}>All</Text>
          </Pressable>
          {categories.map((category) => (`);

fs.writeFileSync(file, content, 'utf8');
