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
    claimTodayProgressbar: {
        marginTop: 4
    },
    claimTomorrow: {
        marginRight: 0,
        fontSize: 16
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
        paddingHorizontal: 16
    }
});

export default styles;
