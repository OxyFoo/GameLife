import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    // Title
    gradientInner: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',
        paddingVertical: 12
    },
    activityIcon: {
        marginRight: 16
    },
    textContainer: {
        flex: 1,
        alignItems: 'flex-start'
    },
    activityText: {
        fontSize: 24,
        fontWeight: 'bold'
    },
    categoryText: {
        fontSize: 14
    },
    startText: {
        fontSize: 16
    },
    durationText: {
        fontSize: 64,
        fontWeight: 'bold'
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
