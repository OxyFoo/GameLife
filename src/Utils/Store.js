import { Linking, Platform } from 'react-native';

/**
 * Open store page
 */
const openStore = () => {
    const url = Platform.OS === 'ios'
        ? 'https://apps.apple.com/app/game-life/id1587486522'
        : 'https://play.google.com/store/apps/details?id=com.gamelife';

    Linking.canOpenURL(url).then(supported => {
        supported && Linking.openURL(url);
    }, (err) => console.log(err));
};

export { openStore };