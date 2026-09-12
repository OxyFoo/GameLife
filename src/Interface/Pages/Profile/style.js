import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    page: {
        flex: 1
    },
    scrollView: {
        flex: 1
    },
    // Fills the screen so the avatar has its room, and keeps the last stat clear of the pinned button
    scrollContent: {
        flexGrow: 1,
        paddingBottom: 96
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

    editButtonView: {
        position: 'absolute',
        left: 24,
        right: 24,
        bottom: 24
    }
});

export default styles;
