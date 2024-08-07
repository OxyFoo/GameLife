import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    // Base item
    item: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderRadius: 8
    },
    content: {
        paddingVertical: 10,
        paddingHorizontal: 12
    },
    header: {
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 8
    },
    headerTitle: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    title: {
        height: 24,
        marginLeft: 8,
        fontSize: 16,
        textAlign: 'left'
    },
    headerStreak: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingLeft: 8
    },
    streakText2: {
        marginRight: 12,
        fontSize: 16
    },
    streakText: {
        marginRight: 4,
        fontSize: 16
    },
    streakIcon: {
        marginRight: 12
    },
    flatlistColumnWrapper: {
        flexDirection: 'row',
        justifyContent: 'space-between'
    },

    // Scrollable item
    itemScrollable: {
        width: '100%',
        height: 'auto',
        paddingVertical: 10,
        paddingHorizontal: 12,

        justifyContent: 'space-between',
        flexDirection: 'row'
    },
    scrollableHeader: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    scrollableTitle: {
        height: 24,
        marginLeft: 8,
        textAlign: 'left'
    },

    // Selection
    selection: {
        position: 'absolute',
        left: 0,
        right: 0,
        paddingVertical: 4,
        marginHorizontal: 12,
        paddingHorizontal: 16,
        borderRadius: 8,
        backgroundColor: '#00000080',
        zIndex: 10
    },
    selectionQuest: {
        marginTop: 0
    }
});

export default styles;
