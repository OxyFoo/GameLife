import { StyleSheet } from 'react-native';

const stylesPopup = StyleSheet.create({
    container: {
        padding: 16,
        maxHeight: '90%',
        width: '100%',
        flex: 1
    },
    popupTitle: {
        textAlign: 'center',
        fontWeight: '700',
        marginBottom: 16
    },
    section: {
        marginBottom: 16
    },
    titleContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 8
    },
    title: {
        fontSize: 18,
        fontWeight: '600',
        flex: 1,
        textAlign: 'left'
    },
    content: {
        marginTop: 8,
        overflow: 'hidden'
    },
    text: {
        lineHeight: 20,
        marginTop: 8,
        textAlign: 'left'
    }
});

export default stylesPopup;
