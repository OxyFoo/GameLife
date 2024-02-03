import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    // User Header
    header: {
        width: '100%',
        marginBottom: 6,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    content: {
        justifyContent: 'center',
        height: 84
    },
    usernameContainer: {
        flexDirection: 'row',
        alignItems: 'flex-end'
    },
    username: {
        marginTop: 6,
        fontSize: 28,
        textAlign: 'left'
    },
    title: {
        fontSize: 24,
        textAlign: 'left'
    },

    // Profile
    topSpace: {
        marginTop: 24
    },
    botSpace: {
        marginBottom: 24
    },
    xpRow: {
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    rowText: {
        fontSize: 14,
        textAlign: 'left'
    },
    tableRow: {
        width: '100%',
        height: 48,
        flexDirection: 'row',
        borderTopWidth: .4
    },
    cell: {
        width: '50%',
        paddingHorizontal: 16,
        justifyContent: 'center',
        borderRightWidth: .4
    },

    // Avatar
    avatarContainer: {
        width: '100%',
        alignItems: 'center'
    },
    avatar: {
        width: '80%',
        aspectRatio: 1,
        borderRadius: 16,
        backgroundColor: '#FFFFFF',
        overflow: 'hidden'
    },
    avatarOverlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        borderRadius: 16
    }
});

export default styles;
