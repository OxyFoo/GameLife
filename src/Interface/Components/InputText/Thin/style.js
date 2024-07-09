import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    parent: {
        width: '100%',
        borderRadius: 8
    },
    input: {
        minHeight: 12,
        maxHeight: 256,
        color: '#FFFFFF',
        fontSize: 16,
        paddingVertical: 8,
        paddingHorizontal: 12
    },
    bar: {
        position: 'absolute',
        bottom: 0,
        width: '100%',
        height: 2,
        backgroundColor: 'red'
    }
});

export default styles;
