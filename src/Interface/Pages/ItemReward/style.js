import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    page: {
        width: '100%',
        height: '100%',
        paddingHorizontal: 0,
        paddingTop: '20%',
        alignItems: 'center',
        justifyContent: 'space-evenly'
    },

    container: {
        width: '100%',
        alignItems: 'center'
    },

    frameContainer: {
        aspectRatio: 1,
        width: '70%'
    },
    frame: {
        width: '100%',
        height: '100%',
        borderWidth: 4,
        borderRadius: 24,
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden'
    },
    avatarFrame: {
        transform: [{ scale: 2 }]
    },

    textContainer: {
        alignItems: 'center',
        marginTop: 24
    },

    button: {
        width: '80%',
        marginBottom: 48
    }
});

export default styles;
