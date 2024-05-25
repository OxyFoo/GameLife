import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    body: {
        width: '100%',
        height: 10,
        borderRadius: 8,
        overflow: 'hidden'
    },
    bar: {
        width: '100%',
        height: '100%'
    },
    black: {
        position: 'absolute',
        width: '120%',
        height: '100%',
        top: 0,
        left: 0,
        borderLeftWidth: 0.6,
        borderLeftColor: '#FFFFFF',
        backgroundColor: '#000000',
        overflow: 'hidden'
    },
    preCover: {
        left: '-200%'
    },
    cover: {
        position: 'absolute',
        top: 0,
        left: '-100%',
        width: '100%',
        minWidth: 0.6,
        height: '100%',
        opacity: 0.5,
        backgroundColor: '#FFFFFF'
    }
});

export default styles;
