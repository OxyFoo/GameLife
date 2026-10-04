import { StyleSheet } from 'react-native';

/** Sides of the slots; the connectors are drawn between the centres of the two catalysts */
const MAIN_SIZE = 128;
const CATALYST_SIZE = 96;
const CATALYSTS_GAP = 24;

const styles = StyleSheet.create({
    page: {
        flex: 1
    },
    scroll: {
        flex: 1
    },
    content: {
        paddingHorizontal: 24,
        paddingBottom: 120
    },

    // The slots
    forgeArea: {
        alignItems: 'center',
        marginTop: 8
    },
    caption: {
        marginTop: 8,
        marginBottom: 12
    },
    connectors: {
        width: CATALYST_SIZE + CATALYSTS_GAP,
        alignItems: 'center'
    },
    connectorVertical: {
        width: 1.5,
        height: 14
    },
    connectorHorizontal: {
        width: CATALYST_SIZE + CATALYSTS_GAP,
        height: 1.5
    },
    connectorBranches: {
        width: CATALYST_SIZE + CATALYSTS_GAP,
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    catalystsRow: {
        flexDirection: 'row',
        gap: CATALYSTS_GAP,
        marginBottom: 24
    },
    slotWrapper: {
        alignItems: 'center'
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
        maxWidth: '100%',
        textAlign: 'center'
    },
    slotLabel: {
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

    // Pinned like the edit button of the profile
    forgeButtonView: {
        position: 'absolute',
        left: 24,
        right: 24,
        bottom: 24
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

export { MAIN_SIZE, CATALYST_SIZE };
export default styles;
