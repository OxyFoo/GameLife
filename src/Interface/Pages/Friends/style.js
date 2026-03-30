import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    page: {
        width: '100%',
        height: '100%',
        paddingBottom: 96 // Avoid the bottom buttons to overlap the list
    },
    scrollview: {
        flexGrow: 1,
        paddingHorizontal: 24
    },
    title: {
        fontSize: 22,
        textAlign: 'left',
        textTransform: 'uppercase'
    },
    buttonRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginTop: 12
    },
    buttonAscending: {
        width: 'auto',
        paddingVertical: 12,
        paddingHorizontal: 12
    },
    buttonFilter: {
        width: 'auto',
        paddingVertical: 12,
        paddingHorizontal: 12
    },

    friendsList: {
        flexGrow: 0,
        marginTop: 12,
        marginBottom: 24
    },
    friend: {
        marginBottom: 6
    },

    addFriendButton: {
        position: 'absolute',
        width: 'auto',
        right: 36,
        bottom: 36,
        paddingVertical: 16,
        paddingHorizontal: 16
    }
});

export default styles;
