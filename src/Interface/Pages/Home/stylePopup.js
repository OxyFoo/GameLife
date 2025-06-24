import { StyleSheet } from 'react-native';

const stylesPopup = StyleSheet.create({
    // Styles for popup
    popupContent: {
        padding: 16,
        maxHeight: 500
    },
    popupScrollView: {
        maxHeight: 450
    },
    popupHeader: {
        marginBottom: 16
    },
    popupTitle: {
        textAlign: 'center',
        fontWeight: '700'
    },
    popupSection: {
        marginBottom: 16
    },
    sectionTitle: {
        textAlign: 'left',
        paddingVertical: 0,
        fontSize: 18,
        fontWeight: '600',
        marginBottom: 0
    },
    sectionText: {
        textAlign: 'left',
        lineHeight: 20,
        marginTop: 8
    }
});

export default stylesPopup;
