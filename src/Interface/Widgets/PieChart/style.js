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
        height: 110 - 6, // Same as the pie chart size (hardcoded in index.js) - margin (title height)
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

export default styles;
