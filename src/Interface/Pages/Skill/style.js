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
        marginBottom: 12,
        flexDirection: 'row',
        alignItems: 'center'
    },
    activityIcon: {
        marginRight: 16
    },
    activityTextView: {
        flex: 1,
        alignItems: 'flex-start'
    },
    activityText: {
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'left'
    },
    categoryText: {
        fontSize: 14,
        textAlign: 'left'
    },
    skillUnallocated: {
        fontSize: 14,
        textAlign: 'left',
        opacity: 0.7,
        marginTop: 2
    },
    creator: {
        marginTop: 6,
        marginRight: 6,
        fontSize: 16,
        textAlign: 'center'
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

    // Info
    infoContainer: {
        marginBottom: 12
    },

    // KPIs
    kpiContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 12
    },
    kpiLeft: {
        marginRight: 6
    },
    kpiRight: {
        marginLeft: 6
    },

    // Skill chart
    skillChart: {
        marginBottom: 12
    },

    // History
    historyButton: {
        marginBottom: 12
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
    }
});

export default styles;
