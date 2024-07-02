import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    page: {
        paddingHorizontal: 24
    },
    title: {
        marginBottom: 12,
        fontSize: 21,
        textAlign: 'left'
    },

    activity: {
        padding: 16,
        paddingHorizontal: 16,

        borderWidth: 1,
        borderRadius: 8
    },
    activitySeparator: {
        height: 12
    },
    activityButtonContent: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    activityChild: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    activityHour: {
        marginLeft: 12,
        fontSize: 18,
        fontWeight: 'bold'
    },
    activityName: {
        fontSize: 16
    }
});

export default styles;
