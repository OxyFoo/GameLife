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
    detailsFlatList: {
        marginBottom: 12,
        paddingHorizontal: 24
    },
    columnWrapper: {
        justifyContent: 'flex-start'
    },
    listContent: {
        padding: 10
    },
    details: {
        width: '50%',
        textAlign: 'left',
        marginBottom: 0
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
        maxWidth: '30%',
        paddingVertical: 12
    },
    shareUsername: {
        flexDirection: 'row',
        alignItems: 'center',
        marginLeft: 12,
        marginBottom: 16
    },
    shareUsernameText: {
        marginLeft: 12,
        fontSize: 14,
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
        minWidth: '40%',
        paddingVertical: 12
    }
});

export default styles;
