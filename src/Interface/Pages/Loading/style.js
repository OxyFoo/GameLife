import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    content: {
        width: '100%',
        height: '100%',

        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
    },
    textContainer: {
        position: 'absolute',
        left: 24,
        right: 24,
        bottom: 24,
        textAlign: 'center'
    },

    // Test page
    contentTest: {
        width: '100%',
        height: '100%',
        paddingHorizontal: 24,

        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-evenly'
    },
    iconTest: {
        marginBottom: 24,
        transform: [{ scaleX: 1.2 }]
    },
    zapTest: {
        marginTop: 24
    },
    buttonTest: {
        width: '60%',
        marginTop: 24
    }
});

export default styles;
