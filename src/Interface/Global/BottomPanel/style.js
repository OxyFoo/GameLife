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
        top: 0,
        left: 0,
        right: 0,
        borderTopLeftRadius: 16,
        borderTopRightRadius: 16
    },
    gradient: {
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
