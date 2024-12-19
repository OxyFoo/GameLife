import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    // Achievements page
    parent: {
        height: '100%'
    },
    flatlist: {
        marginBottom: 24
    },
    pageHeader: {
        paddingHorizontal: 24
    },

    // Achievements page banner
    banner: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 12,
        paddingLeft: 24,
        paddingRight: 12
    },
    bannerTitleContainer: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    bannerTitleText: {
        fontSize: 20,
        marginLeft: 4
    },
    bannerSortButton: {
        flexDirection: 'row',
        alignItems: 'center',
        width: 'auto',
        paddingVertical: 6,
        paddingHorizontal: 12
    },
    bannerSortButtonText: {
        fontSize: 18,
        marginRight: 4
    },

    // Achievement cards
    achievementButton: {
        width: 'auto',
        marginVertical: 6,
        marginHorizontal: 24,
        paddingVertical: 0,
        paddingHorizontal: 0,
        borderWidth: 1.4
    },
    achievementGradient: {
        flex: 1
    },
    achievementContent: {
        flex: 1,
        paddingTop: 6,
        paddingBottom: 12,
        paddingHorizontal: 12
    },

    // Card content
    achievementContentTitle: {
        marginTop: 6,
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    achievementInfoIcon: {
        marginTop: 1
    },
    achievementTitle: {
        fontSize: 18,
        textAlign: 'left'
    },

    // Card content description / condition / reward (rollable)
    achievementContentDescription: {
        overflow: 'hidden'
    },
    achievementDescription: {
        marginTop: 6,
        marginBottom: 6,
        textAlign: 'left',
        fontSize: 14
    },
    achievementCondition: {
        textAlign: 'left',
        fontSize: 14
    },

    achievementReward: {
        marginBottom: 6,
        textAlign: 'left',
        fontSize: 14
    },
    achievementGlobalProgression: {
        textAlign: 'left',
        fontSize: 14
    },

    achievementProgressionValue: {
        marginBottom: 2,
        fontSize: 14,
        textAlign: 'right'
    }
});

export default styles;
