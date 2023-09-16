import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    flatlist: {
        paddingHorizontal: 12,
        marginBottom: 24
    },

    itemParent: {
        width: '33%',
        aspectRatio: 1/1.3,
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
        fontSize: 10
    },
    itemRarity: {
        fontSize: 11,
        fontWeight: 'bold'
    },

    imageChest: {
        width: '100%',
        height: '100%',
        transform: [
            { scale: .7 },
            { translateY: 12 }
        ]
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

    itemDecoration: {
        position: 'absolute',
        top: 0,
        width: '100%',
        height: 4
    },

    // Popup - Item
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