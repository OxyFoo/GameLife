import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    parent: {
        width: '100%',
        borderRadius: 4
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
        maxHeight: 256,
        color: '#FFFFFF',
        paddingHorizontal: 12
    },

    bar: {
        position: 'absolute',
        top: -2,
        left: 6,
        height: 3,
        backgroundColor: 'red'
    }
});

export default styles;