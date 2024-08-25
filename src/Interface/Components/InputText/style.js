import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    parent: {
        width: '100%',
        borderRadius: 8
    },
    placeholderParent: {
        position: 'absolute',
        top: 0,
        left: 0,
        paddingHorizontal: 4,
        overflow: 'scroll',

        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
    },
    input: {
        minHeight: 12,
        maxHeight: 256,
        paddingVertical: 16,
        paddingHorizontal: 24,
        fontSize: 18,
        verticalAlign: 'middle'
    },
    counter: {
        position: 'absolute',
        top: -9,
        right: 12
    },

    icon: {
        position: 'absolute',
        right: 24,
        top: 0,
        bottom: 0,
        justifyContent: 'center',
        alignItems: 'center'
    },

    bar: {
        position: 'absolute',
        top: -2,
        left: 6,
        height: 3
    },
    barCounter: {
        position: 'absolute',
        top: -2,
        right: 8,
        height: 3
    }
});

export default styles;
