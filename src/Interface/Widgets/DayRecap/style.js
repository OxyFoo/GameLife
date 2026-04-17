import { StyleSheet, Dimensions } from 'react-native';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');
const CARD_MAX_HEIGHT = SCREEN_HEIGHT * 0.55;

const styles = StyleSheet.create({
    // Main container inside popup
    container: {
        alignItems: 'center',
        paddingVertical: 16
    },

    // Loading state
    loadingContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 60
    },

    // Template buttons row
    templateButtons: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginBottom: 8
    },
    templateButton: {
        width: 28,
        height: 28,
        borderRadius: 14,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.15)'
    },
    templateButtonText: {
        fontSize: 13,
        fontWeight: 'bold'
    },

    // Visible frame - ScrollView container with max height
    visibleFrame: {
        width: '100%',
        maxHeight: CARD_MAX_HEIGHT,
        flexGrow: 0,
        marginVertical: 12
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

    // Share buttons (outside captured area)
    buttonsContainer: {
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
