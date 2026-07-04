const { getSentryExpoConfig } = require('@sentry/react-native/metro');

const config = getSentryExpoConfig(__dirname);

config.resolver.sourceExts = [...config.resolver.sourceExts, 'tsx', 'ts'];
config.resolver.assetExts.push('gltf', 'glb', 'png', 'jpg', 'webp');

config.resolver.resolveRequest = (context, moduleName, platform) => {
  const originalResolveRequest = context.resolveRequest;

  if (platform === 'web') {
    if (moduleName.includes('../Utilities/Platform')) {
      return {
        type: 'sourceFile',
        filePath: require.resolve('react-native-web/dist/exports/Platform'),
      };
    }

    if (moduleName === 'react-native-google-mobile-ads') {
      return {
        type: 'empty',
      };
    }

    if (moduleName === '@react-native-google-signin/google-signin') {
      return {
        type: 'empty',
      };
    }
  }

  return originalResolveRequest(context, moduleName, platform);
};

module.exports = config;
