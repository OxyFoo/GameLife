import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
    // Base item
    item: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    content: {
        width: '100%',
        height: 'auto',
        paddingVertical: 10,
        paddingHorizontal: 12,

        alignItems: 'stretch',
        justifyContent: 'flex-start',
        flexDirection: 'column',

        borderRadius: 0
    },
    header: {
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
        textAlign: 'left'
    },
    headerStreak: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    streak: {
        height: 24,
        marginRight: 8,
        textAlign: 'left'
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
        flexDirection: 'row',
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
