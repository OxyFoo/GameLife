import { StyleSheet, Dimensions } from 'react-native';

const SCREEN_HEIGHT = Dimensions.get('window').height;

const styles = StyleSheet.create({
    // Index styles
    header: {
        marginBottom: 12
    },
    row: {
        marginBottom: 24,
        flexDirection: 'row',
        justifyContent: 'space-between'
    },

    myRankContainer: {
        marginTop: 24
    },
    filter: {
        marginTop: 24,
        marginBottom: 0
    },
    inputSearch: {
        flex: 2,
        marginRight: 12
    },
    buttonSortType: {
        flex: 1,
        paddingHorizontal: 12
    },

    flatlist: {
        height: SCREEN_HEIGHT - 350
    },

    // Element styles
    itemContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        height: 'auto',
        padding: 10,
        paddingHorizontal: 10,
        marginBottom: 2,
        borderRadius: 10
    },
    avatar: {
        width: 50,
        height: 50,
        borderRadius: 25
    },
    frame: {
        paddingVertical: 0,
        paddingHorizontal: 0
    },
    frameBorder: {
        width: 48,
        height: 48,
        aspectRatio: 1,
        borderRadius: 4,
        borderWidth: 2,
        borderColor: '#00000050'
    },
    textContainer: {
        flex: 1,
        marginLeft: 10
    },
    username: {
        fontWeight: 'bold',
        textAlign: 'left'
    },
    details: {
        textAlign: 'left'
    },

    rankContainer: {
        width: 56,
        height: 56,
        alignItems: 'center',
        justifyContent: 'center'
    },
    rankImage: {
        position: 'absolute',
        margin: 1,
        top: 0,
        left: 0,
        width: 54,
        height: 54
    },
    rankText: {
        marginBottom: 14,
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
