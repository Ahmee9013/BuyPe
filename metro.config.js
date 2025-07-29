// metro.config.js
const { getDefaultConfig } = require('@expo/metro-config');
const {
  wrapWithReanimatedMetroConfig,
} = require('react-native-reanimated/metro-config');

// Get the default Expo config
const config = getDefaultConfig(__dirname);

// Add custom extensions or other resolver options
config.resolver.sourceExts.push('cjs');
config.resolver.unstable_enablePackageExports = false;

// Wrap the config with Reanimated's config
module.exports = wrapWithReanimatedMetroConfig(config);
