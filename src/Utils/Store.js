import { Linking, Platform } from 'react-native';

async function OpenStore() {
    const url =
        Platform.OS === 'ios'
            ? 'https://apps.apple.com/app/game-life/id1587486522'
            : 'https://play.google.com/store/apps/details?id=com.gamelife';

    await Linking.canOpenURL(url).then((supported) => {
        if (supported) {
            return Linking.openURL(url);
        }
        return null;
    });
}

export { OpenStore };
