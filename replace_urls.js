const fs = require('fs');
let file = 'supabase/seed.sql';
let content = fs.readFileSync(file, 'utf8');

// Replace the mock image URLs with real unsplash URLs
let i = 0;
const urls = [
  "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&q=80",
  "https://images.unsplash.com/photo-1515955656352-a1fa3ffcd111?w=800&q=80",
  "https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?w=800&q=80"
];

content = content.replace(/\/mock-image\.png/g, () => {
  const url = urls[i % urls.length];
  i++;
  return url;
});

fs.writeFileSync(file, content, 'utf8');
