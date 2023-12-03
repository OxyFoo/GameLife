import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    parent: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        height: 55,
        padding: 4,
        borderWidth: 1.6,
        borderRadius: 16
    },
    button: {
        width: '47.5%',
        height: '100%',
        borderRadius: 8,
        paddingHorizontal: 6
    },
    selection: {
        position: 'absolute',
        top: 4,
        bottom: 4,
        left: 4,
        borderRadius: 12
    }
});

export default styles;
