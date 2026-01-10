import { Dimensions, StyleSheet } from 'react-native';

import user from 'Managers/UserManager';

const SCREEN_WIDTH = Dimensions.get('window').width;
const IMAGE_SIZE = (SCREEN_WIDTH * 0.6) / (Object.keys(user.settings.musicLinks).length + 2);

const styles = StyleSheet.create({
    content: {
        height: '100%',
        paddingVertical: 24,
        paddingHorizontal: 24,
        justifyContent: 'space-between'
    },
    topSection: {
        flex: 1,
        alignItems: 'center'
    },
    centerSection: {
        flex: 2,
        justifyContent: 'center',
        alignItems: 'center'
    },
    bottomSection: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'flex-end'
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: 12
    },
    button: {
        flex: 1,
        marginVertical: 6
    },
    finishButton: {
        flex: 2
    },
    musicTitle: {
        fontSize: 16,
        textAlign: 'center'
    },
    musicSection: {
        width: '100%',
        alignItems: 'center'
    },
    imageMap: {
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
