import { StyleSheet, Dimensions } from 'react-native';

const SCREEN_HEIGHT = Dimensions.get('window').height;

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
        height: SCREEN_HEIGHT - 130,
        borderTopLeftRadius: 16,
        borderTopRightRadius: 16,

        zIndex: 100,
        elevation: 100
    },
    panel: {
        width: '100%',
        height: '90%',
        marginTop: 12,
        paddingBottom: 100,
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
        bottom: 100,
        height: 64,
        zIndex: 1
    },
    date: {
        marginVertical: 24,
        fontWeight: 'bold'
    }
});

export default styles;