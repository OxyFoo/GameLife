import { View, FlatList, StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    text: { fontSize: 22 },
    input: { height: 52, marginBottom: 24 },

    column: { width: '50%' },
    row: {
        marginVertical: 24,
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    rowDigit: {
        marginVertical: 2,
        paddingHorizontal: '20%',

        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    center: {
        marginVertical: "10%",
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        
    },
    button: {
        height: 48,
        marginHorizontal: '20%',
        borderRadius: 8
    }
});

export default styles;