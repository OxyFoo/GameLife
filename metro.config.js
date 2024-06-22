const { getDefaultConfig, mergeConfig } = require('@react-native/metro-config');

const Obfuscator = require('obfuscator-io-metro-plugin');
/**
 * Metro configuration for React Native
 * https://github.com/facebook/react-native
 *
 * @format
 */

const jsoMetroPlugin = Obfuscator(
    {
        // for these option look javascript-obfuscator library options from  above url
        log: false,
        compact: true,
        sourceMap: true,
        deadCodeInjection: true,
        deadCodeInjectionThreshold: 0.3,
        controlFlowFlattening: true,
        controlFlowFlatteningThreshold: 1,
        numbersToExpressions: true,
        simplify: true,
        stringArrayShuffle: true,
        splitStrings: true,
        stringArrayThreshold: 1
    },
    {
        runInDev: true, // optional
        logObfuscatedFiles: false // optional generated files will be located at ./.jso/

        // source Map generated after obfuscation is not useful right now
        // sourceMapLocation: "./index.android.bundle.map" // optional  only works if sourceMap: true in obfuscation option
    }
);

/**
 * Metro configuration
 * https://reactnative.dev/docs/metro
 *
 * @type {import('metro-config').MetroConfig}
 */
const config = {
    transformer: {
        getTransformOptions: async () => ({
            transform: {
                experimentalImportSupport: false,
                inlineRequires: true
            }
        })
    },
    ...jsoMetroPlugin
};

module.exports = mergeConfig(getDefaultConfig(__dirname), config);
