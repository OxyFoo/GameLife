import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    body: {
        width: '100%',
        height: 10,
        borderRadius: 8,
        backgroundColor: '#000000',
        overflow: 'hidden'
    },
    bar: {
        width: '100%',
        height: '100%'
    },
    mask: {
        position: 'absolute',
        width: '110%', // Extra 10% to cover the whole bar (during the animation)
        height: '100%',
        top: 0,
        left: '-110%',
        borderTopRightRadius: 8,
        borderBottomRightRadius: 8,
        backgroundColor: '#000000'
    },
    supXP: {
        position: 'absolute',
        top: 0,
        left: '-110%',
        width: '110%',
        minWidth: 0.6,
        height: '100%',
        opacity: 0.4,
        borderTopRightRadius: 8,
        borderBottomRightRadius: 8,
        backgroundColor: '#FFFFFF'
    }
});

export default styles;
