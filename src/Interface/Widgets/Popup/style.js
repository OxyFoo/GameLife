import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    parent: {
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
    },
    background: {
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        opacity: .8,
        backgroundColor: '#000000'
    },
    container: {
        width: '80%',
        maxHeight: '60%',
        borderRadius: 16,
        overflow: 'visible'
    },

    title: {
        fontSize: 20,
        marginVertical: 24,
        paddingHorizontal: 8
    },
    message: {
        paddingHorizontal: 8
    },
    row: {
        width: '100%',
        padding: '5%',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-around'
    },
    button: {
        width: '45%',
        height: 48,
        borderRadius: 8
    },
    buttonQuit: {
        position: 'absolute',
        top: -48,
        right: 0,
        width: 36,
        height: 36,
        paddingHorizontal: 0,
        borderRadius: 4
    }
});

export default styles;
