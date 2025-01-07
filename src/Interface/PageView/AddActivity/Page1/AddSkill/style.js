import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    title: {
        marginTop: 12,
        marginBottom: 12,
        fontSize: 24
    },
    skillTitle: {
        marginBottom: 6,
        fontSize: 22
    },
    details: {
        marginBottom: 12
    },
    info: {
        textAlign: 'left',
        fontSize: 14,
        marginBottom: 6
    },
    question: {
        marginTop: 12,
        marginBottom: 12
    },
    buttonsDiscord: {
        marginBottom: 12,
        flexDirection: 'row'
    },
    buttonDiscord: {
        maxWidth: '30%'
    },
    shareUsername: {
        flexDirection: 'row',
        alignItems: 'center',
        marginLeft: 12,
        marginBottom: 16
    },
    shareUsernameText: {
        marginLeft: 12,
        fontSize: 16,
        textAlign: 'left'
    },
    shareUsernameTextContainer: {
        flex: 1
    },
    buttons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 12
    },
    button: {
        width: 'auto',
        minWidth: '40%'
    }
});

export default styles;
