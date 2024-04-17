import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    dot: {
        height: 10,
        width: 10,
        borderRadius: 5,
        marginRight: 4,
        marginLeft: 8
    },
    pieChart: {
        width: '50%'
    },
    pieChartFullDay: {
        position: 'absolute',
        top: 0,
        left: '50%',
        right: 0,
        bottom: 0
    },
    pieChartContainer: {
        width: '100%',
        marginLeft: 12,
        paddingHorizontal: 0,
        paddingVertical: 0,

        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },

    legendContainer: {
        width: '50%',
        marginTop: 8
    },
    legendContainerFullDay: {
        width: '50%',
        marginTop: 8
    },
    legendItem: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    centerLabel: {
        justifyContent: 'center',
        alignItems: 'center'
    },

    myquestsFlatlist: {
        width: '100%'
    },
    myQuestsText: {
        width: '100%',
        textAlign: 'left'
    }
});

export default styles;
