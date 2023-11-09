import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    dot: {
        height: 10,
        width: 10,
        borderRadius: 5,
        marginRight: 10
    },
    legendItem: {
        flexDirection: 'row',
        alignItems: 'center',
        width: 120
    },
    legendItemText: {
        color: 'white'
    },
    legendRow: {
        width: '100%',
        justifyContent: 'space-between',
        marginVertical: 5
    },
    pieChartContainer: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        alignItems: 'center'
    },
    centerLabel: {
        justifyContent: 'center',
        alignItems: 'center'
    },
    labelText: {
        fontSize: 22,
        color: 'white',
        fontWeight: 'bold'
    },
    labelSubText: {
        fontSize: 14,
        color: 'white'
    },
    legendContainer: {
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop:15
    }
});

export default styles;