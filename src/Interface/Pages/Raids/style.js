import { StyleSheet } from 'react-native';

/**
 * Horizontal padding of the page content. Not in the style sheet: the page adds the safe-area
 * insets to it, since it draws to the physical edges (`feHeaderOverlay`).
 */
const CONTENT_PADDING = 24;

const styles = StyleSheet.create({
    page: {
        flex: 1,
        width: '100%',
        height: '100%'
    },
    scrollview: {
        flex: 1
    },
    scrollContent: {
        paddingBottom: 120
    },
    // Lets the middle of the season landscape breathe above the card
    card: {
        marginTop: 120
    },
    tabs: {
        marginTop: 20,
        marginBottom: 16
    },

    // Sections
    sectionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 8
    },
    sectionTitle: {
        fontSize: 16,
        textAlign: 'left',
        textTransform: 'uppercase'
    },
    centered: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 32,
        gap: 12
    },
    retryButton: {
        width: 'auto',
        paddingVertical: 10,
        paddingHorizontal: 20
    },
    list: {
        flexGrow: 0
    },

    // Friends section
    buttonRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginTop: 12
    },
    buttonFilter: {
        width: 'auto',
        paddingVertical: 12,
        paddingHorizontal: 12
    },
    buttonAscending: {
        width: 'auto',
        paddingVertical: 12,
        paddingHorizontal: 12
    },
    friendsTitle: {
        fontSize: 16,
        textAlign: 'left',
        textTransform: 'uppercase'
    },
    friendsList: {
        flexGrow: 0,
        marginTop: 8,
        marginBottom: 20
    },
    friend: {
        marginBottom: 6
    },
    // Same shape as the ascend button of the Skills page: a positioned wrapper, and the button
    // carries only its own size. `bottom` is measured from the navbar, which the page box already
    // stops at (feShowNavBar) — compensating for it here again pushed the button up the screen.
    addFriendView: {
        position: 'absolute',
        right: 24,
        bottom: 24
    },
    addFriendButton: {
        width: 'auto',
        paddingVertical: 16,
        paddingHorizontal: 16
    },

    // Feed section
    feedRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 8,
        gap: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#38406550'
    },
    feedFrame: {
        width: 42,
        height: 42,
        borderRadius: 6,
        borderWidth: 2,
        borderColor: '#00000050',
        overflow: 'hidden'
    },
    feedText: {
        flex: 1
    },
    feedTextLeft: {
        textAlign: 'left'
    },
    feedRight: {
        alignItems: 'center',
        justifyContent: 'center',
        minWidth: 32
    },

    // Offline
    noInternetContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 24
    },
    noInternetSubtext: {
        marginTop: 8
    }
});

export { CONTENT_PADDING };
export default styles;
