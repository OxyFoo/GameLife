import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    page: {
        width: '100%',
        height: '100%',
        paddingHorizontal: 0,
        paddingTop: '30%',
        alignItems: 'center',
        justifyContent: 'space-evenly'
    },

    container: {
        width: '100%',
        alignItems: 'center'
    },

    chestContainer: {
        width: '80%',
        aspectRatio: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
    chestImage: {
        height: '70%',
        aspectRatio: 1
    },

    frameContainer: {
        position: 'absolute',
        aspectRatio: 1,
        height: '100%'
    },
    frame: {
        width: '100%',
        height: '100%',
        borderWidth: 4,
        borderRadius: 24
    },

    button: {
        width: '80%',
        marginBottom: 48
    }
});

export default styles;
