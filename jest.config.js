module.exports = {
    preset: 'react-native',
    setupFiles: [ './jest.setup.js' ],
    transformIgnorePatterns: [
      'node_modules/(?!(jest-)?react-native|react-clone-referenced-element|@react-native|react-navigation|@react-native/polyfills/error-guard.js)'
    ],
    transform: {
      '^.+\\.(js|jsx|ts|tsx)$': require.resolve('babel-jest'),
      '\\.(xml|txt|md)$': 'jest-raw-loader',
    },
    moduleNameMapper: {
      'react-native/Libraries/Image/assetPathUtils': 'react-native/Libraries/Image/assetPathUtilsWeb',
      'react-native-web/dist/exports/Image/ImageResizeMode': 'react-native/Libraries/Image/ImageResizeMode',
      'react-native/Libraries/Components/View/ViewStylePropTypes': 'react-native-web/dist/exports/View/ViewStylePropTypes',
      'react-native/Libraries/Renderer/shims/ReactNativePropRegistry': 'react-native-web/dist/modules/ReactNativePropRegistry'
    }
};