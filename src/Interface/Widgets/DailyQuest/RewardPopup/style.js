import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    // Popup
    popup: {
        width: '90%',
        minWidth: '90%',
        paddingVertical: 12,
        paddingHorizontal: 12,
        justifyContent: 'center'
    },
    popupTitleContainer: {
        marginTop: -42,
        transform: [{ translateY: 4 }],
        borderRadius: 8,
        zIndex: 1,
        elevation: 1
    },
    popupTitle: {
        paddingVertical: 8,
        fontSize: 24,
        borderRadius: 8,
        backgroundColor: '#00000040'
    },
    popupText: {
        paddingTop: 12,
        paddingBottom: 8,
        fontSize: 14
    },

    separatorFirst: {
        height: 16
    },
    separator: {
        height: 8
    },
    item: {
        height: 56,
        padding: 6,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderRadius: 8
    },
    content: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    itemDay: {
        width: 'auto',
        maxWidth: 120,
        paddingHorizontal: 12
    },

    rewardItem: {
        width: 48,
        height: 48,
        padding: 6,
        marginLeft: 8,
        borderRadius: 6,
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'visible'
    },
    rewardImage: {
        width: '100%',
        height: '100%'
    },
    rewardValue: {
        position: 'absolute',
        right: 2,
        bottom: -2
    },

    claimState: {
        position: 'absolute',
        top: 0,
        right: 0,
        bottom: 0,
        paddingRight: 12,
        paddingVertical: 6,
        alignItems: 'center',
        justifyContent: 'center'
    },
    claimButton: {
        height: '100%',
        justifyContent: 'center',
        paddingVertical: 0,
        paddingHorizontal: 12
    },

    claimAllView: {
        position: 'absolute',
        bottom: -36,
        left: 0,
        right: 0,
        flexDirection: 'row',
        justifyContent: 'center'
    },
    claimAllButton: {
        height: 'auto',
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderWidth: 1.5,
        borderColor: '#B83EFFE3'
    }
});

export default styles;
