import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    // Flatlists
    flatlist: {
        marginBottom: 24
    },
    flatlistContent: {
        gap: 12
    },

    // Category
    category: {
        paddingHorizontal: 12,
        paddingVertical: 12
    },

    // Item
    itemButton: {
        flex: 1,
        paddingVertical: 0,
        paddingHorizontal: 6,
        borderWidth: 2
    },
    itemContent: {
        flex: 1,
        height: '100%',
        justifyContent: 'space-between'
    },

    itemInfo: {
        alignContent: 'center',
        justifyContent: 'center'
    },
    itemName: {
        marginTop: 6,
        fontSize: 14
    },
    itemRarity: {
        fontSize: 14,
        fontWeight: 'bold'
    },

    imageChest: {
        width: '100%',
        height: 'auto',
        aspectRatio: 1,
        marginBottom: -24,
        transform: [{ scale: 0.7 }, { translateY: -8 }]
    },

    itemPrice: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 6
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
    itemOxImageEdited: {
        marginTop: 24
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
