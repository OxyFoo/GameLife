import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    friendTopContainer: {
        width: '100%',
        flexDirection: 'row'
    },
    friendTop: {
        flex: 1,
        width: 'auto',
        alignItems: 'center',
        justifyContent: 'flex-start',
        marginTop: 32,
        paddingVertical: 12,
        paddingHorizontal: 12

        // Debug
        // borderWidth: 1,
        // borderColor: 'white'
    },
    friendTopMiddle: {
        flex: 1.5,
        width: 'auto',
        paddingVertical: 0,
        paddingHorizontal: 0
    },
    friendTopMiddleButton: {
        width: 'auto',
        paddingVertical: 0,
        paddingHorizontal: 0
    },
    friendTopMiddleGradient: {
        flex: 1,
        paddingVertical: 18,
        paddingHorizontal: 12,
        alignItems: 'center',
        borderRadius: 8,
        overflow: 'hidden'
    },
    friendTopFrame: {
        width: '90%',
        aspectRatio: 1,
        borderWidth: 2,
        borderRadius: 8,
        overflow: 'hidden'
    },
    friendTopView: {
        //flex: 1,
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center'
    },
    friendTopPlaceholder: {
        width: '100%',
        height: '100%'
    },
    frientTopCrownContainer: {
        position: 'absolute',
        top: -16,
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
