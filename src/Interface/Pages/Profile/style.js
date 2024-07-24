import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    page: {
        minHeight: '100%'
    },
    header: {
        paddingHorizontal: 24
    },
    pageHeader: {
        marginBottom: 12
    },

    xpView: {
        marginBottom: 48
    },
    xpRow: {
        flexDirection: 'row',
        justifyContent: 'space-between'
    },

    avatarView: {
        position: 'absolute',
        width: '75%',
        top: 0,
        right: 0,
        bottom: 0
    },
    avatarPlaceholder: {
        resizeMode: 'contain'
    },
    avatarComingSoon: {
        flex: 1,
        flexWrap: 'wrap',
        position: 'absolute',
        textAlign: 'center',
        top: 180,
        right: 0,
        width: '75%'
    },
    avatarComingSoonText: {
        width: '100%',
        fontSize: 24,
        textShadowRadius: 10,
        textShadowOffset: { width: 0, height: 0 }
    },

    buttons: {
        marginTop: '40%',
        paddingHorizontal: 24,
        paddingBottom: 12
    },
    button: {
        marginBottom: 16
    }
});

export default styles;
