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
        marginTop: 12,
        marginBottom: 16,
        textAlign: 'left',
        fontSize: 18,
        textTransform: 'uppercase'
    },

    periodSelectorContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
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
        // flex: 1
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
        flexDirection: 'row',
        alignItems: 'center',
        height: 'auto',
        padding: 10,
        paddingHorizontal: 10,
        marginBottom: 4,
        borderRadius: 10
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

    xpContainer: {
        alignItems: 'flex-end',
        marginRight: 8
    },

    xpText: {
        fontSize: 14,
        fontWeight: 'bold'
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
    }
});

export default styles;
