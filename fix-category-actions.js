const fs = require('fs');
let code = fs.readFileSync('admin/features/categories/category-actions.ts', 'utf8');

code = code.replace(
  "const rawData = { name: formData.get('name'), description: formData.get('description'), parent_id: formData.get('parent_id') };",
  "const rawData = { name: formData.get('name'), description: formData.get('description') || '', parent_id: formData.get('parent_id') || undefined };"
);

code = code.replace(
  "const rawData = { id: formData.get('id'), name: formData.get('name'), description: formData.get('description'), parent_id: formData.get('parent_id') };",
  "const rawData = { id: formData.get('id'), name: formData.get('name'), description: formData.get('description') || '', parent_id: formData.get('parent_id') || undefined };"
);

fs.writeFileSync('admin/features/categories/category-actions.ts', code);
