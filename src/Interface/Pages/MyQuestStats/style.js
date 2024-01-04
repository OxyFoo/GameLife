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
        zIndex: 1010,
        elevation: 1010,
        paddingHorizontal: 0,
    },
    addActivity: {
        position: 'absolute',
        width: 50,
        height: 50,
        right: 36,
        bottom: 36
    },

    titleQuest: {
        margin: 0,
        padding: 0,
        textAlign: 'left'
    },
    headerView: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderRadius: 16,
        paddingVertical: 4,
        paddingHorizontal: 16
    },
    pageHeaderView: {
        marginBottom: 20
    },
    skills: {
        flexWrap: 'wrap',
        paddingBottom: 6,
    }
});

export default styles;
