import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    page: {
        minHeight: '100%'
    },
    header: {
        paddingHorizontal: 24
    },
    editorAvatarHeader: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        elevation: 100,
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

    statsView: {
        alignSelf: 'flex-start',
        justifyContent: 'flex-start',
        marginLeft: 24,
        zIndex: 100,
        elevation: 100
    },
    statsFlatList: {
        flexGrow: 0
    },

    avatarContainer: {
        position: 'absolute',
        top: 100,
        zIndex: -100,
        elevation: -100
    },

    buttons: {
        marginTop: '30%',
        paddingHorizontal: 24,
        paddingBottom: 12
    },
    button: {
        marginBottom: 16
    }
});

export default styles;
