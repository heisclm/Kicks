const fs = require('fs');
let file = 'mobile/app.json';
let config = JSON.parse(fs.readFileSync(file, 'utf8'));

if (!config.expo.android.config) {
  config.expo.android.config = {};
}
if (!config.expo.android.config.googleMaps) {
  config.expo.android.config.googleMaps = {};
}
config.expo.android.config.googleMaps.apiKey = process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY || "AIzaSyDummyKeyForNow"; // They will replace it in .env

if (!config.expo.ios.config) {
  config.expo.ios.config = {};
}
if (!config.expo.ios.config.googleMapsApiKey) {
  config.expo.ios.config.googleMapsApiKey = process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY || "AIzaSyDummyKeyForNow";
}

fs.writeFileSync(file, JSON.stringify(config, null, 2), 'utf8');
