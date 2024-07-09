import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    parent: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        overflow: 'hidden'
    },
    panel: {
        maxHeight: '100%',
        left: 0,
        right: 0,
        bottom: 0,
        paddingBottom: 48, // Padding to avoid animation space at the bottom
        borderTopLeftRadius: 16,
        borderTopRightRadius: 16
    },
    background: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: '#000000'
    }
});

export default styles;
