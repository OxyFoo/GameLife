import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    parent: {
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%'
    },
    overlay: {
        position: 'absolute',
        borderWidth: 2,
        borderRadius: 4
    },
    overlayButton: {
        flex: 1,
        paddingVertical: 0,
        paddingHorizontal: 0
    },
    overlayButtonBackground: {
        borderWidth: 2
    },
    overlayButtonInset: {
        flex: 1
    },
    zapContainer: {
        flex: 1
    },
    hintContainer: {
        width: '100%',
        height: '100%'
    },
    hint: {
        height: '100%',
        fontSize: 20,
        textAlign: 'center',
        textAlignVertical: 'center',
        textShadowRadius: 4,
        textShadowColor: '#000000'
    },
    text: {
        position: 'absolute',
        padding: 12,
        borderRadius: 12,
        borderWidth: 1,
        backgroundColor: '#000000E0'
    },
    nextButton: {
        position: 'absolute',
        left: 24,
        right: 24,
        bottom: 24,
        width: 'auto'
    },

    skipButton: {
        position: 'absolute',
        top: 24,
        left: 24,
        width: 'auto',
        paddingVertical: 10,
        opacity: 0.75
    },
    stepText: {
        position: 'absolute',
        top: 24,
        right: 24,
        width: 'auto'
    },

    background: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        opacity: 0.6,
        backgroundColor: '#000000'
    }
});

export default styles;
