import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    gradient: {
        flex: 1,
        borderRadius: 8,
        padding: 8
    },
    header: {
        width: '100%',
        marginBottom: 4
    },
    title: {
        textAlign: 'left'
    },
    body: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        gap: 6
    },
    center: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 2
    }
});

export default styles;
