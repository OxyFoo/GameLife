import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    page: {
        height: '100%',
        paddingHorizontal: 24
    },
    title: {
        marginBottom: 12,
        textAlign: 'left',
        fontSize: 21
    },

    // Skill card
    titleContainer: {
        marginBottom: 24
    },
    gradient: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
        paddingHorizontal: 24,
        borderRadius: 8
    },
    activityIcon: {
        marginRight: 16
    },
    activityTextView: {
        flex: 1
    },
    activityText: {
        fontSize: 16,
        textAlign: 'left'
    },
    skillUnallocated: {
        fontSize: 16,
        textAlign: 'left',
        opacity: 0.7
    },
    creator: {
        marginTop: 6,
        marginRight: 6,
        fontSize: 18,
        textAlign: 'right'
    },

    // XP bar & level
    levelContainer: {
        marginBottom: 24
    },
    levelsView: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginTop: 6,
        paddingHorizontal: 6
    },

    // KPIs
    kpiContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 24
    },
    kpiLeft: {
        marginRight: 6
    },
    kpiRight: {
        marginLeft: 6
    },

    // Skill chart
    skillChart: {
        marginBottom: 24
    },

    // History
    historyButton: {
        marginBottom: 24
    },
    historyTitle: {
        marginTop: 24,
        marginBottom: 12,
        fontSize: 24
    },
    historySeparator: {
        width: '80%',
        height: 1,
        alignSelf: 'center'
    },
    historyFlatList: {
        width: '100%',
        maxHeight: '85%' // TODO: Calculate the height of parent bottomPanel
    },
    historyItem: {
        width: 'auto',
        marginHorizontal: 24,
        paddingVertical: 12,
        paddingHorizontal: 6,
        marginVertical: 2
    },

    // Add activity button
    addActivity: {
        position: 'absolute',
        width: 'auto',
        right: 24,
        bottom: 24,
        paddingVertical: 12,
        paddingHorizontal: 12
    }
});

export default styles;
