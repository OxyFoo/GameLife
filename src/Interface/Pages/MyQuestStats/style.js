import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    pageHeaderView: {
        marginBottom: 20
    },

    // MyQuest info
    questHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderRadius: 16,
        paddingVertical: 4,
        paddingLeft: 16,
        paddingRight: 8
    },
    questText: {
        flex: 1
    },
    questTitle: {
        margin: 0,
        padding: 0,
        textAlign: 'left'
    },
    questSkills: {
        textAlign: 'left',
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
