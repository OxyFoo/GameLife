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
        opacity: .8,
        backgroundColor: '#000000'
    },
    panel: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        paddingHorizontal: 12,

        flexDirection: 'row',
        alignItems: 'flex-end',
        justifyContent: 'space-between'
    },
    input: {
        width: '75%',
        height: '100%'
    },
    button: {
        width: '20%',
        borderRadius: 8
    }
});

export default styles;
