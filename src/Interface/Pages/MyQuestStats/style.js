import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    yearHeatMap: {
        marginTop: 24
    },
    streakChartContainer: {
        marginTop: 24,
        alignItems: 'center',
        padding: 16,
        borderRadius: 20
    },

    // Overlay
    editActivity: {
        position: 'absolute',
        width: 50,
        height: 50,
        top: 36,
        right: 36,
        paddingHorizontal: 0,
        zIndex: 1010,
        elevation: 1010
    },
    addActivity: {
        position: 'absolute',
        width: 50,
        height: 50,
        right: 36,
        bottom: 36
    }
});

export default styles;
