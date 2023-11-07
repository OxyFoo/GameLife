import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    legendItem: {
        flexDirection: 'row',
        alignItems: 'center',
        width: 120,
    },
    legendItemText: {
        color: 'white',
    },
    legendRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 10,
        paddingHorizontal: 16,
    },
    pieChartContainer: {
        padding: 20,
        alignItems: 'center',
    },
    centerLabel: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    labelText: {
        fontSize: 22,
        color: 'white',
        fontWeight: 'bold',
    },
    labelSubText: {
        fontSize: 14,
        color: 'white',
    },
});

export default styles;