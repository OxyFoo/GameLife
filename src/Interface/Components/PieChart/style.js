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
        justifyContent: 'space-between',
        alignItems: 'stretch',
        overflow: 'visible'
    },
    pieChart: {
        width: '40%',
        alignItems: 'center',
        justifyContent: 'center',
        minWidth: 120, // Taille minimale pour éviter l'écrasement
        maxWidth: 140, // Taille maximale pour garder la compacité
        overflow: 'visible'
    },
    pieChartFullDay: {
        position: 'absolute',
        top: 0,
        left: '50%',
        right: 0,
        bottom: 0
    },

    flatlist: {
        flexGrow: 0
    },
    legendContainer: {
        flex: 1,
        justifyContent: 'center'
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
    centerLabelText: {
        fontWeight: 'bold'
    },

    questsFlatlist: {
        width: '100%'
    },
    QuestsText: {
        width: '100%',
        textAlign: 'left'
    }
});

export default styles;
