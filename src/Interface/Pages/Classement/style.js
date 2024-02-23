import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({

    myCharacterContainer: {
        marginTop: 24
    },
    filter: {
        marginTop: 24,
        marginBottom: 0
    },
    rankingList: {
        marginTop: 24

    },


    itemContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10,
        marginBottom: 2,
        borderRadius: 10,
    },


    row: {
        marginBottom: 24,
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    inputSearch: {
        flex: 2,
        marginRight: 12
    },
    buttonSortType: {
        flex: 1,
        paddingHorizontal: 12
    },


    avatar: {
        width: 50,
        height: 50,
        borderRadius: 25, 
    },
    textContainer: {
        flex: 1,
        marginLeft: 10,
    },
    username: {
        fontWeight: 'bold',
        textAlign: 'left',
    },
    details: {
        textAlign: 'left',
    },


    rankContainer: {
        position: 'relative',
    },
    rankImage: {
        width: 60,
        height: 60,
    },
    rankText: { 
        // je suis pas sûr que la méthode de placement soit vraiment bien, surtout pour le responsive
        // UPDATE : C'est vraiment trop chiant mais je sais pas comment faire autrement
        fontSize: 30,
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: [
            { translateX: -7.5 },
            { translateY: -55 },
        ],
        color: 'purple',
        fontWeight: 'bold',
        textAlign: 'center',

        textShadowColor: '#FFFFFF',
        textShadowOffset: { width: 0, height: 0 }, 
        textShadowRadius: 3, 
    },

    
});

export default styles;
