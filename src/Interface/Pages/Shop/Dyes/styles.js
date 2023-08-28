import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    // Containers
    containerHeader: {
        justifyContent: 'center'
    },
    errorText: {
        padding: 12
    },

    // Page - Dyer
    dyerContainer: {
        padding: 0
    },
    dyerFrame: {
        width: '30%',
        aspectRatio: 1
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
    dyeAmount: {
        alignItems: 'center'
    },
    dyeAmountText: {
        marginRight: 6
    },
    dyeAmountPrice: {
        flexDirection: 'row'
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