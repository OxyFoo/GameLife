import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    container: {
        marginBottom: 24
    },
    containerHeader: {
        justifyContent: 'center'
    },

    itemsContainer: {
        padding: 0
    },

    errorText: {
        padding: 12
    },

    // Items
    itemParent: {
        width: '25%',
        aspectRatio: 1,
        padding: 2
    },
    itemButton: {
        height: '100%',
        paddingHorizontal: 0,
        borderRadius: 4,
        backgroundColor: 'red'
    },
    itemBorder: {
        width: '100%',
        height: '100%',
        padding: 3
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
    itemFrame: {
        width: '95%',
        height: '95%'
    },
    itemPrice: {
        flexDirection: 'row',
        alignItems: 'center',
        transform: [{ translateY: -12 }]
    },
    itemPriceOx: {
        fontSize: 16,
        marginRight: 4
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