import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    // Stats Bar
    statsView: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingRight: 8,
        marginHorizontal: 24,
        marginBottom: 12
    },
    statsCount: {
        minWidth: 32,
        minHeight: 32,
        paddingHorizontal: 0,
        marginRight: 12,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 10
    },
    statsText: {
        paddingHorizontal: 4,
        fontWeight: 'bold'
    },

    // Stats Bar - Text Only
    toStatsView: {
        flex: 1
    },
    toStatsRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: '10%'
    },

    // Popup
    popupContent: {
        padding: 12
    },
    popupContentHeader: {
        position: 'absolute',
        top: 16,
        left: 0,
        right: 0,
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    popupButtonNavigation: {
        width: 'auto',
        paddingVertical: 8,
        paddingHorizontal: 8
    },
    popupContentStatPage: {
        marginTop: 6
    },
    popupContentStat: {
        marginVertical: 14
    }
});

export default styles;
