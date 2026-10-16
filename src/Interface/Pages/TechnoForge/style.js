import { StyleSheet } from 'react-native';

/** Sides of the slots; the connectors are drawn between the centres of the two catalysts */
const MAIN_SIZE = 128;
const CATALYST_SIZE = 96;
const CATALYSTS_GAP = 24;
/** Height of the vertical lines of the path (the branches under the bar, the stem above it) */
const CONNECTOR_HEIGHT = 14;

const styles = StyleSheet.create({
    // The content scrolls above the forge button, which keeps its own room under it
    page: {
        flex: 1
    },
    scroll: {
        flex: 1
    },
    content: {
        paddingHorizontal: 24,
        paddingBottom: 16
    },

    // The slots
    forgeArea: {
        alignItems: 'center',
        marginTop: 8
    },
    // The main slot keeps a margin under it: the crash scales it up and the failure drops it, over nothing
    mainSlot: {
        marginBottom: 12
    },
    caption: {
        marginTop: 4,
        marginBottom: 12,
        textAlign: 'center'
    },
    connectors: {
        alignItems: 'center'
    },
    catalystsRow: {
        flexDirection: 'row',
        gap: CATALYSTS_GAP,
        marginBottom: 24
    },
    slotWrapper: {
        alignItems: 'center'
    },
    // The liquid of a catalyst slot: clipped by the card, it rises from the bottom
    slotFill: {
        position: 'absolute',
        top: 0,
        left: 0,
        borderRadius: 20,
        overflow: 'hidden'
    },
    slotLiquid: {
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        bottom: 0
    },
    slotSurface: {
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        height: 2
    },
    // The glow of the charge and the flash of the new rarity: a border laid over the main slot
    slotGlow: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        borderWidth: 2.5,
        borderRadius: 20
    },
    // The step of the choreography, in the caption's box
    phaseText: {
        marginTop: 4,
        marginBottom: 12,
        textAlign: 'center'
    },
    slot: {
        width: 'auto',
        paddingVertical: 8,
        paddingHorizontal: 8,
        borderWidth: 1.5,
        borderRadius: 20
    },
    slotEmpty: {
        borderStyle: 'dashed'
    },
    // Fills the card: the content view of a Button is only as tall as its children
    slotContent: {
        flex: 1,
        width: '100%',
        flexDirection: 'column',
        flexWrap: 'nowrap',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 4
    },
    slotName: {
        width: '100%',
        textAlign: 'center',
        lineHeight: 14,
        includeFontPadding: false
    },
    slotLabel: {
        textAlign: 'center'
    },
    slotLabelBelow: {
        marginTop: 6,
        textAlign: 'center'
    },
    // The rarity step of the main slot, a pill over the top border
    transition: {
        position: 'absolute',
        top: -10,
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 8,
        zIndex: 1
    },
    rarityRow: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    rarityArrow: {
        marginHorizontal: 4
    },

    // The chance card: the dark translucent panel of the raid card
    card: {
        width: '100%',
        borderRadius: 16,
        overflow: 'hidden'
    },
    cardBorder: {
        borderWidth: 1.5,
        borderRadius: 16,
        paddingVertical: 12,
        paddingHorizontal: 16
    },
    // Flush with the top of the card: the font carries a tall ascender space (same cure as the raid card)
    chanceHeader: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        justifyContent: 'space-between'
    },
    chanceTitle: {
        flex: 1,
        textAlign: 'left',
        lineHeight: 20,
        includeFontPadding: false
    },
    chanceValueRow: {
        flexDirection: 'row',
        alignItems: 'flex-end',
        gap: 4
    },
    chanceValue: {
        lineHeight: 24,
        includeFontPadding: false
    },
    chanceMax: {
        lineHeight: 16,
        includeFontPadding: false
    },
    chanceBar: {
        marginTop: 10
    },
    chanceCaption: {
        marginTop: 8,
        textAlign: 'left'
    },

    // Bonus and cost, the status rows of the raid card
    rows: {
        marginTop: 16
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        borderRadius: 8,
        paddingVertical: 10,
        paddingHorizontal: 12,
        marginBottom: 8,
        backgroundColor: '#FFFFFF10'
    },
    rowLabel: {
        flex: 1,
        textAlign: 'left'
    },

    // Ox owned, under the header like the calendar: tap to open the shop
    oxRow: {
        flexDirection: 'row',
        marginBottom: 8
    },
    oxButton: {
        width: 'auto',
        flexShrink: 0,
        marginLeft: 'auto',
        paddingVertical: 6,
        paddingHorizontal: 0
    },

    // Under the scroll, never over the content: at the bottom of a tall screen, fixed on a short one
    forgeButtonView: {
        paddingHorizontal: 24,
        paddingTop: 8,
        paddingBottom: 24
    },

    noInternetContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 24
    },
    noInternetSubtext: {
        marginTop: 8
    }
});

export { MAIN_SIZE, CATALYST_SIZE, CATALYSTS_GAP, CONNECTOR_HEIGHT };
export default styles;
