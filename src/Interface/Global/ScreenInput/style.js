import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    parent: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0
    },
    background: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        opacity: 0.8,
        backgroundColor: '#000000'
    },
    panel: {
        position: 'absolute',
        top: 0,
        left: 12,
        right: 12,
        flexDirection: 'row',
        alignItems: 'flex-end',
        justifyContent: 'space-between'
    },
    input: {
        flex: 1
    },
    button: {
        width: 'auto',
        marginLeft: 12,
        paddingHorizontal: 30,
        borderRadius: 8
    }
});

export default styles;
