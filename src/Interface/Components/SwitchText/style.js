import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    parent: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        height: 55,
        padding: 7,
        borderWidth: 1.6,
        borderRadius: 8
    },
    button: {
        width: '47.5%',
        height: '100%',
        borderRadius: 4,
        paddingHorizontal: 6,
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden'
    },
    selection: {
        position: 'absolute',
        top: 7,
        bottom: 7,
        left: 7,
        borderRadius: 4
    }
});

export default styles;
