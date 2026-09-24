const fs = require('fs');
let file = 'mobile/app/(tabs)/index.tsx';
let content = fs.readFileSync(file, 'utf8');

// Replace import { brands } from '../../src/data';
content = content.replace(/import \{ brands \} from '\.\.\/\.\.\/src\/data';\r?\n/, "");

// Add hook import
content = content.replace(/import \{ useNotifications \} from '\.\.\/\.\.\/src\/hooks\/useNotifications';\r?\n/, "import { useNotifications } from '../../src/hooks/useNotifications';\nimport { useBrands } from '../../src/hooks/useTaxonomy';\n");

// Add hook call
content = content.replace(/const \{ data: notifications \} = useNotifications\(\);/, "const { data: notifications } = useNotifications();\n  const { data: brands = [] } = useBrands();");

fs.writeFileSync(file, content, 'utf8');
