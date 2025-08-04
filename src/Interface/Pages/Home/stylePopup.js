import { StyleSheet } from 'react-native';

const stylesPopup = StyleSheet.create({
    container: {
        width: '100%',
        padding: 16
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
