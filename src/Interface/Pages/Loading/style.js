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
        justifyContent: 'center'
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
    buttonTestContent: {
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 60,
        alignItems: 'center'
    },
    buttonTest: {
        width: '60%',
        height: 60
    }
});

export default styles;
