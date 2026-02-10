import { StyleSheet, Dimensions } from 'react-native';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const CARD_WIDTH = SCREEN_WIDTH * 0.85;
const CARD_MAX_HEIGHT = SCREEN_HEIGHT * 0.75;

const styles = StyleSheet.create({
    // Absolute fill for background touch
    absoluteFill: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0
    },

    // Modal overlay
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.85)',
        justifyContent: 'center',
        alignItems: 'center'
    },

    // Top row for close button
    topRow: {
        width: CARD_WIDTH,
        flexDirection: 'row',
        justifyContent: 'flex-end'
    },
    closeButtonTop: {
        padding: 8
    },

    // Visible frame - ScrollView container with max height
    visibleFrame: {
        width: CARD_WIDTH,
        maxHeight: CARD_MAX_HEIGHT,
        flexGrow: 0,
        marginVertical: 12
    },

    // Visible card - same 9:16 ratio as hidden card
    visibleCard: {
        width: CARD_WIDTH,
        aspectRatio: 9 / 16,
        overflow: 'hidden'
    },

    // Empty state card
    emptyCard: {
        width: '80%',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 60,
        overflow: 'hidden',
        borderRadius: 16
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

    // Share buttons (outside captured area)
    buttonsContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
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
    }
});

export default styles;
