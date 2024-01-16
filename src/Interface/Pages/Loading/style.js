import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    content: {
        width: '100%',
        height: '100%',

        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
    },
    sentence: {
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: -12,
        textAlign: 'center'
    },
    version: {
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 12,
        textAlign: 'center'
    },

    // Test page
    contentTest: {
        width: '100%',
        height: '100%',

        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-evenly'
    },
    iconTest: {
        marginBottom: 24,
        transform: [
            { scaleX: 1.2 }
        ]
    },
    zapTest: {
        marginTop: 24
    },
    buttonTest: {
        width: '60%',
        height: 60,
        marginTop: 24
    }
});

export default styles;
