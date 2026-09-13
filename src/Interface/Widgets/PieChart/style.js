import { StyleSheet } from 'react-native';

/** Diameter of the donut: the outer ring of the raid widget beside it on the Home takes the same */
const DONUT_SIZE = 120;

const styles = StyleSheet.create({
    dot: {
        height: 10,
        width: 10,
        borderRadius: 5,
        marginRight: 4,
        marginLeft: 8
    },
    pieChart: {
        width: '40%',
        alignItems: 'center',
        justifyContent: 'center',
        minWidth: 120, // Minimum size to avoid crushing
        maxWidth: 140, // Maximum size to keep compactness
        overflow: 'visible'
    },

    legendContainerFullScreen: {
        width: '100%',
        marginTop: 6,
        height: DONUT_SIZE - 6, // Same height as the donut, margin included
        alignItems: 'center',
        justifyContent: 'center'
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
    }
});

export { DONUT_SIZE };
export default styles;
