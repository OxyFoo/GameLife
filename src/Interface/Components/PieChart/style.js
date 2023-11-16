import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    dot: {
        height: 10,
        width: 10,
        borderRadius: 5,
        marginRight: 10
    },

    pieChartContainer: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        alignItems: 'center'
    },
    legendContainer: {
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop:15
    },
    legendFlatList: {
        width: '100%'
    },
    legendFlatListContent: {
        paddingHorizontal: 5
    },
    legendFlatListColumn: {
        width: '100%',
        justifyContent: 'space-between',
        marginVertical: 5
    },
    legendItem: {
        flexDirection: 'row',
        alignItems: 'center',
        width: 120
    },
    legendItemText: {
        color: 'white'
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
    }
});

export default styles;