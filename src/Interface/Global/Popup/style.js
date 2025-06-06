import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    parent: {
        position: 'absolute',
        top: 0,
        left: 0,
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
        opacity: 0.8,
        backgroundColor: '#000000'
    },

    container: {
        maxWidth: '90%',
        maxHeight: '80%',
        paddingHorizontal: 16,
        borderRadius: 16,
        overflow: 'visible'
    },
    dynamicBackground: {
        borderRadius: 16,
        overflow: 'hidden'
    },
    buttonQuit: {
        position: 'absolute',
        top: -48,
        right: 0,
        width: 32,
        height: 'auto',
        minHeight: 'auto',
        paddingVertical: 0,
        paddingHorizontal: 0,
        borderRadius: 4
    },

    // Template styles
    title: {
        fontSize: 20,
        marginVertical: 24,
        paddingHorizontal: 8
    },
    message: {
        paddingHorizontal: 8,
        marginBottom: 12
    },
    row: {
        width: '100%',
        padding: 16,
        paddingBottom: 24,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-around'
    },
    button: {
        width: '45%',
        borderRadius: 8
    },
    fillWidth: {
        width: '100%'
    }
});

export default styles;
