import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    flatlist: {
        maxHeight: '35%', // Why ?
        marginBottom: 24,
        paddingHorizontal: 12
    },
    errorText: {
        padding: 12
    },

    // Daily deals
    itemParent: {
        width: '33%',
        aspectRatio: 1 / 1.3,
        paddingBottom: 4,
        paddingHorizontal: 6
    },
    itemButton: {
        width: '100%',
        height: '100%',
        paddingHorizontal: 0,
        borderRadius: 8
    },
    itemContent: {
        width: '100%',
        height: '100%',

        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',

        borderRadius: 2,
        overflow: 'hidden'
    },

    itemInfo: {
        position: 'absolute',
        top: 12,
        left: 0,
        right: 0,

        alignContent: 'center',
        justifyContent: 'center'
    },
    itemName: {
        fontSize: 14
    },
    itemRarity: {
        fontSize: 11,
        fontWeight: 'bold'
    },

    itemFrameContainer: {
        width: '90%',
        aspectRatio: 1 / 1,
        zIndex: -10,
        elevation: -10
    },
    itemFrame: {
        width: '100%',
        height: '100%'
    },

    itemPrice: {
        position: 'absolute',
        bottom: 12,
        left: 0,
        right: 0,

        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center'
    },
    itemPriceOx: {
        fontSize: 16,
        marginRight: 4
    },
    itemPriceOxEditedOld: {
        fontSize: 16,
        marginRight: 4,
        transform: [{ translateY: 6 }],
        textDecorationLine: 'line-through'
    },
    itemPriceOxEditedNew: {
        marginRight: 4
    },
    itemOxImage: {
        width: 16,
        aspectRatio: 1
    },
    itemOxImageEdited: {
        width: 16,
        aspectRatio: 1,
        marginTop: 24
    },

    itemDecoration: {
        position: 'absolute',
        top: 0,
        width: '100%',
        height: 4
    },

    // Popup
    itemPopup: {
        padding: 24
    },
    itemPopupTitle: {
        fontSize: 22
    },
    itemPopupText: {
        marginTop: 12,
        fontSize: 14,
        textAlign: 'center'
    },
    itemPopupButton: {
        marginTop: 24
    }
});

export default styles;
