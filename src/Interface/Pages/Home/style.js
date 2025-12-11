import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    page: {
        flex: 1,
        paddingHorizontal: 24
    },

    // Styles for progress bar and XP header
    progressbar: {
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
        fontSize: 12,
        fontWeight: 600
    },
    experience: {
        fontSize: 12
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
        alignItems: 'stretch',
        justifyContent: 'space-between',
        gap: 12
    },
    chartItem: {
        flex: 1
    },
    todoList: {
        marginBottom: 24
    },
    dailyQuest: {
        marginBottom: 48
    }
});

export default styles;
