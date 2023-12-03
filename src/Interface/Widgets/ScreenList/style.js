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
    background2: {
        position: 'absolute',
        top: '100%',
        left: 0,
        right: 0,
        height: 24
    },

    item: {
        padding: 12
    },

    label: {
        fontSize: 28,
        paddingVertical: 12
    },
    panel: {
        top: '100%',
        width: '100%',
        maxHeight: '80%',
        borderTopLeftRadius: 16,
        borderTopRightRadius: 16
    }
});

export default styles;
