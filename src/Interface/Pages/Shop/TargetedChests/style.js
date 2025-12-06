import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    // Flatlists
    flatlistTargets: {
        marginBottom: 12
    },
    flatlistTargetsContent: {
        gap: 12
    },
    flatlistChests: {
        marginBottom: 24
    },
    flatlistChestsContent: {
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
        paddingHorizontal: 0,
        borderWidth: 2
    },
    itemContent: {
        flex: 1
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
    itemOxImage: {
        width: 16,
        aspectRatio: 1
    },
    itemOxImageEdited: {
        width: 16,
        aspectRatio: 1,
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
