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
    itemContent: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },

    itemInfo: {
        alignContent: 'center',
        justifyContent: 'center'
    },
    itemName: {
        marginBottom: 4,
        fontSize: 14
    },
    itemRarity: {
        marginTop: 4,
        fontSize: 11,
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
    itemPriceOxEditedOld: {
        fontSize: 16,
        marginRight: 4,
        transform: [{ translateY: 6 }],
        textDecorationLine: 'line-through'
    },
    itemPriceOxEditedNew: {
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
