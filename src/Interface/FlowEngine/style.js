import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    fullscreen: {
        width: '100%',
        height: '100%'
    },
    background: {
        backgroundColor: '#03052E'
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
    scrollview: {
        width: '100%',
        height: '100%'
    },
    scrollviewContainer: {
        minHeight: '100%'
    }
});

export default styles;
