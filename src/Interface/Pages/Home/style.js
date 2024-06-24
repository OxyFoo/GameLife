import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    page: {
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

    sectionTitle: {
        marginTop: 16,
        marginBottom: 24,
        fontSize: 21,
        textAlign: 'left',
        textTransform: 'uppercase'
    },

    topSpace: {
        marginTop: 16
    },
    homeRow: {
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    titleWidget: {
        marginBottom: 12,
        fontWeight: 'bold'
    },
    todayPieChart: {
        width: '100%',
        borderRadius: 8
    },
    stats: {
        flex: 1,
        borderRadius: 24,
        marginRight: 18,
        padding: 8
    },
    skills: {
        width: '60%',
        borderRadius: 20,
        padding: 8
    },
    skillsGroup: {
        flex: 0
    }
});

export default styles;
