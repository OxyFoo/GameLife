import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    // NotificationsInApp full screen
    container: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#000000D0'
    },
    flatlist: {
        paddingHorizontal: 24,
        maxHeight: '100%'
    },
    separator: {
        width: '90%',
        marginLeft: '5%',
        marginVertical: 24
    },
    backButton: {
        position: 'absolute',
        top: 24,
        left: 24,
        height: 'auto',
        paddingVertical: 12,
        paddingHorizontal: 12,
        flexDirection: 'row',
        alignItems: 'center'
    },
    backButtonArrow: {
        marginRight: 12
    },

    // FriendPending
    friendPendingButtons: {
        marginTop: 12,
        flexDirection: 'row',
        justifyContent: 'space-evenly'
    },
    friendPendingButton: {
        width: '40%',
        height: 'auto',
        paddingVertical: 12,
        paddingHorizontal: 0
    }
});

export default styles;
