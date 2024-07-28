import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    page: {
        flex: 1,
        paddingHorizontal: 24
    },
    progressbar: {
        marginTop: 12,
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

    sectionContainer: {
        marginTop: 24,
        marginBottom: 16,
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
    sectionTitleAddButton: {
        width: 'auto',
        paddingVertical: 8,
        paddingHorizontal: 8
    },

    todayPieChart: {
        width: '100%',
        borderRadius: 8
    },

    todoList: {
        marginBottom: 24
    }
});

export default styles;
