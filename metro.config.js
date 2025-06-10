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

/**
 * Configuration for local development modules
 */
const LOCAL_MODULES = [
    {
        name: '@oxyfoo/gamelife-types',
        localPath: '../GameLife-Types/dist'
    },
    {
        name: 'react-native-ssl-websocket',
        localPath: '../react-native-ssl-websocket'
    }
];

/**
 * Check which local modules are available and create their configurations
 */
function getAvailableLocalModules() {
    return LOCAL_MODULES.map((module) => ({
        ...module,
        absolutePath: path.resolve(__dirname, module.localPath)
    })).filter((module) => fs.existsSync(module.absolutePath));
}

/**
 * Create Metro configuration for local modules
 */
function createLocalModulesConfig() {
    const availableModules = getAvailableLocalModules();

    if (availableModules.length === 0) {
        return {};
    }

    // Create module mapping for the proxy
    const moduleMap = new Map(availableModules.map((module) => [module.name, module.absolutePath]));

    return {
        watchFolders: availableModules.map((module) => module.absolutePath),
        resolver: {
            extraNodeModules: new Proxy(
                {},
                {
                    get: (_, moduleName) => {
                        return moduleMap.get(moduleName) || path.resolve(__dirname, 'node_modules', moduleName);
                    }
                }
            )
        }
    };
}

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

    // Apply local modules configuration
    ...createLocalModulesConfig(),

    // Apply obfuscation plugin
    ...jsoMetroPlugin
};

module.exports = mergeConfig(getDefaultConfig(__dirname), config);
