import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    // Title
    gradient: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 12,
        borderRadius: 8
    },
    activityIcon: {
        marginRight: 16
    },
    activityText: {
        fontSize: 24,
        fontWeight: 'bold'
    },
    startText: {
        fontSize: 16
    },
    durationText: {
        fontSize: 64,
        fontWeight: 'bold'
    },

    // Score
    scoreParent: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 16,
        padding: 16,
        borderRadius: 8
    },
    scoreTitle: {
        fontSize: 22,
        fontWeight: 'bold'
    },
    scoreCell: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        marginRight: 12,
        marginBottom: 12
    },
    scoreCellSquare: {
        padding: 16,
        borderRadius: 8
    },
    scoreCellText: {
        fontSize: 16,
        marginLeft: 12
    },

    // Friends
    friendsParent: {
        padding: 4,
        borderRadius: 10
    },
    friendsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'center'
    },
    friendsTitle: {
        marginBottom: 4
    }
});

export default styles;
