module.exports = {
    presets: ['module:@react-native/babel-preset'],
    plugins: [
        [
            'module-resolver',
            {
                root: ['./src'],
                alias: {
                    Ressources: './res/'
                }
            }
        ],
        'react-native-reanimated/plugin'
    ]
};
