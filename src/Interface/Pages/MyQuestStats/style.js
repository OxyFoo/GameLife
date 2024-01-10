import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    pageHeaderView: {
        marginBottom: 20
    },

    // MyQuest info
    headerView: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderRadius: 16,
        paddingVertical: 4,
        paddingHorizontal: 16
    },
    titleQuest: {
        margin: 0,
        padding: 0,
        textAlign: 'left'
    },
    skills: {
        flexWrap: 'wrap',
        paddingBottom: 6
    },
    editActivity: {
        width: 50,
        height: 50,
        paddingHorizontal: 0
    },

    // Widgets
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
    addActivity: {
        position: 'absolute',
        width: 50,
        height: 50,
        right: 36,
        bottom: 36
    }
});

export default styles;
