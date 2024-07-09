import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    parent: {
        height: '100%',
        paddingTop: 24,
        paddingHorizontal: 24,
        paddingBottom: 12
    },

    headerButton: {
        marginTop: 24,
        paddingHorizontal: 18
    },
    headerButtonText: {
        flex: 1,
        fontSize: 16
    },
    headerStats: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        marginTop: 12,
        marginBottom: 6
    },

    title: {
        marginTop: 32,
        marginBottom: 18,
        fontSize: 24,
        fontWeight: 'bold'
    },
    separator: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    separatorBar: {
        flex: 1,
        height: 1,
        backgroundColor: '#ffffff'
    },
    separatorText: {
        marginHorizontal: 24,
        fontSize: 14
    },

    addNowButton: {
        marginBottom: 24
    },

    plannerButton: {
        paddingHorizontal: 24
    },
    plannerButtonText: {
        flex: 1,
        fontSize: 16,
        textAlign: 'left'
    },

    starttimeContent: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 24
    },
    starttimeButtonLeft: {
        flex: 1,
        marginRight: 6
    },
    starttimeButtonRight: {
        flex: 1,
        marginLeft: 6
    },
    starttimeButtonText: {
        flex: 1,
        fontSize: 16,
        textAlign: 'left'
    },

    commentInputText: {
        borderColor: 'red'
    },
    commentInputTextContainer: {
        marginTop: 24
    },

    addActivityButton: {
        marginTop: 24
    }
});

export default styles;
