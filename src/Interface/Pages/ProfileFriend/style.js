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

    // Current activity
    startNowContainer: {
        marginTop: 12,
        alignItems: 'center'
    },
    startNowButton: {
        height: 'auto',
        width: 200,
        marginTop: 6,
        padding: 8,
        paddingHorizontal: 0
    },

    // KPI
    kpiContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginTop: 24
    },
    kpiProfile: {
        paddingHorizontal: 2
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
    }
});

export default styles;
