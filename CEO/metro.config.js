const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

const config = getDefaultConfig(__dirname);

// Force Metro to only resolve modules from the local project's node_modules
config.resolver.nodeModulesPaths = [
  path.resolve(__dirname, 'node_modules'),
];

// Block Metro from watching parent directories which contain the Next.js web application
config.watchFolders = [__dirname];

module.exports = config;
