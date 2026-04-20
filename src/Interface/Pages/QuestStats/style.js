import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    page: {
        height: '100%',
        paddingHorizontal: 24
    },
    pageHeader: {
        marginBottom: 0
    },
    title: {
        marginTop: 24,
        marginBottom: 12,
        fontSize: 21,
        textAlign: 'left'
    },
    warnText: {
        marginBottom: 12,
        fontSize: 12
    },

    // Quest Header
    questHeaderView: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start'
    },
    questSkills: {
        textAlign: 'left',
        flexWrap: 'wrap',
        fontSize: 14
    },

    // KPI Row (Efficiency & Streak)
    kpiRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 12
    },

    // KPI Container
    kpiContainer: {
        flex: 1,
        borderRadius: 8
    },

    // Shared KPI Styles
    kpiContent: {
        padding: 12
    },
    kpiTitle: {
        marginBottom: 4,
        textAlign: 'left'
    },
    donutContainer: {
        alignItems: 'center',
        justifyContent: 'center'
    },
    donutCenter: {
        alignItems: 'center',
        justifyContent: 'center'
    },
    streakRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4
    },

    // Heatmap
    heatmapContainer: {
        marginTop: 16,
        borderRadius: 8
    },
    heatmapContent: {
        padding: 12
    },

    // Add Activity Button
    addActivity: {
        position: 'absolute',
        width: 'auto',
        left: 24,
        right: 24,
        bottom: 36,
        paddingVertical: 16,
        paddingHorizontal: 24
    }
});

export default styles;
