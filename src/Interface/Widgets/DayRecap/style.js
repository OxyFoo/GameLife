import { StyleSheet, Dimensions } from 'react-native';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');
const CARD_MAX_HEIGHT = SCREEN_HEIGHT * 0.7;

const styles = StyleSheet.create({
    // Main container inside popup
    container: {
        alignItems: 'center',
        marginHorizontal: -16
    },

    // Loading state
    loadingContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 60
    },

    // Visible frame - ScrollView container with max height
    visibleFrame: {
        width: '100%',
        maxHeight: CARD_MAX_HEIGHT,
        flexGrow: 0,
        borderRadius: 16
    },

    // Visible card - same 9:16 ratio as hidden card
    visibleCard: {
        width: '100%',
        aspectRatio: 9 / 16,
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

    // Share buttons (below popup card)
    buttonsContainer: {
        position: 'absolute',
        bottom: -56,
        left: 0,
        right: 0,
        flexDirection: 'row',
        justifyContent: 'center',
        gap: 12
    },
    actionButton: {
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
