import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    fullscreen: {
        height: '100%',
        overflow: 'hidden'
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
        bottom: 0
    },

    page: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        overflow: 'hidden'
    }
});

export default styles;
