import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    container: {
        padding: 16,
        borderRadius: 20,
        backgroundColor: '#9196fb',
    },
    headerText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
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