import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    container: {
        padding: 8
    },
    noClaim: {
        padding: 12,
        fontSize: 24
    },

    headerStyle: {
        justifyContent: 'space-between',
        paddingHorizontal: 0
    },
    iconButtonPadding: {
        paddingHorizontal: 12
    },
    iconStaticHeader: {
        width: 'auto',
        height: 'auto',
        alignContent: 'center'
    },
    buttonInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',
        paddingLeft: 0,
        borderRadius: 0
    },

    // Popup
    popup: {
        height: 500,
        paddingVertical: 12,
        paddingHorizontal: 12,
        justifyContent: 'center',
        overflow: 'visible'
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
        paddingVertical: 12,
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
        right: -32,
        bottom: -12
    },

    claimState: {
        aspectRatio: 1,
        position: 'absolute',
        top: 0,
        right: 0,
        bottom: 0,
        paddingVertical: 6,
        alignItems: 'center',
        justifyContent: 'center'
    },
    claimButton: {
        width: 72,
        height: '100%',
        marginRight: 28,
        paddingVertical: 0,
        paddingHorizontal: 6
    }
});

export default styles;
