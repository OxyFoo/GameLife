import { StyleSheet, Dimensions } from 'react-native';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

const styles = StyleSheet.create({
    // NotificationsInApp full screen
    background: {
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundColor: '#00000060'
    },
    container: {
        position: 'absolute',
        top: 120,
        width: '70%',
        minWidth: 200,
        marginLeft: '15%',
        maxHeight: Math.max(SCREEN_HEIGHT / 2, 200),
        paddingVertical: 12,
        flexDirection: 'row',
        borderWidth: 2,
        borderColor: 'white',
        borderRadius: 10,
        backgroundColor: '#000000D0',
    },
    flatlist: {
        width: '100%',
        height: '100%'
    },
    separator: {
        width: '90%',
        marginLeft: '5%',
        marginVertical: 12
    },

    // FriendPending
    friendPendingContainer: {
        flexDirection: 'row',
        paddingHorizontal: 12
    },
    friendPendingText: {
        width: '65%'
    },
    friendPendingButtons: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-evenly'
    },
    friendPendingButton: {
        width: '40%',
        height: 'auto',
        aspectRatio: 1,
        paddingVertical: 12,
        paddingHorizontal: 0
    },

    // FriendPendingBlock
    friendPendingBlockView: {
        marginTop: 6,
        flexDirection: 'row',
        justifyContent: 'space-evenly'
    },
    friendPendingBlockButton: {
        height: 'auto',
        paddingVertical: 8,
        paddingHorizontal: 12
    },

    // AchievementPending
    achievementPendingContainer: {
        flexDirection: 'row',
        paddingHorizontal: 12
    },
    achievementPendingText: {
        width: '65%'
    },
    achievementPendingButtons: {
        width: '35%',
        paddingLeft: 12
    },
    achievementPendingButton: {
        height: 48,
        paddingVertical: 12,
        paddingHorizontal: 0
    }
});

export default styles;
