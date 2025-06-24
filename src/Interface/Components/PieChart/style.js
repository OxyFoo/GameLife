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
        paddingVertical: 0
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

    flatlist: {},
    legendContainer: {
        width: '100%',
        flex: 1,
        justifyContent: 'center',
        textAlign: 'left'
    },
    legendContainerFullScreen: {
        width: '100%',
        justifyContent: 'center'
    },
    legendContainerFullDay: {
        width: '50%',
        marginTop: 8
    },
    legendItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingRight: 12
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
