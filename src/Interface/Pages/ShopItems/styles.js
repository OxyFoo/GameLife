import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    header: {
        marginBottom: 24
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
    container: {
        marginBottom: 24
    },

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
        borderRadius: 2
    },
    itemPrice: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    itemPriceOx: {
        fontSize: 16,
        marginRight: 4
    }
});

export default styles;