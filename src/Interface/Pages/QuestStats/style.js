import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    page: {
        height: '100%',
        paddingHorizontal: 24
    },
    pageHeader: {
        marginBottom: 48
    },
    title: {
        marginTop: 24,
        marginBottom: 12,
        fontSize: 21,
        textAlign: 'left'
    },
    warnText: {
        marginTop: 16,
        fontSize: 12
    },

    // Quest info
    questHeader: {
        borderRadius: 10
    },
    questHeaderView: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingLeft: 16
    },
    questTextView: {
        flex: 1
    },
    questTitle: {
        paddingTop: 12,
        fontSize: 24,
        textAlign: 'left'
    },
    questSkills: {
        textAlign: 'left',
        flexWrap: 'wrap',
        paddingBottom: 12,
        fontSize: 14
    },
    editActivityView: {
        height: '100%',
        padding: 6,
        flexDirection: 'row',
        alignItems: 'center'
    },
    editActivityTime: {
        marginRight: 6,
        fontSize: 14
    },
    editActivityButton: {
        width: 'auto',
        height: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 0,
        paddingHorizontal: 16,
        borderRadius: 10
    },

    // Widgets
    streakChartContainer: {
        marginTop: 12,
        alignItems: 'center',
        borderRadius: 12
    },
    streakChartView: {
        paddingVertical: 16
    },
    yearHeatMap: {
        // Margin bottom + add activity button height
        marginBottom: 24 + 96
    },

    // Overlay
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
