import { StyleSheet, Dimensions } from 'react-native';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const CARD_WIDTH = Math.min(SCREEN_WIDTH * 0.9, 380);
const CARD_MAX_HEIGHT = SCREEN_HEIGHT * 0.8;
const CARD_PADDING = 20;

const styles = StyleSheet.create({
    // Modal overlay
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.85)',
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 40
    },

    // Top row for close button
    topRow: {
        width: CARD_WIDTH,
        flexDirection: 'row',
        justifyContent: 'flex-end',
        marginBottom: 12
    },
    closeButtonTop: {
        padding: 8
    },

    // Main card container (this is what gets captured)
    card: {
        width: CARD_WIDTH,
        maxHeight: CARD_MAX_HEIGHT,
        borderRadius: 20,
        padding: CARD_PADDING,
        overflow: 'hidden'
    },

    // Empty state card
    emptyCard: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 60
    },
    emptyTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginTop: 20,
        marginBottom: 8
    },
    emptyMessage: {
        fontSize: 14,
        textAlign: 'center',
        paddingHorizontal: 20
    },

    // Header section
    header: {
        alignItems: 'center',
        marginBottom: 16
    },
    title: {
        fontSize: 22,
        fontWeight: 'bold',
        marginBottom: 4
    },
    dateText: {
        fontSize: 14
    },

    // Level bar section
    levelContainer: {
        width: '100%',
        marginBottom: 8
    },
    levelRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 6
    },
    levelText: {
        fontSize: 14
    },
    xpText: {
        fontSize: 14,
        fontWeight: '600'
    },
    progressBar: {
        borderRadius: 4
    },

    // Donut + Activities section
    mainContent: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 16
    },
    donutContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
    donutCenter: {
        position: 'absolute',
        alignItems: 'center',
        justifyContent: 'center'
    },
    donutCenterText: {
        fontSize: 24,
        fontWeight: 'bold'
    },
    activitiesList: {
        flex: 1,
        paddingLeft: 8,
        overflow: 'hidden'
    },
    activityItem: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        marginBottom: 6
    },
    activityName: {
        flex: 1,
        fontSize: 16,
        textAlign: 'left'
    },
    activityDuration: {
        flexShrink: 0,
        fontSize: 16,
        textAlign: 'left'
    },

    // Separator
    separator: {
        height: 1,
        marginVertical: 16
    },

    // Stats section
    statsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    statsBars: {
        flex: 1
    },
    statBarRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 6
    },
    statBadge: {
        paddingHorizontal: 8,
        paddingVertical: 3,
        borderRadius: 6,
        marginRight: 8,
        minWidth: 42,
        alignItems: 'center',
        justifyContent: 'center'
    },
    statBadgeText: {
        fontSize: 12,
        fontWeight: 'bold',
        textAlign: 'center'
    },
    statLabel: {
        fontSize: 14
    },
    radarContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },

    // Footer with logo
    footer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 24
    },
    footerLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6
    },
    footerLogo: {
        width: 20,
        height: 20,
        resizeMode: 'contain'
    },
    footerRight: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8
    },
    logoText: {
        fontSize: 14,
        fontWeight: 'bold',
        letterSpacing: 1
    },

    // Share buttons (outside captured area)
    buttonsContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 20,
        gap: 12
    },
    shareButton: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 12,
        borderRadius: 12,
        gap: 8
    },
    saveButton: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 12,
        borderRadius: 12,
        gap: 8
    },
    buttonText: {
        fontSize: 14,
        fontWeight: 'bold'
    },
    closeButtonInline: {
        alignItems: 'center',
        justifyContent: 'center',
        width: 44,
        height: 44,
        borderRadius: 12
    }
});

export { CARD_WIDTH, CARD_PADDING };
export default styles;
