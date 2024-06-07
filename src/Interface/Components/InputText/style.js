import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    parent: {
        width: '100%',
        minHeight: 54,
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
        color: '#FFFFFF',
        fontSize: 18,
        paddingVertical: 12,
        paddingHorizontal: 12
    },

    error: {
        position: 'absolute',
        right: 8,
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
    }
});

export default styles;
