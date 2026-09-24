const fs = require('fs');

let layoutFile = 'mobile/app/_layout.tsx';
let layoutContent = fs.readFileSync(layoutFile, 'utf8');
layoutContent = layoutContent.replace(/"light" === "dark"/g, "false").replace(/'light' === 'dark'/g, "false");
fs.writeFileSync(layoutFile, layoutContent, 'utf8');

let settingsFile = 'mobile/app/profile/settings.tsx';
let settingsContent = fs.readFileSync(settingsFile, 'utf8');
settingsContent = settingsContent.replace(/\(val\) => \{\}/g, "(val: boolean) => {}");
fs.writeFileSync(settingsFile, settingsContent, 'utf8');
