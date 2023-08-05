import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    page: {
        padding: 0
    },
    row: {
        width: '100%',
        marginTop: 12,
        paddingHorizontal: '5%',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    weekRow: {
        flex: 1,
        marginBottom: 0
    },
    title: {
        fontWeight: 'bold'
    },
    months: {
        height: '80%'
    },

    mainContent: {
        position: 'absolute',
        top: 130,
        width: '100%',
        borderTopLeftRadius: 16,
        borderTopRightRadius: 16,

        zIndex: 100,
        elevation: 100
    },
    panel: {
        flex: 1,
        marginTop: 12,
        marginBottom: -48,          // Hide empty space during animation
        paddingBottom: 64 + 48,     // Stop before bottomBar
        borderTopLeftRadius: 16,
        borderTopRightRadius: 16
    },
    panelCard: {
        marginHorizontal: 32
    },
    fadeBottom: {
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 64 + 48,
        height: 64,
        zIndex: 1
    },
    date: {
        marginVertical: 24,
        fontWeight: 'bold'
    }
});

export default styles;