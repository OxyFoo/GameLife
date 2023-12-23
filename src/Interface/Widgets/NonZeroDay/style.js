import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    container: {
        padding: 0
    },
    containerItem: {
        borderTopLeftRadius: 0,
        borderTopRightRadius: 0
    },
    noClaim: {
        padding: 12,
        fontSize: 24
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
        marginTop: -38,
        borderRadius: 8
    },
    popupTitle: {
        paddingVertical: 8,
        fontSize: 24,
        borderRadius: 8,
        backgroundColor: '#00000040'
    },
    popupText: {
        fontSize: 14
    },

    marginTop: {
        marginTop: 12
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
        height: '100%',
        maxWidth: 120,
        paddingHorizontal: 12,
        borderRadius: 6,
        verticalAlign: 'middle'
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
        margin: 12,
        alignItems: 'center',
        justifyContent: 'center'
    },
    claimButton: {
        width: 72,
        marginRight: 12,
        paddingVertical: 0,
        paddingHorizontal: 6
    }
});

export default styles;
