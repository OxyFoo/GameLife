import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    parent: {
        width: 56,
        height: 32,
        borderRadius: 8,
        overflow: 'hidden'
    },
    circle: {
        position: 'absolute',
        top: 7,
        left: 7,
        width: 18,
        height: 'auto',
        paddingHorizontal: 0,
        aspectRatio: 1,
        borderRadius: 48
    },
    background: {
        width: '100%',
        height: '100%',
    },
    activeBackground: {
        position: 'absolute',
        top: '50%',
        left: 16,
        width: 1,
        height: 1,
        borderRadius: 100
    },

    fill: {
        width: '100%',
        height: '100%'
    }
});

export default styles;
