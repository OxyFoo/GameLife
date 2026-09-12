import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    card: {
        width: '100%',
        borderRadius: 16,
        overflow: 'hidden'
    },
    border: {
        borderWidth: 1.5,
        borderRadius: 16,
        padding: 12
    },

    // Header
    header: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        justifyContent: 'space-between',
        marginBottom: 10
    },
    name: {
        flex: 1,
        textAlign: 'left'
    },
    // Flush with the top of the card: the font carries a tall ascender space
    season: {
        lineHeight: 14,
        includeFontPadding: false,
        marginLeft: 8
    },

    // Stats
    row: {
        flexDirection: 'row',
        gap: 8,
        marginBottom: 8
    },
    flex1: {
        flex: 1
    },
    flex2: {
        flex: 2
    },
    stat: {
        borderRadius: 8,
        paddingVertical: 6,
        paddingHorizontal: 8
    },
    statLabel: {
        textAlign: 'left'
    },
    statValueRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4
    },
    statValue: {
        textAlign: 'left'
    },
    statInlineRow: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        justifyContent: 'space-between',
        gap: 6
    },
    statInlineValue: {
        textAlign: 'right'
    },
    statBar: {
        marginTop: 4
    },

    // Status
    statusRow: {
        borderRadius: 8,
        paddingVertical: 8,
        paddingHorizontal: 10,
        marginBottom: 8,
        backgroundColor: '#FFFFFF10'
    },
    statusHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6
    },
    statusDetail: {
        flex: 1,
        textAlign: 'right'
    },
    statusBar: {
        marginTop: 6
    },
    statusHealing: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8
    },
    statusHealingText: {
        flex: 1
    },
    healButtons: {
        flexDirection: 'row',
        gap: 6
    },
    healButton: {
        width: 'auto',
        paddingVertical: 8,
        paddingHorizontal: 8,
        borderRadius: 8
    },
    healButtonContent: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 4
    },

    // Rewards
    rewardsRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        borderRadius: 8,
        paddingVertical: 6,
        paddingHorizontal: 8,
        backgroundColor: '#00000040'
    },
    rewardsSlots: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    rewardsLocked: {
        opacity: 0.5
    },
    rewardsText: {
        flex: 1,
        textAlign: 'left'
    },

    // Other faces
    message: {
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        paddingVertical: 24
    },
    messageText: {
        textAlign: 'center'
    },
    skeleton: {
        opacity: 0.3
    },
    lockedOverlay: {
        ...StyleSheet.absoluteFillObject,
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        paddingHorizontal: 16
    },
    lockedText: {
        textAlign: 'center'
    },
    rest: {
        alignItems: 'center',
        gap: 4,
        paddingVertical: 12
    },
    restCountdown: {
        marginTop: 4
    },
    restText: {
        textAlign: 'center',
        marginTop: 8
    },
    restBoss: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6
    },
    restLast: {
        marginTop: 12
    },
    // The season rewards wait on the card until they are claimed
    restRewards: {
        alignItems: 'center',
        gap: 8,
        marginTop: 12
    },
    restRewardsSlots: {
        flexDirection: 'row',
        alignItems: 'center'
    }
});

export default styles;
