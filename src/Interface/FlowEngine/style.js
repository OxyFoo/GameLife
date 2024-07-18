import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    fullscreen: {
        height: '100%',
        overflow: 'hidden'
    },
    background: {
        backgroundColor: '#03052E'
    },

    safeView: {
        width: '100%',
        height: '100%',
        backgroundColor: '#000000'
    },
    parent: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,

        margin: 0,
        padding: 0
    },
    scrollviewContainer: {
        minHeight: '100%'
    }
});

export default styles;
