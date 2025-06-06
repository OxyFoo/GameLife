import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    dyerFrame: {
        width: '30%',
        aspectRatio: 1
    },
    dyeView: {
        height: 'auto',
        borderRadius: 8,
        paddingHorizontal: 0,
        marginHorizontal: 24,
        marginBottom: 12,

        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    dyeAmount: {
        alignItems: 'center'
    },
    dyeAmountPriceEdit: {
        flexDirection: 'row',
        alignItems: 'flex-end'
    },
    dyeAmountText: {
        marginRight: 6
    },
    dyeAmountTextOld: {
        marginBottom: -6,
        marginRight: 6,
        fontSize: 16,
        textDecorationLine: 'line-through'
    },
    dyeAmountPrice: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    dyeOxImage: {
        width: 20,
        aspectRatio: 1
    },
    dyeOxImageEdit: {
        width: 20,
        aspectRatio: 1,
        marginBottom: 3
    },

    dyeDecoration: {
        position: 'absolute',
        top: 0,
        width: '100%',
        height: 4
    },

    errorText: {
        padding: 12
    },

    // Popup - Item
    popupContainer: {
        padding: 24
    },
    popupTitle: {
        fontSize: 22
    },
    popupText: {
        marginTop: 12,
        fontSize: 14,
        textAlign: 'center'
    },
    popupButton: {
        marginTop: 24
    }
});

export default styles;
