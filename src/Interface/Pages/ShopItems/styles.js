import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    // Overlay
    overlayHeader: {
        marginTop: 18,
        marginBottom: 18
    },
    overlayWallet: {
        position: 'absolute',
        top: 0,
        right: 24,
        bottom: 0,
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center'
    },
    overlayOx: {
        marginRight: 6,
        fontSize: 24
    },

    // Containers
    container: {
        marginBottom: 24
    },
    containerHeader: {
        justifyContent: 'center'
    },

    // Page
    header: {
        marginBottom: 24
    },
    wallet: {
        marginBottom: 24,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center'
    },
    ox: {
        marginRight: 6,
        fontSize: 24
    },

    // Titles
    titlesContainer: {
        padding: 0
    },
    titleButton: {
        paddingRight: 24,
        justifyContent: 'space-between',
        borderRadius: 0
    },
    titlePrice: {
        flexDirection: 'row'
    },
    titlePriceOx: {
        marginRight: 12
    },

    // Items
    itemsContainer: {
        padding: 0
    },
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
    },

    // Popup - Title
    titlePopup: {
        padding: 24
    },
    titlePopupTitle: {
        fontSize: 22
    },
    titlePopupButton: {
        marginTop: 24
    },

    // Page - Dyer
    dyerContainer: {
        padding: 0
    },
    dyeView: {
        height: 'auto',
        borderRadius: 4,
        paddingHorizontal: 0,

        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    dyeBorder: {
        margin: 2,
        padding: 3,
        borderRadius: 4
    },
    dyerFrame: {
        width: '30%',
        aspectRatio: 1
    },
    dyeAmount: {
        alignItems: 'center'
    },
    dyeAmountText: {
        marginRight: 6
    },
    dyeAmountPrice: {
        flexDirection: 'row'
    },

    // Popup - Dyer
    dyerPopup: {
        padding: 24,
        paddingBottom: 48 * 2 * 2
    },
    dyerPopupTitle: {
        fontSize: 22
    },
    dyerPopupText: {
        fontSize: 16,
        textAlign: 'center'
    },
    dyerPopupSwitch: {
        marginTop: 12,
        marginBottom: 24
    },
    dyerPopupSeparator: {
        marginLeft: '20%',
        width: '60%',
        opacity: .25
        //paddingBottom: 36
    },
    dyerPopupContainer: {
        //paddingBottom: 36
    },
    dyerPopupButton: {
        marginTop: 24
    },

    errorText: {
        padding: 12
    }
});

export default styles;