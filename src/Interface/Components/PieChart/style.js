import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    dot: {
        height: 10,
        width: 10,
        borderRadius: 5,
        marginRight: 4,
        marginLeft: 8
    },
    pieChartContainer: {
        paddingHorizontal: 0,
        paddingVertical: 0,

        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
    },
    legendContainer: {
        paddingTop: 6
    },
    legendItem: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    centerLabel: {
        justifyContent: 'center',
        alignItems: 'center'
    }
});

export default styles;
