import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    list: {
        alignItems: 'flex-start'
    },
    compact: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        gap: 4
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 4
    },
    rowCompact: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    badge: {
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 5,
        marginRight: 6,
        minWidth: 44,
        alignItems: 'center',
        justifyContent: 'center'
    },
    badgeCompact: {
        paddingHorizontal: 4,
        marginRight: 3,
        minWidth: 0
    },
    label: {
        textAlign: 'left'
    },

    // The one-line ticker of the forge slots
    ticker: {
        height: 18,
        overflow: 'hidden',
        justifyContent: 'center'
    },
    tickerMask: {
        flex: 1
    },
    tickerContent: {
        flexDirection: 'row',
        alignItems: 'center',
        alignSelf: 'center'
    },
    // Scrolling: the line starts at the left edge and runs to the left
    tickerScrolling: {
        alignSelf: 'flex-start'
    },
    tickerLine: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4
    }
});

export default styles;
