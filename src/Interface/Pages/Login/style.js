import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    body: {
        flex: 1,
        display: 'flex',
        alignItems: 'center'
    },
    container: {
        width: '100%',
        paddingVertical: 24,
        display: 'flex',
        alignItems: 'center',
        overflow: 'hidden'
    },
    backgroundImage: {
        width: 196,
        height: 196,
        marginTop: '30%'
    },
    backgroundCircles: {
        position: 'absolute',
        top: 0,
        right: 0
    },
    title: {
        fontSize: 58,
        textDecorationLine: 'underline'
    },
    text: {
        margin: 12,
        textAlign: 'center',
        fontSize: 16
    },
    input: {
        width: '80%'
    },
    button: {
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 0,
        margin: 24
    },
    backButton: {
        position: 'absolute',
        width: 64,
        left: 24,
        bottom: 24
    },
    cgu: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: -8
    },
    error: {
        margin: 2,
        fontSize: 12
    }
});

export default styles;