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
        paddingHorizontal: 0
    },
    hintContainer: {
        width: '100%'
    },
    hint: {
        height: '100%',
        fontSize: 18,
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
        backgroundColor: '#000000A0'
    },
    defaultButtonArrowContainer: {
        position: 'absolute',
        right: 12,
        bottom: 12, 
        alignItems: 'flex-end',
        opacity: .8
    },
    defaultButton: {
        width: '50%'
    },

    skipButton: {
        position: 'absolute',
        bottom: 12,
        left: 12
    },

    background: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        opacity: .6,
        backgroundColor: '#000000'
    }
});

export default styles;
