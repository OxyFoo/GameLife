import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    page: {
        width: '100%',
        height: '100%',
        padding: 24,
        paddingBottom: 0
    },

    title: {
        marginBottom: 12,
        textAlign: 'left',
        fontSize: 21,
        textTransform: 'uppercase'
    },

    topfriendsContainer: {
        marginTop: 12,
        marginBottom: 24
    },

    friendsButtonContainer: {
        position: 'absolute',
        left: 36,
        bottom: 0,
        borderRadius: 8
    },
    friendsButton: {
        width: 'auto',
        paddingVertical: 16,
        paddingHorizontal: 16
    },
    leaderboardButtonContainer: {
        position: 'absolute',
        right: 36,
        bottom: 0,
        borderRadius: 8
    },
    leaderboardButton: {
        width: 'auto',
        paddingVertical: 16,
        paddingHorizontal: 16
    }
});

export default styles;
