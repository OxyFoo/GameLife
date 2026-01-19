import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    topWorldContainer: {
        width: '100%',
        flexDirection: 'row'
    },
    avatarFrame: {
        flex: 1,
        aspectRatio: 1
    },
    avatarPlaceholder: {
        width: '100%',
        height: '100%',
        backgroundColor: '#FFFFFF10'
    },
    topWorld: {
        flex: 1,
        width: 'auto',
        alignItems: 'center',
        justifyContent: 'flex-start',
        marginTop: 32,
        paddingVertical: 12,
        paddingHorizontal: 12
    },
    topWorldMiddle: {
        flex: 1.5,
        width: 'auto',
        paddingVertical: 0,
        paddingHorizontal: 0
    },
    topWorldMiddleButton: {
        width: 'auto',
        paddingVertical: 0,
        paddingHorizontal: 0
    },
    topWorldMiddleGradient: {
        paddingVertical: 18,
        paddingHorizontal: 12
    },
    topWorldMiddleGradientContainer: {
        flex: 1,
        alignItems: 'center',
        borderRadius: 8,
        overflow: 'hidden'
    },
    topWorldFrame: {
        width: '90%',
        aspectRatio: 1,
        borderWidth: 2,
        borderRadius: 8,
        overflow: 'hidden'
    },
    topWorldView: {
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center'
    },
    topWorldCrownContainer: {
        position: 'absolute',
        top: -16,
        left: 0,
        right: 0,
        alignItems: 'center'
    },
    topWorldRankContainer: {
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: -12,
        alignItems: 'center'
    },
    topWorldRank: {
        aspectRatio: 1,
        borderRadius: 6,
        transform: [{ rotateZ: '45deg' }]
    },
    topWorldRankFirst: {
        overflow: 'hidden'
    },
    topWorldRankText: {
        transform: [{ rotateZ: '-45deg' }],
        fontWeight: 'bold'
    },
    topWorldPseudo: {
        marginTop: 24
    }
});

export default styles;
