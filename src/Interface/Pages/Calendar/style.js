import { StyleSheet } from 'react-native';

/**
 * @param {any} _
 * @param {number} index
 * @returns {{ length: number, offset: number, index: number }}
 */
const getItemLayout = (_, index) => ({
    length: 65 + 6,
    offset: (65 + 6) * index,
    index
});

const styles = StyleSheet.create({
    page: {
        height: '100%',
        paddingBottom: 40,
        flexDirection: 'column',
        justifyContent: 'space-between'
    },

    // Summary
    summary: {
        paddingBottom: 16,
        paddingHorizontal: 24
    },
    summaryTitle: {
        marginBottom: 12,
        fontSize: 22,
        textAlign: 'left'
    },
    summaryHoursContent: {
        marginBottom: 2,
        flexDirection: 'row',
        alignContent: 'center',
        justifyContent: 'space-between'
    },

    // Activity list
    activityList: {
        flex: 1,
        marginBottom: 12,
        paddingHorizontal: 24
    },
    activityTitleContent: {
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    activityTitle: {
        flex: 1,
        marginBottom: 12,
        fontSize: 22,
        textAlign: 'left'
    },
    activityTitleDate: {
        flex: 1,
        marginBottom: 12,
        fontSize: 22,
        textAlign: 'right'
    },
    activityItem: {
        padding: 16,
        paddingHorizontal: 16,

        borderWidth: 1.5,
        borderRadius: 8
    },
    activitySeparator: {
        height: 12
    },
    activityButtonContent: {
        flexDirection: 'row',
        flexWrap: 'nowrap',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    activityChild: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    activityName: {
        maxWidth: '50%',
        marginLeft: 12,
        textAlign: 'left',
        fontSize: 18,
        fontWeight: 'bold'
    },
    categoryName: {
        marginLeft: 6,
        marginBottom: -2,
        textAlign: 'left',
        fontSize: 16
    },
    activityTime: {
        fontSize: 16
    },

    // Day list
    dayList: {},
    monthTitle: {
        fontSize: 18,
        marginBottom: 12
    },
    dayItem: {
        width: 65,
        marginHorizontal: 3,
        paddingVertical: 16,
        paddingHorizontal: 0,
        borderRadius: 8
    },
    dayContent: {
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center'
    },
    dayNumber: {
        width: '100%',
        fontSize: 20,
        fontWeight: 'bold'
    },
    dayName: {
        fontSize: 16
    }
});

export { getItemLayout };
export default styles;
