import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    flatlist: {
        flexGrow: 0,
        marginBottom: 24
    },
    flatlistContent: {
        alignItems: 'stretch',
        gap: 12
    },
    flatlistColumnWrapper: {
        gap: 12
    },
    errorText: {
        padding: 12
    },

    // Daily deals
    itemButton: {
        flex: 1,
        paddingVertical: 0,
        paddingHorizontal: 0
    },
    // Cards of a row are stretched to the same height: the price is pinned at the bottom and the
    // name block has a fixed two-line height, so frames and prices line up whatever the name length
    itemContent: {
        flex: 1,
        height: '100%',
        alignItems: 'center',
        justifyContent: 'space-between'
    },

    itemInfo: {
        // itemRarity (4 + 14) + itemName (2 × 18 + 4)
        minHeight: 58,
        alignItems: 'center',
        justifyContent: 'center'
    },
    itemName: {
        marginBottom: 4,
        fontSize: 14,
        lineHeight: 18
    },
    itemRarity: {
        marginTop: 4,
        fontSize: 11,
        lineHeight: 14,
        fontWeight: 'bold'
    },

    itemPrice: {
        marginVertical: 8,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center'
    },
    itemPriceOx: {
        fontSize: 16,
        marginRight: 4
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
