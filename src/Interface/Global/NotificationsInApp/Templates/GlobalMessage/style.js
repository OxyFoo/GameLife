import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    rewardList: {
        flexGrow: 1,
        justifyContent: 'center'
    },

    globalMessageContainer: {
        paddingHorizontal: 12,
        alignItems: 'center'
    },
    globalMessageText: {
        marginBottom: 6
    },
    globalMessageButtons: {
        paddingBottom: 2,
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center'
    },
    globalMessageButton: {
        width: 'auto',
        marginHorizontal: 6,
        paddingVertical: 8,
        paddingHorizontal: 12
    },
    globalMessageButtonHidden: {
        opacity: 0,
        pointerEvents: 'none'
    }
});

export default styles;
