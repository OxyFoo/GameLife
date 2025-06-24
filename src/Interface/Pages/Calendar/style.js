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
        paddingBottom: 30,
        flexDirection: 'column',
        justifyContent: 'space-between'
    },

    // Summary
    summary: {
        paddingBottom: 16,
        paddingHorizontal: 24
    },
    summaryTitle: {
        marginBottom: 8,
        fontSize: 18,
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
    activityItem: {
        paddingVertical: 16,
        paddingHorizontal: 16,

        borderWidth: 1.5,
        borderRadius: 8
    },
    activityItemSmallPadding: {
        paddingVertical: 10
    },
    activityEmptyButton: {
        width: 'auto',
        marginTop: 12,
        marginHorizontal: 24
    },
    activityButtonContent: {
        flexDirection: 'row',
        flexWrap: 'nowrap',
        alignItems: 'center'
    },
    activityChild: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center'
    },
    activityTimes: {
        flexDirection: 'column',
        alignItems: 'flex-end'
    },
    activityName: {
        marginLeft: 12,
        textAlign: 'left',
        fontSize: 18,
        fontWeight: 'bold'
    },
    activityTime: {
        fontSize: 16
    },
    activityUTC: {
        fontSize: 12
    },

    // Day list
    dayList: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 12,
        paddingHorizontal: 24
    },
    monthTitle: {
        fontSize: 18
    },
    daysButtonOption: {
        width: 'auto',
        paddingVertical: 8,
        paddingHorizontal: 8
    },
    dayItem: {
        width: 65,
        marginHorizontal: 3,
        paddingVertical: 16,
        paddingHorizontal: 0,
        borderRadius: 8
    },
    dayItemActive: {
        borderWidth: 1
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
