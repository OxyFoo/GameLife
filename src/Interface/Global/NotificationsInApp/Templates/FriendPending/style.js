import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
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
        width: '40%',
        paddingVertical: 8,
        paddingHorizontal: 12
    },
    friendPendingBlockButtonContent: {
        alignItems: 'center',
        justifyContent: 'space-between'
    }
});

export default styles;
