import { Dimensions, StyleSheet } from 'react-native';

import user from 'Managers/UserManager';

const SCREEN_WIDTH = Dimensions.get('window').width;
const IMAGE_SIZE = SCREEN_WIDTH * 0.8 / (Object.keys(user.settings.musicLinks).length + 2); 

const styles = StyleSheet.create({
    content: {
        height: '100%',
        justifyContent: 'space-evenly'
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    headActivityText: {
        fontSize: 36
    },
    headText: {
        fontSize: 20
    },
    title: {
        fontSize: 28
    },
    button: {
        width: '45%'
    },
    musicTitle: {
        fontSize: 22
    },
    imageMap: {
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-evenly'
    },
    image: {
        width: IMAGE_SIZE,
        height: IMAGE_SIZE,
        marginTop: 24,
        resizeMode: 'contain'
    }
});

export default styles;
