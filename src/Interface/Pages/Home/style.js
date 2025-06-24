import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    page: {
        flex: 1,
        paddingHorizontal: 24
    },

    // Styles for progress bar and XP header
    progressbar: {
        marginTop: 0,
        marginBottom: 6
    },
    XPHeader: {
        marginTop: 0,
        marginBottom: 0,
        paddingHorizontal: 16,
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    level: {
        fontSize: 16,
        fontWeight: 700
    },
    experience: {
        fontSize: 16
    },

    // Styles for title.js file
    sectionContainer: {
        marginTop: 12,
        marginBottom: 12,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    sectionTitle: {
        paddingVertical: 6,
        fontSize: 21,
        textAlign: 'left',
        textTransform: 'uppercase'
    },

    // Special styles for section title and add button
    sectionTitleAddButton: {
        width: 'auto',
        paddingVertical: 8,
        paddingHorizontal: 8
    },

    // Styles for main content
    chartsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'stretch',
        gap: 12
    },
    chartItem: {
        flex: 1, // Les deux charts prendront la même largeur
        alignItems: 'center'
    },
    todayPieChart: {
        width: '100%'
    },
    questProgressChart: {
        width: '100%'
    },
    quests: {
        marginTop: 0
    },
    dailyQuests: {
        marginTop: 0
    },
    todoList: {
        marginBottom: 24
    }
});

export default styles;
