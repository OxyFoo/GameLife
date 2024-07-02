import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    absolute: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        overflow: 'hidden'
    },
    container: {
        width: '100%',
        paddingVertical: 24,
        paddingHorizontal: 32,

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

    interactions: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    interactionsButton: {
        marginRight: 6
    },
    noWifiIcon: {
        marginRight: 24
    },
    avatar: {
        width: 48,
        height: 48,
        borderRadius: 12,
        paddingVertical: 0,
        paddingHorizontal: 0,
        backgroundColor: '#00000050'
    }
});

export default styles;
