import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    XPHeader: {
        marginTop: 0,
        marginBottom: 12,
        paddingHorizontal: 16,
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    XPHeaderLvl: {
        flexDirection: 'row'
    },
    level: {
        marginRight: 8
    },
    homeRow: {
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    topSpace: {
        marginTop: 16
    },
    titleWidget: {
        marginBottom: 12
    },
    todayPieChart: {
        flex: 1
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
