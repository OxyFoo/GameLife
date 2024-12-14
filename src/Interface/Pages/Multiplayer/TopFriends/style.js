import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    friendTopContainer: {
        width: '100%',
        flexDirection: 'row'
    },
    friendTop: {
        flex: 1,
        alignItems: 'center',
        marginTop: 32,
        padding: 12

        // Debug
        // borderWidth: 1,
        // borderColor: 'white'
    },
    friendTopMiddle: {
        marginTop: 0,
        marginHorizontal: 12,
        paddingTop: 18,
        borderRadius: 8
    },
    friendTopFrame: {
        width: '90%',
        aspectRatio: 1,
        borderWidth: 2,
        borderRadius: 8,
        overflow: 'hidden'
    },
    friendTopPlaceholder: {
        width: '100%',
        height: '100%'
    },
    frientTopCrownContainer: {
        position: 'absolute',
        top: -32,
        left: 0,
        right: 0,
        alignItems: 'center'
    },
    frientTopRankContainer: {
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: -12,
        alignItems: 'center'
    },
    friendTopRank: {
        aspectRatio: 1,
        borderRadius: 6,
        transform: [{ rotateZ: '45deg' }]
    },
    friendTopRankText: {
        transform: [{ rotateZ: '-45deg' }],
        fontWeight: 'bold'
    },
    frientTopPseudo: {
        marginTop: 24
    }
});

export default styles;
