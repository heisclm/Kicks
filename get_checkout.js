const fs = require('fs');
let file = 'mobile/app/checkout/index.tsx';
let content = fs.readFileSync(file, 'utf8');

const match = content.match(/const handlePlaceOrder = async \(\) => \{[\s\S]*?setIsPlacingOrder\(false\);\n  \};/);
if (match) {
  console.log(match[0]);
} else {
  console.log("NOT FOUND");
}
