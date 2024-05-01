import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    page: {
        height: '100%',
        padding: 32,
        justifyContent: 'space-evenly'
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
        width: '90%',
        marginLeft: '5%'
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
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        flexWrap: 'wrap'
    },
    cguCheckBox: {
        marginRight: 12
    },

    error: {
        margin: 2,
        fontSize: 12
    }
});

export default styles;
