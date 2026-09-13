import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    page: {
        marginBottom: 6,
        paddingTop: 24,
        paddingHorizontal: 24
    },

    header: {
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        marginBottom: 16
    },
    image: {
        width: 84,
        height: 84,
        borderRadius: 12
    },
    headerText: {
        flex: 1,
        gap: 2
    },
    left: {
        textAlign: 'left'
    },
    badges: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginTop: 2
    },
    badge: {
        paddingVertical: 2,
        paddingHorizontal: 8,
        borderRadius: 10
    },

    notParticipated: {
        textAlign: 'center',
        paddingVertical: 12
    },
    kpiContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    kpi: {
        paddingHorizontal: 2
    },
    kpiMiddle: {
        marginHorizontal: 12
    },
    duration: {
        textAlign: 'center',
        marginTop: 8
    },

    rewards: {
        alignItems: 'center',
        gap: 12,
        marginTop: 20,
        marginBottom: 12
    },
    rewardList: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center'
    },
    claim: {
        marginTop: 4
    }
});

export default styles;
