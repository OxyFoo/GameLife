import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    popup: {
        minWidth: '90%',
        maxWidth: '90%',
        paddingVertical: 24,
        paddingHorizontal: 12
    },

    rowMail: {
        marginBottom: 32
    },
    textMail: {
        width: '100%'
    },

    row: {
        marginBottom: 24,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    title: {
        marginBottom: 24,
        fontSize: 20
    },
    text: {
        flex: 1,
        textAlign: 'left'
    },

    buttonEdit: {
        width: 'auto',
        paddingVertical: 10,
        paddingHorizontal: 24,
        borderRadius: 8
    },
    buttonCancel: {
        width: 'auto',
        paddingVertical: 14,
        marginTop: 12
    },

    // History
    titlesContainer: {
        height: 'auto',
        maxHeight: '100%'
    },
    titlesTitle: {
        marginTop: 24,
        marginBottom: 12,
        fontSize: 24
    },
    titlesSeparator: {
        width: '80%',
        height: 1,
        alignSelf: 'center'
    },
    titlesFlatList: {
        maxHeight: '85%'
    },
    titlesItem: {
        width: 'auto',
        marginHorizontal: 24,
        paddingVertical: 12,
        paddingHorizontal: 6,
        marginVertical: 2
    }
});

export default styles;
