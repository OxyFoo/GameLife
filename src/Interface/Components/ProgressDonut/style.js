import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    parent: {
        position: 'relative'
    },
    content: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        justifyContent: 'center',
        alignItems: 'center',
        pointerEvents: 'none'
    }
});

export default styles;
