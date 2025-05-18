const { getDefaultConfig, mergeConfig } = require('@react-native/metro-config');

const fs = require('fs');
const path = require('path');
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

const localTypesPath = path.resolve(__dirname, '../GameLife-Types/dist');
const isLocalTypesPresent = fs.existsSync(localTypesPath);

/**
 * Enable local game life types (more info in README.md)
 *
 * @type {import('@react-native/metro-config').MetroConfig}
 */
const localGameLifeTypesConfig = {
    watchFolders: [localTypesPath],
    resolver: {
        extraNodeModules: new Proxy(
            {},
            {
                get: (_, name) => path.resolve(__dirname, 'node_modules', name)
            }
        )
    }
};

/**
 * Metro configuration
 * https://reactnative.dev/docs/metro
 *
 * @type {import('@react-native/metro-config').MetroConfig}
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
    ...(isLocalTypesPresent && localGameLifeTypesConfig),
    ...jsoMetroPlugin
};

module.exports = mergeConfig(getDefaultConfig(__dirname), config);
