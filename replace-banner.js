
const fs = require("fs");
let index = fs.readFileSync("mobile/app/(tabs)/index.tsx", "utf8");

// Add import
if (!index.includes("FeaturedCarousel")) {
  index = index.replace(
    "import { BrandPill } from \x27../../src/components/BrandPill\x27;",
    "import { BrandPill } from \x27../../src/components/BrandPill\x27;\nimport { FeaturedCarousel } from \x27../../src/components/FeaturedCarousel\x27;"
  );
}

// Replace banner
const bannerRegex = /\{\/\*\s*Featured Banner\s*\*\/\}[\s\S]*?\{\/\*\s*Brands\s*\*\/\}/;
index = index.replace(bannerRegex, `{/* Featured Banner Carousel */}\n          <FeaturedCarousel products={products} />\n\n          {/* Brands */}`);

fs.writeFileSync("mobile/app/(tabs)/index.tsx", index);

