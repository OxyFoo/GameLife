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
    buttonStyle: {
        paddingVertical: 4,
        paddingHorizontal: 8
    },
    content: {
        width: '100%',
        flexDirection: 'column',
        marginBottom: 8
    },
    contentHeader: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    contentDonut: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 8
    },
    contentStreak: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-end'
    },
    title: {
        fontSize: 16,
        textAlign: 'left'
    },
    headerStreak: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    streakText2: {
        marginRight: 12,
        fontSize: 16
    },
    progressText: {
        fontSize: 14,
        fontWeight: '700',
        textAlign: 'center',
        includeFontPadding: false,
        textAlignVertical: 'center',
        lineHeight: 16,
        letterSpacing: 0.3
    },
    progressInfo: {
        marginLeft: 12,
        flex: 1
    },
    streakText: {
        marginRight: 4,
        fontSize: 16
    },
    streakIcon: {
        marginRight: 0
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
