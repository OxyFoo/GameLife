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

    // Quest info
    questHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderRadius: 10,
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
        marginTop: 24,
        alignItems: 'center',
        paddingVertical: 16,
        borderRadius: 12
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
