import { Dimensions, StyleSheet } from 'react-native';

import user from 'Managers/UserManager';

const SCREEN_WIDTH = Dimensions.get('window').width;
const IMAGE_SIZE = (SCREEN_WIDTH * 0.6) / (Object.keys(user.settings.musicLinks).length + 2);

const styles = StyleSheet.create({
    content: {
        height: '100%',
        paddingVertical: 32,
        paddingHorizontal: 24,
        justifyContent: 'space-between'
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    button: {
        marginVertical: 6
    },
    musicTitle: {
        fontSize: 16
    },
    imageMap: {
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center'
    },
    image: {
        width: IMAGE_SIZE,
        height: IMAGE_SIZE,
        marginTop: 12,
        marginHorizontal: 12,
        resizeMode: 'contain'
    }
});

export default styles;
