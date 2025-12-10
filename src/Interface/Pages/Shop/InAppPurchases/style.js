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
    itemParent: {
        flex: 1
    },
    itemButton: {
        flex: 1,
        paddingVertical: 12,
        paddingHorizontal: 8
    },
    itemContent: {
        width: '100%',
        height: '100%',
        alignItems: 'center',
        justifyContent: 'space-between'
    },

    itemName: {
        fontSize: 16
    },
    itemIcon: {
        marginVertical: 8
    },
    itemRarity: {
        fontSize: 11,
        fontWeight: 'bold'
    },

    itemPrice: {},
    itemPriceOx: {
        fontSize: 16,
        marginRight: 4
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
