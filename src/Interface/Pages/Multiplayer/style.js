import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    // Page styles
    page: {
        flex: 1,
        width: '100%',
        height: '100%',
        paddingHorizontal: 24
    },

    header: {
        marginBottom: 12
    },

    sectionTitle: {
        textAlign: 'left',
        fontSize: 18,
        textTransform: 'uppercase'
    },

    periodSelectorContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 12,
        marginBottom: 16,
        gap: 8
    },

    periodButton: {
        flex: 1,
        paddingVertical: 10,
        paddingHorizontal: 16,
        borderRadius: 8,
        alignItems: 'center'
    },

    searchContainer: {
        marginBottom: 16
    },

    inputSearch: {
        flex: 1
    },

    loadingContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 48
    },

    flatlist: {
        flex: 1,
        marginHorizontal: -24
    },

    flatlistContent: {
        paddingHorizontal: 24,
        paddingBottom: 100
    },

    emptyContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 48
    },

    selfContainer: {
        marginTop: 16,
        paddingTop: 16,
        borderTopWidth: 1,
        borderTopColor: '#38406550'
    },

    // Element styles
    itemContainer: {
        marginVertical: 1,
        width: '100%',
        borderRadius: 10,
        borderWidth: 2,
        borderColor: 'transparent',
        paddingVertical: 0,
        paddingHorizontal: 0
    },

    itemGradient: {
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginHorizontal: 0,
        marginVertical: 0
    },

    innerGradient: {
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 4,
        paddingHorizontal: 8
    },

    frameBorder: {
        width: 48,
        height: 48,
        aspectRatio: 1,
        borderRadius: 4,
        borderWidth: 2,
        borderColor: '#00000050',
        overflow: 'hidden'
    },

    textContainer: {
        flex: 1,
        marginLeft: 12
    },

    username: {
        fontWeight: 'bold',
        textAlign: 'left'
    },

    details: {
        textAlign: 'left',
        fontSize: 12
    },

    rankContainer: {
        width: 48,
        height: 48,
        alignItems: 'center',
        justifyContent: 'center'
    },

    rankImage: {
        position: 'absolute',
        top: 0,
        left: 0,
        width: 46,
        height: 46
    },

    rankText: {
        marginBottom: 12,
        fontWeight: 'bold',
        textAlign: 'center',
        textShadowColor: '#FFFFFF',
        textShadowOffset: {
            width: 0,
            height: 0
        },
        textShadowRadius: 3
    },

    // button bottom screen
    friendsButtonContainer: {
        position: 'absolute',
        right: 36,
        bottom: 24,
        borderRadius: 8,
        overflow: 'hidden'
    },

    navButton: {
        width: 'auto',
        paddingVertical: 16,
        paddingHorizontal: 16
    },

    noInternetContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 24
    }
});

export default styles;
