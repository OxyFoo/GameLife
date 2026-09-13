import { StyleSheet } from 'react-native';

/**
 * Horizontal padding of the page content. Not in the style sheet: the page adds the safe-area
 * insets to it, since it draws to the physical edges (`feHeaderOverlay`).
 */
const CONTENT_PADDING = 24;

const styles = StyleSheet.create({
    page: {
        flex: 1
    },
    scrollview: {
        flex: 1
    },
    content: {
        paddingBottom: 48
    },
    tabs: {
        marginTop: 20,
        marginBottom: 16
    },

    sectionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 8
    },
    sectionTitle: {
        fontSize: 16,
        textAlign: 'left',
        textTransform: 'uppercase'
    },
    badge: {
        paddingVertical: 2,
        paddingHorizontal: 8,
        borderRadius: 10
    },
    centered: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 32,
        gap: 12
    },
    retryButton: {
        width: 'auto',
        paddingVertical: 10,
        paddingHorizontal: 20
    },

    // Activities
    activityRow: {
        width: '100%',
        paddingVertical: 0,
        paddingHorizontal: 0,
        marginBottom: 6,
        borderRadius: 10,
        backgroundColor: '#38406540'
    },
    activityContent: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        paddingVertical: 8,
        paddingHorizontal: 10
    },
    activityIcon: {
        width: 28,
        height: 28,
        borderRadius: 6,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#00000040'
    },
    activityText: {
        flex: 1,
        textAlign: 'left'
    },
    activityPoints: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4
    },

    // History
    historyRow: {
        width: '100%',
        paddingVertical: 0,
        paddingHorizontal: 0,
        marginBottom: 10,
        borderRadius: 12,
        backgroundColor: '#38406540'
    },
    historyContent: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        padding: 12
    },
    historyRight: {
        alignItems: 'center',
        gap: 6
    },
    historyImage: {
        width: 56,
        height: 56,
        borderRadius: 8
    },
    historyText: {
        flex: 1,
        gap: 2
    },
    historyLeft: {
        textAlign: 'left'
    }
});

export { CONTENT_PADDING };
export default styles;
