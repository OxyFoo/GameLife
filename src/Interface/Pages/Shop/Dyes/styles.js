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

        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
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

    dyeBorder: {
        position: 'absolute',
        top: 0,
        width: '100%',
        height: 4
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
    },

    errorText: {
        padding: 12
    }
});

export default styles;