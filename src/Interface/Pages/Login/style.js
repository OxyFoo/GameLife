import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    page: {
        height: '100%',
        padding: 32,
        justifyContent: 'space-evenly'
    },
    form: {
        alignItems: 'center'
    },
    title: {
        fontSize: 58
    },
    text: {
        margin: 12,
        marginBottom: 48,
        textAlign: 'center',
        fontSize: 18
    },
    input: {
        width: '90%'
    },

    cbLang: {
        position: 'absolute',
        top: 24,
        right: 12,
        width: 'auto'
    },
    cbLangInput: {
        paddingVertical: 6,
        paddingHorizontal: 24
    },

    buttonLoginSignin: {
        width: 'auto',
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 0,
        margin: 24
    },
    buttonBack: {
        position: 'absolute',
        width: 64,
        left: 24,
        bottom: 24
    },

    cgu: {
        width: '90%',
        flexDirection: 'row',
        alignItems: 'center'
    },
    cguTextContainer: {
        flex: 1,
        flexDirection: 'row',
        flexWrap: 'wrap',
        textAlign: 'left'
    },
    cguText: {
        textAlign: 'left'
    },
    cguCheckBox: {
        width: 28,
        marginRight: 16,
        borderWidth: 1.2
    },

    error: {
        margin: 2,
        fontSize: 12
    }
});

export default styles;
