import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    container: {
        width: '100%',
        paddingVertical: 24,

        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    userHeader: {
        flexShrink: 1,
        justifyContent: 'center'
    },

    usernameContainer: {
        flexDirection: 'row',
        alignItems: 'flex-end'
    },
    username: {
        fontSize: 24,
        fontWeight: 800,
        textAlign: 'left'
    },
    title: {
        marginTop: -2,
        fontSize: 14,
        textAlign: 'left'
    },

    buttons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    button: {
        width: 'auto',
        paddingVertical: 12,
        paddingHorizontal: 12
    }
});

export default styles;
